-- DropForeignKey
ALTER TABLE "FieldAwardAssignment" DROP CONSTRAINT "FieldAwardAssignment_assignedById_fkey";

-- DropForeignKey
ALTER TABLE "FieldAwardAssignment" DROP CONSTRAINT "FieldAwardAssignment_nodeId_fkey";

-- DropForeignKey
ALTER TABLE "FieldAwardAssignment" DROP CONSTRAINT "FieldAwardAssignment_personnelId_fkey";

-- DropForeignKey
ALTER TABLE "FieldAwardAuditLog" DROP CONSTRAINT "FieldAwardAuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "FieldAwardEvidence" DROP CONSTRAINT "FieldAwardEvidence_requirementId_fkey";

-- DropForeignKey
ALTER TABLE "FieldAwardEvidence" DROP CONSTRAINT "FieldAwardEvidence_uploadedById_fkey";

-- DropForeignKey
ALTER TABLE "FieldAwardEvidence" DROP CONSTRAINT "FieldAwardEvidence_verifiedById_fkey";

-- DropForeignKey
ALTER TABLE "FieldAwardNode" DROP CONSTRAINT "FieldAwardNode_parentId_fkey";

-- DropForeignKey
ALTER TABLE "FieldAwardNode" DROP CONSTRAINT "FieldAwardNode_rubricVersionId_fkey";

-- DropForeignKey
ALTER TABLE "FieldAwardRequirement" DROP CONSTRAINT "FieldAwardRequirement_nodeId_fkey";

-- DropForeignKey
ALTER TABLE "FieldAwardRubricVersion" DROP CONSTRAINT "FieldAwardRubricVersion_archivedById_fkey";

-- DropForeignKey
ALTER TABLE "FieldAwardRubricVersion" DROP CONSTRAINT "FieldAwardRubricVersion_clonedFromId_fkey";

-- DropForeignKey
ALTER TABLE "FieldAwardRubricVersion" DROP CONSTRAINT "FieldAwardRubricVersion_cycleId_fkey";

-- DropForeignKey
ALTER TABLE "FieldAwardRubricVersion" DROP CONSTRAINT "FieldAwardRubricVersion_lockedById_fkey";

-- DropForeignKey
ALTER TABLE "FieldAwardRubricVersion" DROP CONSTRAINT "FieldAwardRubricVersion_publishedById_fkey";

-- DropForeignKey
ALTER TABLE "FieldAwardScenario" DROP CONSTRAINT "FieldAwardScenario_createdById_fkey";

-- DropForeignKey
ALTER TABLE "FieldAwardScenario" DROP CONSTRAINT "FieldAwardScenario_rubricVersionId_fkey";

-- DropForeignKey
ALTER TABLE "FieldAwardScoreEntry" DROP CONSTRAINT "FieldAwardScoreEntry_encodedById_fkey";

-- DropForeignKey
ALTER TABLE "FieldAwardScoreEntry" DROP CONSTRAINT "FieldAwardScoreEntry_nodeId_fkey";

-- DropForeignKey
ALTER TABLE "FieldAwardScoreEntry" DROP CONSTRAINT "FieldAwardScoreEntry_verifiedById_fkey";

-- DropForeignKey
ALTER TABLE "FieldAwardScoreSnapshot" DROP CONSTRAINT "FieldAwardScoreSnapshot_capturedById_fkey";

-- DropForeignKey
ALTER TABLE "FieldAwardScoreSnapshot" DROP CONSTRAINT "FieldAwardScoreSnapshot_rubricVersionId_fkey";

-- DropForeignKey
ALTER TABLE "FieldAwardSubmission" DROP CONSTRAINT "FieldAwardSubmission_requirementId_fkey";

-- DropForeignKey
ALTER TABLE "FieldAwardSubmission" DROP CONSTRAINT "FieldAwardSubmission_submittedById_fkey";

-- AlterTable
ALTER TABLE "FieldAwardAssignment" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "FieldAwardCycle" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "FieldAwardEvidence" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "FieldAwardNode" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "FieldAwardRequirement" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "FieldAwardRubricVersion" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "FieldAwardScenario" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "FieldAwardScoreEntry" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "FieldAwardSubmission" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "RoomReservation" ADD COLUMN     "specialOrderId" TEXT;

-- AlterTable
ALTER TABLE "VehicleRequest" ADD COLUMN     "requestedDriverId" TEXT,
ADD COLUMN     "specialOrderId" TEXT,
ADD COLUMN     "travelEndDate" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "FieldAwardScoreEntry_calcMode_idx" ON "FieldAwardScoreEntry"("calcMode");

-- CreateIndex
CREATE INDEX "FieldAwardSubmission_referenceMonth_referenceYear_idx" ON "FieldAwardSubmission"("referenceMonth", "referenceYear");

-- CreateIndex
CREATE INDEX "RoomReservation_specialOrderId_idx" ON "RoomReservation"("specialOrderId");

-- CreateIndex
CREATE INDEX "VehicleRequest_requestedDriverId_idx" ON "VehicleRequest"("requestedDriverId");

-- AddForeignKey
ALTER TABLE "VehicleRequest" ADD CONSTRAINT "VehicleRequest_requestedDriverId_fkey" FOREIGN KEY ("requestedDriverId") REFERENCES "Personnel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleRequest" ADD CONSTRAINT "VehicleRequest_specialOrderId_fkey" FOREIGN KEY ("specialOrderId") REFERENCES "SpecialOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomReservation" ADD CONSTRAINT "RoomReservation_specialOrderId_fkey" FOREIGN KEY ("specialOrderId") REFERENCES "SpecialOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAwardRubricVersion" ADD CONSTRAINT "FieldAwardRubricVersion_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "FieldAwardCycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAwardRubricVersion" ADD CONSTRAINT "FieldAwardRubricVersion_lockedById_fkey" FOREIGN KEY ("lockedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAwardRubricVersion" ADD CONSTRAINT "FieldAwardRubricVersion_publishedById_fkey" FOREIGN KEY ("publishedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAwardRubricVersion" ADD CONSTRAINT "FieldAwardRubricVersion_archivedById_fkey" FOREIGN KEY ("archivedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAwardRubricVersion" ADD CONSTRAINT "FieldAwardRubricVersion_clonedFromId_fkey" FOREIGN KEY ("clonedFromId") REFERENCES "FieldAwardRubricVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAwardNode" ADD CONSTRAINT "FieldAwardNode_rubricVersionId_fkey" FOREIGN KEY ("rubricVersionId") REFERENCES "FieldAwardRubricVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAwardNode" ADD CONSTRAINT "FieldAwardNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "FieldAwardNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAwardRequirement" ADD CONSTRAINT "FieldAwardRequirement_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "FieldAwardNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAwardScoreEntry" ADD CONSTRAINT "FieldAwardScoreEntry_encodedById_fkey" FOREIGN KEY ("encodedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAwardScoreEntry" ADD CONSTRAINT "FieldAwardScoreEntry_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAwardScoreEntry" ADD CONSTRAINT "FieldAwardScoreEntry_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "FieldAwardNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAwardScenario" ADD CONSTRAINT "FieldAwardScenario_rubricVersionId_fkey" FOREIGN KEY ("rubricVersionId") REFERENCES "FieldAwardRubricVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAwardScenario" ADD CONSTRAINT "FieldAwardScenario_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAwardAssignment" ADD CONSTRAINT "FieldAwardAssignment_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "FieldAwardNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAwardAssignment" ADD CONSTRAINT "FieldAwardAssignment_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES "Personnel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAwardAssignment" ADD CONSTRAINT "FieldAwardAssignment_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAwardEvidence" ADD CONSTRAINT "FieldAwardEvidence_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "FieldAwardRequirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAwardEvidence" ADD CONSTRAINT "FieldAwardEvidence_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAwardEvidence" ADD CONSTRAINT "FieldAwardEvidence_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAwardSubmission" ADD CONSTRAINT "FieldAwardSubmission_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "FieldAwardRequirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAwardSubmission" ADD CONSTRAINT "FieldAwardSubmission_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAwardScoreSnapshot" ADD CONSTRAINT "FieldAwardScoreSnapshot_rubricVersionId_fkey" FOREIGN KEY ("rubricVersionId") REFERENCES "FieldAwardRubricVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAwardScoreSnapshot" ADD CONSTRAINT "FieldAwardScoreSnapshot_capturedById_fkey" FOREIGN KEY ("capturedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAwardAuditLog" ADD CONSTRAINT "FieldAwardAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

