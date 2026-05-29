"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { format } from "date-fns";

export type AuditLogRow = {
  id: string;
  userId: string | null;
  action: string;
  entityType: string | null;
  entityId: string | null;
  oldValueJson: unknown;
  newValueJson: unknown;
  createdAt: Date;
  user: {
    name: string;
    username: string;
  } | null;
};

type Props = {
  logs: AuditLogRow[];
};

export function AuditLogsTable({ logs }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [actionFilter, setActionFilter] = useState(searchParams.get("action") || "ALL");
  const [entityTypeFilter, setEntityTypeFilter] = useState(searchParams.get("entityType") || "ALL");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateQueryParams({ search: search || null, action: actionFilter, entityType: entityTypeFilter });
  }

  function updateQueryParams(params: Record<string, string | null>) {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "ALL") {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });
    router.push(url.pathname + url.search);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
          <Input
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Button type="submit" variant="secondary">Search</Button>
        </form>
        
        <div className="flex items-center gap-2">
          <Select value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); updateQueryParams({ search, action: e.target.value, entityType: entityTypeFilter }); }} className="w-[180px]">
            <option value="ALL">All Actions</option>
            <option value="LOGIN">LOGIN</option>
            <option value="CREATE_USER">CREATE_USER</option>
            <option value="UPDATE_USER">UPDATE_USER</option>
            <option value="DISABLE_USER">DISABLE_USER</option>
            <option value="ENABLE_USER">ENABLE_USER</option>
            <option value="UPDATE_PROJECT_PERMISSIONS">UPDATE_PROJECT_PERMISSIONS</option>
            <option value="CREATE_PROJECT">CREATE_PROJECT</option>
            <option value="UPDATE_PROJECT">UPDATE_PROJECT</option>
            <option value="DELETE_PROJECT">DELETE_PROJECT</option>
          </Select>
          
          <Select value={entityTypeFilter} onChange={(e) => { setEntityTypeFilter(e.target.value); updateQueryParams({ search, action: actionFilter, entityType: e.target.value }); }} className="w-[140px]">
            <option value="ALL">All Entities</option>
            <option value="User">User</option>
            <option value="Project">Project</option>
            <option value="ProjectPermission">ProjectPermission</option>
            <option value="Task">Task</option>
          </Select>
        </div>
      </div>

      <div className="rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Date</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Entity ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No logs found.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
                    {format(new Date(log.createdAt), "MMM d, yyyy HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{log.user?.name ?? "System"}</div>
                    {log.user && <div className="text-xs text-muted-foreground">{log.user.username}</div>}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell>{log.entityType || "-"}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{log.entityId || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
