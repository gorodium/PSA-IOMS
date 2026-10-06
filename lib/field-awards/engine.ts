/**
 * PSA Field Awards Scoring Engine
 * Server-side only. No React, no eval(), no executable strings in formulaConfig.
 * Preserves 5+ decimal places internally; round only for display.
 */

import type {
  ScoringNode,
  ScoreResult,
  OverallResult,
  FaCalcStatus,
  WeightValidationResult,
  FormulaConfig,
  DeadlineBand,
  ThresholdEntry,
} from "./types";

// ── Helpers ──────────────────────────────────────────────────────────────────

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Derive the most conservative calc status from a list of child statuses.
 * Precedence (worst first): NOT_CONFIGURED > DRAFT > PROVISIONAL > FOR_REVIEW > VERIFIED > OFFICIAL
 */
const STATUS_RANK: Record<FaCalcStatus, number> = {
  NOT_CONFIGURED: 0,
  DRAFT: 1,
  PROVISIONAL: 2,
  FOR_REVIEW: 3,
  VERIFIED: 4,
  OFFICIAL: 5,
};

function deriveParentCalcStatus(statuses: FaCalcStatus[]): FaCalcStatus {
  if (statuses.length === 0) return "NOT_CONFIGURED";
  const lowestRank = Math.min(...statuses.map((s) => STATUS_RANK[s]));
  return (Object.keys(STATUS_RANK) as FaCalcStatus[]).find(
    (k) => STATUS_RANK[k] === lowestRank
  ) ?? "NOT_CONFIGURED";
}

// ── Leaf formula calculators ─────────────────────────────────────────────────

function calcPointsOverMax(
  rawPoints: number | null,
  maximumPoints: number | null
): { value: number | null; status: FaCalcStatus; warnings: string[] } {
  const warnings: string[] = [];
  if (maximumPoints === null || maximumPoints === 0) {
    warnings.push("maximumPoints not configured");
    return { value: null, status: "NOT_CONFIGURED", warnings };
  }
  if (rawPoints === null) {
    return { value: null, status: "DRAFT", warnings };
  }
  return {
    value: clamp((rawPoints / maximumPoints) * 100),
    status: "FOR_REVIEW",
    warnings,
  };
}

function calcRatioToTarget(
  rawPoints: number | null,
  config: FormulaConfig | null
): { value: number | null; status: FaCalcStatus; warnings: string[] } {
  const warnings: string[] = [];
  const target = config?.target ?? null;
  const cap = config?.cap ?? 100;
  const adjustmentFactor = config?.adjustmentFactor ?? 1;
  if (target === null || target === 0) {
    warnings.push("RATIO_TO_TARGET: target not configured");
    return { value: null, status: "NOT_CONFIGURED", warnings };
  }
  if (rawPoints === null) return { value: null, status: "DRAFT", warnings };
  return {
    value: clamp((rawPoints / target) * 100 * adjustmentFactor, 0, cap),
    status: "FOR_REVIEW",
    warnings,
  };
}

function calcInverseErrorRate(
  rawPoints: number | null,
  maximumPoints: number | null
): { value: number | null; status: FaCalcStatus; warnings: string[] } {
  const warnings: string[] = [];
  if (maximumPoints === null || maximumPoints === 0) {
    warnings.push("INVERSE_ERROR_RATE: maximumPoints not configured");
    return { value: null, status: "NOT_CONFIGURED", warnings };
  }
  if (rawPoints === null) return { value: null, status: "DRAFT", warnings };
  return {
    value: clamp(100 - (rawPoints / maximumPoints) * 100),
    status: "FOR_REVIEW",
    warnings,
  };
}

function calcQuarterlyAverage(
  rawPoints: number | null,
  config: FormulaConfig | null,
  maximumPoints: number | null
): { value: number | null; status: FaCalcStatus; warnings: string[] } {
  const warnings: string[] = [];
  const quartersCount = config?.quartersCount ?? 4;
  if (rawPoints === null) return { value: null, status: "DRAFT", warnings };
  const avg = rawPoints / quartersCount;
  return calcPointsOverMax(avg, maximumPoints);
}

function calcDateBand(
  rawPoints: number | null,
  config: FormulaConfig | null
): { value: number | null; status: FaCalcStatus; warnings: string[] } {
  const warnings: string[] = [];
  const bands = (config?.deadlineBands ?? []) as DeadlineBand[];
  if (bands.length === 0) {
    warnings.push("DATE_BAND: no bands configured");
    return { value: null, status: "NOT_CONFIGURED", warnings };
  }
  if (rawPoints === null) return { value: null, status: "DRAFT", warnings };
  // rawPoints = days after deadline (negative = submitted early)
  const sorted = [...bands].sort((a, b) => a.daysAfterDeadline - b.daysAfterDeadline);
  let score = sorted[sorted.length - 1].score;
  for (const band of sorted) {
    if (rawPoints <= band.daysAfterDeadline) {
      score = band.score;
      break;
    }
  }
  return { value: clamp(score), status: "FOR_REVIEW", warnings };
}

function calcThresholdTable(
  rawPoints: number | null,
  config: FormulaConfig | null
): { value: number | null; status: FaCalcStatus; warnings: string[] } {
  const warnings: string[] = [];
  const thresholds = (config?.thresholds ?? []) as ThresholdEntry[];
  if (thresholds.length === 0) {
    warnings.push("THRESHOLD_TABLE: no thresholds configured");
    return { value: null, status: "NOT_CONFIGURED", warnings };
  }
  if (rawPoints === null) return { value: null, status: "DRAFT", warnings };
  const match = thresholds.find((t) => rawPoints >= t.min && rawPoints <= t.max);
  if (!match) {
    warnings.push(`THRESHOLD_TABLE: no matching threshold for value ${rawPoints}`);
    return { value: null, status: "DRAFT", warnings };
  }
  return { value: clamp(match.score), status: "FOR_REVIEW", warnings };
}

function calcUpperLowerLimit(
  rawPoints: number | null,
  config: FormulaConfig | null
): { value: number | null; status: FaCalcStatus; warnings: string[] } {
  const warnings: string[] = [];
  const upper = config?.upperLimit ?? null;
  const lower = config?.lowerLimit ?? null;
  if (upper === null || lower === null) {
    warnings.push("UPPER_LOWER_LIMIT: upper/lower limits not configured");
    return { value: null, status: "NOT_CONFIGURED", warnings };
  }
  if (rawPoints === null) return { value: null, status: "DRAFT", warnings };
  if (rawPoints >= upper) return { value: 100, status: "FOR_REVIEW", warnings };
  if (rawPoints <= lower) return { value: 0, status: "FOR_REVIEW", warnings };
  const interpolated = ((rawPoints - lower) / (upper - lower)) * 100;
  return { value: clamp(interpolated), status: "FOR_REVIEW", warnings };
}

function calcAdjustmentFactor(
  rawPoints: number | null,
  maximumPoints: number | null,
  config: FormulaConfig | null
): { value: number | null; status: FaCalcStatus; warnings: string[] } {
  const warnings: string[] = [];
  const factor = config?.adjustmentFactor ?? null;
  if (factor === null) {
    warnings.push("ADJUSTMENT_FACTOR: factor not configured");
    return { value: null, status: "NOT_CONFIGURED", warnings };
  }
  if (maximumPoints === null || maximumPoints === 0) {
    warnings.push("ADJUSTMENT_FACTOR: maximumPoints not configured");
    return { value: null, status: "NOT_CONFIGURED", warnings };
  }
  if (rawPoints === null) return { value: null, status: "DRAFT", warnings };
  return {
    value: clamp((rawPoints / maximumPoints) * 100 * factor),
    status: "FOR_REVIEW",
    warnings,
  };
}

function calcPeerBenchmark(
  rawPoints: number | null,
  peerDivisor: number | null
): { value: number | null; status: FaCalcStatus; warnings: string[] } {
  const warnings: string[] = [];
  if (peerDivisor === null || peerDivisor === 0) {
    warnings.push(
      "PEER_BENCHMARK: peer divisor not set. Score is PROVISIONAL until national peer data is imported."
    );
    return { value: null, status: "PROVISIONAL", warnings };
  }
  if (rawPoints === null) return { value: null, status: "PROVISIONAL", warnings };
  return {
    value: clamp((rawPoints / peerDivisor) * 100),
    status: "FOR_REVIEW",
    warnings,
  };
}

// ── Main leaf calculator ──────────────────────────────────────────────────────

interface LeafResult {
  unweighted: number | null;
  status: FaCalcStatus;
  warnings: string[];
}

function computeLeafUnweighted(node: ScoringNode): LeafResult {
  const warnings: string[] = [];

  // Handle by calcMode first
  switch (node.calcMode) {
    case "MANUAL_UNWEIGHTED":
      if (node.manualUnweightedOverride === null) {
        warnings.push(`${node.code}: MANUAL_UNWEIGHTED mode but no override entered`);
        return { unweighted: null, status: "DRAFT", warnings };
      }
      return {
        unweighted: clamp(node.manualUnweightedOverride),
        status: "FOR_REVIEW",
        warnings,
      };

    case "MANUAL_WEIGHTED": {
      if (node.officialWeightedOverride === null) {
        warnings.push(`${node.code}: MANUAL_WEIGHTED mode but no weighted override entered`);
        return { unweighted: null, status: "DRAFT", warnings };
      }
      const w = node.officialWeight;
      if (w === null || w === 0) {
        warnings.push(`${node.code}: MANUAL_WEIGHTED mode but weight is zero or null`);
        return { unweighted: null, status: "DRAFT", warnings };
      }
      return {
        unweighted: clamp((node.officialWeightedOverride / w) * 100),
        status: "FOR_REVIEW",
        warnings,
      };
    }

    case "OFFICIAL_OVERRIDE":
      if (node.manualUnweightedOverride === null) {
        warnings.push(`${node.code}: OFFICIAL_OVERRIDE but no unweighted value entered`);
        return { unweighted: null, status: "NOT_CONFIGURED", warnings };
      }
      if (!node.overrideReason || !node.overrideSourceDoc) {
        warnings.push(`${node.code}: OFFICIAL_OVERRIDE requires both reason and source document`);
        return { unweighted: clamp(node.manualUnweightedOverride), status: "DRAFT", warnings };
      }
      return {
        unweighted: clamp(node.manualUnweightedOverride),
        status: "OFFICIAL",
        warnings,
      };

    case "AUTO":
    default:
      break;
  }

  // AUTO mode — use formula
  switch (node.formulaType) {
    case "POINTS_OVER_MAX": {
      const r = calcPointsOverMax(node.rawPoints, node.maximumPoints);
      return { unweighted: r.value, status: r.status, warnings: [...warnings, ...r.warnings] };
    }
    case "MANUAL_PERCENT": {
      if (node.manualUnweightedOverride === null) {
        warnings.push(`${node.code}: MANUAL_PERCENT formula but no value entered`);
        return { unweighted: null, status: "DRAFT", warnings };
      }
      return { unweighted: clamp(node.manualUnweightedOverride), status: "FOR_REVIEW", warnings };
    }
    case "RATIO_TO_TARGET": {
      const r = calcRatioToTarget(node.rawPoints, node.formulaConfig);
      return { unweighted: r.value, status: r.status, warnings: [...warnings, ...r.warnings] };
    }
    case "INVERSE_ERROR_RATE": {
      const r = calcInverseErrorRate(node.rawPoints, node.maximumPoints);
      return { unweighted: r.value, status: r.status, warnings: [...warnings, ...r.warnings] };
    }
    case "QUARTERLY_AVERAGE": {
      const r = calcQuarterlyAverage(node.rawPoints, node.formulaConfig, node.maximumPoints);
      return { unweighted: r.value, status: r.status, warnings: [...warnings, ...r.warnings] };
    }
    case "DATE_BAND": {
      const r = calcDateBand(node.rawPoints, node.formulaConfig);
      return { unweighted: r.value, status: r.status, warnings: [...warnings, ...r.warnings] };
    }
    case "THRESHOLD_TABLE": {
      const r = calcThresholdTable(node.rawPoints, node.formulaConfig);
      return { unweighted: r.value, status: r.status, warnings: [...warnings, ...r.warnings] };
    }
    case "UPPER_LOWER_LIMIT": {
      const r = calcUpperLowerLimit(node.rawPoints, node.formulaConfig);
      return { unweighted: r.value, status: r.status, warnings: [...warnings, ...r.warnings] };
    }
    case "ADJUSTMENT_FACTOR": {
      const r = calcAdjustmentFactor(node.rawPoints, node.maximumPoints, node.formulaConfig);
      return { unweighted: r.value, status: r.status, warnings: [...warnings, ...r.warnings] };
    }
    case "PEER_BENCHMARK": {
      const r = calcPeerBenchmark(node.rawPoints, node.peerDivisor);
      return { unweighted: r.value, status: r.status, warnings: [...warnings, ...r.warnings] };
    }
    case "OFFICIAL_OVERRIDE": {
      if (node.manualUnweightedOverride === null) {
        warnings.push(`${node.code}: OFFICIAL_OVERRIDE formula but no value`);
        return { unweighted: null, status: "NOT_CONFIGURED", warnings };
      }
      return { unweighted: clamp(node.manualUnweightedOverride), status: "OFFICIAL", warnings };
    }
    case "WEIGHTED_SUM":
    default:
      warnings.push(`${node.code}: WEIGHTED_SUM formula on a leaf node — no children to sum`);
      return { unweighted: null, status: "NOT_CONFIGURED", warnings };
  }
}

// ── Node completion progress ──────────────────────────────────────────────────

function computeCompletionProgress(node: ScoringNode, childResults: ScoreResult[]): number {
  if (node.children.length === 0) {
    // Leaf node: use requirement completion counts
    if (node.totalRequirements === 0) return 0;
    return (node.completedRequirements / node.totalRequirements) * 100;
  }
  // Parent: average children progress, weighted by child local weight or uniformly
  if (childResults.length === 0) return 0;
  const total = childResults.reduce((s, c) => s + c.completionProgress, 0);
  return total / childResults.length;
}

// ── Recursive node computation ────────────────────────────────────────────────

/**
 * Compute a single node and all its descendants.
 * Mutates node.computedUnweightedRating, node.computedWeightedContrib etc. as side effect
 * for callers that want to inspect intermediate results.
 */
export function computeNode(node: ScoringNode): ScoreResult {
  const warnings: string[] = [];

  // ── Handle applicability ─────────────────────────────────────────────────
  if (node.applicability === "NOT_CONFIGURED") {
    return {
      nodeId: node.id,
      code: node.code,
      title: node.title,
      effectiveUnweighted: null,
      effectiveWeighted: null,
      completionProgress: 0,
      calcStatus: "NOT_CONFIGURED",
      children: node.children.map(computeNode),
      warnings: [`${node.code}: applicability not configured`],
      applicability: node.applicability,
      naPolicy: node.naPolicy,
      excludedFromOverall: node.excludedFromOverall,
    };
  }

  if (node.applicability === "NOT_APPLICABLE") {
    return {
      nodeId: node.id,
      code: node.code,
      title: node.title,
      effectiveUnweighted: null,
      effectiveWeighted: null,
      completionProgress: 0,
      calcStatus: "NOT_CONFIGURED",
      children: [],
      warnings: [`${node.code}: N/A — policy: ${node.naPolicy}`],
      applicability: node.applicability,
      naPolicy: node.naPolicy,
      excludedFromOverall: node.excludedFromOverall,
    };
  }

  if (node.applicability === "PENDING_RULE") {
    warnings.push(
      `${node.code}: PENDING_RULE — ${node.pendingRuleNote ?? "Awaiting supplemental issuance"}. Not counted as zero.`
    );
    return {
      nodeId: node.id,
      code: node.code,
      title: node.title,
      effectiveUnweighted: null,
      effectiveWeighted: null,
      completionProgress: 0,
      calcStatus: "PROVISIONAL",
      children: node.children.map(computeNode),
      warnings,
      applicability: node.applicability,
      naPolicy: node.naPolicy,
      excludedFromOverall: node.excludedFromOverall,
    };
  }

  // ── Leaf node (no children or WEIGHTED_SUM with no applicable children) ──
  if (node.children.length === 0) {
    const { unweighted, status, warnings: leafWarnings } = computeLeafUnweighted(node);
    warnings.push(...leafWarnings);

    let effectiveWeighted: number | null = null;
    if (unweighted !== null && node.officialWeight !== null && node.weightType === "ABSOLUTE_OVERALL") {
      effectiveWeighted = (unweighted * node.officialWeight) / 100;
    } else if (unweighted !== null && node.officialWeight !== null && node.weightType === "RELATIVE_LOCAL") {
      // Will be computed by parent; provide raw unweighted only
      effectiveWeighted = null;
    }

    const completionProgress = computeCompletionProgress(node, []);

    return {
      nodeId: node.id,
      code: node.code,
      title: node.title,
      effectiveUnweighted: unweighted,
      effectiveWeighted,
      completionProgress,
      calcStatus: status,
      children: [],
      warnings,
      applicability: node.applicability,
      naPolicy: node.naPolicy,
      excludedFromOverall: node.excludedFromOverall,
    };
  }

  // ── Parent node: compute children first ───────────────────────────────────
  const childResults = node.children.map(computeNode);

  // ── Determine parent computation strategy based on children weight types ──
  const firstIncludedChild = node.children.find(
    (c) => c.applicability === "INCLUDED" || c.applicability === "PENDING_RULE"
  );
  const childrenAreAbsolute =
    firstIncludedChild?.weightType === "ABSOLUTE_OVERALL";

  let effectiveUnweighted: number | null = null;
  let effectiveWeighted: number | null = null;
  const childStatuses: FaCalcStatus[] = [];

  if (childrenAreAbsolute) {
    // Statistical Operations pattern:
    // parentWeightedContrib = Σ(childEffectiveWeighted)
    // parentUnweighted = parentWeightedContrib / parentOfficialWeight * 100
    let sumWeighted = 0;
    let allNull = true;

    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const result = childResults[i];
      if (child.excludedFromOverall) continue;
      if (child.applicability === "NOT_APPLICABLE" || child.applicability === "PENDING_RULE") {
        childStatuses.push(result.calcStatus);
        continue;
      }
      if (result.effectiveUnweighted !== null && child.officialWeight !== null) {
        const w = child.workingWeight ?? child.officialWeight;
        sumWeighted += (result.effectiveUnweighted * w) / 100;
        allNull = false;
        childStatuses.push(result.calcStatus);
      }
    }

    if (!allNull) {
      effectiveWeighted = sumWeighted;
      const parentWeight = node.workingWeight ?? node.officialWeight;
      if (parentWeight && parentWeight > 0) {
        effectiveUnweighted = (sumWeighted / parentWeight) * 100;
      }
    }
  } else {
    // RELATIVE_LOCAL children: weighted average
    // parentUnweighted = Σ(childUnweighted × childApplicableLocalWeight) / Σ(childApplicableLocalWeight)
    let numerator = 0;
    let denominator = 0;
    let allNull = true;

    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const result = childResults[i];
      if (child.excludedFromOverall && node.excludedFromOverall === false) continue;

      const w = child.workingWeight ?? child.localWeight ?? 0;

      if (child.applicability === "NOT_APPLICABLE") {
        switch (child.naPolicy) {
          case "EXCLUDE_RENORMALIZE":
            // exclude from both num and denom
            break;
          case "EXCLUDE_NO_RENORM":
            denominator += w;
            break;
          case "TREAT_AS_ZERO":
            denominator += w;
            // numerator += 0
            allNull = false;
            childStatuses.push("NOT_CONFIGURED");
            break;
          case "AWAIT_DECISION":
            // exclude from denom, mark provisional
            childStatuses.push("PROVISIONAL");
            warnings.push(`${node.code}: N/A child ${child.code} awaiting policy decision`);
            break;
        }
        continue;
      }

      if (child.applicability === "PENDING_RULE") {
        // Do NOT count as zero; exclude from denominator
        childStatuses.push("PROVISIONAL");
        warnings.push(`${node.code}: pending-rule child ${child.code} excluded from denominator`);
        continue;
      }

      if (result.effectiveUnweighted !== null) {
        numerator += result.effectiveUnweighted * w;
        denominator += w;
        allNull = false;
        childStatuses.push(result.calcStatus);
      } else {
        childStatuses.push(result.calcStatus);
      }
    }

    if (!allNull && denominator > 0) {
      effectiveUnweighted = numerator / denominator;
      const parentWeight = node.workingWeight ?? node.officialWeight;
      if (parentWeight !== null) {
        effectiveWeighted = (effectiveUnweighted * parentWeight) / 100;
      }
    }
  }

  const completionProgress = computeCompletionProgress(node, childResults);
  const calcStatus =
    childStatuses.length > 0 ? deriveParentCalcStatus(childStatuses) : "NOT_CONFIGURED";

  return {
    nodeId: node.id,
    code: node.code,
    title: node.title,
    effectiveUnweighted,
    effectiveWeighted,
    completionProgress,
    calcStatus,
    children: childResults,
    warnings,
    applicability: node.applicability,
    naPolicy: node.naPolicy,
    excludedFromOverall: node.excludedFromOverall,
  };
}

// ── Overall calculation ───────────────────────────────────────────────────────

/**
 * Compute the overall PSA Field Awards score from all top-level category nodes.
 * GAD and EXCLUDED_SPECIAL nodes are computed but excluded from the total.
 */
export function computeOverall(categoryNodes: ScoringNode[]): OverallResult {
  const warnings: string[] = [];
  const nodeResults: ScoreResult[] = [];
  const calcStatuses: FaCalcStatus[] = [];

  let totalWeighted = 0;
  let totalApplicableWeight = 0;
  let hasAnyValue = false;

  for (const node of categoryNodes) {
    const result = computeNode(node);
    nodeResults.push(result);

    if (node.excludedFromOverall || node.weightType === "EXCLUDED_SPECIAL") {
      // GAD: compute but don't add to total
      continue;
    }

    if (node.applicability === "PENDING_RULE") {
      warnings.push(`Category ${node.code} is a pending rule and excluded from totals`);
      calcStatuses.push("PROVISIONAL");
      continue;
    }

    const weight = node.workingWeight ?? node.officialWeight ?? 0;
    totalApplicableWeight += weight;

    if (result.effectiveWeighted !== null) {
      totalWeighted += result.effectiveWeighted;
      hasAnyValue = true;
      calcStatuses.push(result.calcStatus);
    } else if (result.effectiveUnweighted !== null) {
      const w = weight / 100;
      totalWeighted += result.effectiveUnweighted * w;
      hasAnyValue = true;
      calcStatuses.push(result.calcStatus);
    } else {
      calcStatuses.push(result.calcStatus);
    }
  }

  const calcStatus = deriveParentCalcStatus(calcStatuses);

  // Weight validation warning
  if (Math.abs(totalApplicableWeight - 100) > 0.001) {
    warnings.push(
      `Total applicable weight is ${totalApplicableWeight.toFixed(5)}% (should be exactly 100%)`
    );
  }

  return {
    totalWeighted: hasAnyValue ? totalWeighted : null,
    calcStatus,
    nodeResults,
    totalApplicableWeight,
    warnings,
    computedAt: new Date(),
  };
}

// ── Weight validation ─────────────────────────────────────────────────────────

/**
 * Validate that all applicable absolute overall weights sum to exactly 100%.
 * Use before publishing a rubric.
 */
export function validateRubricWeights(nodes: ScoringNode[]): WeightValidationResult {
  const warnings: string[] = [];
  let total = 0;

  for (const node of nodes) {
    if (node.excludedFromOverall || node.weightType === "EXCLUDED_SPECIAL") continue;
    if (node.applicability === "PENDING_RULE") {
      warnings.push(
        `${node.code} is PENDING_RULE — its weight (${node.officialWeight ?? "?"}%) is excluded from the total`
      );
      continue;
    }
    if (node.weightType === "ABSOLUTE_OVERALL") {
      const w = node.workingWeight ?? node.officialWeight ?? 0;
      total += w;
    }
  }

  const isValid = Math.abs(total - 100) < 0.001;
  if (!isValid) {
    warnings.push(`Weights total ${total.toFixed(5)}% — must equal exactly 100% to publish`);
  }

  return { isValid, totalAbsoluteWeight: total, warnings };
}

// ── Auto-normalize (working scenarios only) ───────────────────────────────────

/**
 * Preview-only: proportionally normalize weights so they sum to 100.
 * Only operates on absolute-overall, non-excluded nodes.
 * Returns a NEW array — does not mutate the originals.
 */
export function autoNormalizeWeights(nodes: ScoringNode[]): ScoringNode[] {
  const applicable = nodes.filter(
    (n) => !n.excludedFromOverall && n.weightType === "ABSOLUTE_OVERALL" && n.applicability !== "PENDING_RULE"
  );
  const currentTotal = applicable.reduce((s, n) => s + (n.workingWeight ?? n.officialWeight ?? 0), 0);
  if (currentTotal === 0) return nodes;

  return nodes.map((n) => {
    if (!applicable.includes(n)) return n;
    const current = n.workingWeight ?? n.officialWeight ?? 0;
    return { ...n, workingWeight: (current / currentTotal) * 100 };
  });
}

// ── Display helpers ───────────────────────────────────────────────────────────

/** Round a value to the given decimal places for display only. */
export function roundForDisplay(value: number | null, decimals: number): string {
  if (value === null) return "—";
  return value.toFixed(decimals);
}

/** Format a score as "XX.XXXXX" (5 decimal places as used in official PSA results) */
export function formatOfficialScore(value: number | null): string {
  return roundForDisplay(value, 5);
}

/** Format a score for the dashboard (2 decimal places) */
export function formatDashboardScore(value: number | null): string {
  return roundForDisplay(value, 2);
}

/** Format a percentage weight */
export function formatWeight(value: number | null): string {
  if (value === null) return "—";
  return `${value.toFixed(0)}%`;
}

/** Get a Tailwind color class for a calc status */
export function calcStatusColor(status: FaCalcStatus): string {
  switch (status) {
    case "OFFICIAL": return "text-green-700 bg-green-50 border-green-200";
    case "VERIFIED": return "text-blue-700 bg-blue-50 border-blue-200";
    case "FOR_REVIEW": return "text-yellow-700 bg-yellow-50 border-yellow-200";
    case "PROVISIONAL": return "text-orange-700 bg-orange-50 border-orange-200";
    case "DRAFT": return "text-slate-600 bg-slate-50 border-slate-200";
    case "NOT_CONFIGURED": return "text-red-600 bg-red-50 border-red-200";
    default: return "text-slate-500 bg-slate-50 border-slate-200";
  }
}
