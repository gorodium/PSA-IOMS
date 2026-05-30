import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, Users, Target, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getProjectCategoryLabel } from "@/lib/taxonomy";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { Button } from "@/components/ui/button";

export type ProjectTableRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  year: number;
  frequency?: string;
  focalPerson: string;
  otherInvolvedPersonnel: string;
  groupedPersonnel?: { role: string; names: string }[];
  progress: number;
  status: string;
  isActive: boolean;
  nearestDeadline: Date | null;
  updatedAt: Date;
};

// Map status or category to a tailwind border color class
function getStripeColor(status: string) {
  switch (status.toUpperCase()) {
    case "COMPLETED":
      return "bg-success";
    case "ONGOING":
      return "bg-primary";
    case "DELAYED":
      return "bg-destructive";
    case "UPCOMING":
      return "bg-warning";
    default:
      return "bg-slate-300 dark:bg-slate-700";
  }
}

export function ProjectCard({ project }: { project: ProjectTableRow }) {
  const isInactive = !project.isActive;
  const stripeColor = getStripeColor(project.status);

  return (
    <div className={cn(
      "relative flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm transition-all hover:shadow-md overflow-hidden",
      isInactive && "opacity-75 grayscale-[0.2]"
    )}>
      {/* Colored Top Border / Stripe */}
      <div className={cn("h-1.5 w-full", stripeColor)} />

      {/* Header Section */}
      <div className="flex flex-col p-5 pb-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-50 line-clamp-2 leading-tight">
              {project.name}
            </h3>
          </div>
          <div className="shrink-0">
            <ProjectStatusBadge status={project.status} />
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground mt-1">
          <span className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800">
            {project.year}
          </span>
          <span className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800 truncate">
            {getProjectCategoryLabel(project.category)}
          </span>
          {project.frequency && (
            <span className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800 capitalize">
              {project.frequency.toLowerCase().replace(/_/g, ' ')}
            </span>
          )}
        </div>
      </div>

      {/* Personnel Details */}
      <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <Target className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Focal Person</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                {project.focalPerson || "Unassigned"}
              </p>
            </div>
          </div>
          
          {project.groupedPersonnel?.map((group, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <Users className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{group.role}</p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 truncate whitespace-normal">
                  {group.names}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deadline & Footer */}
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-t border-slate-100 dark:border-slate-800/60 mt-auto">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Calendar className="h-3.5 w-3.5 text-warning" />
            <span>
              {project.nearestDeadline 
                ? `Due: ${format(new Date(project.nearestDeadline), "MMM d, yyyy")}` 
                : "No upcoming deadlines"}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            Updated {format(new Date(project.updatedAt), "MMM d")}
          </p>
        </div>
        <Button asChild variant="default" size="sm" className="shrink-0 rounded-full h-8 px-4 text-xs font-semibold shadow-sm">
          <Link href={`/projects/${project.slug}`}>
            View Details
            <ArrowRight className="ml-1.5 h-3 w-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
