"use client";

import React, { useState, useCallback, useTransition } from "react";

import ReactGridLayout, { WidthProvider } from "react-grid-layout/legacy";

const ReactGridLayoutWithWidth = WidthProvider(ReactGridLayout);

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";



import type { CanvasWidget, SerializedAuditLog, SerializedProject, WidgetConfig, WidgetType } from "@/lib/canvas-types";
import { createWidget, getBottomEdge } from "@/lib/canvas-defaults";
import { getProjectCategoryLabel } from "@/lib/taxonomy";
import {
  saveProjectCanvasLayoutAction,
  saveGlobalTemplateAction,
  resetProjectLayoutAction,
} from "@/app/(app)/projects/canvas-actions";
import { WidgetWrapper } from "./WidgetWrapper";
import { WidgetRenderer } from "./WidgetRenderer";
import { AddWidgetPanel } from "./AddWidgetPanel";
import { ProjectInfoWidget } from "./widgets/ProjectInfoWidget";
import { PersonnelWidget } from "./widgets/PersonnelWidget";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { LayoutTemplate, PenLine, Plus, RotateCcw, Save, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  project: SerializedProject;
  auditLogs: SerializedAuditLog[];
  initialLayout: CanvasWidget[];
  canEdit: boolean;
  isAdmin: boolean;
  derivedStatus: string;
  projectProgress: number;
  nearestDeadline: string | null;
}

export function ProjectCanvas({
  project,
  auditLogs,
  initialLayout,
  canEdit,
  isAdmin,
  derivedStatus,
  projectProgress,
  nearestDeadline,
}: Props) {
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  // Clean initial layout: remove project-info and assigned-employees to avoid duplicates
  const cleanLayout = initialLayout.filter(w => w.type !== "project-info" && w.type !== "assigned-employees");
  const [widgets, setWidgets] = useState<CanvasWidget[]>(cleanLayout);
  
  const [showDescription, setShowDescription] = useState(project.showDescription);

  // ─── Grid layout change ────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLayoutChange = useCallback((newLayout: readonly any[]) => {
    setWidgets((prev) =>
      prev.map((widget) => {
        const item = newLayout.find((l) => l.i === widget.i);
        if (!item) return widget;
        return { ...widget, x: item.x, y: item.y, w: item.w, h: item.h };
      })
    );
  }, []);

  // ─── Widget config update (text / heading / info-grid) ─────────────────
  const handleConfigChange = useCallback((id: string, config: WidgetConfig) => {
    setWidgets((prev) =>
      prev.map((w) => (w.i === id ? { ...w, config } : w))
    );
  }, []);

  // ─── Add widget ────────────────────────────────────────────────────────
  const handleAddWidget = useCallback((type: WidgetType) => {
    const bottomEdge = getBottomEdge(widgets);
    const newWidget = createWidget(type, bottomEdge);
    setWidgets((prev) => [...prev, newWidget]);
  }, [widgets]);

  // ─── Remove widget ─────────────────────────────────────────────────────
  const handleRemoveWidget = useCallback((id: string) => {
    setWidgets((prev) => prev.filter((w) => w.i !== id));
  }, []);

  // ─── Save project layout ───────────────────────────────────────────────
  const handleSave = () => {
    startTransition(async () => {
      const result = await saveProjectCanvasLayoutAction(project.id, widgets, showDescription);
      if (result.success) {
        setIsEditing(false);
        setSaveMsg("Layout saved!");
      } else {
        setSaveMsg(result.error ?? "Save failed.");
      }
      setTimeout(() => setSaveMsg(null), 3000);
    });
  };

  // ─── Save as global template ────────────────────────────────────────────
  const handleSaveTemplate = () => {
    startTransition(async () => {
      const result = await saveGlobalTemplateAction(widgets);
      if (result.success) {
        setSaveMsg("Saved as global template!");
      } else {
        setSaveMsg(result.error ?? "Failed to save template.");
      }
      setTimeout(() => setSaveMsg(null), 3000);
    });
  };

  // ─── Reset to global template ───────────────────────────────────────────
  const handleReset = () => {
    if (!confirm("Reset this project's layout to the global template?")) return;
    startTransition(async () => {
      const result = await resetProjectLayoutAction(project.id);
      if (result.success) {
        setSaveMsg("Reset to global template.");
        window.location.reload();
      } else {
        setSaveMsg(result.error ?? "Reset failed.");
      }
      setTimeout(() => setSaveMsg(null), 3000);
    });
  };

  // ─── Cancel edit ───────────────────────────────────────────────────────
  const handleCancel = () => {
    setWidgets(cleanLayout);
    setShowDescription(project.showDescription);
    setIsEditing(false);
  };

  // ─── Build grid layout array for react-grid-layout ────────────────────
  const gridLayout = widgets.map((w) => ({
    i: w.i,
    x: w.x,
    y: w.y,
    w: w.w,
    h: w.h,
    minW: w.minW,
    minH: w.minH,
  }));

  return (
    <div className="relative">
      {/* ── Title and Toolbar ──────────────────────────────────────────────────────── */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">
            {project.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {project.code ? `${project.code} — ` : ""}
            {getProjectCategoryLabel(project.category)}
            {project.subcategory ? ` — ${project.subcategory}` : ""} · {project.year}
          </p>
        </div>

        {canEdit && (
          <div className="flex flex-wrap items-center justify-end gap-2">
            {saveMsg && (
              <span className="text-sm text-muted-foreground mr-auto">{saveMsg}</span>
            )}
            {isEditing ? (
              <>
                <Button size="sm" variant="outline" onClick={() => setShowAddPanel(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Widget
                </Button>
                {isAdmin && (
                  <>
                    <Button size="sm" variant="outline" onClick={handleSaveTemplate} disabled={isPending}>
                      <Sparkles className="h-4 w-4 mr-1" />
                      Save as Template
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleReset} disabled={isPending}>
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reset to Template
                    </Button>
                  </>
                )}
                <Button size="sm" onClick={handleSave} disabled={isPending}>
                  <Save className="h-4 w-4 mr-1" />
                  {isPending ? "Saving…" : "Save Layout"}
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel} disabled={isPending}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                <LayoutTemplate className="h-4 w-4 mr-1" />
                Edit Layout
              </Button>
            )}
          </div>
        )}
      </div>

      {/* ── Edit mode banner ──────────────────────────────────────────────── */}
      {isEditing && (
        <div className="mb-4 rounded-lg border border-primary/30 bg-primary/5 dark:bg-primary/10 px-4 py-2.5 text-sm text-primary flex items-center gap-2">
          <PenLine className="h-4 w-4 shrink-0" />
          <span>
            <strong>Edit mode active</strong> — drag widgets by the handle bar to reposition, drag the bottom-right corner to resize.
          </span>
        </div>
      )}

      {/* ── Static Header Section ─────────────────────────────────────────── */}
      <div className="mb-6 space-y-6">
        {(showDescription && project.description) && (
          <p className="text-muted-foreground whitespace-pre-wrap">{project.description}</p>
        )}
        
        {isEditing && (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="showDescriptionToggle" 
              checked={showDescription} 
              onCheckedChange={(checked) => setShowDescription(!!checked)} 
            />
            <Label htmlFor="showDescriptionToggle" className="text-sm font-medium">
              Show Project Description
            </Label>
          </div>
        )}

        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-7">
            <ProjectInfoWidget
              project={project}
              isEditing={isEditing}
              derivedStatus={derivedStatus}
              projectProgress={projectProgress}
              nearestDeadline={nearestDeadline}
            />
          </div>
          <div className="md:col-span-5">
            <PersonnelWidget
              project={project}
              isEditing={isEditing}
            />
          </div>
        </div>
      </div>

      {/* ── Grid ─────────────────────────────────────────────────────────── */}
      <ReactGridLayoutWithWidth
        layout={gridLayout}
        cols={12}
        rowHeight={50}
        isDraggable={isEditing}
        isResizable={isEditing}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".drag-handle"
        margin={[12, 12]}
        containerPadding={[0, 0]}
        resizeHandles={["se"]}
      >
        {widgets.map((widget) => (
          <div key={widget.i} style={{ overflow: "hidden" }}>
            <WidgetWrapper
              widgetId={widget.i}
              isEditing={isEditing}
              onRemove={() => handleRemoveWidget(widget.i)}
            >
              <WidgetRenderer
                widget={widget}
                project={project}
                auditLogs={auditLogs}
                canEdit={canEdit}
                isEditing={isEditing}
                derivedStatus={derivedStatus}
                projectProgress={projectProgress}
                nearestDeadline={nearestDeadline}
                onConfigChange={(config) => handleConfigChange(widget.i, config)}
              />
            </WidgetWrapper>
          </div>
        ))}
      </ReactGridLayoutWithWidth>

      {/* ── Add widget panel ─────────────────────────────────────────────── */}
      {showAddPanel && (
        <AddWidgetPanel
          onAdd={handleAddWidget}
          onClose={() => setShowAddPanel(false)}
        />
      )}
    </div>
  );
}
