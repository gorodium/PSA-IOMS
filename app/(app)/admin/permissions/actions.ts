"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import type { Prisma } from "@prisma/client";

type PermissionPayload = {
  projectId: string;
  canView: boolean;
  canEdit: boolean;
  canSubmit: boolean;
  canApprove: boolean;
  canManage: boolean;
};

export async function saveProjectPermissionsAction(userId: string, permissions: PermissionPayload[]) {
  const admin = await requireSuperAdmin();

  if (!userId) {
    throw new Error("User ID is required.");
  }

  // Use a transaction to update permissions
  await db.$transaction(async (tx) => {
    // 1. Delete all existing permissions for this user
    await tx.projectPermission.deleteMany({
      where: { userId }
    });

    // 2. Insert the new ones where at least one permission is true
    const toInsert = permissions.filter(p => p.canView || p.canEdit || p.canSubmit || p.canApprove || p.canManage);
    
    if (toInsert.length > 0) {
      await tx.projectPermission.createMany({
        data: toInsert.map(p => ({
          userId,
          projectId: p.projectId,
          canView: p.canView,
          canEdit: p.canEdit,
          canSubmit: p.canSubmit,
          canApprove: p.canApprove,
          canManage: p.canManage,
          assignedById: admin.id
        }))
      });
    }
  });

  await writeAuditLog({
    userId: admin.id,
    action: "UPDATE_PROJECT_PERMISSIONS",
    entityType: "User",
    entityId: userId,
    newValueJson: permissions as unknown as Prisma.InputJsonValue
  });

  revalidatePath("/admin/permissions");
}
