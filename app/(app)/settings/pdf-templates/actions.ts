"use server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { PDFDocument } from "pdf-lib";
import type { Prisma } from "@prisma/client";
import { requireSuperAdmin } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { db } from "@/lib/db";
import { defaultPdfFieldMap, parsePdfFieldMap } from "@/lib/pdf-templates";

export type PdfTemplateActionResult = {
  ok: boolean;
  message: string;
};

async function readPdfMetadata(file: File) {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    throw new Error("Only PDF template files can be uploaded.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const pdf = await PDFDocument.load(bytes);
  const pageSizes = pdf.getPages().map((page) => ({
    width: page.getWidth(),
    height: page.getHeight()
  }));

  return {
    bytes,
    pageCount: pdf.getPageCount(),
    pageSizes
  };
}

export async function uploadPdfTemplateAction(
  _previousState: PdfTemplateActionResult,
  formData: FormData
): Promise<PdfTemplateActionResult> {
  const user = await requireSuperAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const templateFeature = String(formData.get("templateFeature") ?? "GENERAL");
  const file = formData.get("file") as File | null;
  const allowedFeatures = new Set(["CONVOCATION_PROGRAM", "VEHICLE_SCHEDULING", "ROOM_RESERVATION", "GENERAL"]);

  if (!name || name.length < 2) {
    return { ok: false, message: "Template name is required." };
  }

  if (!file || file.size === 0) {
    return { ok: false, message: "Choose a PDF template file to upload." };
  }

  if (!allowedFeatures.has(templateFeature)) {
    return { ok: false, message: "Choose a valid system feature for this template." };
  }

  try {
    const metadata = await readPdfMetadata(file);
    const safeFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const uploadDir = path.join(process.cwd(), "public/uploads/pdf-templates");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, safeFileName), metadata.bytes);

    const template = await db.pdfTemplate.create({
      data: {
        name,
        description: description || null,
        templateFeature,
        fileName: file.name,
        fileUrl: `/uploads/pdf-templates/${safeFileName}`,
        pageCount: metadata.pageCount,
        fieldMap: defaultPdfFieldMap(metadata.pageSizes) as unknown as Prisma.InputJsonValue,
        createdById: user.id
      }
    });

    await writeAuditLog({
      userId: user.id,
      action: "CREATE",
      entityType: "PdfTemplate",
      entityId: template.id,
      newValueJson: template
    });

    revalidatePath("/settings/pdf-templates");
    return { ok: true, message: "PDF template uploaded. You can now place overlay fields." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "PDF template could not be uploaded."
    };
  }
}

export async function savePdfTemplateFieldsAction(
  _previousState: PdfTemplateActionResult,
  formData: FormData
): Promise<PdfTemplateActionResult> {
  const user = await requireSuperAdmin();
  const templateId = String(formData.get("templateId") ?? "");
  const fieldMapJson = String(formData.get("fieldMapJson") ?? "");

  const existing = await db.pdfTemplate.findUnique({ where: { id: templateId } });
  if (!existing) {
    return { ok: false, message: "PDF template could not be found." };
  }

  try {
    const parsed = parsePdfFieldMap(JSON.parse(fieldMapJson), existing.pageCount);
    const updated = await db.pdfTemplate.update({
      where: { id: existing.id },
      data: {
        fieldMap: parsed as unknown as Prisma.InputJsonValue
      }
    });

    await writeAuditLog({
      userId: user.id,
      action: "UPDATE_FIELDS",
      entityType: "PdfTemplate",
      entityId: updated.id,
      oldValueJson: existing.fieldMap ?? {},
      newValueJson: parsed
    });

    revalidatePath("/settings/pdf-templates");
    return { ok: true, message: "PDF field placements saved." };
  } catch {
    return { ok: false, message: "Field placement data is invalid." };
  }
}

export async function archivePdfTemplateAction(templateId: string) {
  const user = await requireSuperAdmin();
  const existing = await db.pdfTemplate.findUnique({ where: { id: templateId } });
  if (!existing) {
    throw new Error("PDF template could not be found.");
  }

  const updated = await db.pdfTemplate.update({
    where: { id: existing.id },
    data: { isActive: false }
  });

  await writeAuditLog({
    userId: user.id,
    action: "ARCHIVE",
    entityType: "PdfTemplate",
    entityId: updated.id,
    oldValueJson: existing,
    newValueJson: updated
  });

  revalidatePath("/settings/pdf-templates");
}

export async function setDefaultPdfTemplateAction(
  _previousState: PdfTemplateActionResult,
  formData: FormData
): Promise<PdfTemplateActionResult> {
  const user = await requireSuperAdmin();
  const templateId = String(formData.get("templateId") ?? "");

  const existing = await db.pdfTemplate.findUnique({ where: { id: templateId } });
  if (!existing) {
    return { ok: false, message: "PDF template could not be found." };
  }

  await db.$transaction([
    db.pdfTemplate.updateMany({
      where: { templateFeature: existing.templateFeature },
      data: { isDefault: false }
    }),
    db.pdfTemplate.update({
      where: { id: templateId },
      data: { isDefault: true }
    })
  ]);

  await writeAuditLog({
    userId: user.id,
    action: "SET_DEFAULT",
    entityType: "PdfTemplate",
    entityId: templateId,
    newValueJson: { isDefault: true }
  });

  revalidatePath("/settings/pdf-templates");
  return { ok: true, message: `Set as default for ${existing.templateFeature} successfully.` };
}

export async function getConvocationPreviewDataAction(programId: string): Promise<Record<string, string> | null> {
  try {
    await requireSuperAdmin();
    const { getConvocationOverlayData } = await import("@/lib/pdf-templates");
    return await getConvocationOverlayData(programId);
  } catch {
    return null;
  }
}
