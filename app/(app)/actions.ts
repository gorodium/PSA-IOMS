"use server";

import { redirect } from "next/navigation";
import { clearUserSession, getCurrentUser } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { db } from "@/lib/db";

export async function logoutAction() {
  const user = await getCurrentUser();

  if (user) {
    await writeAuditLog({
      userId: user.id,
      action: "LOGOUT",
      entityType: "User",
      entityId: user.id
    });
  }

  await clearUserSession();
  redirect("/login");
}

export type SystemNotification = {
  id: string;
  type: "VEHICLE" | "ROOM" | "UPDATE";
  title: string;
  description: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "INFO";
  createdAt: Date;
  link: string;
};

export async function getNotificationsAction(): Promise<SystemNotification[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const notifications: SystemNotification[] = [];
  const isAdmin = user.role === "SUPER_ADMIN" || user.role === "ADMIN";

  try {
    // Fetch SYSTEM chat updates for EVERYONE (acting as global notifications)
    const systemChannels = await db.chatChannel.findMany({
      where: { channelType: "SYSTEM", isActive: true },
      select: { id: true, name: true }
    });
    
    for (const channel of systemChannels) {
      const updates = await db.chatMessage.findMany({
        where: { 
          channelId: channel.id,
          deletedAt: null
        },
        orderBy: { createdAt: "desc" },
        take: 10
      });

      for (const msg of updates) {
        notifications.push({
          id: `sys-update-${msg.id}`,
          type: "UPDATE",
          title: channel.name,
          description: msg.body || "New update posted",
          status: "INFO",
          createdAt: msg.createdAt,
          link: `#`
        });
      }
    }

    if (isAdmin) {
      // 1. Fetch pending vehicle requests
      const pendingVehicles = await db.vehicleRequest.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { requester: true }
      });

      for (const req of pendingVehicles) {
        notifications.push({
          id: `vehicle-${req.id}`,
          type: "VEHICLE",
          title: "Pending Vehicle Request",
          description: `${req.requester.fullName} requested a vehicle to ${req.destination} on ${new Date(req.travelDate).toLocaleDateString()}`,
          status: "PENDING",
          createdAt: req.createdAt,
          link: `/vehicle-requests`
        });
      }

      // 2. Fetch pending room reservations
      const pendingRooms = await db.roomReservation.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { requester: true, room: true }
      });

      for (const req of pendingRooms) {
        notifications.push({
          id: `room-${req.id}`,
          type: "ROOM",
          title: "Pending Room Reservation",
          description: `${req.requester.fullName} requested ${req.room.name} starting ${new Date(req.startDate).toLocaleDateString()}`,
          status: "PENDING",
          createdAt: req.createdAt,
          link: `/room-reservations`
        });
      }
    } else {
      // For normal employees, fetch their own requests that are APPROVED or REJECTED recently
      // 1. Vehicle requests
      const employeeVehicles = await db.vehicleRequest.findMany({
        where: {
          requestedByUserId: user.id,
          status: { in: ["APPROVED", "REJECTED"] }
        },
        orderBy: { updatedAt: "desc" },
        take: 10
      });

      for (const req of employeeVehicles) {
        notifications.push({
          id: `vehicle-${req.id}`,
          type: "VEHICLE",
          title: `Vehicle Request ${req.status === "APPROVED" ? "Approved" : "Rejected"}`,
          description: `Your request for a vehicle to ${req.destination} has been ${req.status.toLowerCase()}.`,
          status: req.status as "PENDING" | "APPROVED" | "REJECTED" | "INFO",
          createdAt: req.updatedAt,
          link: `/vehicle-requests`
        });
      }

      // 2. Room reservations
      const employeeRooms = await db.roomReservation.findMany({
        where: {
          requestedByUserId: user.id,
          status: { in: ["APPROVED", "REJECTED"] }
        },
        orderBy: { updatedAt: "desc" },
        take: 10,
        include: { room: true }
      });

      for (const req of employeeRooms) {
        notifications.push({
          id: `room-${req.id}`,
          type: "ROOM",
          title: `Room Reservation ${req.status === "APPROVED" ? "Approved" : "Rejected"}`,
          description: `Your reservation for ${req.room.name} has been ${req.status.toLowerCase()}.`,
          status: req.status as "PENDING" | "APPROVED" | "REJECTED" | "INFO",
          createdAt: req.updatedAt,
          link: `/room-reservations`
        });
      }
    }
  } catch (err) {
    console.error("Error fetching notifications:", err);
  }

  // Sort all notifications by date descending
  return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
