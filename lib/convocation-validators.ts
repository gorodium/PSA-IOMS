import { z } from "zod";
import { ConvocationAssignmentMode, ConvocationProgramStatus } from "@prisma/client";

export const addConvocationMemberSchema = z.object({
  groupId: z.string().min(1, "Select a group."),
  personnelId: z.string().min(1, "Select an employee."),
  isTechnicalPerson: z.boolean().default(false),
  isGroupLead: z.boolean().default(false)
});

export const updateConvocationMemberSchema = z.object({
  memberId: z.string().min(1, "Select a group member."),
  isTechnicalPerson: z.boolean().default(false),
  isGroupLead: z.boolean().default(false),
  isActive: z.boolean().default(true)
});

export const updateConvocationGroupMembersSchema = z.object({
  groupId: z.string().min(1, "Select a convocation group."),
  technicalMemberId: z.string().optional(),
  removedMemberIds: z.array(z.string()).default([]),
  unavailableMemberIds: z.array(z.string()).default([])
});

export const generateConvocationProgramSchema = z.object({
  convocationDate: z.string().min(1, "Select a convocation date."),
  groupId: z.string().optional(),
  allowSpecialCase: z.boolean().default(false)
});

export const updateConvocationItemSchema = z.object({
  itemId: z.string().min(1, "Select a program item."),
  assignmentMode: z.nativeEnum(ConvocationAssignmentMode),
  assignedPersonnelId: z.string().optional(),
  fixedTextValue: z.string().trim().optional(),
  isEnabled: z.boolean().default(true),
  countInRotation: z.boolean().default(false),
  overrideReason: z.string().trim().optional()
});

export const updateConvocationProgramSchema = z.object({
  programId: z.string().min(1, "Select a program."),
  status: z.nativeEnum(ConvocationProgramStatus).optional(),
  notes: z.string().trim().optional()
});

export const updateConvocationTemplateItemSchema = z.object({
  templateItemId: z.string().min(1, "Select a template item."),
  defaultMode: z.nativeEnum(ConvocationAssignmentMode),
  fixedTextValue: z.string().trim().optional(),
  isEnabled: z.boolean().default(true)
});
