"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { saveProjectPermissionsAction } from "@/app/(app)/admin/permissions/actions";
import { Loader2 } from "lucide-react";

type User = { id: string; name: string; username: string; role: string };
type Project = { id: string; name: string; code: string | null; category: string };
type Permission = { projectId: string; canView: boolean; canEdit: boolean; canSubmit: boolean; canApprove: boolean; canManage: boolean };

type Props = {
  users: User[];
  projects: Project[];
  selectedUserId?: string;
  initialPermissions: Permission[];
};

export function ProjectPermissionsList({ users, projects, selectedUserId, initialPermissions }: Props) {
  const router = useRouter();
  const [permissions, setPermissions] = useState<Record<string, Permission>>(
    initialPermissions.reduce((acc, p) => ({ ...acc, [p.projectId]: p }), {})
  );
  const [isSaving, setIsSaving] = useState(false);

  function handleUserChange(userId: string) {
    if (userId === selectedUserId) return;
    router.push(`/admin/permissions?userId=${userId}`);
  }

  function handleToggle(projectId: string, field: keyof Permission, value: boolean) {
    setPermissions((prev) => {
      const current = prev[projectId] || { projectId, canView: false, canEdit: false, canSubmit: false, canApprove: false, canManage: false };
      const updated = { ...current, [field]: value };
      
      // Auto-check View if others are checked
      if (value && field !== "canView") {
        updated.canView = true;
      }
      // If Manage is checked, everything else is effectively true via backend logic, but let's check them visually
      if (field === "canManage" && value) {
        updated.canView = true;
        updated.canEdit = true;
        updated.canSubmit = true;
        updated.canApprove = true;
      }

      return { ...prev, [projectId]: updated };
    });
  }

  async function handleSave() {
    if (!selectedUserId) return;
    setIsSaving(true);
    try {
      const payload = Object.values(permissions);
      await saveProjectPermissionsAction(selectedUserId, payload);
      alert("Permissions saved successfully.");
    } catch (e) {
      const err = e as { message?: string };
      alert(err.message || "Failed to save permissions.");
    } finally {
      setIsSaving(false);
    }
  }

  const selectedUser = users.find(u => u.id === selectedUserId);

  return (
    <div className="space-y-6">
      <div className="flex max-w-md flex-col gap-2">
        <label className="text-sm font-medium">Select User</label>
        <Select value={selectedUserId || ""} onChange={(e) => handleUserChange(e.target.value)}>
          <option value="" disabled>Choose a user...</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.username}) - {u.role}
            </option>
          ))}
        </Select>
      </div>

      {selectedUserId && (
        <div className="rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
            <h2 className="font-medium">Permissions for {selectedUser?.name}</h2>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Permissions
            </Button>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white dark:bg-slate-950 shadow-sm z-10">
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead className="w-[100px] text-center">View</TableHead>
                  <TableHead className="w-[100px] text-center">Edit</TableHead>
                  <TableHead className="w-[100px] text-center">Submit</TableHead>
                  <TableHead className="w-[100px] text-center">Approve</TableHead>
                  <TableHead className="w-[100px] text-center">Manage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => {
                  const p = permissions[project.id] || { canView: false, canEdit: false, canSubmit: false, canApprove: false, canManage: false };
                  return (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div className="font-medium">{project.code || project.name}</div>
                        <div className="text-xs text-muted-foreground">{project.name}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox checked={p.canView} onCheckedChange={(val) => handleToggle(project.id, "canView", !!val)} />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox checked={p.canEdit} onCheckedChange={(val) => handleToggle(project.id, "canEdit", !!val)} />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox checked={p.canSubmit} onCheckedChange={(val) => handleToggle(project.id, "canSubmit", !!val)} />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox checked={p.canApprove} onCheckedChange={(val) => handleToggle(project.id, "canApprove", !!val)} />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox checked={p.canManage} onCheckedChange={(val) => handleToggle(project.id, "canManage", !!val)} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
