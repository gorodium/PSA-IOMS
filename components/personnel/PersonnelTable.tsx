import Link from "next/link";
import { Pencil, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/format";

export type PersonnelTableRow = {
  id: string;
  slug: string;
  employeeNo: string | null;
  fullName: string;
  position: string;
  section: string;
  email: string | null;
  contactNo: string | null;
  isActive: boolean;
  updatedAt: Date;
};

export function PersonnelTable({
  personnel,
  canEdit,
  searchParams
}: {
  personnel: PersonnelTableRow[];
  canEdit: boolean;
  searchParams?: {
    search?: string;
    active?: string;
    edit?: string;
    add?: string;
    sortBy?: string;
  };
}) {
  if (personnel.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-50">No employee records found.</p>
        <p className="mt-1 text-sm text-muted-foreground">Add employee records to begin assigning monitored projects.</p>
      </div>
    );
  }

  const currentSort = searchParams?.sortBy ?? "fullName_asc";

  const renderSortableHeader = (column: string, label: string) => {
    const isCurrent = currentSort.startsWith(column);
    const isDesc = currentSort === `${column}_desc`;
    
    // Determine the next sort parameter
    let nextSort = `${column}_asc`;
    if (isCurrent && !isDesc) {
      nextSort = `${column}_desc`;
    } else if (isCurrent && isDesc) {
      nextSort = `${column}_asc`;
    }

    // Build the href link preserving all other query parameters
    const nextParams = { ...searchParams, sortBy: nextSort };
    const query = new URLSearchParams();
    Object.entries(nextParams).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        query.set(key, String(val));
      }
    });
    
    const href = `/personnel?${query.toString()}`;

    return (
      <TableHead className="p-0">
        <Link
          href={href}
          className="flex items-center gap-1.5 h-11 px-4 hover:bg-muted/30 transition-colors w-full select-none text-muted-foreground hover:text-foreground font-semibold"
        >
          <span>{label}</span>
          {isCurrent ? (
            isDesc ? (
              <ArrowDown className="h-4 w-4 text-primary shrink-0" />
            ) : (
              <ArrowUp className="h-4 w-4 text-primary shrink-0" />
            )
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/30 hover:text-muted-foreground/60 shrink-0" />
          )}
        </Link>
      </TableHead>
    );
  };

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {renderSortableHeader("employeeNo", "Employee No.")}
            {renderSortableHeader("fullName", "Full Name")}
            {renderSortableHeader("position", "Position")}
            {renderSortableHeader("section", "Section")}
            {renderSortableHeader("email", "Email")}
            {renderSortableHeader("contactNo", "Contact No.")}
            {renderSortableHeader("isActive", "Status")}
            {renderSortableHeader("updatedAt", "Last Updated")}
            {canEdit ? <TableHead className="text-right px-4 align-middle">Actions</TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {personnel.map((person) => (
            <TableRow key={person.id}>
              <TableCell>{person.employeeNo ?? "Not Set"}</TableCell>
              <TableCell className="font-medium text-slate-950 dark:text-slate-50">{person.fullName}</TableCell>
              <TableCell>{person.position}</TableCell>
              <TableCell>{person.section}</TableCell>
              <TableCell>{person.email ?? "Not Set"}</TableCell>
              <TableCell>{person.contactNo ?? "Not Set"}</TableCell>
              <TableCell>
                <Badge variant={person.isActive ? "success" : "neutral"}>{person.isActive ? "Active" : "Inactive"}</Badge>
              </TableCell>
              <TableCell>{formatDate(person.updatedAt)}</TableCell>
              {canEdit ? (
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm" className="border-primary bg-primary text-primary-foreground hover:bg-primary/90 dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white">
                    <Link href={`/personnel?edit=${person.slug}`}>
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      Edit
                    </Link>
                  </Button>
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
