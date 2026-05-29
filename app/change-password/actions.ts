"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { comparePasswords, hashPassword, requireUser } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";

function redirectWithError(error: string, nextPath: string): never {
  const params = new URLSearchParams({
    error,
    next: nextPath
  });
  redirect(`/change-password?${params.toString()}`);
}

export async function changePasswordAction(formData: FormData) {
  const user = await requireUser();
  const nextPath = formData.get("next")?.toString() || "/dashboard";

  const currentPassword = formData.get("currentPassword")?.toString();
  const newPassword = formData.get("newPassword")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!currentPassword || !newPassword || !confirmPassword) {
    redirectWithError("All fields are required.", nextPath);
  }

  if (newPassword !== confirmPassword) {
    redirectWithError("New passwords do not match.", nextPath);
  }

  if (newPassword.length < 8) {
    redirectWithError("Password must be at least 8 characters long.", nextPath);
  }

  const dbUser = await db.user.findUnique({
    where: { id: user.id }
  });

  if (!dbUser) {
    redirectWithError("User not found.", nextPath);
  }

  const isValidPassword = await comparePasswords(currentPassword, dbUser.passwordHash);

  if (!isValidPassword) {
    redirectWithError("Incorrect current password.", nextPath);
  }

  const passwordHash = await hashPassword(newPassword);

  await db.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      mustChangePassword: false
    }
  });

  await writeAuditLog({
    userId: user.id,
    action: "UPDATE_PASSWORD",
    entityType: "User",
    entityId: user.id
  });

  redirect(nextPath);
}
