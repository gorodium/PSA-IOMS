"use server";

import { redirect } from "next/navigation";
import { clearUserSession, getCurrentUser } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";

export async function logoutAction() {
  const user = await getCurrentUser();

  if (user) {
    await writeAuditLog({
      userId: user.id,
      action: "LOGOUT",
      entityType: "User",
      entityId: user.id
    });
  }

  await clearUserSession();
  redirect("/login");
}
