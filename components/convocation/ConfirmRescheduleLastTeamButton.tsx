"use client";

import { useRef } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function ConfirmRescheduleLastTeamButton() {
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={submitButtonRef}
        type="submit"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button type="button" variant="outline">
            Reschedule Last Team
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reschedule Last Team?</AlertDialogTitle>
            <AlertDialogDescription>
              This will take the most recent convocation program and move it to the upcoming Monday. If it's on the calendar, the event will also be shifted. Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                submitButtonRef.current?.click();
              }}
            >
              Reschedule
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
