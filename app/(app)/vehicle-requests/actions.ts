"use server";

import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { VehicleRequestStatus } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { db } from "@/lib/db";
import {
  combineTravelDateTime,
  findVehicleConflicts,
  getVehicleAvailability,
  isVehicleAdmin,
  normalizeTravelDate,
  syncVehicleRequestCalendarEntry
} from "@/lib/vehicle-scheduling";
import {
  createVehicleRequestSchema,
  createVehicleSchema,
  manageVehicleRequestSchema
} from "@/lib/vehicle-validators";

type ActionResult = {
  ok: boolean;
  message: string;
};

function formValues(formData: FormData) {
  return {
    travelDate: String(formData.get("travelDate") ?? ""),
    departureTime: String(formData.get("departureTime") ?? ""),
    expectedReturnTime: String(formData.get("expectedReturnTime") ?? ""),
    purpose: String(formData.get("purpose") ?? ""),
    destination: String(formData.get("destination") ?? ""),
    passengerIds: formData.getAll("passengerIds").map(String).filter(Boolean)
  };
}

async function saveSoFile(file: File | null) {
  if (!file || file.size === 0) {
    return undefined;
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const uploadDir = path.join(process.cwd(), "public/uploads/so");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), buffer);
  return `/uploads/so/${fileName}`;
}

export async function createVehicleRequestAction(_previousState: ActionResult, formData: FormData): Promise<ActionResult> {
  const user = await requireUser();

  if (!user.personnelId) {
    return {
      ok: false,
      message: "Your user account is not linked to an employee record. Please ask an administrator to link your account first."
    };
  }

  const parsed = createVehicleRequestSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.errors[0]?.message ?? "Please check the request details."
    };
  }

  const requester = await db.personnel.findUnique({
    where: { id: user.personnelId },
    select: { id: true, isActive: true }
  });

  if (!requester?.isActive) {
    return {
      ok: false,
      message: "Your linked employee record is inactive. Vehicle requests cannot be submitted from inactive employee records."
    };
  }

  const passengerIds = Array.from(new Set(parsed.data.passengerIds)).filter((id) => id !== user.personnelId);
  if (passengerIds.length > 0) {
    const realPassengers = await db.personnel.count({
      where: {
        id: { in: passengerIds },
        isActive: true
      }
    });

    if (realPassengers !== passengerIds.length) {
      return {
        ok: false,
        message: "One or more selected joining employees could not be found as active employee records."
      };
    }
  }

  const travelDate = normalizeTravelDate(parsed.data.travelDate);
  const departureAt = combineTravelDateTime(parsed.data.travelDate, parsed.data.departureTime);
  const expectedReturnAt = combineTravelDateTime(parsed.data.travelDate, parsed.data.expectedReturnTime);

  const request = await db.vehicleRequest.create({
    data: {
      requesterPersonnelId: user.personnelId,
      requestedByUserId: user.id,
      travelDate,
      departureAt,
      expectedReturnAt,
      purpose: parsed.data.purpose,
      destination: parsed.data.destination,
      passengers: {
        create: passengerIds.map((personnelId) => ({ personnelId }))
      }
    }
  });

  await writeAuditLog({
    userId: user.id,
    action: "CREATE",
    entityType: "VehicleRequest",
    entityId: request.id,
    newValueJson: request
  });

  revalidatePath("/vehicle-requests");
  revalidatePath("/vehicle-requests/admin");
  return { ok: true, message: "Vehicle use request submitted for admin review." };
}

export async function manageVehicleRequestAction(_previousState: ActionResult, formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  if (!isVehicleAdmin(user.role)) {
    return { ok: false, message: "Only administrators can manage vehicle assignments." };
  }

  const parsed = manageVehicleRequestSchema.safeParse({
    requestId: String(formData.get("requestId") ?? ""),
    status: String(formData.get("status") ?? ""),
    vehicleId: String(formData.get("vehicleId") ?? "") || undefined,
    soNumber: String(formData.get("soNumber") ?? ""),
    adminNotes: String(formData.get("adminNotes") ?? ""),
    rejectionReason: String(formData.get("rejectionReason") ?? "")
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.errors[0]?.message ?? "Please check the assignment details."
    };
  }

  const existingRequest = await db.vehicleRequest.findUnique({
    where: { id: parsed.data.requestId },
    include: { assignedVehicle: true }
  });

  if (!existingRequest) {
    return { ok: false, message: "Vehicle request could not be found." };
  }

  let assignedVehicleId = parsed.data.vehicleId || null;
  const shouldSchedule = parsed.data.status === VehicleRequestStatus.APPROVED || parsed.data.status === VehicleRequestStatus.ASSIGNED;

  if (shouldSchedule) {
    const availability = await getVehicleAvailability({
      travelDate: existingRequest.travelDate,
      departureAt: existingRequest.departureAt,
      expectedReturnAt: existingRequest.expectedReturnAt,
      excludeRequestId: existingRequest.id
    });

    if (availability.vehicles.length === 0) {
      return {
        ok: false,
        message: "No active vehicles are registered yet. Add actual office vehicles before approving or assigning requests."
      };
    }

    if (!assignedVehicleId) {
      return {
        ok: false,
        message: availability.availableVehicles.length === 0
          ? "All active vehicles are already scheduled for this travel date."
          : "Select an available vehicle for this request."
      };
    }

    const vehicle = await db.vehicle.findFirst({
      where: {
        id: assignedVehicleId,
        isActive: true
      }
    });

    if (!vehicle) {
      return { ok: false, message: "The selected vehicle does not exist or is inactive." };
    }

    const conflicts = await findVehicleConflicts({
      vehicleId: assignedVehicleId,
      travelDate: existingRequest.travelDate,
      departureAt: existingRequest.departureAt,
      expectedReturnAt: existingRequest.expectedReturnAt,
      excludeRequestId: existingRequest.id
    });

    if (conflicts.length > 0) {
      return {
        ok: false,
        message: "That vehicle is already scheduled for the selected travel date or time range."
      };
    }
  } else {
    assignedVehicleId = existingRequest.assignedVehicleId;
  }

  const soFileUrl = await saveSoFile(formData.get("soFile") as File | null);
  const updatedRequest = await db.vehicleRequest.update({
    where: { id: existingRequest.id },
    data: {
      status: parsed.data.status,
      assignedVehicleId,
      soNumber: parsed.data.soNumber || null,
      ...(soFileUrl ? { soFileUrl } : {}),
      adminNotes: parsed.data.adminNotes || null,
      rejectionReason: parsed.data.rejectionReason || null,
      reviewedById: user.id
    }
  });

  await syncVehicleRequestCalendarEntry(updatedRequest.id);
  await writeAuditLog({
    userId: user.id,
    action: "UPDATE",
    entityType: "VehicleRequest",
    entityId: updatedRequest.id,
    oldValueJson: existingRequest,
    newValueJson: updatedRequest
  });

  revalidatePath("/vehicle-requests");
  revalidatePath("/vehicle-requests/admin");
  revalidatePath("/calendar");
  return { ok: true, message: "Vehicle request updated." };
}

export async function cancelVehicleRequestAction(requestId: string): Promise<void> {
  const user = await requireUser();
  const request = await db.vehicleRequest.findUnique({
    where: { id: requestId }
  });

  if (!request) {
    throw new Error("Vehicle request could not be found.");
  }

  const canCancel = isVehicleAdmin(user.role) || request.requesterPersonnelId === user.personnelId;
  if (!canCancel) {
    throw new Error("You can only cancel your own vehicle requests.");
  }

  const updatedRequest = await db.vehicleRequest.update({
    where: { id: request.id },
    data: {
      status: VehicleRequestStatus.CANCELLED,
      reviewedById: isVehicleAdmin(user.role) ? user.id : request.reviewedById
    }
  });

  await syncVehicleRequestCalendarEntry(updatedRequest.id);
  await writeAuditLog({
    userId: user.id,
    action: "CANCEL",
    entityType: "VehicleRequest",
    entityId: updatedRequest.id,
    oldValueJson: request,
    newValueJson: updatedRequest
  });

  revalidatePath("/vehicle-requests");
  revalidatePath("/vehicle-requests/admin");
  revalidatePath("/calendar");
}

export async function createVehicleAction(_previousState: ActionResult, formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  if (!isVehicleAdmin(user.role)) {
    return { ok: false, message: "Only administrators can add vehicles." };
  }

  const parsed = createVehicleSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    plateNumber: String(formData.get("plateNumber") ?? ""),
    description: String(formData.get("description") ?? "")
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.errors[0]?.message ?? "Please check the vehicle details."
    };
  }

  const vehicle = await db.vehicle.create({
    data: {
      name: parsed.data.name,
      plateNumber: parsed.data.plateNumber || null,
      description: parsed.data.description || null
    }
  });

  await writeAuditLog({
    userId: user.id,
    action: "CREATE",
    entityType: "Vehicle",
    entityId: vehicle.id,
    newValueJson: vehicle
  });

  revalidatePath("/vehicle-requests/admin");
  return { ok: true, message: "Vehicle added. It is now available for real assignments." };
}
