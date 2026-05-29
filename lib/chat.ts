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
    { channelType: ChatChannelType.SYSTEM },
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

function formatDate(value: Date | null | undefined, pattern = "MMM d, yyyy") {
  return value ? format(value, pattern) : "Not set";
}

function requestStatusLabel(status: VehicleRequestStatus | RoomReservationStatus | string) {
  return String(status).replaceAll("_", " ");
}

export async function postVehicleRequestChatNotification(requestId: string) {
  const [channel, request] = await Promise.all([
    getOrCreateAdminRequestsChannel(),
    db.vehicleRequest.findUnique({
      where: { id: requestId },
      include: {
        requester: true
      }
    })
  ]);

  if (!request) {
    return;
  }

  const metadata: RequestNotificationMetadata = {
    requestType: "Vehicle Request",
    status: requestStatusLabel(request.status),
    href: `/vehicle-requests/admin#vehicle-request-${request.id}`,
    details: {
      Requester: request.requester.fullName,
      "Travel date": formatDate(request.travelDate),
      Destination: request.destination,
      Purpose: request.purpose,
      Status: requestStatusLabel(request.status),
      Created: formatDate(request.createdAt, "MMM d, yyyy h:mm a")
    }
  };

  await postSystemChatMessage({
    channelId: channel.id,
    messageType: ChatMessageType.REQUEST_NOTIFICATION,
    relatedEntityType: "VehicleRequest",
    relatedEntityId: request.id,
    body: `Vehicle Request submitted by ${request.requester.fullName} for ${formatDate(request.travelDate)} to ${request.destination}.`,
    metadataJson: metadata as unknown as Prisma.InputJsonValue
  });
}

export async function postVehicleRequestStatusChatUpdate(input: {
  requestId: string;
  actorUserId: string;
  actionLabel: string;
}) {
  const [channel, request, actor] = await Promise.all([
    getOrCreateAdminRequestsChannel(),
    db.vehicleRequest.findUnique({
      where: { id: input.requestId },
      include: {
        requester: true,
        assignedVehicle: true
      }
    }),
    db.user.findUnique({
      where: { id: input.actorUserId },
      select: { name: true }
    })
  ]);

  if (!request) {
    return;
  }

  const actorName = actor?.name ?? "System";
  const vehicleLabel = request.assignedVehicle
    ? request.assignedVehicle.plateNumber
      ? `${request.assignedVehicle.name} (${request.assignedVehicle.plateNumber})`
      : request.assignedVehicle.name
    : "Pending assignment";
  const metadata: RequestNotificationMetadata = {
    requestType: "Vehicle Request",
    status: requestStatusLabel(request.status),
    href: `/vehicle-requests/admin#vehicle-request-${request.id}`,
    actionLabel: input.actionLabel,
    actorName,
    details: {
      Requester: request.requester.fullName,
      "Travel date": formatDate(request.travelDate),
      Destination: request.destination,
      Vehicle: vehicleLabel,
      "SO number": request.soNumber || "Pending assignment",
      Status: requestStatusLabel(request.status),
      Updated: formatDate(request.updatedAt, "MMM d, yyyy h:mm a")
    }
  };

  await postSystemChatMessage({
    channelId: channel.id,
    senderUserId: input.actorUserId,
    messageType: ChatMessageType.REQUEST_STATUS_UPDATE,
    relatedEntityType: "VehicleRequest",
    relatedEntityId: request.id,
    body: `${input.actionLabel} by ${actorName}. Vehicle Request is now ${requestStatusLabel(request.status)}.`,
    metadataJson: metadata as unknown as Prisma.InputJsonValue
  });
}

export async function postRoomReservationChatNotification(reservationId: string) {
  const [channel, reservation] = await Promise.all([
    getOrCreateAdminRequestsChannel(),
    db.roomReservation.findUnique({
      where: { id: reservationId },
      include: {
        requester: true,
        room: true
      }
    })
  ]);

  if (!reservation) {
    return;
  }

  const dateText = reservation.startDate.getTime() === reservation.endDate.getTime()
    ? formatDate(reservation.startDate)
    : `${formatDate(reservation.startDate)} - ${formatDate(reservation.endDate)}`;
  const metadata: RequestNotificationMetadata = {
    requestType: "Room Reservation",
    status: requestStatusLabel(reservation.status),
    href: `/room-reservations/admin#room-reservation-${reservation.id}`,
    details: {
      Requester: reservation.requester.fullName,
      Room: reservation.room.name,
      Schedule: reservation.halfDaySlot ? `${dateText} (${reservation.halfDaySlot.toLowerCase()})` : dateText,
      Purpose: reservation.purpose,
      Status: requestStatusLabel(reservation.status),
      Created: formatDate(reservation.createdAt, "MMM d, yyyy h:mm a")
    }
  };

  await postSystemChatMessage({
    channelId: channel.id,
    messageType: ChatMessageType.REQUEST_NOTIFICATION,
    relatedEntityType: "RoomReservation",
    relatedEntityId: reservation.id,
    body: `Room Reservation submitted by ${reservation.requester.fullName} for ${reservation.room.name}.`,
    metadataJson: metadata as unknown as Prisma.InputJsonValue
  });
}

export async function postRoomReservationStatusChatUpdate(input: {
  reservationId: string;
  actorUserId: string;
  actionLabel: string;
}) {
  const [channel, reservation, actor] = await Promise.all([
    getOrCreateAdminRequestsChannel(),
    db.roomReservation.findUnique({
      where: { id: input.reservationId },
      include: {
        requester: true,
        room: true
      }
    }),
    db.user.findUnique({
      where: { id: input.actorUserId },
      select: { name: true }
    })
  ]);

  if (!reservation) {
    return;
  }

  const actorName = actor?.name ?? "System";
  const dateText = reservation.startDate.getTime() === reservation.endDate.getTime()
    ? formatDate(reservation.startDate)
    : `${formatDate(reservation.startDate)} - ${formatDate(reservation.endDate)}`;
  const metadata: RequestNotificationMetadata = {
    requestType: "Room Reservation",
    status: requestStatusLabel(reservation.status),
    href: `/room-reservations/admin#room-reservation-${reservation.id}`,
    actionLabel: input.actionLabel,
    actorName,
    details: {
      Requester: reservation.requester.fullName,
      Room: reservation.room.name,
      Schedule: reservation.halfDaySlot ? `${dateText} (${reservation.halfDaySlot.toLowerCase()})` : dateText,
      Status: requestStatusLabel(reservation.status),
      Updated: formatDate(reservation.updatedAt, "MMM d, yyyy h:mm a")
    }
  };

  await postSystemChatMessage({
    channelId: channel.id,
    senderUserId: input.actorUserId,
    messageType: ChatMessageType.REQUEST_STATUS_UPDATE,
    relatedEntityType: "RoomReservation",
    relatedEntityId: reservation.id,
    body: `${input.actionLabel} by ${actorName}. Room Reservation is now ${requestStatusLabel(reservation.status)}.`,
    metadataJson: metadata as unknown as Prisma.InputJsonValue
  });
}

export function chatChannelTypeLabel(type: ChatChannelType | string) {
  return String(type).toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function defaultMemberRoleForCreator() {
  return ChatChannelMemberRole.OWNER;
}
