import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import { getProjectCategoryLabel } from "@/lib/taxonomy";

export type ProjectTableRow = {
  id: string;
  name: string;
  category: string;
  year: number;
  focalPerson: string;
  otherInvolvedPersonnel: string;
  progress: number;
  status: string;
  nearestDeadline: Date | null;
  updatedAt: Date;
};

export function ProjectTable({ projects }: { projects: ProjectTableRow[] }) {
  if (projects.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <p className="text-sm font-medium text-slate-900">No projects found.</p>
        <p className="mt-1 text-sm text-muted-foreground">Adjust the filters or add the first monitored project.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Focal person</TableHead>
            <TableHead>Other involved personnel</TableHead>
            <TableHead>Nearest deadline</TableHead>
            <TableHead>Last updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="min-w-56 font-medium text-slate-950">{project.name}</TableCell>
              <TableCell>{getProjectCategoryLabel(project.category)}</TableCell>
              <TableCell>{project.year}</TableCell>
              <TableCell>{project.focalPerson}</TableCell>
              <TableCell className="min-w-56">{project.otherInvolvedPersonnel}</TableCell>
              <TableCell>{formatDate(project.nearestDeadline)}</TableCell>
              <TableCell>{formatDate(project.updatedAt)}</TableCell>
              <TableCell className="text-right">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/projects/${project.id}`}>
                    <Eye className="h-4 w-4" aria-hidden="true" />
                    View
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
