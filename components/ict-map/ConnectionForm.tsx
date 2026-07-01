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
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  addNetworkConnectionAction,
  updateNetworkConnectionAction,
} from "@/app/(app)/ict-management/infrastructure-map/actions";
import type {
  ICTMapConnection,
  ICTMapDevice,
} from "@/app/(app)/ict-management/infrastructure-map/actions";

// ── Constants ──────────────────────────────────────────────────────────────────

const CONNECTION_TYPES: ICTMapConnection["connectionType"][] = [
  "LAN",
  "WIFI",
  "FIBER",
  "VPN",
  "USB",
  "SHARED_PRINTER",
  "UNKNOWN",
];

const CONNECTION_TYPE_LABELS: Record<ICTMapConnection["connectionType"], string> = {
  LAN: "LAN (Wired Ethernet)",
  WIFI: "Wi-Fi (Wireless)",
  FIBER: "Fiber Optic",
  VPN: "VPN Tunnel",
  USB: "USB",
  SHARED_PRINTER: "Shared Printer",
  UNKNOWN: "Unknown",
  OTHER: "Other",
  BLUETOOTH: "Bluetooth",
};

const CONNECTION_TYPE_BADGE: Record<ICTMapConnection["connectionType"], string> = {
  LAN: "bg-blue-100 text-blue-700",
  WIFI: "bg-cyan-100 text-cyan-700",
  FIBER: "bg-orange-100 text-orange-700",
  VPN: "bg-purple-100 text-purple-700",
  USB: "bg-lime-100 text-lime-700",
  SHARED_PRINTER: "bg-pink-100 text-pink-700",
  UNKNOWN: "bg-gray-100 text-gray-500",
  OTHER: "bg-gray-100 text-gray-500",
  BLUETOOTH: "bg-indigo-100 text-indigo-700",
};

// ── Types ──────────────────────────────────────────────────────────────────────

interface ConnectionFormProps {
  mapId: string;
  connection: ICTMapConnection | null;
  devices: ICTMapDevice[];
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

// ── Default state ──────────────────────────────────────────────────────────────

function defaultForm(connection: ICTMapConnection | null, mapId: string) {
  return {
    mapId,
    sourceDeviceId: connection?.sourceDeviceId ?? "",
    targetDeviceId: connection?.targetDeviceId ?? "",
    connectionType: (connection?.connectionType ?? "LAN") as ICTMapConnection["connectionType"],
    sourcePort: connection?.sourcePort ?? "",
    targetPort: connection?.targetPort ?? "",
    cableLabel: connection?.cableLabel ?? "",
    isVerified: connection?.isVerified ?? false,
    remarks: connection?.remarks ?? "",
  };
}

// ── Banner ─────────────────────────────────────────────────────────────────────

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

// ── Field helper ───────────────────────────────────────────────────────────────

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

export default function ConnectionForm({
  mapId,
  connection,
  devices,
  isOpen,
  onClose,
  onSaved,
}: ConnectionFormProps) {
  const isEdit = connection !== null;
  const [form, setForm] = useState(() => defaultForm(connection, mapId));
  const [banner, setBanner] = useState<Banner>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setForm(defaultForm(connection, mapId));
    setBanner(null);
  }, [connection, mapId, isOpen]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function buildFormData(): FormData {
    const fd = new FormData();
    fd.set("mapId", form.mapId);
    fd.set("sourceDeviceId", form.sourceDeviceId);
    fd.set("targetDeviceId", form.targetDeviceId);
    fd.set("connectionType", form.connectionType);
    if (form.sourcePort.trim()) fd.set("sourcePort", form.sourcePort.trim());
    if (form.targetPort.trim()) fd.set("targetPort", form.targetPort.trim());
    if (form.cableLabel.trim()) fd.set("cableLabel", form.cableLabel.trim());
    fd.set("isVerified", form.isVerified ? "true" : "false");
    if (form.remarks.trim()) fd.set("remarks", form.remarks.trim());
    return fd;
  }

  function validate(): string | null {
    if (!form.sourceDeviceId) return "Source device is required.";
    if (!form.targetDeviceId) return "Target device is required.";
    if (form.sourceDeviceId === form.targetDeviceId)
      return "Source and target devices must be different.";
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
          ? await updateNetworkConnectionAction(connection.id, fd)
          : await addNetworkConnectionAction(fd);

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

  function deviceLabel(device: ICTMapDevice): string {
    return `${device.deviceName} (${device.deviceCode})`;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEdit ? "Edit Connection" : "Add Network Connection"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <FormBanner banner={banner} />

          {/* Source Device */}
          <Field label="Source Device" required>
            <Select
              id="sourceDeviceId"
              value={form.sourceDeviceId || "__none__"}
              onChange={(e) => set("sourceDeviceId", e.target.value === "__none__" ? "" : e.target.value)}
              disabled={isPending || isEdit}
            >
              <option value="__none__" disabled>
                — Select source —
              </option>
              {devices.map((d) => (
                <option key={d.id} value={d.id}>
                  {deviceLabel(d)}
                </option>
              ))}
            </Select>
          </Field>

          {/* Target Device */}
          <Field label="Target Device" required>
            <Select
              id="targetDeviceId"
              value={form.targetDeviceId || "__none__"}
              onChange={(e) => set("targetDeviceId", e.target.value === "__none__" ? "" : e.target.value)}
              disabled={isPending || isEdit}
            >
              <option value="__none__" disabled>
                — Select target —
              </option>
              {devices
                .filter((d) => d.id !== form.sourceDeviceId)
                .map((d) => (
                  <option key={d.id} value={d.id}>
                    {deviceLabel(d)}
                  </option>
                ))}
            </Select>
          </Field>

          {/* Connection Type */}
          <Field label="Connection Type" required>
            <Select
              id="connectionType"
              value={form.connectionType}
              onChange={(e) =>
                set("connectionType", e.target.value as ICTMapConnection["connectionType"])
              }
              disabled={isPending}
            >
              {CONNECTION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {CONNECTION_TYPE_LABELS[t]}
                </option>
              ))}
            </Select>
          </Field>

          {/* Ports */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Source Port">
              <Input
                id="sourcePort"
                value={form.sourcePort}
                onChange={(e) => set("sourcePort", e.target.value)}
                placeholder="e.g. eth0 / Port 1"
                disabled={isPending}
              />
            </Field>
            <Field label="Target Port">
              <Input
                id="targetPort"
                value={form.targetPort}
                onChange={(e) => set("targetPort", e.target.value)}
                placeholder="e.g. eth1 / Port 2"
                disabled={isPending}
              />
            </Field>
          </div>

          {/* Cable Label */}
          <Field label="Cable Label">
            <Input
              id="cableLabel"
              value={form.cableLabel}
              onChange={(e) => set("cableLabel", e.target.value)}
              placeholder="e.g. CAT6-A01"
              disabled={isPending}
            />
          </Field>

          {/* Verified */}
          <div className="flex items-center gap-3 rounded-md border border-gray-200 p-3 bg-gray-50">
            <Checkbox
              id="isVerified"
              checked={form.isVerified}
              onCheckedChange={(checked) => set("isVerified", checked === true)}
              disabled={isPending}
            />
            <div>
              <Label
                htmlFor="isVerified"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Mark as Verified
              </Label>
              <p className="text-xs text-gray-400 mt-0.5">
                Indicates this connection has been physically verified on-site.
              </p>
            </div>
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
              {isPending
                ? "Saving…"
                : isEdit
                  ? "Save Changes"
                  : "Add Connection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
