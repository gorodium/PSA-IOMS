"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const SchedulingCalendar = dynamic(() => import("./SchedulingCalendar").then((mod) => mod.SchedulingCalendar), {
  ssr: false,
});
import { getSchedulingData, CalendarEvent, quickApproveEvent } from "@/lib/scheduling-actions";
import { QuickReserveDialog, ResourceOption } from "./QuickReserveDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { format } from "date-fns";

export function SchedulingClient({ 
  userId,
  defaultType = "ROOM",
  isAdmin = false,
  resources = [],
  employees = []
}: { 
  userId: string;
  defaultType?: "ROOM" | "VEHICLE";
  isAdmin?: boolean;
  resources?: ResourceOption[];
  employees?: { id: string, name: string, position?: string }[];
}) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [eventToApprove, setEventToApprove] = useState<CalendarEvent | null>(null);
  const [eventToView, setEventToView] = useState<CalendarEvent | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const res = await getSchedulingData();
    if (res.success && res.data) {
      // Only show the relevant type for the current page; exclude special orders
      const filtered = res.data.filter((e) => {
        if (e.type === "SPECIAL_ORDER") return false;
        if (defaultType === "ROOM") return e.type === "ROOM";
        if (defaultType === "VEHICLE") return e.type === "VEHICLE";
        return true;
      });
      setEvents(filtered);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Suppress unused userId warning — kept for future personalized features
  void userId;

  return (
    <div className="relative rounded-xl border bg-background shadow-sm overflow-hidden h-full w-full">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground font-medium">Loading schedule...</p>
          </div>
        </div>
      )}
      <SchedulingCalendar 
        events={events} 
        onDateClick={(date: Date) => {
          setSelectedDate(date);
          setDialogOpen(true);
        }}
        onEventClick={async (event: CalendarEvent) => {
          if (isAdmin && event.status === "PENDING" && (event.type === "ROOM" || event.type === "VEHICLE")) {
            setEventToApprove(event);
          } else {
            setEventToView(event);
          }
        }}
      />

      {dialogOpen && (
        <QuickReserveDialog 
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={fetchData}
          initialDate={selectedDate}
          userId={userId}
          isAdmin={isAdmin}
          defaultType={defaultType}
          resources={resources}
          employees={employees}
        />
      )}

      <AlertDialog open={!!eventToApprove} onOpenChange={(open) => !open && setEventToApprove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to instantly approve this {eventToApprove?.type === "ROOM" ? "room reservation" : "vehicle request"}?
              This will bypass the standard review queue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isApproving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isApproving}
              onClick={async (e) => {
                e.preventDefault();
                if (!eventToApprove) return;
                setIsApproving(true);
                const res = await quickApproveEvent(eventToApprove.type as "ROOM" | "VEHICLE", eventToApprove.id);
                if (res.success) {
                  await fetchData();
                  setEventToApprove(null);
                } else {
                  alert("Failed to approve request: " + res.error);
                }
                setIsApproving(false);
              }}
            >
              {isApproving ? "Approving..." : "Approve Instantly"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet open={!!eventToView} onOpenChange={(open) => !open && setEventToView(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>Reservation Details</SheetTitle>
          </SheetHeader>
          {eventToView && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-3 text-sm">
                <span className="font-semibold text-muted-foreground">Type:</span>
                <span className="col-span-2 font-medium">
                  {eventToView.type === "ROOM" ? "Room Reservation" : eventToView.type === "VEHICLE" ? "Vehicle Request" : "Special Order"}
                </span>
              </div>
              
              <div className="grid grid-cols-3 text-sm">
                <span className="font-semibold text-muted-foreground">Status:</span>
                <span className="col-span-2 font-medium capitalize">{eventToView.status.toLowerCase()}</span>
              </div>

              <div className="grid grid-cols-3 text-sm">
                <span className="font-semibold text-muted-foreground">Resource:</span>
                <span className="col-span-2">
                  {eventToView.type === "ROOM" 
                    ? (eventToView.extendedProps.room as any)?.name 
                    : (eventToView.extendedProps.assignedVehicle as any)?.plateNumber || (eventToView.extendedProps.assignedVehicle as any)?.name || "N/A"}
                </span>
              </div>

              <div className="grid grid-cols-3 text-sm">
                <span className="font-semibold text-muted-foreground">Time:</span>
                <span className="col-span-2">
                  {format(new Date(eventToView.start), "MMM d, yyyy h:mm a")} 
                  {" - "}
                  {format(new Date(eventToView.end), "MMM d, yyyy h:mm a")}
                </span>
              </div>

              {(eventToView.extendedProps.purpose as string) && (
                <div className="grid grid-cols-3 text-sm">
                  <span className="font-semibold text-muted-foreground">Purpose:</span>
                  <span className="col-span-2">{eventToView.extendedProps.purpose as string}</span>
                </div>
              )}
              
              {(eventToView.extendedProps.destination as string) && (
                <div className="grid grid-cols-3 text-sm">
                  <span className="font-semibold text-muted-foreground">Destination:</span>
                  <span className="col-span-2">{eventToView.extendedProps.destination as string}</span>
                </div>
              )}

              <div className="grid grid-cols-3 text-sm">
                <span className="font-semibold text-muted-foreground">Requester:</span>
                <span className="col-span-2">{(eventToView.extendedProps.requester as any)?.fullName || (eventToView.extendedProps.requester as any)?.name || "Unknown"}</span>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
