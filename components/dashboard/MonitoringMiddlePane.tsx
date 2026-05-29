"use client";

import { useState, useMemo } from "react";
import { AlertTriangle, CalendarClock, Clock, FolderKanban, X, type LucideIcon } from "lucide-react";
import type { MonitoringProject } from "@/lib/project-metrics";
import { ProjectSummaryCard } from "./ProjectSummaryCard";
import { calculateTaskStatus } from "@/lib/status";
import { cn } from "@/lib/utils";

interface Props {
  activeProjects: MonitoringProject[];
  isSuperAdmin: boolean;
}

type MetricCardProps = {
  title: string;
  value: number;
  icon: LucideIcon;
  colorClass: {
    bg: string;
    text: string;
  };
  onClick: () => void;
  active: boolean;
  description: string;
};

function MetricCard({ title, value, icon: Icon, colorClass, onClick, active, description }: MetricCardProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-white dark:bg-[#1C212E] rounded-xl border p-4 flex items-center gap-4 cursor-pointer transition-all hover:shadow-md",
        active ? "border-blue-500 ring-1 ring-blue-500 dark:border-blue-400 dark:ring-blue-400" : "border-slate-200 dark:border-white/5"
      )}
    >
       <div className={cn("p-3 rounded-lg flex-shrink-0", colorClass.bg, colorClass.text)}>
         <Icon className="w-5 h-5" />
       </div>
       <div className="flex-1 min-w-0">
         <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{value}</h3>
         </div>
         <p className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 mt-1 uppercase tracking-wider">{title}</p>
         <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">{description}</p>
       </div>
    </div>
  );
}

export function MonitoringMiddlePane({ activeProjects, isSuperAdmin }: Props) {
  const [filter, setFilter] = useState<"ALL" | "DUE_TODAY" | "DUE_SOON" | "OVERDUE">("ALL");

  const today = useMemo(() => new Date(), []);

  const metrics = useMemo(() => {
    const dueTodayProjects = new Set<string>();
    const dueSoonProjects = new Set<string>();
    const overdueProjects = new Set<string>();

    let dueTodayCount = 0;
    let dueSoonCount = 0;
    let overdueCount = 0;

    activeProjects.forEach(project => {
       project.cycles.forEach(cycle => {
          if (cycle.tasks.length === 0) {
             const st = calculateTaskStatus(cycle, today);
             if (st === "DUE_TODAY") { dueTodayCount++; dueTodayProjects.add(project.id); }
             if (st === "DUE_SOON") { dueSoonCount++; dueSoonProjects.add(project.id); }
             if (st === "OVERDUE") { overdueCount++; overdueProjects.add(project.id); }
          } else {
             cycle.tasks.forEach(task => {
               const st = calculateTaskStatus(task, today);
               if (st === "DUE_TODAY") { dueTodayCount++; dueTodayProjects.add(project.id); }
               if (st === "DUE_SOON") { dueSoonCount++; dueSoonProjects.add(project.id); }
               if (st === "OVERDUE") { overdueCount++; overdueProjects.add(project.id); }
             });
          }
       });
    });

    return { dueTodayCount, dueSoonCount, overdueCount, dueTodayProjects, dueSoonProjects, overdueProjects };
  }, [activeProjects, today]);

  const displayedProjects = useMemo(() => {
    if (filter === "ALL") return activeProjects;
    if (filter === "DUE_TODAY") return activeProjects.filter(p => metrics.dueTodayProjects.has(p.id));
    if (filter === "DUE_SOON") return activeProjects.filter(p => metrics.dueSoonProjects.has(p.id));
    if (filter === "OVERDUE") return activeProjects.filter(p => metrics.overdueProjects.has(p.id));
    return activeProjects;
  }, [filter, activeProjects, metrics]);
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pb-4 shrink-0">
        <div className="flex items-center justify-between mb-4 mt-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">Monitoring Board</h1>
            {filter !== "ALL" && (
              <button onClick={() => setFilter("ALL")} className="flex items-center gap-1 text-[11px] font-medium bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full hover:bg-slate-200 dark:hover:bg-white/20 transition-colors">
                Clear Filter <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3 overflow-x-auto pb-2 scrollbar-thin">
          <MetricCard 
             title="Due Today" 
             description="Deliverables due today"
             value={metrics.dueTodayCount} 
             icon={Clock} 
             colorClass={{ bg: "bg-amber-100 dark:bg-amber-500/20", text: "text-amber-600 dark:text-amber-400" }} 
             onClick={() => setFilter(f => f === "DUE_TODAY" ? "ALL" : "DUE_TODAY")}
             active={filter === "DUE_TODAY"}
          />
          <MetricCard 
             title="Due in 7 Days" 
             description="Upcoming deadlines"
             value={metrics.dueSoonCount} 
             icon={CalendarClock} 
             colorClass={{ bg: "bg-blue-100 dark:bg-blue-500/20", text: "text-blue-600 dark:text-blue-400" }} 
             onClick={() => setFilter(f => f === "DUE_SOON" ? "ALL" : "DUE_SOON")}
             active={filter === "DUE_SOON"}
          />
          <MetricCard 
             title="Overdue" 
             description="Past deadline, unsubmitted"
             value={metrics.overdueCount} 
             icon={AlertTriangle} 
             colorClass={{ bg: "bg-red-100 dark:bg-red-500/20", text: "text-red-600 dark:text-red-400" }} 
             onClick={() => setFilter(f => f === "OVERDUE" ? "ALL" : "OVERDUE")}
             active={filter === "OVERDUE"}
          />
        </div>
      </div>

      {/* Scrollable Project Summaries */}
      <div className="flex-1 overflow-y-auto pr-2 pb-10 space-y-6">
        {displayedProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#1C212E] rounded-xl border border-slate-200 dark:border-white/5">
            <FolderKanban className="w-8 h-8 mb-3 opacity-20" />
            <p className="text-sm font-medium">No projects match the selected filter</p>
          </div>
        ) : (
          displayedProjects.map((project) => (
            <ProjectSummaryCard key={project.id} project={project} isSuperAdmin={isSuperAdmin} filter={filter} />
          ))
        )}
      </div>
    </div>
  );
}
