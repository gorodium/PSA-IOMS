import "server-only";

import { format } from "date-fns";
import {
  ChatChannelMemberRole,
  ChatChannelType,
  ChatMessageType,
  RoomReservationStatus,
  VehicleRequestStatus,
  type Prisma,
  type UserRole
} from "@prisma/client";
import { db } from "@/lib/db";
import type { AuthUser } from "@/lib/auth";

export const adminRequestsChannelName = "Admin Requests";

export type ChatUser = Pick<AuthUser, "id" | "role" | "isActive">;

export type RequestNotificationMetadata = {
  requestType: "Vehicle Request" | "Room Reservation";
  status: string;
  href: string;
  actionLabel?: string;
  actorName?: string;
  details: Record<string, string>;
};

export function isAdminRequestRole(role: UserRole | string | null | undefined) {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}

export function canManageChatChannels(user: ChatUser | null | undefined) {
  return Boolean(user && user.isActive !== false && user.role === "SUPER_ADMIN");
}

export function canModerateChat(user: ChatUser | null | undefined) {
  return Boolean(user && user.isActive !== false && isAdminRequestRole(user.role));
}

export async function getOrCreateAdminRequestsChannel() {
  return db.chatChannel.upsert({
    where: {
      name_channelType: {
        name: adminRequestsChannelName,
        channelType: ChatChannelType.ADMIN_REQUESTS
      }
    },
    update: {
      isActive: true,
      description: "Protected request notifications for administrators."
    },
    create: {
      name: adminRequestsChannelName,
      description: "Protected request notifications for administrators.",
      channelType: ChatChannelType.ADMIN_REQUESTS
    }
  });
}

export function accessibleChatChannelWhere(user: ChatUser): Prisma.ChatChannelWhereInput {
  const baseVisibility: Prisma.ChatChannelWhereInput[] = [
    { channelType: ChatChannelType.GENERAL },
    {
      members: {
        some: {
          userId: user.id,
          isActive: true
        }
      }
    }
  ];

  if (isAdminRequestRole(user.role)) {
    baseVisibility.push({ channelType: ChatChannelType.ADMIN_REQUESTS });
  }

  // Only Super Admin can see SYSTEM channels like "PSA MisOr - IOMS Updates"
  if (user.role === "SUPER_ADMIN") {
    baseVisibility.push({ channelType: ChatChannelType.SYSTEM });
  }

  return {
    isActive: true,
    OR: baseVisibility
  };
}

export async function assertCanAccessChatChannel(channelId: string, user: ChatUser) {
  const channel = await db.chatChannel.findFirst({
    where: {
      id: channelId,
      ...accessibleChatChannelWhere(user)
    },
    select: {
      id: true,
      channelType: true,
      isActive: true
    }
  });

  if (!channel) {
    throw new Error("You do not have access to this chat channel.");
  }

  return channel;
}

export async function getAccessibleChatChannels(user: ChatUser) {
  return db.chatChannel.findMany({
    where: accessibleChatChannelWhere(user),
    orderBy: [
      { channelType: "asc" },
      { updatedAt: "desc" },
      { name: "asc" }
    ],
    select: {
      id: true,
      name: true,
      description: true,
      channelType: true,
      photoUrl: true,
      updatedAt: true
    }
  });
}

export async function markChatChannelRead(channelId: string, user: ChatUser) {
  await assertCanAccessChatChannel(channelId, user);

  const unreadMessages = await db.chatMessage.findMany({
    where: {
      channelId,
      deletedAt: null,
      NOT: {
        senderUserId: user.id
      },
      reads: {
        none: {
          userId: user.id
        }
      }
    },
    select: {
      id: true
    },
    take: 200
  });

  if (unreadMessages.length === 0) {
    return;
  }

  await db.chatMessageRead.createMany({
    data: unreadMessages.map((message) => ({
      messageId: message.id,
      userId: user.id
    })),
    skipDuplicates: true
  });
}

export async function postSystemChatMessage(input: {
  channelId: string;
  messageType: ChatMessageType;
  body: string;
  senderUserId?: string | null;
  relatedEntityType?: string | null;
  relatedEntityId?: string | null;
  metadataJson?: Prisma.InputJsonValue;
}) {
  const message = await db.chatMessage.create({
    data: {
      channelId: input.channelId,
      senderUserId: input.senderUserId ?? null,
      messageType: input.messageType,
      body: input.body,
      relatedEntityType: input.relatedEntityType ?? null,
      relatedEntityId: input.relatedEntityId ?? null,
      metadataJson: input.metadataJson ?? undefined
    }
  });
  await db.chatChannel.update({
    where: { id: input.channelId },
    data: { updatedAt: new Date() }
  });
  return message;
}

export function chatChannelTypeLabel(type: ChatChannelType | string) {
  return String(type).toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function defaultMemberRoleForCreator() {
  return ChatChannelMemberRole.OWNER;
}
