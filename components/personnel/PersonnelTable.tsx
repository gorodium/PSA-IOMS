import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/format";

export type PersonnelTableRow = {
  id: string;
  employeeNo: string | null;
  fullName: string;
  position: string;
  section: string;
  email: string | null;
  contactNo: string | null;
  isActive: boolean;
  updatedAt: Date;
};

export function PersonnelTable({ personnel, canEdit }: { personnel: PersonnelTableRow[]; canEdit: boolean }) {
  if (personnel.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <p className="text-sm font-medium text-slate-900">No personnel records found.</p>
        <p className="mt-1 text-sm text-muted-foreground">Add personnel records to begin assigning monitored projects.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee no.</TableHead>
            <TableHead>Full name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact no.</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last updated</TableHead>
            {canEdit ? <TableHead className="text-right">Actions</TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {personnel.map((person) => (
            <TableRow key={person.id}>
              <TableCell>{person.employeeNo ?? "Not set"}</TableCell>
              <TableCell className="font-medium text-slate-950">{person.fullName}</TableCell>
              <TableCell>{person.position}</TableCell>
              <TableCell>{person.section}</TableCell>
              <TableCell>{person.email ?? "Not set"}</TableCell>
              <TableCell>{person.contactNo ?? "Not set"}</TableCell>
              <TableCell>
                <Badge variant={person.isActive ? "success" : "neutral"}>{person.isActive ? "Active" : "Inactive"}</Badge>
              </TableCell>
              <TableCell>{formatDate(person.updatedAt)}</TableCell>
              {canEdit ? (
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/personnel?edit=${person.id}`}>
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
