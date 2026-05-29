"use client";

import type { SerializedProject, WidgetConfig } from "@/lib/canvas-types";
import { formatDate } from "@/lib/format";
import { WidgetHeader } from "./WidgetHeader";

interface Props {
  project: SerializedProject;
  nearestDeadline: string | null;
  projectProgress: number;
  config?: WidgetConfig;
  isEditing?: boolean;
  onConfigChange?: (config: WidgetConfig) => void;
}

function StatCard({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 dark:bg-slate-900/50 p-4 flex flex-col gap-1">
      <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">{label}</p>
      <p className={`text-base font-semibold break-words ${valueClassName || "text-foreground"}`}>{value}</p>
    </div>
  );
}

function latestSubmittedDateValue(project: SerializedProject): Date | null {
  const dates = project.cycles
    .flatMap((c) => [c.dateSubmitted, ...c.tasks.map((t) => t.dateSubmitted)])
    .filter((d): d is string => Boolean(d))
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  return dates[0] ? new Date(dates[0]) : null;
}

function totalSamples(project: SerializedProject): number {
  return project.cycles.reduce((sum, c) => {
    return sum + (c.totalSamplesDocuments ?? 0) + c.tasks.reduce((ts, t) => ts + (t.totalSamplesDocuments ?? 0), 0);
  }, 0);
}

function averageResponseRate(project: SerializedProject): string {
  const rates = project.cycles
    .flatMap((c) => [c.responseRate, ...c.tasks.map((t) => t.responseRate)])
    .filter((r): r is number => typeof r === "number");
  if (rates.length === 0) return "Not set";
  const avg = rates.reduce((s, r) => s + r, 0) / rates.length;
  return `${Math.round(avg * 100) / 100}%`;
}

export function DataSectionsWidget({ project, nearestDeadline, config, isEditing, onConfigChange }: Props) {
  const latestSubmitted = latestSubmittedDateValue(project);
  const isLate = latestSubmitted && nearestDeadline && latestSubmitted > new Date(nearestDeadline);

  const cards: { label: string; value: string; visible: boolean; valueClassName?: string }[] = [
    { label: project.operationWorkloadLabel, value: project.name, visible: project.showOperationWorkload },
    { label: project.deadlineSubmissionLabel, value: nearestDeadline ? formatDate(new Date(nearestDeadline)) : "No deadline", visible: project.showDeadlineSubmission },
    { label: project.dateSubmittedLabel, value: latestSubmitted ? formatDate(latestSubmitted) : "Not submitted", visible: project.showDateSubmitted, valueClassName: isLate ? "text-red-600 dark:text-red-400" : undefined },
    { label: project.totalSamplesDocumentsLabel, value: totalSamples(project).toString(), visible: project.showTotalSamplesDocuments },
    { label: project.responseRateLabel, value: averageResponseRate(project), visible: project.showResponseRate },
  ];

  const visible = cards.filter((c) => c.visible);

  return (
    <div className="h-full flex flex-col overflow-auto">
      <WidgetHeader
        defaultTitle="Data Sections"
        config={config}
        isEditing={!!isEditing}
        onConfigChange={onConfigChange}
      />
      <div className="flex-1 overflow-auto p-5 space-y-5">
        {visible.length === 0 ? (
          <p className="text-sm text-muted-foreground">All sections are hidden. Edit the project to enable them.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((card) => (
              <StatCard key={card.label} label={card.label} value={card.value} valueClassName={card.valueClassName} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
