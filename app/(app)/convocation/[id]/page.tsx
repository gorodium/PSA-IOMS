import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { ConfirmReplaceButton } from "@/components/convocation/ConfirmReplaceButton";
import { CustomTextOverrideDialog } from "@/components/convocation/CustomTextOverrideDialog";
import { ManualEmployeeSelectDialog } from "@/components/convocation/ManualEmployeeSelectDialog";
import { ConfirmPostponeButton } from "@/components/convocation/ConfirmPostponeButton";
import { RescheduleConvocationDialog } from "@/components/convocation/RescheduleConvocationDialog";
import { ConvocationStatusBadge } from "@/components/convocation/ConvocationStatusBadge";
import {
  deleteUpcomingConvocationProgramAction,
  finalizeConvocationProgramAction,
  overrideFinalizedConvocationAssignmentAction,
  postponeConvocationProgramAction
} from "@/app/(app)/convocation/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatProgramDate, isConvocationAdmin } from "@/lib/convocation";
import { ConvocationProgramStatus } from "@prisma/client";

type ConvocationDetailPageProps = {
  params: Promise<{ id: string }>;
};

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
      <span className="inline-flex rounded-md border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 shadow-sm">
        AVP
      </span>
    );
  }

  return <span className="font-bold text-slate-800 dark:text-slate-200">{value}</span>;
}

export default async function ConvocationDetailPage({ params }: ConvocationDetailPageProps) {
  const [user, resolvedParams] = await Promise.all([getCurrentUser(), params]);
  const isAdmin = isConvocationAdmin(user?.role);

  const [program, activePdfTemplate, personnelList] = await Promise.all([
    db.convocationProgram.findUnique({
      where: { id: resolvedParams.id },
      include: {
        group: {
          include: {
            members: {
              where: { isActive: true },
              include: { personnel: true }
            }
          }
        },
        items: {
          include: { assignedPersonnel: true },
          orderBy: { itemOrder: "asc" }
        },
        history: {
          include: { personnel: true },
          orderBy: { createdAt: "asc" }
        }
      }
    }),
    db.pdfTemplate.findFirst({
      where: { templateFeature: "CONVOCATION_PROGRAM", isActive: true, isDefault: true },
      select: { id: true }
    }),
    db.personnel.findMany({
      where: { isActive: true },
      select: { id: true, fullName: true, position: true },
      orderBy: { fullName: "asc" }
    })
  ]);

  if (!program || program.status === ConvocationProgramStatus.ARCHIVED) {
    notFound();
  }

  const technicalPersons = program.group.members.filter((member) => member.isTechnicalPerson);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2 px-0">
            <Link href="/convocation">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">
            Convocation Program - {formatProgramDate(program.convocationDate)}
          </h1>
          <p className="text-sm text-muted-foreground">
            Assigned group: {program.group.name}
            {technicalPersons.length > 0 ? ` | Technical: ${technicalPersons.map((member) => member.personnel.fullName).join(", ")}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ConvocationStatusBadge status={program.status} />
          {activePdfTemplate ? (
            <>
              <Button asChild variant="outline">
                <a href={`/settings/pdf-templates/${activePdfTemplate.id}/overlay?source=convocation&programId=${program.id}&mode=preview`} target="_blank" rel="noreferrer">
                  <FileText className="h-4 w-4 mr-2" />
                  View PDF Program
                </a>
              </Button>
              <Button asChild>
                <a href={`/settings/pdf-templates/${activePdfTemplate.id}/overlay?source=convocation&programId=${program.id}&mode=download`}>
                  <FileText className="h-4 w-4 mr-2" />
                  Download PDF
                </a>
              </Button>
            </>
          ) : (
            <Button disabled variant="outline" title="Please set a default PDF template in Admin settings first">
              <FileText className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          )}
          {isAdmin && (
            <form action={finalizeConvocationProgramAction.bind(null, program.id)}>
              <Button type="submit">Finalize</Button>
            </form>
          )}
          {isAdmin && (
            <form action={postponeConvocationProgramAction.bind(null, program.id)}>
              <ConfirmPostponeButton />
            </form>
          )}
          {isAdmin && (
            <RescheduleConvocationDialog programId={program.id} currentDate={program.convocationDate} />
          )}
          {isAdmin && program.status !== ConvocationProgramStatus.FINALIZED && (
            <form action={deleteUpcomingConvocationProgramAction.bind(null, program.id)}>
              <Button
                type="submit"
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
              >
                Delete Program
              </Button>
            </form>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Program Flow</CardTitle>
          <CardDescription>
            Emcee mirrors the National Anthem assignee unless deliberately changed to an override.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mx-auto max-w-4xl rounded-lg border bg-background px-5 py-3 shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program Flow</TableHead>
                  <TableHead className="w-[42%]">Assignment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {program.items.filter((item) => item.isEnabled).map((item) => {
                  const assignment = item.assignedPersonnel?.fullName ?? item.fixedTextValue ?? "To be assigned";

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.itemLabel}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <AssignmentDisplay value={assignment} itemKey={item.itemKey} />
                          {isAdmin && program.status !== ConvocationProgramStatus.COMPLETED && (
                            <div className="mt-2 flex flex-wrap items-center gap-1 sm:mt-0 sm:justify-end">
                              {item.assignedPersonnelId &&
                                item.rotationKey &&
                                item.countInRotation && (
                                  <form action={overrideFinalizedConvocationAssignmentAction.bind(null, item.id)}>
                                    <ConfirmReplaceButton />
                                  </form>
                                )}
                              <ManualEmployeeSelectDialog itemId={item.id} personnelList={personnelList} />
                              <CustomTextOverrideDialog itemId={item.id} />
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
