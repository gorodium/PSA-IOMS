"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { format, isSameMonth, isSameYear, subMonths, addMonths, subQuarters, addQuarters, getQuarter, getYear } from "date-fns";
import type { MonitoringProject } from "@/lib/project-metrics";
import { calculateTaskStatus } from "@/lib/status";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  project: MonitoringProject;
  isSuperAdmin: boolean;
  filter?: "ALL" | "DUE_TODAY" | "DUE_SOON" | "OVERDUE";
}

type ActivityItem = {
  id: string;
  taskName?: string;
  cycleName: string;
  deadline?: Date | string | null;
  dateSubmitted?: Date | string | null;
  totalSamplesDocuments?: number | null;
  responseRate?: number | null;
  remarks?: string | null;
  status: string;
  inMonth: boolean;
  type: "CYCLE" | "TASK";
};

export function ProjectSummaryCard({ project, filter = "ALL" }: Props) {
  const [selectedPeriod, setSelectedPeriod] = useState(new Date());
  const today = useMemo(() => new Date(), []);
  
  // Extract Focal Persons
  const fp = project.personnel.find(p => p.isFocalPerson)?.personnel.fullName 
    ?? project.personnel.find(p => p.roleInProject?.toLowerCase().includes("focal") && !p.roleInProject?.toLowerCase().includes("alternate") && !p.roleInProject?.toLowerCase().includes("assistant"))?.personnel.fullName 
    ?? "Not Assigned";
  const afp = project.personnel.find(p => p.roleInProject?.toLowerCase().includes("alternate"))?.personnel.fullName ?? "None";
  const asfp = project.personnel.find(p => p.roleInProject?.toLowerCase().includes("assistant"))?.personnel.fullName;

  // Filter Activities by Selected Period
  const activities = useMemo(() => {
    const items: ActivityItem[] = [];
    
    project.cycles.forEach(cycle => {
       let cycleMatch = false;
       if (project.frequency === "QUARTERLY") {
         const q = getQuarter(selectedPeriod);
         const y = getYear(selectedPeriod);
         cycleMatch = cycle.cycleName.toLowerCase() === `quarter ${q} ${y}`.toLowerCase() ||
                      cycle.cycleName.toLowerCase() === `quarter ${q}`.toLowerCase() ||
                      cycle.cycleName.toLowerCase() === `q${q} ${y}`.toLowerCase() ||
                      cycle.cycleName.toLowerCase() === `q${q}`.toLowerCase();
       } else {
         cycleMatch = cycle.cycleName.toLowerCase() === format(selectedPeriod, "MMMM yyyy").toLowerCase() ||
                      cycle.cycleName.toLowerCase() === format(selectedPeriod, "MMMM").toLowerCase();
       }

       if (cycle.tasks.length === 0) {
          const st = calculateTaskStatus(cycle, today);
          const inMonth = cycle.deadline ? (isSameMonth(new Date(cycle.deadline), selectedPeriod) && isSameYear(new Date(cycle.deadline), selectedPeriod)) : cycleMatch;
          
          let shouldShow = false;
          if (filter === "ALL") {
             const isUpcoming = st === "DUE_SOON" || st === "DUE_TODAY";
             shouldShow = inMonth || isUpcoming;
          } else {
             shouldShow = st === filter;
          }

          if (shouldShow) {
             items.push({
               id: cycle.id,
               cycleName: cycle.cycleName,
               deadline: cycle.deadline,
               dateSubmitted: cycle.dateSubmitted,
               totalSamplesDocuments: cycle.totalSamplesDocuments,
               responseRate: cycle.responseRate,
               status: st,
               inMonth,
               type: "CYCLE"
             });
          }
       } else {
          cycle.tasks.forEach(task => {
             const st = calculateTaskStatus(task, today);
             const inMonth = task.deadline ? (isSameMonth(new Date(task.deadline), selectedPeriod) && isSameYear(new Date(task.deadline), selectedPeriod)) : cycleMatch;
             
             let shouldShow = false;
             if (filter === "ALL") {
                const isUpcoming = st === "DUE_SOON" || st === "DUE_TODAY";
                shouldShow = inMonth || isUpcoming;
             } else {
                shouldShow = st === filter;
             }

             if (shouldShow) {
                items.push({
                  id: task.id,
                  taskName: task.taskName,
                  cycleName: cycle.cycleName,
                  deadline: task.deadline,
                  dateSubmitted: task.dateSubmitted,
                  totalSamplesDocuments: task.totalSamplesDocuments,
                  responseRate: task.responseRate,
                  remarks: task.remarks,
                  status: st,
                  inMonth,
                  type: "TASK"
                });
             }
          });
       }
    });
    
    return items.sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }, [filter, project, selectedPeriod, today]);

  // Project-level Status
  const projectMonthlyStatus = useMemo(() => {
    if (activities.length === 0) return "No Entries";
    const statuses = activities.map(a => a.status);
    if (statuses.includes("OVERDUE")) return "Critical";
    if (statuses.includes("DUE_TODAY") || statuses.includes("DUE_SOON")) return "Due Soon";
    if (statuses.every(s => s === "COMPLETED")) return "Completed";
    return "Active";
  }, [activities]);

  // Status Badge Colors
  const getBadgeColor = (status: string) => {
    switch (status) {
      case "OVERDUE":
      case "Critical": return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
      case "DUE_TODAY": return "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400";
      case "DUE_SOON":
      case "Due Soon": return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400";
      case "COMPLETED":
      case "Completed": return "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400";
      case "NO_DEADLINE":
      case "No Entries": return "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400";
      default: return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
    }
  };

  const formatLabel = (s: string) => {
    if (s === "DUE_TODAY") return "Due Today";
    if (s === "DUE_SOON") return "Due Soon";
    if (s === "NO_DEADLINE") return "No Deadline";
    if (s === "OVERDUE") return "Overdue";
    if (s === "COMPLETED") return "Submitted";
    return "Pending";
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  const formatFreq = (f: string) => f ? f.replace(/_/g, ' ').split(' ').map(capitalize).join(' ') : "N/A";

  const handlePrev = () => {
    if (project.frequency === "QUARTERLY") {
      setSelectedPeriod(prev => subQuarters(prev, 1));
    } else {
      setSelectedPeriod(prev => subMonths(prev, 1));
    }
  };

  const handleNext = () => {
    if (project.frequency === "QUARTERLY") {
      setSelectedPeriod(prev => addQuarters(prev, 1));
    } else {
      setSelectedPeriod(prev => addMonths(prev, 1));
    }
  };

  return (
     <div className="rounded-xl border bg-white dark:bg-[#1C212E] dark:border-white/10 shadow-sm overflow-hidden flex flex-col">
       {/* Header */}
       <div className="p-5 flex flex-col md:flex-row justify-between items-start gap-4 bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5">
         <div>
            <div className="flex items-center gap-3 mb-2">
               <Link href={`/projects/${project.slug}`} className="hover:underline">
                 <h2 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                   {project.name}
                 </h2>
               </Link>
               <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-transparent", getBadgeColor(projectMonthlyStatus))}>
                 {projectMonthlyStatus}
               </span>
            </div>
            
            <div className="text-[13px] text-slate-600 dark:text-slate-400 space-y-1">
               <p><span className="font-semibold text-slate-900 dark:text-slate-300">Frequency:</span> {formatFreq(project.frequency)}</p>
               <p><span className="font-semibold text-slate-900 dark:text-slate-300">Focal Person:</span> {fp}</p>
               <p><span className="font-semibold text-slate-900 dark:text-slate-300">Alternate Focal Person:</span> {afp}</p>
               {asfp && <p><span className="font-semibold text-slate-900 dark:text-slate-300">Assistant Focal Person:</span> {asfp}</p>}
            </div>
         </div>

         <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
            <button onClick={handlePrev} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors text-slate-500 hover:text-slate-900 dark:hover:text-white">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-[13px] min-w-[90px] text-center text-slate-900 dark:text-white">
              {project.frequency === "QUARTERLY" ? `Q${getQuarter(selectedPeriod)} ${getYear(selectedPeriod)}` : format(selectedPeriod, "MMM yyyy")}
            </span>
            <button onClick={handleNext} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors text-slate-500 hover:text-slate-900 dark:hover:text-white">
              <ChevronRight className="w-4 h-4" />
            </button>
         </div>
       </div>

       {/* Activities Grid */}
       <div className="p-0">
          {activities.length === 0 ? (
             <div className="py-8 flex flex-col items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                <p>No monitoring entries for this month.</p>
             </div>
          ) : (
             <div className="overflow-x-auto">
                <div className="min-w-[800px] p-5">
                   {/* Table Header */}
                   <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1.5fr] gap-4 mb-2 px-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      <div>Task / Activity</div>
                      <div className="text-center">Deadline</div>
                      <div className="text-center">Submitted</div>
                      <div className="text-center">Total</div>
                      <div className="text-center">Rate</div>
                      <div>Remarks</div>
                   </div>

                   {/* Rows */}
                   <div className="space-y-1">
                     {activities.slice(0, 6).map((item) => (
                        <div key={item.id} className={cn("grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1.5fr] gap-4 items-center px-2 py-1.5 rounded-lg transition-colors text-sm border-b border-slate-50 dark:border-white/5 last:border-0", !item.inMonth ? "bg-amber-50/50 dark:bg-amber-500/5 hover:bg-amber-100/50 dark:hover:bg-amber-500/10 border-l-2 border-l-amber-500" : "hover:bg-slate-50 dark:hover:bg-white/5")}>
                           <div className="flex flex-col gap-0.5 font-medium text-slate-900 dark:text-slate-200 truncate pr-2">
                             <span>{item.taskName ?? item.cycleName}</span>
                             {!item.inMonth && <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider shrink-0">From {item.cycleName}</span>}
                           </div>
                           <div className="flex flex-col items-center gap-1 text-center">
                              <span className="text-slate-700 dark:text-slate-300">{item.deadline ? format(new Date(item.deadline), "MMM d, yyyy") : "N/A"}</span>
                              <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold leading-none", getBadgeColor(item.status))}>
                                {formatLabel(item.status)}
                              </span>
                           </div>
                           <div className={cn("text-center text-slate-600 dark:text-slate-400", item.dateSubmitted && item.deadline && new Date(item.dateSubmitted) > new Date(item.deadline) ? "text-red-600 dark:text-red-400 font-medium" : "")}>
                              {item.dateSubmitted ? format(new Date(item.dateSubmitted), "MMM d, yyyy") : "N/A"}
                           </div>
                           <div className="text-center text-slate-600 dark:text-slate-400">
                              {item.totalSamplesDocuments ?? "-"}
                           </div>
                           <div className="text-center text-slate-600 dark:text-slate-400">
                              {item.responseRate !== null && item.responseRate !== undefined ? `${item.responseRate}%` : "-"}
                           </div>
                           <div className="text-slate-500 dark:text-slate-400 line-clamp-2 text-xs" title={item.remarks ?? ""}>
                              {item.remarks || "-"}
                           </div>
                        </div>
                     ))}
                   </div>
                   
                   {activities.length > 6 && (
                     <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex justify-center">
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                           + {activities.length - 6} more rows. View Details to see all.
                        </span>
                     </div>
                   )}
                </div>
             </div>
          )}
       </div>
     </div>
  );
}
