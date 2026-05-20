import { z } from "zod";
import { ProjectCategory, ProjectFrequency, ProjectPriority } from "@prisma/client";

const emptyToUndefined = (value: unknown) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  return value;
};

const emptyToNull = (value: unknown) => {
  if (typeof value === "string" && value.trim() === "") {
    return null;
  }

  return value;
};

const optionalString = (max = 255) =>
  z.preprocess(emptyToUndefined, z.string().trim().max(max, `Must be ${max} characters or less.`).optional());

const optionalEmail = z.preprocess(
  emptyToUndefined,
  z.string().trim().email("Enter a valid email address.").max(255).optional()
);

const optionalDate = z.preprocess(emptyToNull, z.coerce.date().nullable());

const formBoolean = z.preprocess((value) => value === "on" || value === "true" || value === true, z.boolean());

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required.")
});

export const createProjectSchema = z.object({
  name: z.string().trim().min(2, "Project name is required.").max(255),
  code: optionalString(50),
  description: optionalString(2000),
  category: z.nativeEnum(ProjectCategory),
  subcategory: optionalString(160),
  section: optionalString(120),
  year: z.coerce.number().int().min(2000).max(2100),
  frequency: z.nativeEnum(ProjectFrequency),
  priority: z.nativeEnum(ProjectPriority),
  workloadWeight: z.coerce.number().min(0).max(999),
  estimatedMandays: z.coerce.number().min(0).max(99999),
  uiLayout: z.enum(["BALANCED", "DETAIL_FIRST", "TASK_FIRST"]).default("BALANCED"),
  showOperationWorkload: formBoolean.default(true),
  showDeadlineSubmission: formBoolean.default(true),
  showDateSubmitted: formBoolean.default(true),
  showTotalSamplesDocuments: formBoolean.default(true),
  showResponseRate: formBoolean.default(true),
  operationWorkloadLabel: z.string().trim().min(1).max(120).default("Project/Operation/Workload"),
  deadlineSubmissionLabel: z.string().trim().min(1).max(120).default("Deadline of Submission"),
  dateSubmittedLabel: z.string().trim().min(1).max(120).default("Date Submitted"),
  totalSamplesDocumentsLabel: z.string().trim().min(1).max(120).default("Total Sample/Documents"),
  responseRateLabel: z.string().trim().min(1).max(120).default("Response Rate"),
  focalPersonnelId: optionalString(),
  personnelIds: z.array(z.string()).default([]),
  isActive: formBoolean.default(true)
});

export const updateProjectSchema = createProjectSchema.extend({
  id: z.string().min(1)
});

export const createPersonnelSchema = z.object({
  employeeNo: optionalString(50),
  fullName: z.string().trim().min(2, "Full name is required.").max(255),
  position: z.string().trim().min(2, "Position is required.").max(255),
  section: z.string().trim().min(2, "Section is required.").max(120),
  email: optionalEmail,
  contactNo: optionalString(80),
  isActive: formBoolean.default(true)
});

export const updatePersonnelSchema = createPersonnelSchema.extend({
  id: z.string().min(1)
});

export const createTaskSchema = z.object({
  projectCycleId: z.string().min(1),
  taskName: z.string().trim().min(2).max(255),
  assignedPersonnelId: optionalString(),
  startDate: optionalDate,
  deadline: optionalDate,
  progress: z.coerce.number().int().min(0).max(100).default(0),
  responseRate: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(100).optional()),
  totalSamplesDocuments: z.preprocess(emptyToUndefined, z.coerce.number().int().min(0).optional()),
  remarks: optionalString(2000)
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  id: z.string().min(1),
  taskName: z.string().trim().min(2).max(255).optional(),
  progress: z.coerce.number().int().min(0).max(100),
  deadline: optionalDate,
  dateSubmitted: optionalDate,
  responseRate: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(100).optional()),
  totalSamplesDocuments: z.preprocess(emptyToUndefined, z.coerce.number().int().min(0).optional()),
  remarks: optionalString(2000)
});

export const createRemarkSchema = z.object({
  projectId: optionalString(),
  projectCycleId: optionalString(),
  taskId: optionalString(),
  remarkText: z.string().trim().min(1, "Remark text is required.").max(2000)
});

export const adminUserSchema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(255),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  isActive: formBoolean.default(true)
});

export const projectEditorAssignmentSchema = z.object({
  userId: z.string().min(1),
  projectIds: z.array(z.string()).default([])
});

export const createTaskRowSchema = z.object({
  projectCycleId: z.string().min(1),
  taskName: z.string().trim().min(2, "Task name is required.").max(255)
});

export const customTaskColumnSchema = z.object({
  projectId: z.string().min(1),
  label: z.string().trim().min(1, "Column label is required.").max(80)
});

export const removeCustomTaskColumnSchema = z.object({
  projectId: z.string().min(1),
  columnId: z.string().min(1)
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreatePersonnelInput = z.infer<typeof createPersonnelSchema>;
export type UpdatePersonnelInput = z.infer<typeof updatePersonnelSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CreateRemarkInput = z.infer<typeof createRemarkSchema>;
export type AdminUserInput = z.infer<typeof adminUserSchema>;
