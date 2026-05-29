"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { Prisma, ProjectStatus } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { canEditProject } from "@/lib/project-access";
import { checkUserPermission } from "@/lib/permissions";
import { writeAuditLog } from "@/lib/audit";
import type { CanvasWidget } from "@/lib/canvas-types";
import { DEFAULT_CANVAS_LAYOUT } from "@/lib/canvas-defaults";

// ─── Save per-project layout ──────────────────────────────────────────────

export async function saveProjectCanvasLayoutAction(
  projectId: string,
  layout: CanvasWidget[],
  showDescription?: boolean
): Promise<{ success: boolean; error?: string }> {
  const user = await requireUser();
  if (!(await canEditProject(user, projectId))) {
    return { success: false, error: "You do not have permission to edit this project's layout." };
  }

  const data: Prisma.ProjectUpdateInput = { canvasLayout: JSON.parse(JSON.stringify(layout)) as Prisma.InputJsonValue };
  if (showDescription !== undefined) {
    data.showDescription = showDescription;
  }

  await db.project.update({
    where: { id: projectId },
    data,
  });

  await writeAuditLog({
    userId: user.id,
    action: "UPDATE",
    entityType: "ProjectCanvasLayout",
    entityId: projectId,
  });

  revalidatePath(`/projects/${projectId}`);
  return { success: true };
}

// ─── Save as global template ──────────────────────────────────────────────

export async function saveGlobalTemplateAction(
  layout: CanvasWidget[]
): Promise<{ success: boolean; error?: string }> {
  const user = await requireUser();
  if (!checkUserPermission(user, "manage", "project")) {
    return { success: false, error: "Only administrators can save the global template." };
  }

  await db.canvasTemplate.upsert({
    where: { name: "default" },
    create: { name: "default", layout: JSON.parse(JSON.stringify(layout)) },
    update: { layout: JSON.parse(JSON.stringify(layout)) },
  });

  await writeAuditLog({
    userId: user.id,
    action: "UPDATE",
    entityType: "CanvasTemplate",
    entityId: "default",
  });

  return { success: true };
}

// ─── Reset project to global template ────────────────────────────────────

export async function resetProjectLayoutAction(
  projectId: string
): Promise<{ success: boolean; error?: string }> {
  const user = await requireUser();
  if (!(await canEditProject(user, projectId))) {
    return { success: false, error: "You do not have permission to reset this project's layout." };
  }

  await db.project.update({
    where: { id: projectId },
    data: { canvasLayout: null as never },
  });

  revalidatePath(`/projects/${projectId}`);
  return { success: true };
}

// ─── Resolve layout for a project ────────────────────────────────────────

export async function resolveProjectLayout(projectId: string): Promise<CanvasWidget[]> {
  const project = await db.project.findUnique({ where: { id: projectId }, select: { canvasLayout: true } });

  if (project?.canvasLayout) {
    return project.canvasLayout as unknown as CanvasWidget[];
  }

  const template = await db.canvasTemplate.findUnique({ where: { name: "default" } });
  if (template?.layout) {
    return template.layout as unknown as CanvasWidget[];
  }

  return DEFAULT_CANVAS_LAYOUT;
}

// ─── Update project metadata (no redirect) ────────────────────────────────

export async function updateProjectMetadataAction(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const user = await requireUser();
  const projectId = formData.get("id") as string;

  if (!projectId) return { success: false, error: "Project ID missing." };
  if (!(await canEditProject(user, projectId))) {
    return { success: false, error: "You do not have permission to edit this project." };
  }

  const focalPersonnelId = (formData.get("focalPersonnelId") as string) || null;
  const alternatePersonnelId = (formData.get("alternatePersonnelId") as string) || null;
  const assistantPersonnelId = (formData.get("assistantPersonnelId") as string) || null;
  const otherPersonnelIds = formData
    .getAll("otherPersonnelIds")
    .filter((v): v is string => typeof v === "string" && v !== "");

  const allIds = Array.from(new Set([focalPersonnelId, alternatePersonnelId, assistantPersonnelId, ...otherPersonnelIds].filter(Boolean) as string[]));

  try {
    await db.$transaction(async (tx) => {
      // Reset focal flags
      await tx.projectPersonnel.updateMany({
        where: { projectId },
        data: { isFocalPerson: false, roleInProject: "Other Employee Involved" },
      });

      // Remove personnel no longer assigned
      await tx.projectPersonnel.deleteMany({
        where: { projectId, personnelId: { notIn: allIds } },
      });

      // Upsert each assigned person
      for (const personnelId of allIds) {
        const isFocal = personnelId === focalPersonnelId;
        let roleInProject = "Other Employee Involved";
        if (isFocal) roleInProject = "Focal Person";
        else if (personnelId === alternatePersonnelId) roleInProject = "Alternate Focal Person";
        else if (personnelId === assistantPersonnelId) roleInProject = "Assistant Focal Person";

        await tx.projectPersonnel.upsert({
          where: { projectId_personnelId: { projectId, personnelId } },
          update: { isFocalPerson: isFocal, roleInProject },
          create: { projectId, personnelId, isFocalPerson: isFocal, roleInProject },
        });
      }

      await tx.project.update({
        where: { id: projectId },
        data: {
          name: (formData.get("name") as string) || undefined,
          code: (formData.get("code") as string) || null,
          description: (formData.get("description") as string) || null,
          section: (formData.get("section") as string) || null,
          category: (formData.get("category") as string) as never || undefined,
          subcategory: (formData.get("subcategory") as string) || null,
          year: Number(formData.get("year")) || undefined,
          frequency: (formData.get("frequency") as string) as never || undefined,
          priority: (formData.get("priority") as string) as never || undefined,
          workloadWeight: Number(formData.get("workloadWeight")) || 1,
          estimatedMandays: Number(formData.get("estimatedMandays")) || 0,
          isActive: formData.has("statusDropdown") 
            ? formData.get("statusDropdown") !== "INACTIVE" 
            : formData.get("isActive") === "on",
          status: formData.has("statusDropdown") 
            ? (formData.get("statusDropdown") === "ACTIVE" ? "ON_TRACK" : formData.get("statusDropdown") as ProjectStatus)
            : undefined,
          updatedById: user.id,
        },
      });
    });

    await writeAuditLog({ userId: user.id, action: "UPDATE", entityType: "Project", entityId: projectId });
    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to update project." };
  }
}

// ─── Search Personnel ─────────────────────────────────────────────────────

export async function searchPersonnelAction(query: string = "") {
  await requireUser();
  const personnel = await db.personnel.findMany({
    where: query ? {
      OR: [
        { fullName: { contains: query, mode: "insensitive" } },
        { employeeNo: { contains: query, mode: "insensitive" } },
      ],
      isActive: true,
    } : { isActive: true },
    select: { id: true, fullName: true, position: true, employeeNo: true },
    orderBy: { fullName: "asc" },
    take: 20,
  });
  return personnel;
}
