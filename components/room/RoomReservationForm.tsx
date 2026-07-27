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

type SpecialOrderOption = {
  id: string;
  soNumber: string | null;
  purpose: string | null;
  activityDate: Date | null;
};

type ReservationTypeValue = "SINGLE_DAY" | "HALF_DAY" | "MULTIPLE_DAYS";

const initialState = {
  ok: false,
  message: ""
};

export function RoomReservationForm({
  rooms,
  specialOrders
}: {
  rooms: RoomOption[];
  specialOrders: SpecialOrderOption[];
}) {
  const [state, action, isPending] = useActionState(createRoomReservationAction, initialState);
  const [reservationType, setReservationType] = useState<ReservationTypeValue>("SINGLE_DAY");

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
            <span className="text-sm font-medium">Room <span className="text-red-500">*</span></span>
            <Select name="roomId" required>
              <option value="">Select room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id} disabled={!room.isAvailable}>
                  {room.name}{room.isAvailable ? "" : ` - Unavailable${room.unavailableReason ? ` (${room.unavailableReason})` : ""}`}
                </option>
              ))}
            </Select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Booking duration <span className="text-red-500">*</span></span>
            <Select
              name="reservationType"
              value={reservationType}
              onChange={(event) => setReservationType(event.target.value as ReservationTypeValue)}
            >
              <option value="SINGLE_DAY">Whole day (single day)</option>
              <option value="HALF_DAY">Half day (AM or PM)</option>
              <option value="MULTIPLE_DAYS">Multiple days</option>
            </Select>
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium">
                {reservationType === "MULTIPLE_DAYS" ? "Start date" : "Reservation date"} <span className="text-red-500">*</span>
              </span>
              <Input name="startDate" type="date" required />
            </label>
            {reservationType === "MULTIPLE_DAYS" && (
              <label className="space-y-2">
                <span className="text-sm font-medium">End date <span className="text-red-500">*</span></span>
                <Input name="endDate" type="date" required />
              </label>
            )}
            {reservationType !== "MULTIPLE_DAYS" && (
              <input type="hidden" name="endDate" value="" />
            )}
          </div>

          {reservationType === "HALF_DAY" && (
            <label className="block space-y-2">
              <span className="text-sm font-medium">Half-day slot <span className="text-red-500">*</span></span>
              <Select name="halfDaySlot" required>
                <option value="MORNING">Morning (AM)</option>
                <option value="AFTERNOON">Afternoon (PM)</option>
              </Select>
            </label>
          )}

          <label className="block space-y-2">
            <span className="text-sm font-medium">Purpose of room usage <span className="text-red-500">*</span></span>
            <Textarea name="purpose" required placeholder="State the official purpose of the room reservation." />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Associated Special Order</span>
            <select
              name="specialOrderId"
              className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-slate-900 dark:text-slate-50"
            >
              <option value="">None</option>
              {specialOrders.map((so) => (
                <option key={so.id} value={so.id}>
                  {so.soNumber ? `SO #${so.soNumber}` : "SO"}{so.purpose ? ` — ${so.purpose}` : ""}
                  {so.activityDate ? ` (${new Date(so.activityDate).toLocaleDateString()})` : ""}
                </option>
              ))}
            </select>
            <span className="text-xs text-muted-foreground">
              Optional. Link this reservation to an existing Special Order.
            </span>
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
