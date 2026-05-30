import Link from "next/link";
import { Search, Plus, X } from "lucide-react";
import { createPersonnelAction, updatePersonnelAction } from "@/app/(app)/personnel/actions";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { checkUserPermission } from "@/lib/permissions";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PersonnelForm } from "@/components/personnel/PersonnelForm";
import { EmployeeCard } from "@/components/personnel/EmployeeCard";
import { getPositionSgLevel, personnelSectionOptions } from "@/lib/taxonomy";


type PersonnelPageProps = {
  searchParams?: Promise<{
    search?: string;
    active?: string;
    edit?: string;
    add?: string;
    sortBy?: string;
  }>;
};

export default async function PersonnelPage({ searchParams }: PersonnelPageProps) {
  const [params, user] = await Promise.all([searchParams, getCurrentUser()]);
  const canCreate = checkUserPermission(user, "create", "personnel");
  const canUpdate = checkUserPermission(user, "update", "personnel");
  const canDelete = checkUserPermission(user, "manage", "personnel");
  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const searchText = params?.search?.trim().toLowerCase() ?? "";

  const personnel = await db.personnel.findMany({
    include: {
      projectAssignments: {
        include: {
          project: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      }
    },
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
      person.section.toLowerCase().includes(searchText) ||
      (person.email?.toLowerCase().includes(searchText) ?? false) ||
      (person.contactNo?.toLowerCase().includes(searchText) ?? false) ||
      (person.employeeNo?.toLowerCase().includes(searchText) ?? false);
    const matchesActive =
      !params?.active ||
      params.active === "ALL" ||
      (params.active === "ACTIVE" && person.isActive) ||
      (params.active === "INACTIVE" && !person.isActive) ||
      (params.active === "REGULAR" && !person.position.endsWith("*")) ||
      (params.active === "COTERMINOUS" && person.position.endsWith("**") && !person.position.endsWith("***")) ||
      (params.active === "COSW" && person.position.endsWith("*") && !person.position.endsWith("**")) ||
      (params.active === "VEI" && person.position.endsWith("***"));

    return matchesSearch && matchesActive;
  });

  const sortBy = params?.sortBy ?? "fullName_asc";
  filteredPersonnel.sort((a, b) => {
    switch (sortBy) {
      case "fullName_desc":
        return b.fullName.localeCompare(a.fullName);
      case "position_asc": {
        const sgA = getPositionSgLevel(a.position);
        const sgB = getPositionSgLevel(b.position);
        if (sgA !== sgB) {
          return sgA - sgB;
        }
        return a.position.localeCompare(b.position);
      }
      case "position_desc": {
        const sgA = getPositionSgLevel(a.position);
        const sgB = getPositionSgLevel(b.position);
        if (sgA !== sgB) {
          return sgB - sgA;
        }
        return b.position.localeCompare(a.position);
      }
      case "section_asc":
        return a.section.localeCompare(b.section);
      case "section_desc":
        return b.section.localeCompare(a.section);
      case "employeeNo_asc":
        return (a.employeeNo ?? "").localeCompare(b.employeeNo ?? "");
      case "employeeNo_desc":
        return (b.employeeNo ?? "").localeCompare(a.employeeNo ?? "");
      case "email_asc":
        return (a.email ?? "").localeCompare(b.email ?? "");
      case "email_desc":
        return (b.email ?? "").localeCompare(a.email ?? "");
      case "contactNo_asc":
        return (a.contactNo ?? "").localeCompare(b.contactNo ?? "");
      case "contactNo_desc":
        return (b.contactNo ?? "").localeCompare(a.contactNo ?? "");
      case "isActive_asc":
        return (a.isActive === b.isActive) ? 0 : a.isActive ? 1 : -1;
      case "isActive_desc":
        return (a.isActive === b.isActive) ? 0 : a.isActive ? -1 : 1;
      case "updatedAt_asc":
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      case "updatedAt_desc":
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case "fullName_asc":
      default:
        return a.fullName.localeCompare(b.fullName);
    }
  });

  const hasFilter =
    (params?.search && params.search.trim().length > 0) ||
    (params?.active && params.active !== "ALL" && params.active !== "INACTIVE") ||
    (params?.active === "INACTIVE" && params?.search && params.search.trim().length > 0) ||
    (params?.sortBy && params.sortBy !== "fullName_asc");

  const totalEmployees = filteredPersonnel.length;
  const veiCount = filteredPersonnel.filter(p => p.position.endsWith("***")).length;
  const coterminousCount = filteredPersonnel.filter(p => p.position.endsWith("**") && !p.position.endsWith("***")).length;
  const coswCount = filteredPersonnel.filter(p => p.position.endsWith("*") && !p.position.endsWith("**")).length;
  const regularCount = totalEmployees - coterminousCount - coswCount - veiCount;

  const sectionCounts = personnelSectionOptions.reduce((acc, section) => {
    if (section.toLowerCase() !== "head of office" && section.toLowerCase() !== "n/a") {
      acc[section] = 0;
    }
    return acc;
  }, {} as Record<string, number>);

  filteredPersonnel.forEach((p) => {
    if (!p.section || p.section.toLowerCase() === "head of office" || p.section.toLowerCase() === "n/a") return;
    if (sectionCounts[p.section] !== undefined) {
      sectionCounts[p.section]++;
    } else {
      sectionCounts[p.section] = 1;
    }
  });
  
  const sections = Object.entries(sectionCounts).sort((a, b) => a[0].localeCompare(b[0]));

  const editingPersonnel = params?.edit ? personnel.find((person) => person.slug === params.edit) ?? null : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">Employees</h1>
        <p className="mt-1 text-sm text-muted-foreground">Maintain office employees used in project assignments.</p>
      </div>

      {((canCreate && params?.add === "true") || (canUpdate && editingPersonnel)) ? (
        <PersonnelForm action={editingPersonnel ? updatePersonnelAction : createPersonnelAction} personnel={editingPersonnel} canDelete={canDelete} isSuperAdmin={isSuperAdmin} />
      ) : null}

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#1C212E] p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <form className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input name="search" placeholder="Search name, position, or section" defaultValue={params?.search ?? ""} className="pl-9" />
          </div>
          <Select name="active" defaultValue={params?.active ?? "ALL"} aria-label="Active filter" className="w-full md:w-[180px]">
            <option value="ALL">All Employees</option>
            <option value="ACTIVE">Active only</option>
            <option value="REGULAR">Regular Only</option>
            <option value="COTERMINOUS">Coterminous/Contractual Only</option>
            <option value="COSW">COSW Only</option>
            <option value="VEI">VEI Only</option>
            <option value="INACTIVE">Archived</option>
          </Select>
          <Select name="sortBy" defaultValue={params?.sortBy ?? "fullName_asc"} aria-label="Sort by filter" className="w-full md:w-[180px]">
            <option value="fullName_asc">Name (A-Z)</option>
            <option value="fullName_desc">Name (Z-A)</option>
            <option value="position_desc">Position (Highest)</option>
            <option value="position_asc">Position (Lowest)</option>
            <option value="employeeNo_asc">Employee No. (Asc)</option>
            <option value="employeeNo_desc">Employee No. (Desc)</option>
          </Select>
          <div className="flex items-center gap-2">
            <Button type="submit" variant="outline">
              Apply
            </Button>
            {hasFilter && (
              <Button asChild variant="ghost" className="h-10 text-muted-foreground hover:text-foreground">
                <Link href={params?.active === "INACTIVE" ? "/personnel?active=INACTIVE" : "/personnel"}>
                  <X className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  Clear Filter
                </Link>
              </Button>
            )}
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-2 border-t pt-3 md:border-t-0 md:pt-0">
          {params?.active === "INACTIVE" ? (
            <Button asChild variant="secondary">
              <Link href="/personnel">
                <X className="mr-2 h-4 w-4" aria-hidden="true" />
                Close Archive
              </Link>
            </Button>
          ) : (
            <Button asChild variant="secondary">
              <Link href="/personnel?active=INACTIVE">
                View Archived Employees
              </Link>
            </Button>
          )}
          {canCreate && params?.add !== "true" && !editingPersonnel ? (
            <Button asChild>
              <Link href={`/personnel?add=true${params?.search ? `&search=${params.search}` : ""}${params?.active ? `&active=${params.active}` : ""}`}>
                <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                Add Employee
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap justify-center w-full gap-3">
        <div className="w-40 h-24 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#1C212E] p-3 shadow-sm flex flex-col items-center justify-center text-center transition-all hover:shadow-md">
          <span className="text-[10px] sm:text-[11px] uppercase font-semibold text-slate-700 dark:text-slate-300 tracking-wider mb-2 truncate w-full">Total Employees</span>
          <span className="text-3xl font-bold text-slate-900 dark:text-white leading-none">{totalEmployees}</span>
        </div>
        <div className="w-40 h-24 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#1C212E] p-3 shadow-sm flex flex-col items-center justify-center text-center transition-all hover:shadow-md">
          <span className="text-[10px] sm:text-[11px] uppercase font-semibold text-slate-700 dark:text-slate-300 tracking-wider mb-2 truncate w-full">Regular</span>
          <span className="text-3xl font-bold text-slate-900 dark:text-white leading-none">{regularCount}</span>
        </div>
        <div className="w-40 h-24 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#1C212E] p-3 shadow-sm flex flex-col items-center justify-center text-center transition-all hover:shadow-md">
          <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-slate-700 dark:text-slate-300 tracking-wider mb-2 whitespace-normal leading-tight">Coterminous / Contractual</span>
          <span className="text-3xl font-bold text-slate-900 dark:text-white leading-none">{coterminousCount}</span>
        </div>
        <div className="w-40 h-24 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#1C212E] p-3 shadow-sm flex flex-col items-center justify-center text-center transition-all hover:shadow-md">
          <span className="text-[10px] sm:text-[11px] uppercase font-semibold text-slate-700 dark:text-slate-300 tracking-wider mb-2 truncate w-full">COSW</span>
          <span className="text-3xl font-bold text-slate-900 dark:text-white leading-none">{coswCount}</span>
        </div>
        <div className="w-40 h-24 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#1C212E] p-3 shadow-sm flex flex-col items-center justify-center text-center transition-all hover:shadow-md">
          <span className="text-[10px] sm:text-[11px] uppercase font-semibold text-slate-700 dark:text-slate-300 tracking-wider mb-2 truncate w-full">VEI</span>
          <span className="text-3xl font-bold text-slate-900 dark:text-white leading-none">{veiCount}</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center w-full gap-3 mt-2">
        {sections.map(([section, count]) => (
          <div key={section} className="w-40 h-24 rounded-lg border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] p-2 shadow-sm flex flex-col items-center justify-center text-center transition-all hover:shadow-md">
            <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wider mb-2 whitespace-normal leading-tight" title={section}>{section}</span>
            <span className="text-2xl font-bold text-slate-700 dark:text-slate-300 leading-none">{count}</span>
          </div>
        ))}
      </div>

      {sortBy.startsWith("fullName") || sortBy.startsWith("section") ? (
        <div className="space-y-8">
          {sections.map(([section]) => {
            const personnelInSection = filteredPersonnel.filter(p => (p.section || "N/A") === section || (section === "Head of Office" && p.section === "Head of Office"));
            if (personnelInSection.length === 0) return null;
            
            return (
              <div key={section} className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-white/10 pb-2">
                  {section}
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {personnelInSection.map(person => (
                    <EmployeeCard 
                      key={person.id} 
                      personnel={person} 
                      canEdit={canUpdate} 
                      searchParams={params} 
                    />
                  ))}
                </div>
              </div>
            );
          })}
          
          {/* Uncategorized / N/A Section */}
          {(() => {
            const uncategorized = filteredPersonnel.filter(p => !p.section || p.section === "N/A");
            if (uncategorized.length === 0) return null;
            return (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-white/10 pb-2">
                  Uncategorized / Other
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {uncategorized.map(person => (
                    <EmployeeCard 
                      key={person.id} 
                      personnel={person} 
                      canEdit={canUpdate} 
                      searchParams={params} 
                    />
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredPersonnel.map(person => (
            <EmployeeCard 
              key={person.id} 
              personnel={person} 
              canEdit={canUpdate} 
              searchParams={params} 
            />
          ))}
        </div>
      )}
      
      {filteredPersonnel.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center bg-card shadow-sm">
          <div className="rounded-full bg-slate-100 p-3 dark:bg-slate-800">
            <Search className="h-6 w-6 text-slate-500 dark:text-slate-400" aria-hidden="true" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No employees found</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            We couldn&apos;t find any employees matching your search and filter criteria.
          </p>
          {(params?.search || params?.active) && (
            <Button asChild variant="outline" className="mt-6">
              <Link href="/personnel">Clear all filters</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
