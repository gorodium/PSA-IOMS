"use client";

import type { CanvasWidget, SerializedProject, SerializedAuditLog, WidgetConfig } from "@/lib/canvas-types";
import { ProjectInfoWidget } from "./widgets/ProjectInfoWidget";
import { PersonnelWidget } from "./widgets/PersonnelWidget";
import { DataSectionsWidget } from "./widgets/DataSectionsWidget";
import { CyclesTableWidget } from "./widgets/CyclesTableWidget";
import { TaskTableWidget } from "./widgets/TaskTableWidget";
import { RemarksWidget } from "./widgets/RemarksWidget";
import { AuditLogWidget } from "./widgets/AuditLogWidget";
import { TextWidget } from "./widgets/TextWidget";
import { HeadingWidget } from "./widgets/HeadingWidget";
import { InfoGridWidget } from "./widgets/InfoGridWidget";

interface Props {
  widget: CanvasWidget;
  project: SerializedProject;
  auditLogs: SerializedAuditLog[];
  canEdit: boolean;
  isEditing: boolean;
  derivedStatus: string;
  projectProgress: number;
  nearestDeadline: string | null;
  onConfigChange: (config: WidgetConfig) => void;
}

export function WidgetRenderer({
  widget,
  project,
  auditLogs,
  canEdit,
  isEditing,
  derivedStatus,
  projectProgress,
  nearestDeadline,
  onConfigChange,
}: Props) {
  switch (widget.type) {
    case "project-info":
      return (
        <ProjectInfoWidget
          project={project}
          isEditing={isEditing}
          derivedStatus={derivedStatus}
          projectProgress={projectProgress}
          nearestDeadline={nearestDeadline}
          config={widget.config}
          onConfigChange={onConfigChange}
        />
      );
    case "assigned-employees":
      return <PersonnelWidget project={project} config={widget.config} isEditing={isEditing} onConfigChange={onConfigChange} />;
    case "data-sections":
      return (
        <DataSectionsWidget
          project={project}
          nearestDeadline={nearestDeadline}
          projectProgress={projectProgress}
          config={widget.config}
          isEditing={isEditing}
          onConfigChange={onConfigChange}
        />
      );
    case "cycles-table":
      return <CyclesTableWidget project={project} config={widget.config} isEditing={isEditing} onConfigChange={onConfigChange} />;
    case "task-table":
      return <TaskTableWidget project={project} canEdit={canEdit} config={widget.config} isEditing={isEditing} onConfigChange={onConfigChange} />;
    case "remarks":
      return (
        <RemarksWidget
          projectId={project.id}
          remarks={project.remarks}
          canComment={canEdit}
          config={widget.config}
          isEditing={isEditing}
          onConfigChange={onConfigChange}
        />
      );
    case "audit-log":
      return <AuditLogWidget auditLogs={auditLogs} config={widget.config} isEditing={isEditing} onConfigChange={onConfigChange} />;
    case "text":
      return (
        <TextWidget
          config={widget.config}
          isEditing={isEditing}
          onConfigChange={onConfigChange}
        />
      );
    case "heading":
      return (
        <HeadingWidget
          config={widget.config}
          isEditing={isEditing}
          onConfigChange={onConfigChange}
        />
      );
    case "info-grid":
      return (
        <InfoGridWidget
          config={widget.config}
          isEditing={isEditing}
          onConfigChange={onConfigChange}
        />
      );
    default:
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          Unknown widget type
        </div>
      );
  }
}
