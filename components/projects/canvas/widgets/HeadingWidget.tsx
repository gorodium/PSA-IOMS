"use client";

import { useState } from "react";
import type { WidgetConfig } from "@/lib/canvas-types";

interface Props {
  config: WidgetConfig;
  isEditing: boolean;
  onConfigChange: (config: WidgetConfig) => void;
}

const tagMap = { 1: "h1", 2: "h2", 3: "h3" } as const;
const sizeMap = {
  1: "text-2xl font-bold tracking-tight",
  2: "text-xl font-semibold tracking-normal",
  3: "text-lg font-semibold",
};

export function HeadingWidget({ config, isEditing, onConfigChange }: Props) {
  const [editing, setEditing] = useState(false);
  const text = config.headingText ?? "Section Heading";
  const level = config.headingLevel ?? 2;
  const Tag = tagMap[level];

  return (
    <div className="h-full flex flex-col justify-center px-4 gap-2">
      {editing && isEditing ? (
        <div className="flex gap-2 items-center">
          <input
            className="flex-1 rounded border border-border bg-background px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            defaultValue={text}
            autoFocus
            onBlur={(e) => {
              onConfigChange({ ...config, headingText: e.target.value });
              setEditing(false);
            }}
          />
          <select
            className="rounded border border-border bg-background px-2 py-1.5 text-sm text-foreground focus:outline-none"
            value={level}
            onChange={(e) => onConfigChange({ ...config, headingLevel: Number(e.target.value) as 1 | 2 | 3 })}
          >
            <option value={1}>H1</option>
            <option value={2}>H2</option>
            <option value={3}>H3</option>
          </select>
        </div>
      ) : (
        <Tag
          className={`${sizeMap[level]} text-foreground ${isEditing ? "cursor-text" : ""}`}
          onClick={() => isEditing && setEditing(true)}
        >
          {text}
          {isEditing && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">(click to edit)</span>
          )}
        </Tag>
      )}
    </div>
  );
}
