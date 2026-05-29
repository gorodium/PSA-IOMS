"use server";

import { revalidatePath } from "next/cache";
import type { ProjectFrequency } from "@prisma/client";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { checkUserPermission, type PermissionAction, type PermissionResource } from "@/lib/permissions";
import { canEditProject, canManageProject } from "@/lib/project-access";
import { calculateProjectCycleStatus, calculateProjectProgress, calculateTaskStatus } from "@/lib/status";
import {
  createProjectSchema,
  createRemarkSchema,
  createTaskRowSchema,
  customTaskColumnSchema,
  removeCustomTaskColumnSchema,
  updateProjectSchema,
  updateTaskSchema,
  updateCycleSchema
} from "@/lib/validators";

async function requirePermission(action: PermissionAction, resource: PermissionResource) {
  const user = await requireUser();

  if (!checkUserPermission(user, action, resource)) {
    throw new Error("You do not have permission to perform this action.");
  }

  return user;
}

function projectInputFromFormData(formData: FormData) {
  return {
    id: formData.get("id"),
    name: formData.get("name"),
    code: formData.get("code"),
    description: formData.get("description"),
    category: formData.get("category"),
    subcategory: formData.get("subcategory"),
    section: formData.get("section"),
    year: formData.get("year"),
    frequency: formData.get("frequency"),
    customFrequency: formData.get("customFrequency"),
    priority: formData.get("priority"),
    workloadWeight: formData.get("workloadWeight"),
    estimatedMandays: formData.get("estimatedMandays"),
    uiLayout: formData.get("uiLayout"),
    showDescription: formData.get("showDescription") ?? "false",
    showOperationWorkload: formData.get("showOperationWorkload") ?? "false",
    showDeadlineSubmission: formData.get("showDeadlineSubmission") ?? "false",
    showDateSubmitted: formData.get("showDateSubmitted") ?? "false",
    showTotalSamplesDocuments: formData.get("showTotalSamplesDocuments") ?? "false",
    showResponseRate: formData.get("showResponseRate") ?? "false",
    operationWorkloadLabel: formData.get("operationWorkloadLabel"),
    deadlineSubmissionLabel: formData.get("deadlineSubmissionLabel"),
    dateSubmittedLabel: formData.get("dateSubmittedLabel"),
    totalSamplesDocumentsLabel: formData.get("totalSamplesDocumentsLabel"),
    responseRateLabel: formData.get("responseRateLabel"),
    focalPersonnelId: formData.get("focalPersonnelId"),
    alternatePersonnelId: formData.get("alternatePersonnelId"),
    assistantPersonnelId: formData.get("assistantPersonnelId"),
    otherPersonnelIds: formData.getAll("otherPersonnelIds").filter((value): value is string => typeof value === "string" && value !== ""),
    isActive: formData.get("isActive") ?? "false"
  };
}

function getPersonnelAssignments(
  focalPersonnelId: string | null | undefined,
  alternatePersonnelId: string | null | undefined,
  assistantPersonnelId: string | null | undefined,
  otherPersonnelIds: string[]
) {
  const ids = Array.from(new Set([focalPersonnelId, alternatePersonnelId, assistantPersonnelId, ...otherPersonnelIds].filter((id): id is string => Boolean(id))));

  return ids.map((personnelId) => {
    const isFocal = personnelId === focalPersonnelId;
    let roleInProject = "Other Employee Involved";
    if (isFocal) roleInProject = "Focal Person";
    else if (personnelId === alternatePersonnelId) roleInProject = "Alternate Focal Person";
    else if (personnelId === assistantPersonnelId) roleInProject = "Assistant Focal Person";

    return {
      personnelId,
      roleInProject,
      isFocalPerson: isFocal
    };
  });
}

function generateSlug(name: string): string {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  return `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
}

export async function deleteProjectAction(formData: FormData) {
  const user = await requireUser();
  const projectId = formData.get("projectId")?.toString();

  if (!projectId) {
    throw new Error("Project ID is required.");
  }

  if (!(await canManageProject(user, projectId))) {
    throw new Error("You do not have permission to delete this project.");
  }

  const oldProject = await db.project.findUnique({
    where: { id: projectId }
  });

  if (!oldProject) {
    throw new Error("Project was not found.");
  }

  await db.project.delete({
    where: { id: projectId }
  });

  await writeAuditLog({
    userId: user.id,
    action: "DELETE",
    entityType: "Project",
    entityId: projectId,
    oldValueJson: oldProject
  });

  revalidatePath("/projects");
  redirect("/projects");
}

export async function deleteCycleAction(formData: FormData) {
  const user = await requireUser();
  const cycleId = formData.get("cycleId")?.toString();

  if (!cycleId) {
    throw new Error("Cycle ID is required.");
  }

  const cycle = await db.projectCycle.findUnique({
    where: { id: cycleId }
  });

  if (!cycle) {
    throw new Error("Cycle was not found.");
  }

  if (!(await canManageProject(user, cycle.projectId))) {
    throw new Error("You do not have permission to delete this cycle.");
  }

  await db.projectCycle.delete({
    where: { id: cycleId }
  });

  await writeAuditLog({
    userId: user.id,
    action: "DELETE",
    entityType: "ProjectCycle",
    entityId: cycleId,
    oldValueJson: cycle
  });

  revalidatePath(`/projects/${cycle.projectId}`);
}

export async function createProjectAction(formData: FormData) {
  const user = await requirePermission("create", "project");
  const parsed = createProjectSchema.safeParse(projectInputFromFormData(formData));

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Project data is invalid.");
  }

  const assignments = getPersonnelAssignments(
    parsed.data.focalPersonnelId,
    parsed.data.alternatePersonnelId,
    parsed.data.assistantPersonnelId,
    parsed.data.otherPersonnelIds
  );

  const slug = generateSlug(parsed.data.name);

  const project = await db.project.create({
    data: {
      name: parsed.data.name,
      slug,
      code: parsed.data.code,
      description: parsed.data.description,
      category: parsed.data.category,
      subcategory: parsed.data.subcategory,
      section: parsed.data.section,
      year: parsed.data.year,
      frequency: parsed.data.frequency,
      customFrequency: parsed.data.customFrequency,
      priority: parsed.data.priority,
      workloadWeight: parsed.data.workloadWeight,
      estimatedMandays: parsed.data.estimatedMandays,
      uiLayout: parsed.data.uiLayout,
      showOperationWorkload: parsed.data.showOperationWorkload,
      showDeadlineSubmission: parsed.data.showDeadlineSubmission,
      showDateSubmitted: parsed.data.showDateSubmitted,
      showTotalSamplesDocuments: parsed.data.showTotalSamplesDocuments,
      showResponseRate: parsed.data.showResponseRate,
      operationWorkloadLabel: parsed.data.operationWorkloadLabel,
      deadlineSubmissionLabel: parsed.data.deadlineSubmissionLabel,
      dateSubmittedLabel: parsed.data.dateSubmittedLabel,
      totalSamplesDocumentsLabel: parsed.data.totalSamplesDocumentsLabel,
      responseRateLabel: parsed.data.responseRateLabel,
      isActive: parsed.data.isActive,
      status: "NO_DEADLINE",
      createdById: user.id,
      updatedById: user.id,
      personnel: {
        create: assignments
      }
    }
  });

  await writeAuditLog({
    userId: user.id,
    action: "CREATE",
    entityType: "Project",
    entityId: project.id,
    newValueJson: project
  });

  revalidatePath("/projects");
  redirect(`/projects/${project.slug}`);
}

export async function updateProjectAction(formData: FormData) {
  const user = await requireUser();
  const parsed = updateProjectSchema.safeParse(projectInputFromFormData(formData));

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Project data is invalid.");
  }

  const oldProject = await db.project.findUnique({
    where: {
      id: parsed.data.id
    },
    include: {
      personnel: true
    }
  });

  if (!oldProject) {
    throw new Error("Project was not found.");
  }

  if (!(await canEditProject(user, parsed.data.id))) {
    throw new Error("You do not have permission to edit this project.");
  }

  const assignments = getPersonnelAssignments(
    parsed.data.focalPersonnelId,
    parsed.data.alternatePersonnelId,
    parsed.data.assistantPersonnelId,
    parsed.data.otherPersonnelIds
  );

  const project = await db.$transaction(async (tx) => {
    await tx.projectPersonnel.updateMany({
      where: {
        projectId: parsed.data.id
      },
      data: {
        isFocalPerson: false,
        roleInProject: "Other Employee Involved"
      }
    });

    for (const assignment of assignments) {
      await tx.projectPersonnel.upsert({
        where: {
          projectId_personnelId: {
            projectId: parsed.data.id,
            personnelId: assignment.personnelId
          }
        },
        update: {
          roleInProject: assignment.roleInProject,
          isFocalPerson: assignment.isFocalPerson
        },
        create: {
          projectId: parsed.data.id,
          ...assignment
        }
      });
    }

    return tx.project.update({
      where: {
        id: parsed.data.id
      },
      data: {
        name: parsed.data.name,
        code: parsed.data.code,
        description: parsed.data.description,
        category: parsed.data.category,
        subcategory: parsed.data.subcategory,
        section: parsed.data.section,
        year: parsed.data.year,
        frequency: parsed.data.frequency,
        customFrequency: parsed.data.customFrequency,
        priority: parsed.data.priority,
        workloadWeight: parsed.data.workloadWeight,
        estimatedMandays: parsed.data.estimatedMandays,
        uiLayout: parsed.data.uiLayout,
        showOperationWorkload: parsed.data.showOperationWorkload,
        showDeadlineSubmission: parsed.data.showDeadlineSubmission,
        showDateSubmitted: parsed.data.showDateSubmitted,
        showTotalSamplesDocuments: parsed.data.showTotalSamplesDocuments,
        showResponseRate: parsed.data.showResponseRate,
        operationWorkloadLabel: parsed.data.operationWorkloadLabel,
        deadlineSubmissionLabel: parsed.data.deadlineSubmissionLabel,
        dateSubmittedLabel: parsed.data.dateSubmittedLabel,
        totalSamplesDocumentsLabel: parsed.data.totalSamplesDocumentsLabel,
        responseRateLabel: parsed.data.responseRateLabel,
        isActive: parsed.data.isActive,
        updatedById: user.id
      }
    });
  });

  await writeAuditLog({
    userId: user.id,
    action: "UPDATE",
    entityType: "Project",
    entityId: project.id,
    oldValueJson: oldProject,
    newValueJson: project
  });

  revalidatePath("/projects");
  revalidatePath(`/projects/${project.slug}`);
  redirect(`/projects/${project.slug}`);
}

export async function addProjectRemarkAction(formData: FormData) {
  const user = await requirePermission("create", "remark");
  const parsed = createRemarkSchema.safeParse({
    projectId: formData.get("projectId"),
    projectCycleId: formData.get("projectCycleId"),
    taskId: formData.get("taskId"),
    remarkText: formData.get("remarkText")
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Remark data is invalid.");
  }

  const remark = await db.projectRemark.create({
    data: {
      projectId: parsed.data.projectId,
      projectCycleId: parsed.data.projectCycleId,
      taskId: parsed.data.taskId,
      remarkText: parsed.data.remarkText,
      authorId: user.id
    }
  });

  await writeAuditLog({
    userId: user.id,
    action: "CREATE",
    entityType: "ProjectRemark",
    entityId: remark.id,
    newValueJson: remark
  });

  revalidatePath(parsed.data.projectId ? `/projects/${parsed.data.projectId}` : "/projects");
  redirect(parsed.data.projectId ? `/projects/${parsed.data.projectId}` : "/projects");
}

export async function updateTaskAction(formData: FormData) {
  const user = await requireUser();
  const customValues = Object.fromEntries(
    Array.from(formData.entries())
      .filter(([key]) => key.startsWith("customValue:"))
      .map(([key, value]) => [key.replace("customValue:", ""), String(value)])
  );
  const parsed = updateTaskSchema.safeParse({
    id: formData.get("id"),
    taskName: formData.get("taskName"),
    progress: formData.get("progress"),
    deadline: formData.get("deadline"),
    dateSubmitted: formData.get("dateSubmitted"),
    responseRate: formData.get("responseRate"),
    totalSamplesDocuments: formData.get("totalSamplesDocuments"),
    remarks: formData.get("remarks")
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Task data is invalid.");
  }

  const oldTask = await db.projectTask.findUnique({
    where: {
      id: parsed.data.id
    },
    include: {
      projectCycle: {
        select: {
          id: true,
          projectId: true
        }
      }
    }
  });

  if (!oldTask) {
    throw new Error("Task was not found.");
  }

  if (!(await canEditProject(user, oldTask.projectCycle.projectId))) {
    throw new Error("You do not have permission to edit this project task.");
  }

  const nextTaskStatus = calculateTaskStatus(
    {
      progress: parsed.data.progress,
      deadline: parsed.data.deadline,
      dateSubmitted: parsed.data.dateSubmitted,
      isActive: oldTask.isActive
    },
    new Date()
  );

  const task = await db.projectTask.update({
    where: {
      id: parsed.data.id
    },
    data: {
      progress: parsed.data.progress,
      taskName: parsed.data.taskName,
      deadline: parsed.data.deadline,
      dateSubmitted: parsed.data.dateSubmitted,
      responseRate: parsed.data.responseRate,
      totalSamplesDocuments: parsed.data.totalSamplesDocuments,
      customValues,
      remarks: parsed.data.remarks,
      status: nextTaskStatus
    }
  });

  const cycleTasks = await db.projectTask.findMany({
    where: {
      projectCycleId: oldTask.projectCycleId
    }
  });

  await db.projectCycle.update({
    where: {
      id: oldTask.projectCycleId
    },
    data: {
      progress: calculateProjectProgress(cycleTasks),
      status: calculateProjectCycleStatus({ isActive: true }, cycleTasks, new Date())
    }
  });

  await db.project.update({
    where: {
      id: oldTask.projectCycle.projectId
    },
    data: {
      updatedById: user.id,
      updatedAt: new Date()
    }
  });

  await writeAuditLog({
    userId: user.id,
    action: "UPDATE",
    entityType: "ProjectTask",
    entityId: task.id,
    oldValueJson: oldTask,
    newValueJson: task
  });

  revalidatePath(`/projects/${oldTask.projectCycle.projectId}`);
  revalidatePath("/dashboard");
}

export async function createMatrixTaskRowAction(formData: FormData) {
  const user = await requireUser();
  const projectId = formData.get("projectId") as string;
  const taskName = formData.get("taskName") as string;

  if (!projectId || !taskName) {
    throw new Error("Missing projectId or taskName.");
  }

  if (!(await canEditProject(user, projectId))) {
    throw new Error("You do not have permission to add task rows to this project.");
  }

  const cycles = await db.projectCycle.findMany({
    where: { projectId },
    select: { id: true }
  });

  if (cycles.length === 0) {
    throw new Error("Project has no periods to add tasks to.");
  }

  await db.projectTask.createMany({
    data: cycles.map((c) => ({
      projectCycleId: c.id,
      taskName,
      status: "NO_DEADLINE",
      isActive: true,
    }))
  });

  await writeAuditLog({
    userId: user.id,
    action: "CREATE",
    entityType: "ProjectTask",
    entityId: projectId,
    newValueJson: { taskName, cyclesCount: cycles.length }
  });

  revalidatePath(`/projects/${projectId}`);
}

export async function disableMatrixTaskRowAction(formData: FormData) {
  const user = await requireUser();
  const projectId = formData.get("projectId") as string;
  const taskName = formData.get("taskName") as string;

  if (!projectId || !taskName) {
    throw new Error("Missing projectId or taskName.");
  }

  if (!(await canEditProject(user, projectId))) {
    throw new Error("You do not have permission to remove this task row.");
  }

  await db.projectTask.updateMany({
    where: {
      taskName,
      projectCycle: { projectId }
    },
    data: {
      isActive: false,
      status: "INACTIVE"
    }
  });

  await writeAuditLog({
    userId: user.id,
    action: "DISABLE",
    entityType: "ProjectTask",
    entityId: projectId,
    newValueJson: { taskName }
  });

  revalidatePath(`/projects/${projectId}`);
}

export async function createTaskRowAction(formData: FormData) {
  const user = await requireUser();
  const parsed = createTaskRowSchema.safeParse({
    projectCycleId: formData.get("projectCycleId"),
    taskName: formData.get("taskName")
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Task row data is invalid.");
  }

  const cycle = await db.projectCycle.findUnique({
    where: {
      id: parsed.data.projectCycleId
    },
    select: {
      projectId: true
    }
  });

  if (!cycle || !(await canEditProject(user, cycle.projectId))) {
    throw new Error("You do not have permission to add task rows to this project.");
  }

  const task = await db.projectTask.create({
    data: {
      projectCycleId: parsed.data.projectCycleId,
      taskName: parsed.data.taskName,
      status: "NO_DEADLINE"
    }
  });

  await writeAuditLog({
    userId: user.id,
    action: "CREATE",
    entityType: "ProjectTask",
    entityId: task.id,
    newValueJson: task
  });

  revalidatePath(`/projects/${cycle.projectId}`);
}

export async function disableTaskRowAction(formData: FormData) {
  const user = await requireUser();
  const taskId = String(formData.get("id") ?? "");

  const task = await db.projectTask.findUnique({
    where: {
      id: taskId
    },
    include: {
      projectCycle: {
        select: {
          projectId: true
        }
      }
    }
  });

  if (!task || !(await canEditProject(user, task.projectCycle.projectId))) {
    throw new Error("You do not have permission to remove this task row.");
  }

  await db.projectTask.update({
    where: {
      id: task.id
    },
    data: {
      isActive: false,
      status: "INACTIVE"
    }
  });

  await writeAuditLog({
    userId: user.id,
    action: "DISABLE",
    entityType: "ProjectTask",
    entityId: task.id
  });

  revalidatePath(`/projects/${task.projectCycle.projectId}`);
}

type CustomColumn = {
  id: string;
  label: string;
};

function parseCustomColumns(value: unknown): CustomColumn[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is CustomColumn => {
      if (!item || typeof item !== "object") {
        return false;
      }

      const candidate = item as Partial<CustomColumn>;
      return typeof candidate.id === "string" && typeof candidate.label === "string";
    })
    .slice(0, 12);
}

export async function updateCycleAction(formData: FormData) {
  const user = await requireUser();
  const parsed = updateCycleSchema.safeParse({
    id: formData.get("id"),
    deadline: formData.get("deadline"),
    dateSubmitted: formData.get("dateSubmitted"),
    remarks: formData.get("remarks")
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Cycle data is invalid.");
  }

  const cycle = await db.projectCycle.findUnique({
    where: { id: parsed.data.id },
    select: { projectId: true }
  });

  if (!cycle) {
    throw new Error("Cycle not found.");
  }

  if (!(await canEditProject(user, cycle.projectId))) {
    throw new Error("You do not have permission to edit this project.");
  }

  await db.projectCycle.update({
    where: { id: parsed.data.id },
    data: {
      deadline: parsed.data.deadline,
      dateSubmitted: parsed.data.dateSubmitted,
      remarks: parsed.data.remarks
    }
  });

  await writeAuditLog({
    userId: user.id,
    action: "UPDATE",
    entityType: "ProjectCycle",
    entityId: parsed.data.id,
    newValueJson: parsed.data
  });

  revalidatePath(`/projects/${cycle.projectId}`);
}

export async function addCustomTaskColumnAction(formData: FormData) {
  const user = await requireUser();
  const parsed = customTaskColumnSchema.safeParse({
    projectId: formData.get("projectId"),
    label: formData.get("label")
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Column data is invalid.");
  }

  if (!(await canEditProject(user, parsed.data.projectId))) {
    throw new Error("You do not have permission to edit this project's table columns.");
  }

  const project = await db.project.findUnique({
    where: {
      id: parsed.data.projectId
    },
    select: {
      customTaskColumns: true
    }
  });
  const columns = parseCustomColumns(project?.customTaskColumns);

  await db.project.update({
    where: {
      id: parsed.data.projectId
    },
    data: {
      customTaskColumns: [
        ...columns,
        {
          id: randomUUID(),
          label: parsed.data.label
        }
      ]
    }
  });

  revalidatePath(`/projects/${parsed.data.projectId}`);
}

export async function removeCustomTaskColumnAction(formData: FormData) {
  const user = await requireUser();
  const parsed = removeCustomTaskColumnSchema.safeParse({
    projectId: formData.get("projectId"),
    columnId: formData.get("columnId")
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Column data is invalid.");
  }

  if (!(await canEditProject(user, parsed.data.projectId))) {
    throw new Error("You do not have permission to edit this project's table columns.");
  }

  const project = await db.project.findUnique({
    where: {
      id: parsed.data.projectId
    },
    select: {
      customTaskColumns: true
    }
  });
  const columns = parseCustomColumns(project?.customTaskColumns).filter((column) => column.id !== parsed.data.columnId);

  await db.project.update({
    where: {
      id: parsed.data.projectId
    },
    data: {
      customTaskColumns: columns
    }
  });

  revalidatePath(`/projects/${parsed.data.projectId}`);
}

export async function softDeleteProjectAction(projectId: string) {
  const user = await requirePermission("manage", "project");

  const oldProject = await db.project.findUnique({
    where: { id: projectId }
  });

  if (!oldProject) {
    throw new Error("Project was not found.");
  }

  const project = await db.project.update({
    where: { id: projectId },
    data: { isActive: false }
  });

  await writeAuditLog({
    userId: user.id,
    action: "SOFT_DELETE",
    entityType: "Project",
    entityId: projectId,
    oldValueJson: oldProject,
    newValueJson: project
  });

  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  redirect("/projects");
}

export async function hardDeleteProjectAction(projectId: string) {
  const user = await requirePermission("manage", "project");

  if (user.role !== "SUPER_ADMIN") {
    throw new Error("Only Super Admin can permanently delete records.");
  }

  const oldProject = await db.project.findUnique({
    where: { id: projectId }
  });

  if (!oldProject) {
    throw new Error("Project was not found.");
  }

  await db.project.delete({
    where: { id: projectId }
  });

  await writeAuditLog({
    userId: user.id,
    action: "HARD_DELETE",
    entityType: "Project",
    entityId: projectId,
    oldValueJson: oldProject
  });

  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  redirect("/projects");
}

export type ProjectDetailsUpdatePayload = {
  projectId: string;
  frequency?: ProjectFrequency;
  customFrequency?: string | null;
  focalPersonId?: string | null;
  alternateFocalPersonId?: string | null;
  assistantFocalPersonId?: string | null;
  otherInvolvedEmployeeIds?: string[];
  showOperationWorkload?: boolean;
  showDeadlineSubmission?: boolean;
  showDateSubmitted?: boolean;
  showTotalSamplesDocuments?: boolean;
  showResponseRate?: boolean;
  totalSamplesDocumentsLabel?: string;
  cycles: {
    id?: string;
    cycleName: string;
    month?: number | null;
    year: number;
    tasks: {
      id?: string;
      taskName: string;
      deadline?: string | null;
      dateSubmitted?: string | null;
      totalSamplesDocuments?: number | null;
      responseRate?: number | null;
      manualStatusOverride?: string | null;
      remarks?: string | null;
      isSubtitle?: boolean;
      customValues?: unknown;
    }[];
  }[];
  deletedCycleIds: string[];
  deletedTaskIds: string[];
};

export async function updateProjectMonthlyDetails(payload: ProjectDetailsUpdatePayload) {
  const user = await requireUser();
  const canEdit = await canEditProject(user, payload.projectId);
  if (!canEdit) throw new Error("Unauthorized");

  await db.$transaction(async (tx) => {
    // 1. Delete removed tasks
    if (payload.deletedTaskIds.length > 0) {
      await tx.projectTask.deleteMany({
        where: { id: { in: payload.deletedTaskIds } }
      });
    }

    // 2. Delete removed cycles
    if (payload.deletedCycleIds.length > 0) {
      await tx.projectCycle.deleteMany({
        where: { id: { in: payload.deletedCycleIds } }
      });
    }

    // 3. Update Project Settings
    await tx.project.update({
      where: { id: payload.projectId },
      data: {
        frequency: payload.frequency !== undefined ? payload.frequency : undefined,
        customFrequency: payload.customFrequency !== undefined ? payload.customFrequency : undefined,
        showOperationWorkload: payload.showOperationWorkload !== undefined ? payload.showOperationWorkload : undefined,
        showDeadlineSubmission: payload.showDeadlineSubmission !== undefined ? payload.showDeadlineSubmission : undefined,
        showDateSubmitted: payload.showDateSubmitted !== undefined ? payload.showDateSubmitted : undefined,
        showTotalSamplesDocuments: payload.showTotalSamplesDocuments !== undefined ? payload.showTotalSamplesDocuments : undefined,
        showResponseRate: payload.showResponseRate !== undefined ? payload.showResponseRate : undefined,
        totalSamplesDocumentsLabel: payload.totalSamplesDocumentsLabel !== undefined ? payload.totalSamplesDocumentsLabel : undefined,
      }
    });

    // 4. Update Personnel
    if (payload.focalPersonId !== undefined || payload.alternateFocalPersonId !== undefined || payload.assistantFocalPersonId !== undefined || payload.otherInvolvedEmployeeIds !== undefined) {
      await tx.projectPersonnel.deleteMany({
        where: { projectId: payload.projectId }
      });
      
      const newPersonnel = [];
      if (payload.focalPersonId) {
        newPersonnel.push({ projectId: payload.projectId, personnelId: payload.focalPersonId, roleInProject: "Focal Person", isFocalPerson: true });
      }
      if (payload.alternateFocalPersonId) {
        newPersonnel.push({ projectId: payload.projectId, personnelId: payload.alternateFocalPersonId, roleInProject: "Alternate Focal Person", isFocalPerson: false });
      }
      if (payload.assistantFocalPersonId) {
        newPersonnel.push({ projectId: payload.projectId, personnelId: payload.assistantFocalPersonId, roleInProject: "Assistant Focal Person", isFocalPerson: false });
      }
      if (payload.otherInvolvedEmployeeIds && payload.otherInvolvedEmployeeIds.length > 0) {
        for (const empId of payload.otherInvolvedEmployeeIds) {
          newPersonnel.push({ projectId: payload.projectId, personnelId: empId, roleInProject: "Other Employee", isFocalPerson: false });
        }
      }
      if (newPersonnel.length > 0) {
        await tx.projectPersonnel.createMany({
          data: newPersonnel
        });
      }
    }

    // 5. Upsert Cycles & Tasks
    for (const cycleData of payload.cycles) {
      let cycleId = cycleData.id;
      if (!cycleId || cycleId.startsWith("new-")) {
        // Create
        const newCycle = await tx.projectCycle.create({
          data: {
            projectId: payload.projectId,
            cycleName: cycleData.cycleName,
            month: cycleData.month,
            year: cycleData.year,
          }
        });
        cycleId = newCycle.id;
      } else {
        // Update
        await tx.projectCycle.update({
          where: { id: cycleId },
          data: {
            cycleName: cycleData.cycleName,
            month: cycleData.month,
            year: cycleData.year,
          }
        });
      }

      // Upsert Tasks
      for (let i = 0; i < cycleData.tasks.length; i++) {
        const taskData = cycleData.tasks[i];
        if (!taskData.id || taskData.id.startsWith("new-")) {
          await tx.projectTask.create({
            data: {
              projectCycleId: cycleId,
              taskName: taskData.taskName,
              deadline: taskData.deadline ? new Date(taskData.deadline) : null,
              dateSubmitted: taskData.dateSubmitted ? new Date(taskData.dateSubmitted) : null,
              totalSamplesDocuments: taskData.totalSamplesDocuments,
              responseRate: taskData.responseRate,
              manualStatusOverride: taskData.manualStatusOverride,
              remarks: taskData.remarks,
              isSubtitle: taskData.isSubtitle || false,
              customValues: taskData.customValues || {},
              order: i,
            }
          });
        } else {
          await tx.projectTask.update({
            where: { id: taskData.id },
            data: {
              taskName: taskData.taskName,
              deadline: taskData.deadline ? new Date(taskData.deadline) : null,
              dateSubmitted: taskData.dateSubmitted ? new Date(taskData.dateSubmitted) : null,
              totalSamplesDocuments: taskData.totalSamplesDocuments,
              responseRate: taskData.responseRate,
              manualStatusOverride: taskData.manualStatusOverride,
              remarks: taskData.remarks,
              isSubtitle: taskData.isSubtitle || false,
              customValues: taskData.customValues || {},
              order: i,
            }
          });
        }
      }
    }
  }).catch((error) => {
    if (error.code === 'P2002') {
      const target = error.meta?.target as string[] | string | undefined;
      let contextMsg = "A unique constraint failed.";
      
      if (Array.isArray(target) || typeof target === 'string') {
        const targetStr = Array.isArray(target) ? target.join(', ') : target;
        if (targetStr.includes('cycleName')) {
          contextMsg = "A section/month with the same name already exists. Please ensure all section names are unique.";
        } else if (targetStr.includes('taskName')) {
          contextMsg = "An activity with the same name already exists in one of the sections. Please ensure all activity names within the same section are completely unique.";
        } else if (targetStr.includes('personnelId')) {
          contextMsg = "A personnel assignment is duplicated. Please check the assigned employees.";
        }
      }
      throw new Error(contextMsg);
    }
    throw error;
  });

  revalidatePath(`/projects/${payload.projectId}`);
  revalidatePath("/dashboard");
}
