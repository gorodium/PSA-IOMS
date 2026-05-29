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
import { softDeletePersonnelAction, hardDeletePersonnelAction } from "@/app/(app)/personnel/actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function PersonnelDeleteButtons({
  personnelId,
  isSuperAdmin,
  isActive
}: {
  personnelId: string;
  isSuperAdmin: boolean;
  isActive: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [openSoft, setOpenSoft] = useState(false);
  const [openHard, setOpenHard] = useState(false);
  
  const [reason, setReason] = useState("Resigned");
  const [date, setDate] = useState("");

  const handleArchive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || !date) return;
    
    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", personnelId);
      formData.append("archiveReason", reason);
      formData.append("archiveDate", date);
      
      await softDeletePersonnelAction(formData);
      setOpenSoft(false);
    });
  };

  return (
    <div className="flex items-center gap-2 mt-4 pt-4 border-t">
      {isActive && (
        <AlertDialog open={openSoft} onOpenChange={setOpenSoft}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" type="button" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
              <Archive className="mr-2 h-4 w-4" />
              Archive Employee
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <form onSubmit={handleArchive}>
              <AlertDialogHeader>
                <AlertDialogTitle>Archive Employee?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will mark the employee as inactive. Please provide the reason and date before archiving.
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="grid gap-4 py-4 text-left">
                <div className="space-y-2">
                  <Label htmlFor="archiveReason">Reason for Archiving</Label>
                  <select 
                    id="archiveReason" 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="Resigned">Resigned</option>
                    <option value="Terminated">Terminated</option>
                    <option value="Retired">Retired</option>
                    <option value="Contract Ended">Contract Ended</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="archiveDate">Date {reason}</Label>
                  <Input 
                    id="archiveDate" 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel type="button" disabled={isPending}>Cancel</AlertDialogCancel>
                <Button
                  type="submit"
                  disabled={isPending || !reason || !date}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {isPending ? "Archiving..." : "Archive Employee"}
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {isSuperAdmin && (
        <AlertDialog open={openHard} onOpenChange={setOpenHard}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" type="button">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Permanently
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Permanently Delete Employee?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the employee record and remove all of their project assignments and data.
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
                    await hardDeletePersonnelAction(personnelId);
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
