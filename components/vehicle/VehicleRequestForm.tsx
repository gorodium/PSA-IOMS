"use client";

import { useActionState } from "react";
import { CarFront } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createVehicleRequestAction } from "@/app/(app)/vehicle-requests/actions";

type PersonnelOption = {
  id: string;
  fullName: string;
  position: string;
  section: string;
};

const initialState = {
  ok: false,
  message: ""
};

export function VehicleRequestForm({
  personnel,
  requesterPersonnelId
}: {
  personnel: PersonnelOption[];
  requesterPersonnelId: string;
}) {
  const [state, action, isPending] = useActionState(createVehicleRequestAction, initialState);
  const passengerOptions = personnel.filter((person) => person.id !== requesterPersonnelId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CarFront className="h-5 w-5" />
          Request Vehicle Use
        </CardTitle>
        <CardDescription>
          Submit a travel request for admin review. Vehicles and SO details are assigned by administrators.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-5">
          {state.message && (
            <div className={state.ok ? "rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800" : "rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"}>
              {state.message}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-medium">Travel date</span>
              <Input name="travelDate" type="date" required />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium">Departure time</span>
              <Input name="departureTime" type="time" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium">Expected return time</span>
              <Input name="expectedReturnTime" type="time" />
            </label>
          </div>

          <label className="space-y-2 block">
            <span className="text-sm font-medium">Purpose of travel</span>
            <Textarea name="purpose" required placeholder="State the official purpose of travel." />
          </label>

          <label className="space-y-2 block">
            <span className="text-sm font-medium">Destination</span>
            <Input name="destination" required placeholder="City, municipality, barangay, or office destination" />
          </label>

          <label className="space-y-2 block">
            <span className="text-sm font-medium">Other employees joining the travel</span>
            <select
              name="passengerIds"
              multiple
              className="min-h-40 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-slate-900 dark:text-slate-50"
            >
              {passengerOptions.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.fullName} - {person.position}, {person.section}
                </option>
              ))}
            </select>
            <span className="text-xs text-muted-foreground">
              Hold Ctrl while clicking to select more than one employee.
            </span>
          </label>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
