import { Plus, Save, Trash2, X } from "lucide-react";
import {
  addCustomTaskColumnAction,
  createTaskRowAction,
  disableTaskRowAction,
  removeCustomTaskColumnAction,
  updateTaskAction
} from "@/app/(app)/projects/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, formatDateInput } from "@/lib/format";
import { defaultTaskColumns } from "@/lib/taxonomy";

type CustomColumn = {
  id: string;
  label: string;
};

export type TaskTableProject = {
  id: string;
  showOperationWorkload: boolean;
  showDeadlineSubmission: boolean;
  showDateSubmitted: boolean;
  showTotalSamplesDocuments: boolean;
  showResponseRate: boolean;
  operationWorkloadLabel: string;
  deadlineSubmissionLabel: string;
  dateSubmittedLabel: string;
  totalSamplesDocumentsLabel: string;
  responseRateLabel: string;
  customTaskColumns: unknown;
};

export type TaskTableCycle = {
  id: string;
  cycleName: string;
  tasks: Array<{
    id: string;
    taskName: string;
    assignedPersonnel: {
      fullName: string;
    } | null;
    startDate: Date | null;
    deadline: Date | null;
    dateSubmitted: Date | null;
    progress: number;
    status: string;
    responseRate: number | null;
    totalSamplesDocuments: number | null;
    customValues: unknown;
    remarks: string | null;
    isActive: boolean;
  }>;
};

function parseCustomColumns(value: unknown): CustomColumn[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is CustomColumn => {
    if (!item || typeof item !== "object") {
      return false;
    }

    const candidate = item as Partial<CustomColumn>;
    return typeof candidate.id === "string" && typeof candidate.label === "string";
  });
}

function parseCustomValues(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).filter((entry): entry is [string, string] => typeof entry[1] === "string")
  );
}

export function TaskTable({
  project,
  cycles,
  canEdit
}: {
  project: TaskTableProject;
  cycles: TaskTableCycle[];
  canEdit: boolean;
}) {
  const tasks = cycles.flatMap((cycle) =>
    cycle.tasks
      .filter((task) => task.isActive)
      .map((task) => ({
        ...task,
        cycleId: cycle.id,
        cycleName: cycle.cycleName
      }))
  );
  const customColumns = parseCustomColumns(project.customTaskColumns);
  const visibleStandardColumns = defaultTaskColumns.filter((column) => Boolean(project[column.visibleField]));

  return (
    <div className="space-y-3">
      {canEdit ? (
        <div className="grid gap-3 rounded-lg border bg-white p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <form action={createTaskRowAction} className="flex flex-col gap-3 sm:flex-row">
            <input type="hidden" name="projectCycleId" value={cycles[0]?.id ?? ""} />
            <Input name="taskName" placeholder="New row name" required disabled={cycles.length === 0} />
            <Button type="submit" disabled={cycles.length === 0}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add row
            </Button>
          </form>
          <form action={addCustomTaskColumnAction} className="flex flex-col gap-3 sm:flex-row">
            <input type="hidden" name="projectId" value={project.id} />
            <Input name="label" placeholder="New custom column name" required />
            <Button type="submit" variant="outline">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add column
            </Button>
          </form>
          {customColumns.length > 0 ? (
            <div className="flex flex-wrap gap-2 lg:col-span-2">
              {customColumns.map((column) => (
                <form key={column.id} action={removeCustomTaskColumnAction}>
                  <input type="hidden" name="projectId" value={project.id} />
                  <input type="hidden" name="columnId" value={column.id} />
                  <Button type="submit" variant="outline" size="sm">
                    <X className="h-4 w-4" aria-hidden="true" />
                    {column.label}
                  </Button>
                </form>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {tasks.length === 0 ? (
        <div className="rounded-lg border bg-white p-6 text-sm text-muted-foreground">No active task rows have been added to this project yet.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <Table className="min-w-[980px]">
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-44">Cycle</TableHead>
                {visibleStandardColumns.map((column) => (
                  <TableHead key={column.key} className="min-w-48">
                    {project[column.labelField]}
                  </TableHead>
                ))}
                {customColumns.map((column) => (
                  <TableHead key={column.id} className="min-w-44">
                    {column.label}
                  </TableHead>
                ))}
                <TableHead className="min-w-52">Assigned personnel</TableHead>
                {canEdit ? <TableHead className="min-w-96">Edit row</TableHead> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.cycleName}</TableCell>
                  {project.showOperationWorkload ? <TableCell className="font-medium text-slate-950">{task.taskName}</TableCell> : null}
                  {project.showDeadlineSubmission ? <TableCell>{formatDate(task.deadline)}</TableCell> : null}
                  {project.showDateSubmitted ? <TableCell>{formatDate(task.dateSubmitted, "Not submitted")}</TableCell> : null}
                  {project.showTotalSamplesDocuments ? <TableCell>{task.totalSamplesDocuments ?? "Not set"}</TableCell> : null}
                  {project.showResponseRate ? <TableCell>{task.responseRate == null ? "Not set" : `${task.responseRate}%`}</TableCell> : null}
                  {customColumns.map((column) => {
                    const customValues = parseCustomValues(task.customValues);
                    return <TableCell key={column.id}>{customValues[column.id] || "Not set"}</TableCell>;
                  })}
                  <TableCell>{task.assignedPersonnel?.fullName ?? "Unassigned"}</TableCell>
                  {canEdit ? (
                    <TableCell>
                      <form action={updateTaskAction} className="grid gap-2">
                        <input type="hidden" name="id" value={task.id} />
                        <div className="grid gap-2 md:grid-cols-2">
                          <Input aria-label={`Row name for ${task.taskName}`} name="taskName" defaultValue={task.taskName} />
                          <Input aria-label={`Progress for ${task.taskName}`} name="progress" type="number" min={0} max={100} defaultValue={task.progress} />
                          <Input aria-label={`Deadline for ${task.taskName}`} name="deadline" type="date" defaultValue={formatDateInput(task.deadline)} />
                          <Input aria-label={`Date submitted for ${task.taskName}`} name="dateSubmitted" type="date" defaultValue={formatDateInput(task.dateSubmitted)} />
                          <Input aria-label={`Total samples for ${task.taskName}`} name="totalSamplesDocuments" type="number" min={0} defaultValue={task.totalSamplesDocuments ?? ""} />
                          <Input aria-label={`Response rate for ${task.taskName}`} name="responseRate" type="number" min={0} max={100} step="0.01" defaultValue={task.responseRate ?? ""} />
                          {customColumns.map((column) => {
                            const customValues = parseCustomValues(task.customValues);
                            return (
                              <Input
                                key={column.id}
                                aria-label={`${column.label} for ${task.taskName}`}
                                name={`customValue:${column.id}`}
                                defaultValue={customValues[column.id] ?? ""}
                                placeholder={column.label}
                              />
                            );
                          })}
                        </div>
                        <Textarea aria-label={`Remarks for ${task.taskName}`} name="remarks" defaultValue={task.remarks ?? ""} className="min-h-16" />
                        <div className="flex flex-wrap gap-2">
                          <Button type="submit" size="sm" variant="outline">
                            <Save className="h-4 w-4" aria-hidden="true" />
                            Save row
                          </Button>
                        </div>
                      </form>
                      <form action={disableTaskRowAction} className="mt-2">
                        <input type="hidden" name="id" value={task.id} />
                        <Button type="submit" size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                          Remove row
                        </Button>
                      </form>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
