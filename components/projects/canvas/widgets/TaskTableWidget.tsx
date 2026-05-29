import { useState } from "react";
import { Plus, Save, Trash2, X } from "lucide-react";
import {
  addCustomTaskColumnAction,
  createMatrixTaskRowAction,
  disableMatrixTaskRowAction,
  removeCustomTaskColumnAction,
  updateTaskAction,
} from "@/app/(app)/projects/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, formatDateInput } from "@/lib/format";
import type { SerializedProject, WidgetConfig } from "@/lib/canvas-types";
import { WidgetHeader } from "./WidgetHeader";

type CustomColumn = { id: string; label: string };

function parseCustomColumns(value: unknown): CustomColumn[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is CustomColumn => {
    if (!item || typeof item !== "object") return false;
    const c = item as Partial<CustomColumn>;
    return typeof c.id === "string" && typeof c.label === "string";
  });
}

function parseCustomValues(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).filter((e): e is [string, string] => typeof e[1] === "string")
  );
}

interface Props {
  project: SerializedProject;
  canEdit: boolean;
  config?: WidgetConfig;
  isEditing?: boolean;
  onConfigChange?: (config: WidgetConfig) => void;
}

export function TaskTableWidget({ project, canEdit, config, isEditing, onConfigChange }: Props) {
  const customColumns = parseCustomColumns(project.customTaskColumns);

  // Get all unique task names
  const allTasks = project.cycles.flatMap((cycle) => cycle.tasks.filter((t) => t.isActive));
  const uniqueTaskNames = Array.from(new Set(allTasks.map(t => t.taskName)));

  // Setup tabs for Monthly, otherwise just one "All" tab
  const isMonthly = project.frequency === "MONTHLY";
  const quarters = [
    { id: "q1", label: "Q1", cycles: project.cycles.filter(c => c.month && c.month >= 1 && c.month <= 3) },
    { id: "q2", label: "Q2", cycles: project.cycles.filter(c => c.month && c.month >= 4 && c.month <= 6) },
    { id: "q3", label: "Q3", cycles: project.cycles.filter(c => c.month && c.month >= 7 && c.month <= 9) },
    { id: "q4", label: "Q4", cycles: project.cycles.filter(c => c.month && c.month >= 10 && c.month <= 12) },
  ];
  
  const [activeTab, setActiveTab] = useState(isMonthly ? "q1" : "all");



  const renderTable = (cyclesToRender: typeof project.cycles) => {
    if (cyclesToRender.length === 0) {
      return (
        <div className="p-6 text-sm text-muted-foreground text-center">
          No periods found for this view.
        </div>
      );
    }

    return (
      <div className="overflow-x-auto rounded-lg border border-border bg-card dark:bg-slate-900/20">
        <Table className="min-w-max">
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-44 sticky left-0 bg-card z-20 border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                {project.operationWorkloadLabel}
              </TableHead>
              {cyclesToRender.map(cycle => (
                <TableHead key={`header-${cycle.id}`} colSpan={5 + customColumns.length + (canEdit ? 1 : 0)} className="text-center border-r font-bold bg-muted/30">
                  {cycle.cycleName}
                </TableHead>
              ))}
            </TableRow>
            <TableRow>
              <TableHead className="sticky left-0 bg-card z-20 border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"></TableHead>
              {cyclesToRender.map(cycle => (
                <optgroup key={`subhead-${cycle.id}`} className="contents">
                  {project.showDeadlineSubmission && <TableHead className="min-w-40">{project.deadlineSubmissionLabel}</TableHead>}
                  {project.showDateSubmitted && <TableHead className="min-w-40">{project.dateSubmittedLabel}</TableHead>}
                  {project.showTotalSamplesDocuments && <TableHead className="min-w-32">{project.totalSamplesDocumentsLabel}</TableHead>}
                  {project.showResponseRate && <TableHead className="min-w-32">{project.responseRateLabel}</TableHead>}
                  <TableHead className="min-w-48">Remarks</TableHead>
                  {customColumns.map(col => <TableHead key={`cc-${col.id}`} className="min-w-32">{col.label}</TableHead>)}
                  {canEdit && <TableHead className="min-w-16 border-r">Save</TableHead>}
                </optgroup>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {uniqueTaskNames.map(taskName => (
              <TableRow key={`row-${taskName}`}>
                <TableCell className="font-medium sticky left-0 bg-card z-10 border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  <div className="flex items-center justify-between gap-2">
                    {taskName}
                    {canEdit && (
                       <form action={disableMatrixTaskRowAction}>
                         <input type="hidden" name="projectId" value={project.id} />
                         <input type="hidden" name="taskName" value={taskName} />
                         <Button type="submit" size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-destructive">
                           <Trash2 className="h-3 w-3" />
                         </Button>
                       </form>
                    )}
                  </div>
                </TableCell>
                {cyclesToRender.map(cycle => {
                  const task = cycle.tasks.find(t => t.taskName === taskName && t.isActive);
                  if (!task) {
                    return <TableCell key={`empty-${cycle.id}`} colSpan={5 + customColumns.length + (canEdit ? 1 : 0)} className="text-center text-muted-foreground border-r bg-muted/5">No task created</TableCell>;
                  }
                  
                  const formId = `task-form-${task.id}`;
                  const isLate = task.dateSubmitted && task.deadline && new Date(task.dateSubmitted) > new Date(task.deadline);
                  
                  return (
                    <optgroup key={`cell-${task.id}`} className="contents">
                      {project.showDeadlineSubmission && (
                        <TableCell>
                          {canEdit ? (
                            <Input form={formId} name="deadline" type="date" defaultValue={formatDateInput(task.deadline)} className="h-8" />
                          ) : formatDate(task.deadline)}
                        </TableCell>
                      )}
                      {project.showDateSubmitted && (
                        <TableCell>
                          {canEdit ? (
                            <Input form={formId} name="dateSubmitted" type="date" defaultValue={formatDateInput(task.dateSubmitted)} className={`h-8 ${isLate ? "text-red-600 font-medium" : ""}`} />
                          ) : <span className={isLate ? "text-red-600 font-medium" : ""}>{formatDate(task.dateSubmitted, "—")}</span>}
                        </TableCell>
                      )}
                      {project.showTotalSamplesDocuments && (
                        <TableCell>
                          {canEdit ? (
                            <Input form={formId} name="totalSamplesDocuments" type="number" min={0} defaultValue={task.totalSamplesDocuments ?? ""} className="h-8" />
                          ) : (task.totalSamplesDocuments ?? "—")}
                        </TableCell>
                      )}
                      {project.showResponseRate && (
                        <TableCell>
                          {canEdit ? (
                            <div className="flex items-center gap-1">
                              <Input form={formId} name="responseRate" type="number" min={0} max={100} step="0.01" defaultValue={task.responseRate ?? ""} className="h-8 w-16" />
                              <span className="text-muted-foreground">%</span>
                            </div>
                          ) : (task.responseRate == null ? "—" : `${task.responseRate}%`)}
                        </TableCell>
                      )}
                      <TableCell>
                        {canEdit ? (
                          <Input form={formId} name="remarks" defaultValue={task.remarks ?? ""} placeholder="Remarks" className="h-8" />
                        ) : (task.remarks || "—")}
                      </TableCell>
                      
                      {customColumns.map((col) => {
                        const vals = parseCustomValues(task.customValues);
                        return (
                          <TableCell key={col.id}>
                            {canEdit ? (
                              <Input form={formId} name={`customValue:${col.id}`} defaultValue={vals[col.id] ?? ""} className="h-8" />
                            ) : (vals[col.id] || "—")}
                          </TableCell>
                        );
                      })}
                      
                      {canEdit && (
                        <TableCell className="border-r">
                          <form id={formId} action={updateTaskAction} className="hidden">
                            <input type="hidden" name="id" value={task.id} />
                            <input type="hidden" name="taskName" value={task.taskName} />
                            <input type="hidden" name="progress" value={task.progress} />
                          </form>
                          <Button type="submit" form={formId} size="icon" variant="ghost" className="h-8 w-8 text-primary">
                            <Save className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
                    </optgroup>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col overflow-auto">
      <WidgetHeader
        defaultTitle="Task Matrix"
        config={config}
        isEditing={!!isEditing}
        onConfigChange={onConfigChange}
      />
      <div className="flex-1 overflow-auto p-5 space-y-4">
        {canEdit && (
          <div className="grid gap-3 rounded-lg border border-border bg-card dark:bg-slate-900/50 p-4 lg:grid-cols-2">
            <form action={createMatrixTaskRowAction} className="flex flex-col gap-3 sm:flex-row">
              <input type="hidden" name="projectId" value={project.id} />
              <Input name="taskName" placeholder="New Operation/Workload" required disabled={project.cycles.length === 0} />
              <Button type="submit" disabled={project.cycles.length === 0}>
                <Plus className="h-4 w-4" aria-hidden />
                Add Workload
              </Button>
            </form>
            <form action={addCustomTaskColumnAction} className="flex flex-col gap-3 sm:flex-row">
              <input type="hidden" name="projectId" value={project.id} />
              <Input name="label" placeholder="New custom column" required />
              <Button type="submit" variant="outline">
                <Plus className="h-4 w-4" aria-hidden />
                Add Column
              </Button>
            </form>
            {customColumns.length > 0 && (
              <div className="flex flex-wrap gap-2 lg:col-span-2">
                {customColumns.map((col) => (
                  <form key={col.id} action={removeCustomTaskColumnAction}>
                    <input type="hidden" name="projectId" value={project.id} />
                    <input type="hidden" name="columnId" value={col.id} />
                    <Button type="submit" variant="outline" size="sm">
                      <X className="h-4 w-4" aria-hidden />
                      {col.label}
                    </Button>
                  </form>
                ))}
              </div>
            )}
          </div>
        )}

        {isMonthly ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              {quarters.map(q => (
                <TabsTrigger key={q.id} value={q.id}>{q.label}</TabsTrigger>
              ))}
            </TabsList>
            {quarters.map(q => (
              <TabsContent key={q.id} value={q.id} className="mt-0">
                {renderTable(q.cycles)}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          renderTable(project.cycles)
        )}
      </div>
    </div>
  );
}
