import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { checkUserPermission } from "@/lib/permissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/format";

export default async function AuditLogsPage() {
  const user = await requireUser();

  if (!checkUserPermission(user, "view", "auditLog")) {
    redirect("/dashboard");
  }

  const auditLogs = await db.auditLog.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 100
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950">Audit Logs</h1>
        <p className="mt-1 text-sm text-muted-foreground">Latest administrative and monitoring actions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Showing the latest 100 audit entries.</CardDescription>
        </CardHeader>
        <CardContent>
          {auditLogs.length === 0 ? (
            <div className="rounded-md border bg-slate-50 p-6 text-sm text-muted-foreground">No audit logs have been recorded.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity type</TableHead>
                  <TableHead>Entity ID</TableHead>
                  <TableHead>IP address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{formatDateTime(log.createdAt)}</TableCell>
                    <TableCell>
                      <div className="font-medium text-slate-950">{log.user?.name ?? "System"}</div>
                      <div className="text-xs text-muted-foreground">{log.user?.email ?? "No user account"}</div>
                    </TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.entityType}</TableCell>
                    <TableCell className="font-mono text-xs">{log.entityId}</TableCell>
                    <TableCell>{log.ipAddress ?? "Not captured"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
