import { notFound, redirect } from "next/navigation";
import { updateProjectAction } from "@/app/(app)/projects/actions";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { canEditProject } from "@/lib/project-access";
import { ProjectForm } from "@/components/projects/ProjectForm";

type EditProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const [{ id }, user] = await Promise.all([params, requireUser()]);

  if (!(await canEditProject(user, id))) {
    redirect(`/projects/${id}`);
  }

  const [project, personnel] = await Promise.all([
    db.project.findUnique({
      where: {
        id
      },
      include: {
        personnel: true
      }
    }),
    db.personnel.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        fullName: "asc"
      }
    })
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950">Edit Project</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update the project profile and personnel assignments.</p>
      </div>
      <ProjectForm action={updateProjectAction} personnel={personnel} project={project} submitLabel="Save project" />
    </div>
  );
}
