import { subDays } from "date-fns";
import {
  calculateProjectCycleStatus,
  calculateProjectProgress,
  calculateTaskStatus,
  type MonitoringStatus,
  type StatusInput
} from "@/lib/status";

type ProjectPersonnelSummary = {
  isFocalPerson: boolean;
  personnel: {
    fullName: string;
  };
};

export type MonitoringTask = StatusInput & {
  id: string;
  taskName: string;
  updatedAt: Date;
  assignedPersonnel?: {
    fullName: string;
  } | null;
};

export type MonitoringCycle = StatusInput & {
  id: string;
  cycleName: string;
  updatedAt: Date;
  tasks: MonitoringTask[];
};

export type MonitoringProject = {
  id: string;
  name: string;
  category: string;
  year: number;
  status: string;
  isActive: boolean;
  updatedAt: Date;
  personnel: ProjectPersonnelSummary[];
  cycles: MonitoringCycle[];
};

const attentionStatuses: MonitoringStatus[] = ["OVERDUE", "DUE_TODAY", "DUE_SOON"];

export function deriveProjectStatus(project: MonitoringProject, today: Date): MonitoringStatus {
  if (!project.isActive) {
    return "INACTIVE";
  }

  if (project.cycles.length === 0) {
    return project.status as MonitoringStatus;
  }

  const cycleStatuses = project.cycles.map((cycle) => calculateProjectCycleStatus(cycle, cycle.tasks, today));

  if (cycleStatuses.every((status) => status === "COMPLETED")) {
    return "COMPLETED";
  }

  if (cycleStatuses.includes("OVERDUE")) {
    return "OVERDUE";
  }

  if (cycleStatuses.includes("DUE_TODAY")) {
    return "DUE_TODAY";
  }

  if (cycleStatuses.includes("DUE_SOON")) {
    return "DUE_SOON";
  }

  if (cycleStatuses.includes("ON_TRACK")) {
    return "ON_TRACK";
  }

  return "NO_DEADLINE";
}

export function getProjectProgress(project: MonitoringProject) {
  const tasks = project.cycles.flatMap((cycle) => cycle.tasks);

  if (tasks.length > 0) {
    return calculateProjectProgress(tasks);
  }

  return calculateProjectProgress(project.cycles);
}

export function getFocalPersonNames(project: MonitoringProject) {
  const names = project.personnel.filter((item) => item.isFocalPerson).map((item) => item.personnel.fullName);
  return names.length > 0 ? names.join(", ") : "No focal person";
}

export function getResponsiblePersonnelNames(project: MonitoringProject) {
  const names = project.personnel.map((item) => item.personnel.fullName);
  return names.length > 0 ? names.join(", ") : "Unassigned";
}

export function getNearestDeadline(project: MonitoringProject) {
  const deadlines = project.cycles.flatMap((cycle) => [
    {
      date: cycle.deadline,
      isComplete: Boolean(cycle.dateSubmitted || cycle.progress === 100),
      isActive: cycle.isActive !== false
    },
    ...cycle.tasks.map((task) => ({
      date: task.deadline,
      isComplete: Boolean(task.dateSubmitted || task.progress === 100),
      isActive: task.isActive !== false
    }))
  ]);

  const openDeadlines = deadlines
    .filter((item) => item.date && item.isActive && !item.isComplete)
    .map((item) => (item.date instanceof Date ? item.date : new Date(item.date as string)))
    .sort((a, b) => a.getTime() - b.getTime());

  return openDeadlines[0] ?? null;
}

export function isProjectNotUpdatedRecently(project: MonitoringProject, today: Date, days = 14) {
  return project.isActive && project.updatedAt < subDays(today, days);
}

export function getNeedsAttentionItems(projects: MonitoringProject[], today: Date) {
  return projects
    .flatMap((project) => {
      const projectStatus = deriveProjectStatus(project, today);
      const projectItem = attentionStatuses.includes(projectStatus)
        ? [
            {
              id: project.id,
              itemType: "Project" as const,
              name: project.name,
              projectName: project.name,
              status: projectStatus,
              deadline: getNearestDeadline(project),
              owner: getFocalPersonNames(project)
            }
          ]
        : [];

      const taskItems = project.cycles.flatMap((cycle) =>
        cycle.tasks
          .map((task) => ({
            task,
            status: calculateTaskStatus(task, today)
          }))
          .filter(({ status }) => attentionStatuses.includes(status))
          .map(({ task, status }) => ({
            id: task.id,
            itemType: "Task" as const,
            name: task.taskName,
            projectName: project.name,
            status,
            deadline: task.deadline ? new Date(task.deadline) : null,
            owner: task.assignedPersonnel?.fullName ?? getFocalPersonNames(project)
          }))
      );

      return [...projectItem, ...taskItems];
    })
    .sort((a, b) => {
      const aTime = a.deadline?.getTime() ?? Number.MAX_SAFE_INTEGER;
      const bTime = b.deadline?.getTime() ?? Number.MAX_SAFE_INTEGER;
      return aTime - bTime;
    });
}

export function getStatusDistribution(projects: MonitoringProject[], today: Date) {
  const initialCounts: Record<MonitoringStatus, number> = {
    COMPLETED: 0,
    OVERDUE: 0,
    DUE_TODAY: 0,
    DUE_SOON: 0,
    ON_TRACK: 0,
    NO_DEADLINE: 0,
    INACTIVE: 0
  };

  for (const project of projects) {
    initialCounts[deriveProjectStatus(project, today)] += 1;
  }

  return Object.entries(initialCounts).map(([status, count]) => ({
    status,
    count
  }));
}
