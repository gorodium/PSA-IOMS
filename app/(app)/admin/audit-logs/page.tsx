import { db } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/auth";
import { AuditLogsTable, type AuditLogRow } from "@/components/admin/audit-logs/AuditLogsTable";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type AuditLogsPageProps = {
  searchParams?: Promise<{
    search?: string;
    action?: string;
    entityType?: string;
  }>;
};

export default async function AdminAuditLogsPage({ searchParams }: AuditLogsPageProps) {
  await requireSuperAdmin();

  const params = await searchParams;
  const search = params?.search?.trim();
  const actionParam = params?.action;
  const entityType = params?.entityType;

  const where: Prisma.AuditLogWhereInput = {
    ...(search && {
      OR: [
        { action: { contains: search, mode: "insensitive" } },
        { entityType: { contains: search, mode: "insensitive" } },
        { entityId: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { username: { contains: search, mode: "insensitive" } } }
      ]
    }),
    ...(actionParam && actionParam !== "ALL" && { action: actionParam }),
    ...(entityType && entityType !== "ALL" && { entityType: entityType })
  };

  const logs = await db.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100, // Limit to 100 for performance on this simple view
    include: {
      user: {
        select: {
          name: true,
          username: true
        }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">Audit Logs</h1>
        <p className="mt-1 text-sm text-muted-foreground">View recent system activity and security events.</p>
      </div>

      <AuditLogsTable logs={logs as AuditLogRow[]} />
    </div>
  );
}
