"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import {
  addConvocationMemberAction,
  generateConvocationProgramAction,
  updateConvocationGroupMembersAction,
  updateConvocationItemAction,
  updateConvocationMemberAction,
  updateConvocationTemplateItemAction,
  setDefaultConvocationPdfTemplateAction
} from "@/app/(app)/convocation/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type PersonnelOption = {
  id: string;
  fullName: string;
  section: string;
};

type GroupOption = {
  id: string;
  name: string;
};

type ConvocationGroupMember = {
  id: string;
  isTechnicalPerson: boolean;
  isGroupLead: boolean;
  isAvailable: boolean;
  isActive: boolean;
  personnel: {
    fullName: string;
    section: string;
    position?: string | null;
  };
};

type ConvocationGroupForEditor = GroupOption & {
  members: ConvocationGroupMember[];
};

type AssignmentMode = "FIXED" | "CUSTOM" | "ASSIGNABLE" | "OVERRIDDEN" | "MIRRORED";

const assignmentModes: AssignmentMode[] = ["FIXED", "CUSTOM", "ASSIGNABLE", "OVERRIDDEN", "MIRRORED"];
const templateModes: AssignmentMode[] = ["FIXED", "CUSTOM", "ASSIGNABLE", "MIRRORED"];
const assignmentModeLabels: Record<AssignmentMode, string> = {
  FIXED: "Fixed",
  CUSTOM: "Custom",
  ASSIGNABLE: "Assignable",
  OVERRIDDEN: "Overridden",
  MIRRORED: "Mirrored"
};

type FormState = {
  ok: boolean;
  message: string;
  selectedGroupId?: string;
};

const initialState: FormState = { ok: false, message: "" };

function Message({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <div className={state.ok ? "rounded-md border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-800" : "rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-800"}>
      {state.message}
    </div>
  );
}

export function GenerateConvocationProgramForm({
  groups,
  defaultDate
}: {
  groups: GroupOption[];
  defaultDate: string;
}) {
  const [state, action, isPending] = useActionState(generateConvocationProgramAction, initialState);

  return (
    <form action={action} className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-[180px_1fr_auto]">
      <label className="space-y-1">
        <span className="text-xs font-medium text-muted-foreground">Monday date</span>
        <Input name="convocationDate" type="date" defaultValue={defaultDate} required />
      </label>
      <label className="space-y-1">
        <span className="text-xs font-medium text-muted-foreground">Assigned group</span>
        <Select name="groupId" defaultValue="">
          <option value="">Use next group in cycle</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>{group.name}</option>
          ))}
        </Select>
      </label>
      <div className="flex items-end">
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Generating..." : "Generate"}
        </Button>
      </div>
      <label className="md:col-span-3 flex items-center gap-2 text-sm">
        <input type="checkbox" name="allowSpecialCase" className="h-4 w-4" />
        Allow special non-Monday program
      </label>
      <div className="md:col-span-3"><Message state={state} /></div>
    </form>
  );
}

export function AddConvocationMemberForm({
  groups,
  personnel,
  initialSelectedGroupId
}: {
  groups: GroupOption[];
  personnel: PersonnelOption[];
  initialSelectedGroupId?: string;
}) {
  const [state, action, isPending] = useActionState(addConvocationMemberAction, initialState);
  const fallbackGroupId = groups[0]?.id ?? "";
  const serverSelectedGroupId = initialSelectedGroupId && groups.some((group) => group.id === initialSelectedGroupId)
    ? initialSelectedGroupId
    : undefined;
  const [selectedGroupId, setSelectedGroupId] = useState(serverSelectedGroupId ?? fallbackGroupId);

  useEffect(() => {
    const preferredGroupId =
      state.selectedGroupId ??
      serverSelectedGroupId ??
      window.localStorage.getItem("ioms_convocation_selected_group");

    if (preferredGroupId && groups.some((group) => group.id === preferredGroupId)) {
      setSelectedGroupId(preferredGroupId);
      window.localStorage.setItem("ioms_convocation_selected_group", preferredGroupId);
    }
  }, [groups, serverSelectedGroupId, state.selectedGroupId]);

  function handleGroupChange(groupId: string) {
    setSelectedGroupId(groupId);
    window.localStorage.setItem("ioms_convocation_selected_group", groupId);
  }

  return (
    <form action={action} className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-[160px_1fr_auto]">
      <Select
        name="groupId"
        required
        value={selectedGroupId}
        onChange={(event) => handleGroupChange(event.target.value)}
      >
        {groups.map((group) => (
          <option key={group.id} value={group.id}>{group.name}</option>
        ))}
      </Select>
      <Select name="personnelId" required>
        <option value="">Select Employee</option>
        {personnel.map((person) => (
          <option key={person.id} value={person.id}>{person.fullName} - {person.section}</option>
        ))}
      </Select>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Add Member"}
      </Button>
      <div className="md:col-span-3"><Message state={state} /></div>
    </form>
  );
}

export function ConvocationGroupEditor({ group }: { group: ConvocationGroupForEditor }) {
  const activeMembers = useMemo(
    () => group.members.filter((member) => member.isActive),
    [group.members]
  );
  const initialTechnicalMemberId = activeMembers.find((member) => member.isTechnicalPerson)?.id ?? "";
  const initialUnavailableMemberIds = useMemo(
    () => activeMembers.filter((member) => !member.isAvailable).map((member) => member.id),
    [activeMembers]
  );
  const [state, action, isPending] = useActionState(updateConvocationGroupMembersAction, initialState);
  const [removedMemberIds, setRemovedMemberIds] = useState<string[]>([]);
  const [unavailableMemberIds, setUnavailableMemberIds] = useState<string[]>(initialUnavailableMemberIds);
  const [technicalMemberId, setTechnicalMemberId] = useState(initialTechnicalMemberId);

  useEffect(() => {
    setRemovedMemberIds([]);
    setUnavailableMemberIds(initialUnavailableMemberIds);
    setTechnicalMemberId(initialTechnicalMemberId);
  }, [group.id, initialTechnicalMemberId, initialUnavailableMemberIds, state.ok]);

  const removedMemberIdSet = new Set(removedMemberIds);
  const unavailableMemberIdSet = new Set(unavailableMemberIds);
  const visibleMembers = activeMembers.filter((member) => !removedMemberIdSet.has(member.id));
  const availableMembers = visibleMembers.filter((member) => !unavailableMemberIdSet.has(member.id));
  const eligibleMembers = availableMembers.filter((member) => member.id !== technicalMemberId);
  const inactiveMembersCount = group.members.length - activeMembers.length;

  function stageMemberRemoval(memberId: string) {
    setRemovedMemberIds((current) => current.includes(memberId) ? current : [...current, memberId]);
    if (technicalMemberId === memberId) {
      setTechnicalMemberId("");
    }
  }

  function toggleMemberAvailability(memberId: string) {
    setUnavailableMemberIds((current) => {
      const next = current.includes(memberId)
        ? current.filter((id) => id !== memberId)
        : [...current, memberId];

      if (technicalMemberId === memberId && !current.includes(memberId)) {
        setTechnicalMemberId("");
      }

      return next;
    });
  }

  return (
    <form action={action} className="flex h-full flex-col rounded-lg border bg-background p-4 shadow-sm">
      <input type="hidden" name="groupId" value={group.id} />
      {removedMemberIds.map((memberId) => (
        <input key={memberId} type="hidden" name="removedMemberIds" value={memberId} />
      ))}
      {unavailableMemberIds.map((memberId) => (
        <input key={memberId} type="hidden" name="unavailableMemberIds" value={memberId} />
      ))}

      <div className="border-b pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-base font-semibold">{group.name}</p>
            <p className="text-xs text-muted-foreground">
              {visibleMembers.length} active member(s), {availableMembers.length} available, {eligibleMembers.length} rotation-eligible
            </p>
            {inactiveMembersCount > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                {inactiveMembersCount} removed member(s) hidden from this group.
              </p>
            )}
          </div>
          {removedMemberIds.length > 0 && (
            <Button type="button" size="sm" variant="ghost" onClick={() => setRemovedMemberIds([])}>
              Undo
            </Button>
          )}
        </div>
        {eligibleMembers.length < 6 && (
          <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
            Add more eligible members before generating programs with the full default task flow.
          </p>
        )}
      </div>

      <div className="mt-4 rounded-lg border bg-muted/20 p-3">
        <label className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Technical person</span>
          <Select
            name="technicalMemberId"
            value={technicalMemberId}
            onChange={(event) => setTechnicalMemberId(event.target.value)}
          >
            <option value="">No technical person assigned</option>
            {availableMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.personnel.fullName}
              </option>
            ))}
          </Select>
        </label>
        <p className="mt-2 text-xs text-muted-foreground">
          The selected technical person is excluded from normal task rotation.
        </p>
      </div>

      <div className="mt-4 flex-1 space-y-2">
        {visibleMembers.length === 0 ? (
          <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
            No active members configured.
          </div>
        ) : visibleMembers.map((member) => (
          <div
            key={member.id}
            className={
              unavailableMemberIdSet.has(member.id)
                ? "flex items-start justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-900/60 dark:bg-amber-950/20"
                : "flex items-start justify-between gap-3 rounded-lg border bg-card p-3"
            }
          >
            <div className="min-w-0">
              <p className="text-sm font-medium leading-5 text-foreground">{member.personnel.fullName}</p>
              <p className="text-xs leading-5 text-muted-foreground">{member.personnel.section}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {member.id === technicalMemberId && (
                  <span className="rounded bg-slate-100 px-2 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    Technical
                  </span>
                )}
                {member.isGroupLead && (
                  <span className="rounded bg-slate-100 px-2 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    Lead
                  </span>
                )}
                {unavailableMemberIdSet.has(member.id) && (
                  <span className="rounded bg-amber-100 px-2 py-1 text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                    Unavailable
                  </span>
                )}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className={
                  unavailableMemberIdSet.has(member.id)
                    ? "h-8 border-emerald-200 px-2 text-xs text-emerald-700 hover:bg-emerald-50"
                    : "h-8 border-amber-200 px-2 text-xs text-amber-700 hover:bg-amber-50"
                }
                onClick={() => toggleMemberAvailability(member.id)}
              >
                {unavailableMemberIdSet.has(member.id) ? "Available" : "Inactive"}
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700"
                aria-label={`Remove ${member.personnel.fullName} from ${group.name}`}
                title="Remove from group"
                onClick={() => stageMemberRemoval(member.id)}
              >
                X
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t pt-3">
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Saving group..." : "Save Group"}
        </Button>
        <div className="mt-3"><Message state={state} /></div>
      </div>
    </form>
  );
}

export function UpdateConvocationMemberForm({
  member
}: {
  member: {
    id: string;
    isTechnicalPerson: boolean;
    isGroupLead: boolean;
    isActive: boolean;
  };
}) {
  const [state, action, isPending] = useActionState(updateConvocationMemberAction, initialState);

  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="memberId" value={member.id} />
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-1 text-xs">
          <input type="checkbox" name="isTechnicalPerson" defaultChecked={member.isTechnicalPerson} />
          Technical
        </label>
        <label className="flex items-center gap-1 text-xs">
          <input type="checkbox" name="isGroupLead" defaultChecked={member.isGroupLead} />
          Lead
        </label>
        <label className="flex items-center gap-1 text-xs">
          <input type="checkbox" name="isActive" defaultChecked={member.isActive} />
          Active
        </label>
        <Button type="submit" size="sm" variant="outline" disabled={isPending}>
          Save
        </Button>
        <Button
          type="submit"
          name="removeMember"
          value="true"
          size="sm"
          variant="outline"
          disabled={isPending || !member.isActive}
          className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
        >
          Remove
        </Button>
      </div>
      <Message state={state} />
    </form>
  );
}

export function ConvocationProgramItemForm({
  item,
  personnel
}: {
  item: {
    id: string;
    itemKey: string;
    assignmentMode: AssignmentMode;
    assignedPersonnelId: string | null;
    fixedTextValue: string | null;
    isEnabled: boolean;
    countInRotation: boolean;
    overrideReason: string | null;
  };
  personnel: PersonnelOption[];
}) {
  const [state, action, isPending] = useActionState(updateConvocationItemAction, initialState);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="itemId" value={item.id} />
      <div className="grid gap-3 md:grid-cols-[160px_1fr_1fr_auto]">
        <Select name="assignmentMode" defaultValue={item.assignmentMode}>
          {assignmentModes.map((mode) => (
            <option key={mode} value={mode}>{assignmentModeLabels[mode]}</option>
          ))}
        </Select>
        <Select name="assignedPersonnelId" defaultValue={item.assignedPersonnelId ?? ""}>
          <option value="">To be assigned</option>
          {personnel.map((person) => (
            <option key={person.id} value={person.id}>{person.fullName}</option>
          ))}
        </Select>
        <Input name="fixedTextValue" defaultValue={item.fixedTextValue ?? ""} placeholder="Fixed text value" />
        <Button type="submit" size="sm" disabled={isPending}>{isPending ? "Saving..." : "Save"}</Button>
      </div>
      <div className="flex flex-wrap gap-4 text-xs">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isEnabled" defaultChecked={item.isEnabled} />
          Enabled
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="countInRotation" defaultChecked={item.countInRotation} />
          Count in rotation history
        </label>
      </div>
      <Textarea name="overrideReason" defaultValue={item.overrideReason ?? ""} placeholder="Override reason or note" className="min-h-16" />
      <Message state={state} />
    </form>
  );
}

export function ConvocationTemplateItemForm({
  item
}: {
  item: {
    id: string;
    itemKey: string;
    defaultMode: AssignmentMode;
    fixedTextValue: string | null;
    isEnabled: boolean;
  };
}) {
  const [state, action, isPending] = useActionState(updateConvocationTemplateItemAction, initialState);
  const [defaultMode, setDefaultMode] = useState<AssignmentMode>(item.defaultMode);
  const protectedDefaultValue = item.itemKey === "message" && item.fixedTextValue === "Maria Liza M. Bigornia"
    ? "Maria Liza M. Bigornia, Chief Statistical Specialist"
    : item.fixedTextValue ?? "";
  const canEditTextValue = defaultMode === "CUSTOM";
  const textValuePlaceholder = canEditTextValue ? "Enter custom text" : "Text value is editable only when Custom is selected";

  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="templateItemId" value={item.id} />
      {!canEditTextValue && (
        <input type="hidden" name="fixedTextValue" value={protectedDefaultValue} />
      )}
      <div className="grid items-center gap-2 lg:grid-cols-[130px_1fr_auto_auto]">
        <label>
          <span className="sr-only">Assignment type</span>
          <Select
            name="defaultMode"
            value={defaultMode}
            onChange={(event) => setDefaultMode(event.target.value as AssignmentMode)}
            className="h-9"
          >
            {templateModes.map((mode) => (
              <option key={mode} value={mode}>{assignmentModeLabels[mode]}</option>
            ))}
          </Select>
        </label>
        <label>
          <span className="sr-only">Text value</span>
          <Input
            name={canEditTextValue ? "fixedTextValue" : undefined}
            defaultValue={protectedDefaultValue}
            placeholder={textValuePlaceholder}
            disabled={!canEditTextValue}
            className={!canEditTextValue ? "h-9 bg-muted text-muted-foreground" : "h-9"}
          />
        </label>
        <label className="flex h-9 items-center gap-2 whitespace-nowrap text-xs text-muted-foreground">
          <input type="checkbox" name="isEnabled" defaultChecked={item.isEnabled} />
          Enabled
        </label>
        <Button type="submit" size="sm" disabled={isPending} className="h-9 w-full lg:w-auto">
          {isPending ? "Saving..." : "Update"}
        </Button>
      </div>
      <Message state={state} />
    </form>
  );
}

export function ConvocationPdfSelector({
  templates
}: {
  templates: { id: string; name: string; fileName: string; isDefault: boolean }[];
}) {
  const [state, action, isPending] = useActionState(setDefaultConvocationPdfTemplateAction, initialState);

  const defaultTemplate = templates.find((t) => t.isDefault);

  return (
    <form action={action} className="space-y-4">
      {templates.length === 0 ? (
        <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
          No PDF templates have been uploaded for the Convocation Program yet.
          <br />
          <a href="/settings/pdf-templates" className="mt-2 inline-block font-semibold text-primary hover:underline">
            Go to PDF Template Settings
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <label className="flex-1 space-y-1">
            <span className="text-sm font-medium">Active PDF Template</span>
            <Select name="templateId" defaultValue={defaultTemplate?.id ?? ""}>
              <option value="" disabled>Select a template...</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.fileName})
                </option>
              ))}
            </Select>
          </label>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Set as Default"}
          </Button>
        </div>
      )}
      <Message state={state} />
    </form>
  );
}
