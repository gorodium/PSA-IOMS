import { notFound } from "next/navigation";
import { getActiveCycleWithRubric, getRubricHierarchy } from "@/lib/field-awards/queries";
import { computeNode, formatDashboardScore, formatWeight, calcStatusColor } from "@/lib/field-awards/engine";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileEdit, Info } from "lucide-react";
import type { ScoreResult, ScoringNode } from "@/lib/field-awards/types";

export default async function CategoryDetailPage({ params }: { params: { categoryCode: string } }) {
  const code = params.categoryCode.toUpperCase();
  const activeContext = await getActiveCycleWithRubric();
  
  if (!activeContext || !activeContext.rubric) return notFound();
  
  const { cycle, rubric } = activeContext;
  const roots = await getRubricHierarchy(rubric.id, cycle.id);
  
  const categoryNode = roots.find(r => r.code.toUpperCase() === code);
  if (!categoryNode) return notFound();
  
  const result = computeNode(categoryNode);

  // Flatten the hierarchy for table display
  const rows: { node: ScoringNode, result: ScoreResult, depth: number }[] = [];
  function flatten(node: ScoringNode, res: ScoreResult, depth: number) {
    rows.push({ node, result: res, depth });
    node.children.forEach((child, i) => flatten(child, res.children[i], depth + 1));
  }
  flatten(categoryNode, result, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-muted-foreground font-mono">{categoryNode.code}</span>
            {categoryNode.title}
          </h2>
          {categoryNode.description && (
            <p className="text-muted-foreground mt-1">{categoryNode.description}</p>
          )}
        </div>
        <Badge className={calcStatusColor(result.calcStatus)}>
          {result.calcStatus.replace("_", " ")}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Weight</CardDescription>
            <CardTitle>{formatWeight(categoryNode.officialWeight)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground capitalize">
              {categoryNode.weightType.replace("_", " ").toLowerCase()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Unweighted Rating</CardDescription>
            <CardTitle>{result.effectiveUnweighted !== null ? formatDashboardScore(result.effectiveUnweighted) : "—"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={result.effectiveUnweighted ?? 0} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Weighted Contribution</CardDescription>
            <CardTitle>{result.effectiveWeighted !== null ? formatDashboardScore(result.effectiveWeighted) : "—"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Points towards overall 100%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Criteria Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Code</TableHead>
                <TableHead>Criterion</TableHead>
                <TableHead className="w-24 text-right">Weight</TableHead>
                <TableHead className="w-24 text-right">Progress</TableHead>
                <TableHead className="w-32 text-right">Unweighted</TableHead>
                <TableHead className="w-32 text-right">Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.node.id}>
                  <TableCell className="font-mono text-xs">{row.node.code}</TableCell>
                  <TableCell>
                    <div 
                      style={{ paddingLeft: `${row.depth * 1.5}rem` }}
                      className={`flex items-center gap-2 ${row.depth === 0 ? "font-semibold" : ""}`}
                    >
                      {row.node.title}
                      {row.node.applicability === "NOT_APPLICABLE" && (
                        <Badge variant="secondary" className="text-[10px]">N/A</Badge>
                      )}
                      {row.node.applicability === "PENDING_RULE" && (
                        <Badge variant="outline" className="text-[10px] text-orange-500 border-orange-200">Pending Rule</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-xs">
                    {formatWeight(row.node.localWeight ?? row.node.officialWeight)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-xs text-muted-foreground mr-2">{Math.round(row.result.completionProgress)}%</span>
                    <Progress value={row.result.completionProgress} className="h-1.5 w-12 inline-block" />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {row.result.effectiveUnweighted !== null ? formatDashboardScore(row.result.effectiveUnweighted) : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={`text-[10px] ${calcStatusColor(row.result.calcStatus)}`}>
                      {row.result.calcStatus.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100">
                      <FileEdit className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {result.warnings.length > 0 && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader>
            <CardTitle className="text-sm text-orange-800 flex items-center gap-2">
              <Info className="h-4 w-4" /> Computation Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm text-orange-700 space-y-1">
              {result.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
