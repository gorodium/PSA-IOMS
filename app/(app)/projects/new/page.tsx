import { redirect } from "next/navigation";
import { createProjectAction } from "@/app/(app)/projects/actions";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { checkUserPermission } from "@/lib/permissions";
import { ProjectForm } from "@/components/projects/ProjectForm";

export default async function NewProjectPage() {
  const user = await requireUser();

  if (!checkUserPermission(user, "create", "project")) {
    redirect("/projects");
  }

  const personnel = await db.personnel.findMany({
    where: {
      isActive: true
    },
    orderBy: {
      fullName: "asc"
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950">Add Project</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create a Phase 1 monitoring record.</p>
      </div>
      <ProjectForm action={createProjectAction} personnel={personnel} submitLabel="Create project" />
    </div>
  );
}
