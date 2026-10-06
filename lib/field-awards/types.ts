/**
 * PSA Field Awards Scoring Engine - Types
 * Pure TypeScript. No React. No Prisma. No eval().
 */

export type FaFormulaType =
  | "POINTS_OVER_MAX"
  | "MANUAL_PERCENT"
  | "WEIGHTED_SUM"
  | "DATE_BAND"
  | "THRESHOLD_TABLE"
  | "RATIO_TO_TARGET"
  | "INVERSE_ERROR_RATE"
  | "QUARTERLY_AVERAGE"
  | "PEER_BENCHMARK"
  | "UPPER_LOWER_LIMIT"
  | "ADJUSTMENT_FACTOR"
  | "OFFICIAL_OVERRIDE";

export type FaWeightType =
  | "ABSOLUTE_OVERALL"
  | "RELATIVE_LOCAL"
  | "POINTS_ONLY"
  | "EXCLUDED_SPECIAL";

export type FaApplicability =
  | "INCLUDED"
  | "NOT_APPLICABLE"
  | "PENDING_RULE"
  | "EXCLUDED_SPECIAL"
  | "NOT_CONFIGURED";

export type FaNaPolicy =
  | "EXCLUDE_RENORMALIZE"
  | "EXCLUDE_NO_RENORM"
  | "TREAT_AS_ZERO"
  | "AWAIT_DECISION";

export type FaCalcStatus =
  | "NOT_CONFIGURED"
  | "DRAFT"
  | "PROVISIONAL"
  | "FOR_REVIEW"
  | "VERIFIED"
  | "OFFICIAL";

export type FaCalcMode =
  | "AUTO"
  | "MANUAL_UNWEIGHTED"
  | "MANUAL_WEIGHTED"
  | "OFFICIAL_OVERRIDE";

export type FaNodeType = "CATEGORY" | "SUBCATEGORY" | "CRITERION" | "GROUP";

export interface DeadlineBand {
  daysAfterDeadline: number;
  score: number;
}

export interface ThresholdEntry {
  min: number;
  max: number;
  score: number;
}

export interface FormulaConfig {
  // DATE_BAND
  deadlineBands?: DeadlineBand[];
  // THRESHOLD_TABLE
  thresholds?: ThresholdEntry[];
  // RATIO_TO_TARGET
  target?: number;
  cap?: number;
  // INVERSE_ERROR_RATE
  errorRateCap?: number;
  // QUARTERLY_AVERAGE
  quartersCount?: number;
  // PEER_BENCHMARK
  peerDivisorDescription?: string;
  // UPPER_LOWER_LIMIT
  upperLimit?: number;
  lowerLimit?: number;
  // ADJUSTMENT_FACTOR
  adjustmentFactor?: number;
  // generic extension
  [key: string]: unknown;
}

/** A node in the rubric hierarchy as used by the scoring engine. */
export interface ScoringNode {
  id: string;
  code: string;
  title: string;
  parentId: string | null;
  /** Child nodes in display order */
  children: ScoringNode[];
  nodeType: FaNodeType;
  weightType: FaWeightType;
  /** Absolute % of the 100-pt overall award (for ABSOLUTE_OVERALL nodes) */
  officialWeight: number | null;
  /** % within parent (for RELATIVE_LOCAL nodes) */
  localWeight: number | null;
  /** Scenario override weight (working only) */
  workingWeight: number | null;
  maximumPoints: number | null;
  formulaType: FaFormulaType;
  formulaConfig: FormulaConfig | null;
  applicability: FaApplicability;
  naPolicy: FaNaPolicy;
  /** True for GAD special award */
  excludedFromOverall: boolean;
  /** True when rule requires supplemental issuance */
  isPendingRule: boolean;
  pendingRuleNote: string | null;
  calcMode: FaCalcMode;
  // --- Score entry values (may be null if not yet entered) ---
  rawPoints: number | null;
  manualUnweightedOverride: number | null;
  officialWeightedOverride: number | null;
  peerDivisor: number | null;
  overrideReason: string | null;
  overrideSourceDoc: string | null;
  // --- Requirement completion counts ---
  totalRequirements: number;
  completedRequirements: number;
}

/** Result of computing a single node */
export interface ScoreResult {
  nodeId: string;
  code: string;
  title: string;
  effectiveUnweighted: number | null;
  effectiveWeighted: number | null;
  /** 0-100, independent of performance rating */
  completionProgress: number;
  calcStatus: FaCalcStatus;
  children: ScoreResult[];
  warnings: string[];
  /** The applicability policy applied */
  applicability: FaApplicability;
  naPolicy: FaNaPolicy;
  excludedFromOverall: boolean;
}

/** Top-level result */
export interface OverallResult {
  /** Sum of all non-excluded, non-pending effective weighted contributions */
  totalWeighted: number | null;
  calcStatus: FaCalcStatus;
  nodeResults: ScoreResult[];
  /** Should equal 100 for a valid publishable rubric */
  totalApplicableWeight: number;
  warnings: string[];
  computedAt: Date;
}

/** Weight validation result */
export interface WeightValidationResult {
  isValid: boolean;
  totalAbsoluteWeight: number;
  warnings: string[];
}
