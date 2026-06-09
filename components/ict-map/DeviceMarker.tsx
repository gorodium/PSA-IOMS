'use client';

import React, { useRef, useCallback } from 'react';
import {
  ShieldCheck,
  Network,
  Wifi,
  Monitor,
  Laptop,
  Printer,
  Server,
  HardDrive,
  Camera,
  Battery,
  Cpu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ICTMapDevice } from '@/app/(app)/ict-management/infrastructure-map/actions';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DeviceMarkerProps {
  device: ICTMapDevice;
  isSelected: boolean;
  showLabels: boolean;
  isEditMode: boolean;
  onSelect: (id: string) => void;
  onDragEnd: (id: string, xPercent: number, yPercent: number) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_RING: Record<string, string> = {
  ONLINE:  'ring-2 ring-green-500',
  OFFLINE: 'ring-2 ring-red-500',
  WARNING: 'ring-2 ring-amber-500',
  UNKNOWN: 'ring-2 ring-slate-400',
};

const STATUS_BG: Record<string, string> = {
  ONLINE:  'bg-green-500',
  OFFLINE: 'bg-red-500',
  WARNING: 'bg-amber-500',
  UNKNOWN: 'bg-slate-400',
};

const STATUS_ICON_COLOR: Record<string, string> = {
  ONLINE:  'text-green-700',
  OFFLINE: 'text-red-700',
  WARNING: 'text-amber-700',
  UNKNOWN: 'text-slate-500',
};

function DeviceIcon({ type, className }: { type: string; className?: string }) {
  const props = { className: cn('w-4 h-4', className), strokeWidth: 1.8 };
  switch (type) {
    case 'FIREWALL':      return <ShieldCheck {...props} />;
    case 'SWITCH':        return <Network {...props} />;
    case 'ACCESS_POINT':  return <Wifi {...props} />;
    case 'DESKTOP':       return <Monitor {...props} />;
    case 'LAPTOP':        return <Laptop {...props} />;
    case 'PRINTER':       return <Printer {...props} />;
    case 'SERVER':        return <Server {...props} />;
    case 'NAS':           return <HardDrive {...props} />;
    case 'CCTV':
    case 'NVR':           return <Camera {...props} />;
    case 'UPS':           return <Battery {...props} />;
    default:              return <Cpu {...props} />;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DeviceMarker({
  device,
  isSelected,
  showLabels,
  isEditMode,
  onSelect,
  onDragEnd,
}: DeviceMarkerProps) {
  const isDragging = useRef(false);
  const startPos   = useRef({ x: 0, y: 0 });
  const hasMoved   = useRef(false);

  const status       = device.status ?? 'UNKNOWN';
  const ringClass    = STATUS_RING[status]      ?? STATUS_RING.UNKNOWN;
  const dotBgClass   = STATUS_BG[status]        ?? STATUS_BG.UNKNOWN;
  const iconColor    = STATUS_ICON_COLOR[status] ?? STATUS_ICON_COLOR.UNKNOWN;

  // ── Drag handlers ────────────────────────────────────────────────────────
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isEditMode) return;
      e.preventDefault();
      e.stopPropagation();
      isDragging.current = true;
      hasMoved.current   = false;
      startPos.current   = { x: e.clientX, y: e.clientY };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [isEditMode],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current) return;
      const dx = Math.abs(e.clientX - startPos.current.x);
      const dy = Math.abs(e.clientY - startPos.current.y);
      if (dx > 3 || dy > 3) hasMoved.current = true;
    },
    [],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current) return;
      isDragging.current = false;

      if (!hasMoved.current) {
        onSelect(device.id);
        return;
      }

      // Find parent container (the map canvas)
      const parent = (e.currentTarget as HTMLElement).offsetParent as HTMLElement | null;
      if (!parent) return;

      const rect    = parent.getBoundingClientRect();
      const xPx     = e.clientX - rect.left;
      const yPx     = e.clientY - rect.top;
      const xPercent = Math.min(100, Math.max(0, (xPx / rect.width)  * 100));
      const yPercent = Math.min(100, Math.max(0, (yPx / rect.height) * 100));
      onDragEnd(device.id, xPercent, yPercent);
    },
    [device.id, onDragEnd, onSelect],
  );

  // ── Click (view mode) ────────────────────────────────────────────────────
  const handleClick = useCallback(() => {
    if (!isEditMode) onSelect(device.id);
  }, [device.id, isEditMode, onSelect]);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Device: ${device.deviceCode}`}
      style={{
        position:  'absolute',
        left:      `${device.xPercent ?? 50}%`,
        top:       `${device.yPercent ?? 50}%`,
        transform: 'translate(-50%, -50%)',
        zIndex:    30,
        cursor:    isEditMode ? 'grab' : 'pointer',
        userSelect: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={!isEditMode ? handleClick : undefined}
      onKeyDown={(e) => { if (e.key === 'Enter') onSelect(device.id); }}
      className="group flex flex-col items-center gap-0.5"
    >
      {/* Icon circle */}
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full border-2 border-white bg-white shadow-md transition-transform duration-150 group-hover:scale-110',
          ringClass,
          isSelected && 'ring-2 ring-primary ring-offset-1',
        )}
        style={{ width: 28, height: 28 }}
      >
        <DeviceIcon type={device.type ?? 'OTHER'} className={iconColor} />

        {/* Status dot */}
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white',
            dotBgClass,
          )}
        />
      </div>

      {/* Labels */}
      {showLabels && (
        <div className="flex flex-col items-center pointer-events-none">
          <span className="max-w-[80px] truncate rounded bg-white/80 px-1 py-0.5 text-[9px] font-semibold leading-tight text-slate-700 shadow-sm backdrop-blur-sm">
            {device.deviceCode}
          </span>
          {device.ipAddress && (
            <span className="max-w-[80px] truncate rounded bg-slate-700/70 px-1 py-0.5 text-[8px] leading-tight text-white backdrop-blur-sm">
              {device.ipAddress}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
