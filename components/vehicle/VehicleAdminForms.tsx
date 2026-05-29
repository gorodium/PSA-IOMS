"use client";

import { useActionState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createVehicleAction, manageVehicleRequestAction } from "@/app/(app)/vehicle-requests/actions";

type VehicleOption = {
  id: string;
  name: string;
  plateNumber: string | null;
};

type VehicleRequestStatusValue = "PENDING" | "APPROVED" | "ASSIGNED" | "REJECTED" | "CANCELLED";

const vehicleRequestStatuses: VehicleRequestStatusValue[] = [
  "PENDING",
  "APPROVED",
  "ASSIGNED",
  "REJECTED",
  "CANCELLED"
];

const initialState = {
  ok: false,
  message: ""
};

function formatVehicleOption(vehicle: VehicleOption) {
  return vehicle.plateNumber ? `${vehicle.name} (${vehicle.plateNumber})` : vehicle.name;
}

export function VehicleAdminRequestForm({
  requestId,
  status,
  assignedVehicleId,
  soNumber,
  vehicles
}: {
  requestId: string;
  status: VehicleRequestStatusValue;
  assignedVehicleId: string | null;
  soNumber: string | null;
  vehicles: VehicleOption[];
}) {
  const [state, action, isPending] = useActionState(manageVehicleRequestAction, initialState);

  return (
    <form action={action} className="min-w-[720px] space-y-3">
      <input type="hidden" name="requestId" value={requestId} />
      {state.message && (
        <div className={state.ok ? "rounded-md border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-800" : "rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-800"}>
          {state.message}
        </div>
      )}
      <div className="grid gap-3 md:grid-cols-4">
        <label className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Status</span>
          <Select name="status" defaultValue={status}>
            {vehicleRequestStatuses.map((item) => (
              <option key={item} value={item}>
                {item.replaceAll("_", " ")}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Assigned vehicle</span>
          <Select name="vehicleId" defaultValue={assignedVehicleId ?? ""}>
            <option value="">No vehicle assigned</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {formatVehicleOption(vehicle)}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">SO number/reference</span>
          <Input name="soNumber" defaultValue={soNumber ?? ""} placeholder="SO reference" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">SO hard copy</span>
          <Input name="soFile" type="file" accept=".pdf,.jpg,.jpeg,.png" />
        </label>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Admin notes</span>
          <Textarea name="adminNotes" className="min-h-20" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Rejection reason</span>
          <Textarea name="rejectionReason" className="min-h-20" />
        </label>
      </div>
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Saving..." : "Save Admin Update"}
      </Button>
    </form>
  );
}

export function VehicleCreateForm() {
  const [state, action, isPending] = useActionState(createVehicleAction, initialState);

  return (
    <form action={action} className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-[1fr_1fr_2fr_auto]">
      <label className="space-y-1">
        <span className="text-xs font-medium text-muted-foreground">Vehicle name</span>
        <Input name="name" required placeholder="Actual office vehicle" />
      </label>
      <label className="space-y-1">
        <span className="text-xs font-medium text-muted-foreground">Plate number</span>
        <Input name="plateNumber" placeholder="Optional" />
      </label>
      <label className="space-y-1">
        <span className="text-xs font-medium text-muted-foreground">Description</span>
        <Input name="description" placeholder="Optional vehicle details" />
      </label>
      <div className="flex items-end">
        <Button type="submit" disabled={isPending} className="w-full">
          <PlusCircle className="h-4 w-4" />
          {isPending ? "Adding..." : "Add Vehicle"}
        </Button>
      </div>
      {state.message && (
        <div className={state.ok ? "md:col-span-4 rounded-md border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-800" : "md:col-span-4 rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-800"}>
          {state.message}
        </div>
      )}
    </form>
  );
}
