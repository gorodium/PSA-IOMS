'use client';

import React from 'react';
import {
  X,
  Pencil,
  Clock,
  Wifi,
  Cable,
  Globe,
  Server,
  HardDrive,
  Cpu,
  User,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { ICTMapDevice, ICTMapConnection, ICTMapFurniture, ICTMapSeat } from '@/app/(app)/ict-management/infrastructure-map/actions';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DeviceDrawerProps {
  device:      ICTMapDevice | null;
  connections: ICTMapConnection[];
  furniture:   ICTMapFurniture[];
  seats:       ICTMapSeat[];
  isAdmin:     boolean;
  onClose:     () => void;
  onEdit:      (device: ICTMapDevice) => void;
  onDelete:    (id: string) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, string> = {
  ONLINE:  'bg-emerald-100 text-emerald-700 border-emerald-200',
  OFFLINE: 'bg-red-100    text-red-700    border-red-200',
  WARNING: 'bg-amber-100  text-amber-700  border-amber-200',
  UNKNOWN: 'bg-slate-100  text-slate-600  border-slate-200',
};

const DEVICE_TYPE_LABELS: Record<string, string> = {
  FIREWALL:     'Firewall',
  SWITCH:       'Switch',
  ACCESS_POINT: 'Access Point',
  DESKTOP:      'Desktop PC',
  LAPTOP:       'Laptop',
  PRINTER:      'Printer',
  SERVER:       'Server',
  NAS:          'NAS Storage',
  CCTV:         'CCTV Camera',
  NVR:          'NVR',
  UPS:          'UPS',
  OTHER:        'Other',
};

const CONN_TYPE_LABELS: Record<string, string> = {
  LAN:            'LAN',
  WIFI:           'Wi-Fi',
  FIBER:          'Fiber',
  VPN:            'VPN',
  USB:            'USB',
  SHARED_PRINTER: 'Shared Printer',
  UNKNOWN:        'Unknown',
};

function ConnTypeIcon({ type }: { type: string }) {
  const cls = 'h-3 w-3';
  switch (type) {
    case 'WIFI':  return <Wifi  className={cls} />;
    case 'FIBER': return <Globe className={cls} />;
    default:      return <Cable className={cls} />;
  }
}

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

export function DeviceDrawer({
  device,
  connections,
  furniture,
  seats,
  isAdmin,
  onClose,
  onEdit,
  onDelete,
}: DeviceDrawerProps) {
  const isOpen = Boolean(device);

  // Related connections
  const relatedConns = device
    ? connections.filter(
        (c) => c.sourceDeviceId === device.id || c.targetDeviceId === device.id,
      )
    : [];

  // Furniture / seat helpers
  const deviceFurniture = device?.furnitureId
    ? furniture.find((f) => f.id === device.furnitureId)
    : undefined;
  const deviceSeat = device?.employeeSeatId
    ? seats.find((s) => s.id === device.employeeSeatId)
    : undefined;

  return (
    <>
      {/* Backdrop (mobile only) */}
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
        aria-label="Device details panel"
        aria-hidden={!isOpen}
      >
        {!device ? null : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
              <div className="min-w-0 flex-1 pr-2">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 shrink-0 text-slate-500" />
                  <h2 className="truncate text-sm font-semibold text-slate-800">
                    {device.deviceName ?? device.deviceCode}
                  </h2>
                </div>
                <p className="mt-0.5 font-mono text-[10px] text-slate-500">{device.deviceCode}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  className={cn(
                    'rounded-full border px-2 py-0.5 text-[10px] font-semibold',
                    STATUS_BADGE[device.status ?? 'UNKNOWN'] ?? STATUS_BADGE.UNKNOWN,
                  )}
                >
                  {device.status ?? 'UNKNOWN'}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-slate-400 hover:text-slate-700"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {/* Details grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <DetailRow
                  label="Device Type"
                  value={DEVICE_TYPE_LABELS[device.type ?? ''] ?? device.type}
                />
                <DetailRow label="Section"   value={device.section} />
                <DetailRow label="Room"      value={device.room} />
                <DetailRow label="Hostname"  value={device.hostname} />
                <DetailRow label="IP Address" value={
                  <span className="font-mono">{device.ipAddress}</span>
                } />
                <DetailRow label="MAC Address" value={
                  <span className="font-mono text-[11px]">{device.macAddress}</span>
                } />
                <DetailRow label="Furniture"  value={deviceFurniture?.furnitureName} />
                <DetailRow label="Seat / Desk" value={deviceSeat?.seatCode} />
              </div>

              {/* Employee */}
              {device.personnelName && (
                <>
                  <Separator className="my-3" />
                  <div>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                      Assigned To
                    </span>
                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {device.personnelName}
                    </p>

                  </div>
                </>
              )}

              {/* Last seen */}
              {device.lastSeenAt && (
                <>
                  <Separator className="my-3" />
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Clock className="h-3 w-3" />
                    <span>Last seen: {new Date(device.lastSeenAt).toLocaleString('en-PH')}</span>
                  </div>
                </>
              )}

              {/* Remarks */}
              {device.remarks && (
                <>
                  <Separator className="my-3" />
                  <div>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                      Remarks
                    </span>
                    <p className="mt-1 text-[12px] text-slate-700 leading-relaxed">
                      {device.remarks}
                    </p>
                  </div>
                </>
              )}

              {/* Related connections */}
              {relatedConns.length > 0 && (
                <>
                  <Separator className="my-3" />
                  <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                    Connections ({relatedConns.length})
                  </span>
                  <ul className="mt-2 space-y-1.5">
                    {relatedConns.map((conn) => {
                      const isSource = conn.sourceDeviceId === device.id;
                      const otherLabel = isSource
                        ? (conn.targetDeviceCode ?? conn.targetDeviceId)
                        : (conn.sourceDeviceCode ?? conn.sourceDeviceId);
                      return (
                        <li
                          key={conn.id}
                          className="flex items-center gap-2 rounded-md border border-slate-100 bg-slate-50 px-2.5 py-1.5 text-[11px]"
                        >
                          <ConnTypeIcon type={conn.connectionType ?? 'UNKNOWN'} />
                          <span className="font-mono text-slate-600">{otherLabel}</span>
                          <span className="ml-auto shrink-0 text-slate-400">
                            {CONN_TYPE_LABELS[conn.connectionType ?? 'UNKNOWN'] ?? conn.connectionType}
                          </span>
                          {conn.cableLabel && (
                            <span className="text-slate-400">· {conn.cableLabel}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </div>

            {/* Admin Actions */}
            {isAdmin && (
              <div className="border-t border-slate-100 px-4 py-3 flex gap-2">
                <Button
                  className="flex-1 gap-2 bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => onEdit(device)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit Device
                </Button>
                <Button
                  variant="destructive"
                  className="flex-none"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this device?")) {
                      onDelete(device.id);
                    }
                  }}
                  title="Delete Device"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
