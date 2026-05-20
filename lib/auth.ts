import "server-only";

import bcrypt from "bcryptjs";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import type { UserRole } from "@prisma/client";

const sessionCookieName = "ioms_session";
const sessionMaxAgeSeconds = 60 * 60 * 8;

type SessionPayload = {
  userId: string;
  expiresAt: number;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  personnelId: string | null;
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

export async function getCurrentUser(): Promise<AuthUser | null> {
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
      email: true,
      role: true,
      personnelId: true,
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
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
