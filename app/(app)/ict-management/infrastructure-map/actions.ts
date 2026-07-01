"use server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { requireUser, getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type {
  MapFurnitureType,
  NetworkDeviceType,
  NetworkDeviceStatus,
  NetworkConnectionType,
} from "@prisma/client";

// ── Helper ────────────────────────────────────────────────────────────────────

function isICTMapAdmin(role: string) {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}

async function requireICTMapAdmin() {
  const user = await requireUser();
  if (!isICTMapAdmin(user.role)) {
    throw new Error("You do not have permission to manage the Network Map.");
  }
  return user;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type ICTMap = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  isLocked: boolean;
};

export type ICTMapFurniture = {
  id: string;
  mapId: string;
  furnitureCode: string;
  furnitureName: string;
  type: MapFurnitureType;
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  rotation: number;
  section: string | null;
  room: string | null;
  label: string | null;
  remarks: string | null;
};

export type ICTMapSeat = {
  id: string;
  mapId: string;
  furnitureId: string | null;
  personnelId: string | null;
  personnelName: string | null;
  personnelPosition: string | null;
  personnelSection: string | null;
  personnelPhotoUrl: string | null;
  seatCode: string;
  xPercent: number;
  yPercent: number;
  section: string | null;
  room: string | null;
  remarks: string | null;
};

export type ICTMapDevice = {
  id: string;
  mapId: string;
  furnitureId: string | null;
  employeeSeatId: string | null;
  personnelId: string | null;
  personnelName: string | null;
  deviceCode: string;
  deviceName: string;
  type: NetworkDeviceType;
  status: NetworkDeviceStatus;
  hostname: string | null;
  ipAddress: string | null;
  macAddress: string | null;
  section: string | null;
  room: string | null;
  xPercent: number;
  yPercent: number;
  lastSeenAt: Date | null;
  remarks: string | null;
};

export type ICTMapConnection = {
  id: string;
  mapId: string;
  sourceDeviceId: string;
  sourceDeviceName: string;
  sourceDeviceCode: string;
  targetDeviceId: string;
  targetDeviceName: string;
  targetDeviceCode: string;
  connectionType: NetworkConnectionType;
  sourcePort: string | null;
  targetPort: string | null;
  cableLabel: string | null;
  isVerified: boolean;
  remarks: string | null;
};

export type ICTMapPageData = {
  maps: ICTMap[];
  activeMap: ICTMap | null;
  furniture: ICTMapFurniture[];
  seats: ICTMapSeat[];
  devices: ICTMapDevice[];
  connections: ICTMapConnection[];
  kpi: {
    totalDevices: number;
    online: number;
    offline: number;
    warning: number;
    unknown: number;
    totalDesks: number;
    assignedSeats: number;
    unassignedDevices: number;
  };
  isAdmin: boolean;
};

// ── Read ──────────────────────────────────────────────────────────────────────

export async function getICTMapPageDataAction(mapId?: string): Promise<ICTMapPageData> {
  const user = await getCurrentUser();
  const admin = user ? isICTMapAdmin(user.role) : false;

  const maps = await db.networkMap.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, description: true, imageUrl: true, isActive: true, isLocked: true },
  });

  let activeMap: ICTMap | null = null;
  if (mapId) {
    activeMap = maps.find((m) => m.id === mapId) ?? null;
  }
  if (!activeMap) {
    activeMap = maps.find((m) => m.isActive) ?? maps[0] ?? null;
  }

  if (!activeMap) {
    return {
      maps,
      activeMap: null,
      furniture: [],
      seats: [],
      devices: [],
      connections: [],
      kpi: { totalDevices: 0, online: 0, offline: 0, warning: 0, unknown: 0, totalDesks: 0, assignedSeats: 0, unassignedDevices: 0 },
      isAdmin: admin,
    };
  }

  const [furnitureRaw, seatsRaw, devicesRaw, connectionsRaw] = await Promise.all([
    db.mapFurniture.findMany({ where: { mapId: activeMap.id }, orderBy: { createdAt: "asc" } }),
    db.employeeSeat.findMany({
      where: { mapId: activeMap.id },
      include: { personnel: { select: { fullName: true, position: true, section: true, photoUrl: true } } },
      orderBy: { createdAt: "asc" },
    }),
    db.networkDevice.findMany({
      where: { mapId: activeMap.id },
      include: { personnel: { select: { fullName: true } } },
      orderBy: { createdAt: "asc" },
    }),
    db.networkConnection.findMany({
      where: { mapId: activeMap.id },
      include: {
        sourceDevice: { select: { deviceName: true, deviceCode: true } },
        targetDevice: { select: { deviceName: true, deviceCode: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const furniture: ICTMapFurniture[] = furnitureRaw.map((f) => ({
    id: f.id, mapId: f.mapId, furnitureCode: f.furnitureCode, furnitureName: f.furnitureName,
    type: f.type, xPercent: f.xPercent, yPercent: f.yPercent, widthPercent: f.widthPercent,
    heightPercent: f.heightPercent, rotation: f.rotation, section: f.section, room: f.room,
    label: f.label, remarks: f.remarks,
  }));

  const seats: ICTMapSeat[] = seatsRaw.map((s) => ({
    id: s.id, mapId: s.mapId, furnitureId: s.furnitureId, personnelId: s.personnelId,
    personnelName: s.personnel?.fullName ?? null, personnelPosition: s.personnel?.position ?? null,
    personnelSection: s.personnel?.section ?? null, personnelPhotoUrl: s.personnel?.photoUrl ?? null,
    seatCode: s.seatCode, xPercent: s.xPercent, yPercent: s.yPercent,
    section: s.section, room: s.room, remarks: s.remarks,
  }));

  const devices: ICTMapDevice[] = devicesRaw.map((d) => ({
    id: d.id, mapId: d.mapId, furnitureId: d.furnitureId, employeeSeatId: d.employeeSeatId,
    personnelId: d.personnelId, personnelName: d.personnel?.fullName ?? null,
    deviceCode: d.deviceCode, deviceName: d.deviceName, type: d.type, status: d.status,
    hostname: d.hostname, ipAddress: d.ipAddress, macAddress: d.macAddress,
    section: d.section, room: d.room, xPercent: d.xPercent, yPercent: d.yPercent,
    lastSeenAt: d.lastSeenAt, remarks: d.remarks,
  }));

  const connections: ICTMapConnection[] = connectionsRaw.map((c) => ({
    id: c.id, mapId: c.mapId, sourceDeviceId: c.sourceDeviceId,
    sourceDeviceName: c.sourceDevice.deviceName, sourceDeviceCode: c.sourceDevice.deviceCode,
    targetDeviceId: c.targetDeviceId, targetDeviceName: c.targetDevice.deviceName,
    targetDeviceCode: c.targetDevice.deviceCode, connectionType: c.connectionType,
    sourcePort: c.sourcePort, targetPort: c.targetPort, cableLabel: c.cableLabel,
    isVerified: c.isVerified, remarks: c.remarks,
  }));

  const kpi = {
    totalDevices: devices.length,
    online: devices.filter((d) => d.status === "ONLINE").length,
    offline: devices.filter((d) => d.status === "OFFLINE").length,
    warning: devices.filter((d) => d.status === "WARNING").length,
    unknown: devices.filter((d) => d.status === "UNKNOWN").length,
    totalDesks: furniture.filter((f) => ["DESK", "COMPUTER_DESK"].includes(f.type)).length,
    assignedSeats: seats.filter((s) => s.personnelId !== null).length,
    unassignedDevices: devices.filter((d) => d.personnelId === null && d.furnitureId === null).length,
  };

  return { maps, activeMap, furniture, seats, devices, connections, kpi, isAdmin: admin };
}

export async function getPersonnelForICTMapAction() {
  await getCurrentUser();
  return db.personnel.findMany({
    where: { isActive: true },
    select: { id: true, fullName: true, position: true, section: true, photoUrl: true },
    orderBy: { fullName: "asc" },
  });
}

// ── Map ───────────────────────────────────────────────────────────────────────

export async function createNetworkMapAction(formData: FormData) {
  const user = await requireICTMapAdmin();
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string | null)?.trim() || null;
  if (!name) return { ok: false, message: "Map name is required." };

  const map = await db.networkMap.create({
    data: { name, description, isActive: false, isLocked: false, createdById: user.id },
  });
  revalidatePath("/ict-management/infrastructure-map");
  return { ok: true, message: "Map created.", id: map.id };
}

export async function updateNetworkMapAction(id: string, formData: FormData) {
  await requireICTMapAdmin();
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string | null)?.trim() || null;
  if (!name) return { ok: false, message: "Map name is required." };

  await db.networkMap.update({ where: { id }, data: { name, description } });
  revalidatePath("/ict-management/infrastructure-map");
  return { ok: true, message: "Map updated." };
}

export async function setActiveMapAction(id: string) {
  await requireICTMapAdmin();
  await db.$transaction([
    db.networkMap.updateMany({ data: { isActive: false } }),
    db.networkMap.update({ where: { id }, data: { isActive: true } }),
  ]);
  revalidatePath("/ict-management/infrastructure-map");
  return { ok: true, message: "Active map updated." };
}

export async function toggleMapLockAction(id: string) {
  await requireICTMapAdmin();
  const map = await db.networkMap.findUnique({ where: { id }, select: { isLocked: true } });
  if (!map) return { ok: false, message: "Map not found." };
  await db.networkMap.update({ where: { id }, data: { isLocked: !map.isLocked } });
  revalidatePath("/ict-management/infrastructure-map");
  return { ok: true, message: map.isLocked ? "Map unlocked." : "Map locked." };
}

export async function deleteNetworkMapAction(id: string) {
  await requireICTMapAdmin();
  await db.networkMap.delete({ where: { id } });
  revalidatePath("/ict-management/infrastructure-map");
  return { ok: true, message: "Map deleted." };
}

export async function uploadMapBackgroundAction(mapId: string, formData: FormData) {
  await requireICTMapAdmin();
  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) return { ok: false, message: "No file provided." };
  if (!file.type.startsWith("image/")) return { ok: false, message: "Only image files are allowed." };
  if (file.size > 50 * 1024 * 1024) return { ok: false, message: "Image must be under 50 MB." };

  const ext = file.name.split(".").pop() || "png";
  const fileName = `map-${mapId}-${Date.now()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public/uploads/network-maps");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()));

  const imageUrl = `/uploads/network-maps/${fileName}`;
  await db.networkMap.update({ where: { id: mapId }, data: { imageUrl } });
  revalidatePath("/ict-management/infrastructure-map");
  return { ok: true, message: "Background uploaded.", imageUrl };
}

// ── Furniture ─────────────────────────────────────────────────────────────────

export async function addFurnitureAction(formData: FormData) {
  await requireICTMapAdmin();
  const mapId = formData.get("mapId") as string;
  const furnitureCode = (formData.get("furnitureCode") as string)?.trim();
  const furnitureName = (formData.get("furnitureName") as string)?.trim();
  const type = (formData.get("type") as MapFurnitureType) || "DESK";
  if (!mapId || !furnitureCode || !furnitureName) return { ok: false, message: "Code, name, and map are required." };

  const item = await db.mapFurniture.create({
    data: {
      mapId, furnitureCode, furnitureName, type,
      xPercent: parseFloat((formData.get("xPercent") as string) || "50"),
      yPercent: parseFloat((formData.get("yPercent") as string) || "50"),
      widthPercent: parseFloat((formData.get("widthPercent") as string) || "5"),
      heightPercent: parseFloat((formData.get("heightPercent") as string) || "3"),
      rotation: parseFloat((formData.get("rotation") as string) || "0"),
      section: (formData.get("section") as string | null) || null,
      room: (formData.get("room") as string | null) || null,
      label: (formData.get("label") as string | null) || null,
      remarks: (formData.get("remarks") as string | null) || null,
    },
  });
  revalidatePath("/ict-management/infrastructure-map");
  return { ok: true, message: "Furniture added.", id: item.id };
}

export async function updateFurnitureAction(id: string, formData: FormData) {
  await requireICTMapAdmin();
  await db.mapFurniture.update({
    where: { id },
    data: {
      furnitureCode: (formData.get("furnitureCode") as string)?.trim(),
      furnitureName: (formData.get("furnitureName") as string)?.trim(),
      type: (formData.get("type") as MapFurnitureType) || "DESK",
      widthPercent: parseFloat((formData.get("widthPercent") as string) || "5"),
      heightPercent: parseFloat((formData.get("heightPercent") as string) || "3"),
      rotation: parseFloat((formData.get("rotation") as string) || "0"),
      section: (formData.get("section") as string | null) || null,
      room: (formData.get("room") as string | null) || null,
      label: (formData.get("label") as string | null) || null,
      remarks: (formData.get("remarks") as string | null) || null,
    },
  });
  revalidatePath("/ict-management/infrastructure-map");
  return { ok: true, message: "Furniture updated." };
}

export async function updateItemPositionAction(
  itemType: "furniture" | "seat" | "device",
  id: string,
  xPercent: number,
  yPercent: number
) {
  await requireICTMapAdmin();
  if (itemType === "furniture") {
    await db.mapFurniture.update({ where: { id }, data: { xPercent, yPercent } });
  } else if (itemType === "seat") {
    await db.employeeSeat.update({ where: { id }, data: { xPercent, yPercent } });
  } else {
    await db.networkDevice.update({ where: { id }, data: { xPercent, yPercent } });
  }
  return { ok: true };
}

export async function deleteFurnitureAction(id: string) {
  await requireICTMapAdmin();
  await db.mapFurniture.delete({ where: { id } });
  revalidatePath("/ict-management/infrastructure-map");
  return { ok: true, message: "Furniture deleted." };
}

// ── Employee Seats ────────────────────────────────────────────────────────────

export async function addEmployeeSeatAction(formData: FormData) {
  await requireICTMapAdmin();
  const mapId = formData.get("mapId") as string;
  const seatCode = (formData.get("seatCode") as string)?.trim();
  if (!mapId || !seatCode) return { ok: false, message: "Map ID and seat code are required." };

  const item = await db.employeeSeat.create({
    data: {
      mapId, seatCode,
      furnitureId: (formData.get("furnitureId") as string | null) || null,
      personnelId: (formData.get("personnelId") as string | null) || null,
      xPercent: parseFloat((formData.get("xPercent") as string) || "50"),
      yPercent: parseFloat((formData.get("yPercent") as string) || "50"),
      section: (formData.get("section") as string | null) || null,
      room: (formData.get("room") as string | null) || null,
      remarks: (formData.get("remarks") as string | null) || null,
    },
  });
  revalidatePath("/ict-management/infrastructure-map");
  return { ok: true, message: "Seat added.", id: item.id };
}

export async function updateEmployeeSeatAction(id: string, formData: FormData) {
  await requireICTMapAdmin();
  await db.employeeSeat.update({
    where: { id },
    data: {
      seatCode: (formData.get("seatCode") as string)?.trim(),
      furnitureId: (formData.get("furnitureId") as string | null) || null,
      personnelId: (formData.get("personnelId") as string | null) || null,
      section: (formData.get("section") as string | null) || null,
      room: (formData.get("room") as string | null) || null,
      remarks: (formData.get("remarks") as string | null) || null,
    },
  });
  revalidatePath("/ict-management/infrastructure-map");
  return { ok: true, message: "Seat updated." };
}

export async function deleteEmployeeSeatAction(id: string) {
  await requireICTMapAdmin();
  await db.employeeSeat.delete({ where: { id } });
  revalidatePath("/ict-management/infrastructure-map");
  return { ok: true, message: "Seat deleted." };
}

// ── Network Devices ───────────────────────────────────────────────────────────

export async function addNetworkDeviceAction(formData: FormData) {
  await requireICTMapAdmin();
  const mapId = formData.get("mapId") as string;
  const deviceCode = (formData.get("deviceCode") as string)?.trim();
  const deviceName = (formData.get("deviceName") as string)?.trim();
  if (!mapId || !deviceCode || !deviceName) return { ok: false, message: "Map ID, code, and name are required." };

  const item = await db.networkDevice.create({
    data: {
      mapId, deviceCode, deviceName,
      type: (formData.get("type") as NetworkDeviceType) || "DESKTOP",
      status: (formData.get("status") as NetworkDeviceStatus) || "UNKNOWN",
      furnitureId: (formData.get("furnitureId") as string | null) || null,
      employeeSeatId: (formData.get("employeeSeatId") as string | null) || null,
      personnelId: (formData.get("personnelId") as string | null) || null,
      hostname: (formData.get("hostname") as string | null) || null,
      ipAddress: (formData.get("ipAddress") as string | null) || null,
      macAddress: (formData.get("macAddress") as string | null) || null,
      section: (formData.get("section") as string | null) || null,
      room: (formData.get("room") as string | null) || null,
      xPercent: parseFloat((formData.get("xPercent") as string) || "50"),
      yPercent: parseFloat((formData.get("yPercent") as string) || "50"),
      remarks: (formData.get("remarks") as string | null) || null,
    },
  });
  revalidatePath("/ict-management/infrastructure-map");
  return { ok: true, message: "Device added.", id: item.id };
}

export async function updateNetworkDeviceAction(id: string, formData: FormData) {
  await requireICTMapAdmin();
  await db.networkDevice.update({
    where: { id },
    data: {
      deviceCode: (formData.get("deviceCode") as string)?.trim(),
      deviceName: (formData.get("deviceName") as string)?.trim(),
      type: (formData.get("type") as NetworkDeviceType) || "DESKTOP",
      status: (formData.get("status") as NetworkDeviceStatus) || "UNKNOWN",
      furnitureId: (formData.get("furnitureId") as string | null) || null,
      employeeSeatId: (formData.get("employeeSeatId") as string | null) || null,
      personnelId: (formData.get("personnelId") as string | null) || null,
      hostname: (formData.get("hostname") as string | null) || null,
      ipAddress: (formData.get("ipAddress") as string | null) || null,
      macAddress: (formData.get("macAddress") as string | null) || null,
      section: (formData.get("section") as string | null) || null,
      room: (formData.get("room") as string | null) || null,
      remarks: (formData.get("remarks") as string | null) || null,
    },
  });
  revalidatePath("/ict-management/infrastructure-map");
  return { ok: true, message: "Device updated." };
}

export async function deleteNetworkDeviceAction(id: string) {
  await requireICTMapAdmin();
  await db.networkDevice.delete({ where: { id } });
  revalidatePath("/ict-management/infrastructure-map");
  return { ok: true, message: "Device deleted." };
}

// ── Connections ───────────────────────────────────────────────────────────────

export async function addNetworkConnectionAction(formData: FormData) {
  await requireICTMapAdmin();
  const mapId = formData.get("mapId") as string;
  const sourceDeviceId = formData.get("sourceDeviceId") as string;
  const targetDeviceId = formData.get("targetDeviceId") as string;
  if (!mapId || !sourceDeviceId || !targetDeviceId) return { ok: false, message: "Source and target devices are required." };
  if (sourceDeviceId === targetDeviceId) return { ok: false, message: "A device cannot connect to itself." };

  const item = await db.networkConnection.create({
    data: {
      mapId, sourceDeviceId, targetDeviceId,
      connectionType: (formData.get("connectionType") as NetworkConnectionType) || "LAN",
      sourcePort: (formData.get("sourcePort") as string | null) || null,
      targetPort: (formData.get("targetPort") as string | null) || null,
      cableLabel: (formData.get("cableLabel") as string | null) || null,
      isVerified: formData.get("isVerified") === "true",
      remarks: (formData.get("remarks") as string | null) || null,
    },
  });
  revalidatePath("/ict-management/infrastructure-map");
  return { ok: true, message: "Connection added.", id: item.id };
}

export async function updateNetworkConnectionAction(id: string, formData: FormData) {
  await requireICTMapAdmin();
  await db.networkConnection.update({
    where: { id },
    data: {
      connectionType: (formData.get("connectionType") as NetworkConnectionType) || "LAN",
      sourcePort: (formData.get("sourcePort") as string | null) || null,
      targetPort: (formData.get("targetPort") as string | null) || null,
      cableLabel: (formData.get("cableLabel") as string | null) || null,
      isVerified: formData.get("isVerified") === "true",
      remarks: (formData.get("remarks") as string | null) || null,
    },
  });
  revalidatePath("/ict-management/infrastructure-map");
  return { ok: true, message: "Connection updated." };
}

export async function deleteNetworkConnectionAction(id: string) {
  await requireICTMapAdmin();
  await db.networkConnection.delete({ where: { id } });
  revalidatePath("/ict-management/infrastructure-map");
  return { ok: true, message: "Connection deleted." };
}
