ALTER TABLE "PdfTemplate"
ADD COLUMN IF NOT EXISTS "templateFeature" TEXT NOT NULL DEFAULT 'GENERAL';

CREATE INDEX IF NOT EXISTS "PdfTemplate_templateFeature_idx" ON "PdfTemplate"("templateFeature");
