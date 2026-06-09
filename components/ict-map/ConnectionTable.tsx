"use client";

import type { ICTMapConnection } from "@/app/(app)/ict-management/infrastructure-map/actions";
import { format } from "date-fns";
import { MoreVertical, Edit, Trash2, Cable, ShieldCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const CONN_TYPE_LABELS: Record<string, string> = {
  LAN: "LAN Cable", WIFI: "Wi-Fi", FIBER: "Fiber/Uplink",
  VPN: "VPN Tunnel", USB: "USB", SHARED_PRINTER: "Shared Printer", UNKNOWN: "Unknown",
};

type Props = {
  connections: ICTMapConnection[];
  isAdmin: boolean;
  onEdit: (c: ICTMapConnection) => void;
  onDelete: (id: string) => Promise<void>;
};

export function ConnectionTable({ connections, isAdmin, onEdit, onDelete }: Props) {
  if (connections.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed p-12 text-center text-sm text-muted-foreground">
        No connections mapped yet.
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr className="border-b">
              <th className="font-medium px-4 py-3 text-left">Source Device</th>
              <th className="font-medium px-4 py-3 text-left">Port</th>
              <th className="font-medium px-4 py-3 text-center">→</th>
              <th className="font-medium px-4 py-3 text-left">Target Device</th>
              <th className="font-medium px-4 py-3 text-left">Port</th>
              <th className="font-medium px-4 py-3 text-left">Connection Details</th>
              <th className="font-medium px-4 py-3 text-center">Verified</th>
              {isAdmin && <th className="font-medium px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {connections.map((c) => (
              <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{c.sourceDeviceName}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">{c.sourceDeviceCode}</p>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{c.sourcePort ?? "—"}</td>
                <td className="px-4 py-3 text-center text-muted-foreground"><Cable className="h-4 w-4 mx-auto opacity-50" /></td>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{c.targetDeviceName}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">{c.targetDeviceCode}</p>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{c.targetPort ?? "—"}</td>
                <td className="px-4 py-3 text-xs">
                  <div className="font-medium">{CONN_TYPE_LABELS[c.connectionType] ?? c.connectionType}</div>
                  {c.cableLabel && <div className="text-muted-foreground font-mono">Cable: {c.cableLabel}</div>}
                  {c.remarks && <div className="text-muted-foreground line-clamp-1" title={c.remarks}>{c.remarks}</div>}
                </td>
                <td className="px-4 py-3 text-center">
                  {c.isVerified ? <ShieldCheck className="h-4 w-4 text-green-500 mx-auto" /> : <XCircle className="h-4 w-4 text-muted-foreground opacity-30 mx-auto" />}
                </td>
                {isAdmin && (
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(c)}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => {
                          if (confirm("Delete this connection?")) onDelete(c.id);
                        }}>
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
