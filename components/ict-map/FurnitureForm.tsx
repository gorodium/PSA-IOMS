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
import { cn } from "@/lib/utils";
import {
  addFurnitureAction,
  updateFurnitureAction,
} from "@/app/(app)/ict-management/infrastructure-map/actions";
import type { ICTMapFurniture } from "@/app/(app)/ict-management/infrastructure-map/actions";

// ── Constants ──────────────────────────────────────────────────────────────────

const FURNITURE_TYPES: ICTMapFurniture["type"][] = [
  "DESK",
  "COMPUTER_DESK",
  "TABLE",
  "MEETING_TABLE",
  "COUNTER",
  "CABINET",
  "PRINTER_TABLE",
  "NETWORK_RACK",
  "SHELF",
  "CHAIR",
  "SERVER_RACK",
  "PRINTER_STATION",
  "RECEPTION",
  "WALL",
  "PARTITION",
  "OTHER",
];

const FURNITURE_TYPE_LABELS: Record<ICTMapFurniture["type"], string> = {
  DESK: "Desk",
  COMPUTER_DESK: "Computer Desk",
  TABLE: "Table",
  MEETING_TABLE: "Meeting Table",
  COUNTER: "Counter",
  CABINET: "Cabinet",
  PRINTER_TABLE: "Printer Table",
  NETWORK_RACK: "Network Rack",
  SHELF: "Shelf",
  CHAIR: "Chair",
  SERVER_RACK: "Server Rack",
  PRINTER_STATION: "Printer Station",
  RECEPTION: "Reception",
  WALL: "Wall",
  PARTITION: "Partition",
  OTHER: "Other",
};

// ── Types ──────────────────────────────────────────────────────────────────────

interface FurnitureFormProps {
  mapId: string;
  furniture: ICTMapFurniture | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

// ── Default state ──────────────────────────────────────────────────────────────

function defaultForm(furniture: ICTMapFurniture | null, mapId: string) {
  return {
    mapId,
    furnitureCode: furniture?.furnitureCode ?? "",
    furnitureName: furniture?.furnitureName ?? "",
    type: (furniture?.type ?? "DESK") as ICTMapFurniture["type"],
    widthPercent: furniture?.widthPercent?.toString() ?? "5",
    heightPercent: furniture?.heightPercent?.toString() ?? "3",
    rotation: furniture?.rotation?.toString() ?? "0",
    section: furniture?.section ?? "",
    room: furniture?.room ?? "",
    label: furniture?.label ?? "",
    remarks: furniture?.remarks ?? "",
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

export default function FurnitureForm({
  mapId,
  furniture,
  isOpen,
  onClose,
  onSaved,
}: FurnitureFormProps) {
  const isEdit = furniture !== null;
  const [form, setForm] = useState(() => defaultForm(furniture, mapId));
  const [banner, setBanner] = useState<Banner>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setForm(defaultForm(furniture, mapId));
    setBanner(null);
  }, [furniture, mapId, isOpen]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function clampNum(value: string, min: number, max: number): string {
    const n = parseFloat(value);
    if (isNaN(n)) return String(min);
    return String(Math.min(max, Math.max(min, n)));
  }

  function buildFormData(): FormData {
    const fd = new FormData();
    fd.set("mapId", form.mapId);
    fd.set("furnitureCode", form.furnitureCode.trim());
    fd.set("furnitureName", form.furnitureName.trim());
    fd.set("type", form.type);
    fd.set("widthPercent", clampNum(form.widthPercent, 1, 50));
    fd.set("heightPercent", clampNum(form.heightPercent, 1, 30));
    fd.set("rotation", clampNum(form.rotation, 0, 360));
    if (form.section.trim()) fd.set("section", form.section.trim());
    if (form.room.trim()) fd.set("room", form.room.trim());
    if (form.label.trim()) fd.set("label", form.label.trim());
    if (form.remarks.trim()) fd.set("remarks", form.remarks.trim());
    return fd;
  }

  function validate(): string | null {
    if (!form.furnitureCode.trim()) return "Furniture code is required.";
    if (!form.furnitureName.trim()) return "Furniture name is required.";
    const w = parseFloat(form.widthPercent);
    const h = parseFloat(form.heightPercent);
    const r = parseFloat(form.rotation);
    if (isNaN(w) || w < 1 || w > 50) return "Width must be between 1 and 50.";
    if (isNaN(h) || h < 1 || h > 30) return "Height must be between 1 and 30.";
    if (isNaN(r) || r < 0 || r > 360) return "Rotation must be between 0 and 360.";
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
          ? await updateFurnitureAction(furniture.id, fd)
          : await addFurnitureAction(fd);

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
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEdit ? "Edit Furniture" : "Add Furniture"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <FormBanner banner={banner} />

          {/* Code + Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Furniture Code" required>
              <Input
                id="furnitureCode"
                value={form.furnitureCode}
                onChange={(e) => set("furnitureCode", e.target.value)}
                placeholder="e.g. DESK-01"
                disabled={isPending}
              />
            </Field>
            <Field label="Furniture Name" required>
              <Input
                id="furnitureName"
                value={form.furnitureName}
                onChange={(e) => set("furnitureName", e.target.value)}
                placeholder="e.g. Reception Desk"
                disabled={isPending}
              />
            </Field>
          </div>

          {/* Type */}
          <Field label="Type" required>
            <Select
              id="furnitureType"
              value={form.type}
              onChange={(e) => set("type", e.target.value as ICTMapFurniture["type"])}
              disabled={isPending}
            >
              {FURNITURE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {FURNITURE_TYPE_LABELS[t]}
                </option>
              ))}
            </Select>
          </Field>

          {/* Dimensions + Rotation */}
          <div className="grid grid-cols-3 gap-4">
            <Field label="Width %" required>
              <Input
                id="widthPercent"
                type="number"
                min={1}
                max={50}
                step={0.5}
                value={form.widthPercent}
                onChange={(e) => set("widthPercent", e.target.value)}
                disabled={isPending}
              />
            </Field>
            <Field label="Height %" required>
              <Input
                id="heightPercent"
                type="number"
                min={1}
                max={30}
                step={0.5}
                value={form.heightPercent}
                onChange={(e) => set("heightPercent", e.target.value)}
                disabled={isPending}
              />
            </Field>
            <Field label="Rotation °">
              <Input
                id="rotation"
                type="number"
                min={0}
                max={360}
                step={1}
                value={form.rotation}
                onChange={(e) => set("rotation", e.target.value)}
                disabled={isPending}
              />
            </Field>
          </div>

          {/* Section + Room */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Section">
              <Input
                id="section"
                value={form.section}
                onChange={(e) => set("section", e.target.value)}
                placeholder="e.g. Operations Wing"
                disabled={isPending}
              />
            </Field>
            <Field label="Room">
              <Input
                id="room"
                value={form.room}
                onChange={(e) => set("room", e.target.value)}
                placeholder="e.g. Room 201"
                disabled={isPending}
              />
            </Field>
          </div>

          {/* Label */}
          <Field label="Display Label">
            <Input
              id="label"
              value={form.label}
              onChange={(e) => set("label", e.target.value)}
              placeholder="Short label shown on map"
              disabled={isPending}
            />
          </Field>

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
              {isPending ? "Saving…" : isEdit ? "Save Changes" : "Add Furniture"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
