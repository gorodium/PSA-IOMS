"use server";

import { revalidatePath } from "next/cache";
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
    isActive: formData.get("isActive") ?? "false"
  };
}

export async function createPersonnelAction(formData: FormData) {
  const user = await requirePermission("create", "personnel");
  const parsed = createPersonnelSchema.safeParse(personnelInputFromFormData(formData));

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Personnel data is invalid.");
  }

  const personnel = await db.personnel.create({
    data: parsed.data
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
  const parsed = updatePersonnelSchema.safeParse(personnelInputFromFormData(formData));

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
      isActive: parsed.data.isActive
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
