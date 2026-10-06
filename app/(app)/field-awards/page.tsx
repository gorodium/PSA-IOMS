import { getActiveCycleWithRubric, getRubricHierarchy, getHistoricalSnapshots } from "@/lib/field-awards/queries";
import { computeOverall, formatDashboardScore, calcStatusColor } from "@/lib/field-awards/engine";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, AlertTriangle, TrendingUp, History } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function FieldAwardsOverviewPage() {
  const activeContext = await getActiveCycleWithRubric();
  
  if (!activeContext || !activeContext.rubric) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg border-slate-200 dark:border-slate-800">
        <AlertCircle className="h-10 w-10 text-slate-400 mb-4" />
        <h3 className="text-lg font-medium">No Active Configuration</h3>
        <p className="text-sm text-slate-500 max-w-sm text-center mt-2">
          There is no active Field Awards cycle or rubric configured. An administrator needs to set this up.
        </p>
      </div>
    );
  }

  const { cycle, rubric } = activeContext;
  const roots = await getRubricHierarchy(rubric.id, cycle.id);
  const overall = computeOverall(roots);
  
  const historical = await getHistoricalSnapshots();

  return (
    <div className="space-y-6">
      {/* ── Active Cycle Summary Header ── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-1 lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-slate-50">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-300">Overall Projected Rating</CardDescription>
            <CardTitle className="text-4xl font-bold flex items-baseline gap-2">
              {overall.totalWeighted !== null ? formatDashboardScore(overall.totalWeighted) : "—"}
              <span className="text-lg font-medium text-slate-400">/ 100</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mt-4">
              <Badge variant="outline" className="bg-slate-800/50 text-slate-200 border-slate-700">
                {cycle.year} Cycle
              </Badge>
              <Badge className={calcStatusColor(overall.calcStatus)}>
                {overall.calcStatus.replace("_", " ")}
              </Badge>
            </div>
            {overall.warnings.length > 0 && (
              <div className="mt-4 flex items-start gap-2 text-yellow-400/90 text-xs bg-yellow-900/20 p-2 rounded">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <p>Formula warnings detected. Review required.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Applicable Weights</CardDescription>
            <CardTitle className="text-2xl font-bold">
              {overall.totalApplicableWeight.toFixed(1)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={overall.totalApplicableWeight} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Should equal 100% when fully configured. Excludes pending rules.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Action Items</CardDescription>
            <CardTitle className="text-2xl font-bold">Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Evidence up to date</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <span>2 impending deadlines</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* ── Category Breakdown ── */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>Breakdown by main criteria categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overall.nodeResults.filter(r => !r.excludedFromOverall).map((node) => (
                <div key={node.nodeId} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-sm">
                    <Link 
                      href={`/field-awards/${node.code.toLowerCase()}`}
                      className="font-medium hover:underline flex items-center gap-2"
                    >
                      <span className="font-mono text-xs text-muted-foreground">{node.code}</span>
                      {node.title}
                    </Link>
                    <span className="font-semibold">
                      {node.effectiveWeighted !== null ? formatDashboardScore(node.effectiveWeighted) : "—"}
                    </span>
                  </div>
                  <Progress 
                    value={
                      node.effectiveWeighted !== null && node.effectiveUnweighted !== null
                        ? (node.effectiveUnweighted)
                        : 0
                    } 
                    className="h-1.5" 
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress: {node.completionProgress.toFixed(0)}%</span>
                    <span>Status: {node.calcStatus.replace("_", " ")}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Historical Performance ── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Historical Ratings
            </CardTitle>
            <CardDescription>Past official performance data</CardDescription>
          </CardHeader>
          <CardContent>
            {historical.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No historical data available.</p>
            ) : (
              <div className="space-y-4">
                {historical.map(snap => (
                  <div key={snap.id} className="flex justify-between items-center p-3 border rounded-lg bg-slate-50 dark:bg-slate-900">
                    <div>
                      <div className="font-medium">{snap.snapshotLabel}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Rank: {snap.rank ?? "N/A"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{snap.overallWeighted ? Number(snap.overallWeighted).toFixed(2) : "—"}</div>
                      <Badge variant={snap.isOfficial ? "default" : "secondary"}>
                        {snap.isOfficial ? "Official" : "Snapshot"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
