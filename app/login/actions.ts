"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { comparePasswords, createUserSession } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { loginSchema } from "@/lib/validators";

function loginRedirect(error: string, nextPath: string): never {
  const params = new URLSearchParams({
    error,
    next: nextPath
  });

  redirect(`/login?${params.toString()}`);
}

function getSafeNextPath(value: FormDataEntryValue | null) {
  const nextPath = typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
  return nextPath === "/login" ? "/dashboard" : nextPath;
}

export async function loginAction(formData: FormData) {
  const nextPath = getSafeNextPath(formData.get("next"));
  const parsed = loginSchema.safeParse({
    identifier: formData.get("identifier") ?? formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    loginRedirect(parsed.error.issues[0]?.message ?? "Check your username/email and password.", nextPath);
  }

  const user = await db.user.findFirst({
    where: {
      OR: [
        { email: parsed.data.identifier },
        { username: parsed.data.identifier }
      ]
    }
  });

  if (!user?.isActive) {
    loginRedirect("Invalid username/email or password.", nextPath);
  }

  const isValidPassword = await comparePasswords(parsed.data.password, user.passwordHash);

  if (!isValidPassword) {
    loginRedirect("Invalid username/email or password.", nextPath);
  }

  await db.user.update({
    where: {
      id: user.id
    },
    data: {
      lastLoginAt: new Date()
    }
  });

  await createUserSession(user.id);
  await writeAuditLog({
    userId: user.id,
    action: "LOGIN",
    entityType: "User",
    entityId: user.id
  });

  if (user.mustChangePassword) {
    redirect(`/change-password?next=${encodeURIComponent(nextPath)}`);
  }

  redirect(nextPath);
}
