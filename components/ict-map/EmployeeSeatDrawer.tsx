"use client";

import type { ICTMapSeat, ICTMapDevice, ICTMapFurniture } from "@/app/(app)/ict-management/infrastructure-map/actions";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  X, Edit, User, MapPin, Hash, Building2, Monitor, Laptop, Printer,
  Server, HardDrive, Shield, Network, Wifi, Camera, Battery, Cpu, Trash2
} from "lucide-react";

function DeviceTypeIcon({ type }: { type: string }) {
  const cls = "h-4 w-4";
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

function InfoRow({ label, value }: { label: string; value?: string | null | React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-2 gap-2 py-1.5 border-b last:border-0">
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
      <span className="text-xs text-right break-all">{value}</span>
    </div>
  );
}

type Props = {
  seat: ICTMapSeat | null;
  devices: ICTMapDevice[];
  furniture: ICTMapFurniture[];
  isAdmin: boolean;
  onClose: () => void;
  onEdit: (seat: ICTMapSeat) => void;
  onDelete: (id: string) => void;
};

export function EmployeeSeatDrawer({ seat, devices, furniture, isAdmin, onClose, onEdit, onDelete }: Props) {
  const isOpen = seat !== null;
  const assignedFurniture = furniture.find((f) => f.id === seat?.furnitureId);

  return (
    <>
      {isOpen && (
        <div className="absolute inset-0 bg-black/20 lg:hidden z-30" onClick={onClose} />
      )}
      <div
        className={cn(
          "absolute right-0 top-0 bottom-0 z-40 w-80 lg:w-96 flex flex-col bg-background border-l shadow-xl transition-transform duration-200",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {!seat ? null : (
          <>
            <div className="flex items-start justify-between p-4 border-b">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {seat.personnelPhotoUrl ? (
                  <img src={seat.personnelPhotoUrl} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover border" />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-500/10 text-teal-600 border border-teal-500/20">
                    <User className="h-5 w-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{seat.personnelName ?? "Vacant Seat"}</p>
                  <p className="text-xs text-muted-foreground font-mono truncate">{seat.seatCode}</p>
                </div>
              </div>
              <button onClick={onClose} className="ml-2 shrink-0 rounded p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Assignment Details</p>
                {seat.personnelName && <InfoRow label="Position" value={seat.personnelPosition ?? "—"} />}
                {seat.personnelName && <InfoRow label="Section" value={seat.personnelSection ?? "—"} />}
                <InfoRow label="Desk/Table" value={assignedFurniture ? `${assignedFurniture.furnitureCode} – ${assignedFurniture.furnitureName}` : "—"} />
                <InfoRow label="Location Section" value={seat.section ?? "—"} />
                <InfoRow label="Room" value={seat.room ?? "—"} />
              </div>

              {devices.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Assigned Devices ({devices.length})</p>
                    <div className="space-y-2">
                      {devices.map((d) => (
                        <div key={d.id} className="flex items-center gap-2 p-2 border rounded-md bg-muted/20">
                          <div className="text-muted-foreground"><DeviceTypeIcon type={d.type} /></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{d.deviceName}</p>
                            <p className="text-[10px] text-muted-foreground font-mono truncate">{d.deviceCode}</p>
                          </div>
                          <Badge variant="outline" className={cn(
                            "text-[9px] py-0",
                            d.status === "ONLINE" && "border-green-300 text-green-700 bg-green-50",
                            d.status === "OFFLINE" && "border-red-300 text-red-700 bg-red-50",
                          )}>{d.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {seat.remarks && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Remarks</p>
                    <p className="text-xs text-muted-foreground">{seat.remarks}</p>
                  </div>
                </>
              )}
            </div>

            {isAdmin && (
              <div className="p-4 border-t flex gap-2">
                <Button size="sm" className="flex-1" onClick={() => onEdit(seat)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Seat Details
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-none"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this seat?")) {
                      onDelete(seat.id);
                    }
                  }}
                  title="Delete Seat"
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
