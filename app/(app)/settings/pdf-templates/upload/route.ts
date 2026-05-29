import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import type { Prisma } from "@prisma/client";
import { requireSuperAdmin } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { db } from "@/lib/db";
import { defaultPdfFieldMap } from "@/lib/pdf-templates";

const allowedFeatures = new Set(["CONVOCATION_PROGRAM", "VEHICLE_SCHEDULING", "ROOM_RESERVATION", "GENERAL"]);
const maxPdfTemplateBytes = 25 * 1024 * 1024;

async function readPdfMetadata(input: { bytes: Buffer; fileName: string; contentType: string }) {
  if (input.contentType !== "application/pdf" && !input.fileName.toLowerCase().endsWith(".pdf")) {
    throw new Error("Only PDF template files can be uploaded.");
  }

  if (input.bytes.length > maxPdfTemplateBytes) {
    throw new Error("PDF template files must be 25 MB or smaller.");
  }

  const pdf = await PDFDocument.load(input.bytes);
  const pageSizes = pdf.getPages().map((page) => ({
    width: page.getWidth(),
    height: page.getHeight()
  }));

  return {
    bytes: input.bytes,
    pageCount: pdf.getPageCount(),
    pageSizes
  };
}

export async function POST(request: Request) {
  const user = await requireSuperAdmin();

  try {
    const url = new URL(request.url);
    const name = String(url.searchParams.get("name") ?? "").trim();
    const description = String(url.searchParams.get("description") ?? "").trim();
    const templateFeature = String(url.searchParams.get("templateFeature") ?? "GENERAL");
    const fileName = decodeURIComponent(request.headers.get("x-file-name") ?? "template.pdf");
    const contentType = request.headers.get("content-type") ?? "";
    const bytes = Buffer.from(await request.arrayBuffer());

    if (!name || name.length < 2) {
      return NextResponse.json({ ok: false, message: "Template name is required." }, { status: 400 });
    }

    if (!allowedFeatures.has(templateFeature)) {
      return NextResponse.json({ ok: false, message: "Choose a valid system feature for this template." }, { status: 400 });
    }

    if (bytes.length === 0) {
      return NextResponse.json({ ok: false, message: "Choose a PDF template file to upload." }, { status: 400 });
    }

    const metadata = await readPdfMetadata({ bytes, fileName, contentType });
    const safeFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const uploadDir = path.join(process.cwd(), "public/uploads/pdf-templates");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, safeFileName), metadata.bytes);

    const template = await db.pdfTemplate.create({
      data: {
        name,
        description: description || null,
        templateFeature,
        fileName,
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
    return NextResponse.json({ ok: true, message: "PDF template uploaded. You can now place overlay fields." });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "PDF template could not be uploaded."
      },
      { status: 400 }
    );
  }
}
