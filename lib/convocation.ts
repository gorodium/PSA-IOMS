import "server-only";

import { addDays, format, isMonday, startOfDay } from "date-fns";
import { ActivityType, ConvocationAssignmentMode, ConvocationProgramStatus } from "@prisma/client";
import { db } from "@/lib/db";

export const convocationCalendarHideMarker = "[IOMS_HIDE_CONVOCATION_FROM_CALENDAR]";
export const defaultMessageSpeaker = "Maria Liza M. Bigornia";
export const defaultMessageSpeakerPosition = "Chief Statistical Specialist";

export function formatMessageSpeaker(value: string | null | undefined) {
  if (!value) return value;
  if (value === defaultMessageSpeaker) {
    return `${defaultMessageSpeaker}, ${defaultMessageSpeakerPosition}`;
  }
  return value;
}

export function isConvocationAdmin(role: string | null | undefined) {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}

export function normalizeConvocationDate(value: string) {
  return startOfDay(new Date(`${value}T00:00:00`));
}

export function getNextMonday(from = new Date()) {
  const date = startOfDay(from);
  const daysUntilMonday = (8 - date.getDay()) % 7 || 7;
  return addDays(date, daysUntilMonday);
}

export function formatProgramDate(date: Date) {
  return format(date, "MMMM d, yyyy");
}

export function formatAssignmentMode(mode: ConvocationAssignmentMode) {
  return mode.replaceAll("_", " ");
}

export async function getSuggestedGroupForMonday(convocationDate: Date) {
  const groups = await db.convocationGroup.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" }
  });

  if (groups.length === 0) {
    return null;
  }

  const previousProgram = await db.convocationProgram.findFirst({
    where: {
      convocationDate: { lt: convocationDate }
    },
    include: {
      group: true
    },
    orderBy: { convocationDate: "desc" }
  });

  if (!previousProgram) {
    return groups[0];
  }

  const previousIndex = groups.findIndex((group) => group.id === previousProgram.groupId);
  return groups[(previousIndex + 1) % groups.length] ?? groups[0];
}

async function assignmentCounts(groupId: string, rotationKey: string) {
  const histories = await db.convocationAssignmentHistory.groupBy({
    by: ["personnelId"],
    where: {
      groupId,
      rotationKey,
      countedInRotation: true
    },
    _count: { personnelId: true }
  });

  return new Map(histories.map((item) => [item.personnelId, item._count.personnelId]));
}

export async function generateConvocationItems(input: {
  groupId: string;
  convocationDate: Date;
}) {
  const [group, templateItems] = await Promise.all([
    db.convocationGroup.findUnique({
      where: { id: input.groupId },
      include: {
        members: {
          where: { isActive: true },
          include: { personnel: true },
          orderBy: { createdAt: "asc" }
        }
      }
    }),
    db.convocationTemplateItem.findMany({
      where: { isEnabled: true },
      orderBy: { itemOrder: "asc" }
    })
  ]);

  if (!group) {
    throw new Error("Selected convocation group could not be found.");
  }

  const eligibleMembers = group.members.filter((member) =>
    member.isAvailable &&
    !member.isTechnicalPerson &&
    member.personnel.isActive
  );
  const assignableRotationKeys = Array.from(
    new Set(
      templateItems
        .filter((item) => item.defaultMode === ConvocationAssignmentMode.ASSIGNABLE && item.rotationKey)
        .map((item) => item.rotationKey as string)
    )
  );

  if (eligibleMembers.length === 0) {
    throw new Error(`${group.name} has no eligible non-technical members. Add real employees before generating a program.`);
  }

  if (eligibleMembers.length < assignableRotationKeys.length) {
    throw new Error(`${group.name} has ${eligibleMembers.length} eligible member(s), but ${assignableRotationKeys.length} assignable role(s). Add more members or change some items to fixed before generating.`);
  }

  const usedPersonnelIds = new Set<string>();
  const selectedByItemKey = new Map<string, string | null>();
  const selectedByRotationKey = new Map<string, string>();

  const items = [];
  for (const template of templateItems) {
    let assignedPersonnelId: string | null = null;
    let suggestedPersonnelId: string | null = null;
    let countInRotation = false;

    if (template.defaultMode === ConvocationAssignmentMode.ASSIGNABLE && template.rotationKey) {
      if (selectedByRotationKey.has(template.rotationKey)) {
        assignedPersonnelId = selectedByRotationKey.get(template.rotationKey) ?? null;
      } else {
        const counts = await assignmentCounts(input.groupId, template.rotationKey);
        const available = eligibleMembers.filter((member) => !usedPersonnelIds.has(member.personnelId));
        const pool = available.length > 0 ? available : eligibleMembers;
        const minCount = Math.min(...pool.map((m) => counts.get(m.personnelId) ?? 0));
        const minCountMembers = pool.filter((m) => (counts.get(m.personnelId) ?? 0) === minCount);
        const selected = minCountMembers[Math.floor(Math.random() * minCountMembers.length)];

        assignedPersonnelId = selected.personnelId;
        selectedByRotationKey.set(template.rotationKey, selected.personnelId);
        usedPersonnelIds.add(selected.personnelId);
      }
      suggestedPersonnelId = assignedPersonnelId;
      countInRotation = true;
    }

    if (template.defaultMode === ConvocationAssignmentMode.MIRRORED && template.mirrorOfItemKey) {
      assignedPersonnelId = selectedByItemKey.get(template.mirrorOfItemKey) ?? null;
      suggestedPersonnelId = assignedPersonnelId;
      countInRotation = false;
    }

    const fixedTextValue = template.itemKey === "message"
      ? formatMessageSpeaker(template.fixedTextValue)
      : template.fixedTextValue;

    selectedByItemKey.set(template.itemKey, assignedPersonnelId);
    items.push({
      itemKey: template.itemKey,
      itemLabel: template.itemLabel,
      itemOrder: template.itemOrder,
      assignmentMode: template.defaultMode,
      assignedPersonnelId,
      suggestedPersonnelId,
      fixedTextValue,
      isEnabled: template.isEnabled,
      rotationKey: template.rotationKey,
      mirrorOfItemKey: template.mirrorOfItemKey,
      countInRotation
    });
  }

  return items;
}

export async function syncConvocationCalendarEntry(programId: string) {
  const program = await db.convocationProgram.findUnique({
    where: { id: programId },
    include: { group: true }
  });

  if (!program) return;

  if (program.status !== ConvocationProgramStatus.FINALIZED) {
    if (program.calendarActivityId) {
      await db.calendarActivity.update({
        where: { id: program.calendarActivityId },
        data: { description: `${convocationCalendarHideMarker}\nConvocation status: ${program.status}` }
      });
    }
    return;
  }

  const data = {
    type: ActivityType.EVENT,
    title: "Convocation Program",
    description: [
      "Convocation Program",
      `Date: ${formatProgramDate(program.convocationDate)}`,
      `Assigned group: ${program.group.name}`,
      "View the Convocation Program module for the printable assignment."
    ].join("\n"),
    startDate: program.convocationDate,
    endDate: program.convocationDate,
    location: "PSA Misamis Oriental",
    personnelId: null,
    vehicleName: null
  };

  if (program.calendarActivityId) {
    await db.calendarActivity.update({
      where: { id: program.calendarActivityId },
      data
    });
    return;
  }

  const activity = await db.calendarActivity.create({ data });
  await db.convocationProgram.update({
    where: { id: program.id },
    data: { calendarActivityId: activity.id }
  });
}

export function assertValidConvocationDate(date: Date, allowSpecialCase: boolean) {
  if (!allowSpecialCase && !isMonday(date)) {
    throw new Error("Official convocation programs must be generated for Monday dates unless special case is checked.");
  }
}
