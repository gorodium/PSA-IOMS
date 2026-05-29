"use client";

import { GripVertical, X } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  widgetId: string;
  isEditing: boolean;
  onRemove: () => void;
  children: ReactNode;
}

export function WidgetWrapper({ isEditing, onRemove, children }: Props) {
  return (
    <div
      className={`h-full flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden transition-all duration-200 ${
        isEditing
          ? "border-primary/40 ring-2 ring-primary/10 shadow-md"
          : "border-border"
      }`}
    >
      {/* Drag handle strip — only visible in edit mode */}
      {isEditing && (
        <div className="flex items-center justify-between px-4 py-2 bg-primary/5 dark:bg-primary/10 border-b border-primary/20 shrink-0">
          <div className="drag-handle flex items-center gap-1.5 text-primary/60 cursor-grab active:cursor-grabbing grow h-full">
            <GripVertical className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide select-none">
              Drag to move
            </span>
          </div>
          <button
            className="rounded-full p-0.5 text-destructive hover:bg-destructive/10 transition-colors z-10"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
            title="Remove widget"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      {/* Widget content */}
      <div className="flex-1 min-h-0 overflow-auto">
        {children}
      </div>
    </div>
  );
}
