'use client';

import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Expand,
  PencilLine,
  Lock,
  Unlock,
  Save,
  Loader2,
  Map,
  Building2,
  Cable,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { MapPresentationMode } from './OfficeMapBackground';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MapToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onFitToScreen: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  mapPresentation: MapPresentationMode;
  onMapPresentationChange: (mode: MapPresentationMode) => void;
  isAdmin: boolean;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  isSaving: boolean;
  onSave: () => void;
  isLocked: boolean;
  onToggleLock: () => void;
}

// ─── Tooltip wrapper ─────────────────────────────────────────────────────────

interface TipButtonProps {
  tooltip: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  activeClass?: string;
  children: React.ReactNode;
  variant?: 'ghost' | 'outline' | 'default' | 'destructive' | 'secondary';
  size?: 'icon' | 'sm';
}

function TipButton({
  tooltip,
  onClick,
  disabled,
  active,
  activeClass,
  children,
  variant = 'ghost',
  size = 'icon',
}: TipButtonProps) {
  return (
    <div className="group relative flex">
      <Button
        variant={variant}
        size={size}
        onClick={onClick}
        disabled={disabled}
        aria-label={tooltip}
        className={cn(
          'h-8 w-8 rounded-md transition-colors',
          active && (activeClass ?? 'bg-primary text-primary-foreground hover:bg-primary/90'),
        )}
      >
        {children}
      </Button>
      <span className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-0.5 text-[10px] text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 z-50">
        {tooltip}
      </span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

const MAP_PRESENTATION_OPTIONS: Array<{
  value: MapPresentationMode;
  label: string;
  icon: React.ElementType;
}> = [
  { value: 'clean', label: 'Clean Layout', icon: Map },
  { value: 'detailed', label: 'Detailed Layout', icon: Building2 },
  { value: 'network', label: 'Network Overlay', icon: Cable },
];
export function MapToolbar({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  onFitToScreen,
  onToggleFullscreen,
  isFullscreen,
  mapPresentation,
  onMapPresentationChange,
  isAdmin,
  isEditMode,
  onToggleEditMode,
  isSaving,
  onSave,
  isLocked,
  onToggleLock,
}: MapToolbarProps) {
  const zoomPct = Math.round(zoom * 100);

  return (
    <div className="flex h-10 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 shadow-sm">
      {/* Zoom controls */}
      <TipButton tooltip="Zoom out (−)" onClick={onZoomOut} disabled={zoom <= 0.25}>
        <ZoomOut className="h-3.5 w-3.5" />
      </TipButton>

      <span className="min-w-[42px] text-center text-[11px] font-semibold tabular-nums text-slate-600">
        {zoomPct}%
      </span>

      <TipButton tooltip="Zoom in (+)" onClick={onZoomIn} disabled={zoom >= 4}>
        <ZoomIn className="h-3.5 w-3.5" />
      </TipButton>

      <Separator orientation="vertical" className="mx-1 h-5" />

      <TipButton tooltip="Reset zoom (100%)" onClick={onResetView}>
        <RotateCcw className="h-3.5 w-3.5" />
      </TipButton>

      <TipButton tooltip="Fit to screen" onClick={onFitToScreen}>
        <Expand className="h-3.5 w-3.5" />
      </TipButton>

      <TipButton
        tooltip={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        onClick={onToggleFullscreen}
      >
        {isFullscreen ? (
          <Minimize2 className="h-3.5 w-3.5" />
        ) : (
          <Maximize2 className="h-3.5 w-3.5" />
        )}
      </TipButton>

      <Separator orientation="vertical" className="mx-1 h-5" />

      <div className="flex items-center rounded-md border border-slate-200 bg-slate-50 p-0.5">
        {MAP_PRESENTATION_OPTIONS.map(({ value, label, icon: Icon }) => {
          const active = mapPresentation === value;
          return (
            <button
              key={value}
              type="button"
              aria-label={label}
              aria-pressed={active}
              onClick={() => onMapPresentationChange(value)}
              className={cn(
                'inline-flex h-7 items-center gap-1 rounded px-2 text-[10px] font-semibold transition-colors',
                active
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:bg-white hover:text-slate-700',
              )}
            >
              <Icon className="h-3 w-3" strokeWidth={1.8} />
              <span className="hidden xl:inline">{label}</span>
            </button>
          );
        })}
      </div>
      {isAdmin && (
        <>
          <Separator orientation="vertical" className="mx-1 h-5" />

          {/* Lock toggle */}
          <TipButton
            tooltip={isLocked ? 'Unlock map' : 'Lock map'}
            onClick={onToggleLock}
            active={isLocked}
            activeClass="bg-amber-100 text-amber-700 hover:bg-amber-200"
          >
            {isLocked ? (
              <Lock className="h-3.5 w-3.5" />
            ) : (
              <Unlock className="h-3.5 w-3.5" />
            )}
          </TipButton>

          {/* Edit toggle */}
          <TipButton
            tooltip={isEditMode ? 'Exit edit mode' : 'Enter edit mode'}
            onClick={onToggleEditMode}
            active={isEditMode}
            activeClass="bg-blue-600 text-white hover:bg-blue-700"
          >
            <PencilLine className="h-3.5 w-3.5" />
          </TipButton>

          {/* Save */}
          {isEditMode && (
            <Button
              size="sm"
              disabled={isSaving}
              onClick={onSave}
              className="ml-1 h-8 gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              <span className="text-[11px] font-semibold">
                {isSaving ? 'Saving…' : 'Save'}
              </span>
            </Button>
          )}
        </>
      )}
    </div>
  );
}
