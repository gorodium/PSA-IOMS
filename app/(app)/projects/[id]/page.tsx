import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { checkUserPermission } from "@/lib/permissions";
import { canEditProject as canEditProjectAccess } from "@/lib/project-access";
import {
  deriveProjectStatus,
  getFocalPersonNames,
  getNearestDeadline,
  getProjectProgress,
  getResponsiblePersonnelNames,
  type MonitoringProject
} from "@/lib/project-metrics";
import { calculateProjectCycleStatus } from "@/lib/status";
import { formatDate, formatDateTime, formatEnumLabel } from "@/lib/format";
import { getProjectCategoryLabel } from "@/lib/taxonomy";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { TaskTable } from "@/components/projects/TaskTable";
import { RemarkBox } from "@/components/projects/RemarkBox";

type ProjectDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const [{ id }, user] = await Promise.all([params, getCurrentUser()]);
  const today = new Date();

  const project = await db.project.findUnique({
    where: {
      id
    },
    include: {
      personnel: {
        include: {
          personnel: true
        }
      },
      cycles: {
        include: {
          tasks: {
            include: {
              assignedPersonnel: true
            },
            orderBy: {
              deadline: "asc"
            }
          }
        },
        orderBy: {
          deadline: "asc"
        }
      },
      remarks: {
        include: {
          author: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  if (!project) {
    notFound();
  }

  const canEditThisProject = await canEditProjectAccess(user, project.id);
  const canComment = checkUserPermission(user, "create", "remark");
  const monitoringProject = project as MonitoringProject;
  const projectStatus = deriveProjectStatus(monitoringProject, today);
  const projectProgress = getProjectProgress(monitoringProject);

  const taskIds = project.cycles.flatMap((cycle) => cycle.tasks.map((task) => task.id));
  const cycleIds = project.cycles.map((cycle) => cycle.id);
  const auditLogs = user
    ? await db.auditLog.findMany({
        where: {
          entityId: {
            in: [project.id, ...cycleIds, ...taskIds]
          }
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 25
      })
    : [];

  const taskSection = (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold tracking-normal text-slate-950">Task and Deadline Table</h2>
        <p className="text-sm text-muted-foreground">Rows and columns can be edited by assigned admins and Super Admin users.</p>
      </div>
      <TaskTable project={project} cycles={project.cycles} canEdit={canEditThisProject} />
    </section>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-slate-950">{project.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {project.code ? `${project.code} - ` : ""}
            {getProjectCategoryLabel(project.category)}
            {project.subcategory ? ` - ${project.subcategory}` : ""} - {project.year}
          </p>
        </div>
        {canEditThisProject ? (
          <Button asChild>
            <Link href={`/projects/${project.id}/edit`}>
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Edit project
            </Link>
          </Button>
        ) : null}
      </div>

      {project.uiLayout === "TASK_FIRST" ? taskSection : null}

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
            <CardDescription>Core details and derived monitoring state.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm md:grid-cols-2">
            <Info label="Status" value={<ProjectStatusBadge status={projectStatus} />} />
            <Info label="Progress" value={<ProgressValue value={projectProgress} />} />
            <Info label="Category" value={getProjectCategoryLabel(project.category)} />
            <Info label="Subcategory" value={project.subcategory ?? "Not set"} />
            <Info label="Frequency" value={formatEnumLabel(project.frequency)} />
            <Info label="Priority" value={formatEnumLabel(project.priority)} />
            <Info label="Section" value={project.section ?? "Not set"} />
            <Info label="Nearest deadline" value={formatDate(getNearestDeadline(monitoringProject))} />
            <Info label="Workload weight" value={project.workloadWeight.toString()} />
            <Info label="Estimated mandays" value={project.estimatedMandays.toString()} />
            <div className="md:col-span-2">
              <p className="text-xs font-medium uppercase text-muted-foreground">Description</p>
              <p className="mt-1 text-slate-800">{project.description ?? "No description provided."}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Personnel</CardTitle>
            <CardDescription>Focal and other involved personnel for this project.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <Info label="Focal person" value={getFocalPersonNames(monitoringProject)} />
            <Info label="Other involved personnel" value={getResponsiblePersonnelNames(monitoringProject)} />
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {project.personnel.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-muted-foreground">
                        No personnel assigned.
                      </TableCell>
                    </TableRow>
                  ) : (
                    project.personnel.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell>{assignment.personnel.fullName}</TableCell>
                        <TableCell>{assignment.isFocalPerson ? "Focal Person" : assignment.roleInProject}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Project Data Sections</CardTitle>
          <CardDescription>Balanced monitoring fields based on the Google Sheet tracking columns.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {project.showOperationWorkload ? <DataCard label={project.operationWorkloadLabel} value={project.name} /> : null}
          {project.showDeadlineSubmission ? <DataCard label={project.deadlineSubmissionLabel} value={formatDate(getNearestDeadline(monitoringProject))} /> : null}
          {project.showDateSubmitted ? <DataCard label={project.dateSubmittedLabel} value={latestSubmittedDate(project)} /> : null}
          {project.showTotalSamplesDocuments ? <DataCard label={project.totalSamplesDocumentsLabel} value={totalSamples(project).toString()} /> : null}
          {project.showResponseRate ? <DataCard label={project.responseRateLabel} value={averageResponseRate(project)} /> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Cycles</CardTitle>
          <CardDescription>Cycle deadlines, response metrics, and derived progress.</CardDescription>
        </CardHeader>
        <CardContent>
          {project.cycles.length === 0 ? (
            <div className="rounded-md border bg-slate-50 p-6 text-sm text-muted-foreground">No project cycles have been added.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cycle</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {project.cycles.map((cycle) => {
                  const cycleStatus = calculateProjectCycleStatus(cycle, cycle.tasks, today);
                  return (
                    <TableRow key={cycle.id}>
                      <TableCell className="font-medium text-slate-950">{cycle.cycleName}</TableCell>
                      <TableCell>
                        {cycle.month ? `Month ${cycle.month}` : cycle.quarter ? `Quarter ${cycle.quarter}` : "Annual"} {cycle.year}
                      </TableCell>
                      <TableCell>{formatDate(cycle.deadline)}</TableCell>
                      <TableCell>{formatDate(cycle.dateSubmitted, "Not submitted")}</TableCell>
                      <TableCell className="min-w-36">
                        <ProgressValue value={cycle.progress} />
                      </TableCell>
                      <TableCell>
                        <ProjectStatusBadge status={cycleStatus} />
                      </TableCell>
                      <TableCell>{cycle.remarks ?? "No remarks"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {project.uiLayout !== "TASK_FIRST" ? taskSection : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Remarks</CardTitle>
            <CardDescription>Monitoring notes and project updates.</CardDescription>
          </CardHeader>
          <CardContent>
            <RemarkBox projectId={project.id} remarks={project.remarks} canComment={canComment} />
          </CardContent>
        </Card>

        {user ? (
          <Card>
            <CardHeader>
              <CardTitle>Audit History</CardTitle>
              <CardDescription>Latest project, cycle, and task audit records.</CardDescription>
            </CardHeader>
            <CardContent>
              {auditLogs.length === 0 ? (
                <div className="rounded-md border bg-slate-50 p-6 text-sm text-muted-foreground">No audit activity has been recorded.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.entityType}</TableCell>
                        <TableCell>{log.user?.name ?? "System"}</TableCell>
                        <TableCell>{formatDateTime(log.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        ) : null}
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
      <div className="mt-1 text-slate-900">{value}</div>
    </div>
  );
}

function ProgressValue({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-3">
      <ProgressBar value={value} />
      <span className="w-10 text-right text-xs text-muted-foreground">{value}%</span>
    </div>
  );
}

function DataCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function latestSubmittedDate(project: {
  cycles: Array<{
    dateSubmitted: Date | null;
    tasks: Array<{
      dateSubmitted: Date | null;
    }>;
  }>;
}) {
  const dates = project.cycles
    .flatMap((cycle) => [cycle.dateSubmitted, ...cycle.tasks.map((task) => task.dateSubmitted)])
    .filter((date): date is Date => Boolean(date))
    .sort((a, b) => b.getTime() - a.getTime());

  return formatDate(dates[0], "Not submitted");
}

function totalSamples(project: {
  cycles: Array<{
    totalSamplesDocuments: number | null;
    tasks: Array<{
      totalSamplesDocuments: number | null;
    }>;
  }>;
}) {
  return project.cycles.reduce((sum, cycle) => {
    const cycleTotal = cycle.totalSamplesDocuments ?? 0;
    const taskTotal = cycle.tasks.reduce((taskSum, task) => taskSum + (task.totalSamplesDocuments ?? 0), 0);
    return sum + cycleTotal + taskTotal;
  }, 0);
}

function averageResponseRate(project: {
  cycles: Array<{
    responseRate: number | null;
    tasks: Array<{
      responseRate: number | null;
    }>;
  }>;
}) {
  const rates = project.cycles
    .flatMap((cycle) => [cycle.responseRate, ...cycle.tasks.map((task) => task.responseRate)])
    .filter((rate): rate is number => typeof rate === "number");

  if (rates.length === 0) {
    return "Not set";
  }

  const average = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
  return `${Math.round(average * 100) / 100}%`;
}
