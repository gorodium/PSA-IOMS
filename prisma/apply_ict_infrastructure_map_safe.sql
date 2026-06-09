-- CreateEnum
CREATE TYPE "MapFurnitureType" AS ENUM ('DESK', 'COMPUTER_DESK', 'CABINET', 'TABLE', 'CHAIR', 'SERVER_RACK', 'PRINTER_STATION', 'RECEPTION', 'WALL', 'PARTITION', 'OTHER');

-- CreateEnum
CREATE TYPE "NetworkDeviceType" AS ENUM ('DESKTOP', 'LAPTOP', 'PRINTER', 'ACCESS_POINT', 'SWITCH', 'ROUTER', 'FIREWALL', 'SERVER', 'IP_PHONE', 'CCTV', 'OTHER');

-- CreateEnum
CREATE TYPE "NetworkDeviceStatus" AS ENUM ('ONLINE', 'OFFLINE', 'WARNING', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "NetworkConnectionType" AS ENUM ('LAN', 'WIFI', 'FIBER', 'USB', 'BLUETOOTH', 'OTHER');

-- CreateTable
CREATE TABLE "NetworkMap" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NetworkMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MapFurniture" (
    "id" TEXT NOT NULL,
    "mapId" TEXT NOT NULL,
    "furnitureCode" TEXT NOT NULL,
    "furnitureName" TEXT NOT NULL,
    "type" "MapFurnitureType" NOT NULL DEFAULT 'DESK',
    "xPercent" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "yPercent" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "widthPercent" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "heightPercent" DOUBLE PRECISION NOT NULL DEFAULT 3,
    "rotation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "section" TEXT,
    "room" TEXT,
    "label" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MapFurniture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeSeat" (
    "id" TEXT NOT NULL,
    "mapId" TEXT NOT NULL,
    "furnitureId" TEXT,
    "personnelId" TEXT,
    "seatCode" TEXT NOT NULL,
    "xPercent" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "yPercent" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "section" TEXT,
    "room" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeSeat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NetworkDevice" (
    "id" TEXT NOT NULL,
    "mapId" TEXT NOT NULL,
    "furnitureId" TEXT,
    "employeeSeatId" TEXT,
    "personnelId" TEXT,
    "deviceCode" TEXT NOT NULL,
    "deviceName" TEXT NOT NULL,
    "type" "NetworkDeviceType" NOT NULL DEFAULT 'DESKTOP',
    "status" "NetworkDeviceStatus" NOT NULL DEFAULT 'UNKNOWN',
    "hostname" TEXT,
    "ipAddress" TEXT,
    "macAddress" TEXT,
    "section" TEXT,
    "room" TEXT,
    "xPercent" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "yPercent" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "lastSeenAt" TIMESTAMP(3),
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NetworkDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NetworkConnection" (
    "id" TEXT NOT NULL,
    "mapId" TEXT NOT NULL,
    "sourceDeviceId" TEXT NOT NULL,
    "targetDeviceId" TEXT NOT NULL,
    "connectionType" "NetworkConnectionType" NOT NULL DEFAULT 'LAN',
    "sourcePort" TEXT,
    "targetPort" TEXT,
    "cableLabel" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NetworkConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NetworkMap_isActive_idx" ON "NetworkMap"("isActive");
CREATE INDEX "NetworkMap_createdById_idx" ON "NetworkMap"("createdById");
CREATE INDEX "MapFurniture_mapId_idx" ON "MapFurniture"("mapId");
CREATE INDEX "EmployeeSeat_mapId_idx" ON "EmployeeSeat"("mapId");
CREATE INDEX "EmployeeSeat_personnelId_idx" ON "EmployeeSeat"("personnelId");
CREATE INDEX "NetworkDevice_mapId_idx" ON "NetworkDevice"("mapId");
CREATE INDEX "NetworkDevice_personnelId_idx" ON "NetworkDevice"("personnelId");
CREATE INDEX "NetworkDevice_status_idx" ON "NetworkDevice"("status");
CREATE INDEX "NetworkDevice_type_idx" ON "NetworkDevice"("type");
CREATE INDEX "NetworkConnection_mapId_idx" ON "NetworkConnection"("mapId");
CREATE INDEX "NetworkConnection_sourceDeviceId_idx" ON "NetworkConnection"("sourceDeviceId");
CREATE INDEX "NetworkConnection_targetDeviceId_idx" ON "NetworkConnection"("targetDeviceId");

-- AddForeignKey
ALTER TABLE "NetworkMap" ADD CONSTRAINT "NetworkMap_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MapFurniture" ADD CONSTRAINT "MapFurniture_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "NetworkMap"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EmployeeSeat" ADD CONSTRAINT "EmployeeSeat_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "NetworkMap"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EmployeeSeat" ADD CONSTRAINT "EmployeeSeat_furnitureId_fkey" FOREIGN KEY ("furnitureId") REFERENCES "MapFurniture"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "EmployeeSeat" ADD CONSTRAINT "EmployeeSeat_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES "Personnel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "NetworkDevice" ADD CONSTRAINT "NetworkDevice_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "NetworkMap"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NetworkDevice" ADD CONSTRAINT "NetworkDevice_furnitureId_fkey" FOREIGN KEY ("furnitureId") REFERENCES "MapFurniture"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "NetworkDevice" ADD CONSTRAINT "NetworkDevice_employeeSeatId_fkey" FOREIGN KEY ("employeeSeatId") REFERENCES "EmployeeSeat"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "NetworkDevice" ADD CONSTRAINT "NetworkDevice_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES "Personnel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "NetworkConnection" ADD CONSTRAINT "NetworkConnection_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "NetworkMap"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NetworkConnection" ADD CONSTRAINT "NetworkConnection_sourceDeviceId_fkey" FOREIGN KEY ("sourceDeviceId") REFERENCES "NetworkDevice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NetworkConnection" ADD CONSTRAINT "NetworkConnection_targetDeviceId_fkey" FOREIGN KEY ("targetDeviceId") REFERENCES "NetworkDevice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
