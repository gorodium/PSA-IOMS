DO $$ BEGIN
  CREATE TYPE "RoomReservationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "RoomReservationType" AS ENUM ('HALF_DAY', 'MULTIPLE_DAYS');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "HalfDaySlot" AS ENUM ('MORNING', 'AFTERNOON');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "Room" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "isAvailable" BOOLEAN NOT NULL DEFAULT true,
  "unavailableReason" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "RoomReservation" (
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

CREATE UNIQUE INDEX IF NOT EXISTS "Room_name_key" ON "Room"("name");
CREATE INDEX IF NOT EXISTS "Room_isAvailable_idx" ON "Room"("isAvailable");
CREATE INDEX IF NOT EXISTS "Room_isActive_idx" ON "Room"("isActive");
CREATE INDEX IF NOT EXISTS "RoomReservation_roomId_idx" ON "RoomReservation"("roomId");
CREATE INDEX IF NOT EXISTS "RoomReservation_requesterPersonnelId_idx" ON "RoomReservation"("requesterPersonnelId");
CREATE INDEX IF NOT EXISTS "RoomReservation_requestedByUserId_idx" ON "RoomReservation"("requestedByUserId");
CREATE INDEX IF NOT EXISTS "RoomReservation_status_idx" ON "RoomReservation"("status");
CREATE INDEX IF NOT EXISTS "RoomReservation_startDate_idx" ON "RoomReservation"("startDate");
CREATE INDEX IF NOT EXISTS "RoomReservation_endDate_idx" ON "RoomReservation"("endDate");

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'RoomReservation_roomId_fkey') THEN
    ALTER TABLE "RoomReservation" ADD CONSTRAINT "RoomReservation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'RoomReservation_requesterPersonnelId_fkey') THEN
    ALTER TABLE "RoomReservation" ADD CONSTRAINT "RoomReservation_requesterPersonnelId_fkey" FOREIGN KEY ("requesterPersonnelId") REFERENCES "Personnel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'RoomReservation_requestedByUserId_fkey') THEN
    ALTER TABLE "RoomReservation" ADD CONSTRAINT "RoomReservation_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'RoomReservation_approvedById_fkey') THEN
    ALTER TABLE "RoomReservation" ADD CONSTRAINT "RoomReservation_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'RoomReservation_rejectedById_fkey') THEN
    ALTER TABLE "RoomReservation" ADD CONSTRAINT "RoomReservation_rejectedById_fkey" FOREIGN KEY ("rejectedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'CalendarActivity')
    AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'RoomReservation_calendarActivityId_fkey') THEN
    ALTER TABLE "RoomReservation" ADD CONSTRAINT "RoomReservation_calendarActivityId_fkey" FOREIGN KEY ("calendarActivityId") REFERENCES "CalendarActivity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

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
