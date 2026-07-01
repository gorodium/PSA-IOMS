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

export function ConfirmReplaceButton() {
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
          <Button type="button" size="sm" variant="outline" className="h-7 px-2 text-xs">
            Auto
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace this assignee?</AlertDialogTitle>
            <AlertDialogDescription>
              The system will choose another eligible member from the same group. The current
              assignee will return to the rotation pool, and the replacement will count for this
              program flow item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                submitButtonRef.current?.click();
              }}
            >
              Replace assignee
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
