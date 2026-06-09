"use server";

import { revalidatePath } from "next/cache";
import { RoomReservationStatus, RoomReservationType } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { db } from "@/lib/db";
import {
  findRoomReservationConflicts,
  isRoomAdmin,
  normalizeRoomDate,
  syncRoomReservationCalendarEntry,
  validateRoomDateRange
} from "@/lib/room-reservations";
import {
  createRoomReservationSchema,
  manageRoomReservationSchema,
  updateRoomAvailabilitySchema
} from "@/lib/room-validators";

type ActionResult = {
  ok: boolean;
  message: string;
};

const initialError = "Please check the reservation details.";

export async function createRoomReservationAction(_previousState: ActionResult, formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  if (!user.personnelId) {
    return {
      ok: false,
      message: "Your user account is not linked to an employee record. Please ask an administrator to link your account first."
    };
  }

  const parsed = createRoomReservationSchema.safeParse({
    roomId: String(formData.get("roomId") ?? ""),
    reservationType: String(formData.get("reservationType") ?? ""),
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
    halfDaySlot: String(formData.get("halfDaySlot") ?? "") || undefined,
    purpose: String(formData.get("purpose") ?? ""),
    remarks: String(formData.get("remarks") ?? "")
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.errors[0]?.message ?? initialError };
  }

  const room = await db.room.findFirst({
    where: {
      id: parsed.data.roomId,
      isActive: true
    }
  });

  if (!room) {
    return { ok: false, message: "Selected room could not be found." };
  }

  if (!room.isAvailable) {
    return {
      ok: false,
      message: `${room.name} is currently unavailable${room.unavailableReason ? `: ${room.unavailableReason}` : "."}`
    };
  }

  const startDate = normalizeRoomDate(parsed.data.startDate);
  const endDate = normalizeRoomDate(parsed.data.endDate);
  const rangeError = validateRoomDateRange({
    reservationType: parsed.data.reservationType,
    startDate,
    endDate
  });

  if (rangeError) {
    return { ok: false, message: rangeError };
  }

  const conflicts = await findRoomReservationConflicts({
    roomId: room.id,
    reservationType: parsed.data.reservationType,
    startDate,
    endDate,
    halfDaySlot: parsed.data.halfDaySlot ?? null
  });

  if (conflicts.length > 0) {
    return {
      ok: false,
      message: "That room already has an approved reservation for the selected date, slot, or date range."
    };
  }

  const reservation = await db.roomReservation.create({
    data: {
      roomId: room.id,
      requesterPersonnelId: user.personnelId,
      requestedByUserId: user.id,
      reservationType: parsed.data.reservationType,
      startDate,
      endDate,
      halfDaySlot: parsed.data.reservationType === RoomReservationType.HALF_DAY ? parsed.data.halfDaySlot : null,
      purpose: parsed.data.purpose,
      remarks: parsed.data.remarks || null
    }
  });

  await writeAuditLog({
    userId: user.id,
    action: "CREATE",
    entityType: "RoomReservation",
    entityId: reservation.id,
    newValueJson: reservation
  });

  revalidatePath("/room-reservations");
  revalidatePath("/room-reservations/admin");
  return { ok: true, message: "Room reservation request submitted for admin review." };
}

export async function manageRoomReservationAction(_previousState: ActionResult, formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  if (!isRoomAdmin(user.role)) {
    return { ok: false, message: "Only administrators can manage room reservations." };
  }

  const parsed = manageRoomReservationSchema.safeParse({
    reservationId: String(formData.get("reservationId") ?? ""),
    status: String(formData.get("status") ?? ""),
    rejectionReason: String(formData.get("rejectionReason") ?? "")
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.errors[0]?.message ?? initialError };
  }

  const existingReservation = await db.roomReservation.findUnique({
    where: { id: parsed.data.reservationId },
    include: { room: true, requester: true }
  });

  if (!existingReservation) {
    return { ok: false, message: "Room reservation could not be found." };
  }

  if (parsed.data.status === RoomReservationStatus.APPROVED) {
    if (!existingReservation.room.isAvailable) {
      return {
        ok: false,
        message: `${existingReservation.room.name} is currently unavailable${existingReservation.room.unavailableReason ? `: ${existingReservation.room.unavailableReason}` : "."}`
      };
    }

    const conflicts = await findRoomReservationConflicts({
      roomId: existingReservation.roomId,
      reservationType: existingReservation.reservationType,
      startDate: existingReservation.startDate,
      endDate: existingReservation.endDate,
      halfDaySlot: existingReservation.halfDaySlot,
      excludeReservationId: existingReservation.id
    });

    if (conflicts.length > 0) {
      return {
        ok: false,
        message: "This approval would overlap with an existing approved reservation for the same room."
      };
    }
  }

  const now = new Date();
  const updatedReservation = await db.roomReservation.update({
    where: { id: existingReservation.id },
    data: {
      status: parsed.data.status,
      approvedById: parsed.data.status === RoomReservationStatus.APPROVED ? user.id : existingReservation.approvedById,
      approvedAt: parsed.data.status === RoomReservationStatus.APPROVED ? now : existingReservation.approvedAt,
      rejectedById: parsed.data.status === RoomReservationStatus.REJECTED ? user.id : existingReservation.rejectedById,
      rejectedAt: parsed.data.status === RoomReservationStatus.REJECTED ? now : existingReservation.rejectedAt,
      rejectionReason: parsed.data.rejectionReason || null,
      cancelledAt: parsed.data.status === RoomReservationStatus.CANCELLED ? now : existingReservation.cancelledAt
    }
  });

  await syncRoomReservationCalendarEntry(updatedReservation.id);
  await writeAuditLog({
    userId: user.id,
    action: "UPDATE",
    entityType: "RoomReservation",
    entityId: updatedReservation.id,
    oldValueJson: existingReservation,
    newValueJson: updatedReservation
  });

  revalidatePath("/room-reservations");
  revalidatePath("/room-reservations/admin");
  revalidatePath("/calendar");
  return { ok: true, message: "Room reservation updated." };
}

export async function cancelRoomReservationAction(reservationId: string): Promise<void> {
  const user = await requireUser();
  const reservation = await db.roomReservation.findUnique({
    where: { id: reservationId }
  });

  if (!reservation) {
    throw new Error("Room reservation could not be found.");
  }

  const canCancel = isRoomAdmin(user.role) || reservation.requesterPersonnelId === user.personnelId;
  if (!canCancel) {
    throw new Error("You can only cancel your own room reservations.");
  }

  const updatedReservation = await db.roomReservation.update({
    where: { id: reservation.id },
    data: {
      status: RoomReservationStatus.CANCELLED,
      cancelledAt: new Date()
    }
  });

  await syncRoomReservationCalendarEntry(updatedReservation.id);
  await writeAuditLog({
    userId: user.id,
    action: "CANCEL",
    entityType: "RoomReservation",
    entityId: updatedReservation.id,
    oldValueJson: reservation,
    newValueJson: updatedReservation
  });

  revalidatePath("/room-reservations");
  revalidatePath("/room-reservations/admin");
  revalidatePath("/calendar");
}

export async function updateRoomAvailabilityAction(_previousState: ActionResult, formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  if (!isRoomAdmin(user.role)) {
    return { ok: false, message: "Only administrators can change room availability." };
  }

  const parsed = updateRoomAvailabilitySchema.safeParse({
    roomId: String(formData.get("roomId") ?? ""),
    isAvailable: String(formData.get("isAvailable") ?? ""),
    unavailableReason: String(formData.get("unavailableReason") ?? "")
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.errors[0]?.message ?? initialError };
  }

  const existingRoom = await db.room.findUnique({ where: { id: parsed.data.roomId } });
  if (!existingRoom) {
    return { ok: false, message: "Room could not be found." };
  }

  const updatedRoom = await db.room.update({
    where: { id: existingRoom.id },
    data: {
      isAvailable: parsed.data.isAvailable === "true",
      unavailableReason: parsed.data.isAvailable === "true" ? null : parsed.data.unavailableReason || "Unavailable"
    }
  });

  await writeAuditLog({
    userId: user.id,
    action: "UPDATE",
    entityType: "Room",
    entityId: updatedRoom.id,
    oldValueJson: existingRoom,
    newValueJson: updatedRoom
  });

  revalidatePath("/room-reservations");
  revalidatePath("/room-reservations/admin");
  return { ok: true, message: "Room availability updated." };
}
