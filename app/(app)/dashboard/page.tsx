import Link from "next/link";
import { AlertTriangle, CalendarClock, CheckCircle2, FolderKanban, History, Users } from "lucide-react";
import { db } from "@/lib/db";
import {
  deriveProjectStatus,
  getNeedsAttentionItems,
  getNearestDeadline,
  getStatusDistribution,
  isProjectNotUpdatedRecently,
  type MonitoringProject
} from "@/lib/project-metrics";
import { formatDate } from "@/lib/format";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ProjectStatusChart } from "@/components/dashboard/ProjectStatusChart";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function DashboardPage() {
  const today = new Date();
  const [projects, totalPersonnel] = await Promise.all([
    db.project.findMany({
      include: {
        personnel: {
          include: {
            personnel: {
              select: {
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
    db.personnel.count({
      where: {
        isActive: true
      }
    })
  ]);

  const monitoringProjects = projects as MonitoringProject[];
  const activeProjects = monitoringProjects.filter((project) => project.isActive);
  const statuses = activeProjects.map((project) => deriveProjectStatus(project, today));
  const needsAttentionItems = getNeedsAttentionItems(activeProjects, today).slice(0, 12);
  const nearestProjectDeadline = activeProjects
    .map((project) => ({
      project,
      deadline: getNearestDeadline(project)
    }))
    .filter((item): item is { project: MonitoringProject; deadline: Date } => Boolean(item.deadline))
    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Philippine Statistics Authority Misamis Oriental Integrated Operations Monitoring System
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/projects">View projects</Link>
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Dashboard KPIs">
        <KpiCard title="Total active projects" value={activeProjects.length} icon={FolderKanban} />
        <KpiCard title="Completed projects" value={statuses.filter((status) => status === "COMPLETED").length} icon={CheckCircle2} />
        <KpiCard title="Overdue projects" value={statuses.filter((status) => status === "OVERDUE").length} icon={AlertTriangle} />
        <KpiCard
          title="Due soon projects"
          value={statuses.filter((status) => status === "DUE_SOON" || status === "DUE_TODAY").length}
          icon={CalendarClock}
        />
        <KpiCard
          title="Projects not updated recently"
          value={activeProjects.filter((project) => isProjectNotUpdatedRecently(project, today)).length}
          description="No project update in the last 14 days"
          icon={History}
        />
        <KpiCard title="Total personnel" value={totalPersonnel} icon={Users} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
            <CardDescription>Derived from project cycles and task deadlines.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectStatusChart data={getStatusDistribution(monitoringProjects, today)} />
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Nearest Deadline</CardTitle>
              <CardDescription>The closest open project or task deadline.</CardDescription>
            </CardHeader>
            <CardContent>
              {nearestProjectDeadline ? (
                <div className="rounded-lg border bg-slate-50 p-5 dark:bg-slate-900">
                  <p className="text-sm text-muted-foreground">Project</p>
                  <p className="mt-1 text-xl font-semibold text-slate-950 dark:text-slate-50">{nearestProjectDeadline.project.name}</p>
                  <p className="mt-4 text-sm text-muted-foreground">Deadline</p>
                  <p className="mt-1 text-2xl font-semibold text-primary">{formatDate(nearestProjectDeadline.deadline)}</p>
                  <Button asChild variant="outline" className="mt-5">
                    <Link href={`/projects/${nearestProjectDeadline.project.id}`}>Open project</Link>
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border bg-slate-50 p-6 text-sm text-muted-foreground dark:bg-slate-900">
                  No upcoming deadlines are currently set.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Needs Attention</CardTitle>
              <CardDescription>Overdue, due today, and due soon project or task items.</CardDescription>
            </CardHeader>
            <CardContent>
              {needsAttentionItems.length === 0 ? (
                <div className="rounded-md border bg-slate-50 p-6 text-sm text-muted-foreground dark:bg-slate-900">No urgent monitoring items at the moment.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Owner</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {needsAttentionItems.map((item) => (
                      <TableRow key={`${item.itemType}-${item.id}`}>
                        <TableCell>
                          <div className="font-medium text-slate-950 dark:text-slate-50">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.itemType}</div>
                        </TableCell>
                        <TableCell>{item.projectName}</TableCell>
                        <TableCell>
                          <ProjectStatusBadge status={item.status} />
                        </TableCell>
                        <TableCell>{formatDate(item.deadline)}</TableCell>
                        <TableCell>{item.owner}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
