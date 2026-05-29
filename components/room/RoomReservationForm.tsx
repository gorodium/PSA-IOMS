"use client";

import { useActionState, useState } from "react";
import { DoorOpen } from "lucide-react";
import { createRoomReservationAction } from "@/app/(app)/room-reservations/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type RoomOption = {
  id: string;
  name: string;
  isAvailable: boolean;
  unavailableReason: string | null;
};

type RoomReservationTypeValue = "HALF_DAY" | "MULTIPLE_DAYS";

const initialState = {
  ok: false,
  message: ""
};

export function RoomReservationForm({ rooms }: { rooms: RoomOption[] }) {
  const [state, action, isPending] = useActionState(createRoomReservationAction, initialState);
  const [reservationType, setReservationType] = useState<RoomReservationTypeValue>("HALF_DAY");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DoorOpen className="h-5 w-5" />
          Request Room Reservation
        </CardTitle>
        <CardDescription>
          Choose one of the official reservable rooms and submit the request for admin review.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-5">
          {state.message && (
            <div className={state.ok ? "rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800" : "rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"}>
              {state.message}
            </div>
          )}

          <label className="block space-y-2">
            <span className="text-sm font-medium">Room</span>
            <Select name="roomId" required>
              <option value="">Select room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id} disabled={!room.isAvailable}>
                  {room.name}{room.isAvailable ? "" : ` - Unavailable${room.unavailableReason ? ` (${room.unavailableReason})` : ""}`}
                </option>
              ))}
            </Select>
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-medium">Booking duration</span>
              <Select
                name="reservationType"
                value={reservationType}
                onChange={(event) => setReservationType(event.target.value as RoomReservationTypeValue)}
              >
                <option value="HALF_DAY">Half day</option>
                <option value="MULTIPLE_DAYS">Multiple days</option>
              </Select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium">{reservationType === "HALF_DAY" ? "Reservation date" : "Start date"}</span>
              <Input name="startDate" type="date" required />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium">End date</span>
              <Input name="endDate" type="date" required />
            </label>
          </div>

          {reservationType === "HALF_DAY" && (
            <label className="block space-y-2">
              <span className="text-sm font-medium">Half-day slot</span>
              <Select name="halfDaySlot" required>
                <option value="MORNING">Morning</option>
                <option value="AFTERNOON">Afternoon</option>
              </Select>
              <span className="text-xs text-muted-foreground">
                Use the same date in Start and End date for half-day reservations.
              </span>
            </label>
          )}

          <label className="block space-y-2">
            <span className="text-sm font-medium">Purpose of room usage</span>
            <Textarea name="purpose" required placeholder="State the official purpose of the room reservation." />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Remarks</span>
            <Textarea name="remarks" placeholder="Optional notes for the admin reviewer." />
          </label>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit Reservation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
