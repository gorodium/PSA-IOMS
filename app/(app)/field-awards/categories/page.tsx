import Link from "next/link";
import { getActiveCycleWithRubric, getRubricHierarchy } from "@/lib/field-awards/queries";
import { computeOverall, formatDashboardScore, formatWeight, calcStatusColor } from "@/lib/field-awards/engine";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Trophy } from "lucide-react";
import { AlertCircle } from "lucide-react";

export default async function CategoriesPage() {
  const activeContext = await getActiveCycleWithRubric();
  
  if (!activeContext || !activeContext.rubric) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg border-slate-200">
        <AlertCircle className="h-10 w-10 text-slate-400 mb-4" />
        <h3 className="text-lg font-medium">No Active Configuration</h3>
      </div>
    );
  }

  const { cycle, rubric } = activeContext;
  const roots = await getRubricHierarchy(rubric.id, cycle.id);
  const overall = computeOverall(roots);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {overall.nodeResults.map((node) => {
          const isExcluded = node.excludedFromOverall;
          return (
            <Card key={node.nodeId} className={`flex flex-col ${isExcluded ? 'border-dashed bg-slate-50' : ''}`}>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <CardDescription className="font-mono text-xs mb-1">{node.code}</CardDescription>
                    <CardTitle className="line-clamp-2 text-lg">{node.title}</CardTitle>
                  </div>
                  <Badge variant={isExcluded ? "secondary" : "default"} className="shrink-0">
                    {isExcluded ? "Special" : formatWeight(roots.find(r => r.id === node.nodeId)?.officialWeight ?? null)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Unweighted</p>
                      <p className="font-semibold text-lg">
                        {node.effectiveUnweighted !== null ? formatDashboardScore(node.effectiveUnweighted) : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Weighted</p>
                      <p className="font-semibold text-lg text-primary">
                        {node.effectiveWeighted !== null ? formatDashboardScore(node.effectiveWeighted) : (isExcluded ? "N/A" : "—")}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Completion</span>
                      <span>{Math.round(node.completionProgress)}%</span>
                    </div>
                    <Progress value={node.completionProgress} className="h-1.5" />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-[10px] ${calcStatusColor(node.calcStatus)}`}>
                      {node.calcStatus.replace("_", " ")}
                    </Badge>
                    {node.warnings.length > 0 && (
                      <span className="text-[10px] text-orange-500 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        {node.warnings.length} warning{node.warnings.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 pb-4">
                <Link 
                  href={`/field-awards/${node.code.toLowerCase()}`}
                  className="w-full flex items-center justify-center gap-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 py-2 rounded-md transition-colors"
                >
                  View Details <ArrowRight className="h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
