-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'EMPLOYEE', 'VIEWER');

-- CreateEnum
CREATE TYPE "ProjectCategory" AS ENUM ('STATISTICAL_OPERATIONS', 'CIVIL_REGISTRATION_VITAL_STATISTICS', 'PHILIPPINE_IDENTIFICATION_SYSTEM', 'ADMINISTRATIVE_ACCOUNTING_REPORTS');

-- CreateEnum
CREATE TYPE "ProjectFrequency" AS ENUM ('MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL', 'AD_HOC');

-- CreateEnum
CREATE TYPE "ProjectPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('COMPLETED', 'OVERDUE', 'DUE_TODAY', 'DUE_SOON', 'ON_TRACK', 'NO_DEADLINE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('COMPLETED', 'OVERDUE', 'DUE_TODAY', 'DUE_SOON', 'ON_TRACK', 'NO_DEADLINE', 'INACTIVE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
    "personnelId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Personnel" (
    "id" TEXT NOT NULL,
    "employeeNo" TEXT,
    "fullName" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "email" TEXT,
    "contactNo" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Personnel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "category" "ProjectCategory" NOT NULL,
    "subcategory" TEXT,
    "section" TEXT,
    "year" INTEGER NOT NULL,
    "frequency" "ProjectFrequency" NOT NULL,
    "priority" "ProjectPriority" NOT NULL DEFAULT 'MEDIUM',
    "workloadWeight" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "estimatedMandays" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "ProjectStatus" NOT NULL DEFAULT 'ON_TRACK',
    "uiLayout" TEXT NOT NULL DEFAULT 'BALANCED',
    "showOperationWorkload" BOOLEAN NOT NULL DEFAULT true,
    "showDeadlineSubmission" BOOLEAN NOT NULL DEFAULT true,
    "showDateSubmitted" BOOLEAN NOT NULL DEFAULT true,
    "showTotalSamplesDocuments" BOOLEAN NOT NULL DEFAULT true,
    "showResponseRate" BOOLEAN NOT NULL DEFAULT true,
    "operationWorkloadLabel" TEXT NOT NULL DEFAULT 'Project/Operation/Workload',
    "deadlineSubmissionLabel" TEXT NOT NULL DEFAULT 'Deadline of Submission',
    "dateSubmittedLabel" TEXT NOT NULL DEFAULT 'Date Submitted',
    "totalSamplesDocumentsLabel" TEXT NOT NULL DEFAULT 'Total Sample/Documents',
    "responseRateLabel" TEXT NOT NULL DEFAULT 'Response Rate',
    "customTaskColumns" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectEditor" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectEditor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectPersonnel" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "personnelId" TEXT NOT NULL,
    "roleInProject" TEXT NOT NULL,
    "isFocalPerson" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectPersonnel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectCycle" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "cycleName" TEXT NOT NULL,
    "month" INTEGER,
    "quarter" INTEGER,
    "year" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3),
    "deadline" TIMESTAMP(3),
    "dateSubmitted" TIMESTAMP(3),
    "progress" INTEGER NOT NULL DEFAULT 0,
    "responseRate" DOUBLE PRECISION,
    "totalSamplesDocuments" INTEGER,
    "status" "ProjectStatus" NOT NULL DEFAULT 'ON_TRACK',
    "remarks" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectCycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectTask" (
    "id" TEXT NOT NULL,
    "projectCycleId" TEXT NOT NULL,
    "taskName" TEXT NOT NULL,
    "assignedPersonnelId" TEXT,
    "startDate" TIMESTAMP(3),
    "deadline" TIMESTAMP(3),
    "dateSubmitted" TIMESTAMP(3),
    "progress" INTEGER NOT NULL DEFAULT 0,
    "status" "TaskStatus" NOT NULL DEFAULT 'ON_TRACK',
    "responseRate" DOUBLE PRECISION,
    "totalSamplesDocuments" INTEGER,
    "customValues" JSONB,
    "remarks" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectRemark" (
    "id" TEXT NOT NULL,
    "projectId" TEXT,
    "projectCycleId" TEXT,
    "taskId" TEXT,
    "authorId" TEXT NOT NULL,
    "remarkText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectRemark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "oldValueJson" JSONB,
    "newValueJson" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_personnelId_key" ON "User"("personnelId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Personnel_employeeNo_key" ON "Personnel"("employeeNo");

-- CreateIndex
CREATE UNIQUE INDEX "Personnel_email_key" ON "Personnel"("email");

-- CreateIndex
CREATE INDEX "Personnel_section_idx" ON "Personnel"("section");

-- CreateIndex
CREATE INDEX "Personnel_isActive_idx" ON "Personnel"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Project_code_key" ON "Project"("code");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Project_category_idx" ON "Project"("category");

-- CreateIndex
CREATE INDEX "Project_year_idx" ON "Project"("year");

-- CreateIndex
CREATE INDEX "Project_isActive_idx" ON "Project"("isActive");

-- CreateIndex
CREATE INDEX "ProjectEditor_userId_idx" ON "ProjectEditor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectEditor_projectId_userId_key" ON "ProjectEditor"("projectId", "userId");

-- CreateIndex
CREATE INDEX "ProjectPersonnel_personnelId_idx" ON "ProjectPersonnel"("personnelId");

-- CreateIndex
CREATE INDEX "ProjectPersonnel_isFocalPerson_idx" ON "ProjectPersonnel"("isFocalPerson");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectPersonnel_projectId_personnelId_key" ON "ProjectPersonnel"("projectId", "personnelId");

-- CreateIndex
CREATE INDEX "ProjectCycle_projectId_idx" ON "ProjectCycle"("projectId");

-- CreateIndex
CREATE INDEX "ProjectCycle_status_idx" ON "ProjectCycle"("status");

-- CreateIndex
CREATE INDEX "ProjectCycle_deadline_idx" ON "ProjectCycle"("deadline");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectCycle_projectId_cycleName_year_key" ON "ProjectCycle"("projectId", "cycleName", "year");

-- CreateIndex
CREATE INDEX "ProjectTask_projectCycleId_idx" ON "ProjectTask"("projectCycleId");

-- CreateIndex
CREATE INDEX "ProjectTask_assignedPersonnelId_idx" ON "ProjectTask"("assignedPersonnelId");

-- CreateIndex
CREATE INDEX "ProjectTask_status_idx" ON "ProjectTask"("status");

-- CreateIndex
CREATE INDEX "ProjectTask_deadline_idx" ON "ProjectTask"("deadline");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTask_projectCycleId_taskName_key" ON "ProjectTask"("projectCycleId", "taskName");

-- CreateIndex
CREATE INDEX "ProjectRemark_projectId_idx" ON "ProjectRemark"("projectId");

-- CreateIndex
CREATE INDEX "ProjectRemark_projectCycleId_idx" ON "ProjectRemark"("projectCycleId");

-- CreateIndex
CREATE INDEX "ProjectRemark_taskId_idx" ON "ProjectRemark"("taskId");

-- CreateIndex
CREATE INDEX "ProjectRemark_authorId_idx" ON "ProjectRemark"("authorId");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES "Personnel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectEditor" ADD CONSTRAINT "ProjectEditor_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectEditor" ADD CONSTRAINT "ProjectEditor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectPersonnel" ADD CONSTRAINT "ProjectPersonnel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectPersonnel" ADD CONSTRAINT "ProjectPersonnel_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES "Personnel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectCycle" ADD CONSTRAINT "ProjectCycle_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTask" ADD CONSTRAINT "ProjectTask_projectCycleId_fkey" FOREIGN KEY ("projectCycleId") REFERENCES "ProjectCycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTask" ADD CONSTRAINT "ProjectTask_assignedPersonnelId_fkey" FOREIGN KEY ("assignedPersonnelId") REFERENCES "Personnel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRemark" ADD CONSTRAINT "ProjectRemark_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRemark" ADD CONSTRAINT "ProjectRemark_projectCycleId_fkey" FOREIGN KEY ("projectCycleId") REFERENCES "ProjectCycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRemark" ADD CONSTRAINT "ProjectRemark_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "ProjectTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRemark" ADD CONSTRAINT "ProjectRemark_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

