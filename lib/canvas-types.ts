export type WidgetType =
  | "project-info"
  | "assigned-employees"
  | "data-sections"
  | "cycles-table"
  | "task-table"
  | "remarks"
  | "audit-log"
  | "text"
  | "heading"
  | "info-grid";

export interface InfoGridRow {
  id: string;
  label: string;
  value: string;
}

export interface WidgetConfig {
  // unified header overrides
  customTitle?: string;
  customSubtitle?: string;
  // text widget
  content?: string;
  // heading widget
  headingText?: string;
  headingLevel?: 1 | 2 | 3;
  // info-grid widget
  gridTitle?: string;
  gridSubtitle?: string;
  columns?: number;
  rows?: InfoGridRow[];
}

export interface CanvasWidget {
  i: string;
  type: WidgetType;
  x: number;
  y: number;
  w: number;
  h: number;
  minW: number;
  minH: number;
  config: WidgetConfig;
}

// ─── Serialised project shapes (Dates → strings) ──────────────────────────

export interface SerializedPersonnel {
  id: string;
  fullName: string;
  position: string;
  section: string;
}

export interface SerializedProjectPersonnel {
  id: string;
  isFocalPerson: boolean;
  roleInProject: string;
  personnelId: string;
  personnel: SerializedPersonnel;
}

export interface SerializedTask {
  id: string;
  taskName: string;
  deadline: string | null;
  dateSubmitted: string | null;
  startDate: string | null;
  progress: number;
  status: string;
  responseRate: number | null;
  totalSamplesDocuments: number | null;
  customValues: unknown;
  remarks: string | null;
  isActive: boolean;
  assignedPersonnel: { fullName: string } | null;
}

export interface SerializedCycle {
  id: string;
  cycleName: string;
  month: number | null;
  quarter: number | null;
  year: number;
  deadline: string | null;
  dateSubmitted: string | null;
  startDate: string | null;
  progress: number;
  status: string;
  remarks: string | null;
  totalSamplesDocuments: number | null;
  responseRate: number | null;
  isActive: boolean;
  tasks: SerializedTask[];
}

export interface SerializedRemark {
  id: string;
  remarkText: string;
  createdAt: string;
  author: { name: string };
}

export interface SerializedAuditLog {
  id: string;
  action: string;
  entityType: string;
  createdAt: string;
  user: { name: string; email: string } | null;
}

export interface SerializedProject {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  category: string;
  subcategory: string | null;
  section: string | null;
  year: number;
  frequency: string;
  customFrequency: string | null;
  priority: string;
  workloadWeight: number;
  estimatedMandays: number;
  isActive: boolean;
  status: string;
  showDescription: boolean;
  showOperationWorkload: boolean;
  showDeadlineSubmission: boolean;
  showDateSubmitted: boolean;
  showTotalSamplesDocuments: boolean;
  showResponseRate: boolean;
  operationWorkloadLabel: string;
  deadlineSubmissionLabel: string;
  dateSubmittedLabel: string;
  totalSamplesDocumentsLabel: string;
  responseRateLabel: string;
  customTaskColumns: unknown;
  personnel: SerializedProjectPersonnel[];
  cycles: SerializedCycle[];
  remarks: SerializedRemark[];
}
