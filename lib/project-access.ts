import "server-only";

import type { AuthUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function canEditProject(user: AuthUser | null, projectId: string) {
  if (!user?.isActive) {
    return false;
  }

  if (user.role === "SUPER_ADMIN") {
    return true;
  }

  if (user.personnelId) {
    const isAssigned = await db.projectPersonnel.findFirst({
      where: {
        projectId,
        personnelId: user.personnelId
      }
    });
    
    if (isAssigned) {
      return true;
    }
  }

  const permission = await db.projectPermission.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId: user.id
      }
    }
  });

  return Boolean(permission && (permission.canEdit || permission.canManage));
}

export async function canManageProject(user: AuthUser | null, projectId: string) {
  if (!user?.isActive) {
    return false;
  }

  if (user.role === "SUPER_ADMIN") {
    return true;
  }

  const permission = await db.projectPermission.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId: user.id
      }
    }
  });

  return Boolean(permission && permission.canManage);
}

export async function canViewProject(user: AuthUser | null, projectId: string) {
  if (!user?.isActive) {
    return false;
  }

  if (user.role === "SUPER_ADMIN" || user.role === "ADMIN" || user.role === "SUPERVISOR") {
    return true;
  }

  const permission = await db.projectPermission.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId: user.id
      }
    }
  });

  return Boolean(permission && (permission.canView || permission.canEdit || permission.canManage));
}
