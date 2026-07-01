"use server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import {
  ChatChannelMemberRole,
  ChatChannelType,
  ChatMessageType
} from "@prisma/client";
import { requireUser, getCurrentUser } from "@/lib/auth";
import {
  accessibleChatChannelWhere,
  assertCanAccessChatChannel,
  canManageChatChannels,
  chatChannelTypeLabel,
  defaultMemberRoleForCreator,
  getAccessibleChatChannels,
  getOrCreateAdminRequestsChannel,
  isAdminRequestRole,
  markChatChannelRead
} from "@/lib/chat";
import { db } from "@/lib/db";

export type ChatActionResult = {
  ok: boolean;
  message: string;
};

export type ChatSnapshot = {
  channels: Array<{
    id: string;
    name: string;
    description: string | null;
    channelType: string;
    channelTypeLabel: string;
    unreadCount: number;
    photoUrl: string | null;
    latestMessage: {
      body: string;
      createdAt: string;
      senderName: string;
    } | null;
  }>;
  selectedChannelId: string | null;
  totalUnread: number;
  messages: Array<{
    id: string;
    channelId: string;
    isOwnMessage: boolean;
    senderName: string;
    senderPhotoUrl: string | null;
    messageType: string;
    body: string;
    metadata: unknown;
    isUnsent: boolean;
    attachments: Array<{
      id: string;
      fileName: string;
      fileUrl: string;
      mimeType: string;
      fileSize: number;
    }>;
    createdAt: string;
    edited: boolean;
    reactions: Array<{
      id: string;
      userId: string;
      userName: string;
      emoji: string | null;
      customEmojiId: string | null;
      customEmojiUrl: string | null;
      customEmojiName: string | null;
    }>;
    replyTo: {
      id: string;
      senderName: string;
      body: string;
      isUnsent: boolean;
    } | null;
  }>;
  customEmojis: Array<{
    id: string;
    name: string;
    imageUrl: string;
  }>;
  currentUserId: string;
  currentUserRole: string;
};

const manageableChannelTypes: ChatChannelType[] = [
  ChatChannelType.GENERAL,
  ChatChannelType.PRIVATE,
  ChatChannelType.SYSTEM
];

async function getUnreadCount(channelId: string, userId: string) {
  return db.chatMessage.count({
    where: {
      channelId,
      deletedAt: null,
      NOT: {
        senderUserId: userId
      },
      reads: {
        none: {
          userId
        }
      }
    }
  });
}

const allowedAttachmentTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/gif", "gif"],
  ["image/webp", "webp"],
  ["application/pdf", "pdf"],
  ["application/msword", "doc"],
  ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx"],
  ["application/vnd.ms-excel", "xls"],
  ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "xlsx"],
  ["application/vnd.ms-powerpoint", "ppt"],
  ["application/vnd.openxmlformats-officedocument.presentationml.presentation", "pptx"],
  ["text/plain", "txt"],
  ["video/mp4", "mp4"],
  ["video/webm", "webm"],
  ["audio/mpeg", "mp3"],
  ["audio/wav", "wav"],
  ["application/zip", "zip"],
  ["application/x-zip-compressed", "zip"]
]);
const maxAttachmentBytes = 100 * 1024 * 1024;

async function saveChatAttachmentFile(file: File | null) {
  if (!file || file.size === 0) {
    return null;
  }

  if (!allowedAttachmentTypes.has(file.type)) {
    throw new Error("Unsupported file type. You can attach images, GIFs, PDFs, Office documents, videos, audio, or ZIP files.");
  }

  if (file.size > maxAttachmentBytes) {
    throw new Error("Attached files must be 100 MB or smaller.");
  }

  const safeBaseName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const fileName = `${Date.now()}-${safeBaseName}`;
  const uploadDir = path.join(process.cwd(), "public/uploads/chat");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()));

  return {
    fileName: file.name,
    fileUrl: `/uploads/chat/${fileName}`,
    mimeType: file.type,
    fileSize: file.size
  };
}

async function saveChannelPhotoFile(file: File | null) {
  if (!file || file.size === 0) {
    return null;
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files can be uploaded as profile pictures.");
  }
  if (file.size > maxAttachmentBytes) {
    throw new Error("Profile picture must be 10 MB or smaller.");
  }
  const safeBaseName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const fileName = `${Date.now()}-${safeBaseName}`;
  const uploadDir = path.join(process.cwd(), "public/uploads/channel");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()));
  return `/uploads/channel/${fileName}`;
}

export async function getChatSnapshotAction(selectedChannelId?: string | null, searchQuery?: string | null): Promise<ChatSnapshot> {
  const user = await getCurrentUser();
  
  if (!user) {
    return {
      channels: [],
      selectedChannelId: null,
      totalUnread: 0,
      messages: [],
      customEmojis: [],
      currentUserId: "",
      currentUserRole: "VIEWER"
    };
  }

  const search = searchQuery?.trim();

  if (isAdminRequestRole(user.role)) {
    await getOrCreateAdminRequestsChannel();
  }

  const channels = await getAccessibleChatChannels(user);
  const selectedChannel = selectedChannelId && channels.some((channel) => channel.id === selectedChannelId)
    ? selectedChannelId
    : channels[0]?.id ?? null;

  const channelsWithUnread = await Promise.all(
    channels.map(async (channel) => {
      let displayName = channel.name;
      let dmPhotoUrl: string | null = null;
      if (channel.name.startsWith("DM_")) {
        const otherMember = await db.chatChannelMember.findFirst({
          where: { channelId: channel.id, userId: { not: user.id } },
          include: { user: { include: { personnel: { select: { photoUrl: true } } } } }
        });
        if (otherMember?.user) {
          displayName = `DM: ${otherMember.user.name}`;
          dmPhotoUrl = otherMember.user.photoUrl ?? otherMember.user.personnel?.photoUrl ?? null;
        }
      } else if (channel.name.startsWith("DM: ")) {
        // If it's the new format, try to extract just the other user's name
        const names = channel.name.replace("DM: ", "").split(" & ");
        const otherName = names.find(n => n !== user.name);
        if (otherName) {
          displayName = `DM: ${otherName}`;
          const otherUser = await db.user.findFirst({
            where: { name: otherName, isActive: true },
            include: { personnel: { select: { photoUrl: true } } }
          });
          if (otherUser) {
            dmPhotoUrl = otherUser.photoUrl ?? otherUser.personnel?.photoUrl ?? null;
          }
        }
      }
      const latestMsg = await db.chatMessage.findFirst({
        where: { channelId: channel.id, deletedAt: null },
        orderBy: { createdAt: "desc" },
        select: {
          body: true,
          createdAt: true,
          sender: {
            select: {
              name: true
            }
          }
        }
      });
      return {
        id: channel.id,
        name: displayName,
        description: channel.description,
        channelType: channel.channelType,
        channelTypeLabel: chatChannelTypeLabel(channel.channelType),
        unreadCount: await getUnreadCount(channel.id, user.id),
        photoUrl: dmPhotoUrl ?? channel.photoUrl,
        latestMessage: latestMsg ? {
          body: latestMsg.body,
          createdAt: latestMsg.createdAt.toISOString(),
          senderName: latestMsg.sender?.name ?? "System"
        } : null
      };
    })
  );
  const channelsWithUnreadMap = new Map();
  for (const channel of channelsWithUnread) {
    if (channel.name.startsWith("DM: ")) {
      const existing = channelsWithUnreadMap.get(channel.name);
      if (existing) {
        if (!existing.latestMessage && channel.latestMessage) {
          channelsWithUnreadMap.set(channel.name, channel);
        } else if (existing.latestMessage && channel.latestMessage) {
          if (new Date(channel.latestMessage.createdAt).getTime() > new Date(existing.latestMessage.createdAt).getTime()) {
            channelsWithUnreadMap.set(channel.name, channel);
          }
        }
      } else {
        channelsWithUnreadMap.set(channel.name, channel);
      }
    } else {
      channelsWithUnreadMap.set(channel.id, channel);
    }
  }

  const uniqueChannelsWithUnread = Array.from(channelsWithUnreadMap.values());
  uniqueChannelsWithUnread.sort((first, second) => {
    if (first.channelType === "ADMIN_REQUESTS" && second.channelType !== "ADMIN_REQUESTS") {
      return -1;
    }
    if (second.channelType === "ADMIN_REQUESTS" && first.channelType !== "ADMIN_REQUESTS") {
      return 1;
    }
    return first.name.localeCompare(second.name);
  });

  const messages = selectedChannel
    ? await db.chatMessage.findMany({
        where: {
          channelId: selectedChannel,
          ...(search
            ? {
                deletedAt: null,
                OR: [
                  { body: { contains: search, mode: "insensitive" } },
                  { sender: { name: { contains: search, mode: "insensitive" } } },
                  { attachments: { some: { fileName: { contains: search, mode: "insensitive" } } } }
                ]
              }
            : {})
        },
        include: {
          attachments: true,
          reactions: {
            include: {
              user: { select: { id: true, name: true } },
              customEmoji: true
            }
          },
          sender: {
            select: {
              name: true,
              photoUrl: true,
              personnel: {
                select: {
                  photoUrl: true
                }
              }
            }
          },
          replyTo: {
            select: {
              id: true,
              body: true,
              deletedAt: true,
              sender: { select: { name: true } }
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 50
      })
    : [];

  const customEmojis = await db.customEmoji.findMany({
    orderBy: { createdAt: "desc" }
  });

  return {
    channels: uniqueChannelsWithUnread,
    selectedChannelId: selectedChannel,
    totalUnread: uniqueChannelsWithUnread.reduce((sum, channel) => sum + channel.unreadCount, 0),
    messages: messages
      .reverse()
      .map((message) => ({
        id: message.id,
        channelId: message.channelId,
        isOwnMessage: message.senderUserId === user.id,
        senderName: message.sender?.name ?? "System",
        senderPhotoUrl: message.sender?.photoUrl ?? message.sender?.personnel?.photoUrl ?? null,
        messageType: message.messageType,
        body: message.deletedAt ? "" : message.body,
        isUnsent: message.deletedAt !== null,
        metadata: message.deletedAt ? null : message.metadataJson,
        attachments: message.deletedAt ? [] : message.attachments.map((att) => ({
          id: att.id,
          fileName: att.fileName,
          fileUrl: att.fileUrl,
          mimeType: att.mimeType,
          fileSize: att.fileSize
        })),
        createdAt: message.createdAt.toISOString(),
        edited: message.updatedAt > message.createdAt,
        reactions: (message as unknown as { reactions: Array<{ id: string; userId: string; user: { name: string }; emoji: string | null; customEmojiId: string | null; customEmoji: { imageUrl: string; name: string } | null }> }).reactions?.map((r) => ({
          id: r.id,
          userId: r.userId,
          userName: r.user.name,
          emoji: r.emoji,
          customEmojiId: r.customEmojiId,
          customEmojiUrl: r.customEmoji?.imageUrl ?? null,
          customEmojiName: r.customEmoji?.name ?? null
        })) ?? [],
        replyTo: (message as unknown as { replyTo: { id: string; body: string; deletedAt: Date | null; sender: { name: string } | null } | null }).replyTo ? {
          id: (message as unknown as { replyTo: { id: string; body: string; deletedAt: Date | null; sender: { name: string } | null } | null }).replyTo!.id,
          senderName: (message as unknown as { replyTo: { id: string; body: string; deletedAt: Date | null; sender: { name: string } | null } | null }).replyTo!.sender?.name ?? "System",
          body: (message as unknown as { replyTo: { id: string; body: string; deletedAt: Date | null; sender: { name: string } | null } | null }).replyTo!.deletedAt ? "" : (message as unknown as { replyTo: { id: string; body: string; deletedAt: Date | null; sender: { name: string } | null } | null }).replyTo!.body,
          isUnsent: (message as unknown as { replyTo: { id: string; body: string; deletedAt: Date | null; sender: { name: string } | null } | null }).replyTo!.deletedAt !== null
        } : null
      })),
    customEmojis: customEmojis.map(ce => ({
      id: ce.id,
      name: ce.name,
      imageUrl: ce.imageUrl
    })),
    currentUserId: user.id,
    currentUserRole: user.role
  };
}

export async function markChatChannelReadAction(channelId: string) {
  const user = await requireUser();
  await markChatChannelRead(channelId, user);
}

export async function sendChatMessageAction(formData: FormData): Promise<ChatActionResult> {
  const user = await requireUser();
  const channelId = String(formData.get("channelId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  const attachmentFile = formData.get("attachment") as File | null;
  const replyToId = formData.get("replyToId") ? String(formData.get("replyToId")) : null;

  if (!channelId) {
    return { ok: false, message: "Choose a chat channel." };
  }

  if (body.length < 1 && (!attachmentFile || attachmentFile.size === 0)) {
    return { ok: false, message: "Type a message or attach a file before sending." };
  }

  if (body.length > 2000) {
    return { ok: false, message: "Messages must be 2,000 characters or less." };
  }

  await assertCanAccessChatChannel(channelId, user);
  let attachment;
  try {
    attachment = await saveChatAttachmentFile(attachmentFile);
  } catch (caughtError) {
    return {
      ok: false,
      message: caughtError instanceof Error ? caughtError.message : "The attachment could not be saved."
    };
  }

  const message = await db.chatMessage.create({
    data: {
      channelId,
      senderUserId: user.id,
      messageType: ChatMessageType.USER_MESSAGE,
      body: body || (attachment && !attachment.mimeType.startsWith('image/') ? `Attached ${attachment.fileName}` : ""),
      replyToId,
      ...(attachment
        ? {
            attachments: {
              create: attachment
            }
          }
        : {})
    }
  });

  await Promise.all([
    db.chatChannel.update({
      where: { id: channelId },
      data: { updatedAt: new Date() }
    }),
    db.chatMessageRead.create({
      data: {
        messageId: message.id,
        userId: user.id
      }
    })
  ]);

  return { ok: true, message: "Message sent." };
}

export async function createChatChannelAction(_previousState: ChatActionResult, formData: FormData): Promise<ChatActionResult> {
  const user = await requireUser();
  if (!canManageChatChannels(user)) {
    return { ok: false, message: "Only Super Admin can create chat channels." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const channelTypeValue = String(formData.get("channelType") ?? "GENERAL") as ChatChannelType;
  const photoFile = formData.get("photo") as File | null;

  if (!name || name.length < 2) {
    return { ok: false, message: "Channel name is required." };
  }

  if (!manageableChannelTypes.includes(channelTypeValue)) {
    return { ok: false, message: "Choose a valid channel type." };
  }

  let photoUrl = null;
  if (photoFile && photoFile.size > 0) {
    try {
      photoUrl = await saveChannelPhotoFile(photoFile);
    } catch (err) {
      return { ok: false, message: err instanceof Error ? err.message : "Failed to upload photo." };
    }
  }

  const channel = await db.chatChannel.create({
    data: {
      name,
      description: description || null,
      channelType: channelTypeValue,
      photoUrl,
      createdById: user.id,
      members: {
        create: {
          userId: user.id,
          role: defaultMemberRoleForCreator()
        }
      }
    }
  });

  revalidatePath("/settings/chat");
  return { ok: true, message: `${channel.name} channel created.` };
}

export async function updateChatChannelAction(_previousState: ChatActionResult, formData: FormData): Promise<ChatActionResult> {
  const user = await requireUser();
  if (!canManageChatChannels(user)) {
    return { ok: false, message: "Only Super Admin can manage chat channels." };
  }

  const channelId = String(formData.get("channelId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const channelTypeValue = String(formData.get("channelType") ?? "GENERAL") as ChatChannelType;
  const photoFile = formData.get("photo") as File | null;

  const channel = await db.chatChannel.findUnique({ where: { id: channelId } });
  if (!channel) {
    return { ok: false, message: "Chat channel could not be found." };
  }

  if (channel.channelType === ChatChannelType.ADMIN_REQUESTS) {
    await db.chatChannel.update({
      where: { id: channel.id },
      data: {
        description: description || channel.description,
        isActive: true
      }
    });
    revalidatePath("/settings/chat");
    return { ok: true, message: "Admin request channel updated." };
  }

  if (!name || name.length < 2) {
    return { ok: false, message: "Channel name is required." };
  }

  if (!manageableChannelTypes.includes(channelTypeValue)) {
    return { ok: false, message: "Choose a valid channel type." };
  }

  let photoUrl = channel.photoUrl;
  if (photoFile && photoFile.size > 0) {
    try {
      photoUrl = await saveChannelPhotoFile(photoFile);
    } catch (err) {
      return { ok: false, message: err instanceof Error ? err.message : "Failed to upload photo." };
    }
  }

  await db.chatChannel.update({
    where: { id: channel.id },
    data: {
      name,
      description: description || null,
      channelType: channelTypeValue,
      photoUrl
    }
  });

  revalidatePath("/settings/chat");
  return { ok: true, message: "Chat channel updated." };
}

export async function archiveChatChannelAction(channelId: string): Promise<void> {
  const user = await requireUser();
  if (!canManageChatChannels(user)) {
    throw new Error("Only Super Admin can archive chat channels.");
  }

  const channel = await db.chatChannel.findUnique({ where: { id: channelId } });
  if (!channel) {
    throw new Error("Chat channel could not be found.");
  }

  if (channel.channelType === ChatChannelType.ADMIN_REQUESTS) {
    throw new Error("The protected admin request channel cannot be archived.");
  }

  await db.chatChannel.update({
    where: { id: channel.id },
    data: { isActive: false }
  });

  revalidatePath("/settings/chat");
}

export async function saveChatChannelMembersAction(_previousState: ChatActionResult, formData: FormData): Promise<ChatActionResult> {
  const user = await requireUser();
  if (!canManageChatChannels(user)) {
    return { ok: false, message: "Only Super Admin can manage channel members." };
  }

  const channelId = String(formData.get("channelId") ?? "");
  const userIds = formData.getAll("userIds").map(String).filter(Boolean);
  const channel = await db.chatChannel.findUnique({
    where: { id: channelId },
    include: {
      members: true
    }
  });

  if (!channel) {
    return { ok: false, message: "Chat channel could not be found." };
  }

  if (channel.channelType === ChatChannelType.ADMIN_REQUESTS) {
    return { ok: false, message: "Admin request channel access is controlled by Admin and Super Admin roles." };
  }

  const realUsers = await db.user.findMany({
    where: {
      id: { in: userIds },
      isActive: true
    },
    select: {
      id: true
    }
  });
  const realUserIds = new Set(realUsers.map((item) => item.id));
  const requestedUserIds = Array.from(new Set(userIds)).filter((id) => realUserIds.has(id));

  await db.$transaction([
    db.chatChannelMember.updateMany({
      where: {
        channelId: channel.id,
        userId: { notIn: requestedUserIds }
      },
      data: {
        isActive: false
      }
    }),
    ...requestedUserIds.map((memberUserId) =>
      db.chatChannelMember.upsert({
        where: {
          channelId_userId: {
            channelId: channel.id,
            userId: memberUserId
          }
        },
        update: {
          isActive: true
        },
        create: {
          channelId: channel.id,
          userId: memberUserId,
          role: memberUserId === user.id ? ChatChannelMemberRole.OWNER : ChatChannelMemberRole.MEMBER
        }
      })
    )
  ]);

  revalidatePath("/settings/chat");
  return { ok: true, message: "Channel members saved." };
}

export async function listManageableChatChannels() {
  const user = await requireUser();
  if (!canManageChatChannels(user)) {
    throw new Error("Only Super Admin can manage chat channels.");
  }

  await getOrCreateAdminRequestsChannel();

  return db.chatChannel.findMany({
    where: {
      OR: [
        { isActive: true },
        { channelType: ChatChannelType.ADMIN_REQUESTS }
      ]
    },
    include: {
      members: {
        where: { isActive: true },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              isActive: true
            }
          }
        }
      }
    },
    orderBy: [
      { channelType: "asc" },
      { name: "asc" }
    ]
  });
}

export async function listChatEligibleUsers() {
  const user = await requireUser();
  if (!canManageChatChannels(user)) {
    throw new Error("Only Super Admin can manage chat channels.");
  }

  return db.user.findMany({
    where: {
      isActive: true
    },
    orderBy: {
      name: "asc"
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  });
}

export async function getUserCanManageChat() {
  const user = await requireUser();
  return canManageChatChannels(user);
}

export async function userCanAccessChannel(channelId: string) {
  const user = await requireUser();
  const count = await db.chatChannel.count({
    where: {
      id: channelId,
      ...accessibleChatChannelWhere(user)
    }
  });
  return count > 0;
}

export async function unsendChatMessageAction(messageId: string, hardDelete: boolean = false): Promise<ChatActionResult> {
  const user = await requireUser();
  const message = await db.chatMessage.findUnique({ where: { id: messageId } });
  
  if (!message) {
    return { ok: false, message: "Message not found." };
  }
  
  if (message.senderUserId !== user.id) {
    return { ok: false, message: "You can only unsend your own messages." };
  }
  
  if (hardDelete && user.role === "SUPER_ADMIN") {
    await db.chatMessage.delete({
      where: { id: messageId }
    });
    return { ok: true, message: "Message completely deleted." };
  } else {
    await db.chatMessage.update({
      where: { id: messageId },
      data: { deletedAt: new Date() }
    });
    return { ok: true, message: "Message unsent." };
  }
}
export async function toggleChatReactionAction(messageId: string, emoji: string | null, customEmojiId: string | null) {
  try {
    const user = await requireUser();
    
    // Find if the reaction already exists for this user
    const existing = await db.chatReaction.findFirst({
      where: {
        messageId,
        userId: user.id,
        emoji,
        customEmojiId
      }
    });

    if (existing) {
      await db.chatReaction.delete({ where: { id: existing.id } });
      return { ok: true, action: "removed" };
    } else {
      await db.chatReaction.create({
        data: {
          messageId,
          userId: user.id,
          emoji,
          customEmojiId
        }
      });
      return { ok: true, action: "added" };
    }
  } catch (error) {
    console.error("Failed to toggle reaction:", error);
    return { ok: false, message: "Failed to toggle reaction." };
  }
}

export async function searchChatUsersAction(query: string) {
  const user = await requireUser();
  if (!query || query.length < 2) return [];
  const results = await db.user.findMany({
    where: {
      isActive: true,
      id: { not: user.id },
      name: { contains: query, mode: "insensitive" }
    },
    select: { 
      id: true, 
      name: true, 
      email: true, 
      photoUrl: true,
      personnel: {
        select: { photoUrl: true }
      }
    },
    take: 10
  });

  return results.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    photoUrl: u.photoUrl ?? u.personnel?.photoUrl ?? null
  }));
}

export async function createDirectMessageAction(targetUserId: string) {
  const user = await requireUser();
  
  const channelsWhereUserIsMember = await db.chatChannelMember.findMany({
    where: { userId: user.id },
    select: { channelId: true }
  });
  
  const existing = await db.chatChannel.findFirst({
    where: {
      id: { in: channelsWhereUserIsMember.map((c) => c.channelId) },
      channelType: "PRIVATE",
      members: {
        some: { userId: targetUserId },
        every: {
          userId: { in: [user.id, targetUserId] }
        }
      }
    }
  });

  if (existing) {
    return { ok: true, channelId: existing.id };
  }

  const targetUser = await db.user.findUnique({ where: { id: targetUserId } });
  if (!targetUser) return { ok: false, message: "User not found." };

  const newChannel = await db.chatChannel.create({
    data: {
      name: `DM: ${user.name} & ${targetUser.name}`,
      channelType: "PRIVATE",
      createdById: user.id,
      members: {
        create: [
          { userId: user.id, role: ChatChannelMemberRole.OWNER },
          { userId: targetUser.id, role: ChatChannelMemberRole.MEMBER }
        ]
      }
    }
  });

  return { ok: true, channelId: newChannel.id };
}
