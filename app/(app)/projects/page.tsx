import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { ProjectStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { checkUserPermission } from "@/lib/permissions";
import {
  deriveProjectStatus,
  getFocalPersonNames,
  getNearestDeadline,
  getProjectProgress,
  getResponsiblePersonnelNames,
  type MonitoringProject
} from "@/lib/project-metrics";
import { formatEnumLabel } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ProjectTable, type ProjectTableRow } from "@/components/projects/ProjectTable";
import { projectCategoryOptions } from "@/lib/taxonomy";

type ProjectsPageProps = {
  searchParams?: Promise<{
    search?: string;
    status?: string;
    category?: string;
    year?: string;
    personnel?: string;
    active?: string;
  }>;
};

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const [params, user] = await Promise.all([searchParams, requireUser()]);
  const today = new Date();
  const canCreateProject = checkUserPermission(user, "create", "project");

  const [projects, personnel] = await Promise.all([
    db.project.findMany({
      include: {
        personnel: {
          include: {
            personnel: {
              select: {
                id: true,
                fullName: true
              }
            }
          }
        },
        cycles: {
          include: {
            tasks: {
              include: {
                assignedPersonnel: {
                  select: {
                    fullName: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: "desc"
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

  const monitoringProjects = projects as MonitoringProject[];
  const years = Array.from(new Set(monitoringProjects.map((project) => project.year))).sort((a, b) => b - a);
  const searchText = params?.search?.trim().toLowerCase() ?? "";

  const rows: ProjectTableRow[] = monitoringProjects
    .filter((project) => {
      const derivedStatus = deriveProjectStatus(project, today);
      const matchesSearch = searchText.length === 0 || project.name.toLowerCase().includes(searchText);
      const matchesStatus = !params?.status || params.status === "ALL" || derivedStatus === params.status;
      const matchesCategory = !params?.category || params.category === "ALL" || project.category === params.category;
      const matchesYear = !params?.year || params.year === "ALL" || project.year === Number(params.year);
      const matchesPersonnel =
        !params?.personnel ||
        params.personnel === "ALL" ||
        project.personnel.some((assignment) => assignment.personnel.fullName && assignment.personnel.fullName === params.personnel);
      const matchesActive =
        !params?.active ||
        params.active === "ALL" ||
        (params.active === "ACTIVE" && project.isActive) ||
        (params.active === "INACTIVE" && !project.isActive);

      return matchesSearch && matchesStatus && matchesCategory && matchesYear && matchesPersonnel && matchesActive;
    })
    .map((project) => ({
      id: project.id,
      name: project.name,
      category: project.category,
      year: project.year,
      focalPerson: getFocalPersonNames(project),
      otherInvolvedPersonnel: getResponsiblePersonnelNames(project),
      progress: getProjectProgress(project),
      status: deriveProjectStatus(project, today),
      nearestDeadline: getNearestDeadline(project),
      updatedAt: project.updatedAt
    }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-slate-950">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Search, filter, and review monitored project status.</p>
        </div>
        {canCreateProject ? (
          <Button asChild>
            <Link href="/projects/new">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add project
            </Link>
          </Button>
        ) : null}
      </div>

      <form className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,1fr))_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input name="search" placeholder="Search project name" defaultValue={params?.search ?? ""} className="pl-9" />
        </div>
        <Select name="status" defaultValue={params?.status ?? "ALL"} aria-label="Status filter">
          <option value="ALL">All statuses</option>
          {Object.values(ProjectStatus).map((status) => (
            <option key={status} value={status}>
              {formatEnumLabel(status)}
            </option>
          ))}
        </Select>
        <Select name="category" defaultValue={params?.category ?? "ALL"} aria-label="Category filter">
          <option value="ALL">All categories</option>
          {projectCategoryOptions.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </Select>
        <Select name="year" defaultValue={params?.year ?? "ALL"} aria-label="Year filter">
          <option value="ALL">All years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>
        <Select name="personnel" defaultValue={params?.personnel ?? "ALL"} aria-label="Personnel filter">
          <option value="ALL">All personnel</option>
          {personnel.map((person) => (
            <option key={person.id} value={person.fullName}>
              {person.fullName}
            </option>
          ))}
        </Select>
        <Select name="active" defaultValue={params?.active ?? "ACTIVE"} aria-label="Active filter">
          <option value="ALL">Active and inactive</option>
          <option value="ACTIVE">Active only</option>
          <option value="INACTIVE">Inactive only</option>
        </Select>
        <Button type="submit" variant="outline">
          Apply
        </Button>
      </form>

      <ProjectTable projects={rows} />
    </div>
  );
}
