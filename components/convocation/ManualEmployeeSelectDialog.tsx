"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { overrideConvocationItemPersonnelAction } from "@/app/(app)/convocation/actions";

type Personnel = {
  id: string;
  fullName: string;
  position: string | null;
};

export function ManualEmployeeSelectDialog({
  itemId,
  personnelList
}: {
  itemId: string;
  personnelList: Personnel[];
}) {
  const [open, setOpen] = useState(false);
  const [selectedPersonnelId, setSelectedPersonnelId] = useState(personnelList[0]?.id ?? "");
  const [isPending, startTransition] = useTransition();

  const handleReplace = () => {
    if (!selectedPersonnelId) return;
    startTransition(async () => {
      try {
        await overrideConvocationItemPersonnelAction(itemId, selectedPersonnelId);
        setOpen(false);
      } catch (error) {
        alert(error instanceof Error ? error.message : "Failed to replace employee.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="outline" className="h-7 px-2 text-xs">
          Manual
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose Employee Manually</DialogTitle>
          <DialogDescription>
            Select an employee from the list to assign to this item. This overrides the automatic assignment rotation.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Select Employee
          </label>
          <select
            value={selectedPersonnelId}
            onChange={(e) => setSelectedPersonnelId(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700"
          >
            {personnelList.map((person) => (
              <option key={person.id} value={person.id}>
                {person.fullName} {person.position ? `(${person.position})` : ""}
              </option>
            ))}
          </select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleReplace} disabled={isPending || !selectedPersonnelId}>
            {isPending ? "Updating..." : "Save Selection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
