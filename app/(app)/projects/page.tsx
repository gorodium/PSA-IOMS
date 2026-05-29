import Link from "next/link";
import { Plus, Search, X } from "lucide-react";
import { ProjectStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { checkUserPermission } from "@/lib/permissions";
import {
  deriveProjectStatus,
  getFocalPersonNames,
  getNearestDeadline,
  getProjectProgress,
  getResponsiblePersonnelNames,
  getGroupedPersonnel,
  type MonitoringProject
} from "@/lib/project-metrics";
import { formatEnumLabel } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ProjectCard, type ProjectTableRow } from "@/components/projects/ProjectCard";
import { projectCategoryOptions } from "@/lib/taxonomy";

type ProjectsPageProps = {
  searchParams?: Promise<{
    search?: string;
    status?: string;
    category?: string;
    year?: string;
    personnel?: string;
    active?: string;
    sortBy?: string;
  }>;
};

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const [params, user] = await Promise.all([searchParams, getCurrentUser()]);
  const today = new Date();
  const canCreateProject = checkUserPermission(user, "create", "project");

  const projects = await db.project.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      category: true,
      frequency: true,
      year: true,
      status: true,
      isActive: true,
      updatedAt: true,
      personnel: {
        select: {
          isFocalPerson: true,
          roleInProject: true,
          personnel: {
            select: {
              fullName: true
            }
          }
        }
      },
      cycles: {
        select: {
          id: true,
          cycleName: true,
          startDate: true,
          deadline: true,
          dateSubmitted: true,
          progress: true,
          status: true,
          isActive: true,
          totalSamplesDocuments: true,
          responseRate: true,
          updatedAt: true,
          tasks: {
            select: {
              id: true,
              taskName: true,
              deadline: true,
              dateSubmitted: true,
              progress: true,
              status: true,
              isActive: true,
              manualStatusOverride: true,
              totalSamplesDocuments: true,
              responseRate: true,
              remarks: true,
              updatedAt: true,
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
  });

  const monitoringProjects = projects as MonitoringProject[];
  const years = Array.from(new Set(monitoringProjects.map((project) => project.year))).sort((a, b) => b - a);
  const searchText = params?.search?.trim().toLowerCase() ?? "";

  const hasFilters = Boolean(
    (params?.search && params.search.trim().length > 0) ||
    (params?.status && params.status !== "ALL") ||
    (params?.category && params.category !== "ALL") ||
    (params?.year && params.year !== "ALL") ||
    (params?.personnel && params.personnel !== "ALL") ||
    (params?.active && params.active !== "ACTIVE") ||
    (params?.sortBy && params.sortBy !== "updatedAt_desc")
  );

  const isRestrictedCategory = params?.category === "ADMINISTRATIVE_ACCOUNTING_REPORTS" || params?.category === "CIVIL_REGISTRATION_VITAL_STATISTICS";

  const rows: ProjectTableRow[] = monitoringProjects
    .filter((project) => {
      const derivedStatus = deriveProjectStatus(project, today);
      const matchesSearch = searchText.length === 0 || 
        project.name.toLowerCase().includes(searchText) ||
        project.category.toLowerCase().includes(searchText) ||
        (project.frequency && project.frequency.toLowerCase().includes(searchText)) ||
        derivedStatus.toLowerCase().includes(searchText) ||
        project.personnel.some(p => p.personnel.fullName && p.personnel.fullName.toLowerCase().includes(searchText));
        
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
      slug: project.slug,
      name: project.name,
      category: project.category,
      year: project.year,
      frequency: project.frequency,
      focalPerson: getFocalPersonNames(project),
      otherInvolvedPersonnel: getResponsiblePersonnelNames(project),
      groupedPersonnel: getGroupedPersonnel(project),
      progress: getProjectProgress(project),
      status: deriveProjectStatus(project, today),
      isActive: project.isActive,
      nearestDeadline: getNearestDeadline(project),
      updatedAt: project.updatedAt
    }));

  const sortBy = params?.sortBy ?? "updatedAt_desc";
  rows.sort((a, b) => {
    switch (sortBy) {
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      case "category_asc":
        return a.category.localeCompare(b.category);
      case "category_desc":
        return b.category.localeCompare(a.category);
      case "year_asc":
        return a.year - b.year;
      case "year_desc":
        return b.year - a.year;
      case "focalPerson_asc":
        return a.focalPerson.localeCompare(b.focalPerson);
      case "focalPerson_desc":
        return b.focalPerson.localeCompare(a.focalPerson);
      case "otherInvolvedPersonnel_asc":
        return a.otherInvolvedPersonnel.localeCompare(b.otherInvolvedPersonnel);
      case "otherInvolvedPersonnel_desc":
        return b.otherInvolvedPersonnel.localeCompare(a.otherInvolvedPersonnel);
      case "nearestDeadline_asc":
        if (!a.nearestDeadline) return 1;
        if (!b.nearestDeadline) return -1;
        return new Date(a.nearestDeadline).getTime() - new Date(b.nearestDeadline).getTime();
      case "nearestDeadline_desc":
        if (!a.nearestDeadline) return 1;
        if (!b.nearestDeadline) return -1;
        return new Date(b.nearestDeadline).getTime() - new Date(a.nearestDeadline).getTime();
      case "updatedAt_asc":
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      case "updatedAt_desc":
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  const totalProjects = rows.length;
  const activeProjects = rows.filter(r => r.isActive).length;
  const inactiveProjects = totalProjects - activeProjects;

  const categoryCounts = projectCategoryOptions.map(cat => ({
    label: cat.label,
    count: rows.filter(r => r.category === cat.value).length
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Search, filter, and review monitored project status.</p>
        </div>
        {canCreateProject ? (
          <Button asChild>
            <Link href="/projects/new">
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
              Add Project
            </Link>
          </Button>
        ) : null}
      </div>

      {!isRestrictedCategory ? (
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#1C212E] p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <form className="flex flex-1 flex-col gap-3 md:flex-row md:items-center w-full">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input name="search" placeholder="Search project title, category, focal person, frequency, or status" defaultValue={params?.search ?? ""} className="pl-9 w-full" />
            </div>
            <div className="grid grid-cols-2 md:flex md:flex-row gap-3">
              <Select name="status" defaultValue={params?.status ?? "ALL"} aria-label="Status filter">
                <option value="ALL">All Status</option>
                {Object.values(ProjectStatus).map((status) => (
                  <option key={status} value={status}>
                    {formatEnumLabel(status)}
                  </option>
                ))}
              </Select>
              <Select name="category" defaultValue={params?.category ?? "ALL"} aria-label="Category filter">
                <option value="ALL">All Categories</option>
                {projectCategoryOptions.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </Select>
              <Select name="year" defaultValue={params?.year ?? "ALL"} aria-label="Year filter">
                <option value="ALL">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
              <Select name="active" defaultValue={params?.active ?? "ACTIVE"} aria-label="Active filter">
                <option value="ALL">All States</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </Select>
            </div>
            
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <Button type="submit" variant="outline" className="w-full md:w-auto">
                Apply
              </Button>
              {hasFilters && (
                <Button asChild variant="ghost" className="h-10 text-muted-foreground hover:text-foreground">
                  <Link href="/projects" title="Clear filters">
                    <X className="h-4 w-4 mr-2" aria-hidden="true" />
                    Clear
                  </Link>
                </Button>
              )}
            </div>
          </form>
        </div>
      ) : null}

      {/* Main KPI Row */}
      <div className="flex flex-wrap justify-center w-full gap-3">
        <div className="w-40 h-24 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1C212E] p-3 shadow-md flex flex-col items-center justify-center text-center transition-all hover:shadow-md">
          <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400 mb-2 truncate w-full">Total Projects</span>
          <span className="text-3xl font-bold text-slate-900 dark:text-white leading-none">{totalProjects}</span>
        </div>
        <div className="w-40 h-24 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1C212E] p-3 shadow-md flex flex-col items-center justify-center text-center transition-all hover:shadow-md">
          <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400 mb-2 truncate w-full">Active Projects</span>
          <span className="text-3xl font-bold text-slate-900 dark:text-white leading-none">{activeProjects}</span>
        </div>
        <div className="w-40 h-24 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1C212E] p-3 shadow-md flex flex-col items-center justify-center text-center transition-all hover:shadow-md">
          <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400 mb-2 truncate w-full">Inactive Projects</span>
          <span className="text-3xl font-bold text-slate-900 dark:text-white leading-none">{inactiveProjects}</span>
        </div>
      </div>

      {/* Category KPI Row */}
      <div className="flex flex-wrap justify-center w-full gap-3 mt-2">
        {categoryCounts.map((cat, index) => (
          <div key={index} className="w-40 h-24 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#151923] p-2 shadow-sm flex flex-col items-center justify-center text-center transition-all hover:shadow-md">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-tight text-slate-500 dark:text-slate-400 mb-2 whitespace-normal leading-tight">{cat.label}</span>
            <span className="text-2xl font-bold text-slate-700 dark:text-slate-300 leading-none">{cat.count}</span>
          </div>
        ))}
      </div>

      {/* Projects Grid */}
      {rows.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {rows.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center bg-card shadow-sm">
          <div className="rounded-full bg-slate-100 p-3 dark:bg-slate-800">
            <Search className="h-6 w-6 text-slate-500 dark:text-slate-400" aria-hidden="true" />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-900 dark:text-slate-50">No projects found.</p>
          <p className="mt-1 text-sm text-muted-foreground">Adjust your search or filters to see results.</p>
        </div>
      )}
    </div>
  );
}
