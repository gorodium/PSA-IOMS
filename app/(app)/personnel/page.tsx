import { Search } from "lucide-react";
import { createPersonnelAction, updatePersonnelAction } from "@/app/(app)/personnel/actions";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { checkUserPermission } from "@/lib/permissions";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PersonnelForm } from "@/components/personnel/PersonnelForm";
import { PersonnelTable } from "@/components/personnel/PersonnelTable";

type PersonnelPageProps = {
  searchParams?: Promise<{
    search?: string;
    active?: string;
    edit?: string;
  }>;
};

export default async function PersonnelPage({ searchParams }: PersonnelPageProps) {
  const [params, user] = await Promise.all([searchParams, requireUser()]);
  const canCreate = checkUserPermission(user, "create", "personnel");
  const canUpdate = checkUserPermission(user, "update", "personnel");
  const searchText = params?.search?.trim().toLowerCase() ?? "";

  const personnel = await db.personnel.findMany({
    orderBy: [
      {
        isActive: "desc"
      },
      {
        fullName: "asc"
      }
    ]
  });

  const filteredPersonnel = personnel.filter((person) => {
    const matchesSearch =
      searchText.length === 0 ||
      person.fullName.toLowerCase().includes(searchText) ||
      person.position.toLowerCase().includes(searchText) ||
      person.section.toLowerCase().includes(searchText);
    const matchesActive =
      !params?.active ||
      params.active === "ALL" ||
      (params.active === "ACTIVE" && person.isActive) ||
      (params.active === "INACTIVE" && !person.isActive);

    return matchesSearch && matchesActive;
  });

  const editingPersonnel = params?.edit ? personnel.find((person) => person.id === params.edit) ?? null : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950">Personnel</h1>
        <p className="mt-1 text-sm text-muted-foreground">Maintain office personnel used in project assignments.</p>
      </div>

      {(canCreate || (canUpdate && editingPersonnel)) ? (
        <PersonnelForm action={editingPersonnel ? updatePersonnelAction : createPersonnelAction} personnel={editingPersonnel} />
      ) : null}

      <form className="grid gap-3 rounded-lg border bg-white p-4 sm:grid-cols-[minmax(0,1fr)_220px_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input name="search" placeholder="Search name, position, or section" defaultValue={params?.search ?? ""} className="pl-9" />
        </div>
        <Select name="active" defaultValue={params?.active ?? "ALL"} aria-label="Active filter">
          <option value="ALL">Active and inactive</option>
          <option value="ACTIVE">Active only</option>
          <option value="INACTIVE">Inactive only</option>
        </Select>
        <Button type="submit" variant="outline">
          Apply
        </Button>
      </form>

      <PersonnelTable personnel={filteredPersonnel} canEdit={canUpdate} />
    </div>
  );
}
