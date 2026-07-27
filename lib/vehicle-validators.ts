import { z } from "zod";
import { VehicleRequestStatus } from "@prisma/client";

const optionalTimeSchema = z
  .string()
  .trim()
  .regex(/^$|^\d{2}:\d{2}$/, "Use a valid time.")
  .optional();

export const createVehicleRequestSchema = z
  .object({
    travelDate: z.string().min(1, "Start date is required."),
    travelEndDate: z.string().trim().optional(),
    departureTime: optionalTimeSchema,
    expectedReturnTime: optionalTimeSchema,
    purpose: z.string().trim().min(3, "Purpose of travel is required."),
    destination: z.string().trim().min(2, "Destination is required."),
    passengerIds: z.array(z.string()).default([]),
    requestedDriverId: z.string().trim().optional(),
    specialOrderId: z.string().trim().optional()
  })
  .superRefine((value, ctx) => {
    if (value.departureTime && value.expectedReturnTime && value.expectedReturnTime <= value.departureTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Expected return time must be later than departure time.",
        path: ["expectedReturnTime"]
      });
    }

    if (value.travelEndDate && value.travelEndDate < value.travelDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date cannot be before the start date.",
        path: ["travelEndDate"]
      });
    }
  });

export const manageVehicleRequestSchema = z
  .object({
    requestId: z.string().min(1, "Request is required."),
    status: z.nativeEnum(VehicleRequestStatus),
    vehicleId: z.string().optional(),
    assignedDriverId: z.string().trim().optional(),
    soNumber: z.string().trim().optional(),
    adminNotes: z.string().trim().optional(),
    rejectionReason: z.string().trim().optional()
  })
  .superRefine((value, ctx) => {
    if ((value.status === "APPROVED" || value.status === "ASSIGNED") && !value.vehicleId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Assign an available vehicle before approving or assigning the request.",
        path: ["vehicleId"]
      });
    }

    if (value.status === "REJECTED" && !value.rejectionReason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Add a short rejection reason.",
        path: ["rejectionReason"]
      });
    }
  });

export const createVehicleSchema = z.object({
  name: z.string().trim().min(2, "Vehicle name is required."),
  plateNumber: z.string().trim().optional(),
  description: z.string().trim().optional()
});
