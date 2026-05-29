import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { PdfTemplateManager } from "@/components/pdf-templates/PdfTemplateManager";

import { Button } from "@/components/ui/button";
import { requireSuperAdmin } from "@/lib/auth";
import { formatProgramDate } from "@/lib/convocation";
import { db } from "@/lib/db";
import { parsePdfFieldMap } from "@/lib/pdf-templates";

export const dynamic = "force-dynamic";

export default async function PdfTemplatesPage() {
  await requireSuperAdmin();

  const [templates, programs] = await Promise.all([
    db.pdfTemplate.findMany({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" }
    }),
    db.convocationProgram.findMany({
      where: { status: { not: "ARCHIVED" } },
      include: { group: true },
      orderBy: { convocationDate: "desc" },
      take: 30
    })
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 px-0">
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4" />
            Back to settings
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">
              PDF Template Overlay Generator
            </h1>
            <p className="text-sm text-muted-foreground">
              Upload official PDF templates and place dynamic data fields without changing the original design.
            </p>
          </div>
        </div>
      </div>

      <PdfTemplateManager
        templates={templates.map((template) => ({
          id: template.id,
          name: template.name,
          description: template.description,
          templateFeature: template.templateFeature,
          fileName: template.fileName,
          fileUrl: template.fileUrl,
          pageCount: template.pageCount,
          isDefault: template.isDefault,
          fieldMap: parsePdfFieldMap(template.fieldMap, template.pageCount)
        }))}
        programs={programs.map((program) => ({
          id: program.id,
          label: `${formatProgramDate(program.convocationDate)} - ${program.group.name}`
        }))}
      />
    </div>
  );
}
