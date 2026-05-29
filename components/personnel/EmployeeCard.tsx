import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Building2, Edit2, Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type ProjectAssignment = {
  roleInProject: string;
  project: {
    id: string;
    name: string;
  };
};

type EmployeeCardProps = {
  personnel: {
    id: string;
    slug: string;
    fullName: string;
    employeeNo: string | null;
    position: string;
    section: string;
    email: string | null;
    contactNo: string | null;
    isActive: boolean;
    locationStatus: string;
    travelDetails: string | null;
    travelDestination: string | null;
    travelStartDate: Date | null;
    travelEndDate: Date | null;
    projectAssignments?: ProjectAssignment[];
  };
  canEdit: boolean;
  searchParams?: Record<string, string | string[] | undefined>;
};

export function EmployeeCard({ personnel, canEdit, searchParams }: EmployeeCardProps) {
  const isTravel = personnel.locationStatus === "on_travel";
  
  // Parse employment type
  const isVei = personnel.position.endsWith("***");
  const isCoterminous = !isVei && personnel.position.endsWith("**");
  const isCosw = !isVei && !isCoterminous && personnel.position.endsWith("*");

  const displayPosition = isVei 
    ? personnel.position.slice(0, -3) 
    : isCoterminous 
      ? personnel.position.slice(0, -2) 
      : isCosw 
        ? personnel.position.slice(0, -1) 
        : personnel.position;

  const employmentType = isVei ? "VEI" : isCoterminous ? "Coterminous / Contractual" : isCosw ? "COSW" : "Regular";
  
  const getEmploymentBadgeColor = () => {
    if (isVei) return "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300";
    if (isCoterminous) return "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300";
    if (isCosw) return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
  };
  
  // Calculate KPIs
  const focalProjects = personnel.projectAssignments?.filter(a => a.roleInProject === "Focal Person") || [];
  const alternateProjects = personnel.projectAssignments?.filter(a => a.roleInProject === "Alternate Focal Person") || [];
  const assistantProjects = personnel.projectAssignments?.filter(a => a.roleInProject === "Assistant Focal Person") || [];
  const otherProjects = personnel.projectAssignments?.filter(a => 
    a.roleInProject !== "Focal Person" && 
    a.roleInProject !== "Alternate Focal Person" && 
    a.roleInProject !== "Assistant Focal Person"
  ) || [];

  const focalCount = focalProjects.length;
  const alternateCount = alternateProjects.length;
  const assistantCount = assistantProjects.length;
  const otherCount = otherProjects.length;

  const currentParams = new URLSearchParams();
  if (typeof searchParams?.search === "string") currentParams.set("search", searchParams.search);
  if (typeof searchParams?.active === "string") currentParams.set("active", searchParams.active);
  if (typeof searchParams?.sortBy === "string") currentParams.set("sortBy", searchParams.sortBy);
  currentParams.set("edit", personnel.slug);
  const editUrl = `/personnel?${currentParams.toString()}`;

  const renderLocationBadge = () => {
    if (isTravel) {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
              <MapPin className="w-3 h-3" />
              On Travel
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm">Travel Details</h4>
                <p className="text-sm text-muted-foreground mt-1">{personnel.travelDetails || "No details provided."}</p>
              </div>
              {personnel.travelDestination && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Destination</h4>
                  <p className="text-sm">{personnel.travelDestination}</p>
                </div>
              )}
              {(personnel.travelStartDate || personnel.travelEndDate) && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Duration</h4>
                  <div className="flex items-center gap-2 text-sm">
                    {personnel.travelStartDate ? format(new Date(personnel.travelStartDate), "MMM d, yyyy") : "?"}
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    {personnel.travelEndDate ? format(new Date(personnel.travelEndDate), "MMM d, yyyy") : "?"}
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      );
    }

    return (
      <span className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-bold rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
        <Building2 className="w-3 h-3" />
        Office
      </span>
    );
  };

  const renderKPICell = (count: number, label: string, projects: ProjectAssignment[]) => {
    const commonClasses = cn(
      "flex-1 p-2.5 text-center flex flex-col items-center justify-center min-w-0 transition-colors rounded-lg border shadow-sm",
      count > 0 
        ? "bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border-slate-200 dark:border-white/10" 
        : "bg-slate-50/50 dark:bg-slate-900/30 border-transparent opacity-75"
    );

    if (count === 0) {
      return (
        <div className={commonClasses}>
          <span className="text-xl font-semibold text-slate-700 dark:text-slate-300">{count}</span>
          <span className="text-[9px] uppercase font-bold tracking-tight text-slate-500 dark:text-slate-400 mt-1 leading-tight whitespace-normal px-1">{label}</span>
        </div>
      );
    }

    return (
      <Popover>
        <PopoverTrigger className={commonClasses}>
          <span className="text-xl font-semibold text-slate-700 dark:text-slate-300">{count}</span>
          <span className="text-[9px] uppercase font-bold tracking-tight text-slate-500 dark:text-slate-400 mt-1 leading-tight whitespace-normal px-1">{label}</span>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-3 bg-white dark:bg-[#0F172A] border-slate-200 dark:border-white/10 shadow-xl z-50" align="center">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 border-b pb-2 border-border/50">{label} Projects</h4>
          <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {projects.map(p => (
              <li key={p.project.id} className="text-sm font-medium leading-tight text-left">
                {p.project.name}
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className={cn(
      "relative flex flex-col rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1C212E] shadow-md dark:shadow-slate-900/40 transition-all hover:shadow-lg",
      !personnel.isActive && "opacity-75 grayscale-[0.2]"
    )}>
      {/* Top Section */}
      <div className="p-5 pb-4 border-b border-border/50">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate text-slate-900 dark:text-slate-100" title={personnel.fullName}>
              {personnel.fullName}
            </h3>
            <div className="flex flex-col gap-1.5 mt-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-[250px]" title={displayPosition}>
                {displayPosition}
              </span>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${getEmploymentBadgeColor()} border-current/20`}>
                  {employmentType}
                </span>
                <span className="text-slate-300 dark:text-slate-600">&bull;</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate" title={personnel.section}>
                  {personnel.section}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            {!personnel.isActive && (
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase rounded bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                Archived
              </span>
            )}
            {personnel.employeeNo && (
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                Employee No. {personnel.employeeNo}
              </span>
            )}
          </div>
        </div>

        {/* Contact & Location */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4">
          {personnel.email && (
            <a href={`mailto:${personnel.email}`} className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
              <Mail className="w-3.5 h-3.5" />
              <span className="truncate max-w-[150px]">{personnel.email}</span>
            </a>
          )}
          {personnel.contactNo && (
            <a href={`tel:${personnel.contactNo}`} className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
              <Phone className="w-3.5 h-3.5" />
              <span>{personnel.contactNo}</span>
            </a>
          )}
          <div className="ml-auto">
            {renderLocationBadge()}
          </div>
        </div>
      </div>

      {/* KPI Section */}
      <div className="flex flex-row w-full gap-2 p-3 bg-slate-50/50 dark:bg-[#151923] rounded-b-xl border-t border-slate-200 dark:border-slate-700/80">
        {renderKPICell(focalCount, "Focal", focalProjects)}
        {renderKPICell(alternateCount, "Alternate Focal", alternateProjects)}
        {renderKPICell(assistantCount, "Assistant Focal", assistantProjects)}
        {renderKPICell(otherCount, "Other Projects Involved", otherProjects)}
      </div>

      {/* Actions */}
      {canEdit && (
        <div className="p-3 border-t border-border/50 flex justify-end bg-card rounded-b-xl">
          <Button asChild variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-foreground">
            <Link href={editUrl}>
              <Edit2 className="w-3.5 h-3.5 mr-1.5" />
              Edit Details
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
