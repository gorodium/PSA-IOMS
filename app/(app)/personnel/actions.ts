"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { checkUserPermission, type PermissionAction, type PermissionResource } from "@/lib/permissions";
import { createPersonnelSchema, updatePersonnelSchema } from "@/lib/validators";

async function requirePermission(action: PermissionAction, resource: PermissionResource) {
  const user = await requireUser();

  if (!checkUserPermission(user, action, resource)) {
    throw new Error("You do not have permission to perform this action.");
  }

  return user;
}

function personnelInputFromFormData(formData: FormData) {
  return {
    id: formData.get("id"),
    employeeNo: formData.get("employeeNo"),
    fullName: formData.get("fullName"),
    position: formData.get("position"),
    section: formData.get("section"),
    email: formData.get("email"),
    contactNo: formData.get("contactNo"),
    isActive: formData.get("isActive") ?? "false",
    locationStatus: formData.get("locationStatus") ?? "office",
    travelDetails: formData.get("travelDetails"),
    travelDestination: formData.get("travelDestination"),
    travelStartDate: formData.get("travelStartDate"),
    travelEndDate: formData.get("travelEndDate"),
    photoBase64: formData.get("photoBase64") as string | null
  };
}

async function processPhotoUpload(photoBase64: string | null | undefined): Promise<string | undefined> {
  if (!photoBase64) return undefined;
  
  try {
    const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1000)}.webp`;
    const uploadDir = path.join(process.cwd(), "public/uploads/personnel");
    
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, fileName), buffer);
    
    return `/uploads/personnel/${fileName}`;
  } catch (error) {
    console.error("Failed to process photo upload:", error);
    return undefined;
  }
}

export async function createPersonnelAction(formData: FormData) {
  const user = await requirePermission("create", "personnel");
  const inputData = personnelInputFromFormData(formData);
  const parsed = createPersonnelSchema.safeParse(inputData);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Personnel data is invalid.");
  }

  const photoUrl = await processPhotoUpload(inputData.photoBase64);

  const personnel = await db.personnel.create({
    data: {
      ...parsed.data,
      slug: parsed.data.fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      ...(photoUrl ? { photoUrl } : {})
    }
  });

  await writeAuditLog({
    userId: user.id,
    action: "CREATE",
    entityType: "Personnel",
    entityId: personnel.id,
    newValueJson: personnel
  });

  revalidatePath("/personnel");
}

export async function updatePersonnelAction(formData: FormData) {
  const user = await requirePermission("update", "personnel");
  const inputData = personnelInputFromFormData(formData);
  const parsed = updatePersonnelSchema.safeParse(inputData);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Personnel data is invalid.");
  }

  const oldPersonnel = await db.personnel.findUnique({
    where: {
      id: parsed.data.id
    }
  });

  if (!oldPersonnel) {
    throw new Error("Personnel record was not found.");
  }

  const photoUrl = await processPhotoUpload(inputData.photoBase64);

  const personnel = await db.personnel.update({
    where: {
      id: parsed.data.id
    },
    data: {
      employeeNo: parsed.data.employeeNo,
      fullName: parsed.data.fullName,
      position: parsed.data.position,
      section: parsed.data.section,
      email: parsed.data.email,
      contactNo: parsed.data.contactNo,
      isActive: parsed.data.isActive,
      locationStatus: parsed.data.locationStatus,
      travelDetails: parsed.data.travelDetails,
      travelDestination: parsed.data.travelDestination,
      travelStartDate: parsed.data.travelStartDate,
      travelEndDate: parsed.data.travelEndDate,
      slug: parsed.data.fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      ...(photoUrl ? { photoUrl } : {})
    }
  });

  await writeAuditLog({
    userId: user.id,
    action: "UPDATE",
    entityType: "Personnel",
    entityId: personnel.id,
    oldValueJson: oldPersonnel,
    newValueJson: personnel
  });

  revalidatePath("/personnel");
}

export async function softDeletePersonnelAction(formData: FormData) {
  const user = await requirePermission("manage", "personnel");
  
  const personnelId = formData.get("id") as string;
  const archiveReason = formData.get("archiveReason") as string | null;
  const archiveDateString = formData.get("archiveDate") as string | null;
  const archiveDate = archiveDateString ? new Date(archiveDateString) : null;

  if (!personnelId) {
    throw new Error("Personnel ID is missing.");
  }

  const oldPersonnel = await db.personnel.findUnique({
    where: { id: personnelId }
  });

  if (!oldPersonnel) {
    throw new Error("Personnel record was not found.");
  }

  const personnel = await db.personnel.update({
    where: { id: personnelId },
    data: { 
      isActive: false,
      archiveReason,
      archiveDate
    }
  });

  await writeAuditLog({
    userId: user.id,
    action: "SOFT_DELETE",
    entityType: "Personnel",
    entityId: personnelId,
    oldValueJson: oldPersonnel,
    newValueJson: personnel
  });

  revalidatePath("/personnel");
  redirect("/personnel");
}

export async function hardDeletePersonnelAction(personnelId: string) {
  const user = await requirePermission("manage", "personnel");

  if (user.role !== "SUPER_ADMIN") {
    throw new Error("Only Super Admin can permanently delete records.");
  }

  const oldPersonnel = await db.personnel.findUnique({
    where: { id: personnelId }
  });

  if (!oldPersonnel) {
    throw new Error("Personnel record was not found.");
  }

  await db.personnel.delete({
    where: { id: personnelId }
  });

  await writeAuditLog({
    userId: user.id,
    action: "HARD_DELETE",
    entityType: "Personnel",
    entityId: personnelId,
    oldValueJson: oldPersonnel
  });

  revalidatePath("/personnel");
  redirect("/personnel");
}
