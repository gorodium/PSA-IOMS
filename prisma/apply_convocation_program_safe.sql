DO $$ BEGIN
  CREATE TYPE "ConvocationProgramStatus" AS ENUM ('DRAFT', 'FINALIZED', 'ARCHIVED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "ConvocationAssignmentMode" AS ENUM ('FIXED', 'ASSIGNABLE', 'OVERRIDDEN', 'MIRRORED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "ConvocationGroup" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ConvocationGroup_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ConvocationGroupMember" (
  "id" TEXT NOT NULL,
  "groupId" TEXT NOT NULL,
  "personnelId" TEXT NOT NULL,
  "isTechnicalPerson" BOOLEAN NOT NULL DEFAULT false,
  "isGroupLead" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ConvocationGroupMember_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ConvocationTemplateItem" (
  "id" TEXT NOT NULL,
  "itemKey" TEXT NOT NULL,
  "itemLabel" TEXT NOT NULL,
  "itemOrder" INTEGER NOT NULL,
  "defaultMode" "ConvocationAssignmentMode" NOT NULL,
  "fixedTextValue" TEXT,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "rotationKey" TEXT,
  "mirrorOfItemKey" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ConvocationTemplateItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ConvocationProgram" (
  "id" TEXT NOT NULL,
  "convocationDate" TIMESTAMP(3) NOT NULL,
  "groupId" TEXT NOT NULL,
  "status" "ConvocationProgramStatus" NOT NULL DEFAULT 'DRAFT',
  "generatedById" TEXT,
  "finalizedById" TEXT,
  "finalizedAt" TIMESTAMP(3),
  "printedAt" TIMESTAMP(3),
  "notes" TEXT,
  "calendarActivityId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ConvocationProgram_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ConvocationProgramItem" (
  "id" TEXT NOT NULL,
  "programId" TEXT NOT NULL,
  "itemKey" TEXT NOT NULL,
  "itemLabel" TEXT NOT NULL,
  "itemOrder" INTEGER NOT NULL,
  "assignmentMode" "ConvocationAssignmentMode" NOT NULL,
  "assignedPersonnelId" TEXT,
  "suggestedPersonnelId" TEXT,
  "fixedTextValue" TEXT,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "rotationKey" TEXT,
  "mirrorOfItemKey" TEXT,
  "countInRotation" BOOLEAN NOT NULL DEFAULT false,
  "overrideReason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ConvocationProgramItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ConvocationAssignmentHistory" (
  "id" TEXT NOT NULL,
  "programId" TEXT NOT NULL,
  "groupId" TEXT NOT NULL,
  "personnelId" TEXT NOT NULL,
  "itemKey" TEXT NOT NULL,
  "rotationKey" TEXT NOT NULL,
  "convocationDate" TIMESTAMP(3) NOT NULL,
  "wasOverride" BOOLEAN NOT NULL DEFAULT false,
  "countedInRotation" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ConvocationAssignmentHistory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ConvocationGroup_name_key" ON "ConvocationGroup"("name");
CREATE INDEX IF NOT EXISTS "ConvocationGroup_sortOrder_idx" ON "ConvocationGroup"("sortOrder");
CREATE INDEX IF NOT EXISTS "ConvocationGroup_isActive_idx" ON "ConvocationGroup"("isActive");
CREATE UNIQUE INDEX IF NOT EXISTS "ConvocationGroupMember_groupId_personnelId_key" ON "ConvocationGroupMember"("groupId", "personnelId");
CREATE INDEX IF NOT EXISTS "ConvocationGroupMember_personnelId_idx" ON "ConvocationGroupMember"("personnelId");
CREATE INDEX IF NOT EXISTS "ConvocationGroupMember_isActive_idx" ON "ConvocationGroupMember"("isActive");
CREATE UNIQUE INDEX IF NOT EXISTS "ConvocationTemplateItem_itemKey_key" ON "ConvocationTemplateItem"("itemKey");
CREATE INDEX IF NOT EXISTS "ConvocationTemplateItem_itemOrder_idx" ON "ConvocationTemplateItem"("itemOrder");
CREATE INDEX IF NOT EXISTS "ConvocationTemplateItem_isEnabled_idx" ON "ConvocationTemplateItem"("isEnabled");
CREATE UNIQUE INDEX IF NOT EXISTS "ConvocationProgram_convocationDate_key" ON "ConvocationProgram"("convocationDate");
CREATE INDEX IF NOT EXISTS "ConvocationProgram_groupId_idx" ON "ConvocationProgram"("groupId");
CREATE INDEX IF NOT EXISTS "ConvocationProgram_status_idx" ON "ConvocationProgram"("status");
CREATE INDEX IF NOT EXISTS "ConvocationProgram_convocationDate_idx" ON "ConvocationProgram"("convocationDate");
CREATE UNIQUE INDEX IF NOT EXISTS "ConvocationProgramItem_programId_itemKey_key" ON "ConvocationProgramItem"("programId", "itemKey");
CREATE INDEX IF NOT EXISTS "ConvocationProgramItem_assignedPersonnelId_idx" ON "ConvocationProgramItem"("assignedPersonnelId");
CREATE INDEX IF NOT EXISTS "ConvocationProgramItem_itemOrder_idx" ON "ConvocationProgramItem"("itemOrder");
CREATE UNIQUE INDEX IF NOT EXISTS "ConvocationAssignmentHistory_programId_rotationKey_key" ON "ConvocationAssignmentHistory"("programId", "rotationKey");
CREATE INDEX IF NOT EXISTS "ConvocationAssignmentHistory_groupId_rotationKey_idx" ON "ConvocationAssignmentHistory"("groupId", "rotationKey");
CREATE INDEX IF NOT EXISTS "ConvocationAssignmentHistory_personnelId_idx" ON "ConvocationAssignmentHistory"("personnelId");
CREATE INDEX IF NOT EXISTS "ConvocationAssignmentHistory_convocationDate_idx" ON "ConvocationAssignmentHistory"("convocationDate");

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ConvocationGroupMember_groupId_fkey') THEN
  ALTER TABLE "ConvocationGroupMember" ADD CONSTRAINT "ConvocationGroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ConvocationGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ConvocationGroupMember_personnelId_fkey') THEN
  ALTER TABLE "ConvocationGroupMember" ADD CONSTRAINT "ConvocationGroupMember_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES "Personnel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ConvocationProgram_groupId_fkey') THEN
  ALTER TABLE "ConvocationProgram" ADD CONSTRAINT "ConvocationProgram_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ConvocationGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ConvocationProgram_generatedById_fkey') THEN
  ALTER TABLE "ConvocationProgram" ADD CONSTRAINT "ConvocationProgram_generatedById_fkey" FOREIGN KEY ("generatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ConvocationProgram_finalizedById_fkey') THEN
  ALTER TABLE "ConvocationProgram" ADD CONSTRAINT "ConvocationProgram_finalizedById_fkey" FOREIGN KEY ("finalizedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'CalendarActivity') AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ConvocationProgram_calendarActivityId_fkey') THEN
  ALTER TABLE "ConvocationProgram" ADD CONSTRAINT "ConvocationProgram_calendarActivityId_fkey" FOREIGN KEY ("calendarActivityId") REFERENCES "CalendarActivity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ConvocationProgramItem_programId_fkey') THEN
  ALTER TABLE "ConvocationProgramItem" ADD CONSTRAINT "ConvocationProgramItem_programId_fkey" FOREIGN KEY ("programId") REFERENCES "ConvocationProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;
END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ConvocationProgramItem_assignedPersonnelId_fkey') THEN
  ALTER TABLE "ConvocationProgramItem" ADD CONSTRAINT "ConvocationProgramItem_assignedPersonnelId_fkey" FOREIGN KEY ("assignedPersonnelId") REFERENCES "Personnel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ConvocationAssignmentHistory_programId_fkey') THEN
  ALTER TABLE "ConvocationAssignmentHistory" ADD CONSTRAINT "ConvocationAssignmentHistory_programId_fkey" FOREIGN KEY ("programId") REFERENCES "ConvocationProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;
END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ConvocationAssignmentHistory_groupId_fkey') THEN
  ALTER TABLE "ConvocationAssignmentHistory" ADD CONSTRAINT "ConvocationAssignmentHistory_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ConvocationGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ConvocationAssignmentHistory_personnelId_fkey') THEN
  ALTER TABLE "ConvocationAssignmentHistory" ADD CONSTRAINT "ConvocationAssignmentHistory_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES "Personnel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
END IF; END $$;

INSERT INTO "ConvocationGroup" ("id", "name", "sortOrder", "isActive", "updatedAt")
VALUES
  ('convocation_group_1', 'Group 1', 1, true, CURRENT_TIMESTAMP),
  ('convocation_group_2', 'Group 2', 2, true, CURRENT_TIMESTAMP),
  ('convocation_group_3', 'Group 3', 3, true, CURRENT_TIMESTAMP)
ON CONFLICT ("name") DO UPDATE SET "sortOrder" = EXCLUDED."sortOrder", "isActive" = true, "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "ConvocationTemplateItem" ("id", "itemKey", "itemLabel", "itemOrder", "defaultMode", "fixedTextValue", "isEnabled", "rotationKey", "mirrorOfItemKey", "updatedAt")
VALUES
  ('conv_item_prayer', 'prayer', 'Prayer', 10, 'FIXED', 'AVP', true, NULL, NULL, CURRENT_TIMESTAMP),
  ('conv_item_anthem', 'national_anthem', 'Singing of National Anthem', 20, 'ASSIGNABLE', NULL, true, 'national_anthem_and_emcee', NULL, CURRENT_TIMESTAMP),
  ('conv_item_bagong', 'bagong_pilipinas', 'Bagong Pilipinas Hymn', 30, 'FIXED', 'AVP', true, NULL, NULL, CURRENT_TIMESTAMP),
  ('conv_item_flag', 'flag_pledge', 'Panunumpa sa Watawat ng Pilipinas', 40, 'ASSIGNABLE', NULL, true, 'flag_pledge', NULL, CURRENT_TIMESTAMP),
  ('conv_item_lingkod', 'lingkod_bayan_pledge', 'Panunumpa ng Lingkod Bayan', 50, 'ASSIGNABLE', NULL, true, 'lingkod_bayan_pledge', NULL, CURRENT_TIMESTAMP),
  ('conv_item_psa', 'psa_vision_mission_values', 'PSA Vision, Mission, Core Values & Corporate Personality', 60, 'ASSIGNABLE', NULL, true, 'psa_vision_mission_values', NULL, CURRENT_TIMESTAMP),
  ('conv_item_quality', 'quality_policy', 'Quality Policy', 70, 'ASSIGNABLE', NULL, true, 'quality_policy', NULL, CURRENT_TIMESTAMP),
  ('conv_item_message', 'message', 'Message', 80, 'FIXED', 'Maria Liza M. Bigornia', true, NULL, NULL, CURRENT_TIMESTAMP),
  ('conv_item_zumba', 'zumba', 'ZUMBA', 90, 'FIXED', 'AVP', true, NULL, NULL, CURRENT_TIMESTAMP),
  ('conv_item_emcee', 'emcee', 'Emcee', 100, 'MIRRORED', NULL, true, NULL, 'national_anthem', CURRENT_TIMESTAMP)
ON CONFLICT ("itemKey") DO NOTHING;
