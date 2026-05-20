import { addDays, differenceInCalendarDays, isBefore, isSameDay, startOfDay } from "date-fns";

export type MonitoringStatus =
  | "COMPLETED"
  | "OVERDUE"
  | "DUE_TODAY"
  | "DUE_SOON"
  | "ON_TRACK"
  | "NO_DEADLINE"
  | "INACTIVE";

export type StatusInput = {
  deadline?: Date | string | null;
  dateSubmitted?: Date | string | null;
  progress?: number | null;
  isActive?: boolean | null;
};

function toDate(value: Date | string | null | undefined) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : startOfDay(date);
}

function normalizeToday(today: Date) {
  return startOfDay(today);
}

export function calculateDueSoon(deadline: Date | string | null | undefined, today: Date) {
  const deadlineDate = toDate(deadline);

  if (!deadlineDate) {
    return false;
  }

  const currentDate = normalizeToday(today);
  const daysUntilDeadline = differenceInCalendarDays(deadlineDate, currentDate);
  return daysUntilDeadline >= 1 && daysUntilDeadline <= 7 && !isAfterWindow(deadlineDate, currentDate);
}

function isAfterWindow(deadline: Date, today: Date) {
  return isBefore(addDays(today, 7), deadline);
}

export function calculateTaskStatus(task: StatusInput, today: Date): MonitoringStatus {
  if (task.isActive === false) {
    return "INACTIVE";
  }

  if (task.dateSubmitted || task.progress === 100) {
    return "COMPLETED";
  }

  const deadline = toDate(task.deadline);
  const currentDate = normalizeToday(today);

  if (!deadline) {
    return "NO_DEADLINE";
  }

  if (isBefore(deadline, currentDate)) {
    return "OVERDUE";
  }

  if (isSameDay(deadline, currentDate)) {
    return "DUE_TODAY";
  }

  if (calculateDueSoon(deadline, currentDate)) {
    return "DUE_SOON";
  }

  return "ON_TRACK";
}

export function calculateProjectCycleStatus(
  cycle: StatusInput,
  tasks: StatusInput[] = [],
  today: Date
): MonitoringStatus {
  if (cycle.isActive === false) {
    return "INACTIVE";
  }

  if (cycle.dateSubmitted || cycle.progress === 100) {
    return "COMPLETED";
  }

  if (tasks.length === 0) {
    return calculateTaskStatus(cycle, today);
  }

  const taskStatuses = tasks.map((task) => calculateTaskStatus(task, today));

  if (taskStatuses.every((status) => status === "COMPLETED")) {
    return "COMPLETED";
  }

  if (taskStatuses.includes("OVERDUE")) {
    return "OVERDUE";
  }

  if (taskStatuses.includes("DUE_TODAY")) {
    return "DUE_TODAY";
  }

  if (taskStatuses.includes("DUE_SOON")) {
    return "DUE_SOON";
  }

  if (taskStatuses.includes("ON_TRACK")) {
    return "ON_TRACK";
  }

  return "NO_DEADLINE";
}

export function calculateProjectProgress(cyclesOrTasks: Array<{ progress?: number | null }>) {
  if (cyclesOrTasks.length === 0) {
    return 0;
  }

  const total = cyclesOrTasks.reduce((sum, item) => sum + Math.max(0, Math.min(100, item.progress ?? 0)), 0);
  return Math.round(total / cyclesOrTasks.length);
}
