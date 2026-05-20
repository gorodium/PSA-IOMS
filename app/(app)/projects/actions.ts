"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { checkUserPermission, type PermissionAction, type PermissionResource } from "@/lib/permissions";
import { canEditProject } from "@/lib/project-access";
import { calculateProjectCycleStatus, calculateProjectProgress, calculateTaskStatus } from "@/lib/status";
import {
  createProjectSchema,
  createRemarkSchema,
  createTaskRowSchema,
  customTaskColumnSchema,
  removeCustomTaskColumnSchema,
  updateProjectSchema,
  updateTaskSchema
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
    priority: formData.get("priority"),
    workloadWeight: formData.get("workloadWeight"),
    estimatedMandays: formData.get("estimatedMandays"),
    uiLayout: formData.get("uiLayout"),
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
    personnelIds: formData.getAll("personnelIds").filter((value): value is string => typeof value === "string" && value !== ""),
    isActive: formData.get("isActive") ?? "false"
  };
}

function getPersonnelAssignments(focalPersonnelId: string | undefined, personnelIds: string[]) {
  const ids = Array.from(new Set([focalPersonnelId, ...personnelIds].filter((id): id is string => Boolean(id))));

  return ids.map((personnelId) => ({
    personnelId,
    roleInProject: personnelId === focalPersonnelId ? "Focal Person" : "Other Involved Personnel",
    isFocalPerson: personnelId === focalPersonnelId
  }));
}

export async function createProjectAction(formData: FormData) {
  const user = await requirePermission("create", "project");
  const parsed = createProjectSchema.safeParse(projectInputFromFormData(formData));

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Project data is invalid.");
  }

  const assignments = getPersonnelAssignments(parsed.data.focalPersonnelId, parsed.data.personnelIds);

  const project = await db.project.create({
    data: {
      name: parsed.data.name,
      code: parsed.data.code,
      description: parsed.data.description,
      category: parsed.data.category,
      subcategory: parsed.data.subcategory,
      section: parsed.data.section,
      year: parsed.data.year,
      frequency: parsed.data.frequency,
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
  redirect(`/projects/${project.id}`);
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

  const assignments = getPersonnelAssignments(parsed.data.focalPersonnelId, parsed.data.personnelIds);

  const project = await db.$transaction(async (tx) => {
    await tx.projectPersonnel.updateMany({
      where: {
        projectId: parsed.data.id
      },
      data: {
        isFocalPerson: false,
        roleInProject: "Other Involved Personnel"
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
  revalidatePath(`/projects/${project.id}`);
  redirect(`/projects/${project.id}`);
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
