import "server-only";

import bcrypt from "bcryptjs";
import { createHmac, timingSafeEqual } from "crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import type { UserRole } from "@prisma/client";

const sessionCookieName = "ioms_session";
const sessionMaxAgeSeconds = 60 * 60 * 24 * 365; // 1 year

type SessionPayload = {
  userId: string;
  expiresAt: number;
};

export type AuthUser = {
  id: string;
  name: string;
  username: string;
  email: string | null;
  role: UserRole;
  personnelId: string | null;
  employeeId: string | null;
  section: string | null;
  mustChangePassword: boolean;
  isActive: boolean;
  personnel: {
    id: string;
    fullName: string;
    section: string;
  } | null;
};

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET is required in production.");
  }

  return secret ?? "development-only-ioms-session-secret";
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function encodePayload(payload: SessionPayload) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function decodePayload(value: string): SessionPayload | null {
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Partial<SessionPayload>;

    if (typeof parsed.userId !== "string" || typeof parsed.expiresAt !== "number") {
      return null;
    }

    return {
      userId: parsed.userId,
      expiresAt: parsed.expiresAt
    };
  } catch {
    return null;
  }
}

function createSessionToken(userId: string) {
  const payload = encodePayload({
    userId,
    expiresAt: Date.now() + sessionMaxAgeSeconds * 1000
  });

  return `${payload}.${sign(payload)}`;
}

function verifySessionToken(token: string | undefined) {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = sign(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  const decoded = decodePayload(payload);
  if (!decoded || decoded.expiresAt < Date.now()) {
    return null;
  }

  return decoded;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function comparePasswords(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function createUserSession(userId: string) {
  const cookieStore = await cookies();

  cookieStore.set(sessionCookieName, createSessionToken(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: sessionMaxAgeSeconds,
    path: "/"
  });
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
}

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const cookieStore = await cookies();
  const session = verifySessionToken(cookieStore.get(sessionCookieName)?.value);

  if (!session) {
    return null;
  }

  const user = await db.user.findUnique({
    where: {
      id: session.userId
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      personnelId: true,
      employeeId: true,
      section: true,
      mustChangePassword: true,
      isActive: true,
      personnel: {
        select: {
          id: true,
          fullName: true,
          section: true
        }
      }
    }
  });

  if (!user?.isActive) {
    return null;
  }

  return user;
});

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }
  
  if (user.mustChangePassword) {
    // Prevent infinite redirect loop if we are already on change password page
    // This requires the caller to handle mustChangePassword, or we can just redirect.
    // For now, we will return the user and let middleware or layout handle it,
    // OR we can redirect here if not explicitly bypassed.
  }

  return user;
}

export async function requireSuperAdmin() {
  const user = await requireUser();
  if (user.role !== "SUPER_ADMIN") {
    throw new Error("You do not have permission to perform this action.");
  }
  return user;
}

export async function requireProjectPermission(projectId: string, permissionType: import("@/lib/permissions").ProjectPermissionType) {
  const user = await requireUser();
  
  if (user.role === "SUPER_ADMIN") {
    return user;
  }

  const permission = await db.projectPermission.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId: user.id
      }
    }
  });

  const { checkProjectPermission } = await import("@/lib/permissions");
  
  if (!checkProjectPermission(user, permission, permissionType)) {
    throw new Error(`You do not have permission to ${permissionType.replace("can", "").toLowerCase()} this project.`);
  }

  return user;
}
