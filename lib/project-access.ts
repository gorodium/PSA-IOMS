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

  if (user.role !== "ADMIN") {
    return false;
  }

  const assignment = await db.projectEditor.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId: user.id
      }
    }
  });

  return Boolean(assignment);
}
