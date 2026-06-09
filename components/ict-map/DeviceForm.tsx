"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  addNetworkDeviceAction,
  updateNetworkDeviceAction,
} from "@/app/(app)/ict-management/infrastructure-map/actions";
import type {
  ICTMapDevice,
  ICTMapFurniture,
  ICTMapSeat,
} from "@/app/(app)/ict-management/infrastructure-map/actions";

// ── Constants ──────────────────────────────────────────────────────────────────

const DEVICE_TYPES: ICTMapDevice["type"][] = [
  "FIREWALL",
  "SWITCH",
  "ACCESS_POINT",
  "DESKTOP",
  "LAPTOP",
  "PRINTER",
  "SERVER",
  "NAS",
  "CCTV",
  "NVR",
  "UPS",
  "OTHER",
];

const DEVICE_STATUSES: ICTMapDevice["status"][] = [
  "ONLINE",
  "OFFLINE",
  "WARNING",
  "UNKNOWN",
];

const DEVICE_TYPE_LABELS: Record<ICTMapDevice["type"], string> = {
  FIREWALL: "Firewall",
  SWITCH: "Switch",
  ACCESS_POINT: "Access Point",
  DESKTOP: "Desktop",
  LAPTOP: "Laptop",
  PRINTER: "Printer",
  SERVER: "Server",
  NAS: "NAS",
  CCTV: "CCTV",
  NVR: "NVR",
  UPS: "UPS",
  OTHER: "Other",
};

const DEVICE_STATUS_LABELS: Record<ICTMapDevice["status"], string> = {
  ONLINE: "Online",
  OFFLINE: "Offline",
  WARNING: "Warning",
  UNKNOWN: "Unknown",
};

const STATUS_BADGE_CLASS: Record<ICTMapDevice["status"], string> = {
  ONLINE: "bg-green-100 text-green-700",
  OFFLINE: "bg-red-100 text-red-700",
  WARNING: "bg-amber-100 text-amber-700",
  UNKNOWN: "bg-gray-100 text-gray-500",
};

// ── Types ──────────────────────────────────────────────────────────────────────

type PersonnelOption = {
  id: string;
  fullName: string;
  position: string | null;
  section: string;
  photoUrl: string | null;
};

interface DeviceFormProps {
  mapId: string;
  device: ICTMapDevice | null;
  furniture: ICTMapFurniture[];
  seats: ICTMapSeat[];
  personnel: PersonnelOption[];
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

// ── Default form state ─────────────────────────────────────────────────────────

function defaultForm(device: ICTMapDevice | null, mapId: string) {
  return {
    mapId,
    deviceCode: device?.deviceCode ?? "",
    deviceName: device?.deviceName ?? "",
    type: (device?.type ?? "DESKTOP") as ICTMapDevice["type"],
    status: (device?.status ?? "UNKNOWN") as ICTMapDevice["status"],
    personnelId: device?.personnelId ?? "",
    furnitureId: device?.furnitureId ?? "",
    employeeSeatId: device?.employeeSeatId ?? "",
    hostname: device?.hostname ?? "",
    ipAddress: device?.ipAddress ?? "",
    macAddress: device?.macAddress ?? "",
    section: device?.section ?? "",
    room: device?.room ?? "",
    remarks: device?.remarks ?? "",
  };
}

// ── Banner component ───────────────────────────────────────────────────────────

type Banner = { ok: boolean; message: string } | null;

function FormBanner({ banner }: { banner: Banner }) {
  if (!banner) return null;
  return (
    <div
      className={cn(
        "rounded-md px-4 py-2 text-sm font-medium mb-2",
        banner.ok
          ? "bg-green-50 text-green-700 border border-green-200"
          : "bg-red-50 text-red-700 border border-red-200"
      )}
    >
      {banner.message}
    </div>
  );
}

// ── Form field helpers ─────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

function Field({ label, required, children, className }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function DeviceForm({
  mapId,
  device,
  furniture,
  seats,
  personnel,
  isOpen,
  onClose,
  onSaved,
}: DeviceFormProps) {
  const isEdit = device !== null;
  const [form, setForm] = useState(() => defaultForm(device, mapId));
  const [banner, setBanner] = useState<Banner>(null);
  const [isPending, startTransition] = useTransition();

  // Reset form when device changes or dialog opens
  useEffect(() => {
    setForm(defaultForm(device, mapId));
    setBanner(null);
  }, [device, mapId, isOpen]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function buildFormData(): FormData {
    const fd = new FormData();
    fd.set("mapId", form.mapId);
    fd.set("deviceCode", form.deviceCode.trim());
    fd.set("deviceName", form.deviceName.trim());
    fd.set("type", form.type);
    fd.set("status", form.status);
    if (form.personnelId) fd.set("personnelId", form.personnelId);
    if (form.furnitureId) fd.set("furnitureId", form.furnitureId);
    if (form.employeeSeatId) fd.set("employeeSeatId", form.employeeSeatId);
    if (form.hostname.trim()) fd.set("hostname", form.hostname.trim());
    if (form.ipAddress.trim()) fd.set("ipAddress", form.ipAddress.trim());
    if (form.macAddress.trim()) fd.set("macAddress", form.macAddress.trim());
    if (form.section.trim()) fd.set("section", form.section.trim());
    if (form.room.trim()) fd.set("room", form.room.trim());
    if (form.remarks.trim()) fd.set("remarks", form.remarks.trim());
    return fd;
  }

  function validate(): string | null {
    if (!form.deviceCode.trim()) return "Device code is required.";
    if (!form.deviceName.trim()) return "Device name is required.";
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setBanner({ ok: false, message: err });
      return;
    }
    setBanner(null);
    const fd = buildFormData();

    startTransition(async () => {
      try {
        const result = isEdit
          ? await updateNetworkDeviceAction(device.id, fd)
          : await addNetworkDeviceAction(fd);

        if (result.ok) {
          setBanner({ ok: true, message: result.message });
          setTimeout(() => {
            onSaved();
            onClose();
          }, 600);
        } else {
          setBanner({ ok: false, message: result.message });
        }
      } catch (err) {
        setBanner({
          ok: false,
          message: err instanceof Error ? err.message : "An unexpected error occurred.",
        });
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEdit ? "Edit Device" : "Add Network Device"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <FormBanner banner={banner} />

          {/* Row 1: Code + Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Device Code" required>
              <Input
                id="deviceCode"
                value={form.deviceCode}
                onChange={(e) => set("deviceCode", e.target.value)}
                placeholder="e.g. SW-01"
                disabled={isPending}
              />
            </Field>
            <Field label="Device Name" required>
              <Input
                id="deviceName"
                value={form.deviceName}
                onChange={(e) => set("deviceName", e.target.value)}
                placeholder="e.g. Core Switch"
                disabled={isPending}
              />
            </Field>
          </div>

          {/* Row 2: Type + Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Type" required>
              <Select
                value={form.type}
                onValueChange={(v) => set("type", v as ICTMapDevice["type"])}
                disabled={isPending}
              >
                <SelectTrigger id="deviceType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {DEVICE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {DEVICE_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Status" required>
              <Select
                value={form.status}
                onValueChange={(v) => set("status", v as ICTMapDevice["status"])}
                disabled={isPending}
              >
                <SelectTrigger id="deviceStatus">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {DEVICE_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                          STATUS_BADGE_CLASS[s]
                        )}
                      >
                        {DEVICE_STATUS_LABELS[s]}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          {/* Row 3: Personnel */}
          <Field label="Assigned Personnel">
            <Select
              value={form.personnelId || "__none__"}
              onValueChange={(v) => set("personnelId", v === "__none__" ? "" : v)}
              disabled={isPending}
            >
              <SelectTrigger id="personnelId">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">— None —</SelectItem>
                {personnel.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.fullName}
                    {p.position ? ` · ${p.position}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Row 4: Furniture + Seat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Furniture">
              <Select
                value={form.furnitureId || "__none__"}
                onValueChange={(v) => set("furnitureId", v === "__none__" ? "" : v)}
                disabled={isPending}
              >
                <SelectTrigger id="furnitureId">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">— None —</SelectItem>
                  {furniture.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.furnitureName} ({f.furnitureCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Employee Seat">
              <Select
                value={form.employeeSeatId || "__none__"}
                onValueChange={(v) => set("employeeSeatId", v === "__none__" ? "" : v)}
                disabled={isPending}
              >
                <SelectTrigger id="employeeSeatId">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">— None —</SelectItem>
                  {seats.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.seatCode}
                      {s.personnelName ? ` · ${s.personnelName}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="border-t pt-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Network Details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Hostname">
                <Input
                  id="hostname"
                  value={form.hostname}
                  onChange={(e) => set("hostname", e.target.value)}
                  placeholder="e.g. switch-01.local"
                  disabled={isPending}
                />
              </Field>
              <Field label="IP Address">
                <Input
                  id="ipAddress"
                  value={form.ipAddress}
                  onChange={(e) => set("ipAddress", e.target.value)}
                  placeholder="192.168.1.1"
                  disabled={isPending}
                />
              </Field>
              <Field label="MAC Address">
                <Input
                  id="macAddress"
                  value={form.macAddress}
                  onChange={(e) => set("macAddress", e.target.value)}
                  placeholder="AA:BB:CC:DD:EE:FF"
                  disabled={isPending}
                />
              </Field>
            </div>
          </div>

          {/* Row: Section + Room */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Section">
              <Input
                id="section"
                value={form.section}
                onChange={(e) => set("section", e.target.value)}
                placeholder="e.g. Server Room"
                disabled={isPending}
              />
            </Field>
            <Field label="Room">
              <Input
                id="room"
                value={form.room}
                onChange={(e) => set("room", e.target.value)}
                placeholder="e.g. Room 101"
                disabled={isPending}
              />
            </Field>
          </div>

          {/* Remarks */}
          <Field label="Remarks">
            <Textarea
              id="remarks"
              value={form.remarks}
              onChange={(e) => set("remarks", e.target.value)}
              placeholder="Optional notes..."
              rows={3}
              disabled={isPending}
            />
          </Field>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : isEdit ? "Save Changes" : "Add Device"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
