"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSuperAdmin, hashPassword } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import type { UserRole, Prisma } from "@prisma/client";

export async function toggleUserStatusAction(formData: FormData) {
  const admin = await requireSuperAdmin();
  const userId = formData.get("userId")?.toString();
  const isActive = formData.get("isActive") === "true";

  if (!userId) throw new Error("User ID is required.");
  
  if (userId === admin.id) {
    throw new Error("You cannot disable your own account.");
  }

  const user = await db.user.update({
    where: { id: userId },
    data: { isActive }
  });

  await writeAuditLog({
    userId: admin.id,
    action: isActive ? "ENABLE_USER" : "DISABLE_USER",
    entityType: "User",
    entityId: user.id
  });

  revalidatePath("/admin/users");
}

export async function resetUserPasswordAction(formData: FormData) {
  const admin = await requireSuperAdmin();
  const userId = formData.get("userId")?.toString();

  if (!userId) throw new Error("User ID is required.");

  const tempPassword = "ChangeMe123!";
  const passwordHash = await hashPassword(tempPassword);

  const user = await db.user.update({
    where: { id: userId },
    data: { 
      passwordHash,
      mustChangePassword: true 
    }
  });

  await writeAuditLog({
    userId: admin.id,
    action: "ADMIN_RESET_PASSWORD",
    entityType: "User",
    entityId: user.id
  });

  revalidatePath("/admin/users");
}

export async function saveUserAction(formData: FormData) {
  const admin = await requireSuperAdmin();
  
  const id = formData.get("id")?.toString();
  let name = formData.get("name")?.toString();
  const username = formData.get("username")?.toString();
  let email = formData.get("email")?.toString() || null;
  if (email === "") email = null;
  const role = formData.get("role")?.toString() as UserRole;
  
  let personnelId = formData.get("personnelId")?.toString() || null;
  if (personnelId === "NONE") personnelId = null;

  if (!username || !role) {
    throw new Error("Username and role are required.");
  }

  // Look up personnel details if linked
  let employeeId = null;
  let section = null;
  if (personnelId) {
    const personnel = await db.personnel.findUnique({ where: { id: personnelId } });
    if (personnel) {
      employeeId = personnel.employeeNo;
      section = personnel.section;
      if (!name) {
        name = personnel.fullName;
      }
      if (!email && personnel.email) {
        email = personnel.email;
      }
    }
  }

  if (!name) {
    name = username;
  }

  if (id) {
    if (id === admin.id && role !== "SUPER_ADMIN") {
      throw new Error("You cannot remove your own SUPER_ADMIN role.");
    }

    const oldUser = await db.user.findUnique({ where: { id } });

    const user = await db.user.update({
      where: { id },
      data: {
        name,
        username,
        email,
        role,
        personnelId,
        employeeId,
        section
      }
    });

    await writeAuditLog({
      userId: admin.id,
      action: "UPDATE_USER",
      entityType: "User",
      entityId: user.id,
      oldValueJson: oldUser as unknown as Prisma.InputJsonValue,
      newValueJson: user as unknown as Prisma.InputJsonValue
    });
  } else {
    // Generate temporary password
    const tempPassword = "ChangeMe123!";
    const passwordHash = await hashPassword(tempPassword);

    const user = await db.user.create({
      data: {
        name,
        username,
        email,
        passwordHash,
        role,
        personnelId,
        employeeId,
        section,
        mustChangePassword: true,
        isActive: true
      }
    });

    await writeAuditLog({
      userId: admin.id,
      action: "CREATE_USER",
      entityType: "User",
      entityId: user.id,
      newValueJson: user as unknown as Prisma.InputJsonValue
    });
  }

  revalidatePath("/admin/users");
}
