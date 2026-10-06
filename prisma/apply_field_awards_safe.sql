-- Field Awards Module - Safe SQL Migration
-- Run this against the production PostgreSQL database AFTER backing up.
-- All operations are idempotent - safe to run multiple times.

-- ─── Enums ───────────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE "FaNodeType" AS ENUM ('CATEGORY','SUBCATEGORY','CRITERION','GROUP');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "FaWeightType" AS ENUM ('ABSOLUTE_OVERALL','RELATIVE_LOCAL','POINTS_ONLY','EXCLUDED_SPECIAL');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "FaFormulaType" AS ENUM (
    'POINTS_OVER_MAX','MANUAL_PERCENT','WEIGHTED_SUM','DATE_BAND',
    'THRESHOLD_TABLE','RATIO_TO_TARGET','INVERSE_ERROR_RATE','QUARTERLY_AVERAGE',
    'PEER_BENCHMARK','UPPER_LOWER_LIMIT','ADJUSTMENT_FACTOR','OFFICIAL_OVERRIDE'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "FaApplicability" AS ENUM ('INCLUDED','NOT_APPLICABLE','PENDING_RULE','EXCLUDED_SPECIAL','NOT_CONFIGURED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "FaNaPolicy" AS ENUM ('EXCLUDE_RENORMALIZE','EXCLUDE_NO_RENORM','TREAT_AS_ZERO','AWAIT_DECISION');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "FaCalcStatus" AS ENUM ('NOT_CONFIGURED','DRAFT','PROVISIONAL','FOR_REVIEW','VERIFIED','OFFICIAL');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "FaCalcMode" AS ENUM ('AUTO','MANUAL_UNWEIGHTED','MANUAL_WEIGHTED','OFFICIAL_OVERRIDE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "FaCycleStatus" AS ENUM ('ACTIVE','LOCKED','ARCHIVED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "FaRubricStatus" AS ENUM ('DRAFT','WORKING','PUBLISHED','LOCKED','ARCHIVED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "FaEvidenceStatus" AS ENUM ('PENDING','SUBMITTED','VERIFIED','REJECTED','REVISION_NEEDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "FaSubmissionChannel" AS ENUM ('RCNR_REGIONAL','DIRECT_SMD','GOOGLE_FORM','OFFICIAL_EMAIL','OPERATIONAL_SYSTEM','OTHER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "FaSubmissionStatus" AS ENUM ('DRAFT','PREPARED','FORWARDED_RSSO','SUBMITTED_REGIONAL','CONFIRMED','REVISED','OVERDUE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ─── Tables ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "FieldAwardCycle" (
  "id"         TEXT NOT NULL PRIMARY KEY,
  "year"       INTEGER NOT NULL,
  "label"      TEXT NOT NULL,
  "officeType" TEXT NOT NULL DEFAULT 'PSO',
  "officeName" TEXT NOT NULL DEFAULT 'PSA Misamis Oriental',
  "status"     "FaCycleStatus" NOT NULL DEFAULT 'ACTIVE',
  "isActive"   BOOLEAN NOT NULL DEFAULT true,
  "notes"      TEXT,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FieldAwardCycle_year_key" UNIQUE ("year")
);

CREATE TABLE IF NOT EXISTS "FieldAwardRubricVersion" (
  "id"              TEXT NOT NULL PRIMARY KEY,
  "cycleId"         TEXT NOT NULL,
  "versionName"     TEXT NOT NULL,
  "versionNumber"   INTEGER NOT NULL DEFAULT 1,
  "status"          "FaRubricStatus" NOT NULL DEFAULT 'DRAFT',
  "isBaseline"      BOOLEAN NOT NULL DEFAULT false,
  "isWorking"       BOOLEAN NOT NULL DEFAULT false,
  "lockedAt"        TIMESTAMP(3),
  "lockedById"      TEXT,
  "publishedAt"     TIMESTAMP(3),
  "publishedById"   TEXT,
  "archivedAt"      TIMESTAMP(3),
  "archivedById"    TEXT,
  "clonedFromId"    TEXT,
  "notes"           TEXT,
  "sourceTitle"     TEXT,
  "sourceUrl"       TEXT,
  "sourceVersion"   TEXT,
  "effectiveDate"   TIMESTAMP(3),
  "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FieldAwardRubricVersion_cycleId_versionName_key" UNIQUE ("cycleId", "versionName")
);

CREATE TABLE IF NOT EXISTS "FieldAwardNode" (
  "id"                  TEXT NOT NULL PRIMARY KEY,
  "rubricVersionId"     TEXT NOT NULL,
  "parentId"            TEXT,
  "code"                TEXT NOT NULL,
  "title"               TEXT NOT NULL,
  "description"         TEXT,
  "displayOrder"        INTEGER NOT NULL DEFAULT 0,
  "nodeType"            "FaNodeType" NOT NULL DEFAULT 'CRITERION',
  "weightType"          "FaWeightType" NOT NULL DEFAULT 'RELATIVE_LOCAL',
  "officialWeight"      DECIMAL(10,5),
  "localWeight"         DECIMAL(10,5),
  "workingWeight"       DECIMAL(10,5),
  "maximumPoints"       DECIMAL(10,5),
  "formulaType"         "FaFormulaType" NOT NULL DEFAULT 'WEIGHTED_SUM',
  "formulaConfig"       JSONB,
  "applicability"       "FaApplicability" NOT NULL DEFAULT 'INCLUDED',
  "naPolicy"            "FaNaPolicy" NOT NULL DEFAULT 'AWAIT_DECISION',
  "excludedFromOverall" BOOLEAN NOT NULL DEFAULT false,
  "isPendingRule"       BOOLEAN NOT NULL DEFAULT false,
  "pendingRuleNote"     TEXT,
  "activationDate"      TIMESTAMP(3),
  "sourceTitle"         TEXT,
  "sourceUrl"           TEXT,
  "sourcePage"          TEXT,
  "sourceEffectiveDate" TIMESTAMP(3),
  "verificationStatus"  "FaCalcStatus" NOT NULL DEFAULT 'NOT_CONFIGURED',
  "calcMode"            "FaCalcMode" NOT NULL DEFAULT 'AUTO',
  "createdAt"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FieldAwardNode_rubricVersionId_code_key" UNIQUE ("rubricVersionId", "code")
);

CREATE TABLE IF NOT EXISTS "FieldAwardRequirement" (
  "id"                TEXT NOT NULL PRIMARY KEY,
  "nodeId"            TEXT NOT NULL,
  "code"              TEXT,
  "title"             TEXT NOT NULL,
  "description"       TEXT,
  "isRequired"        BOOLEAN NOT NULL DEFAULT true,
  "isPdf"             BOOLEAN NOT NULL DEFAULT false,
  "isInfoSheet"       BOOLEAN NOT NULL DEFAULT false,
  "referenceMonth"    INTEGER,
  "dueDate"           TIMESTAMP(3),
  "submissionChannel" "FaSubmissionChannel" NOT NULL DEFAULT 'DIRECT_SMD',
  "namingConvention"  TEXT,
  "notes"             TEXT,
  "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "FieldAwardScoreEntry" (
  "id"                       TEXT NOT NULL PRIMARY KEY,
  "nodeId"                   TEXT NOT NULL,
  "cycleId"                  TEXT NOT NULL,
  "rawPoints"                DECIMAL(10,5),
  "maximumPoints"            DECIMAL(10,5),
  "computedUnweightedRating" DECIMAL(10,5),
  "manualUnweightedOverride" DECIMAL(10,5),
  "computedWeightedContrib"  DECIMAL(10,5),
  "officialWeightedOverride" DECIMAL(10,5),
  "officialWeight"           DECIMAL(10,5),
  "workingWeight"            DECIMAL(10,5),
  "effectiveUnweighted"      DECIMAL(10,5),
  "effectiveWeighted"        DECIMAL(10,5),
  "completionProgress"       DECIMAL(10,5),
  "calcStatus"               "FaCalcStatus" NOT NULL DEFAULT 'NOT_CONFIGURED',
  "calcMode"                 "FaCalcMode" NOT NULL DEFAULT 'AUTO',
  "peerDivisor"              DECIMAL(10,5),
  "peerDivisorNote"          TEXT,
  "overrideReason"           TEXT,
  "overrideSourceDoc"        TEXT,
  "benchmarkNote"            TEXT,
  "notes"                    TEXT,
  "encodedById"              TEXT,
  "verifiedById"             TEXT,
  "verifiedAt"               TIMESTAMP(3),
  "createdAt"                TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"                TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FieldAwardScoreEntry_nodeId_cycleId_key" UNIQUE ("nodeId", "cycleId")
);

CREATE TABLE IF NOT EXISTS "FieldAwardScenario" (
  "id"              TEXT NOT NULL PRIMARY KEY,
  "rubricVersionId" TEXT NOT NULL,
  "name"            TEXT NOT NULL,
  "description"     TEXT,
  "isActive"        BOOLEAN NOT NULL DEFAULT true,
  "scoreOverrides"  JSONB,
  "weightOverrides" JSONB,
  "createdById"     TEXT,
  "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "FieldAwardAssignment" (
  "id"           TEXT NOT NULL PRIMARY KEY,
  "nodeId"       TEXT NOT NULL,
  "personnelId"  TEXT NOT NULL,
  "role"         TEXT NOT NULL DEFAULT 'FOCAL',
  "isActive"     BOOLEAN NOT NULL DEFAULT true,
  "assignedById" TEXT,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FieldAwardAssignment_nodeId_personnelId_role_key" UNIQUE ("nodeId", "personnelId", "role")
);

CREATE TABLE IF NOT EXISTS "FieldAwardEvidence" (
  "id"              TEXT NOT NULL PRIMARY KEY,
  "requirementId"   TEXT NOT NULL,
  "title"           TEXT NOT NULL,
  "description"     TEXT,
  "fileUrl"         TEXT,
  "externalUrl"     TEXT,
  "mimeType"        TEXT,
  "fileSize"        INTEGER,
  "status"          "FaEvidenceStatus" NOT NULL DEFAULT 'PENDING',
  "referenceMonth"  INTEGER,
  "referenceYear"   INTEGER,
  "reviewerNotes"   TEXT,
  "rejectionReason" TEXT,
  "uploadedById"    TEXT,
  "verifiedById"    TEXT,
  "verifiedAt"      TIMESTAMP(3),
  "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "FieldAwardSubmission" (
  "id"                     TEXT NOT NULL PRIMARY KEY,
  "requirementId"          TEXT NOT NULL,
  "channel"                "FaSubmissionChannel" NOT NULL DEFAULT 'DIRECT_SMD',
  "status"                 "FaSubmissionStatus" NOT NULL DEFAULT 'DRAFT',
  "referenceMonth"         INTEGER,
  "referenceYear"          INTEGER,
  "dueDate"                TIMESTAMP(3),
  "preparedAt"             TIMESTAMP(3),
  "forwardedRssoAt"        TIMESTAMP(3),
  "submittedAt"            TIMESTAMP(3),
  "confirmedAt"            TIMESTAMP(3),
  "confirmationRef"        TEXT,
  "revisionOf"             TEXT,
  "isPdf"                  BOOLEAN NOT NULL DEFAULT false,
  "isInfoSheet"            BOOLEAN NOT NULL DEFAULT false,
  "isLatestBeforeDeadline" BOOLEAN NOT NULL DEFAULT false,
  "notes"                  TEXT,
  "submittedById"          TEXT,
  "createdAt"              TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"              TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "FieldAwardScoreSnapshot" (
  "id"              TEXT NOT NULL PRIMARY KEY,
  "rubricVersionId" TEXT NOT NULL,
  "cycleId"         TEXT NOT NULL,
  "snapshotLabel"   TEXT NOT NULL,
  "isOfficial"      BOOLEAN NOT NULL DEFAULT false,
  "snapshotData"    JSONB NOT NULL,
  "overallWeighted" DECIMAL(10,5),
  "rank"            INTEGER,
  "notes"           TEXT,
  "capturedById"    TEXT,
  "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "FieldAwardAuditLog" (
  "id"              TEXT NOT NULL PRIMARY KEY,
  "userId"          TEXT,
  "action"          TEXT NOT NULL,
  "entityType"      TEXT NOT NULL,
  "entityId"        TEXT NOT NULL,
  "fieldChanged"    TEXT,
  "oldValueJson"    JSONB,
  "newValueJson"    JSONB,
  "reason"          TEXT,
  "sourceDocument"  TEXT,
  "rubricVersionId" TEXT,
  "cycleId"         TEXT,
  "ipAddress"       TEXT,
  "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─── Foreign Key Constraints ──────────────────────────────────────────────────

DO $$ BEGIN
  ALTER TABLE "FieldAwardRubricVersion"
    ADD CONSTRAINT "FieldAwardRubricVersion_cycleId_fkey"
    FOREIGN KEY ("cycleId") REFERENCES "FieldAwardCycle"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "FieldAwardRubricVersion"
    ADD CONSTRAINT "FieldAwardRubricVersion_lockedById_fkey"
    FOREIGN KEY ("lockedById") REFERENCES "User"("id") ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "FieldAwardRubricVersion"
    ADD CONSTRAINT "FieldAwardRubricVersion_publishedById_fkey"
    FOREIGN KEY ("publishedById") REFERENCES "User"("id") ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "FieldAwardRubricVersion"
    ADD CONSTRAINT "FieldAwardRubricVersion_archivedById_fkey"
    FOREIGN KEY ("archivedById") REFERENCES "User"("id") ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "FieldAwardRubricVersion"
    ADD CONSTRAINT "FieldAwardRubricVersion_clonedFromId_fkey"
    FOREIGN KEY ("clonedFromId") REFERENCES "FieldAwardRubricVersion"("id") ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "FieldAwardNode"
    ADD CONSTRAINT "FieldAwardNode_rubricVersionId_fkey"
    FOREIGN KEY ("rubricVersionId") REFERENCES "FieldAwardRubricVersion"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "FieldAwardNode"
    ADD CONSTRAINT "FieldAwardNode_parentId_fkey"
    FOREIGN KEY ("parentId") REFERENCES "FieldAwardNode"("id") ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "FieldAwardRequirement"
    ADD CONSTRAINT "FieldAwardRequirement_nodeId_fkey"
    FOREIGN KEY ("nodeId") REFERENCES "FieldAwardNode"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "FieldAwardScoreEntry"
    ADD CONSTRAINT "FieldAwardScoreEntry_nodeId_fkey"
    FOREIGN KEY ("nodeId") REFERENCES "FieldAwardNode"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "FieldAwardScoreEntry"
    ADD CONSTRAINT "FieldAwardScoreEntry_encodedById_fkey"
    FOREIGN KEY ("encodedById") REFERENCES "User"("id") ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "FieldAwardScoreEntry"
    ADD CONSTRAINT "FieldAwardScoreEntry_verifiedById_fkey"
    FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "FieldAwardScenario"
    ADD CONSTRAINT "FieldAwardScenario_rubricVersionId_fkey"
    FOREIGN KEY ("rubricVersionId") REFERENCES "FieldAwardRubricVersion"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "FieldAwardScenario"
    ADD CONSTRAINT "FieldAwardScenario_createdById_fkey"
    FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "FieldAwardAssignment"
    ADD CONSTRAINT "FieldAwardAssignment_nodeId_fkey"
    FOREIGN KEY ("nodeId") REFERENCES "FieldAwardNode"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "FieldAwardAssignment"
    ADD CONSTRAINT "FieldAwardAssignment_personnelId_fkey"
    FOREIGN KEY ("personnelId") REFERENCES "Personnel"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "FieldAwardAssignment"
    ADD CONSTRAINT "FieldAwardAssignment_assignedById_fkey"
    FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "FieldAwardEvidence"
    ADD CONSTRAINT "FieldAwardEvidence_requirementId_fkey"
    FOREIGN KEY ("requirementId") REFERENCES "FieldAwardRequirement"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "FieldAwardEvidence"
    ADD CONSTRAINT "FieldAwardEvidence_uploadedById_fkey"
    FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "FieldAwardEvidence"
    ADD CONSTRAINT "FieldAwardEvidence_verifiedById_fkey"
    FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "FieldAwardSubmission"
    ADD CONSTRAINT "FieldAwardSubmission_requirementId_fkey"
    FOREIGN KEY ("requirementId") REFERENCES "FieldAwardRequirement"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "FieldAwardSubmission"
    ADD CONSTRAINT "FieldAwardSubmission_submittedById_fkey"
    FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "FieldAwardScoreSnapshot"
    ADD CONSTRAINT "FieldAwardScoreSnapshot_rubricVersionId_fkey"
    FOREIGN KEY ("rubricVersionId") REFERENCES "FieldAwardRubricVersion"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "FieldAwardScoreSnapshot"
    ADD CONSTRAINT "FieldAwardScoreSnapshot_capturedById_fkey"
    FOREIGN KEY ("capturedById") REFERENCES "User"("id") ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "FieldAwardAuditLog"
    ADD CONSTRAINT "FieldAwardAuditLog_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ─── Indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS "FieldAwardCycle_year_idx" ON "FieldAwardCycle"("year");
CREATE INDEX IF NOT EXISTS "FieldAwardCycle_status_idx" ON "FieldAwardCycle"("status");
CREATE INDEX IF NOT EXISTS "FieldAwardRubricVersion_cycleId_idx" ON "FieldAwardRubricVersion"("cycleId");
CREATE INDEX IF NOT EXISTS "FieldAwardRubricVersion_status_idx" ON "FieldAwardRubricVersion"("status");
CREATE INDEX IF NOT EXISTS "FieldAwardRubricVersion_isBaseline_idx" ON "FieldAwardRubricVersion"("isBaseline");
CREATE INDEX IF NOT EXISTS "FieldAwardNode_rubricVersionId_idx" ON "FieldAwardNode"("rubricVersionId");
CREATE INDEX IF NOT EXISTS "FieldAwardNode_parentId_idx" ON "FieldAwardNode"("parentId");
CREATE INDEX IF NOT EXISTS "FieldAwardNode_nodeType_idx" ON "FieldAwardNode"("nodeType");
CREATE INDEX IF NOT EXISTS "FieldAwardNode_applicability_idx" ON "FieldAwardNode"("applicability");
CREATE INDEX IF NOT EXISTS "FieldAwardNode_displayOrder_idx" ON "FieldAwardNode"("displayOrder");
CREATE INDEX IF NOT EXISTS "FieldAwardRequirement_nodeId_idx" ON "FieldAwardRequirement"("nodeId");
CREATE INDEX IF NOT EXISTS "FieldAwardRequirement_dueDate_idx" ON "FieldAwardRequirement"("dueDate");
CREATE INDEX IF NOT EXISTS "FieldAwardScoreEntry_cycleId_idx" ON "FieldAwardScoreEntry"("cycleId");
CREATE INDEX IF NOT EXISTS "FieldAwardScoreEntry_calcStatus_idx" ON "FieldAwardScoreEntry"("calcStatus");
CREATE INDEX IF NOT EXISTS "FieldAwardScenario_rubricVersionId_idx" ON "FieldAwardScenario"("rubricVersionId");
CREATE INDEX IF NOT EXISTS "FieldAwardAssignment_nodeId_idx" ON "FieldAwardAssignment"("nodeId");
CREATE INDEX IF NOT EXISTS "FieldAwardAssignment_personnelId_idx" ON "FieldAwardAssignment"("personnelId");
CREATE INDEX IF NOT EXISTS "FieldAwardEvidence_requirementId_idx" ON "FieldAwardEvidence"("requirementId");
CREATE INDEX IF NOT EXISTS "FieldAwardEvidence_status_idx" ON "FieldAwardEvidence"("status");
CREATE INDEX IF NOT EXISTS "FieldAwardEvidence_uploadedById_idx" ON "FieldAwardEvidence"("uploadedById");
CREATE INDEX IF NOT EXISTS "FieldAwardSubmission_requirementId_idx" ON "FieldAwardSubmission"("requirementId");
CREATE INDEX IF NOT EXISTS "FieldAwardSubmission_status_idx" ON "FieldAwardSubmission"("status");
CREATE INDEX IF NOT EXISTS "FieldAwardSubmission_dueDate_idx" ON "FieldAwardSubmission"("dueDate");
CREATE INDEX IF NOT EXISTS "FieldAwardScoreSnapshot_rubricVersionId_idx" ON "FieldAwardScoreSnapshot"("rubricVersionId");
CREATE INDEX IF NOT EXISTS "FieldAwardScoreSnapshot_cycleId_idx" ON "FieldAwardScoreSnapshot"("cycleId");
CREATE INDEX IF NOT EXISTS "FieldAwardScoreSnapshot_isOfficial_idx" ON "FieldAwardScoreSnapshot"("isOfficial");
CREATE INDEX IF NOT EXISTS "FieldAwardAuditLog_entityType_entityId_idx" ON "FieldAwardAuditLog"("entityType","entityId");
CREATE INDEX IF NOT EXISTS "FieldAwardAuditLog_userId_idx" ON "FieldAwardAuditLog"("userId");
CREATE INDEX IF NOT EXISTS "FieldAwardAuditLog_createdAt_idx" ON "FieldAwardAuditLog"("createdAt");
CREATE INDEX IF NOT EXISTS "FieldAwardAuditLog_rubricVersionId_idx" ON "FieldAwardAuditLog"("rubricVersionId");
