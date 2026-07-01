"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { addDays } from "date-fns";
import { ConvocationAssignmentMode, ConvocationProgramStatus } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { db } from "@/lib/db";
import {
  assertValidConvocationDate,
  defaultMessageSpeaker,
  formatMessageSpeaker,
  generateConvocationItems,
  getSuggestedGroupForMonday,
  getNextMonday,
  isConvocationAdmin,
  normalizeConvocationDate,
  syncConvocationCalendarEntry
} from "@/lib/convocation";
import {
  addConvocationMemberSchema,
  generateConvocationProgramSchema,
  updateConvocationGroupMembersSchema,
  updateConvocationItemSchema,
  updateConvocationMemberSchema,
  updateConvocationTemplateItemSchema
} from "@/lib/convocation-validators";

type ActionResult = {
  ok: boolean;
  message: string;
  selectedGroupId?: string;
};

const initialError = "Please check the convocation details.";
const selectedConvocationGroupCookie = "ioms_selected_convocation_group";

async function requireConvocationAdmin() {
  const user = await requireUser();
  if (!isConvocationAdmin(user.role)) {
    throw new Error("Only administrators can manage convocation programs.");
  }
  return user;
}

function checked(value: FormDataEntryValue | null) {
  return value === "on" || value === "true";
}

export async function addConvocationMemberAction(_previousState: ActionResult, formData: FormData): Promise<ActionResult> {
  const user = await requireConvocationAdmin();
  const submittedGroupId = String(formData.get("groupId") ?? "");
  if (submittedGroupId) {
    (await cookies()).set(selectedConvocationGroupCookie, submittedGroupId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/convocation/admin"
    });
  }

  const parsed = addConvocationMemberSchema.safeParse({
    groupId: submittedGroupId,
    personnelId: String(formData.get("personnelId") ?? ""),
    isTechnicalPerson: checked(formData.get("isTechnicalPerson")),
    isGroupLead: checked(formData.get("isGroupLead"))
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.errors[0]?.message ?? initialError,
      selectedGroupId: submittedGroupId || undefined
    };
  }

  const personnel = await db.personnel.findFirst({
    where: { id: parsed.data.personnelId, isActive: true }
  });
  if (!personnel) {
    return {
      ok: false,
      message: "Selected employee could not be found as an active employee record.",
      selectedGroupId: parsed.data.groupId
    };
  }

  const existingActiveMembership = await db.convocationGroupMember.findFirst({
    where: {
      personnelId: parsed.data.personnelId,
      isActive: true,
      group: { isActive: true }
    },
    include: { group: true }
  });

  if (existingActiveMembership) {
    return {
      ok: false,
      message: `${personnel.fullName} is already assigned to ${existingActiveMembership.group.name}. Remove the employee from that group before adding to another group.`,
      selectedGroupId: parsed.data.groupId
    };
  }

  const member = await db.convocationGroupMember.upsert({
    where: {
      groupId_personnelId: {
        groupId: parsed.data.groupId,
        personnelId: parsed.data.personnelId
      }
    },
    create: parsed.data,
    update: {
      isActive: true,
      isAvailable: true,
      isTechnicalPerson: parsed.data.isTechnicalPerson,
      isGroupLead: parsed.data.isGroupLead
    }
  });

  await writeAuditLog({
    userId: user.id,
    action: "UPSERT",
    entityType: "ConvocationGroupMember",
    entityId: member.id,
    newValueJson: member
  });

  revalidatePath("/convocation/admin");
  return {
    ok: true,
    message: "Convocation group member saved.",
    selectedGroupId: parsed.data.groupId
  };
}

export async function updateConvocationMemberAction(_previousState: ActionResult, formData: FormData): Promise<ActionResult> {
  const user = await requireConvocationAdmin();
  const memberId = String(formData.get("memberId") ?? "");

  if (checked(formData.get("removeMember"))) {
    const oldMember = await db.convocationGroupMember.findUnique({ where: { id: memberId } });
    if (!oldMember) return { ok: false, message: "Group member could not be found." };

    const member = await db.convocationGroupMember.update({
      where: { id: oldMember.id },
      data: { isActive: false }
    });

    await writeAuditLog({
      userId: user.id,
      action: "REMOVE",
      entityType: "ConvocationGroupMember",
      entityId: member.id,
      oldValueJson: oldMember,
      newValueJson: member
    });

    revalidatePath("/convocation/admin");
    return { ok: true, message: "Group member removed from active rotation." };
  }

  const parsed = updateConvocationMemberSchema.safeParse({
    memberId,
    isTechnicalPerson: checked(formData.get("isTechnicalPerson")),
    isGroupLead: checked(formData.get("isGroupLead")),
    isActive: checked(formData.get("isActive"))
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.errors[0]?.message ?? initialError };
  }

  const oldMember = await db.convocationGroupMember.findUnique({ where: { id: parsed.data.memberId } });
  if (!oldMember) return { ok: false, message: "Group member could not be found." };

  const member = await db.convocationGroupMember.update({
    where: { id: oldMember.id },
    data: {
      isTechnicalPerson: parsed.data.isTechnicalPerson,
      isGroupLead: parsed.data.isGroupLead,
      isActive: parsed.data.isActive
    }
  });

  await writeAuditLog({
    userId: user.id,
    action: "UPDATE",
    entityType: "ConvocationGroupMember",
    entityId: member.id,
    oldValueJson: oldMember,
    newValueJson: member
  });

  revalidatePath("/convocation/admin");
  return { ok: true, message: "Group member updated." };
}

export async function updateConvocationGroupMembersAction(_previousState: ActionResult, formData: FormData): Promise<ActionResult> {
  const user = await requireConvocationAdmin();
  const parsed = updateConvocationGroupMembersSchema.safeParse({
    groupId: String(formData.get("groupId") ?? ""),
    technicalMemberId: String(formData.get("technicalMemberId") ?? "") || undefined,
    removedMemberIds: formData.getAll("removedMemberIds").map(String).filter(Boolean),
    unavailableMemberIds: formData.getAll("unavailableMemberIds").map(String).filter(Boolean)
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.errors[0]?.message ?? initialError };
  }

  const members = await db.convocationGroupMember.findMany({
    where: { groupId: parsed.data.groupId }
  });
  const memberIds = new Set(members.map((member) => member.id));
  const invalidRemovedMember = parsed.data.removedMemberIds.find((memberId) => !memberIds.has(memberId));
  const invalidUnavailableMember = parsed.data.unavailableMemberIds.find((memberId) => !memberIds.has(memberId));

  if (invalidRemovedMember) {
    return { ok: false, message: "A selected member does not belong to this group." };
  }

  if (invalidUnavailableMember) {
    return { ok: false, message: "A selected unavailable member does not belong to this group." };
  }

  if (parsed.data.technicalMemberId && !memberIds.has(parsed.data.technicalMemberId)) {
    return { ok: false, message: "The selected technical person does not belong to this group." };
  }

  if (parsed.data.technicalMemberId && parsed.data.removedMemberIds.includes(parsed.data.technicalMemberId)) {
    return { ok: false, message: "The technical person cannot also be removed from the group." };
  }

  if (parsed.data.technicalMemberId && parsed.data.unavailableMemberIds.includes(parsed.data.technicalMemberId)) {
    return { ok: false, message: "The technical person cannot also be marked unavailable." };
  }

  const removedMemberIds = new Set(parsed.data.removedMemberIds);
  const unavailableMemberIds = new Set(parsed.data.unavailableMemberIds);
  const availableMemberIds = members
    .filter((member) => member.isActive && !removedMemberIds.has(member.id) && !unavailableMemberIds.has(member.id))
    .map((member) => member.id);

  const oldValue = members;
  const transaction = [
    db.convocationGroupMember.updateMany({
      where: { groupId: parsed.data.groupId },
      data: { isTechnicalPerson: false, isAvailable: true }
    })
  ];

  if (parsed.data.removedMemberIds.length > 0) {
    transaction.push(
      db.convocationGroupMember.updateMany({
        where: {
          groupId: parsed.data.groupId,
          id: { in: parsed.data.removedMemberIds }
        },
        data: { isActive: false, isAvailable: false }
      })
    );
  }

  if (parsed.data.unavailableMemberIds.length > 0) {
    transaction.push(
      db.convocationGroupMember.updateMany({
        where: {
          groupId: parsed.data.groupId,
          id: { in: parsed.data.unavailableMemberIds },
          isActive: true
        },
        data: { isAvailable: false }
      })
    );
  }

  if (availableMemberIds.length > 0) {
    transaction.push(
      db.convocationGroupMember.updateMany({
        where: {
          groupId: parsed.data.groupId,
          id: { in: availableMemberIds }
        },
        data: { isAvailable: true }
      })
    );
  }

  if (parsed.data.technicalMemberId) {
    transaction.push(
      db.convocationGroupMember.updateMany({
        where: {
          groupId: parsed.data.groupId,
          id: parsed.data.technicalMemberId,
          isActive: true
        },
        data: { isTechnicalPerson: true }
      })
    );
  }

  await db.$transaction(transaction);

  const newValue = await db.convocationGroupMember.findMany({
    where: { groupId: parsed.data.groupId }
  });

  await writeAuditLog({
    userId: user.id,
    action: "UPDATE",
    entityType: "ConvocationGroupMembers",
    entityId: parsed.data.groupId,
    oldValueJson: oldValue,
    newValueJson: newValue
  });

  revalidatePath("/convocation/admin");
  return { ok: true, message: "Group members saved." };
}

export async function generateConvocationProgramAction(_previousState: ActionResult, formData: FormData): Promise<ActionResult> {
  const user = await requireConvocationAdmin();
  const parsed = generateConvocationProgramSchema.safeParse({
    convocationDate: String(formData.get("convocationDate") ?? ""),
    groupId: String(formData.get("groupId") ?? "") || undefined,
    allowSpecialCase: checked(formData.get("allowSpecialCase"))
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.errors[0]?.message ?? initialError };
  }

  const convocationDate = normalizeConvocationDate(parsed.data.convocationDate);
  try {
    assertValidConvocationDate(convocationDate, parsed.data.allowSpecialCase);
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : initialError };
  }

  const existingProgram = await db.convocationProgram.findUnique({
    where: { convocationDate }
  });

  if (existingProgram) {
    if (existingProgram.status !== ConvocationProgramStatus.ARCHIVED) {
      return {
        ok: false,
        message: "A program already exists for this date. Open the saved program to edit or print it."
      };
    }
    // Delete the archived program so we can generate a new one for this date
    await db.convocationProgram.delete({ where: { id: existingProgram.id } });
  }

  const group = parsed.data.groupId
    ? await db.convocationGroup.findUnique({ where: { id: parsed.data.groupId } })
    : await getSuggestedGroupForMonday(convocationDate);
  if (!group) {
    return { ok: false, message: "No active convocation group is available." };
  }

  let generatedItems;
  try {
    generatedItems = await generateConvocationItems({ groupId: group.id, convocationDate });
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : initialError };
  }

  const program = await db.convocationProgram.create({
    data: {
      convocationDate,
      groupId: group.id,
      generatedById: user.id,
      items: {
        create: generatedItems
      }
    }
  });

  await writeAuditLog({
    userId: user.id,
    action: "CREATE",
    entityType: "ConvocationProgram",
    entityId: program.id,
    newValueJson: program
  });

  revalidatePath("/convocation");
  revalidatePath("/convocation/admin");
  redirect(`/convocation/${program.id}`);
}

export async function deleteUpcomingConvocationProgramAction(programId: string): Promise<void> {
  const user = await requireConvocationAdmin();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const program = await db.convocationProgram.findUnique({
    where: { id: programId }
  });

  if (!program) {
    throw new Error("Convocation program could not be found.");
  }

  if (program.convocationDate < today) {
    throw new Error("Only upcoming generated programs can be deleted.");
  }

  if (program.status === ConvocationProgramStatus.FINALIZED) {
    throw new Error("Finalized programs cannot be deleted. Archive or revise them through an administrator workflow.");
  }

  const archivedProgram = await db.convocationProgram.update({
    where: { id: program.id },
    data: {
      status: ConvocationProgramStatus.ARCHIVED
    }
  });

  if (program.calendarActivityId) {
    await db.calendarActivity.update({
      where: { id: program.calendarActivityId },
      data: { description: `${program.notes ?? ""}\n[IOMS_HIDE_CONVOCATION_FROM_CALENDAR]\nConvocation program deleted.`.trim() }
    });
  }

  await writeAuditLog({
    userId: user.id,
    action: "DELETE_UPCOMING",
    entityType: "ConvocationProgram",
    entityId: program.id,
    oldValueJson: program,
    newValueJson: archivedProgram
  });

  revalidatePath("/convocation");
  revalidatePath("/convocation/admin");
  revalidatePath(`/convocation/${program.id}`);
  revalidatePath("/calendar");
  redirect("/convocation");
}

export async function overrideFinalizedConvocationAssignmentAction(itemId: string): Promise<void> {
  const user = await requireConvocationAdmin();
  const item = await db.convocationProgramItem.findUnique({
    where: { id: itemId },
    include: {
      program: {
        include: {
          items: true,
          group: {
            include: {
              members: {
                where: { isActive: true, isAvailable: true },
                include: { personnel: true }
              }
            }
          }
        }
      }
    }
  });

  if (!item) {
    throw new Error("Program assignment could not be found.");
  }

  if (!item.assignedPersonnelId || !item.rotationKey || !item.countInRotation) {
    throw new Error("Only rotating employee assignments can be replaced automatically.");
  }
  const rotationKey = item.rotationKey;

  const eligibleMembers = item.program.group.members.filter((member) =>
    !member.isTechnicalPerson &&
    member.personnel.isActive &&
    member.personnelId !== item.assignedPersonnelId &&
    !item.program.items.some((programItem) =>
      programItem.id !== item.id &&
      programItem.isEnabled &&
      programItem.assignedPersonnelId === member.personnelId
    )
  );

  if (eligibleMembers.length === 0) {
    throw new Error("No eligible replacement is available in the assigned group.");
  }

  const previousWeekHistories = await db.convocationAssignmentHistory.findMany({
    where: {
      groupId: item.program.groupId,
      rotationKey,
      countedInRotation: true,
      convocationDate: {
        gte: addDays(item.program.convocationDate, -7),
        lt: item.program.convocationDate
      }
    },
    select: { personnelId: true }
  });
  const recentAssigneeIds = new Set(previousWeekHistories.map((history) => history.personnelId));
  const notAssignedLastWeek = eligibleMembers.filter((member) => !recentAssigneeIds.has(member.personnelId));
  const replacementPool = notAssignedLastWeek.length > 0 ? notAssignedLastWeek : eligibleMembers;

  const histories = await db.convocationAssignmentHistory.groupBy({
    by: ["personnelId"],
      where: {
        groupId: item.program.groupId,
      rotationKey,
      countedInRotation: true,
      programId: { not: item.programId }
    },
    _count: { personnelId: true }
  });
  const counts = new Map(histories.map((history) => [history.personnelId, history._count.personnelId]));
  const lowestCount = Math.min(...replacementPool.map((member) => counts.get(member.personnelId) ?? 0));
  const leastUsedMembers = replacementPool.filter((member) => (counts.get(member.personnelId) ?? 0) === lowestCount);
  const replacement = leastUsedMembers[Math.floor(Math.random() * leastUsedMembers.length)];

  const updatedItem = await db.$transaction(async (tx) => {
    const nextItem = await tx.convocationProgramItem.update({
      where: { id: item.id },
      data: {
        assignedPersonnelId: replacement.personnelId,
        assignmentMode: ConvocationAssignmentMode.OVERRIDDEN,
        overrideReason: `Automatic replacement for ${item.program.convocationDate.toISOString().slice(0, 10)}. Previous assignee could not attend.`,
        countInRotation: true
      }
    });

    if (item.itemKey === "national_anthem") {
      await tx.convocationProgramItem.updateMany({
        where: {
          programId: item.programId,
          itemKey: "emcee",
          assignmentMode: ConvocationAssignmentMode.MIRRORED
        },
        data: {
          assignedPersonnelId: replacement.personnelId,
          suggestedPersonnelId: replacement.personnelId,
          countInRotation: false
        }
      });
    }

    await tx.convocationAssignmentHistory.deleteMany({
      where: {
        programId: item.programId,
        rotationKey
      }
    });

    await tx.convocationAssignmentHistory.create({
      data: {
        programId: item.programId,
        groupId: item.program.groupId,
        personnelId: replacement.personnelId,
        itemKey: item.itemKey,
        rotationKey,
        convocationDate: item.program.convocationDate,
        wasOverride: true,
        countedInRotation: true
      }
    });

    return nextItem;
  });

  await writeAuditLog({
    userId: user.id,
    action: "AUTO_REPLACE",
    entityType: "ConvocationProgramItem",
    entityId: item.id,
    oldValueJson: {
      assignedPersonnelId: item.assignedPersonnelId,
      assignmentMode: item.assignmentMode,
      rotationKey: item.rotationKey
    },
    newValueJson: {
      assignedPersonnelId: updatedItem.assignedPersonnelId,
      assignmentMode: updatedItem.assignmentMode,
      rotationKey: updatedItem.rotationKey
    }
  });

  revalidatePath("/convocation");
  revalidatePath(`/convocation/${item.programId}`);
  revalidatePath(`/convocation/${item.programId}/print`);
}

export async function updateConvocationItemAction(_previousState: ActionResult, formData: FormData): Promise<ActionResult> {
  const user = await requireConvocationAdmin();
  const parsed = updateConvocationItemSchema.safeParse({
    itemId: String(formData.get("itemId") ?? ""),
    assignmentMode: String(formData.get("assignmentMode") ?? ""),
    assignedPersonnelId: String(formData.get("assignedPersonnelId") ?? "") || undefined,
    fixedTextValue: String(formData.get("fixedTextValue") ?? ""),
    isEnabled: checked(formData.get("isEnabled")),
    countInRotation: checked(formData.get("countInRotation")),
    overrideReason: String(formData.get("overrideReason") ?? "")
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.errors[0]?.message ?? initialError };
  }

  const oldItem = await db.convocationProgramItem.findUnique({
    where: { id: parsed.data.itemId }
  });
  if (!oldItem) return { ok: false, message: "Program item could not be found." };

  const item = await db.convocationProgramItem.update({
    where: { id: oldItem.id },
    data: {
      assignmentMode: parsed.data.assignmentMode,
      assignedPersonnelId: parsed.data.assignedPersonnelId || null,
      fixedTextValue: parsed.data.fixedTextValue || null,
      isEnabled: parsed.data.isEnabled,
      countInRotation: parsed.data.countInRotation,
      overrideReason: parsed.data.overrideReason || null
    }
  });

  if (item.itemKey === "national_anthem") {
    await db.convocationProgramItem.updateMany({
      where: {
        programId: item.programId,
        itemKey: "emcee",
        assignmentMode: ConvocationAssignmentMode.MIRRORED
      },
      data: {
        assignedPersonnelId: item.assignedPersonnelId,
        suggestedPersonnelId: item.assignedPersonnelId,
        countInRotation: false
      }
    });
  }

  await writeAuditLog({
    userId: user.id,
    action: "UPDATE",
    entityType: "ConvocationProgramItem",
    entityId: item.id,
    oldValueJson: oldItem,
    newValueJson: item
  });

  revalidatePath(`/convocation/${item.programId}`);
  return { ok: true, message: "Program item updated." };
}

export async function finalizeConvocationProgramAction(programId: string): Promise<void> {
  const user = await requireConvocationAdmin();
  const program = await db.convocationProgram.findUnique({
    where: { id: programId },
    include: {
      items: true
    }
  });

  if (!program) throw new Error("Convocation program could not be found.");

  const missingItems = program.items.filter((item) => {
    if (!item.isEnabled) return false;
    if (item.assignedPersonnelId || item.fixedTextValue) return false;
    return true;
  });
  if (missingItems.length > 0) {
    throw new Error(`Cannot finalize. Missing assignment for: ${missingItems.map((item) => item.itemLabel).join(", ")}`);
  }

  await db.convocationAssignmentHistory.deleteMany({ where: { programId: program.id } });
  const rotationItems = program.items.filter((item) =>
    item.isEnabled &&
    item.assignedPersonnelId &&
    item.rotationKey &&
    item.countInRotation
  );

  await db.$transaction([
    db.convocationProgram.update({
      where: { id: program.id },
      data: {
        status: ConvocationProgramStatus.FINALIZED,
        finalizedById: user.id,
        finalizedAt: new Date()
      }
    }),
    ...rotationItems.map((item) =>
      db.convocationAssignmentHistory.create({
        data: {
          programId: program.id,
          groupId: program.groupId,
          personnelId: item.assignedPersonnelId as string,
          itemKey: item.itemKey,
          rotationKey: item.rotationKey as string,
          convocationDate: program.convocationDate,
          wasOverride: item.assignmentMode === ConvocationAssignmentMode.OVERRIDDEN,
          countedInRotation: true
        }
      })
    )
  ]);

  await syncConvocationCalendarEntry(program.id);
  await writeAuditLog({
    userId: user.id,
    action: "FINALIZE",
    entityType: "ConvocationProgram",
    entityId: program.id,
    newValueJson: { status: ConvocationProgramStatus.FINALIZED }
  });

  revalidatePath("/convocation");
  revalidatePath("/convocation/admin");
  revalidatePath(`/convocation/${program.id}`);
  revalidatePath("/calendar");
}

export async function updateConvocationTemplateItemAction(_previousState: ActionResult, formData: FormData): Promise<ActionResult> {
  const user = await requireConvocationAdmin();
  const parsed = updateConvocationTemplateItemSchema.safeParse({
    templateItemId: String(formData.get("templateItemId") ?? ""),
    defaultMode: String(formData.get("defaultMode") ?? ""),
    fixedTextValue: String(formData.get("fixedTextValue") ?? ""),
    isEnabled: checked(formData.get("isEnabled"))
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.errors[0]?.message ?? initialError };
  }

  const oldItem = await db.convocationTemplateItem.findUnique({ where: { id: parsed.data.templateItemId } });
  if (!oldItem) return { ok: false, message: "Template item could not be found." };
  const fixedTextValue = oldItem.itemKey === "message" && parsed.data.fixedTextValue === defaultMessageSpeaker
    ? formatMessageSpeaker(parsed.data.fixedTextValue)
    : parsed.data.fixedTextValue;

  const item = await db.convocationTemplateItem.update({
    where: { id: oldItem.id },
    data: {
      defaultMode: parsed.data.defaultMode,
      fixedTextValue: fixedTextValue || null,
      isEnabled: parsed.data.isEnabled
    }
  });

  await writeAuditLog({
    userId: user.id,
    action: "UPDATE",
    entityType: "ConvocationTemplateItem",
    entityId: item.id,
    oldValueJson: oldItem,
    newValueJson: item
  });

  revalidatePath("/convocation/admin");
  return { ok: true, message: "Template item updated for future programs." };
}

export async function setDefaultConvocationPdfTemplateAction(_prevState: unknown, formData: FormData) {
  const user = await requireConvocationAdmin();
  const templateId = String(formData.get("templateId") ?? "");
  if (!templateId) return { ok: false, message: "Please select a template." };
  
  await db.$transaction([
    db.pdfTemplate.updateMany({
      where: { templateFeature: "CONVOCATION_PROGRAM" },
      data: { isDefault: false }
    }),
    db.pdfTemplate.update({
      where: { id: templateId },
      data: { isDefault: true }
    })
  ]);

  await writeAuditLog({
    userId: user.id,
    action: "SET_DEFAULT",
    entityType: "PdfTemplate",
    entityId: templateId,
    newValueJson: { isDefault: true }
  });

  revalidatePath("/convocation/admin");
  return { ok: true, message: "Default PDF template updated successfully." };
}

export async function overrideConvocationItemPersonnelAction(itemId: string, personnelId: string): Promise<void> {
  const user = await requireConvocationAdmin();
  
  const item = await db.convocationProgramItem.findUnique({
    where: { id: itemId },
    include: { program: true }
  });

  if (!item) {
    throw new Error("Program assignment could not be found.");
  }

  const personnel = await db.personnel.findUnique({
    where: { id: personnelId }
  });

  if (!personnel) {
    throw new Error("Selected employee could not be found.");
  }

  const textValue = personnel.fullName + (personnel.position ? `, ${personnel.position}` : "");

  await db.$transaction(async (tx) => {
    await tx.convocationProgramItem.update({
      where: { id: item.id },
      data: {
        assignedPersonnelId: personnel.id,
        fixedTextValue: textValue,
        assignmentMode: ConvocationAssignmentMode.OVERRIDDEN,
        overrideReason: `Manual personnel replacement.`
      }
    });

    if (item.itemKey === "national_anthem") {
      await tx.convocationProgramItem.updateMany({
        where: {
          programId: item.programId,
          itemKey: "emcee",
          assignmentMode: ConvocationAssignmentMode.MIRRORED
        },
        data: {
          assignedPersonnelId: personnel.id,
          fixedTextValue: textValue
        }
      });
    }

    await tx.convocationAssignmentHistory.deleteMany({
      where: {
        programId: item.programId,
        itemKey: { in: [item.itemKey, item.itemKey === "national_anthem" ? "emcee" : ""] }
      }
    });

    if (item.program.status === "FINALIZED" && item.countInRotation) {
      await tx.convocationAssignmentHistory.create({
        data: {
          programId: item.programId,
          groupId: item.program.groupId,
          personnelId: personnel.id,
          itemKey: item.itemKey,
          rotationKey: item.rotationKey as string,
          convocationDate: item.program.convocationDate,
          wasOverride: true,
          countedInRotation: true
        }
      });
    }
  });

  await writeAuditLog({
    userId: user.id,
    action: "MANUAL_REPLACE_PERSONNEL",
    entityType: "ConvocationProgramItem",
    entityId: item.id,
    oldValueJson: {
      assignedPersonnelId: item.assignedPersonnelId,
      fixedTextValue: item.fixedTextValue
    },
    newValueJson: {
      assignedPersonnelId: personnel.id,
      fixedTextValue: textValue
    }
  });

  revalidatePath("/convocation");
  revalidatePath(`/convocation/${item.programId}`);
  revalidatePath(`/convocation/${item.programId}/print`);
}

export async function overrideConvocationItemCustomTextAction(itemId: string, customText: string): Promise<void> {
  const user = await requireConvocationAdmin();
  
  const item = await db.convocationProgramItem.findUnique({
    where: { id: itemId },
    include: { program: true }
  });

  if (!item) {
    throw new Error("Program assignment could not be found.");
  }

  await db.$transaction(async (tx) => {
    await tx.convocationProgramItem.update({
      where: { id: item.id },
      data: {
        assignedPersonnelId: null,
        fixedTextValue: customText,
        assignmentMode: ConvocationAssignmentMode.OVERRIDDEN,
        overrideReason: `Custom text override.`,
        countInRotation: false
      }
    });

    if (item.itemKey === "national_anthem") {
      await tx.convocationProgramItem.updateMany({
        where: {
          programId: item.programId,
          itemKey: "emcee",
          assignmentMode: ConvocationAssignmentMode.MIRRORED
        },
        data: {
          assignedPersonnelId: null,
          fixedTextValue: customText,
          countInRotation: false
        }
      });
    }

    await tx.convocationAssignmentHistory.deleteMany({
      where: {
        programId: item.programId,
        itemKey: { in: [item.itemKey, item.itemKey === "national_anthem" ? "emcee" : ""] }
      }
    });
  });

  await writeAuditLog({
    userId: user.id,
    action: "MANUAL_REPLACE_CUSTOM_TEXT",
    entityType: "ConvocationProgramItem",
    entityId: item.id,
    oldValueJson: {
      assignedPersonnelId: item.assignedPersonnelId,
      fixedTextValue: item.fixedTextValue
    },
    newValueJson: {
      assignedPersonnelId: null,
      fixedTextValue: customText
    }
  });

  revalidatePath("/convocation");
  revalidatePath(`/convocation/${item.programId}`);
  revalidatePath(`/convocation/${item.programId}/print`);
}

export async function postponeConvocationProgramAction(programId: string): Promise<void> {
  const user = await requireConvocationAdmin();
  const program = await db.convocationProgram.findUnique({
    where: { id: programId },
    include: {
      calendarActivity: true,
    }
  });

  if (!program) {
    throw new Error("Convocation program could not be found.");
  }

  // Calculate the next Monday (add 7 days)
  const nextMonday = addDays(program.convocationDate, 7);
  
  // Check if a program already exists for the new date
  const existingProgram = await db.convocationProgram.findUnique({
    where: { convocationDate: nextMonday }
  });

  if (existingProgram) {
    throw new Error("A program already exists for the next Monday. Please archive or delete it first.");
  }

  await db.$transaction(async (tx) => {
    // 1. Update ConvocationProgram date
    await tx.convocationProgram.update({
      where: { id: program.id },
      data: { convocationDate: nextMonday }
    });

    // 2. Update ConvocationAssignmentHistory records
    await tx.convocationAssignmentHistory.updateMany({
      where: { programId: program.id },
      data: { convocationDate: nextMonday }
    });

    // 3. Update CalendarActivity if it exists
    if (program.calendarActivityId && program.calendarActivity) {
      const descriptionSuffix = `\n[Postponed from ${program.convocationDate.toISOString().slice(0, 10)}]`;
      await tx.calendarActivity.update({
        where: { id: program.calendarActivityId },
        data: { 
          startDate: nextMonday,
          endDate: nextMonday,
          description: program.calendarActivity.description 
            ? `${program.calendarActivity.description}${descriptionSuffix}` 
            : descriptionSuffix
        }
      });
    }
  });

  await writeAuditLog({
    userId: user.id,
    action: "POSTPONE",
    entityType: "ConvocationProgram",
    entityId: program.id,
    oldValueJson: { convocationDate: program.convocationDate },
    newValueJson: { convocationDate: nextMonday }
  });

  revalidatePath("/convocation");
  revalidatePath("/convocation/admin");
  revalidatePath(`/convocation/${program.id}`);
  revalidatePath("/calendar");
  redirect(`/convocation/${program.id}`);
}

export async function rescheduleConvocationProgramAction(programId: string, formData: FormData): Promise<void> {
  const user = await requireConvocationAdmin();
  const program = await db.convocationProgram.findUnique({
    where: { id: programId },
    include: {
      calendarActivity: true,
    }
  });

  if (!program) {
    throw new Error("Convocation program could not be found.");
  }

  const dateString = formData.get("newDate");
  if (!dateString || typeof dateString !== "string") {
    throw new Error("Invalid or missing date.");
  }

  const newDate = new Date(`${dateString}T00:00:00.000Z`);

  if (isNaN(newDate.getTime())) {
    throw new Error("Invalid date format.");
  }

  // Check if a program already exists for the new date
  const existingProgram = await db.convocationProgram.findUnique({
    where: { convocationDate: newDate }
  });

  if (existingProgram) {
    throw new Error(`A program already exists for ${dateString}. Please archive or delete it first.`);
  }

  await db.$transaction(async (tx) => {
    // 1. Update ConvocationProgram date
    await tx.convocationProgram.update({
      where: { id: program.id },
      data: { convocationDate: newDate }
    });

    // 2. Update ConvocationAssignmentHistory records
    await tx.convocationAssignmentHistory.updateMany({
      where: { programId: program.id },
      data: { convocationDate: newDate }
    });

    // 3. Update CalendarActivity if it exists
    if (program.calendarActivityId && program.calendarActivity) {
      const descriptionSuffix = `\n[Rescheduled from ${program.convocationDate.toISOString().slice(0, 10)}]`;
      await tx.calendarActivity.update({
        where: { id: program.calendarActivityId },
        data: { 
          startDate: newDate,
          endDate: newDate,
          description: program.calendarActivity.description 
            ? `${program.calendarActivity.description}${descriptionSuffix}` 
            : descriptionSuffix
        }
      });
    }
  });

  await writeAuditLog({
    userId: user.id,
    action: "RESCHEDULE",
    entityType: "ConvocationProgram",
    entityId: program.id,
    oldValueJson: { convocationDate: program.convocationDate },
    newValueJson: { convocationDate: newDate }
  });

  revalidatePath("/convocation");
  revalidatePath("/convocation/admin");
  revalidatePath(`/convocation/${program.id}`);
  revalidatePath("/calendar");
  redirect(`/convocation/${program.id}`);
}

export async function rescheduleLastTeamAction(): Promise<void> {
  const user = await requireConvocationAdmin();
  
  // Find the most recent program (finalized or draft, usually finalized)
  const lastProgram = await db.convocationProgram.findFirst({
    where: { status: { not: ConvocationProgramStatus.ARCHIVED } },
    orderBy: { convocationDate: "desc" },
    include: { calendarActivity: true }
  });

  if (!lastProgram) {
    throw new Error("No previous convocation program found to reschedule.");
  }

  const nextMonday = getNextMonday();

  if (lastProgram.convocationDate >= nextMonday) {
    throw new Error("The latest program is already scheduled for the upcoming Monday or later.");
  }

  const existingProgram = await db.convocationProgram.findUnique({
    where: { convocationDate: nextMonday }
  });

  if (existingProgram) {
    throw new Error("A program already exists for the next Monday. Please archive or delete it first.");
  }

  await db.$transaction(async (tx) => {
    // Update ConvocationProgram date
    await tx.convocationProgram.update({
      where: { id: lastProgram.id },
      data: { convocationDate: nextMonday }
    });

    // Update history records
    await tx.convocationAssignmentHistory.updateMany({
      where: { programId: lastProgram.id },
      data: { convocationDate: nextMonday }
    });

    // Update CalendarActivity if it exists
    if (lastProgram.calendarActivityId && lastProgram.calendarActivity) {
      const descriptionSuffix = `\n[Rescheduled from ${lastProgram.convocationDate.toISOString().slice(0, 10)}]`;
      await tx.calendarActivity.update({
        where: { id: lastProgram.calendarActivityId },
        data: { 
          startDate: nextMonday,
          endDate: nextMonday,
          description: lastProgram.calendarActivity.description 
            ? `${lastProgram.calendarActivity.description}${descriptionSuffix}` 
            : descriptionSuffix
        }
      });
    }
  });

  await writeAuditLog({
    userId: user.id,
    action: "RESCHEDULE_LAST",
    entityType: "ConvocationProgram",
    entityId: lastProgram.id,
    oldValueJson: { convocationDate: lastProgram.convocationDate },
    newValueJson: { convocationDate: nextMonday }
  });

  revalidatePath("/convocation");
  revalidatePath("/convocation/admin");
  revalidatePath(`/convocation/${lastProgram.id}`);
  revalidatePath("/calendar");
  redirect(`/convocation/${lastProgram.id}`);
}
