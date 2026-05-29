import { notFound, redirect } from "next/navigation";
import { updateProjectAction } from "@/app/(app)/projects/actions";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { canEditProject } from "@/lib/project-access";
import { ProjectForm } from "@/components/projects/ProjectForm";

type EditProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const [{ slug }, user] = await Promise.all([params, requireUser()]);

  const project = await db.project.findUnique({
    where: { slug },
    include: {
      personnel: true
    }
  });

  if (!project) {
    notFound();
  }

  if (!(await canEditProject(user, project.id))) {
    redirect(`/projects/${project.slug}`);
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
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">Edit Project</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update the project profile and personnel assignments.</p>
      </div>
      <ProjectForm action={updateProjectAction} personnel={personnel} project={project} submitLabel="Save project" />
    </div>
  );
}
