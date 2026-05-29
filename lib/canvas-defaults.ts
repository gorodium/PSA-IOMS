import type { CanvasWidget, WidgetType } from "./canvas-types";

export const DEFAULT_CANVAS_LAYOUT: CanvasWidget[] = [
  { i: "task-table",           type: "task-table",           x: 0, y: 0, w: 12, h: 12, minW: 6, minH: 4, config: {} },
  { i: "remarks",              type: "remarks",              x: 0, y: 12, w: 6,  h: 8,  minW: 3, minH: 4, config: {} },
  { i: "audit-log",            type: "audit-log",            x: 6, y: 12, w: 6,  h: 8,  minW: 3, minH: 4, config: {} },
];

export const WIDGET_CATALOG: {
  type: WidgetType;
  label: string;
  description: string;
  icon: string;
  defaultW: number;
  defaultH: number;
  minW: number;
  minH: number;
}[] = [
  { type: "data-sections",      label: "Data Sections",         description: "Project monitoring stat cards.",                     icon: "📊", defaultW: 12, defaultH: 5,  minW: 4, minH: 3 },
  { type: "cycles-table",       label: "Project Cycles",        description: "Cycle deadlines and progress table.",                icon: "🔄", defaultW: 12, defaultH: 7,  minW: 6, minH: 4 },
  { type: "task-table",         label: "Task & Deadline Table", description: "Assigned tasks with inline editing.",                icon: "✅", defaultW: 12, defaultH: 9,  minW: 6, minH: 4 },
  { type: "remarks",            label: "Remarks",               description: "Monitoring notes and project updates.",              icon: "💬", defaultW: 6,  defaultH: 8,  minW: 3, minH: 4 },
  { type: "audit-log",          label: "Audit History",         description: "Latest project and task audit records.",            icon: "📜", defaultW: 6,  defaultH: 8,  minW: 3, minH: 4 },
  { type: "info-grid",          label: "Custom Info Grid",      description: "Configurable grid of label/value rows.",            icon: "🗂️", defaultW: 6,  defaultH: 6,  minW: 3, minH: 3 },
  { type: "text",               label: "Text Block",            description: "Free-form text or notes.",                          icon: "📝", defaultW: 6,  defaultH: 4,  minW: 2, minH: 2 },
  { type: "heading",            label: "Section Heading",       description: "A bold section title divider.",                     icon: "🏷️", defaultW: 12, defaultH: 2,  minW: 3, minH: 1 },
];

export function createWidget(type: WidgetType, occupiedY: number): CanvasWidget {
  const catalog = WIDGET_CATALOG.find((c) => c.type === type)!;
  // crypto.randomUUID() works in both browser (HTTPS/localhost) and Node.js
  const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `widget-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return {
    i: id,
    type,
    x: 0,
    y: occupiedY,
    w: catalog.defaultW,
    h: catalog.defaultH,
    minW: catalog.minW,
    minH: catalog.minH,
    config: type === "info-grid"
      ? { gridTitle: "Custom Info", gridSubtitle: "", columns: 2, rows: [] }
      : type === "text"
      ? { content: "Enter your text here…" }
      : type === "heading"
      ? { headingText: "Section Heading", headingLevel: 2 }
      : {},
  };
}

/** Returns the maximum Y + H of all widgets (bottom edge), used when placing new widgets. */
export function getBottomEdge(widgets: CanvasWidget[]): number {
  return widgets.reduce((max, w) => Math.max(max, w.y + w.h), 0);
}
