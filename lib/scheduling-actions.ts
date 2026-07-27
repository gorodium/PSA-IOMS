"use server";

import { db } from "@/lib/db";
import { subMonths, addMonths } from "date-fns";
import { requireUser } from "@/lib/auth";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  type: "ROOM" | "VEHICLE" | "SPECIAL_ORDER";
  status: string;
  extendedProps: Record<string, unknown>;
}

export async function getSchedulingData(startDate?: Date, endDate?: Date) {
  const start = startDate || subMonths(new Date(), 1);
  const end = endDate || addMonths(new Date(), 1);

  try {
    const roomReservations = await db.roomReservation.findMany({
      where: {
        startDate: { gte: start },
        endDate: { lte: end },
      },
      include: { room: true, requester: true },
    });

    const vehicleRequests = await db.vehicleRequest.findMany({
      where: {
        departureAt: { gte: start },
        expectedReturnAt: { lte: end },
      },
      include: { assignedVehicle: true, requester: true },
    });

    const specialOrders = await db.specialOrder.findMany({
      where: {
        activityDate: { gte: start, lte: end },
      },
      include: { people: { include: { personnel: true } } },
    });

    const events: CalendarEvent[] = [
      ...roomReservations.map((r: typeof roomReservations[number]) => ({
        id: `room-${r.id}`,
        title: `Room: ${r.room?.name || 'TBA'} - ${r.purpose}`,
        start: r.startDate,
        end: r.endDate,
        type: "ROOM" as const,
        status: r.status,
        extendedProps: { ...r },
      })),
      ...vehicleRequests.filter((v: typeof vehicleRequests[number]) => v.departureAt && v.expectedReturnAt).map((v: typeof vehicleRequests[number]) => ({
        id: `vehicle-${v.id}`,
        title: `Vehicle: ${v.assignedVehicle?.plateNumber || 'TBA'} - ${v.destination}`,
        start: v.departureAt!,
        end: v.expectedReturnAt!,
        type: "VEHICLE" as const,
        status: v.status,
        extendedProps: { ...v },
      })),
      ...specialOrders.filter((so: typeof specialOrders[number]) => so.activityDate).map((so: typeof specialOrders[number]) => ({
        id: `so-${so.id}`,
        title: `SO: ${so.purpose || so.soNumber || 'Special Order'}`,
        start: so.activityDate!,
        end: so.activityDate!, // SOs are usually single day or start=end for calendar purposes unless assignedDate is used
        type: "SPECIAL_ORDER" as const,
        status: so.status || 'APPROVED',
        extendedProps: { ...so },
      }))
    ];

    return { success: true, data: events };
  } catch (error) {
    console.error("Error fetching scheduling data:", error);
    return { success: false, error: "Failed to fetch scheduling data" };
  }
}

export async function checkConflicts(type: "ROOM" | "VEHICLE", targetId: string, startTime: Date, endTime: Date) {
  try {
    if (type === "ROOM") {
      const conflicts = await db.roomReservation.findMany({
        where: {
          roomId: targetId,
          status: { in: ["APPROVED", "PENDING"] },
          OR: [
            { startDate: { lt: endTime, gte: startTime } },
            { endDate: { gt: startTime, lte: endTime } },
            { startDate: { lte: startTime }, endDate: { gte: endTime } }
          ]
        }
      });
      return { hasConflict: conflicts.length > 0, conflicts };
    } else {
      const conflicts = await db.vehicleRequest.findMany({
        where: {
          assignedVehicleId: targetId,
          status: { in: ["APPROVED", "PENDING"] },
          OR: [
            { departureAt: { lt: endTime, gte: startTime } },
            { expectedReturnAt: { gt: startTime, lte: endTime } },
            { departureAt: { lte: startTime }, expectedReturnAt: { gte: endTime } }
          ]
        }
      });
      return { hasConflict: conflicts.length > 0, conflicts };
    }
  } catch (error) {
    console.error("Error checking conflicts:", error);
    return { error: "Failed to check conflicts" };
  }
}

export async function quickReserve(data: {
    type: "ROOM" | "VEHICLE";
    resourceId: string;
    purpose: string;
    startTime: Date;
    endTime: Date;
    userId: string;
    isAdminAdd?: boolean;
    requesterPersonnelId?: string;
    assignedDriverId?: string;
}) {
    try {
        const user = await db.user.findUnique({ where: { id: data.userId } });
        if (!user || !user.personnelId) {
            return { success: false, error: "User must be linked to a personnel record to make reservations" };
        }

        const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
        const isDirectApprove = isAdmin && data.isAdminAdd;

        const finalRequesterId = (isDirectApprove && data.requesterPersonnelId) 
            ? data.requesterPersonnelId 
            : user.personnelId;

        if (data.type === 'ROOM') {
            const result = await db.roomReservation.create({
                data: {
                    roomId: data.resourceId,
                    purpose: data.purpose,
                    startDate: data.startTime,
                    endDate: data.endTime,
                    requesterPersonnelId: finalRequesterId,
                    requestedByUserId: data.userId,
                    reservationType: 'SINGLE_DAY',
                    status: isDirectApprove ? 'APPROVED' : 'PENDING',
                    approvedById: isDirectApprove ? user.id : undefined,
                    approvedAt: isDirectApprove ? new Date() : undefined,
                }
            });
            return { success: true, data: result };
        } else if (data.type === 'VEHICLE') {
            const result = await db.vehicleRequest.create({
                data: {
                    assignedVehicleId: data.resourceId,
                    requestedDriverId: data.assignedDriverId || undefined,
                    destination: data.purpose,
                    purpose: data.purpose,
                    travelDate: data.startTime,
                    departureAt: data.startTime,
                    expectedReturnAt: data.endTime,
                    requesterPersonnelId: finalRequesterId,
                    requestedByUserId: data.userId,
                    status: isDirectApprove ? 'APPROVED' : 'PENDING',
                    reviewedById: isDirectApprove ? user.id : undefined,
                }
            });
            return { success: true, data: result };
        }
        return { success: false, error: "Invalid reservation type" };
    } catch (error) {
        console.error("Error creating quick reservation:", error);
        return { success: false, error: "Failed to create reservation" };
    }
}

export async function quickApproveEvent(type: "ROOM" | "VEHICLE", eventId: string) {
    try {
        const user = await db.user.findUnique({ where: { id: (await requireUser()).id } });
        if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
            return { success: false, error: "Unauthorized. Only admins can approve requests." };
        }

        // The ID comes in as "room-123" or "vehicle-123" from the calendar, so strip the prefix
        const id = eventId.replace(/^(room-|vehicle-)/, "");

        if (type === "ROOM") {
            const result = await db.roomReservation.update({
                where: { id },
                data: {
                    status: 'APPROVED',
                    approvedById: user.id,
                    approvedAt: new Date()
                }
            });
            return { success: true, data: result };
        } else if (type === "VEHICLE") {
            const result = await db.vehicleRequest.update({
                where: { id },
                data: {
                    status: 'APPROVED',
                    reviewedById: user.id
                }
            });
            return { success: true, data: result };
        }
        return { success: false, error: "Invalid type" };
    } catch (error) {
        console.error("Error quickly approving event:", error);
        return { success: false, error: "Failed to approve event" };
    }
}
