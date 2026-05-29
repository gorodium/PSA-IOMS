import Link from "next/link";
import { cookies } from "next/headers";
import { format } from "date-fns";
import { ArrowLeft, CalendarPlus } from "lucide-react";
import { ConvocationProgramStatus } from "@prisma/client";
import {
  AddConvocationMemberForm,
  ConvocationGroupEditor,
  ConvocationTemplateItemForm,
  GenerateConvocationProgramForm,
  ConvocationPdfSelector
} from "@/components/convocation/ConvocationAdminForms";
import { ConvocationStatusBadge } from "@/components/convocation/ConvocationStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatProgramDate, getNextMonday, isConvocationAdmin } from "@/lib/convocation";

export const dynamic = "force-dynamic";
const selectedConvocationGroupCookie = "ioms_selected_convocation_group";

export default async function ConvocationAdminPage() {
  const user = await requireUser();
  if (!isConvocationAdmin(user.role)) {
    throw new Error("Only administrators can manage convocation programs.");
  }
  const selectedGroupId = (await cookies()).get(selectedConvocationGroupCookie)?.value;

  const [groups, personnel, programs, templateItems, pdfTemplates] = await Promise.all([
    db.convocationGroup.findMany({
      where: { isActive: true },
      include: {
        members: {
          include: { personnel: true },
          orderBy: [{ isActive: "desc" }, { createdAt: "asc" }]
        }
      },
      orderBy: { sortOrder: "asc" }
    }),
    db.personnel.findMany({
      where: {
        isActive: true,
        convocationGroupMembers: {
          none: {
            isActive: true,
            group: { isActive: true }
          }
        }
      },
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true, section: true }
    }),
    db.convocationProgram.findMany({
      where: {
        status: { not: ConvocationProgramStatus.ARCHIVED }
      },
      include: { group: true },
      orderBy: { convocationDate: "desc" },
      take: 20
    }),
    db.convocationTemplateItem.findMany({
      orderBy: { itemOrder: "asc" }
    }),
    db.pdfTemplate.findMany({
      where: { templateFeature: "CONVOCATION_PROGRAM", isActive: true },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, fileName: true, isDefault: true }
    })
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 px-0">
          <Link href="/convocation">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">Convocation Program Management</h1>
        <p className="text-sm text-muted-foreground">
          Configure groups, generate Monday programs, review assignments, and manage the printable flow.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarPlus className="h-5 w-5" />
            Generate Program
          </CardTitle>
          <CardDescription>
            The default date is the next Monday. Manual group choices set the rotation point, so choosing Group 2 now makes the next automatic cycle Group 3, then Group 1, then Group 2 again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GenerateConvocationProgramForm
            groups={groups}
            defaultDate={format(getNextMonday(), "yyyy-MM-dd")}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Convocation Groups</CardTitle>
          <CardDescription>
            Add only real employees from the personnel database. Mark the group technical person so they are excluded from normal rotation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <AddConvocationMemberForm groups={groups} personnel={personnel} initialSelectedGroupId={selectedGroupId} />
          <div className="grid gap-4 xl:grid-cols-3">
            {groups.map((group) => (
              <ConvocationGroupEditor key={group.id} group={group} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Print / PDF Template Settings</CardTitle>
          <CardDescription>
            Select which uploaded PDF template should be used as the background when printing or exporting Convocation Programs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConvocationPdfSelector templates={pdfTemplates} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Program Template</CardTitle>
          <CardDescription>
            Template changes apply to future generated programs. Emcee mirrors National Anthem by default and does not rotate independently.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 xl:grid-cols-2">
          {templateItems.map((item) => (
            <div key={item.id} className="rounded-lg border bg-background p-2.5 shadow-sm">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold leading-5">{item.itemLabel}</p>
                </div>
                {!item.isEnabled && (
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    Disabled
                  </span>
                )}
              </div>
              <ConvocationTemplateItemForm item={item} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Programs</CardTitle>
          <CardDescription>Saved programs are preserved for rotation history and reprinting.</CardDescription>
        </CardHeader>
        <CardContent>
          {programs.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              No convocation programs have been generated yet.
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
