"use client";

import { useState, useEffect } from "react";
import { format, addDays, subDays, startOfWeek, endOfWeek, addWeeks, subWeeks, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Lock, Car, Plane, Users, Globe, Building, X, Edit2, MapPin, User, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { CalendarActivity, Personnel } from "@prisma/client";
import { getCalendarActivitiesAction, deleteCalendarActivityAction } from "@/app/(app)/calendar/actions";
import { cn } from "@/lib/utils";
import { CalendarActivityForm } from "./CalendarActivityForm";

type FilterType = "ALL" | "EVENT" | "TRAVEL" | "VEHICLE" | "HOLIDAY" | "ROOM";

type ActivityWithRelations = CalendarActivity & {
  personnel?: Personnel | null;
  involvedPersonnel?: Personnel[];
  vehicleName?: string | null;
};

export function SmartCalendar({ isAdmin = false, personnel = [] }: { isAdmin?: boolean; personnel?: Personnel[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [activities, setActivities] = useState<ActivityWithRelations[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);

  useEffect(() => {
    // Fetch activities when date/view changes
    getCalendarActivitiesAction(currentDate, view).then((res) => setActivities(res as ActivityWithRelations[]));
  }, [currentDate, view]);

  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ActivityWithRelations | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<ActivityWithRelations | null>(null);

  const handleActivityClick = (activity: CalendarActivity) => {
    setSelectedActivity(activity);
  };

  const handleEditClick = (activity: CalendarActivity) => {
    setSelectedActivity(null);
    setEditingActivity(activity);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingActivity(null);
    // Refresh activities
    getCalendarActivitiesAction(currentDate, view).then((res) => setActivities(res as ActivityWithRelations[]));
  };

  const handleDeleteActivity = (id: string) => {
    setActivityToDelete(id);
  };

  const confirmDelete = async () => {
    if (!activityToDelete) return;
    setIsDeleting(true);
    try {
      await deleteCalendarActivityAction(activityToDelete);
      setActivities(prev => prev.filter(a => a.id !== activityToDelete));
      setSelectedActivity(null);
      setActivityToDelete(null);
    } catch {
      alert("Failed to delete activity.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredActivities = activities.filter(a => filter === "ALL" || a.type === filter);

  // Group activities by date
  const getActivitiesForDay = (day: Date) => {
    return filteredActivities.filter(a => isSameDay(new Date(a.startDate), day));
  };

  const handlePrev = () => {
    if (view === "day") setCurrentDate(subDays(currentDate, 1));
    else if (view === "week") setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subMonths(currentDate, 1));
  };
  
  const handleNext = () => {
    if (view === "day") setCurrentDate(addDays(currentDate, 1));
    else if (view === "week") setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addMonths(currentDate, 1));
  };
  
  const handleToday = () => setCurrentDate(new Date());

  const getIconForActivity = (type: string) => {
    switch (type) {
      case "EVENT": return <Users className="h-[14px] w-[14px]" />;
      case "TRAVEL": return <Plane className="h-[14px] w-[14px]" />;
      case "VEHICLE": return <Car className="h-[14px] w-[14px]" />;
      case "HOLIDAY": return <Globe className="h-[14px] w-[14px]" />;
      case "ROOM": return <Building className="h-[14px] w-[14px]" />;
      default: return <Lock className="h-[14px] w-[14px]" />;
    }
  };

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

  // Mocking current time for the UI element
  const [currentTime, setCurrentTime] = useState("");
  useEffect(() => {
    const updateTime = () => setCurrentTime(format(new Date(), "h:mm a"));
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const renderDayView = () => {
    const dayActivities = getActivitiesForDay(currentDate);

    return (
      <div className="flex-1 overflow-auto p-6">
        <div className="rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden bg-white dark:bg-[#1C212E]">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-[#1C2130] text-xs uppercase text-slate-500 border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Activity Title</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium w-1/2">Description</th>
                <th className="px-6 py-4 font-medium">Location / Vehicle</th>
              </tr>
            </thead>
            <tbody>
              {dayActivities.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">No activities scheduled for this day.</td>
                </tr>
              ) : dayActivities.map(activity => (
                <tr 
                  key={activity.id} 
                  onClick={() => handleActivityClick(activity)}
                  className={cn(
                    "border-b border-slate-200 dark:border-white/5 transition-colors group",
                    isAdmin ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-[#222838]" : ""
                  )}
                >
                  <td className="px-6 py-5 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4 text-slate-600 dark:text-white" />
                    </div>
                    {activity.title}
                  </td>
                  <td className="px-6 py-5">
                    <div className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold tracking-wide bg-slate-100 dark:bg-white/5", getColorClassForActivity(activity.type))}>
                      {getIconForActivity(activity.type)}
                      {activity.type === "EVENT" ? "Work Event" : activity.type === "TRAVEL" ? "Travel" : activity.type === "HOLIDAY" ? "Holiday" : activity.type === "ROOM" ? "Room" : "Vehicle"}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-600 dark:text-slate-400">
                    {activity.type === "TRAVEL" && activity.personnel?.fullName ? (
                      <div className="flex flex-col items-start gap-1">
                        <span className="inline-block px-1.5 py-0.5 rounded text-[11.5px] font-semibold bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          {activity.personnel.fullName}
                        </span>
                      </div>
                    ) : (
                      activity.description || "—"
                    )}
                  </td>
                  <td className="px-6 py-5 text-slate-500">
                    {activity.location || activity.vehicleName || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

    return (
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <div className="grid grid-cols-7 gap-4 min-w-[1000px] h-full">
          {weekDays.map((day, index) => {
            const dayActivities = getActivitiesForDay(day);
            const isToday = isSameDay(day, new Date());

            return (
              <div key={index} className="flex flex-col h-full space-y-4">
                <div className="text-center pb-3">
                  <span className={cn("text-[13px] font-semibold uppercase tracking-wider text-slate-500 block mb-0.5", isToday && "text-slate-900 dark:text-slate-300")}>
                    {format(day, "EEE")}
                  </span>
                  <span className={cn("text-xl font-bold text-slate-600 dark:text-slate-300", isToday && "text-slate-900 dark:text-white")}>
                    {format(day, "d")}
                  </span>
                </div>
                
                <div className="flex-1 space-y-3 overflow-y-auto pr-1 pb-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent">
                  {dayActivities.map(activity => (
                    <div 
                      key={activity.id} 
                      onClick={() => handleActivityClick(activity)}
                      className={cn(
                        "bg-slate-50 dark:bg-[#1C212E] rounded-xl p-[14px] border border-slate-200 dark:border-white/5 transition-colors group",
                        isAdmin ? "cursor-pointer hover:bg-slate-100 dark:hover:bg-[#222838]" : ""
                      )}
                    >
                      <div className={cn("flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider mb-2", getColorClassForActivity(activity.type))}>
                        {getIconForActivity(activity.type)}
                        <span>{activity.type === "EVENT" ? "Work Event" : activity.type === "TRAVEL" ? "Travel Schedule" : activity.type === "HOLIDAY" ? "Holiday" : activity.type === "ROOM" ? "Room Reservation" : "Vehicle Usage"}</span>
                      </div>

                      <div className="mb-2">
                        <span className="font-semibold text-slate-900 dark:text-white text-[13px] leading-snug block">{activity.title}</span>
                      </div>
                      
                      {activity.type === "TRAVEL" && activity.personnel?.fullName && (
                        <div className="mb-1.5">
                          <span className="inline-block px-1.5 py-0.5 rounded text-[11.5px] font-semibold bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                            {activity.personnel.fullName}
                          </span>
                        </div>
                      )}
                      {activity.type !== "TRAVEL" && activity.description && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-[1.5] mb-3 line-clamp-2">
                          {activity.description}
                        </p>
                      )}
                      
                      {activity.location && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <span className="w-full truncate">{activity.location}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const monthDays = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="flex-1 flex flex-col p-6 min-h-0 overflow-hidden">
        <div className="grid grid-cols-7 mb-3">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="text-center text-xs font-semibold uppercase text-slate-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="flex-1 grid grid-cols-7 grid-rows-5 md:grid-rows-auto gap-px bg-slate-200 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden min-h-0">
          {monthDays.map((day, index) => {
            const dayActivities = getActivitiesForDay(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            return (
              <div 
                key={index} 
                className={cn(
                  "bg-white dark:bg-[#0F121A] p-2 flex flex-col overflow-hidden hover:bg-slate-50 dark:hover:bg-[#151923] transition-colors cursor-pointer",
                  !isCurrentMonth && "opacity-40"
                )}
                onClick={() => {
                  setCurrentDate(day);
                  setView("day");
                }}
              >
                <div className="flex justify-end mb-1">
                  <span className={cn(
                    "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full",
                    isToday ? "bg-primary text-primary-foreground" : "text-slate-700 dark:text-slate-300"
                  )}>
                    {format(day, "d")}
                  </span>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-1 scrollbar-none">
                  {dayActivities.map(activity => (
                    <div 
                      key={activity.id} 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActivityClick(activity);
                      }}
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/5 truncate dark:bg-white/5 bg-slate-100 font-medium",
                        isAdmin ? "cursor-pointer hover:opacity-80" : ""
                      )}
                    >
                      <span className={cn(getColorClassForActivity(activity.type), "mr-1")}>•</span>
                      <span className="text-slate-700 dark:text-slate-300">{activity.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const displayDateRange = () => {
    if (view === "day") return format(currentDate, "EEEE, MMMM d, yyyy");
    if (view === "week") {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
      return `${format(weekStart, "MMM d")} - ${format(addDays(weekStart, 6), "MMM d, yyyy")}`;
    }
    return format(currentDate, "MMMM yyyy");
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-[#0F121A] text-slate-900 dark:text-slate-200 overflow-hidden shadow-sm dark:shadow-none border border-slate-200 dark:border-transparent rounded-xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between p-6 border-b border-slate-200 dark:border-white/5 gap-4">
        <div className="flex items-center gap-6">
          <h1 className="text-[28px] font-semibold tracking-tight text-slate-900 dark:text-white">Calendar of Activities</h1>
          
          <div className="hidden lg:flex items-center gap-2">
            <Select 
              value={filter} 
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter(e.target.value as FilterType)}
              className="w-[160px] bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white h-9 rounded-lg text-sm font-medium focus:ring-0 focus:ring-offset-0 px-2"
            >
              <option value="ALL" className="bg-white dark:bg-[#1C2130] text-slate-900 dark:text-white">All Activities</option>
              <option value="EVENT" className="bg-white dark:bg-[#1C2130] text-slate-900 dark:text-white">Work Events</option>
              <option value="HOLIDAY" className="bg-white dark:bg-[#1C2130] text-slate-900 dark:text-white">Holidays</option>
              <option value="TRAVEL" className="bg-white dark:bg-[#1C2130] text-slate-900 dark:text-white">Travel</option>
              <option value="VEHICLE" className="bg-white dark:bg-[#1C2130] text-slate-900 dark:text-white">Vehicle</option>
              <option value="ROOM" className="bg-white dark:bg-[#1C2130] text-slate-900 dark:text-white">Room Reservation</option>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-base font-semibold text-slate-700 dark:text-slate-200 mr-2">
            {displayDateRange()}
          </span>
          
          <Select 
            value={view} 
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setView(e.target.value as "day" | "week" | "month")}
            className="w-[90px] bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white h-9 rounded-lg text-sm font-medium focus:ring-0 focus:ring-offset-0 px-2"
          >
            <option value="day" className="bg-white dark:bg-[#1C2130] text-slate-900 dark:text-white">Day</option>
            <option value="week" className="bg-white dark:bg-[#1C2130] text-slate-900 dark:text-white">Week</option>
            <option value="month" className="bg-white dark:bg-[#1C2130] text-slate-900 dark:text-white">Month</option>
          </Select>

          {isAdmin && (
            <Button onClick={() => setShowForm(true)} className="h-9 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium px-4 ml-2">
              Add Activity
            </Button>
          )}

          <Button variant="outline" size="sm" onClick={handleToday} className="h-9 bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white rounded-lg text-sm font-medium px-4">
            Today
          </Button>

          <div className="flex items-center rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5">
            <Button variant="ghost" size="icon" onClick={handlePrev} className="h-9 w-9 rounded-r-none hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white rounded-l-lg border-r border-slate-200 dark:border-white/10">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNext} className="h-9 w-9 rounded-l-none hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white rounded-r-lg">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button variant="outline" size="icon" className="h-9 w-9 bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white rounded-lg">
            <CalendarIcon className="h-4 w-4" />
          </Button>
          
          <div className="hidden sm:flex items-center gap-2 h-9 px-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-[13px] font-medium text-slate-900 dark:text-white ml-2 whitespace-nowrap">
            <Clock className="h-[14px] w-[14px]" />
            {currentTime}
          </div>
        </div>
      </div>

      {/* Render Current View */}
      {view === "day" && renderDayView()}
      {view === "week" && renderWeekView()}
      {view === "month" && renderMonthView()}

      {/* Modal for adding/editing activity */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <CalendarActivityForm 
            activity={editingActivity ?? undefined} 
            personnel={personnel} 
            onClose={closeForm} 
            onSuccess={closeForm} 
          />
        </div>
      )}

      {/* Modal for viewing activity details */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1C2130] p-6 rounded-xl shadow-xl max-w-md w-full relative">
            <Button variant="ghost" size="icon" onClick={() => setSelectedActivity(null)} className="absolute right-4 top-4 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full">
              <X className="h-5 w-5" />
            </Button>
            
            <div className="flex items-start justify-between gap-4 mb-5 pr-8">
              <div>
                <div className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider mb-2", getColorClassForActivity(selectedActivity.type), "bg-slate-100 dark:bg-white/5")}>
                  {getIconForActivity(selectedActivity.type)}
                  <span>{selectedActivity.type === "EVENT" ? "Work Event" : selectedActivity.type === "TRAVEL" ? "Travel Schedule" : selectedActivity.type === "HOLIDAY" ? "Holiday" : selectedActivity.type === "ROOM" ? "Room Reservation" : "Vehicle Usage"}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                  {selectedActivity.title}
                </h2>
                <div className="flex flex-col gap-2 mt-2">
                  {selectedActivity.soNumber && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md text-slate-700 dark:text-slate-300 text-[12px] font-medium w-fit">
                      <FileText className="w-3.5 h-3.5" />
                      SO No: {selectedActivity.soNumber}
                    </div>
                  )}
                  {selectedActivity.soFileUrl && (
                    <a href={selectedActivity.soFileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md text-blue-700 dark:text-blue-300 text-[12px] font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors w-fit">
                      <FileText className="w-3.5 h-3.5" />
                      View SO Document
                    </a>
                  )}
                </div>
              </div>
              
              {isAdmin && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(selectedActivity)} className="h-6 px-2 gap-1 text-[11px] bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteActivity(selectedActivity.id)} disabled={isDeleting} className="h-6 px-2 gap-1 text-[11px] bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/30 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400">
                    <Trash2 className="w-3 h-3" />
                    {isDeleting ? "..." : "Delete"}
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex gap-3 text-sm">
                <CalendarIcon className="w-5 h-5 text-slate-400 shrink-0" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-200">Date</p>
                  <p className="text-slate-600 dark:text-slate-400">
                    {format(new Date(selectedActivity.startDate), "MMM d, yyyy")}
                    {selectedActivity.endDate && !isSameDay(new Date(selectedActivity.startDate), new Date(selectedActivity.endDate)) && ` - ${format(new Date(selectedActivity.endDate), "MMM d, yyyy")}`}
                  </p>
                </div>
              </div>

              {selectedActivity.location && (
                <div className="flex gap-3 text-sm">
                  <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-200">Location</p>
                    <p className="text-slate-600 dark:text-slate-400">{selectedActivity.location}</p>
                  </div>
                </div>
              )}

              {selectedActivity.personnel?.fullName && (
                <div className="flex gap-3 text-sm">
                  <User className="w-5 h-5 text-slate-400 shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-200">Employee(s)</p>
                    <p className="text-slate-600 dark:text-slate-400">{selectedActivity.personnel.fullName}</p>
                  </div>
                </div>
              )}

              {selectedActivity.involvedPersonnel && selectedActivity.involvedPersonnel.length > 0 && (
                <div className="flex gap-3 text-sm">
                  <Users className="w-5 h-5 text-slate-400 shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-200">Involved Employee(s)</p>
                    <ul className="text-slate-600 dark:text-slate-400 list-disc list-inside mt-1">
                      {selectedActivity.involvedPersonnel.map((p) => (
                        <li key={p.id}>{p.fullName}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activityToDelete && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1C2130] rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Activity</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Are you sure you want to delete this activity? This action cannot be undone.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-white/5">
              <Button 
                variant="outline" 
                onClick={() => setActivityToDelete(null)}
                disabled={isDeleting}
                className="bg-white dark:bg-transparent border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
