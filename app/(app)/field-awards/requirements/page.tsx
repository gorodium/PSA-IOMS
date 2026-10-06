import { db } from "@/lib/db";
import { getActiveCycleWithRubric } from "@/lib/field-awards/queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Upload, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { requireUser } from "@/lib/auth";
import { checkUserPermission } from "@/lib/permissions";

export default async function RequirementsPage() {
  const user = await requireUser();
  const activeContext = await getActiveCycleWithRubric();
  
  if (!activeContext || !activeContext.rubric) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg border-slate-200">
        <AlertCircle className="h-10 w-10 text-slate-400 mb-4" />
        <h3 className="text-lg font-medium">No Active Configuration</h3>
      </div>
    );
  }

  const { rubric } = activeContext;
  
  const requirements = await db.fieldAwardRequirement.findMany({
    where: { node: { rubricVersionId: rubric.id } },
    include: { 
      node: { select: { code: true, title: true } },
      evidence: { 
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    },
    orderBy: [
      { dueDate: 'asc' },
      { node: { code: 'asc' } }
    ]
  });

  const canUpload = checkUserPermission(user, "create", "fieldAwards");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Requirements & Evidence Tracker</CardTitle>
          <CardDescription>
            Monitor documentary requirements and upload evidence
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Node</TableHead>
                <TableHead>Requirement</TableHead>
                <TableHead className="w-32">Due Date</TableHead>
                <TableHead className="w-32">Status</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requirements.map((req) => {
                const latestEvidence = req.evidence[0];
                const status = latestEvidence?.status ?? "PENDING";
                
                return (
                  <TableRow key={req.id}>
                    <TableCell className="font-mono text-xs">{req.node.code}</TableCell>
                    <TableCell>
                      <div className="font-medium">{req.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{req.node.title}</div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {req.dueDate ? format(req.dueDate, "MMM d, yyyy") : <span className="text-slate-400">Not set</span>}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        status === "VERIFIED" ? "default" :
                        status === "SUBMITTED" ? "secondary" :
                        status === "REJECTED" ? "destructive" : "outline"
                      } className={status === "VERIFIED" ? "bg-green-600 hover:bg-green-700" : ""}>
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {canUpload && status !== "VERIFIED" && (
                        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 px-3 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 text-slate-700 shadow-sm transition-colors">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload
                        </button>
                      )}
                      {status === "VERIFIED" && (
                        <div className="flex items-center justify-end text-green-600">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              
              {requirements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No requirements defined for this cycle yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
