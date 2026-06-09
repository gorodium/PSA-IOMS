'use client';

import React from 'react';
import { X, Pencil, LayoutDashboard, UserCircle, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { ICTMapFurniture, ICTMapSeat, ICTMapDevice } from '@/app/(app)/ict-management/infrastructure-map/actions';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FurnitureDrawerProps {
  furniture: ICTMapFurniture | null;
  seats:     ICTMapSeat[];
  devices:   ICTMapDevice[];
  isAdmin:   boolean;
  onClose:   () => void;
  onEdit:    (f: ICTMapFurniture) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FURNITURE_TYPE_LABELS: Record<string, string> = {
  COMPUTER_DESK: 'Computer Desk',
  DESK:          'Desk',
  TABLE:         'Table',
  MEETING_TABLE: 'Meeting Table',
  NETWORK_RACK:  'Network Rack',
  CABINET:       'Cabinet',
  SHELF:         'Shelf',
  PRINTER_TABLE: 'Printer Table',
};

const DEVICE_STATUS_BADGE: Record<string, string> = {
  ONLINE:  'bg-emerald-100 text-emerald-700 border-emerald-200',
  OFFLINE: 'bg-red-100    text-red-700    border-red-200',
  WARNING: 'bg-amber-100  text-amber-700  border-amber-200',
  UNKNOWN: 'bg-slate-100  text-slate-500  border-slate-200',
};

function DetailRow({ label, value }: { label: string; value?: React.ReactNode }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <span className="truncate text-[12px] text-slate-800">{value}</span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FurnitureDrawer({
  furniture,
  seats,
  devices,
  isAdmin,
  onClose,
  onEdit,
}: FurnitureDrawerProps) {
  const isOpen = Boolean(furniture);

  const linkedSeats   = furniture
    ? seats.filter((s) => s.furnitureId === furniture.id)
    : [];
  const linkedDevices = furniture
    ? devices.filter((d) => d.furnitureId === furniture.id)
    : [];

  return (
    <>
      {/* Backdrop (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          'fixed right-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-[380px] max-w-full flex-col border-l border-slate-200 bg-white shadow-xl transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        aria-label="Furniture details panel"
        aria-hidden={!isOpen}
      >
        {!furniture ? null : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
              <div className="min-w-0 flex-1 pr-2">
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4 shrink-0 text-slate-500" />
                  <h2 className="truncate text-sm font-semibold text-slate-800">
                    {furniture.furnitureName}
                  </h2>
                </div>
                {furniture.furnitureCode && (
                  <p className="mt-0.5 font-mono text-[10px] text-slate-500">
                    {furniture.furnitureCode}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 text-slate-400 hover:text-slate-700"
                onClick={onClose}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {/* Details */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <DetailRow
                  label="Type"
                  value={
                    FURNITURE_TYPE_LABELS[furniture.type ?? ''] ??
                    furniture.type
                  }
                />
                <DetailRow label="Label"   value={furniture.label} />
                <DetailRow label="Section" value={furniture.section} />
                <DetailRow label="Room"    value={furniture.room} />
              </div>

              {/* Remarks */}
              {furniture.remarks && (
                <>
                  <Separator className="my-3" />
                  <div>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                      Remarks
                    </span>
                    <p className="mt-1 text-[12px] text-slate-700 leading-relaxed">
                      {furniture.remarks}
                    </p>
                  </div>
                </>
              )}

              {/* Seats at this furniture */}
              {linkedSeats.length > 0 && (
                <>
                  <Separator className="my-3" />
                  <div>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                      Seats ({linkedSeats.length})
                    </span>
                    <ul className="mt-2 space-y-1.5">
                      {linkedSeats.map((s) => {
                        const name = s.personnelName;
                        return (
                          <li
                            key={s.id}
                            className="flex items-center gap-2 rounded-md border border-slate-100 bg-slate-50 px-2.5 py-1.5"
                          >
                            <UserCircle className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[11px] font-medium text-slate-700">
                                {name ?? 'Unassigned'}
                              </p>
                              <p className="font-mono text-[9px] text-slate-400">
                                {s.seatCode}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </>
              )}

              {/* Devices at this furniture */}
              {linkedDevices.length > 0 && (
                <>
                  <Separator className="my-3" />
                  <div>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                      Devices ({linkedDevices.length})
                    </span>
                    <ul className="mt-2 space-y-1.5">
                      {linkedDevices.map((d) => (
                        <li
                          key={d.id}
                          className="flex items-center gap-2 rounded-md border border-slate-100 bg-slate-50 px-2.5 py-1.5"
                        >
                          <Cpu className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[11px] font-medium text-slate-700">
                              {d.deviceName ?? d.deviceCode}
                            </p>
                            {d.ipAddress && (
                              <p className="font-mono text-[9px] text-slate-400">
                                {d.ipAddress}
                              </p>
                            )}
                          </div>
                          <Badge
                            className={cn(
                              'shrink-0 rounded-full border px-1.5 py-0 text-[9px] font-semibold',
                              DEVICE_STATUS_BADGE[d.status ?? 'UNKNOWN'] ??
                                DEVICE_STATUS_BADGE.UNKNOWN,
                            )}
                          >
                            {d.status ?? 'UNKNOWN'}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            {isAdmin && (
              <div className="border-t border-slate-100 px-4 py-3">
                <Button
                  className="w-full gap-2 bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => onEdit(furniture)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit Furniture
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
