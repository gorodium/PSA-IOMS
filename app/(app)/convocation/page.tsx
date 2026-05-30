import Link from "next/link";
import { CalendarDays, FileText, ShieldCheck, Users } from "lucide-react";
import { ConvocationProgramStatus } from "@prisma/client";
import { deleteUpcomingConvocationProgramAction } from "@/app/(app)/convocation/actions";
import { ConvocationStatusBadge } from "@/components/convocation/ConvocationStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatProgramDate, getNextMonday, isConvocationAdmin } from "@/lib/convocation";

export const dynamic = "force-dynamic";

function splitMessageAssignment(value: string) {
  const [name, ...positionParts] = value.split(",");
  return {
    name: name.trim(),
    position: positionParts.join(",").trim()
  };
}

function AssignmentDisplay({ value, itemKey }: { value: string; itemKey?: string }) {
  if (itemKey === "message") {
    const assignment = splitMessageAssignment(value);

    return (
      <span className="inline-block text-center">
        <span className="block font-bold">{assignment.name}</span>
        {assignment.position && (
          <span className="block text-xs font-medium text-muted-foreground">{assignment.position}</span>
        )}
      </span>
    );
  }

  if (value === "AVP") {
    return (
      <span className="inline-flex rounded-md border border-slate-300 bg-slate-50 px-3 py-1 text-sm font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
        AVP
      </span>
    );
  }

  return <span className="font-bold">{value}</span>;
}

export default async function ConvocationPage() {
  const user = await getCurrentUser();
  const isAdmin = isConvocationAdmin(user?.role);
  const nextMonday = getNextMonday();

  const [currentProgram, groups, programs, activePdfTemplate] = await Promise.all([
    db.convocationProgram.findFirst({
      where: {
        status: { not: ConvocationProgramStatus.ARCHIVED },
        convocationDate: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      },
      include: {
        group: true,
        items: {
          include: { assignedPersonnel: true },
          orderBy: { itemOrder: "asc" }
        }
      },
      orderBy: { convocationDate: "asc" }
    }),
    db.convocationGroup.findMany({
      where: { isActive: true },
      include: {
        members: {
          where: { isActive: true },
          include: { personnel: true },
          orderBy: { createdAt: "asc" }
        }
      },
      orderBy: { sortOrder: "asc" }
    }),
    db.convocationProgram.findMany({
      where: {
        status: { not: ConvocationProgramStatus.ARCHIVED }
      },
      include: { group: true },
      orderBy: { convocationDate: "desc" },
      take: 12
    }),
    db.pdfTemplate.findFirst({
      where: { templateFeature: "CONVOCATION_PROGRAM", isActive: true, isDefault: true },
      select: { id: true }
    })
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">Convocation Program</h1>
          <p className="text-sm text-muted-foreground">
            View the current or upcoming Monday convocation assignment.
          </p>
        </div>
        {isAdmin && (
          <Button asChild variant="outline">
            <Link href="/convocation/admin">
              <ShieldCheck className="h-4 w-4" />
              Admin Management
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Upcoming Program
          </CardTitle>
          <CardDescription>
            Next Monday: {formatProgramDate(nextMonday)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!currentProgram ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              No upcoming convocation program has been generated yet.
              {isAdmin && (
                <div className="mt-4">
                  <Button asChild>
                    <Link href="/convocation/admin">Generate Program</Link>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col justify-between gap-3 rounded-lg border bg-background p-4 md:flex-row md:items-center">
                <div>
                  <p className="text-lg font-semibold">{formatProgramDate(currentProgram.convocationDate)}</p>
                  <p className="text-sm text-muted-foreground">Assigned group: {currentProgram.group.name}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <ConvocationStatusBadge status={currentProgram.status} />
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/convocation/${currentProgram.id}`}>View</Link>
                  </Button>
                  {activePdfTemplate ? (
                    <Button asChild size="sm">
                      <Link href={`/settings/pdf-templates/${activePdfTemplate.id}/overlay?source=convocation&programId=${currentProgram.id}&mode=download`}>
                        <FileText className="h-4 w-4 mr-2" />
                        Download PDF
                      </Link>
                    </Button>
                  ) : (
                    <Button disabled size="sm" title="Please set a default PDF template in Admin settings first">
                      <FileText className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  )}
                  {isAdmin && currentProgram.status !== ConvocationProgramStatus.FINALIZED && (
                    <form action={deleteUpcomingConvocationProgramAction.bind(null, currentProgram.id)}>
                      <Button
                        type="submit"
                        size="sm"
                        variant="outline"
                        className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                      >
                        Delete
                      </Button>
                    </form>
                  )}
                </div>
              </div>
              <div className="mx-auto max-w-4xl rounded-lg border bg-background px-5 py-3 shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Program Flow</TableHead>
                      <TableHead className="w-[42%]">Assignment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentProgram.items.filter((item) => item.isEnabled).map((item) => {
                      const assignment = item.assignedPersonnel?.fullName ?? item.fixedTextValue ?? "To be assigned";

                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.itemLabel}</TableCell>
                          <TableCell><AssignmentDisplay value={assignment} itemKey={item.itemKey} /></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Convocation Groups
          </CardTitle>
          <CardDescription>
            Current active group membership for the Monday convocation rotation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {groups.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              No convocation groups have been configured yet.
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-3">
              {groups.map((group) => {
                const availableMembers = group.members.filter((member) => member.isAvailable);
                const technicalPerson = group.members.find((member) => member.isTechnicalPerson);

                return (
                  <div key={group.id} className="rounded-lg border bg-background p-4">
                    <div className="border-b pb-3">
                      <p className="font-semibold">{group.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {group.members.length} active member(s), {availableMembers.length} available
                      </p>
                      {technicalPerson && (
                        <p className="mt-2 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          Technical: {technicalPerson.personnel.fullName}
                        </p>
                      )}
                    </div>
                    <div className="mt-3 space-y-2">
                      {group.members.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No members configured.</p>
                      ) : group.members.map((member) => (
                        <div key={member.id} className="rounded-md border bg-card p-3">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="text-sm font-medium leading-5">{member.personnel.fullName}</p>
                              <p className="text-xs text-muted-foreground">{member.personnel.section}</p>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs">
                              {member.isTechnicalPerson && (
                                <span className="rounded bg-slate-100 px-2 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                  Technical
                                </span>
                              )}
                              {!member.isAvailable && (
                                <span className="rounded bg-amber-100 px-2 py-1 text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                                  Unavailable
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Programs</CardTitle>
          <CardDescription>Saved convocation programs available for viewing and reprinting.</CardDescription>
        </CardHeader>
        <CardContent>
          {programs.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              No saved programs yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">{formatProgramDate(program.convocationDate)}</TableCell>
                    <TableCell>{program.group.name}</TableCell>
                    <TableCell><ConvocationStatusBadge status={program.status} /></TableCell>
                    <TableCell>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/convocation/${program.id}`}>Open</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
