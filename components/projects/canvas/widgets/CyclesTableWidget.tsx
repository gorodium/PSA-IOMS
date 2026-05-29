"use client";

import type { SerializedProject } from "@/lib/canvas-types";
import { formatDate, formatDateInput, formatEnumLabel } from "@/lib/format";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProgressBar } from "@/components/ui/progress";
import { WidgetHeader } from "./WidgetHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { updateCycleAction } from "@/app/(app)/projects/actions";
import type { WidgetConfig } from "@/lib/canvas-types";

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    COMPLETED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    OVERDUE: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    DUE_TODAY: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    DUE_SOON: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    ON_TRACK: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    NO_DEADLINE: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    INACTIVE: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorMap[status] ?? colorMap.NO_DEADLINE}`}>
      {formatEnumLabel(status)}
    </span>
  );
}

interface Props {
  project: SerializedProject;
  config?: WidgetConfig;
  isEditing?: boolean;
  onConfigChange?: (config: WidgetConfig) => void;
}

export function CyclesTableWidget({ project, config, isEditing, onConfigChange }: Props) {
  return (
    <div className="h-full flex flex-col overflow-auto">
      <WidgetHeader
        defaultTitle="Project Cycles"
        config={config}
        isEditing={!!isEditing}
        onConfigChange={onConfigChange}
      />
      <div className="flex-1 overflow-auto p-5">
        {project.cycles.length === 0 ? (
          <div className="rounded-md border border-border bg-muted/20 p-6 text-sm text-muted-foreground">
            No project cycles have been added.
          </div>
        ) : (
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cycle</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Remarks</TableHead>
                  {isEditing && <TableHead className="min-w-16">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {project.cycles.map((cycle) => {
                  const formId = `cycle-form-${cycle.id}`;
                  return (
                    <TableRow key={cycle.id}>
                      <TableCell className="font-medium text-foreground">{cycle.cycleName}</TableCell>
                      <TableCell>
                        {cycle.month ? `Month ${cycle.month}` : cycle.quarter ? `Quarter ${cycle.quarter}` : "Annual"}{" "}
                        {cycle.year}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input form={formId} name="deadline" type="date" defaultValue={formatDateInput(cycle.deadline)} />
                        ) : (
                          cycle.deadline ? formatDate(new Date(cycle.deadline)) : "—"
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input form={formId} name="dateSubmitted" type="date" defaultValue={formatDateInput(cycle.dateSubmitted)} className={cycle.dateSubmitted && cycle.deadline && new Date(cycle.dateSubmitted) > new Date(cycle.deadline) ? "text-red-600 dark:text-red-400 font-medium" : ""} />
                        ) : (
                          <span className={cycle.dateSubmitted && cycle.deadline && new Date(cycle.dateSubmitted) > new Date(cycle.deadline) ? "text-red-600 dark:text-red-400 font-medium" : ""}>
                            {cycle.dateSubmitted ? formatDate(new Date(cycle.dateSubmitted)) : "Not submitted"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="min-w-36">
                        <div className="flex items-center gap-3">
                          <ProgressBar value={cycle.progress} />
                          <span className="w-10 text-right text-xs text-muted-foreground">{cycle.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell><StatusBadge status={cycle.status} /></TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input form={formId} name="remarks" defaultValue={cycle.remarks ?? ""} placeholder="Remarks" />
                        ) : (
                          <span className="text-sm text-muted-foreground">{cycle.remarks ?? "No remarks"}</span>
                        )}
                      </TableCell>
                      {isEditing && (
                        <TableCell>
                          <form id={formId} action={updateCycleAction} className="hidden">
                            <input type="hidden" name="id" value={cycle.id} />
                          </form>
                          <Button type="submit" form={formId} size="icon" variant="ghost" title="Save changes">
                            <Save className="h-4 w-4 text-primary" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
