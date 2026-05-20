import Link from "next/link";
import { Database, FileClock, ShieldCheck, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { checkUserPermission } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminPage() {
  const user = await requireUser();

  if (!checkUserPermission(user, "view", "admin")) {
    redirect("/dashboard");
  }

  const [usersCount, auditLogCount] = await Promise.all([db.user.count(), db.auditLog.count()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950">Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">Basic administrative references for Phase 1.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" aria-hidden="true" />
              <CardTitle>Users</CardTitle>
            </div>
            <CardDescription>{usersCount} user account records.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            User management beyond the seeded administrator is outside the Phase 1 scope.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileClock className="h-5 w-5 text-primary" aria-hidden="true" />
              <CardTitle>Audit Logs</CardTitle>
            </div>
            <CardDescription>{auditLogCount} audit entries recorded.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/admin/audit-logs">View audit logs</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-primary" aria-hidden="true" />
              <CardTitle>Seed Data</CardTitle>
            </div>
            <CardDescription>Sample projects, personnel, cycles, and tasks.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Run <span className="font-mono">npx prisma db seed</span> after migration to load the Phase 1 sample dataset.
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
            <CardTitle>Phase 1 Scope Control</CardTitle>
          </div>
          <CardDescription>Modules intentionally not implemented in this release.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <p>Vehicle scheduling is not included.</p>
          <p>Convocation assignment is not included.</p>
          <p>Full Gantt charts are not included.</p>
          <p>PDF export and email notifications are not included.</p>
        </CardContent>
      </Card>
    </div>
  );
}
