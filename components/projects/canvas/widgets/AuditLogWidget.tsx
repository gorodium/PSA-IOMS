import type { SerializedAuditLog, WidgetConfig } from "@/lib/canvas-types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime, formatEnumLabel } from "@/lib/format";
import { WidgetHeader } from "./WidgetHeader";

interface Props {
  auditLogs: SerializedAuditLog[];
  config?: WidgetConfig;
  isEditing?: boolean;
  onConfigChange?: (config: WidgetConfig) => void;
}

export function AuditLogWidget({ auditLogs, config, isEditing, onConfigChange }: Props) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <WidgetHeader
        defaultTitle="Activity Log"
        config={config}
        isEditing={!!isEditing}
        onConfigChange={onConfigChange}
      />
      <div className="flex-1 overflow-auto p-5 space-y-4">
        {auditLogs.length === 0 ? (
          <div className="rounded-lg border border-border bg-muted/20 dark:bg-slate-900/50 p-6 text-sm text-muted-foreground">
            No audit records found.
          </div>
        ) : (
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>By</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        log.action === "CREATE"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : log.action === "DELETE"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                      }`}>
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">{formatEnumLabel(log.entityType)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{log.user?.name ?? "System"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDateTime(log.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
