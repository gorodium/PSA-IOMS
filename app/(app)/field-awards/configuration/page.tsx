import { db } from "@/lib/db";
import { getActiveCycleWithRubric } from "@/lib/field-awards/queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Lock, Edit, Copy, FileCheck } from "lucide-react";
import { format } from "date-fns";

export default async function ConfigurationPage() {
  const activeContext = await getActiveCycleWithRubric();
  
  const allCycles = await db.fieldAwardCycle.findMany({
    orderBy: { year: "desc" },
    include: {
      rubricVersions: {
        orderBy: { versionNumber: "desc" }
      }
    }
  });

  return (
    <div className="space-y-6">
      {!activeContext && (
        <div className="flex items-center gap-2 text-orange-600 bg-orange-50 p-4 rounded-md border border-orange-200">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">No active cycle is configured. The system requires an active cycle to track performance.</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Cycles & Rubric Versions</CardTitle>
          <CardDescription>Manage performance cycles and scoring rubrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {allCycles.map(cycle => (
            <div key={cycle.id} className="space-y-4">
              <div className="flex items-center gap-3 border-b pb-2">
                <h3 className="text-lg font-bold">{cycle.label}</h3>
                <Badge variant={cycle.status === "ACTIVE" ? "default" : "secondary"}>
                  {cycle.status}
                </Badge>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                {cycle.rubricVersions.map(rubric => (
                  <Card key={rubric.id} className={rubric.isBaseline ? "border-primary/50 bg-primary/5" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base flex items-center gap-2">
                          {rubric.status === "LOCKED" ? <Lock className="h-4 w-4 text-slate-400" /> : <Edit className="h-4 w-4 text-blue-500" />}
                          {rubric.versionName}
                        </CardTitle>
                        <Badge variant="outline" className="text-[10px]">v{rubric.versionNumber}</Badge>
                      </div>
                      <CardDescription className="text-xs">
                        Status: {rubric.status}
                        {rubric.isBaseline && " (Official Baseline)"}
                        {rubric.isWorking && " (Working Scenario)"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      {rubric.sourceTitle && (
                        <p className="text-muted-foreground"><span className="font-medium text-slate-700">Source:</span> {rubric.sourceTitle}</p>
                      )}
                      <p className="text-muted-foreground text-xs mt-4">
                        Created: {format(rubric.createdAt, "MMM d, yyyy")}
                      </p>
                      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                        <button className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800">
                          <Copy className="mr-1 h-3 w-3" /> Clone
                        </button>
                        {rubric.status !== "LOCKED" && (
                          <button className="inline-flex items-center text-xs font-medium text-red-600 hover:text-red-800">
                            <Lock className="mr-1 h-3 w-3" /> Lock
                          </button>
                        )}
                        {!rubric.isBaseline && (
                          <button className="inline-flex items-center text-xs font-medium text-green-600 hover:text-green-800">
                            <FileCheck className="mr-1 h-3 w-3" /> Publish Baseline
                          </button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
