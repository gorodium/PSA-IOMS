"use client";

import { X } from "lucide-react";
import { WIDGET_CATALOG } from "@/lib/canvas-defaults";
import type { WidgetType } from "@/lib/canvas-types";


interface Props {
  onAdd: (type: WidgetType) => void;
  onClose: () => void;
}

export function AddWidgetPanel({ onAdd, onClose }: Props) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-80 bg-background border-l border-border shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="text-base font-semibold text-foreground">Add Widget</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {/* Widget catalog */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {WIDGET_CATALOG.map((item) => (
            <button
              key={item.type}
              className="w-full text-left rounded-lg border border-border bg-card hover:bg-primary/5 hover:border-primary/40 px-4 py-3 transition-all duration-150 group"
              onClick={() => {
                onAdd(item.type);
                onClose();
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl shrink-0">{item.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
        {/* Footer */}
        <div className="px-4 py-3 border-t border-border shrink-0">
          <p className="text-xs text-muted-foreground text-center">
            Widgets are added at the bottom of the canvas.
          </p>
        </div>
      </div>
    </>
  );
}
