import "server-only";

import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

function toAuditJson(value: unknown) {
  if (value === undefined) {
    return undefined;
  }

  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export async function writeAuditLog(input: {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  oldValueJson?: unknown;
  newValueJson?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  const data: Prisma.AuditLogUncheckedCreateInput = {
    userId: input.userId ?? null,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    ipAddress: input.ipAddress ?? null,
    userAgent: input.userAgent ?? null
  };

  const oldValueJson = toAuditJson(input.oldValueJson);
  const newValueJson = toAuditJson(input.newValueJson);

  if (oldValueJson !== undefined) {
    data.oldValueJson = oldValueJson;
  }

  if (newValueJson !== undefined) {
    data.newValueJson = newValueJson;
  }

  await db.auditLog.create({ data });
}
