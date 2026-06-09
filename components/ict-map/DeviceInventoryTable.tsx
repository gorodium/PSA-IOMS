"use client";

import { useState } from "react";
import type { ICTMapDevice, ICTMapFurniture } from "@/app/(app)/ict-management/infrastructure-map/actions";
import { format } from "date-fns";
import {
  CheckCircle, XCircle, AlertTriangle, HelpCircle,
  MoreVertical, Edit, Trash2, Shield, Network, Wifi, Monitor, Laptop, Printer, Server, HardDrive, Camera, Battery, Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const DEVICE_TYPE_LABELS: Record<string, string> = {
  FIREWALL: "Firewall", SWITCH: "Switch", ACCESS_POINT: "Access Point",
  DESKTOP: "Desktop PC", LAPTOP: "Laptop", PRINTER: "Printer",
  SERVER: "Server", NAS: "NAS", CCTV: "CCTV", NVR: "NVR",
  UPS: "UPS", OTHER: "Other",
};

function DeviceTypeIcon({ type }: { type: string }) {
  const cls = "h-4 w-4 text-muted-foreground";
  const icons: Record<string, React.ReactNode> = {
    FIREWALL: <Shield className={cls} />, SWITCH: <Network className={cls} />,
    ACCESS_POINT: <Wifi className={cls} />, DESKTOP: <Monitor className={cls} />,
    LAPTOP: <Laptop className={cls} />, PRINTER: <Printer className={cls} />,
    SERVER: <Server className={cls} />, NAS: <HardDrive className={cls} />,
    CCTV: <Camera className={cls} />, NVR: <Camera className={cls} />,
    UPS: <Battery className={cls} />, OTHER: <Cpu className={cls} />,
  };
  return <>{icons[type] ?? <Cpu className={cls} />}</>;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "ONLINE") return <Badge className="bg-green-500/15 text-green-700 dark:text-green-400 border-green-300 gap-1"><CheckCircle className="h-3 w-3" />Online</Badge>;
  if (status === "OFFLINE") return <Badge className="bg-red-500/15 text-red-700 dark:text-red-400 border-red-300 gap-1"><XCircle className="h-3 w-3" />Offline</Badge>;
  if (status === "WARNING") return <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-300 gap-1"><AlertTriangle className="h-3 w-3" />Warning</Badge>;
  return <Badge variant="outline" className="gap-1 text-muted-foreground"><HelpCircle className="h-3 w-3" />Unknown</Badge>;
}

type Props = {
  devices: ICTMapDevice[];
  furniture: ICTMapFurniture[];
  isAdmin: boolean;
  onEdit: (d: ICTMapDevice) => void;
  onDelete: (id: string) => Promise<void>;
};

export function DeviceInventoryTable({ devices, furniture, isAdmin, onEdit, onDelete }: Props) {
  if (devices.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed p-12 text-center text-sm text-muted-foreground">
        No devices found.
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr className="border-b">
              <th className="font-medium px-4 py-3 text-left">Code</th>
              <th className="font-medium px-4 py-3 text-left">Type & Name</th>
              <th className="font-medium px-4 py-3 text-left">Location / Assig.</th>
              <th className="font-medium px-4 py-3 text-left">Network (IP/MAC)</th>
              <th className="font-medium px-4 py-3 text-left">Status</th>
              <th className="font-medium px-4 py-3 text-left">Last Seen</th>
              {isAdmin && <th className="font-medium px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {devices.map((d) => {
              const furn = furniture.find((f) => f.id === d.furnitureId);
              return (
                <tr key={d.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{d.deviceCode}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <DeviceTypeIcon type={d.type} />
                      <div>
                        <p className="font-medium leading-none">{d.deviceName}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{DEVICE_TYPE_LABELS[d.type] ?? d.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    <div className="space-y-0.5">
                      {d.personnelName && <div className="font-medium text-foreground">{d.personnelName}</div>}
                      {furn && <div>{furn.furnitureCode}</div>}
                      {(d.section || d.room) && <div>{d.section}{d.room ? ` - ${d.room}` : ""}</div>}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    <div className="space-y-0.5">
                      {d.ipAddress && <div>IP: {d.ipAddress}</div>}
                      {d.macAddress && <div>MAC: {d.macAddress}</div>}
                      {d.hostname && <div className="font-sans text-[10px]">{d.hostname}</div>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {d.lastSeenAt ? format(new Date(d.lastSeenAt), "MMM d, HH:mm") : "—"}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(d)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => {
                            if (confirm("Delete this device?")) onDelete(d.id);
                          }}>
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
