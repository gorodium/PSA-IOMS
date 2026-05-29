"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { UserFormDialog } from "./UserFormDialog";
import { KeyRound, Ban, CheckCircle } from "lucide-react";
import { toggleUserStatusAction, resetUserPasswordAction } from "@/app/(app)/admin/users/actions";

export type AdminUserRow = {
  id: string;
  name: string;
  username: string;
  email: string | null;
  role: string;
  isActive: boolean;
  employeeId: string | null;
  section: string | null;
  personnelId: string | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  personnel: {
    fullName: string;
    section: string;
  } | null;
};

type Props = {
  users: AdminUserRow[];
  personnelList: { id: string; fullName: string; employeeNo: string | null; section: string }[];
};

export function UsersTable({ users, personnelList }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [role, setRole] = useState(searchParams.get("role") || "ALL");
  const [status, setStatus] = useState(searchParams.get("status") || "ALL");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateQueryParams({ search: search || null, role, status });
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
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Button type="submit" variant="secondary">Search</Button>
        </form>
        
        <div className="flex items-center gap-2">
          <Select value={role} onChange={(e) => { setRole(e.target.value); updateQueryParams({ search, role: e.target.value, status }); }} className="w-[140px]">
            <option value="" disabled>All Roles</option>
            <option value="ALL">All Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPERVISOR">Supervisor</option>
            <option value="EMPLOYEE">Project Editor</option>
            <option value="VIEWER">Viewer</option>
          </Select>
          
          <Select value={status} onChange={(e) => { setStatus(e.target.value); updateQueryParams({ search, role, status: e.target.value }); }} className="w-[140px]">
            <option value="" disabled>All Status</option>
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="DISABLED">Disabled</option>
          </Select>
        </div>
      </div>

      <div className="rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Username / Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Section</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium">{user.name}</div>
                    {user.employeeId && <div className="text-xs text-muted-foreground">ID: {user.employeeId}</div>}
                  </TableCell>
                  <TableCell>
                    <div>{user.username}</div>
                    {user.email && <div className="text-xs text-muted-foreground">{user.email}</div>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === "SUPER_ADMIN" ? "default" : "outline"}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.isActive ? (
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Active</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-rose-100 text-rose-800 hover:bg-rose-100">Disabled</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user.section || user.personnel?.section || "-"}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <UserFormDialog user={user} personnelList={personnelList} />
                      
                      {user.role !== "SUPER_ADMIN" && (
                        <form action={toggleUserStatusAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <input type="hidden" name="isActive" value={(!user.isActive).toString()} />
                          <Button 
                            type="submit" 
                            size="icon" 
                            variant="outline" 
                            title={user.isActive ? "Disable User" : "Enable User"}
                            className={user.isActive ? "text-rose-600 hover:text-rose-700 hover:bg-rose-50" : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"}
                          >
                            {user.isActive ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </Button>
                        </form>
                      )}
                      
                      <form action={resetUserPasswordAction}>
                        <input type="hidden" name="userId" value={user.id} />
                        <Button type="submit" size="icon" variant="outline" title="Reset Password" onClick={(e) => {
                          if (!confirm("Reset password for this user? This will set their password to a default temporary password and force them to change it on their next login.")) {
                            e.preventDefault();
                          }
                        }}>
                          <KeyRound className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
