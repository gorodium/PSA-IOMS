import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, Users, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { getProjectCategoryLabel } from "@/lib/taxonomy";
import { ProjectStatusBadge } from "./ProjectStatusBadge";

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

export function ProjectCard({ project }: { project: ProjectTableRow }) {
  const isInactive = !project.isActive;

  return (
    <div className={cn(
      "relative flex flex-col rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1C212E] shadow-md dark:shadow-slate-900/40 transition-all hover:shadow-lg",
      isInactive && "opacity-75 grayscale-[0.2]"
    )}>
      {/* Header Section */}
      <div className="flex flex-col p-5 pb-3">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <Link href={`/projects/${project.slug}`} className="hover:underline">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight">
                {project.name}
              </h3>
            </Link>
            {project.frequency && (
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full dark:bg-slate-800 dark:text-slate-400 capitalize whitespace-nowrap">
                {project.frequency.toLowerCase().replace(/_/g, ' ')}
              </span>
            )}
          </div>
          <div className="shrink-0">
            <ProjectStatusBadge status={project.status} />
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
          <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
            {project.year}
          </span>
          <span className="truncate">
            {getProjectCategoryLabel(project.category)}
          </span>
        </div>
      </div>

      {/* Personnel Details */}
      <div className="grid grid-cols-2 px-5 py-4 border-t border-slate-100 dark:border-slate-700/50 gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-2.5">
            <Target className="h-4 w-4 text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">Focal Person</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
                {project.focalPerson || "Unassigned"}
              </p>
            </div>
          </div>
          
          {project.groupedPersonnel?.filter(g => g.role !== "Other Employee(s) Involved").map((group, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <Users className="h-4 w-4 text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">{group.role}</p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 truncate">
                  {group.names}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {project.groupedPersonnel?.filter(g => g.role === "Other Employee(s) Involved").map((group, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <Users className="h-4 w-4 text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">{group.role}</p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 truncate whitespace-normal">
                  {group.names}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deadline */}
      <div className="flex flex-col px-5 py-4 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-[#151923] mt-auto">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            {project.nearestDeadline 
              ? `Next due: ${format(new Date(project.nearestDeadline), "MMM d, yyyy")}` 
              : "No upcoming deadlines"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center px-5 py-3 border-t border-slate-100 dark:border-slate-700/50 rounded-b-xl bg-white dark:bg-[#1C212E]">
        <p className="text-[10px] text-slate-400 dark:text-slate-500">
          Updated {format(new Date(project.updatedAt), "MMM d")}
        </p>
      </div>
    </div>
  );
}
