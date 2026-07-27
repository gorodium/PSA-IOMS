"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarEvent } from "@/lib/scheduling-actions";
import { EventContentArg } from "@fullcalendar/core";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface SchedulingCalendarProps {
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const EventTooltip = ({ 
  event, 
  requester, 
  resourceName, 
  status, 
  statusText, 
  bgColor, 
  textColor, 
  timeText 
}: any) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`p-1.5 rounded-md text-[11px] leading-tight w-full h-full ${bgColor} ${textColor} border-0 transition-all hover:brightness-110 shadow-sm flex flex-col gap-0.5`}>
          <div className="flex justify-between items-start">
            <span className="font-bold truncate">{resourceName}</span>
            {timeText && <span className="font-semibold opacity-90">{timeText}</span>}
          </div>
          <div className="truncate opacity-90">{requester}</div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" className="flex flex-col gap-1 p-3 w-64 shadow-xl z-50">
        <div className="font-semibold text-sm border-b pb-1 mb-1">{event.title}</div>
        <div className="grid grid-cols-[80px_1fr] text-xs">
          <span className="text-muted-foreground">Date:</span>
          <span>{format(event.start || new Date(), "MMM d, yyyy")}</span>
        </div>
        <div className="grid grid-cols-[80px_1fr] text-xs">
          <span className="text-muted-foreground">Time:</span>
          <span>{format(event.start || new Date(), "h:mm a")} - {event.end ? format(event.end, "h:mm a") : "N/A"}</span>
        </div>
        <div className="grid grid-cols-[80px_1fr] text-xs">
          <span className="text-muted-foreground">Reserved By:</span>
          <span className="truncate">{requester}</span>
        </div>
        <div className="grid grid-cols-[80px_1fr] text-xs mt-1">
          <span className="text-muted-foreground">Status:</span>
          <span className={`font-semibold ${status === 'APPROVED' ? 'text-emerald-500' : status === 'PENDING' ? 'text-amber-500' : 'text-slate-500'}`}>
            {statusText}
          </span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export function SchedulingCalendar({ events, onDateClick, onEventClick }: SchedulingCalendarProps) {

  const renderEventContent = (eventInfo: EventContentArg) => {
    const { event } = eventInfo;
    const status = event.extendedProps.status;
    const type = event.extendedProps.type;
    const requester = (event.extendedProps.requester as any)?.fullName || (event.extendedProps.requester as any)?.name || "Unknown";
    
    // Parse title to extract resource name (e.g. "Room: Conference" -> "Conference")
    const titleParts = event.title.split(": ");
    const resourceName = titleParts.length > 1 ? titleParts[1] : event.title;

    let bgColor = "bg-slate-500 dark:bg-slate-600";
    let textColor = "text-white";
    let statusText = "Maintenance";

    if (status === "APPROVED") {
      bgColor = "bg-emerald-600 dark:bg-emerald-700";
      statusText = "Approved";
    } else if (status === "PENDING") {
      bgColor = "bg-amber-500 dark:bg-amber-600";
      textColor = "text-amber-950 dark:text-amber-50";
      statusText = "Pending";
    } else if (status === "REJECTED") {
      bgColor = "bg-red-600 dark:bg-red-700";
      statusText = "Rejected";
    } else if (type === "SPECIAL_ORDER") {
       bgColor = "bg-purple-600 dark:bg-purple-700";
       statusText = "Special Order";
    }

    return (
      <EventTooltip 
        event={event}
        requester={requester}
        resourceName={resourceName}
        status={status}
        statusText={statusText}
        bgColor={bgColor}
        textColor={textColor}
        timeText={eventInfo.timeText}
      />
    );
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow p-4 h-full w-full fc-theme-standard">
      <style dangerouslySetInnerHTML={{__html: `
        .fc-event { border: none !important; background: transparent !important; margin-bottom: 2px !important; }
        .fc-theme-dark .fc-col-header-cell { border-color: #334155; padding: 4px 0 !important; }
        .fc-theme-dark .fc-daygrid-day { border-color: #334155; }
        .fc-theme-dark .fc-scrollgrid { border-color: #334155; }
        .fc .fc-toolbar-title { font-size: 1.25rem; font-weight: 600; }
        .fc .fc-button-primary { background-color: #0f172a; border-color: #0f172a; text-transform: capitalize; }
        .dark .fc .fc-button-primary { background-color: #334155; border-color: #334155; }
        
        /* Interactive Date Hover & Density */
        .fc-daygrid-day-frame {
          cursor: pointer;
          transition: background-color 0.2s ease;
          min-height: 90px !important; /* Reduce overall cell height */
        }
        .fc-daygrid-day-frame:hover {
          background-color: rgba(0,0,0,0.03);
        }
        .dark .fc-daygrid-day-frame:hover {
          background-color: rgba(255,255,255,0.05);
        }
        .fc-daygrid-day-top {
          flex-direction: row !important;
          padding: 4px !important;
        }
        .fc-daygrid-day-number {
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        /* Custom Occupancy Backgrounds injected via inline styles on cells */
      `}} />
      <TooltipProvider delayDuration={300}>
        <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events.map((e) => ({
          id: e.id,
          title: e.title,
          start: e.start,
          end: e.end,
          extendedProps: e,
        }))}
        eventContent={renderEventContent}
        dateClick={(arg: any) => onDateClick(arg.date)}
        eventClick={(arg: any) => onEventClick(arg.event.extendedProps as CalendarEvent)}
        height="100%"
        editable={true}
        selectable={true}
        dayMaxEvents={3} // Stack "+X More" if more than 3
        moreLinkClassNames="text-xs font-semibold text-blue-600 dark:text-blue-400 cursor-pointer hover:underline p-1"
        dayCellDidMount={(info: any) => {
          // Calculate events per day to apply occupancy shading
          const dateStr = format(info.date, "yyyy-MM-dd");
          const dayEvents = events.filter(e => 
            format(new Date(e.start), "yyyy-MM-dd") <= dateStr && 
            format(new Date(e.end), "yyyy-MM-dd") >= dateStr &&
            e.status === "APPROVED"
          );
          
          if (dayEvents.length > 2) {
            info.el.style.backgroundColor = "rgba(16, 185, 129, 0.1)"; // Light emerald for high occupancy
          } else if (dayEvents.length > 0) {
            info.el.style.backgroundColor = "rgba(16, 185, 129, 0.03)"; // Very light emerald for some occupancy
          }
        }}
        eventDrop={(info: any) => {
            console.log("Event dropped", info.event.start);
            // Implement drag and drop update logic here
        }}
        eventResize={(info: any) => {
            console.log("Event resized", info.event.end);
            // Implement resize logic here
        }}
      />
      </TooltipProvider>
    </div>
  );
}
