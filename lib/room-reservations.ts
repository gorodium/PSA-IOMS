import "server-only";

import { ActivityType, HalfDaySlot, RoomReservationStatus, RoomReservationType } from "@prisma/client";
import { addDays, endOfDay, format, isBefore, startOfDay } from "date-fns";
import { db } from "@/lib/db";

export const roomCalendarHideMarker = "[IOMS_HIDE_ROOM_FROM_CALENDAR]";

export const officialRoomNames = [
  "Conference Room",
  "Training Room",
  "Pantry 1",
  "Pantry 2"
] as const;

export function isRoomAdmin(role: string | null | undefined) {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}

export function normalizeRoomDate(value: string) {
  return startOfDay(new Date(`${value}T00:00:00`));
}

export function formatRoomReservationType(type: RoomReservationType, slot: HalfDaySlot | null) {
  if (type === RoomReservationType.HALF_DAY) {
    return slot === HalfDaySlot.AFTERNOON ? "Half day - Afternoon" : "Half day - Morning";
  }

  return "Multiple days";
}

export function formatRoomReservationDates(input: {
  startDate: Date;
  endDate: Date;
  reservationType: RoomReservationType;
  halfDaySlot: HalfDaySlot | null;
}) {
  if (input.reservationType === RoomReservationType.HALF_DAY) {
    return `${format(input.startDate, "MMM d, yyyy")} (${input.halfDaySlot === "AFTERNOON" ? "Afternoon" : "Morning"})`;
  }

  if (input.startDate.getTime() === input.endDate.getTime()) {
    return format(input.startDate, "MMM d, yyyy");
  }

  return `${format(input.startDate, "MMM d, yyyy")} - ${format(input.endDate, "MMM d, yyyy")}`;
}

function dateRangesOverlap(firstStart: Date, firstEnd: Date, secondStart: Date, secondEnd: Date) {
  return firstStart <= secondEnd && secondStart <= firstEnd;
}

function reservationConflicts(
  existing: {
    reservationType: RoomReservationType;
    startDate: Date;
    endDate: Date;
    halfDaySlot: HalfDaySlot | null;
  },
  incoming: {
    reservationType: RoomReservationType;
    startDate: Date;
    endDate: Date;
    halfDaySlot: HalfDaySlot | null;
  }
) {
  if (!dateRangesOverlap(existing.startDate, existing.endDate, incoming.startDate, incoming.endDate)) {
    return false;
  }

  if (existing.reservationType === RoomReservationType.MULTIPLE_DAYS || incoming.reservationType === RoomReservationType.MULTIPLE_DAYS) {
    return true;
  }

  return existing.halfDaySlot === incoming.halfDaySlot;
}

export async function findRoomReservationConflicts(input: {
  roomId: string;
  reservationType: RoomReservationType;
  startDate: Date;
  endDate: Date;
  halfDaySlot?: HalfDaySlot | null;
  excludeReservationId?: string | null;
}) {
  const reservations = await db.roomReservation.findMany({
    where: {
      roomId: input.roomId,
      status: RoomReservationStatus.APPROVED,
      startDate: { lte: endOfDay(input.endDate) },
      endDate: { gte: startOfDay(input.startDate) },
      ...(input.excludeReservationId ? { id: { not: input.excludeReservationId } } : {})
    },
    include: {
      room: true,
      requester: true
    },
    orderBy: { startDate: "asc" }
  });

  return reservations.filter((reservation) =>
    reservationConflicts(reservation, {
      reservationType: input.reservationType,
      startDate: input.startDate,
      endDate: input.endDate,
      halfDaySlot: input.halfDaySlot ?? null
    })
  );
}

export function validateRoomDateRange(input: {
  reservationType: RoomReservationType;
  startDate: Date;
  endDate: Date;
}) {
  if (isBefore(input.endDate, input.startDate)) {
    return "End date cannot be earlier than start date.";
  }

  if (input.reservationType === RoomReservationType.HALF_DAY && input.startDate.getTime() !== input.endDate.getTime()) {
    return "Half-day reservations must use one reservation date.";
  }

  return null;
}

export async function syncRoomReservationCalendarEntry(reservationId: string) {
  const reservation = await db.roomReservation.findUnique({
    where: { id: reservationId },
    include: {
      room: true,
      requester: true
    }
  });

  if (!reservation) {
    return;
  }

  if (reservation.status !== RoomReservationStatus.APPROVED) {
    if (reservation.calendarActivityId) {
      await db.calendarActivity.update({
        where: { id: reservation.calendarActivityId },
        data: {
          description: `${roomCalendarHideMarker}\nRoom reservation status: ${reservation.status}`
        }
      });
    }
    return;
  }

  const scheduleText = formatRoomReservationDates(reservation);
  const description = [
    "Room reservation",
    `Room: ${reservation.room.name}`,
    `Schedule: ${scheduleText}`,
    `Requester: ${reservation.requester.fullName}`,
    `Purpose: ${reservation.purpose}`,
    `Status: ${reservation.status}`
  ].join("\n");

  const data = {
    type: ActivityType.ROOM,
    title: `Room Reservation: ${reservation.room.name}`,
    description,
    startDate: reservation.startDate,
    endDate: reservation.reservationType === RoomReservationType.MULTIPLE_DAYS
      ? addDays(reservation.endDate, 0)
      : reservation.endDate,
    location: reservation.room.name,
    personnelId: reservation.requesterPersonnelId,
    vehicleName: null
  };

  if (reservation.calendarActivityId) {
    await db.calendarActivity.update({
      where: { id: reservation.calendarActivityId },
      data
    });
    return;
  }

  const activity = await db.calendarActivity.create({ data });
  await db.roomReservation.update({
    where: { id: reservation.id },
    data: { calendarActivityId: activity.id }
  });
}
