import Link from "next/link";
import { FileText, MessageSquare } from "lucide-react";
import { db } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/auth";
import { UsersTable } from "@/components/admin/users/UsersTable";
import type { AdminUserRow } from "@/components/admin/users/UsersTable";
import { UserFormDialog } from "@/components/admin/users/UserFormDialog";
import { Button } from "@/components/ui/button";
import { UserRole, type Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type UsersPageProps = {
  searchParams?: Promise<{
    search?: string;
    role?: string;
    status?: string;
  }>;
};

export default async function AdminUsersPage({ searchParams }: UsersPageProps) {
  await requireSuperAdmin();

  const params = await searchParams;
  const search = params?.search?.trim();
  const role = params?.role;
  const status = params?.status;

  const where: Prisma.UserWhereInput = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { employeeId: { contains: search, mode: "insensitive" } }
      ]
    }),
    ...(role && role !== "ALL" && { role: role as UserRole }),
    ...(status === "ACTIVE" && { isActive: true }),
    ...(status === "DISABLED" && { isActive: false })
  };

  const users = await db.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      personnel: {
        select: {
          fullName: true,
          section: true
        }
      }
    }
  });

  // We should also get personnel list to link users to personnel
  const personnelList = await db.personnel.findMany({
    where: { isActive: true },
    select: { id: true, fullName: true, employeeNo: true, section: true },
    orderBy: { fullName: "asc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">User Account Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage system users, roles, and access.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/settings/chat">
              <MessageSquare className="h-4 w-4" />
              Chat Channels
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/settings/pdf-templates">
              <FileText className="h-4 w-4" />
              PDF Templates
            </Link>
          </Button>
          <UserFormDialog personnelList={personnelList} />
        </div>
      </div>

      <UsersTable users={users as AdminUserRow[]} personnelList={personnelList} />
    </div>
  );
}
