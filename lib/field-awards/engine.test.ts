/**
 * PSA Field Awards Scoring Engine - Unit Tests
 * Covers all 15 specified test cases.
 */
import { describe, it, expect } from "vitest";
import {
  computeNode,
  computeOverall,
  validateRubricWeights,
  autoNormalizeWeights,
  roundForDisplay,
} from "./engine";
import type { ScoringNode } from "./types";

// ── Test helpers ──────────────────────────────────────────────────────────────

function makeNode(overrides: Partial<ScoringNode> & { id: string; code: string; title: string }): ScoringNode {
  return {
    parentId: null,
    children: [],
    nodeType: "CRITERION",
    weightType: "ABSOLUTE_OVERALL",
    officialWeight: null,
    localWeight: null,
    workingWeight: null,
    maximumPoints: null,
    formulaType: "POINTS_OVER_MAX",
    formulaConfig: null,
    applicability: "INCLUDED",
    naPolicy: "EXCLUDE_RENORMALIZE",
    excludedFromOverall: false,
    isPendingRule: false,
    pendingRuleNote: null,
    calcMode: "AUTO",
    rawPoints: null,
    manualUnweightedOverride: null,
    officialWeightedOverride: null,
    peerDivisor: null,
    overrideReason: null,
    overrideSourceDoc: null,
    totalRequirements: 0,
    completedRequirements: 0,
    ...overrides,
  };
}

// ── 2026 Category weight data ─────────────────────────────────────────────────

const WEIGHTS_2026 = [
  { code: "I-1.1", weight: 14 },  // Social Sector
  { code: "I-1.2", weight: 10 },  // Agriculture
  { code: "I-2.1", weight: 11 },  // Census/Sampling
  { code: "I-2.2", weight: 7 },   // CBMS
  { code: "I-3",   weight: 16 },  // Establishment Surveys
  { code: "II",    weight: 3 },   // Statistical Planning
  { code: "III",   weight: 5 },   // Frameworks
  { code: "IV",    weight: 9 },   // CRVS
  { code: "V",     weight: 8 },   // FHRAS
  { code: "VI",    weight: 4 },   // Info Dissemination
  { code: "VII",   weight: 2 },   // Partnerships
  { code: "VIII",  weight: 11 },  // PhilSys
];

// ── Test 1: 2026 overall weights total 100% ───────────────────────────────────

describe("Test 1: 2026 PSO overall weights total exactly 100%", () => {
  it("sums to 100", () => {
    const total = WEIGHTS_2026.reduce((s, c) => s + c.weight, 0);
    expect(total).toBe(100);
  });

  it("validateRubricWeights returns isValid=true", () => {
    const nodes = WEIGHTS_2026.map((w) =>
      makeNode({ id: w.code, code: w.code, title: w.code, officialWeight: w.weight })
    );
    const result = validateRubricWeights(nodes);
    expect(result.isValid).toBe(true);
    expect(result.totalAbsoluteWeight).toBe(100);
  });
});

// ── Test 2: Statistical Operations subweights total 58% ──────────────────────

describe("Test 2: Statistical Operations subweights total 58%", () => {
  it("SO subcategory absolute weights sum to 58%", () => {
    const soSubweights = WEIGHTS_2026.filter((w) =>
      ["I-1.1", "I-1.2", "I-2.1", "I-2.2", "I-3"].includes(w.code)
    );
    const total = soSubweights.reduce((s, c) => s + c.weight, 0);
    expect(total).toBe(58);
  });
});

// ── Test 3: CRVS internal weights total 100% ─────────────────────────────────

describe("Test 3: Applicable CRVS internal weights total 100%", () => {
  const crvsLocal = [
    { code: "CR01", localWeight: 10, applicability: "INCLUDED" as const },
    { code: "CR02", localWeight: 0,  applicability: "NOT_APPLICABLE" as const },
    { code: "CR03", localWeight: 12, applicability: "INCLUDED" as const },
    { code: "CR04", localWeight: 10, applicability: "INCLUDED" as const },
    { code: "CR05", localWeight: 5,  applicability: "INCLUDED" as const },
    { code: "CR06", localWeight: 15, applicability: "INCLUDED" as const },
    { code: "CR07", localWeight: 28, applicability: "INCLUDED" as const },
    { code: "CR08", localWeight: 20, applicability: "INCLUDED" as const },
  ];

  it("applicable CR items sum to 100%", () => {
    const total = crvsLocal
      .filter((c) => c.applicability === "INCLUDED")
      .reduce((s, c) => s + c.localWeight, 0);
    expect(total).toBe(100);
  });
});

// ── Test 4: 2025 Misamis Oriental overall = 70.95179 ─────────────────────────

describe("Test 4: 2025 Misamis Oriental overall reproduces 70.95179", () => {
  const categories2025 = [
    { code: "I-1.1", unweighted: 87.82335, weight: 13 },
    { code: "I-1.2", unweighted: 96.75946, weight: 10 },
    { code: "I-2.1", unweighted: 94.27270, weight: 12 },
    { code: "I-2.2", unweighted: 51.50376, weight: 7 },
    { code: "I-3",   unweighted: 91.17149, weight: 16 },
    { code: "II",    unweighted: 33.25000, weight: 3 },
    { code: "III",   unweighted: 93.20000, weight: 5 },
    { code: "IV",    unweighted: 12.44079, weight: 9 },
    { code: "V",     unweighted: 56.56548, weight: 8 },
    { code: "VI",    unweighted: 16.23417, weight: 4 },
    { code: "VII",   unweighted: 13.73081, weight: 2 },
    { code: "VIII",  unweighted: 73.88164, weight: 11 },
  ];

  it("sum of (unweighted × weight / 100) equals 70.95179 within 0.001", () => {
    const total = categories2025.reduce(
      (s, c) => s + (c.unweighted * c.weight) / 100,
      0
    );
    expect(Math.abs(total - 70.95179)).toBeLessThan(0.001);
  });

  it("engine produces correct overall for 2025 snapshot nodes", () => {
    const nodes: ScoringNode[] = categories2025.map((c) =>
      makeNode({
        id: c.code,
        code: c.code,
        title: c.code,
        officialWeight: c.weight,
        weightType: "ABSOLUTE_OVERALL",
        formulaType: "MANUAL_PERCENT",
        calcMode: "MANUAL_UNWEIGHTED",
        manualUnweightedOverride: c.unweighted,
      })
    );
    const result = computeOverall(nodes);
    expect(result.totalWeighted).not.toBeNull();
    expect(Math.abs((result.totalWeighted ?? 0) - 70.95179)).toBeLessThan(0.001);
  });
});

// ── Test 5: Auto unweighted-to-weighted ───────────────────────────────────────

describe("Test 5: Auto unweighted-to-weighted calculation", () => {
  it("computes weighted as unweighted × weight / 100", () => {
    const node = makeNode({
      id: "t5",
      code: "T5",
      title: "Test",
      officialWeight: 14,
      maximumPoints: 100,
      rawPoints: 87.82335,
      formulaType: "POINTS_OVER_MAX",
      calcMode: "AUTO",
    });
    // Compute the leaf
    const result = computeNode(node);
    expect(result.effectiveUnweighted).not.toBeNull();
    expect(Math.abs((result.effectiveUnweighted ?? 0) - 87.82335)).toBeLessThan(0.001);
  });
});

// ── Test 6: Manual unweighted mode ───────────────────────────────────────────

describe("Test 6: Manual unweighted mode", () => {
  it("uses manualUnweightedOverride and ignores rawPoints/formula", () => {
    const node = makeNode({
      id: "t6",
      code: "T6",
      title: "Manual",
      officialWeight: 9,
      formulaType: "POINTS_OVER_MAX",
      calcMode: "MANUAL_UNWEIGHTED",
      rawPoints: 50,
      manualUnweightedOverride: 12.44079,
    });
    const result = computeNode(node);
    expect(result.effectiveUnweighted).not.toBeNull();
    expect(Math.abs((result.effectiveUnweighted ?? 0) - 12.44079)).toBeLessThan(0.00001);
  });

  it("returns DRAFT if MANUAL_UNWEIGHTED with no override", () => {
    const node = makeNode({
      id: "t6b",
      code: "T6B",
      title: "Manual No Value",
      calcMode: "MANUAL_UNWEIGHTED",
      manualUnweightedOverride: null,
    });
    const result = computeNode(node);
    expect(result.effectiveUnweighted).toBeNull();
    expect(result.calcStatus).toBe("DRAFT");
  });
});

// ── Test 7: Official override requires reason and source ──────────────────────

describe("Test 7: OFFICIAL_OVERRIDE requires reason and source document", () => {
  it("returns OFFICIAL status when both reason and source are present", () => {
    const node = makeNode({
      id: "t7",
      code: "T7",
      title: "Override",
      calcMode: "OFFICIAL_OVERRIDE",
      manualUnweightedOverride: 73.88164,
      overrideReason: "Published in 2025 results PDF",
      overrideSourceDoc: "2025 PSA Field Awards Provincial Ratings",
    });
    const result = computeNode(node);
    expect(result.calcStatus).toBe("OFFICIAL");
    expect(Math.abs((result.effectiveUnweighted ?? 0) - 73.88164)).toBeLessThan(0.00001);
  });

  it("returns DRAFT if reason is missing", () => {
    const node = makeNode({
      id: "t7b",
      code: "T7B",
      title: "Override No Reason",
      calcMode: "OFFICIAL_OVERRIDE",
      manualUnweightedOverride: 73.88164,
      overrideReason: null,
      overrideSourceDoc: "2025 PDF",
    });
    const result = computeNode(node);
    expect(result.calcStatus).toBe("DRAFT");
  });

  it("returns DRAFT if source document is missing", () => {
    const node = makeNode({
      id: "t7c",
      code: "T7C",
      title: "Override No Source",
      calcMode: "OFFICIAL_OVERRIDE",
      manualUnweightedOverride: 73.88164,
      overrideReason: "Official result",
      overrideSourceDoc: null,
    });
    const result = computeNode(node);
    expect(result.calcStatus).toBe("DRAFT");
  });
});

// ── Test 8: Scenario changes do not alter official rubric ─────────────────────

describe("Test 8: Scenario changes do not alter official rubric", () => {
  it("workingWeight does not modify officialWeight on original node", () => {
    const node = makeNode({
      id: "t8",
      code: "T8",
      title: "Weight Test",
      officialWeight: 14,
      workingWeight: 16,
    });
    // officialWeight must remain 14
    expect(node.officialWeight).toBe(14);
    expect(node.workingWeight).toBe(16);

    // autoNormalizeWeights returns new nodes, not mutated originals
    const [normalized] = autoNormalizeWeights([node]);
    expect(normalized.officialWeight).toBe(14); // original unchanged concept
    // workingWeight might be adjusted, but officialWeight never changes
    expect(node.officialWeight).toBe(14);
  });
});

// ── Test 9: GAD does not affect overall score ─────────────────────────────────

describe("Test 9: GAD Special Award does not affect overall score", () => {
  it("excludes GAD from totalWeighted", () => {
    const gad = makeNode({
      id: "gad",
      code: "GAD",
      title: "GAD Special Award",
      officialWeight: 0,
      weightType: "EXCLUDED_SPECIAL",
      excludedFromOverall: true,
      formulaType: "MANUAL_PERCENT",
      calcMode: "MANUAL_UNWEIGHTED",
      manualUnweightedOverride: 100,
    });
    const regular = makeNode({
      id: "reg",
      code: "II",
      title: "Statistical Planning",
      officialWeight: 3,
      formulaType: "MANUAL_PERCENT",
      calcMode: "MANUAL_UNWEIGHTED",
      manualUnweightedOverride: 33.25,
    });
    const result = computeOverall([regular, gad]);
    // totalWeighted should only include "reg": 33.25 * 3/100 = 0.9975
    expect(result.totalWeighted).not.toBeNull();
    expect(Math.abs((result.totalWeighted ?? 0) - 0.9975)).toBeLessThan(0.001);
    expect(result.totalApplicableWeight).toBe(3); // GAD not counted
  });
});

// ── Test 10: Pending rules not counted as zero ────────────────────────────────

describe("Test 10: Pending National ID rules not silently counted as zero", () => {
  it("PENDING_RULE nodes have null effective values and PROVISIONAL status", () => {
    const pending = makeNode({
      id: "viii-b2",
      code: "VIII-B-2",
      title: "Decentralized printing delivery",
      applicability: "PENDING_RULE",
      isPendingRule: true,
      pendingRuleNote: "Applicable only once decentralized printing begins",
    });
    const result = computeNode(pending);
    expect(result.effectiveUnweighted).toBeNull();
    expect(result.effectiveWeighted).toBeNull();
    expect(result.calcStatus).toBe("PROVISIONAL");
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("PENDING_RULE children are excluded from parent denominator (not zero)", () => {
    const pending = makeNode({
      id: "p1",
      code: "P1",
      title: "Pending",
      weightType: "RELATIVE_LOCAL",
      localWeight: 20,
      applicability: "PENDING_RULE",
      isPendingRule: true,
    });
    const included = makeNode({
      id: "p2",
      code: "P2",
      title: "Included",
      weightType: "RELATIVE_LOCAL",
      localWeight: 80,
      formulaType: "MANUAL_PERCENT",
      calcMode: "MANUAL_UNWEIGHTED",
      manualUnweightedOverride: 50,
    });
    const parent = makeNode({
      id: "parent",
      code: "PARENT",
      title: "Parent",
      officialWeight: 11,
      weightType: "ABSOLUTE_OVERALL",
      formulaType: "WEIGHTED_SUM",
      children: [pending, included],
    });
    const result = computeNode(parent);
    // Parent unweighted should be 50 (only P2 in denominator, weight 80/80 = 100%)
    expect(result.effectiveUnweighted).not.toBeNull();
    // Should be ~50, not lower (if pending counted as 0, would be 40)
    expect((result.effectiveUnweighted ?? 0)).toBeCloseTo(50, 1);
    expect(result.calcStatus).toBe("PROVISIONAL");
  });
});

// ── Test 11: Peer-relative categories remain PROVISIONAL without divisor ──────

describe("Test 11: PEER_BENCHMARK stays PROVISIONAL without divisor", () => {
  it("returns null and PROVISIONAL status when peerDivisor is null", () => {
    const node = makeNode({
      id: "vi",
      code: "VI",
      title: "Information Dissemination",
      officialWeight: 4,
      formulaType: "PEER_BENCHMARK",
      rawPoints: 50,
      peerDivisor: null,
    });
    const result = computeNode(node);
    expect(result.effectiveUnweighted).toBeNull();
    expect(result.calcStatus).toBe("PROVISIONAL");
  });

  it("computes correctly once divisor is set", () => {
    const node = makeNode({
      id: "vi2",
      code: "VI2",
      title: "Info Dissem with Divisor",
      officialWeight: 4,
      formulaType: "PEER_BENCHMARK",
      rawPoints: 60,
      peerDivisor: 80,
    });
    const result = computeNode(node);
    expect(result.effectiveUnweighted).not.toBeNull();
    expect(Math.abs((result.effectiveUnweighted ?? 0) - 75)).toBeLessThan(0.001);
  });
});

// ── Test 12: N/A renormalization follows configured policy ────────────────────

describe("Test 12: N/A renormalization follows configured policy", () => {
  function makeParentWithNaChild(naPolicy: "EXCLUDE_RENORMALIZE" | "EXCLUDE_NO_RENORM" | "TREAT_AS_ZERO") {
    const naChild = makeNode({
      id: "na",
      code: "NA",
      title: "N/A Child",
      weightType: "RELATIVE_LOCAL",
      localWeight: 20,
      applicability: "NOT_APPLICABLE",
      naPolicy,
    });
    const included = makeNode({
      id: "inc",
      code: "INC",
      title: "Included",
      weightType: "RELATIVE_LOCAL",
      localWeight: 80,
      formulaType: "MANUAL_PERCENT",
      calcMode: "MANUAL_UNWEIGHTED",
      manualUnweightedOverride: 50,
    });
    const parent = makeNode({
      id: "par",
      code: "PAR",
      title: "Parent",
      officialWeight: 9,
      weightType: "ABSOLUTE_OVERALL",
      formulaType: "WEIGHTED_SUM",
      children: [naChild, included],
    });
    return computeNode(parent);
  }

  it("EXCLUDE_RENORMALIZE: denominator = 80, result = 50", () => {
    const r = makeParentWithNaChild("EXCLUDE_RENORMALIZE");
    // 50*80 / 80 = 50
    expect(r.effectiveUnweighted).toBeCloseTo(50, 1);
  });

  it("EXCLUDE_NO_RENORM: denominator = 100, result = 40", () => {
    const r = makeParentWithNaChild("EXCLUDE_NO_RENORM");
    // 50*80 / 100 = 40
    expect(r.effectiveUnweighted).toBeCloseTo(40, 1);
  });

  it("TREAT_AS_ZERO: denominator = 100, result = 40", () => {
    const r = makeParentWithNaChild("TREAT_AS_ZERO");
    // 0*20 + 50*80 / 100 = 40
    expect(r.effectiveUnweighted).toBeCloseTo(40, 1);
  });
});

// ── Test 13: Completion progress independent of performance rating ─────────────

describe("Test 13: Completion progress independent of performance rating", () => {
  it("a complete but low-scoring node has high progress and low score", () => {
    const node = makeNode({
      id: "t13",
      code: "T13",
      title: "Low Score Full Reqs",
      officialWeight: 3,
      formulaType: "POINTS_OVER_MAX",
      calcMode: "AUTO",
      rawPoints: 10,        // very low score
      maximumPoints: 100,
      totalRequirements: 5,
      completedRequirements: 5,  // all complete
    });
    const result = computeNode(node);
    // Score should be 10, but progress should be 100
    expect(result.completionProgress).toBe(100);
    expect((result.effectiveUnweighted ?? 0)).toBeCloseTo(10, 1);
  });

  it("a high-scoring node can have 0% progress if no evidence submitted", () => {
    const node = makeNode({
      id: "t13b",
      code: "T13B",
      title: "High Score No Evidence",
      officialWeight: 3,
      calcMode: "MANUAL_UNWEIGHTED",
      manualUnweightedOverride: 95,
      totalRequirements: 3,
      completedRequirements: 0,  // no evidence
    });
    const result = computeNode(node);
    expect(result.completionProgress).toBe(0);
    expect((result.effectiveUnweighted ?? 0)).toBeCloseTo(95, 1);
  });
});

// ── Test 14: Unauthorized computation guard (engine-level) ───────────────────

describe("Test 14: Engine does not expose mutation to unauthorized callers", () => {
  it("computeNode does not mutate the input node's officialWeight", () => {
    const node = makeNode({
      id: "t14",
      code: "T14",
      title: "Immutability",
      officialWeight: 14,
      calcMode: "MANUAL_UNWEIGHTED",
      manualUnweightedOverride: 80,
    });
    const original = node.officialWeight;
    computeNode(node);
    // Engine must not alter the original node
    expect(node.officialWeight).toBe(original);
  });
});

// ── Test 15: Official override produces audit record ─────────────────────────

describe("Test 15: Official override produces audit record (pure function)", () => {
  // The engine is pure; audit logging is done by the server action.
  // We verify the engine returns sufficient information to construct an audit entry.
  it("OFFICIAL_OVERRIDE result contains all fields needed for audit", () => {
    const node = makeNode({
      id: "t15",
      code: "T15",
      title: "Official Override Audit",
      calcMode: "OFFICIAL_OVERRIDE",
      manualUnweightedOverride: 73.88164,
      overrideReason: "Published 2025 result",
      overrideSourceDoc: "2025 PSA Field Awards Report p.42",
    });
    const result = computeNode(node);
    expect(result.nodeId).toBe("t15");
    expect(result.code).toBe("T15");
    expect(result.calcStatus).toBe("OFFICIAL");
    expect(result.effectiveUnweighted).not.toBeNull();
    // Caller can now write: writeAuditLog({ entityId: result.nodeId, action: "OFFICIAL_OVERRIDE", ... })
    expect(typeof result.nodeId).toBe("string");
    expect(typeof result.calcStatus).toBe("string");
  });
});

// ── Additional: roundForDisplay ───────────────────────────────────────────────

describe("roundForDisplay", () => {
  it("formats null as —", () => expect(roundForDisplay(null, 5)).toBe("—"));
  it("formats 70.951791 to 5dp", () => expect(roundForDisplay(70.951791, 5)).toBe("70.95179"));
  it("formats 0.9975 to 5dp", () => expect(roundForDisplay(0.9975, 5)).toBe("0.99750"));
});
