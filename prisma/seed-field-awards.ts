/**
 * Field Awards seed data - idempotent.
 * Call seedFieldAwards(prisma) from prisma/seed.ts.
 * Re-running this will NOT overwrite locked/official records.
 */

import type { PrismaClient } from "@prisma/client";

type NodeSeed = {
  code: string;
  title: string;
  description?: string;
  parentCode?: string;
  displayOrder: number;
  nodeType?: "CATEGORY" | "SUBCATEGORY" | "CRITERION" | "GROUP";
  weightType?: "ABSOLUTE_OVERALL" | "RELATIVE_LOCAL" | "POINTS_ONLY" | "EXCLUDED_SPECIAL";
  officialWeight?: number;
  localWeight?: number;
  formulaType?: string;
  applicability?: "INCLUDED" | "NOT_APPLICABLE" | "PENDING_RULE" | "EXCLUDED_SPECIAL" | "NOT_CONFIGURED";
  naPolicy?: "EXCLUDE_RENORMALIZE" | "EXCLUDE_NO_RENORM" | "TREAT_AS_ZERO" | "AWAIT_DECISION";
  excludedFromOverall?: boolean;
  isPendingRule?: boolean;
  pendingRuleNote?: string;
  verificationStatus?: "NOT_CONFIGURED" | "DRAFT" | "PROVISIONAL" | "FOR_REVIEW" | "VERIFIED" | "OFFICIAL";
  sourceTitle?: string;
  sourceUrl?: string;
};

const NODES_2026: NodeSeed[] = [
  // ── Category I: Statistical Operations ──
  { code:"I",      title:"Statistical Operations",                             displayOrder:1,  nodeType:"CATEGORY",    weightType:"ABSOLUTE_OVERALL", officialWeight:58, formulaType:"WEIGHTED_SUM", sourceTitle:"2026 PSA Field Awards Manual", sourceUrl:"https://drive.google.com/file/d/1qbVS1xz6udGZ9XCetafH-C2Kx0-CWfTD/view" },
  { code:"I-1.1",  title:"Household Surveys - Social Sector",                  displayOrder:2,  nodeType:"SUBCATEGORY", weightType:"ABSOLUTE_OVERALL", officialWeight:14, parentCode:"I", formulaType:"WEIGHTED_SUM", verificationStatus:"DRAFT" },
  { code:"I-1.2",  title:"Household Surveys - Agriculture",                    displayOrder:3,  nodeType:"SUBCATEGORY", weightType:"ABSOLUTE_OVERALL", officialWeight:10, parentCode:"I", formulaType:"WEIGHTED_SUM", verificationStatus:"DRAFT" },
  { code:"I-2.1",  title:"Census, Administrative Data and Sampling Frames",    displayOrder:4,  nodeType:"SUBCATEGORY", weightType:"ABSOLUTE_OVERALL", officialWeight:11, parentCode:"I", formulaType:"WEIGHTED_SUM", verificationStatus:"DRAFT" },
  { code:"I-2.2",  title:"Community-Based Monitoring System",                  displayOrder:5,  nodeType:"SUBCATEGORY", weightType:"ABSOLUTE_OVERALL", officialWeight:7,  parentCode:"I", formulaType:"WEIGHTED_SUM", verificationStatus:"DRAFT" },
  { code:"I-3",    title:"Establishment Surveys and Administrative Data",      displayOrder:6,  nodeType:"SUBCATEGORY", weightType:"ABSOLUTE_OVERALL", officialWeight:16, parentCode:"I", formulaType:"WEIGHTED_SUM", verificationStatus:"DRAFT" },

  // ── Category II: Statistical Planning and Coordination ──
  { code:"II",     title:"Statistical Planning and Coordination",              displayOrder:7,  nodeType:"CATEGORY",    weightType:"ABSOLUTE_OVERALL", officialWeight:3,  formulaType:"WEIGHTED_SUM", sourceTitle:"2026 PSA Field Awards Manual" },
  { code:"II-A",   title:"Provincial/City Statistics Committee reports",       displayOrder:8,  nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:35,    parentCode:"II", formulaType:"POINTS_OVER_MAX", verificationStatus:"DRAFT" },
  { code:"II-B",   title:"Advocacy on statistical standards and classifications", displayOrder:9, nodeType:"CRITERION", weightType:"RELATIVE_LOCAL",   localWeight:35,    parentCode:"II", formulaType:"POINTS_OVER_MAX", verificationStatus:"DRAFT" },
  { code:"II-C",   title:"National Statistics Month",                          displayOrder:10, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:30,    parentCode:"II", formulaType:"POINTS_OVER_MAX", verificationStatus:"DRAFT" },

  // ── Category III: Statistical Frameworks ──
  { code:"III",    title:"Statistical Frameworks and Indicators System",       displayOrder:11, nodeType:"CATEGORY",    weightType:"ABSOLUTE_OVERALL", officialWeight:5,  formulaType:"WEIGHTED_SUM", sourceTitle:"2026 PSA Field Awards Manual" },
  { code:"III-A",  title:"Provincial Product Accounts",                        displayOrder:12, nodeType:"SUBCATEGORY", weightType:"RELATIVE_LOCAL",   localWeight:100,   parentCode:"III", formulaType:"WEIGHTED_SUM" },
  { code:"III-A-1",title:"Coordination activities",                            displayOrder:13, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:10,    parentCode:"III-A", formulaType:"POINTS_OVER_MAX", verificationStatus:"DRAFT" },
  { code:"III-A-2",title:"Collection of data",                                 displayOrder:14, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:20,    parentCode:"III-A", formulaType:"POINTS_OVER_MAX", verificationStatus:"DRAFT" },
  { code:"III-A-3",title:"Processing of data",                                 displayOrder:15, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:30,    parentCode:"III-A", formulaType:"POINTS_OVER_MAX", verificationStatus:"DRAFT" },
  { code:"III-A-4",title:"PPA dissemination forum",                            displayOrder:16, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:40,    parentCode:"III-A", formulaType:"POINTS_OVER_MAX", verificationStatus:"DRAFT" },

  // ── Category IV: CRVS ──
  { code:"IV",     title:"Civil Registration and Vital Statistics",            displayOrder:17, nodeType:"CATEGORY",    weightType:"ABSOLUTE_OVERALL", officialWeight:9,  formulaType:"WEIGHTED_SUM", sourceTitle:"2026 PSA Field Awards Manual" },
  { code:"CR01",   title:"Civil Registration Month",                           displayOrder:18, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:10,    parentCode:"IV",  formulaType:"POINTS_OVER_MAX", verificationStatus:"DRAFT" },
  { code:"CR02",   title:"Political Commitment",                               displayOrder:19, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:0,     parentCode:"IV",  applicability:"NOT_APPLICABLE", naPolicy:"EXCLUDE_RENORMALIZE", description:"Not applicable to PSOs" },
  { code:"CR03",   title:"Public Engagement, Participation and Generating Demand", displayOrder:20, nodeType:"CRITERION", weightType:"RELATIVE_LOCAL", localWeight:12, parentCode:"IV",  formulaType:"POINTS_OVER_MAX", verificationStatus:"DRAFT" },
  { code:"CR04",   title:"Coordination",                                       displayOrder:21, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:10,    parentCode:"IV",  formulaType:"POINTS_OVER_MAX", verificationStatus:"DRAFT" },
  { code:"CR05",   title:"Policies, Legislation and Implementation of Regulations", displayOrder:22, nodeType:"CRITERION", weightType:"RELATIVE_LOCAL", localWeight:5,  parentCode:"IV",  formulaType:"POINTS_OVER_MAX", verificationStatus:"DRAFT" },
  { code:"CR06",   title:"Infrastructure and Resources",                       displayOrder:23, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:15,    parentCode:"IV",  formulaType:"POINTS_OVER_MAX", verificationStatus:"DRAFT" },
  { code:"CR07",   title:"Operational Procedures, Practices and Innovations",  displayOrder:24, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:28,    parentCode:"IV",  formulaType:"UPPER_LOWER_LIMIT", verificationStatus:"DRAFT" },
  { code:"CR08",   title:"Production, Dissemination and Use of Vital Statistics", displayOrder:25, nodeType:"CRITERION", weightType:"RELATIVE_LOCAL", localWeight:20,  parentCode:"IV",  formulaType:"POINTS_OVER_MAX", verificationStatus:"DRAFT" },

  // ── Category V: FHRAS ──
  { code:"V",      title:"Financial, Human Resource and Administrative Service", displayOrder:26, nodeType:"CATEGORY",  weightType:"ABSOLUTE_OVERALL", officialWeight:8,  formulaType:"WEIGHTED_SUM", sourceTitle:"2026 PSA Field Awards Manual" },
  { code:"V-A",    title:"Accounting matters",                                 displayOrder:27, nodeType:"SUBCATEGORY", weightType:"ABSOLUTE_OVERALL", officialWeight:4,  localWeight:50, parentCode:"V",  formulaType:"WEIGHTED_SUM", verificationStatus:"DRAFT" },
  { code:"V-B",    title:"Human resource",                                     displayOrder:28, nodeType:"SUBCATEGORY", weightType:"ABSOLUTE_OVERALL", officialWeight:2,  localWeight:25, parentCode:"V",  formulaType:"WEIGHTED_SUM", verificationStatus:"DRAFT" },
  { code:"V-C",    title:"Administrative matters",                             displayOrder:29, nodeType:"SUBCATEGORY", weightType:"ABSOLUTE_OVERALL", officialWeight:2,  localWeight:25, parentCode:"V",  formulaType:"WEIGHTED_SUM", verificationStatus:"DRAFT" },

  // ── Category VI: Information Dissemination ──
  { code:"VI",     title:"Information Dissemination",                          displayOrder:30, nodeType:"CATEGORY",    weightType:"ABSOLUTE_OVERALL", officialWeight:4,  formulaType:"PEER_BENCHMARK", sourceTitle:"2026 PSA Field Awards Manual", description:"Uses third-highest national score + 10% as peer divisor. Score is PROVISIONAL until national peer data is imported." },
  { code:"ID01",   title:"Library Services and Maintenance",                   displayOrder:31, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:30,    parentCode:"VI", formulaType:"PEER_BENCHMARK", verificationStatus:"DRAFT" },
  { code:"ID02",   title:"Preparation of Publications",                        displayOrder:32, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:20,    parentCode:"VI", formulaType:"PEER_BENCHMARK", verificationStatus:"DRAFT" },
  { code:"ID03",   title:"Data Dissemination Activities",                      displayOrder:33, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:20,    parentCode:"VI", formulaType:"PEER_BENCHMARK", verificationStatus:"DRAFT" },
  { code:"ID04",   title:"Website",                                            displayOrder:34, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:0,     parentCode:"VI", applicability:"NOT_APPLICABLE", naPolicy:"EXCLUDE_RENORMALIZE", description:"RSSO-only. Not applicable to PSO." },
  { code:"ID05",   title:"Maintenance of Social Media Account",                displayOrder:35, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:15,    parentCode:"VI", formulaType:"PEER_BENCHMARK", verificationStatus:"DRAFT" },
  { code:"ID06",   title:"Promotion of PSA Products and Services",             displayOrder:36, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:0,     parentCode:"VI", applicability:"NOT_APPLICABLE", naPolicy:"EXCLUDE_RENORMALIZE", description:"RSSO-only. Not applicable to PSO." },
  { code:"ID07",   title:"Data Enclave",                                       displayOrder:37, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:0,     parentCode:"VI", applicability:"NOT_APPLICABLE", naPolicy:"EXCLUDE_RENORMALIZE", description:"RSSO-only. Not applicable to PSO." },
  { code:"ID08",   title:"Other Dissemination Activities",                     displayOrder:38, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:15,    parentCode:"VI", formulaType:"PEER_BENCHMARK", verificationStatus:"DRAFT" },

  // ── Category VII: Partnership and Linkages ──
  { code:"VII",    title:"Partnership and Linkages",                           displayOrder:39, nodeType:"CATEGORY",    weightType:"ABSOLUTE_OVERALL", officialWeight:2,  formulaType:"PEER_BENCHMARK", sourceTitle:"2026 PSA Field Awards Manual", description:"Uses third-highest provincial score + 10% as peer divisor. Score is PROVISIONAL until peer data is imported." },
  { code:"PL01",   title:"Social Responsibility",                              displayOrder:40, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:20,    parentCode:"VII", formulaType:"POINTS_OVER_MAX", verificationStatus:"DRAFT" },
  { code:"PL02",   title:"Support of other agencies to PSA activities",        displayOrder:41, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:10,    parentCode:"VII", formulaType:"POINTS_OVER_MAX", verificationStatus:"DRAFT" },
  { code:"PL03",   title:"Involvement of PSA in activities of other agencies", displayOrder:42, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:25,    parentCode:"VII", formulaType:"POINTS_OVER_MAX", verificationStatus:"DRAFT" },
  { code:"PL04",   title:"Activities related to various sectors",              displayOrder:43, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:15,    parentCode:"VII", formulaType:"POINTS_OVER_MAX", verificationStatus:"DRAFT" },
  { code:"PL05",   title:"Philippine Statistics Quiz",                         displayOrder:44, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:30,    parentCode:"VII", formulaType:"POINTS_OVER_MAX", verificationStatus:"DRAFT" },

  // ── Category VIII: PhilSys ──
  { code:"VIII",   title:"Philippine Identification System",                   displayOrder:45, nodeType:"CATEGORY",    weightType:"ABSOLUTE_OVERALL", officialWeight:11, formulaType:"WEIGHTED_SUM", sourceTitle:"2026 PSA Field Awards Manual" },
  { code:"VIII-A", title:"Conduct of National ID Registration",                displayOrder:46, nodeType:"SUBCATEGORY", weightType:"RELATIVE_LOCAL",   localWeight:20,    parentCode:"VIII", formulaType:"WEIGHTED_SUM" },
  { code:"VIII-A-1",title:"Registration performance",                          displayOrder:47, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:10,    parentCode:"VIII-A", formulaType:"RATIO_TO_TARGET", verificationStatus:"DRAFT" },
  { code:"VIII-A-2",title:"Uploading performance",                             displayOrder:48, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:10,    parentCode:"VIII-A", formulaType:"RATIO_TO_TARGET", verificationStatus:"DRAFT" },
  { code:"VIII-B", title:"National ID Delivery",                               displayOrder:49, nodeType:"SUBCATEGORY", weightType:"RELATIVE_LOCAL",   localWeight:30,    parentCode:"VIII", formulaType:"WEIGHTED_SUM", isPendingRule:true, pendingRuleNote:"Some delivery criteria require supplemental issuance before becoming applicable", applicability:"PENDING_RULE" },
  { code:"VIII-B-1",title:"Remaining Return-to-Sender cards",                  displayOrder:50, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:10,    parentCode:"VIII-B", formulaType:"INVERSE_ERROR_RATE", verificationStatus:"DRAFT" },
  { code:"VIII-B-2",title:"Decentralized printing delivery",                   displayOrder:51, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:20,    parentCode:"VIII-B", formulaType:"RATIO_TO_TARGET", isPendingRule:true, pendingRuleNote:"Applicable only once decentralized printing operation begins per supplemental issuance", applicability:"PENDING_RULE" },
  { code:"VIII-C", title:"IEC campaign activities",                            displayOrder:52, nodeType:"SUBCATEGORY", weightType:"RELATIVE_LOCAL",   localWeight:30,    parentCode:"VIII", formulaType:"WEIGHTED_SUM" },
  { code:"VIII-C-1",title:"Online/face-to-face events",                        displayOrder:53, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:6,     parentCode:"VIII-C", formulaType:"POINTS_OVER_MAX", verificationStatus:"DRAFT" },
  { code:"VIII-C-2",title:"Press releases",                                    displayOrder:54, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:6,     parentCode:"VIII-C", formulaType:"POINTS_OVER_MAX", verificationStatus:"DRAFT" },
  { code:"VIII-C-3",title:"Facebook posting",                                  displayOrder:55, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:6,     parentCode:"VIII-C", formulaType:"POINTS_OVER_MAX", verificationStatus:"DRAFT" },
  { code:"VIII-C-4",title:"Testimonial gathering",                             displayOrder:56, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:6,     parentCode:"VIII-C", formulaType:"POINTS_OVER_MAX", verificationStatus:"DRAFT" },
  { code:"VIII-C-5",title:"Provincial quarterly PACD report",                  displayOrder:57, nodeType:"CRITERION",   weightType:"RELATIVE_LOCAL",   localWeight:6,     parentCode:"VIII-C", formulaType:"POINTS_OVER_MAX", verificationStatus:"DRAFT" },
  { code:"VIII-D", title:"Communication and Client Management",                displayOrder:58, nodeType:"SUBCATEGORY", weightType:"RELATIVE_LOCAL",   localWeight:20,    parentCode:"VIII", formulaType:"WEIGHTED_SUM", verificationStatus:"DRAFT" },

  // ── GAD Special Award ──
  { code:"GAD",    title:"GAD Special Award",                                  displayOrder:59, nodeType:"CATEGORY",    weightType:"EXCLUDED_SPECIAL", officialWeight:0, excludedFromOverall:true, formulaType:"MANUAL_PERCENT", verificationStatus:"NOT_CONFIGURED", description:"GAD Special Award — excluded from the 100% overall rating. Awaiting verified criteria from official manual." },
];

const SNAPSHOT_2025 = {
  snapshotLabel: "2025 Official - PSA Misamis Oriental",
  isOfficial: true,
  overallWeighted: 70.95179,
  rank: 58,
  snapshotData: {
    year: 2025,
    officeName: "PSA Misamis Oriental",
    overallWeighted: 70.95179,
    overallRank: 58,
    categories: [
      {
        code:"I", title:"Statistical Operations", weightedContribution:50.59841, rank:31,
        subcategories:[
          { code:"I-1.1", title:"Household Surveys - Social Sector",          unweightedRating:87.82335, weightedContribution:11.41704, officialWeight2025:13 },
          { code:"I-1.2", title:"Household Surveys - Agriculture",             unweightedRating:96.75946, weightedContribution:9.67595,  officialWeight2025:10 },
          { code:"I-2.1", title:"Census, Administrative Data and Sampling Frames", unweightedRating:94.27270, weightedContribution:11.31273, officialWeight2025:12 },
          { code:"I-2.2", title:"Community-Based Monitoring System",          unweightedRating:51.50376, weightedContribution:3.60526,  officialWeight2025:7  },
          { code:"I-3",   title:"Establishment Surveys and Administrative Data", unweightedRating:91.17149, weightedContribution:14.58744, officialWeight2025:16 },
        ]
      },
      { code:"II",   title:"Statistical Planning and Coordination",       unweightedRating:33.25000, weightedContribution:0.99750, officialWeight2025:3,  rank:70 },
      { code:"III",  title:"Statistical Frameworks and Indicators System", unweightedRating:93.20000, weightedContribution:4.66000, officialWeight2025:5,  rank:37 },
      { code:"IV",   title:"Civil Registration and Vital Statistics",      unweightedRating:12.44079, weightedContribution:1.11967, officialWeight2025:9,  rank:81 },
      { code:"V",    title:"Financial, Human Resource and Administrative Service", unweightedRating:56.56548, weightedContribution:4.52524, officialWeight2025:8, rank:73 },
      { code:"VI",   title:"Information Dissemination",                    unweightedRating:16.23417, weightedContribution:0.64937, officialWeight2025:4,  rank:58 },
      { code:"VII",  title:"Partnership and Linkages",                     unweightedRating:13.73081, weightedContribution:0.27462, officialWeight2025:2,  rank:79 },
      { code:"VIII", title:"Philippine Identification System",             unweightedRating:73.88164, weightedContribution:8.12698, officialWeight2025:11, rank:18 },
    ]
  }
};

export async function seedFieldAwards(prisma: PrismaClient) {
  console.log("  → Seeding Field Awards cycles...");

  // ── 2025 cycle ──────────────────────────────────────────────────────────────
  const cycle2025 = await prisma.fieldAwardCycle.upsert({
    where: { year: 2025 },
    update: {},
    create: {
      year: 2025,
      label: "2025 PSA Field Awards",
      officeType: "PSO",
      officeName: "PSA Misamis Oriental",
      status: "ARCHIVED",
      isActive: false,
    }
  });

  // ── 2025 rubric (locked, official) ──────────────────────────────────────────
  const existing2025Rubric = await prisma.fieldAwardRubricVersion.findFirst({
    where: { cycleId: cycle2025.id, isBaseline: true, status: "LOCKED" }
  });

  const rubric2025 = existing2025Rubric ?? await prisma.fieldAwardRubricVersion.create({
    data: {
      cycleId: cycle2025.id,
      versionName: "2025 Official Baseline",
      versionNumber: 1,
      status: "LOCKED",
      isBaseline: true,
      isWorking: false,
      lockedAt: new Date("2026-01-01"),
      notes: "Seeded from published 2025 PSA Field Awards results",
      sourceTitle: "2025 PSA Field Awards Provincial Ratings",
      sourceUrl: "https://drive.google.com/file/d/1ObLPKetc5bAO9VYdQTimzIcHO3TeSevF/preview",
    }
  });

  // Seed 2025 snapshot ─────────────────────────────────────────────────────────
  const existingSnapshot = await prisma.fieldAwardScoreSnapshot.findFirst({
    where: { rubricVersionId: rubric2025.id, isOfficial: true }
  });
  if (!existingSnapshot) {
    await prisma.fieldAwardScoreSnapshot.create({
      data: {
        rubricVersionId: rubric2025.id,
        cycleId: cycle2025.id,
        snapshotLabel: SNAPSHOT_2025.snapshotLabel,
        isOfficial: SNAPSHOT_2025.isOfficial,
        overallWeighted: SNAPSHOT_2025.overallWeighted,
        rank: SNAPSHOT_2025.rank,
        snapshotData: SNAPSHOT_2025.snapshotData,
        notes: "Seeded from published 2025 PSA provincial ratings",
      }
    });
    console.log("    → 2025 official snapshot created");
  } else {
    console.log("    → 2025 official snapshot already exists, skipping");
  }

  // ── 2026 cycle ──────────────────────────────────────────────────────────────
  const cycle2026 = await prisma.fieldAwardCycle.upsert({
    where: { year: 2026 },
    update: { status: "ACTIVE", isActive: true },
    create: {
      year: 2026,
      label: "2026 PSA Field Awards",
      officeType: "PSO",
      officeName: "PSA Misamis Oriental",
      status: "ACTIVE",
      isActive: true,
    }
  });

  // ── 2026 rubric ──────────────────────────────────────────────────────────────
  const existing2026Rubric = await prisma.fieldAwardRubricVersion.findFirst({
    where: { cycleId: cycle2026.id, isBaseline: true }
  });

  const rubric2026 = existing2026Rubric ?? await prisma.fieldAwardRubricVersion.create({
    data: {
      cycleId: cycle2026.id,
      versionName: "2026 Official",
      versionNumber: 1,
      status: "PUBLISHED",
      isBaseline: true,
      isWorking: false,
      publishedAt: new Date("2026-01-01"),
      sourceTitle: "2026 PSA Field Awards Manual",
      sourceUrl: "https://drive.google.com/file/d/1qbVS1xz6udGZ9XCetafH-C2Kx0-CWfTD/view",
      sourceVersion: "2026",
      effectiveDate: new Date("2026-01-01"),
    }
  });

  console.log("  → Seeding 2026 rubric nodes...");

  // Build a map: code -> created node id
  const nodeIdMap = new Map<string, string>();

  for (const seed of NODES_2026) {
    const parentId = seed.parentCode ? nodeIdMap.get(seed.parentCode) ?? null : null;

    const existing = await prisma.fieldAwardNode.findUnique({
      where: { rubricVersionId_code: { rubricVersionId: rubric2026.id, code: seed.code } }
    });

    if (existing) {
      nodeIdMap.set(seed.code, existing.id);
      continue;
    }

    const node = await prisma.fieldAwardNode.create({
      data: {
        rubricVersionId: rubric2026.id,
        parentId,
        code: seed.code,
        title: seed.title,
        description: seed.description ?? null,
        displayOrder: seed.displayOrder,
        nodeType: seed.nodeType ?? "CRITERION",
        weightType: seed.weightType ?? "RELATIVE_LOCAL",
        officialWeight: seed.officialWeight ?? null,
        localWeight: seed.localWeight ?? null,
        formulaType: (seed.formulaType as "POINTS_OVER_MAX" | "MANUAL_PERCENT" | "WEIGHTED_SUM" | "DATE_BAND" | "THRESHOLD_TABLE" | "RATIO_TO_TARGET" | "INVERSE_ERROR_RATE" | "QUARTERLY_AVERAGE" | "PEER_BENCHMARK" | "UPPER_LOWER_LIMIT" | "ADJUSTMENT_FACTOR" | "OFFICIAL_OVERRIDE") ?? "WEIGHTED_SUM",
        applicability: seed.applicability ?? "INCLUDED",
        naPolicy: seed.naPolicy ?? "AWAIT_DECISION",
        excludedFromOverall: seed.excludedFromOverall ?? false,
        isPendingRule: seed.isPendingRule ?? false,
        pendingRuleNote: seed.pendingRuleNote ?? null,
        verificationStatus: seed.verificationStatus ?? "NOT_CONFIGURED",
        sourceTitle: seed.sourceTitle ?? null,
        sourceUrl: seed.sourceUrl ?? null,
      }
    });

    nodeIdMap.set(seed.code, node.id);
  }

  console.log(`    → Created ${nodeIdMap.size} 2026 rubric nodes`);
  console.log("  ✓ Field Awards seed complete");
}
