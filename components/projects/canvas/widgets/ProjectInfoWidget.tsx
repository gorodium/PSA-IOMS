"use client";

import { useTransition } from "react";
import type { SerializedProject, WidgetConfig } from "@/lib/canvas-types";
import { formatEnumLabel } from "@/lib/format";
import { getProjectCategoryLabel, projectCategoryOptions } from "@/lib/taxonomy";
import { updateProjectMetadataAction } from "@/app/(app)/projects/canvas-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WidgetHeader } from "./WidgetHeader";
import { ProjectFrequency } from "@prisma/client";
import { Save } from "lucide-react";

interface Props {
  project: SerializedProject;
  isEditing: boolean;
  derivedStatus: string;
  projectProgress: number;
  nearestDeadline: string | null;
  config?: WidgetConfig;
  onConfigChange?: (config: WidgetConfig) => void;
}

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
    <div className="mt-0.5 text-foreground font-medium">{value}</div>
  </div>
);

export function ProjectInfoWidget({ project, isEditing, derivedStatus, config, onConfigChange }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await updateProjectMetadataAction(formData);
    });
  };

  return (
    <div className="h-full flex flex-col overflow-auto">
      <WidgetHeader
        defaultTitle="Project Information"
        config={config}
        isEditing={isEditing}
        onConfigChange={onConfigChange}
        className="px-0 pt-0"
      />

      <div className="flex-1 overflow-auto py-5">
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <input type="hidden" name="id" value={project.id} />
            <input type="hidden" name="isActive" value={project.isActive ? "on" : "off"} />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase text-muted-foreground">Status</p>
                <select name="statusDropdown" defaultValue={!project.isActive ? "INACTIVE" : project.status === "COMPLETED" ? "COMPLETED" : "ACTIVE"} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase text-muted-foreground">Category</p>
                <select name="category" defaultValue={project.category} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  {projectCategoryOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase text-muted-foreground">Frequency</p>
                <select name="frequency" defaultValue={project.frequency} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  {Object.keys(ProjectFrequency).map(freq => (
                    <option key={freq} value={freq}>{formatEnumLabel(freq)}</option>
                  ))}
                </select>
              </div>
              {project.frequency === "CUSTOM" && (
                <div className="space-y-1 col-span-2">
                  <p className="text-xs font-medium uppercase text-muted-foreground">Custom Frequency</p>
                  <Input name="customFrequency" defaultValue={project.customFrequency ?? ""} className="h-9" />
                </div>
              )}
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase text-muted-foreground">Target Year</p>
                <Input name="year" type="number" defaultValue={project.year} className="h-9" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase text-muted-foreground">Est. Mandays</p>
                <Input name="estimatedMandays" type="number" defaultValue={project.estimatedMandays} className="h-9" />
              </div>
            </div>
            <Button type="submit" disabled={isPending} className="w-full mt-4" size="sm">
              <Save className="h-4 w-4 mr-2" />
              {isPending ? "Saving..." : "Save Details"}
            </Button>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <InfoRow label="Status" value={formatEnumLabel(derivedStatus)} />
            <InfoRow label="Category" value={getProjectCategoryLabel(project.category)} />
            <InfoRow 
              label="Frequency" 
              value={project.frequency === "CUSTOM" && project.customFrequency 
                ? project.customFrequency 
                : formatEnumLabel(project.frequency)} 
            />
            <InfoRow label="Est. Mandays" value={project.estimatedMandays === 0 ? "N/A" : project.estimatedMandays.toString()} />
            <InfoRow label="Target Year" value={project.year.toString()} />
            <InfoRow label="Workload Weight" value={project.workloadWeight === 0 ? "N/A" : project.workloadWeight.toString()} />
          </div>
        )}
      </div>
    </div>
  );
}
