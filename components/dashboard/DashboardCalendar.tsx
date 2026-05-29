"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { format, isSameDay } from "date-fns";
import { getCalendarActivitiesAction } from "@/app/(app)/calendar/actions";
import type { CalendarActivity } from "@prisma/client";

export function DashboardCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState("");
  const [activities, setActivities] = useState<CalendarActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<CalendarActivity | null>(null);

  useEffect(() => {
    getCalendarActivitiesAction(month, "month").then(setActivities);
  }, [month]);

  const handleDayClick = (day: Date) => {
    setDate(day);
    setSelectedDateStr(format(day, "MMMM d, yyyy"));
    setIsDialogOpen(true);
  };

  const selectedDateActivities = activities.filter(a => date && isSameDay(new Date(a.startDate), date));
  const events = selectedDateActivities.filter(a => a.type === "EVENT");
  const holidays = selectedDateActivities.filter(a => a.type === "HOLIDAY");
  const travels = selectedDateActivities.filter(a => a.type === "TRAVEL");
  const vehicles = selectedDateActivities.filter(a => a.type === "VEHICLE");
  const rooms = selectedDateActivities.filter(a => a.type === "ROOM");

  const hasActivityDates = activities.map(a => new Date(a.startDate));

  const getColorClassForActivity = (type: string) => {
    switch (type) {
      case "EVENT": return "text-rose-500 dark:text-rose-400";
      case "TRAVEL": return "text-blue-500 dark:text-blue-400";
      case "VEHICLE": return "text-emerald-500 dark:text-green-400";
      case "HOLIDAY": return "text-violet-500 dark:text-violet-400";
      case "ROOM": return "text-amber-500 dark:text-amber-400";
      default: return "text-rose-500 dark:text-rose-400";
    }
  };

  const getBorderClassForActivity = (type: string) => {
    switch (type) {
      case "EVENT": return "border-l-rose-500 dark:border-l-rose-400";
      case "TRAVEL": return "border-l-blue-500 dark:border-l-blue-400";
      case "VEHICLE": return "border-l-emerald-500 dark:border-l-green-400";
      case "HOLIDAY": return "border-l-violet-500 dark:border-l-violet-400";
      case "ROOM": return "border-l-amber-500 dark:border-l-amber-400";
      default: return "border-l-rose-500 dark:border-l-rose-400";
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  nextWeek.setHours(23, 59, 59, 999);

  const upcomingActivities = activities
    .filter(a => {
      const d = new Date(a.startDate);
      return d >= today && d <= nextWeek;
    })
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return (
    <div className="w-full flex flex-col h-full min-h-0">
      <div className="w-full flex justify-center shrink-0">
        <Calendar
          mode="single"
          selected={date}
          month={month}
          onMonthChange={setMonth}
          onDayClick={(day: Date) => {
            handleDayClick(day);
          }}
          modifiers={{
            hasActivity: hasActivityDates,
          }}
          modifiersClassNames={{
            hasActivity: "font-bold underline decoration-primary underline-offset-4",
          }}
          className="rounded-md border dark:border-white/10 shadow-sm bg-white dark:bg-[#1C212E] w-full flex justify-center [&_.rdp-day]:w-9 [&_.rdp-day]:h-9 [&_.rdp-cell]:p-0"
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {/* ... */}
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedules for {selectedDateStr}</DialogTitle>
            <DialogDescription>
              Upcoming events, employee travel, and vehicle usage.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Work Events</h4>
              {events.length > 0 ? (
                events.map(a => (
                  <div 
                    key={a.id} 
                    onClick={() => setSelectedActivity(a)}
                    className={`text-sm p-3 border rounded-md bg-muted/20 border-l-4 cursor-pointer hover:bg-accent transition-colors ${getBorderClassForActivity(a.type)}`}
                  >
                    <div className={`font-semibold ${getColorClassForActivity(a.type)}`}>{a.title}</div>
                    <div className="text-muted-foreground mt-1 line-clamp-2">{a.description}</div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/50">
                  No work events scheduled for this date.
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Holidays</h4>
              {holidays.length > 0 ? (
                holidays.map(a => (
                  <div 
                    key={a.id} 
                    onClick={() => setSelectedActivity(a)}
                    className={`text-sm p-3 border rounded-md bg-muted/20 border-l-4 cursor-pointer hover:bg-accent transition-colors ${getBorderClassForActivity(a.type)}`}
                  >
                    <div className={`font-semibold ${getColorClassForActivity(a.type)}`}>{a.title}</div>
                    <div className="text-muted-foreground mt-1 line-clamp-2">{a.description}</div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/50">
                  No holidays on this date.
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Employee Travel</h4>
              {travels.length > 0 ? (
                travels.map(a => (
                  <div 
                    key={a.id} 
                    onClick={() => setSelectedActivity(a)}
                    className={`text-sm p-3 border rounded-md bg-muted/20 border-l-4 cursor-pointer hover:bg-accent transition-colors ${getBorderClassForActivity(a.type)}`}
                  >
                    <div className={`font-semibold ${getColorClassForActivity(a.type)}`}>{a.title}</div>
                    <div className="text-muted-foreground mt-1 line-clamp-2">{a.description}</div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/50">
                  No employee travel scheduled.
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Vehicle Usage</h4>
              {vehicles.length > 0 ? (
                vehicles.map(a => (
                  <div 
                    key={a.id} 
                    onClick={() => setSelectedActivity(a)}
                    className={`text-sm p-3 border rounded-md bg-muted/20 border-l-4 cursor-pointer hover:bg-accent transition-colors ${getBorderClassForActivity(a.type)}`}
                  >
                    <div className={`font-semibold ${getColorClassForActivity(a.type)}`}>{a.title}</div>
                    <div className="text-muted-foreground mt-1 line-clamp-2">{a.description}</div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/50">
                  No vehicles reserved for this date.
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Room Reservations</h4>
              {rooms.length > 0 ? (
                rooms.map(a => (
                  <div 
                    key={a.id} 
                    onClick={() => setSelectedActivity(a)}
                    className={`text-sm p-3 border rounded-md bg-muted/20 border-l-4 cursor-pointer hover:bg-accent transition-colors ${getBorderClassForActivity(a.type)}`}
                  >
                    <div className={`font-semibold ${getColorClassForActivity(a.type)}`}>{a.title}</div>
                    <div className="text-muted-foreground mt-1 line-clamp-2">{a.description}</div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/50">
                  No room reservations for this date.
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="w-full flex flex-col mt-6 flex-1 min-h-0">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-4 shrink-0">Upcoming</h3>
        
        {upcomingActivities.length > 0 ? (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
            {upcomingActivities.map(a => {
              const typeName = a.type === "EVENT" ? "Work Event" : a.type === "TRAVEL" ? "Travel Schedule" : a.type === "HOLIDAY" ? "Holiday" : a.type === "ROOM" ? "Room Reservation" : "Vehicle Usage";
              return (
                <div 
                  key={a.id} 
                  onClick={() => setSelectedActivity(a)}
                  className={`p-3 border dark:border-white/10 rounded-lg bg-white dark:bg-[#1C212E] shadow-sm border-l-4 cursor-pointer hover:shadow-md hover:bg-slate-50 dark:hover:bg-white/5 transition-all ${getBorderClassForActivity(a.type)}`}
                >
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <div className="font-bold text-sm text-foreground tracking-tight line-clamp-1">{a.title}</div>
                    <div className="text-[10px] text-muted-foreground font-medium shrink-0 bg-muted/50 px-1.5 py-0.5 rounded-sm">
                      {format(new Date(a.startDate), "MMM d")}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-1 mb-2">{a.description}</div>
                  <div className={`text-[10px] font-bold uppercase tracking-widest ${getColorClassForActivity(a.type)}`}>
                    {typeName}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border dark:border-white/10 bg-white dark:bg-[#1C212E] shadow-sm p-4 text-sm text-muted-foreground text-center">
            No upcoming schedules in the next 7 days.
          </div>
        )}
      </div>

      <Dialog open={!!selectedActivity} onOpenChange={(open) => !open && setSelectedActivity(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="pr-4 leading-relaxed">{selectedActivity?.title}</DialogTitle>
          </DialogHeader>
          {selectedActivity && (
            <div className="space-y-4 py-2">
              <div className="flex flex-col gap-1.5">
                <span className={`text-[11px] font-bold uppercase tracking-widest ${getColorClassForActivity(selectedActivity.type)}`}>
                  {selectedActivity.type === "EVENT" ? "Work Event" : selectedActivity.type === "TRAVEL" ? "Travel Schedule" : selectedActivity.type === "HOLIDAY" ? "Holiday" : selectedActivity.type === "ROOM" ? "Room Reservation" : "Vehicle Usage"}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  {isSameDay(new Date(selectedActivity.startDate), new Date(selectedActivity.endDate || selectedActivity.startDate))
                    ? `${format(new Date(selectedActivity.startDate), "MMMM d, yyyy")} • ${format(new Date(selectedActivity.startDate), "h:mm a")} - ${format(new Date(selectedActivity.endDate || selectedActivity.startDate), "h:mm a")}`
                    : `${format(new Date(selectedActivity.startDate), "MMM d, yyyy h:mm a")} - ${format(new Date(selectedActivity.endDate || selectedActivity.startDate), "MMM d, yyyy h:mm a")}`
                  }
                </span>
              </div>
              
              {selectedActivity.description && (
                <div className="text-sm border-t pt-4 mt-4 whitespace-pre-wrap leading-relaxed text-muted-foreground">
                  {selectedActivity.description}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
