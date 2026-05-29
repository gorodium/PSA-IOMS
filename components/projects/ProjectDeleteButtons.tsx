"use client";

import { useState, useTransition } from "react";
import { Trash2, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { softDeleteProjectAction, hardDeleteProjectAction } from "@/app/(app)/projects/actions";

export function ProjectDeleteButtons({
  projectId,
  isSuperAdmin,
  isActive
}: {
  projectId: string;
  isSuperAdmin: boolean;
  isActive: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [openSoft, setOpenSoft] = useState(false);
  const [openHard, setOpenHard] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {isActive && (
        <AlertDialog open={openSoft} onOpenChange={setOpenSoft}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" type="button" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
              <Archive className="mr-2 h-4 w-4" />
              Archive Project
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Archive Project?</AlertDialogTitle>
              <AlertDialogDescription>
                This will mark the project as inactive. It will no longer appear in the dashboard or active project lists, but all data will be preserved.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isPending}
                className="bg-orange-600 hover:bg-orange-700"
                onClick={(e) => {
                  e.preventDefault();
                  startTransition(async () => {
                    await softDeleteProjectAction(projectId);
                    setOpenSoft(false);
                  });
                }}
              >
                {isPending ? "Archiving..." : "Archive Project"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {isSuperAdmin && (
        <AlertDialog open={openHard} onOpenChange={setOpenHard}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" type="button" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Project
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Permanently Delete Project?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the project and all of its associated cycles, tasks, remarks, and assignments.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isPending}
                className="bg-destructive hover:bg-destructive/90"
                onClick={(e) => {
                  e.preventDefault();
                  startTransition(async () => {
                    await hardDeleteProjectAction(projectId);
                    setOpenHard(false);
                  });
                }}
              >
                {isPending ? "Deleting..." : "Delete Permanently"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
