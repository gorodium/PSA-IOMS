"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { manageRoomReservationAction, updateRoomAvailabilityAction } from "@/app/(app)/room-reservations/actions";

const initialState = {
  ok: false,
  message: ""
};

type RoomReservationStatusValue = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

const roomReservationStatuses: RoomReservationStatusValue[] = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED"
];

export function RoomReservationAdminForm({
  reservationId,
  status,
  rejectionReason
}: {
  reservationId: string;
  status: RoomReservationStatusValue;
  rejectionReason: string | null;
}) {
  const [state, action, isPending] = useActionState(manageRoomReservationAction, initialState);

  return (
    <form action={action} className="min-w-[420px] space-y-3">
      <input type="hidden" name="reservationId" value={reservationId} />
      {state.message && (
        <div className={state.ok ? "rounded-md border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-800" : "rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-800"}>
          {state.message}
        </div>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Status</span>
          <Select name="status" defaultValue={status}>
            {roomReservationStatuses.map((item) => (
              <option key={item} value={item}>
                {item.replaceAll("_", " ")}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Rejection reason</span>
          <Input name="rejectionReason" defaultValue={rejectionReason ?? ""} />
        </label>
      </div>
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Saving..." : "Save Review"}
      </Button>
    </form>
  );
}

export function RoomAvailabilityForm({
  room
}: {
  room: {
    id: string;
    name: string;
    isAvailable: boolean;
    unavailableReason: string | null;
  };
}) {
  const [state, action, isPending] = useActionState(updateRoomAvailabilityAction, initialState);

  return (
    <form action={action} className="rounded-lg border bg-background p-4">
      <input type="hidden" name="roomId" value={room.id} />
      <div className="flex flex-col gap-3">
        <div>
          <p className="font-medium">{room.name}</p>
          <p className="text-sm text-muted-foreground">
            {room.isAvailable ? "Available for reservation" : `Unavailable${room.unavailableReason ? `: ${room.unavailableReason}` : ""}`}
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-[160px_1fr_auto]">
          <Select name="isAvailable" defaultValue={room.isAvailable ? "true" : "false"}>
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </Select>
          <Input name="unavailableReason" defaultValue={room.unavailableReason ?? ""} placeholder="Unavailable reason" />
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "Saving..." : "Update"}
          </Button>
        </div>
        {state.message && (
          <div className={state.ok ? "rounded-md border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-800" : "rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-800"}>
            {state.message}
          </div>
        )}
      </div>
    </form>
  );
}
