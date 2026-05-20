"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser, hashPassword } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { canManageSettings } from "@/lib/permissions";
import { adminUserSchema, projectEditorAssignmentSchema } from "@/lib/validators";

async function requireSuperAdmin() {
  const user = await requireUser();

  if (!canManageSettings(user)) {
    throw new Error("Only Super Admin users can manage settings.");
  }

  return user;
}

export async function createAdminAction(formData: FormData) {
  const user = await requireSuperAdmin();
  const parsed = adminUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    isActive: formData.get("isActive") ?? "false"
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Admin data is invalid.");
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const admin = await db.user.upsert({
    where: {
      email: parsed.data.email
    },
    update: {
      name: parsed.data.name,
      passwordHash,
      role: "ADMIN",
      isActive: parsed.data.isActive
    },
    create: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: "ADMIN",
      isActive: parsed.data.isActive
    }
  });

  await writeAuditLog({
    userId: user.id,
    action: "UPSERT_ADMIN",
    entityType: "User",
    entityId: admin.id,
    newValueJson: {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive
    }
  });

  revalidatePath("/settings");
}

export async function deactivateAdminAction(formData: FormData) {
  const user = await requireSuperAdmin();
  const adminId = String(formData.get("userId") ?? "");

  if (!adminId) {
    throw new Error("Admin user is required.");
  }

  const admin = await db.user.update({
    where: {
      id: adminId,
      role: "ADMIN"
    },
    data: {
      isActive: false,
      editableProjects: {
        deleteMany: {}
      }
    }
  });

  await writeAuditLog({
    userId: user.id,
    action: "DEACTIVATE_ADMIN",
    entityType: "User",
    entityId: admin.id
  });

  revalidatePath("/settings");
}

export async function updateProjectEditorAssignmentsAction(formData: FormData) {
  const user = await requireSuperAdmin();
  const parsed = projectEditorAssignmentSchema.safeParse({
    userId: formData.get("userId"),
    projectIds: formData.getAll("projectIds").filter((value): value is string => typeof value === "string")
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Project editor assignment data is invalid.");
  }

  await db.$transaction(async (tx) => {
    await tx.projectEditor.deleteMany({
      where: {
        userId: parsed.data.userId
      }
    });

    if (parsed.data.projectIds.length > 0) {
      await tx.projectEditor.createMany({
        data: parsed.data.projectIds.map((projectId) => ({
          userId: parsed.data.userId,
          projectId
        })),
        skipDuplicates: true
      });
    }
  });

  await writeAuditLog({
    userId: user.id,
    action: "UPDATE_PROJECT_EDITORS",
    entityType: "User",
    entityId: parsed.data.userId,
    newValueJson: {
      projectIds: parsed.data.projectIds
    }
  });

  revalidatePath("/settings");
}
