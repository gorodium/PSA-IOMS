DO $$ BEGIN
  CREATE TYPE "VehicleRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'ASSIGNED', 'REJECTED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE "Vehicle" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "plateNumber" TEXT,
  "description" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VehicleRequest" (
  "id" TEXT NOT NULL,
  "requesterPersonnelId" TEXT NOT NULL,
  "requestedByUserId" TEXT,
  "travelDate" TIMESTAMP(3) NOT NULL,
  "departureAt" TIMESTAMP(3),
  "expectedReturnAt" TIMESTAMP(3),
  "purpose" TEXT NOT NULL,
  "destination" TEXT NOT NULL,
  "status" "VehicleRequestStatus" NOT NULL DEFAULT 'PENDING',
  "assignedVehicleId" TEXT,
  "soNumber" TEXT,
  "soFileUrl" TEXT,
  "adminNotes" TEXT,
  "rejectionReason" TEXT,
  "reviewedById" TEXT,
  "calendarActivityId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "VehicleRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VehicleRequestPassenger" (
  "id" TEXT NOT NULL,
  "requestId" TEXT NOT NULL,
  "personnelId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "VehicleRequestPassenger_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Vehicle_plateNumber_key" ON "Vehicle"("plateNumber");
CREATE INDEX "Vehicle_isActive_idx" ON "Vehicle"("isActive");
CREATE INDEX "VehicleRequest_requesterPersonnelId_idx" ON "VehicleRequest"("requesterPersonnelId");
CREATE INDEX "VehicleRequest_requestedByUserId_idx" ON "VehicleRequest"("requestedByUserId");
CREATE INDEX "VehicleRequest_assignedVehicleId_idx" ON "VehicleRequest"("assignedVehicleId");
CREATE INDEX "VehicleRequest_travelDate_idx" ON "VehicleRequest"("travelDate");
CREATE INDEX "VehicleRequest_status_idx" ON "VehicleRequest"("status");
CREATE UNIQUE INDEX "VehicleRequestPassenger_requestId_personnelId_key" ON "VehicleRequestPassenger"("requestId", "personnelId");
CREATE INDEX "VehicleRequestPassenger_personnelId_idx" ON "VehicleRequestPassenger"("personnelId");

ALTER TABLE "VehicleRequest" ADD CONSTRAINT "VehicleRequest_requesterPersonnelId_fkey" FOREIGN KEY ("requesterPersonnelId") REFERENCES "Personnel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "VehicleRequest" ADD CONSTRAINT "VehicleRequest_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "VehicleRequest" ADD CONSTRAINT "VehicleRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "VehicleRequest" ADD CONSTRAINT "VehicleRequest_assignedVehicleId_fkey" FOREIGN KEY ("assignedVehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "VehicleRequest" ADD CONSTRAINT "VehicleRequest_calendarActivityId_fkey" FOREIGN KEY ("calendarActivityId") REFERENCES "CalendarActivity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "VehicleRequestPassenger" ADD CONSTRAINT "VehicleRequestPassenger_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "VehicleRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VehicleRequestPassenger" ADD CONSTRAINT "VehicleRequestPassenger_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES "Personnel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
