'use client';

import React, { useRef, useCallback } from 'react';
import { UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ICTMapSeat } from '@/app/(app)/ict-management/infrastructure-map/actions';

// ─── Types ────────────────────────────────────────────────────────────────────

interface EmployeeSeatMarkerProps {
  seat: ICTMapSeat;
  isSelected: boolean;
  showLabels: boolean;
  isEditMode: boolean;
  onSelect: (id: string) => void;
  onDragEnd: (id: string, xPercent: number, yPercent: number) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

const INITIALS_COLORS = [
  'bg-teal-500',
  'bg-sky-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-rose-500',
  'bg-orange-500',
  'bg-emerald-500',
  'bg-cyan-500',
];

function nameToColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return INITIALS_COLORS[Math.abs(hash) % INITIALS_COLORS.length];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EmployeeSeatMarker({
  seat,
  isSelected,
  showLabels,
  isEditMode,
  onSelect,
  onDragEnd,
}: EmployeeSeatMarkerProps) {
  const isDragging = useRef(false);
  const hasMoved   = useRef(false);
  const startPos   = useRef({ x: 0, y: 0 });

  const hasPersonnel = Boolean(seat.personnelName);
  const personName   = seat.personnelName ?? '';
  const photoUrl     = seat.personnelPhotoUrl ?? '';

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
        onSelect(seat.id);
        return;
      }

      const parent = (e.currentTarget as HTMLElement).offsetParent as HTMLElement | null;
      if (!parent) return;

      const rect     = parent.getBoundingClientRect();
      const xPx      = e.clientX - rect.left;
      const yPx      = e.clientY - rect.top;
      const xPercent = Math.min(100, Math.max(0, (xPx / rect.width)  * 100));
      const yPercent = Math.min(100, Math.max(0, (yPx / rect.height) * 100));
      onDragEnd(seat.id, xPercent, yPercent);
    },
    [seat.id, onDragEnd, onSelect],
  );

  const initials  = personName ? getInitials(personName) : '';
  const colorCls  = personName ? nameToColor(personName) : '';

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Seat: ${seat.seatCode}`}
      style={{
        position:  'absolute',
        left:      `${seat.xPercent ?? 50}%`,
        top:       `${seat.yPercent ?? 50}%`,
        transform: 'translate(-50%, -50%)',
        zIndex:    25,
        cursor:    isEditMode ? 'grab' : 'pointer',
        userSelect: 'none',
      }}
      className="group flex flex-col items-center gap-0.5"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={!isEditMode ? () => onSelect(seat.id) : undefined}
      onKeyDown={(e) => { if (e.key === 'Enter') onSelect(seat.id); }}
    >
      {/* Avatar circle */}
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full transition-transform duration-150 group-hover:scale-110',
          isSelected && 'ring-2 ring-primary ring-offset-1',
          hasPersonnel
            ? 'shadow-md'
            : 'border-2 border-dashed border-slate-400 bg-slate-100',
        )}
        style={{ width: 28, height: 28 }}
      >
        {hasPersonnel ? (
          photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoUrl}
              alt={personName}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <span
              className={cn(
                'flex h-full w-full items-center justify-center rounded-full text-[8px] font-bold text-white',
                colorCls,
              )}
            >
              {initials || '?'}
            </span>
          )
        ) : (
          <UserCircle className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
        )}
      </div>

      {/* Labels */}
      {showLabels && (
        <div className="flex flex-col items-center pointer-events-none">
          {personName ? (
            <span className="max-w-[72px] truncate rounded bg-teal-700/80 px-1 py-0.5 text-[8px] font-semibold leading-tight text-white shadow-sm backdrop-blur-sm">
              {personName.split(' ')[0]}
            </span>
          ) : (
            <span className="max-w-[72px] truncate rounded bg-slate-200/90 px-1 py-0.5 text-[8px] leading-tight text-slate-500">
              {seat.seatCode}
            </span>
          )}
          {seat.section && (
            <span className="max-w-[72px] truncate rounded bg-white/70 px-1 py-0.5 text-[7px] leading-tight text-slate-500">
              {seat.section}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
