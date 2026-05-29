"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Plus, Pencil } from "lucide-react";
import { saveUserAction } from "@/app/(app)/admin/users/actions";
import type { AdminUserRow } from "./UsersTable";

type Props = {
  user?: AdminUserRow;
  personnelList: { id: string; fullName: string; employeeNo: string | null; section: string }[];
};

export function UserFormDialog({ user, personnelList }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {user ? (
          <Button variant="outline" size="icon" title="Edit User">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {user ? "Update user account details and roles." : "Create a new user account. A default password will be generated."}
          </DialogDescription>
        </DialogHeader>
        <form action={async (formData) => {
          await saveUserAction(formData);
          setIsOpen(false);
        }} className="space-y-4 pt-4">
          {user && <input type="hidden" name="id" value={user.id} />}
          
          {user && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" defaultValue={user?.name} required />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" defaultValue={user?.username} required />
          </div>
          
          {user && (
            <div className="space-y-2">
              <Label htmlFor="email">Email Address (Optional)</Label>
              <Input id="email" name="email" type="email" defaultValue={user?.email || ""} />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="role">System Role</Label>
            <Select name="role" defaultValue={user?.role || "EMPLOYEE"}>
              <option value="" disabled>Select a role</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPERVISOR">Supervisor</option>
              <option value="EMPLOYEE">Project Editor</option>
              <option value="VIEWER">Viewer</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="personnelId">Linked Personnel (Optional)</Label>
            <Select name="personnelId" defaultValue={user?.personnelId || "NONE"}>
              <option value="" disabled>Link to Personnel</option>
              <option value="NONE">None</option>
              {personnelList.map(p => (
                <option key={p.id} value={p.id}>{p.fullName} {p.employeeNo ? `(${p.employeeNo})` : ""}</option>
              ))}
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {user ? "Save Changes" : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
