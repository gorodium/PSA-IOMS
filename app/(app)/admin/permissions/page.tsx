import { db } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/auth";
import { ProjectPermissionsList } from "@/components/admin/permissions/ProjectPermissionsList";

export const dynamic = "force-dynamic";

type PermissionsPageProps = {
  searchParams?: Promise<{
    userId?: string;
  }>;
};

export default async function AdminPermissionsPage({ searchParams }: PermissionsPageProps) {
  await requireSuperAdmin();

  const params = await searchParams;
  const selectedUserId = params?.userId;

  const users = await db.user.findMany({
    where: { isActive: true },
    select: { id: true, name: true, username: true, role: true },
    orderBy: { name: "asc" }
  });

  const projects = await db.project.findMany({
    where: { isActive: true },
    select: { id: true, name: true, code: true, category: true },
    orderBy: { name: "asc" }
  });

  let userPermissions: { projectId: string; canView: boolean; canEdit: boolean; canSubmit: boolean; canApprove: boolean; canManage: boolean }[] = [];
  if (selectedUserId) {
    userPermissions = await db.projectPermission.findMany({
      where: { userId: selectedUserId }
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">Project Permissions</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage granular project-level access for individual users.</p>
      </div>

      <ProjectPermissionsList 
        users={users} 
        projects={projects} 
        selectedUserId={selectedUserId} 
        initialPermissions={userPermissions} 
      />
    </div>
  );
}
