CREATE TYPE "RoomReservationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');
CREATE TYPE "RoomReservationType" AS ENUM ('HALF_DAY', 'MULTIPLE_DAYS');
CREATE TYPE "HalfDaySlot" AS ENUM ('MORNING', 'AFTERNOON');

CREATE TABLE "Room" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "isAvailable" BOOLEAN NOT NULL DEFAULT true,
  "unavailableReason" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RoomReservation" (
  "id" TEXT NOT NULL,
  "roomId" TEXT NOT NULL,
  "requesterPersonnelId" TEXT NOT NULL,
  "requestedByUserId" TEXT,
  "reservationType" "RoomReservationType" NOT NULL,
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3) NOT NULL,
  "halfDaySlot" "HalfDaySlot",
  "purpose" TEXT NOT NULL,
  "remarks" TEXT,
  "status" "RoomReservationStatus" NOT NULL DEFAULT 'PENDING',
  "approvedById" TEXT,
  "approvedAt" TIMESTAMP(3),
  "rejectedById" TEXT,
  "rejectedAt" TIMESTAMP(3),
  "rejectionReason" TEXT,
  "cancelledAt" TIMESTAMP(3),
  "calendarActivityId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "RoomReservation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Room_name_key" ON "Room"("name");
CREATE INDEX "Room_isAvailable_idx" ON "Room"("isAvailable");
CREATE INDEX "Room_isActive_idx" ON "Room"("isActive");
CREATE INDEX "RoomReservation_roomId_idx" ON "RoomReservation"("roomId");
CREATE INDEX "RoomReservation_requesterPersonnelId_idx" ON "RoomReservation"("requesterPersonnelId");
CREATE INDEX "RoomReservation_requestedByUserId_idx" ON "RoomReservation"("requestedByUserId");
CREATE INDEX "RoomReservation_status_idx" ON "RoomReservation"("status");
CREATE INDEX "RoomReservation_startDate_idx" ON "RoomReservation"("startDate");
CREATE INDEX "RoomReservation_endDate_idx" ON "RoomReservation"("endDate");

ALTER TABLE "RoomReservation" ADD CONSTRAINT "RoomReservation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "RoomReservation" ADD CONSTRAINT "RoomReservation_requesterPersonnelId_fkey" FOREIGN KEY ("requesterPersonnelId") REFERENCES "Personnel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "RoomReservation" ADD CONSTRAINT "RoomReservation_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "RoomReservation" ADD CONSTRAINT "RoomReservation_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "RoomReservation" ADD CONSTRAINT "RoomReservation_rejectedById_fkey" FOREIGN KEY ("rejectedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "RoomReservation" ADD CONSTRAINT "RoomReservation_calendarActivityId_fkey" FOREIGN KEY ("calendarActivityId") REFERENCES "CalendarActivity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO "Room" ("id", "name", "isAvailable", "unavailableReason", "isActive", "updatedAt")
VALUES
  ('room_conference', 'Conference Room', false, 'Being used by CBMS', true, CURRENT_TIMESTAMP),
  ('room_training', 'Training Room', true, NULL, true, CURRENT_TIMESTAMP),
  ('room_pantry_1', 'Pantry 1', true, NULL, true, CURRENT_TIMESTAMP),
  ('room_pantry_2', 'Pantry 2', true, NULL, true, CURRENT_TIMESTAMP)
ON CONFLICT ("name") DO UPDATE SET
  "isAvailable" = EXCLUDED."isAvailable",
  "unavailableReason" = EXCLUDED."unavailableReason",
  "isActive" = true,
  "updatedAt" = CURRENT_TIMESTAMP;
