import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { createOverlayPdf, getConvocationOverlayData, parsePdfFieldMap } from "@/lib/pdf-templates";
import { db } from "@/lib/db";

type OverlayRouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: OverlayRouteProps) {
  await requireUser();
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const source = searchParams.get("source");
  const programId = searchParams.get("programId");
  const mode = searchParams.get("mode") ?? "preview";

  const template = await db.pdfTemplate.findFirst({
    where: {
      id,
      isActive: true
    }
  });

  if (!template) {
    return NextResponse.json({ error: "PDF template could not be found." }, { status: 404 });
  }

  if (source !== "convocation" || !programId) {
    return NextResponse.json({ error: "Select a real convocation program before previewing the overlay." }, { status: 400 });
  }

  const data = await getConvocationOverlayData(programId);
  const result = await createOverlayPdf({
    templateFileUrl: template.fileUrl,
    fieldMap: parsePdfFieldMap(template.fieldMap, template.pageCount),
    data
  });
  const disposition = mode === "download"
    ? `attachment; filename="${template.name.replace(/[^a-zA-Z0-9._-]/g, "_")}-overlay.pdf"`
    : "inline";

  return new NextResponse(Buffer.from(result.bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": disposition,
      "X-PDF-Overlay-Warnings": encodeURIComponent(result.warnings.join(" | "))
    }
  });
}
