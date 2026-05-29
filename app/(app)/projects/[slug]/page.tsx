import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { checkUserPermission } from "@/lib/permissions";
import { canEditProject as canEditProjectAccess } from "@/lib/project-access";
import { ProjectDeleteButtons } from "@/components/projects/ProjectDeleteButtons";
import { MonthlyProjectDetails } from "@/components/projects/MonthlyProjectDetails";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";



type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const [{ slug }, user] = await Promise.all([params, getCurrentUser()]);

  const project = await db.project.findUnique({
    where: { slug },
    include: {
      personnel: {
        include: { personnel: true },
        orderBy: { isFocalPerson: "desc" },
      },
      cycles: {
        include: {
          tasks: {
            include: { assignedPersonnel: true },
            orderBy: [{ order: "asc" }, { deadline: "asc" }],
          },
        },
        orderBy: [{ year: "asc" }, { month: "asc" }, { createdAt: "asc" }],
      },
      remarks: {
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) notFound();

  const canEditThisProject = await canEditProjectAccess(user, project.id);
  const canDeleteThisProject = checkUserPermission(user, "manage", "project");


  const allPersonnel = await db.personnel.findMany({
    where: { isActive: true },
    orderBy: { fullName: "asc" },
  });

  // We do not need the serialized project since MonthlyProjectDetails accepts raw data directly.

  return (
    <div className="space-y-6">
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
          <Link href="/projects">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </div>

      {/* ── Monthly Monitoring Board ─────────────────────────────────────── */}
      <div className="mt-6">
        <MonthlyProjectDetails project={project} canEdit={canEditThisProject} allPersonnel={allPersonnel} />
      </div>

      {canDeleteThisProject && (
        <div className="mt-12 flex items-center justify-end border-t border-border pt-6 pb-4">
          <ProjectDeleteButtons
            projectId={project.id}
            isSuperAdmin={user?.role === "SUPER_ADMIN"}
            isActive={project.isActive}
          />
        </div>
      )}
    </div>
  );
}
