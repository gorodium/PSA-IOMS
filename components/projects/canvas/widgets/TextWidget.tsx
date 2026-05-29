"use client";

import { useState } from "react";
import type { WidgetConfig } from "@/lib/canvas-types";

interface Props {
  config: WidgetConfig;
  isEditing: boolean;
  onConfigChange: (config: WidgetConfig) => void;
}

export function TextWidget({ config, isEditing, onConfigChange }: Props) {
  const [editing, setEditing] = useState(false);
  const content = config.content ?? "Enter your text here…";

  return (
    <div className="h-full w-full flex flex-col p-1">
      {editing && isEditing ? (
        <textarea
          className="flex-1 w-full resize-none rounded border border-border bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          defaultValue={content}
          autoFocus
          onBlur={(e) => {
            onConfigChange({ ...config, content: e.target.value });
            setEditing(false);
          }}
        />
      ) : (
        <div
          className={`flex-1 rounded p-3 text-sm text-foreground whitespace-pre-wrap leading-relaxed ${
            isEditing ? "cursor-text border-2 border-dashed border-primary/30 hover:border-primary/60" : ""
          }`}
          onClick={() => isEditing && setEditing(true)}
        >
          {content}
          {isEditing && (
            <span className="ml-1 text-xs text-muted-foreground">(click to edit)</span>
          )}
        </div>
      )}
    </div>
  );
}
