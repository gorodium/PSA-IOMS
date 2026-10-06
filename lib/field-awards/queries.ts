import { db } from "@/lib/db";
import type { ScoringNode, FaFormulaType, FaWeightType, FaNodeType, FaApplicability, FaNaPolicy, FaCalcMode, FaCalcStatus } from "./types";
import type { Prisma } from "@prisma/client";

export async function getActiveCycleWithRubric() {
  const cycle = await db.fieldAwardCycle.findFirst({
    where: { isActive: true },
    include: {
      rubricVersions: {
        where: { OR: [{ isBaseline: true }, { isWorking: true }] },
        orderBy: { versionNumber: "desc" },
        take: 1,
      }
    }
  });
  
  if (!cycle) return null;
  return {
    cycle,
    rubric: cycle.rubricVersions[0] ?? null
  };
}

// Convert Prisma node+scores to ScoringNode format for the engine
export function mapToScoringNode(
  node: Record<string, unknown>, 
  scoresMap: Record<string, Record<string, unknown>>, 
  requirementsMap: Record<string, { total: number; completed: number }>
): ScoringNode {
  const score = scoresMap[String(node.id)];
  const reqs = requirementsMap[String(node.id)] ?? { total: 0, completed: 0 };
  
  return {
    id: String(node.id),
    code: String(node.code),
    title: String(node.title),
    parentId: node.parentId ? String(node.parentId) : null,
    nodeType: node.nodeType as FaNodeType,
    weightType: node.weightType as FaWeightType,
    officialWeight: node.officialWeight ? Number(node.officialWeight) : null,
    localWeight: node.localWeight ? Number(node.localWeight) : null,
    workingWeight: node.workingWeight ? Number(node.workingWeight) : null,
    maximumPoints: node.maximumPoints ? Number(node.maximumPoints) : null,
    formulaType: node.formulaType as FaFormulaType,
    formulaConfig: (node.formulaConfig as Record<string, unknown>) || null,
    applicability: node.applicability as FaApplicability,
    naPolicy: node.naPolicy as FaNaPolicy,
    excludedFromOverall: node.excludedFromOverall,
    isPendingRule: node.isPendingRule,
    pendingRuleNote: node.pendingRuleNote,
    calcMode: (score?.calcMode ?? node.calcMode) as FaCalcMode,
    
    rawPoints: score?.rawPoints ? Number(score.rawPoints) : null,
    manualUnweightedOverride: score?.manualUnweightedOverride ? Number(score.manualUnweightedOverride) : null,
    officialWeightedOverride: score?.officialWeightedOverride ? Number(score.officialWeightedOverride) : null,
    peerDivisor: score?.peerDivisor ? Number(score.peerDivisor) : null,
    overrideReason: score?.overrideReason ?? null,
    overrideSourceDoc: score?.overrideSourceDoc ?? null,
    
    totalRequirements: reqs.total,
    completedRequirements: reqs.completed,
    
    children: [], // will be populated recursively
  };
}

export async function getRubricHierarchy(rubricVersionId: string, cycleId: string): Promise<ScoringNode[]> {
  const [nodes, scores, requirements] = await Promise.all([
    db.fieldAwardNode.findMany({
      where: { rubricVersionId },
      orderBy: { displayOrder: "asc" }
    }),
    db.fieldAwardScoreEntry.findMany({
      where: { cycleId }
    }),
    db.fieldAwardRequirement.findMany({
      where: { node: { rubricVersionId } },
      include: { evidence: { select: { status: true } } }
    })
  ]);
  
  const scoresMap = Object.fromEntries(scores.map(s => [s.nodeId, s]));
  const reqsMap: Record<string, { total: number; completed: number }> = {};
  
  for (const req of requirements) {
    if (!reqsMap[req.nodeId]) {
      reqsMap[req.nodeId] = { total: 0, completed: 0 };
    }
    reqsMap[req.nodeId].total++;
    if (req.evidence.some(e => e.status === "VERIFIED" || e.status === "SUBMITTED")) {
      reqsMap[req.nodeId].completed++;
    }
  }
  
  const allScoringNodes = nodes.map(n => mapToScoringNode(n, scoresMap, reqsMap));
  const nodeMap = new Map(allScoringNodes.map(n => [n.id, n]));
  
  const roots: ScoringNode[] = [];
  
  for (const node of allScoringNodes) {
    if (node.parentId) {
      const parent = nodeMap.get(node.parentId);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      roots.push(node);
    }
  }
  
  return roots;
}

export async function getHistoricalSnapshots() {
  return db.fieldAwardScoreSnapshot.findMany({
    orderBy: { createdAt: "desc" },
    include: { rubricVersion: { include: { cycle: true } } }
  });
}
