"use client";

import { useState, useRef, useEffect } from "react";
import type { WidgetConfig } from "@/lib/canvas-types";

interface Props {
  defaultTitle: string;
  defaultSubtitle?: string;
  config?: WidgetConfig;
  isEditing: boolean;
  onConfigChange?: (config: WidgetConfig) => void;
  actions?: React.ReactNode;
  className?: string;
}

export function WidgetHeader({ defaultTitle, defaultSubtitle, config, isEditing, onConfigChange, actions, className }: Props) {
  const title = config?.customTitle ?? defaultTitle;
  const subtitle = config?.customSubtitle ?? defaultSubtitle ?? "";

  const [editingTitle, setEditingTitle] = useState(false);
  const [editingSubtitle, setEditingSubtitle] = useState(false);
  
  // Ref to handle auto-focus
  const titleInputRef = useRef<HTMLInputElement>(null);
  const subtitleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTitle) titleInputRef.current?.focus();
  }, [editingTitle]);

  useEffect(() => {
    if (editingSubtitle) subtitleInputRef.current?.focus();
  }, [editingSubtitle]);

  const handleTitleChange = (newTitle: string) => {
    if (!onConfigChange) return;
    onConfigChange({ ...config, customTitle: newTitle });
    setEditingTitle(false);
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    if (!onConfigChange) return;
    onConfigChange({ ...config, customSubtitle: newSubtitle });
    setEditingSubtitle(false);
  };

  // If we are in view mode and both title and subtitle are explicitly cleared to whitespace, we might want to hide the header entirely
  // However, it's safer to always render the header strip to house actions, or just render the text if available.
  const isTitleBlank = title.trim() === "";
  const isSubtitleBlank = subtitle.trim() === "";

  if (!isEditing && isTitleBlank && isSubtitleBlank && !actions) {
    return null; // hide header completely if empty and not editing
  }

  return (
    <div className={`px-5 pt-5 pb-3 border-b border-border flex items-start justify-between gap-2 shrink-0 ${className || ""}`}>
      <div className="flex-1 min-w-0">
        {editingTitle && isEditing ? (
          <input
            ref={titleInputRef}
            className="w-full rounded border border-border bg-background px-2 py-1 text-base font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            defaultValue={title}
            placeholder={defaultTitle}
            onBlur={(e) => handleTitleChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTitleChange(e.currentTarget.value)}
          />
        ) : (
          <h3
            className={`text-base font-semibold text-foreground leading-none min-h-5 ${isEditing ? "cursor-pointer hover:text-primary border border-transparent hover:border-dashed hover:border-primary/50 rounded -ml-1 px-1 py-0.5" : ""}`}
            onClick={() => isEditing && setEditingTitle(true)}
            title={isEditing ? "Click to edit title" : undefined}
          >
            {isTitleBlank && isEditing ? <span className="text-muted-foreground italic text-sm">Blank title</span> : title}
          </h3>
        )}

        {(subtitle || isEditing) && (
          <div className="mt-1">
            {editingSubtitle && isEditing ? (
              <input
                ref={subtitleInputRef}
                className="w-full rounded border border-border bg-background px-2 py-0.5 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring mt-1"
                defaultValue={subtitle}
                placeholder={defaultSubtitle ?? "Subtitle (optional)"}
                onBlur={(e) => handleSubtitleChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubtitleChange(e.currentTarget.value)}
              />
            ) : (
              <p
                className={`text-sm text-muted-foreground min-h-4 ${isEditing ? "cursor-pointer hover:text-primary border border-transparent hover:border-dashed hover:border-primary/50 rounded -ml-1 px-1" : ""}`}
                onClick={() => isEditing && setEditingSubtitle(true)}
                title={isEditing ? "Click to edit subtitle" : undefined}
              >
                {isSubtitleBlank && isEditing ? <span className="italic text-xs opacity-60">Blank subtitle</span> : subtitle}
              </p>
            )}
          </div>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
