"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { InfoGridRow, WidgetConfig } from "@/lib/canvas-types";

function genId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `row-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}


interface Props {
  config: WidgetConfig;
  isEditing: boolean;
  onConfigChange: (config: WidgetConfig) => void;
}

export function InfoGridWidget({ config, isEditing, onConfigChange }: Props) {
  const title = config.gridTitle ?? "Custom Info";
  const subtitle = config.gridSubtitle ?? "";
  const columns = config.columns ?? 2;
  const rows: InfoGridRow[] = config.rows ?? [];

  const [editingTitle, setEditingTitle] = useState(false);

  const updateRow = (id: string, field: "label" | "value", value: string) => {
    onConfigChange({
      ...config,
      rows: rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    });
  };

  const addRow = () => {
    onConfigChange({
      ...config,
      rows: [...rows, { id: genId(), label: "Label", value: "Value" }],
    });
  };

  const removeRow = (id: string) => {
    onConfigChange({ ...config, rows: rows.filter((r) => r.id !== id) });
  };

  const setColumns = (n: number) => {
    onConfigChange({ ...config, columns: n });
  };

  return (
    <div className="h-full flex flex-col overflow-auto">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-border flex items-start justify-between gap-2 shrink-0">
        <div className="flex-1 min-w-0">
          {editingTitle && isEditing ? (
            <div className="space-y-1">
              <input
                className="w-full rounded border border-border bg-background px-2 py-1 text-base font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                defaultValue={title}
                autoFocus
                onBlur={(e) => { onConfigChange({ ...config, gridTitle: e.target.value }); setEditingTitle(false); }}
              />
              <input
                className="w-full rounded border border-border bg-background px-2 py-0.5 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                defaultValue={subtitle}
                placeholder="Subtitle (optional)"
                onBlur={(e) => onConfigChange({ ...config, gridSubtitle: e.target.value })}
              />
            </div>
          ) : (
            <>
              <h3
                className={`text-base font-semibold text-foreground leading-none ${isEditing ? "cursor-pointer hover:text-primary" : ""}`}
                onClick={() => isEditing && setEditingTitle(true)}
              >
                {title}
              </h3>
              {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
            </>
          )}
        </div>
        {isEditing && (
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-xs text-muted-foreground">Cols:</span>
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                className={`w-6 h-6 rounded text-xs font-medium border transition-colors ${
                  columns === n
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
                onClick={() => setColumns(n)}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid body */}
      <div className="flex-1 overflow-auto p-5">
        {rows.length === 0 && !isEditing && (
          <p className="text-sm text-muted-foreground">No information added yet.</p>
        )}
        <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {rows.map((row) =>
            isEditing ? (
              <div key={row.id} className="flex items-start gap-1.5 rounded border border-dashed border-border p-2">
                <div className="flex-1 space-y-1 min-w-0">
                  <input
                    className="w-full rounded border border-border bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground uppercase focus:outline-none focus:ring-1 focus:ring-ring"
                    defaultValue={row.label}
                    onBlur={(e) => updateRow(row.id, "label", e.target.value)}
                    placeholder="Label"
                  />
                  <input
                    className="w-full rounded border border-border bg-background px-2 py-0.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    defaultValue={row.value}
                    onBlur={(e) => updateRow(row.id, "value", e.target.value)}
                    placeholder="Value"
                  />
                </div>
                <button
                  className="shrink-0 text-destructive hover:text-destructive/80 mt-0.5"
                  onClick={() => removeRow(row.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div key={row.id}>
                <p className="text-xs font-medium uppercase text-muted-foreground">{row.label}</p>
                <p className="mt-0.5 text-sm text-foreground">{row.value || "—"}</p>
              </div>
            )
          )}
        </div>

        {isEditing && (
          <button
            className="mt-4 flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium"
            onClick={addRow}
          >
            <Plus className="h-4 w-4" />
            Add row
          </button>
        )}
      </div>
    </div>
  );
}
