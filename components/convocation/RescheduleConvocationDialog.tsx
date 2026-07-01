"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { rescheduleConvocationProgramAction } from "@/app/(app)/convocation/actions";

export function RescheduleConvocationDialog({
  programId,
  currentDate,
}: {
  programId: string;
  currentDate: Date;
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>();
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleReschedule() {
    if (!date) return;
    
    setIsPending(true);
    setErrorMsg(null);
    try {
      const dateString = format(date, "yyyy-MM-dd");
      const formData = new FormData();
      formData.append("newDate", dateString);
      
      await rescheduleConvocationProgramAction(programId, formData);
      setOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to reschedule program.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Reschedule</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reschedule Program</DialogTitle>
          <DialogDescription>
            Move this convocation program to a specific new date.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a new date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
              />
            </PopoverContent>
          </Popover>
          {errorMsg && (
            <p className="text-sm font-medium text-red-500">
              {errorMsg}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReschedule}
            disabled={!date || isPending}
          >
            {isPending ? "Rescheduling..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
