"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { checkUserPermission } from "@/lib/permissions";
import { db } from "@/lib/db";
import type {
  FaCalcMode,
  FaApplicability,
  FaNaPolicy,
  FaCalcStatus,
} from "@/lib/field-awards/types";

type ActionResult = { ok: boolean; message: string };

function canManageFieldAwards(role: string): boolean {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}

function canEncodeFieldAwards(role: string): boolean {
  return ["SUPER_ADMIN", "ADMIN", "SUPERVISOR", "EMPLOYEE"].includes(role);
}

// ── Write Field Award Audit Log ───────────────────────────────────────────────

async function writeFaAuditLog(input: {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  fieldChanged?: string;
  oldValueJson?: unknown;
  newValueJson?: unknown;
  reason?: string;
  sourceDocument?: string;
  rubricVersionId?: string;
  cycleId?: string;
}) {
  await db.fieldAwardAuditLog.create({
    data: {
      userId: input.userId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      fieldChanged: input.fieldChanged ?? null,
      oldValueJson: input.oldValueJson ? JSON.parse(JSON.stringify(input.oldValueJson)) : undefined,
      newValueJson: input.newValueJson ? JSON.parse(JSON.stringify(input.newValueJson)) : undefined,
      reason: input.reason ?? null,
      sourceDocument: input.sourceDocument ?? null,
      rubricVersionId: input.rubricVersionId ?? null,
      cycleId: input.cycleId ?? null,
    }
  });
}

// ── Score Entry Actions ───────────────────────────────────────────────────────

export async function upsertScoreEntryAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const user = await requireUser();
  if (!canEncodeFieldAwards(user.role)) {
    return { ok: false, message: "You do not have permission to encode Field Award scores." };
  }

  const nodeId = String(formData.get("nodeId") ?? "").trim();
  const cycleId = String(formData.get("cycleId") ?? "").trim();
  const calcMode = String(formData.get("calcMode") ?? "AUTO") as FaCalcMode;
  const rawPointsRaw = formData.get("rawPoints");
  const manualUnweightedRaw = formData.get("manualUnweightedOverride");
  const peerDivisorRaw = formData.get("peerDivisor");
  const notesVal = String(formData.get("notes") ?? "").trim() || null;

  if (!nodeId || !cycleId) {
    return { ok: false, message: "Node ID and Cycle ID are required." };
  }

  // For OFFICIAL_OVERRIDE mode, require reason and source doc
  if (calcMode === "OFFICIAL_OVERRIDE") {
    const overrideReason = String(formData.get("overrideReason") ?? "").trim();
    const overrideSourceDoc = String(formData.get("overrideSourceDoc") ?? "").trim();
    if (!overrideReason || !overrideSourceDoc) {
      return {
        ok: false,
        message: "Official overrides require both a reason and a source document reference.",
      };
    }
  }

  const rawPoints = rawPointsRaw ? parseFloat(String(rawPointsRaw)) : null;
  const manualUnweighted = manualUnweightedRaw ? parseFloat(String(manualUnweightedRaw)) : null;
  const peerDivisor = peerDivisorRaw ? parseFloat(String(peerDivisorRaw)) : null;
  const overrideReason = String(formData.get("overrideReason") ?? "").trim() || null;
  const overrideSourceDoc = String(formData.get("overrideSourceDoc") ?? "").trim() || null;

  const existing = await db.fieldAwardScoreEntry.findUnique({
    where: { nodeId_cycleId: { nodeId, cycleId } }
  });

  if (existing) {
    const updated = await db.fieldAwardScoreEntry.update({
      where: { nodeId_cycleId: { nodeId, cycleId } },
      data: {
        calcMode,
        rawPoints: rawPoints !== null ? rawPoints : existing.rawPoints,
        manualUnweightedOverride: manualUnweighted !== null ? manualUnweighted : existing.manualUnweightedOverride,
        peerDivisor: peerDivisor !== null ? peerDivisor : existing.peerDivisor,
        overrideReason,
        overrideSourceDoc,
        notes: notesVal,
        calcStatus: calcMode === "OFFICIAL_OVERRIDE" ? "OFFICIAL" : "FOR_REVIEW",
        encodedById: user.id,
      }
    });
    await writeFaAuditLog({
      userId: user.id,
      action: calcMode === "OFFICIAL_OVERRIDE" ? "OFFICIAL_OVERRIDE" : "UPDATE",
      entityType: "FieldAwardScoreEntry",
      entityId: updated.id,
      fieldChanged: "score",
      oldValueJson: existing,
      newValueJson: updated,
      reason: overrideReason ?? undefined,
      sourceDocument: overrideSourceDoc ?? undefined,
      cycleId,
    });
  } else {
    const created = await db.fieldAwardScoreEntry.create({
      data: {
        nodeId,
        cycleId,
        calcMode,
        rawPoints,
        manualUnweightedOverride: manualUnweighted,
        peerDivisor,
        overrideReason,
        overrideSourceDoc,
        notes: notesVal,
        calcStatus: calcMode === "OFFICIAL_OVERRIDE" ? "OFFICIAL" : "FOR_REVIEW",
        encodedById: user.id,
      }
    });
    await writeFaAuditLog({
      userId: user.id,
      action: "CREATE",
      entityType: "FieldAwardScoreEntry",
      entityId: created.id,
      newValueJson: created,
      reason: overrideReason ?? undefined,
      sourceDocument: overrideSourceDoc ?? undefined,
      cycleId,
    });
  }

  revalidatePath("/field-awards");
  revalidatePath("/field-awards/categories");
  return { ok: true, message: "Score entry saved successfully." };
}

// ── Evidence Actions ──────────────────────────────────────────────────────────

export async function addEvidenceAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const user = await requireUser();
  if (!checkUserPermission(user, "create", "fieldAwards")) {
    return { ok: false, message: "You do not have permission to upload evidence." };
  }

  const requirementId = String(formData.get("requirementId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const externalUrl = String(formData.get("externalUrl") ?? "").trim() || null;
  const fileUrl = String(formData.get("fileUrl") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;
  const referenceMonthRaw = formData.get("referenceMonth");
  const referenceYear = formData.get("referenceYear") ? parseInt(String(formData.get("referenceYear"))) : null;

  if (!requirementId || !title) {
    return { ok: false, message: "Requirement ID and title are required." };
  }
  if (!externalUrl && !fileUrl) {
    return { ok: false, message: "Provide either an external URL or a file reference." };
  }

  const evidence = await db.fieldAwardEvidence.create({
    data: {
      requirementId,
      title,
      description,
      fileUrl,
      externalUrl,
      referenceMonth: referenceMonthRaw ? parseInt(String(referenceMonthRaw)) : null,
      referenceYear,
      status: "SUBMITTED",
      uploadedById: user.id,
    }
  });

  await writeFaAuditLog({
    userId: user.id,
    action: "CREATE",
    entityType: "FieldAwardEvidence",
    entityId: evidence.id,
    newValueJson: evidence,
  });

  revalidatePath("/field-awards/requirements");
  return { ok: true, message: "Evidence added successfully." };
}

export async function verifyEvidenceAction(evidenceId: string, verified: boolean): Promise<ActionResult> {
  const user = await requireUser();
  if (!canManageFieldAwards(user.role) && user.role !== "SUPERVISOR") {
    return { ok: false, message: "Only reviewers can verify evidence." };
  }

  const existing = await db.fieldAwardEvidence.findUnique({ where: { id: evidenceId } });
  if (!existing) return { ok: false, message: "Evidence record not found." };

  const updated = await db.fieldAwardEvidence.update({
    where: { id: evidenceId },
    data: {
      status: verified ? "VERIFIED" : "REJECTED",
      verifiedById: user.id,
      verifiedAt: new Date(),
    }
  });

  await writeFaAuditLog({
    userId: user.id,
    action: verified ? "VERIFY" : "REJECT",
    entityType: "FieldAwardEvidence",
    entityId: evidenceId,
    oldValueJson: existing,
    newValueJson: updated,
  });

  revalidatePath("/field-awards/requirements");
  return { ok: true, message: `Evidence ${verified ? "verified" : "rejected"}.` };
}

// ── Rubric Management Actions ─────────────────────────────────────────────────

export async function cloneRubricAction(rubricVersionId: string, newName: string): Promise<ActionResult> {
  const user = await requireUser();
  if (!canManageFieldAwards(user.role)) {
    return { ok: false, message: "Only administrators can clone rubric versions." };
  }

  const source = await db.fieldAwardRubricVersion.findUnique({
    where: { id: rubricVersionId },
    include: { nodes: true }
  });
  if (!source) return { ok: false, message: "Source rubric not found." };

  const cloned = await db.fieldAwardRubricVersion.create({
    data: {
      cycleId: source.cycleId,
      versionName: newName,
      versionNumber: source.versionNumber + 1,
      status: "WORKING",
      isBaseline: false,
      isWorking: true,
      clonedFromId: source.id,
      sourceTitle: source.sourceTitle,
      sourceUrl: source.sourceUrl,
      sourceVersion: source.sourceVersion,
      notes: `Cloned from "${source.versionName}" on ${new Date().toLocaleDateString()}`,
    }
  });

  // Clone all nodes
  const nodeIdMap = new Map<string, string>();
  // First pass: create all nodes without parentId
  for (const node of source.nodes) {
    const clonedNode = await db.fieldAwardNode.create({
      data: {
        rubricVersionId: cloned.id,
        code: node.code,
        title: node.title,
        description: node.description,
        displayOrder: node.displayOrder,
        nodeType: node.nodeType,
        weightType: node.weightType,
        officialWeight: node.officialWeight,
        localWeight: node.localWeight,
        formulaType: node.formulaType,
        formulaConfig: node.formulaConfig ?? undefined,
        applicability: node.applicability,
        naPolicy: node.naPolicy,
        excludedFromOverall: node.excludedFromOverall,
        isPendingRule: node.isPendingRule,
        pendingRuleNote: node.pendingRuleNote,
        verificationStatus: "DRAFT",
        sourceTitle: node.sourceTitle,
        sourceUrl: node.sourceUrl,
        sourcePage: node.sourcePage,
      }
    });
    nodeIdMap.set(node.id, clonedNode.id);
  }

  // Second pass: set parentIds
  for (const node of source.nodes) {
    if (node.parentId) {
      const newNodeId = nodeIdMap.get(node.id);
      const newParentId = nodeIdMap.get(node.parentId);
      if (newNodeId && newParentId) {
        await db.fieldAwardNode.update({
          where: { id: newNodeId },
          data: { parentId: newParentId }
        });
      }
    }
  }

  await writeFaAuditLog({
    userId: user.id,
    action: "CLONE",
    entityType: "FieldAwardRubricVersion",
    entityId: cloned.id,
    newValueJson: { clonedFrom: rubricVersionId, name: newName },
  });

  revalidatePath("/field-awards/configuration");
  return { ok: true, message: `Working scenario "${newName}" created successfully.` };
}

export async function lockRubricAction(rubricVersionId: string): Promise<ActionResult> {
  const user = await requireUser();
  if (!canManageFieldAwards(user.role)) {
    return { ok: false, message: "Only administrators can lock rubric versions." };
  }

  const rubric = await db.fieldAwardRubricVersion.findUnique({ where: { id: rubricVersionId } });
  if (!rubric) return { ok: false, message: "Rubric not found." };
  if (rubric.status === "LOCKED") return { ok: false, message: "Rubric is already locked." };

  const updated = await db.fieldAwardRubricVersion.update({
    where: { id: rubricVersionId },
    data: { status: "LOCKED", lockedAt: new Date(), lockedById: user.id }
  });

  await writeFaAuditLog({
    userId: user.id,
    action: "LOCK",
    entityType: "FieldAwardRubricVersion",
    entityId: rubricVersionId,
    oldValueJson: { status: rubric.status },
    newValueJson: { status: "LOCKED" },
    rubricVersionId,
  });

  revalidatePath("/field-awards/configuration");
  return { ok: true, message: "Rubric locked successfully." };
}

export async function updateNodeWeightAction(
  nodeId: string,
  workingWeight: number,
  rubricVersionId: string
): Promise<ActionResult> {
  const user = await requireUser();
  if (!canManageFieldAwards(user.role)) {
    return { ok: false, message: "Only administrators can modify rubric weights." };
  }

  // Cannot modify locked or baseline rubrics
  const rubric = await db.fieldAwardRubricVersion.findUnique({ where: { id: rubricVersionId } });
  if (!rubric) return { ok: false, message: "Rubric not found." };
  if (rubric.status === "LOCKED" || rubric.isBaseline) {
    return { ok: false, message: "Cannot modify a locked or official baseline rubric. Clone it first." };
  }

  const existing = await db.fieldAwardNode.findUnique({ where: { id: nodeId } });
  if (!existing) return { ok: false, message: "Node not found." };

  const updated = await db.fieldAwardNode.update({
    where: { id: nodeId },
    data: { workingWeight }
  });

  await writeFaAuditLog({
    userId: user.id,
    action: "UPDATE_WEIGHT",
    entityType: "FieldAwardNode",
    entityId: nodeId,
    fieldChanged: "workingWeight",
    oldValueJson: { workingWeight: existing.workingWeight },
    newValueJson: { workingWeight },
    rubricVersionId,
  });

  revalidatePath("/field-awards/configuration");
  return { ok: true, message: "Weight updated." };
}

export async function assignFocalPersonAction(
  nodeId: string,
  personnelId: string,
  role: "FOCAL" | "ALTERNATE" | "REVIEWER"
): Promise<ActionResult> {
  const user = await requireUser();
  if (!canManageFieldAwards(user.role)) {
    return { ok: false, message: "Only administrators can assign focal persons." };
  }

  await db.fieldAwardAssignment.upsert({
    where: { nodeId_personnelId_role: { nodeId, personnelId, role } },
    update: { isActive: true, assignedById: user.id },
    create: { nodeId, personnelId, role, isActive: true, assignedById: user.id }
  });

  await writeFaAuditLog({
    userId: user.id,
    action: "ASSIGN",
    entityType: "FieldAwardAssignment",
    entityId: `${nodeId}:${personnelId}:${role}`,
    newValueJson: { nodeId, personnelId, role },
  });

  revalidatePath("/field-awards/configuration");
  return { ok: true, message: `${role} assigned successfully.` };
}

export async function updateNodeApplicabilityAction(
  nodeId: string,
  applicability: FaApplicability,
  naPolicy: FaNaPolicy,
  rubricVersionId: string
): Promise<ActionResult> {
  const user = await requireUser();
  if (!canManageFieldAwards(user.role)) {
    return { ok: false, message: "Only administrators can modify applicability settings." };
  }

  const rubric = await db.fieldAwardRubricVersion.findUnique({ where: { id: rubricVersionId } });
  if (!rubric) return { ok: false, message: "Rubric not found." };
  if (rubric.status === "LOCKED" || rubric.isBaseline) {
    return { ok: false, message: "Cannot modify a locked or baseline rubric." };
  }

  const existing = await db.fieldAwardNode.findUnique({ where: { id: nodeId } });
  if (!existing) return { ok: false, message: "Node not found." };

  await db.fieldAwardNode.update({
    where: { id: nodeId },
    data: { applicability, naPolicy }
  });

  await writeFaAuditLog({
    userId: user.id,
    action: "UPDATE_APPLICABILITY",
    entityType: "FieldAwardNode",
    entityId: nodeId,
    oldValueJson: { applicability: existing.applicability, naPolicy: existing.naPolicy },
    newValueJson: { applicability, naPolicy },
    rubricVersionId,
  });

  revalidatePath("/field-awards/configuration");
  return { ok: true, message: "Applicability updated." };
}

export async function activatePendingRuleAction(nodeId: string, rubricVersionId: string): Promise<ActionResult> {
  const user = await requireUser();
  if (!canManageFieldAwards(user.role)) {
    return { ok: false, message: "Only administrators can activate pending rules." };
  }

  const rubric = await db.fieldAwardRubricVersion.findUnique({ where: { id: rubricVersionId } });
  if (!rubric?.isWorking) {
    return { ok: false, message: "Pending rules can only be activated on a working scenario." };
  }

  const node = await db.fieldAwardNode.findUnique({ where: { id: nodeId } });
  if (!node?.isPendingRule) return { ok: false, message: "Node is not a pending rule." };

  await db.fieldAwardNode.update({
    where: { id: nodeId },
    data: { applicability: "INCLUDED", activationDate: new Date() }
  });

  await writeFaAuditLog({
    userId: user.id,
    action: "ACTIVATE_PENDING_RULE",
    entityType: "FieldAwardNode",
    entityId: nodeId,
    oldValueJson: { applicability: node.applicability },
    newValueJson: { applicability: "INCLUDED", activationDate: new Date() },
    rubricVersionId,
  });

  revalidatePath("/field-awards/configuration");
  return { ok: true, message: "Pending rule activated." };
}

export async function captureScoreSnapshotAction(
  rubricVersionId: string,
  cycleId: string,
  label: string,
  isOfficial: boolean
): Promise<ActionResult> {
  const user = await requireUser();
  if (!canManageFieldAwards(user.role)) {
    return { ok: false, message: "Only administrators can capture score snapshots." };
  }

  if (isOfficial) {
    // Cannot overwrite existing official snapshot
    const existingOfficial = await db.fieldAwardScoreSnapshot.findFirst({
      where: { rubricVersionId, isOfficial: true }
    });
    if (existingOfficial) {
      return {
        ok: false,
        message: "An official snapshot already exists for this rubric version. Use an override entry instead."
      };
    }
  }

  // Gather score entries for this cycle
  const entries = await db.fieldAwardScoreEntry.findMany({
    where: { cycleId },
    include: { node: { select: { code: true, title: true, officialWeight: true } } }
  });

  const snapshotData = {
    capturedAt: new Date().toISOString(),
    cycleId,
    rubricVersionId,
    entries: entries.map((e) => ({
      code: e.node.code,
      title: e.node.title,
      officialWeight: e.officialWeight ? Number(e.officialWeight) : Number(e.node.officialWeight),
      effectiveUnweighted: e.effectiveUnweighted ? Number(e.effectiveUnweighted) : null,
      effectiveWeighted: e.effectiveWeighted ? Number(e.effectiveWeighted) : null,
      calcStatus: e.calcStatus,
    }))
  };

  const totalWeighted = snapshotData.entries.reduce(
    (s, e) => s + (e.effectiveWeighted ?? 0), 0
  );

  await db.fieldAwardScoreSnapshot.create({
    data: {
      rubricVersionId,
      cycleId,
      snapshotLabel: label,
      isOfficial,
      snapshotData,
      overallWeighted: totalWeighted || null,
      capturedById: user.id,
    }
  });

  revalidatePath("/field-awards");
  return { ok: true, message: `Snapshot "${label}" captured.` };
}
