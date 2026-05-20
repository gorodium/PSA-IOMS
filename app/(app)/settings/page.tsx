import { redirect } from "next/navigation";
import { UserPlus, UserX } from "lucide-react";
import { createAdminAction, deactivateAdminAction, updateProjectEditorAssignmentsAction } from "@/app/(app)/settings/actions";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { canManageSettings } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function SettingsPage() {
  const user = await requireUser();

  if (!canManageSettings(user)) {
    redirect("/dashboard");
  }

  const [admins, projects] = await Promise.all([
    db.user.findMany({
      where: {
        role: "ADMIN"
      },
      include: {
        editableProjects: true
      },
      orderBy: {
        name: "asc"
      }
    }),
    db.project.findMany({
      orderBy: {
        name: "asc"
      },
      select: {
        id: true,
        name: true,
        code: true
      }
    })
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage admin accounts and assign project edit access.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add or Update Admin</CardTitle>
          <CardDescription>Creating an admin with an existing email updates that admin account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createAdminAction} className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto_auto]">
            <div className="space-y-2">
              <Label htmlFor="adminName">Name</Label>
              <Input id="adminName" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Email</Label>
              <Input id="adminEmail" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminPassword">Password</Label>
              <Input id="adminPassword" name="password" type="password" required />
            </div>
            <label className="flex items-end gap-2 pb-3 text-sm font-medium">
              <input type="checkbox" name="isActive" defaultChecked className="rounded border-input text-primary focus:ring-ring" />
              Active
            </label>
            <div className="flex items-end">
              <Button type="submit">
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Save admin
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Edit Access</CardTitle>
          <CardDescription>Check the projects each admin is allowed to edit.</CardDescription>
        </CardHeader>
        <CardContent>
          {admins.length === 0 ? (
            <div className="rounded-md border bg-slate-50 p-6 text-sm text-muted-foreground">No admin users have been created yet.</div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-56">Admin</TableHead>
                    <TableHead className="min-w-[520px]">Editable projects</TableHead>
                    <TableHead className="text-right">Remove</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin) => {
                    const assignedProjectIds = new Set(admin.editableProjects.map((assignment) => assignment.projectId));

                    return (
                      <TableRow key={admin.id}>
                        <TableCell>
                          <div className="font-medium text-slate-950">{admin.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {admin.email} · {admin.isActive ? "Active" : "Inactive"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <form action={updateProjectEditorAssignmentsAction} className="space-y-3">
                            <input type="hidden" name="userId" value={admin.id} />
                            <div className="grid max-h-52 gap-2 overflow-y-auto rounded-md border bg-slate-50 p-3 md:grid-cols-2">
                              {projects.map((project) => (
                                <label key={project.id} className="flex items-start gap-2 text-sm">
                                  <input
                                    type="checkbox"
                                    name="projectIds"
                                    value={project.id}
                                    defaultChecked={assignedProjectIds.has(project.id)}
                                    className="mt-1 rounded border-input text-primary focus:ring-ring"
                                  />
                                  <span>
                                    {project.name}
                                    {project.code ? <span className="text-muted-foreground"> · {project.code}</span> : null}
                                  </span>
                                </label>
                              ))}
                            </div>
                            <Button type="submit" variant="outline" size="sm">
                              Save project checks
                            </Button>
                          </form>
                        </TableCell>
                        <TableCell className="text-right">
                          <form action={deactivateAdminAction}>
                            <input type="hidden" name="userId" value={admin.id} />
                            <Button type="submit" variant="destructive" size="sm">
                              <UserX className="h-4 w-4" aria-hidden="true" />
                              Disable
                            </Button>
                          </form>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
