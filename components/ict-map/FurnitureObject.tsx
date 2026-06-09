'use client';

import React, { useRef, useCallback, useState } from 'react';
import {
  Monitor,
  LayoutDashboard,
  Table2,
  Users,
  Archive,
  BookOpen,
  Printer,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ICTMapFurniture } from '@/app/(app)/ict-management/infrastructure-map/actions';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FurnitureObjectProps {
  furniture: ICTMapFurniture;
  isSelected: boolean;
  showLabels: boolean;
  isEditMode: boolean;
  onSelect: (id: string) => void;
  onDragEnd: (id: string, xPercent: number, yPercent: number) => void;
}

// ─── Style map ────────────────────────────────────────────────────────────────

interface FurnitureStyle {
  bg: string;
  border: string;
  text: string;
}

const FURNITURE_STYLES: Record<string, FurnitureStyle> = {
  COMPUTER_DESK:  { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700'   },
  DESK:           { bg: 'bg-slate-50',  border: 'border-slate-200',  text: 'text-slate-600'  },
  TABLE:          { bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700'  },
  MEETING_TABLE:  { bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700'  },
  NETWORK_RACK:   { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  CABINET:        { bg: 'bg-slate-100', border: 'border-slate-300',  text: 'text-slate-600'  },
  SHELF:          { bg: 'bg-slate-100', border: 'border-slate-300',  text: 'text-slate-600'  },
  PRINTER_TABLE:  { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700'  },
};

const DEFAULT_STYLE: FurnitureStyle = {
  bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600',
};

function FurnitureIcon({ type, className }: { type: string; className?: string }) {
  const cls = cn('w-3 h-3', className);
  switch (type) {
    case 'COMPUTER_DESK': return <Monitor className={cls} strokeWidth={1.5} />;
    case 'DESK':          return <LayoutDashboard className={cls} strokeWidth={1.5} />;
    case 'TABLE':         return <Table2 className={cls} strokeWidth={1.5} />;
    case 'MEETING_TABLE': return <Users className={cls} strokeWidth={1.5} />;
    case 'NETWORK_RACK':  return <Archive className={cls} strokeWidth={1.5} />;
    case 'CABINET':       return <BookOpen className={cls} strokeWidth={1.5} />;
    case 'SHELF':         return <BookOpen className={cls} strokeWidth={1.5} />;
    case 'PRINTER_TABLE': return <Printer className={cls} strokeWidth={1.5} />;
    default:              return <Package className={cls} strokeWidth={1.5} />;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FurnitureObject({
  furniture,
  isSelected,
  showLabels,
  isEditMode,
  onSelect,
  onDragEnd,
}: FurnitureObjectProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const isDragging  = useRef(false);
  const hasMoved    = useRef(false);
  const startPos    = useRef({ x: 0, y: 0 });

  const furnitureType = furniture.type ?? 'DESK';
  const furnitureLabel = furniture.label ?? furniture.furnitureName;
  const style = FURNITURE_STYLES[furnitureType] ?? DEFAULT_STYLE;

  // ── Drag ─────────────────────────────────────────────────────────────────
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
        onSelect(furniture.id);
        return;
      }

      const parent = (e.currentTarget as HTMLElement).offsetParent as HTMLElement | null;
      if (!parent) return;

      const rect     = parent.getBoundingClientRect();
      const xPx      = e.clientX - rect.left;
      const yPx      = e.clientY - rect.top;
      const xPercent = Math.min(100, Math.max(0, (xPx / rect.width)  * 100));
      const yPercent = Math.min(100, Math.max(0, (yPx / rect.height) * 100));
      onDragEnd(furniture.id, xPercent, yPercent);
    },
    [furniture.id, onDragEnd, onSelect],
  );

  const rotation  = furniture.rotation ?? 0;
  const wPct      = furniture.widthPercent  ?? 10;
  const hPct      = furniture.heightPercent ?? 5;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Furniture: ${furniture.furnitureName}`}
      style={{
        position:        'absolute',
        left:            `${furniture.xPercent ?? 10}%`,
        top:             `${furniture.yPercent ?? 10}%`,
        width:           `${wPct}%`,
        height:          `${hPct}%`,
        transform:       `translate(0, 0) rotate(${rotation}deg)`,
        transformOrigin: 'center',
        zIndex:          20,
        cursor:          isEditMode ? 'grab' : 'pointer',
        userSelect:      'none',
        borderRadius:    2,
      }}
      className={cn(
        'border flex flex-col items-center justify-center overflow-hidden transition-shadow duration-150',
        style.bg,
        style.border,
        isSelected && 'border-dashed border-primary ring-2 ring-primary/60',
        !isSelected && 'hover:shadow-md',
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={!isEditMode ? () => onSelect(furniture.id) : undefined}
      onKeyDown={(e) => { if (e.key === 'Enter') onSelect(furniture.id); }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Content */}
      <div className={cn('flex items-center gap-0.5', style.text)}>
        <FurnitureIcon type={furnitureType} className={style.text} />
        {showLabels && (
          <span className="truncate text-[8px] font-medium leading-tight">
            {furnitureLabel}
          </span>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[10px] text-white shadow-lg"
          style={{ transform: `translateX(-50%) rotate(${-rotation}deg)` }}
        >
          {furniture.furnitureName}
          {furniture.furnitureCode && (
            <span className="ml-1 text-slate-300">({furniture.furnitureCode})</span>
          )}
        </div>
      )}
    </div>
  );
}
