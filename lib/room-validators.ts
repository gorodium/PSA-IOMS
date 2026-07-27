import { z } from "zod";
import { HalfDaySlot, RoomReservationStatus, RoomReservationType } from "@prisma/client";

export const createRoomReservationSchema = z
  .object({
    roomId: z.string().min(1, "Select a room."),
    reservationType: z.nativeEnum(RoomReservationType),
    startDate: z.string().min(1, "Start date is required."),
    endDate: z.string().optional(),
    halfDaySlot: z.nativeEnum(HalfDaySlot).optional(),
    purpose: z.string().trim().min(3, "Purpose of room usage is required."),
    remarks: z.string().trim().optional(),
    specialOrderId: z.string().trim().optional()
  })
  .superRefine((value, ctx) => {
    if (value.reservationType === RoomReservationType.HALF_DAY && !value.halfDaySlot) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Choose Morning or Afternoon for a half-day reservation.",
        path: ["halfDaySlot"]
      });
    }

    if (value.reservationType === RoomReservationType.MULTIPLE_DAYS) {
      if (!value.endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date is required for multiple-day reservations.",
          path: ["endDate"]
        });
      } else if (value.endDate < value.startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date cannot be before the start date.",
          path: ["endDate"]
        });
      }
    }
  });

export const manageRoomReservationSchema = z
  .object({
    reservationId: z.string().min(1, "Reservation is required."),
    status: z.nativeEnum(RoomReservationStatus),
    rejectionReason: z.string().trim().optional()
  })
  .superRefine((value, ctx) => {
    if (value.status === RoomReservationStatus.REJECTED && !value.rejectionReason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Add a rejection reason.",
        path: ["rejectionReason"]
      });
    }
  });

export const updateRoomAvailabilitySchema = z.object({
  roomId: z.string().min(1, "Room is required."),
  isAvailable: z.enum(["true", "false"]),
  unavailableReason: z.string().trim().optional()
});
