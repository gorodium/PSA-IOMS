CREATE TABLE IF NOT EXISTS "PdfTemplate" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "fileName" TEXT NOT NULL,
  "fileUrl" TEXT NOT NULL,
  "pageCount" INTEGER NOT NULL DEFAULT 1,
  "fieldMap" JSONB,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PdfTemplate_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "PdfTemplate_isActive_idx" ON "PdfTemplate"("isActive");
CREATE INDEX IF NOT EXISTS "PdfTemplate_createdById_idx" ON "PdfTemplate"("createdById");

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PdfTemplate_createdById_fkey') THEN
    ALTER TABLE "PdfTemplate" ADD CONSTRAINT "PdfTemplate_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
