"use client";

import { useState, useRef, useEffect } from "react";
import type { ProjectCategory, ProjectFrequency, ProjectPriority } from "@prisma/client";
import { ProjectFrequency as ProjectFrequencyEnum, ProjectPriority as ProjectPriorityEnum } from "@prisma/client";
import { Save, Search, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatEnumLabel } from "@/lib/format";
import { getProjectSubcategories, projectCategoryOptions } from "@/lib/taxonomy";

type ProjectFormPersonnel = {
  id: string;
  fullName: string;
  position: string;
  section: string;
};

type ProjectFormProject = {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  category: ProjectCategory;
  subcategory: string | null;
  section: string | null;
  year: number;
  frequency: ProjectFrequency;
  customFrequency?: string | null;
  priority: ProjectPriority;
  workloadWeight: number;
  estimatedMandays: number;
  uiLayout: string;
  showOperationWorkload: boolean;
  showDeadlineSubmission: boolean;
  showDateSubmitted: boolean;
  showTotalSamplesDocuments: boolean;
  showResponseRate: boolean;
  operationWorkloadLabel: string;
  deadlineSubmissionLabel: string;
  dateSubmittedLabel: string;
  totalSamplesDocumentsLabel: string;
  responseRateLabel: string;
  isActive: boolean;
  personnel: Array<{
    personnelId: string;
    isFocalPerson: boolean;
    roleInProject: string;
  }>;
};

function ClientPersonnelSearchSelect({
  placeholder,
  personnelList,
  onSelect,
  disabledIds,
}: {
  placeholder: string;
  personnelList: ProjectFormPersonnel[];
  onSelect: (id: string) => void;
  disabledIds: string[];
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchTerms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);

  const results = personnelList.filter((p) => {
    if (searchTerms.length === 0) return true;
    const fullName = p.fullName.toLowerCase();
    const position = p.position.toLowerCase();
    return searchTerms.every(term => fullName.includes(term) || position.includes(term));
  }).slice(0, 50);

  return (
    <div 
      className={`relative ${isOpen ? 'z-50' : 'z-10'}`} 
      ref={wrapperRef}
      onBlur={(e) => {
        if (!wrapperRef.current?.contains(e.relatedTarget as Node)) {
          setIsOpen(false);
        }
      }}
    >
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          className="pl-9 h-9 text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
      </div>
      {isOpen && results.length > 0 && query.trim() && (
        <div className="absolute z-[100] top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
          {results.map((person) => {
            const isAssigned = disabledIds.includes(person.id);
            return (
              <button
                key={person.id}
                type="button"
                className="w-full text-left px-3 py-2 text-sm bg-background hover:bg-muted disabled:opacity-50"
                onClick={(e) => {
                  e.preventDefault();
                  onSelect(person.id);
                  setQuery("");
                  setIsOpen(false);
                }}
                disabled={isAssigned}
              >
                <div className="font-medium text-slate-900 dark:text-slate-100">{person.fullName}</div>
                <div className="text-xs text-muted-foreground">{person.position}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ProjectForm({
  action,
  personnel,
  project,
  submitLabel
}: {
  action: (formData: FormData) => Promise<void>;
  personnel: ProjectFormPersonnel[];
  project?: ProjectFormProject | null;
  submitLabel: string;
}) {
  const initialFocalId = project?.personnel.find((item) => item.roleInProject === "Focal Person")?.personnelId ?? null;
  const initialAlternateId = project?.personnel.find((item) => item.roleInProject === "Alternate Focal Person")?.personnelId ?? null;
  const initialAssistantId = project?.personnel.find((item) => item.roleInProject === "Assistant Focal Person")?.personnelId ?? null;
  const initialOtherIds = project?.personnel.filter((item) => item.roleInProject === "Other Employee Involved").map(p => p.personnelId) ?? [];

  const [focalId, setFocalId] = useState<string | null>(initialFocalId);
  const [alternateId, setAlternateId] = useState<string | null>(initialAlternateId);
  const [assistantId, setAssistantId] = useState<string | null>(initialAssistantId);
  const [otherIds, setOtherIds] = useState<string[]>(initialOtherIds);
  const [withAssistant, setWithAssistant] = useState(!!initialAssistantId);

  const subcategories = project ? getProjectSubcategories(project.category) : projectCategoryOptions[0].subcategories;
  const [selectedFrequency, setSelectedFrequency] = useState<string>(project?.frequency ?? "ANNUAL");

  const existingIds = [focalId, alternateId, withAssistant ? assistantId : null, ...otherIds].filter(Boolean) as string[];

  const getPersonnelName = (id: string | null) => {
    if (!id) return "";
    return personnel.find(p => p.id === id)?.fullName ?? "Unknown";
  };

  return (
    <form action={action}>
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <Card>
        <CardHeader>
          <CardTitle>{project ? "Edit Project" : "Add Project"}</CardTitle>
          <CardDescription>Maintain monitoring details, assignment, and project page display settings.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Project name</Label>
              <Input id="name" name="name" defaultValue={project?.name ?? ""} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Project code</Label>
              <Input id="code" name="code" defaultValue={project?.code ?? ""} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={project?.description ?? ""} />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select id="category" name="category" defaultValue={project?.category ?? "STATISTICAL_OPERATIONS"} required>
                {projectCategoryOptions.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Select id="subcategory" name="subcategory" defaultValue={project?.subcategory ?? ""}>
                <option value="">No subcategory</option>
                {subcategories.map((subcategory) => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="uiLayout">Project page layout</Label>
              <Select id="uiLayout" name="uiLayout" defaultValue={project?.uiLayout ?? "BALANCED"}>
                <option value="BALANCED">Balanced grid</option>
                <option value="DETAIL_FIRST">Details first</option>
                <option value="TASK_FIRST">Task table first</option>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select id="frequency" name="frequency" value={selectedFrequency} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedFrequency(e.target.value)} required>
                {Object.values(ProjectFrequencyEnum).map((frequency) => (
                  <option key={frequency} value={frequency}>
                    {formatEnumLabel(frequency)}
                  </option>
                ))}
              </Select>
            </div>
            {selectedFrequency === "CUSTOM" && (
              <div className="space-y-2">
                <Label htmlFor="customFrequency">Custom Frequency</Label>
                <Input id="customFrequency" name="customFrequency" defaultValue={project?.customFrequency ?? ""} placeholder="e.g. Every 2 years" required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select id="priority" name="priority" defaultValue={project?.priority ?? "MEDIUM"} required>
                {Object.values(ProjectPriorityEnum).map((priority) => (
                  <option key={priority} value={priority}>
                    {formatEnumLabel(priority)}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input id="year" name="year" type="number" min={2000} max={2100} defaultValue={project?.year ?? new Date().getFullYear()} required />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="workloadWeight">Workload Weight</Label>
              <Input id="workloadWeight" name="workloadWeight" type="number" min={0} step="0.1" defaultValue={project?.workloadWeight ?? 1} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedMandays">Estimated Mandays</Label>
              <Input id="estimatedMandays" name="estimatedMandays" type="number" min={0} step="0.5" defaultValue={project?.estimatedMandays ?? 0} required />
            </div>
          </div>

          <div className="space-y-5 rounded-lg border border-border p-4 bg-slate-50/50 dark:bg-slate-900/20">
            <h3 className="text-sm font-semibold">Personnel Assignment</h3>
            {focalId && <input type="hidden" name="focalPersonnelId" value={focalId} />}
            {alternateId && <input type="hidden" name="alternatePersonnelId" value={alternateId} />}
            {assistantId && withAssistant && <input type="hidden" name="assistantPersonnelId" value={assistantId} />}
            {otherIds.map(id => <input key={id} type="hidden" name="otherPersonnelIds" value={id} />)}

            <div className="grid gap-4 md:grid-cols-2">
              {/* Focal Person */}
              <div>
                <Label className="mb-2 block">Focal Person</Label>
                {focalId ? (
                  <div className="flex items-center gap-2 p-2 border border-border rounded-md bg-white dark:bg-slate-950">
                    <div className="flex-1 font-medium text-sm">{getPersonnelName(focalId)}</div>
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => setFocalId(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <ClientPersonnelSearchSelect placeholder="Search for Focal Person..." personnelList={personnel} onSelect={setFocalId} disabledIds={existingIds} />
                )}
              </div>

              {/* Alternate Focal Person */}
              <div>
                <Label className="mb-2 block">Alternate Focal Person</Label>
                {alternateId ? (
                  <div className="flex items-center gap-2 p-2 border border-border rounded-md bg-white dark:bg-slate-950">
                    <div className="flex-1 font-medium text-sm">{getPersonnelName(alternateId)}</div>
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => setAlternateId(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <ClientPersonnelSearchSelect placeholder="Search for Alternate Focal Person..." personnelList={personnel} onSelect={setAlternateId} disabledIds={existingIds} />
                )}
              </div>
            </div>

            {/* Assistant Focal Person Checkbox */}
            <div className="flex flex-col space-y-3 pt-2 border-t border-border">
              <div className="flex items-center space-x-2">
                <Checkbox id="withAssistant" checked={withAssistant} onCheckedChange={(checked) => {
                  setWithAssistant(!!checked);
                  if (!checked) setAssistantId(null);
                }} />
                <Label htmlFor="withAssistant" className="font-medium cursor-pointer">
                  With Assistant Focal Person
                </Label>
              </div>

              {withAssistant && (
                <div className="pl-6 w-full md:w-1/2">
                  {assistantId ? (
                    <div className="flex items-center gap-2 p-2 border border-border rounded-md bg-white dark:bg-slate-950">
                      <div className="flex-1 font-medium text-sm">{getPersonnelName(assistantId)}</div>
                      <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => setAssistantId(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <ClientPersonnelSearchSelect placeholder="Search for Assistant Focal Person..." personnelList={personnel} onSelect={setAssistantId} disabledIds={existingIds} />
                  )}
                </div>
              )}
            </div>

            {/* Other Employees */}
            <div className="pt-2 border-t border-border">
              <Label className="mb-2 block">Other Employee Involved</Label>
              <div className="w-full md:w-1/2">
                <ClientPersonnelSearchSelect placeholder="Search to add other employees..." personnelList={personnel} onSelect={(id) => setOtherIds([...otherIds, id])} disabledIds={existingIds} />
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {otherIds.map(o => (
                  <div key={o} className="flex items-center gap-2 p-2 border border-border rounded-md bg-white dark:bg-slate-950">
                    <div className="flex-1 font-medium text-sm">{getPersonnelName(o)}</div>
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => setOtherIds(otherIds.filter(id => id !== o))}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-slate-50 dark:bg-slate-900/50 dark:border-slate-800 p-4">
            <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">Google Sheet monitoring data sections</p>
            <p className="mt-1 text-xs text-muted-foreground">Rename labels or uncheck sections that are not applicable to this project.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <DataSectionToggle name="showOperationWorkload" labelName="operationWorkloadLabel" defaultChecked={project?.showOperationWorkload ?? true} defaultLabel={project?.operationWorkloadLabel ?? "Project/Operation/Workload"} />
              <DataSectionToggle name="showDeadlineSubmission" labelName="deadlineSubmissionLabel" defaultChecked={project?.showDeadlineSubmission ?? true} defaultLabel={project?.deadlineSubmissionLabel ?? "Deadline of Submission"} />
              <DataSectionToggle name="showDateSubmitted" labelName="dateSubmittedLabel" defaultChecked={project?.showDateSubmitted ?? true} defaultLabel={project?.dateSubmittedLabel ?? "Date Submitted"} />
              <DataSectionToggle name="showTotalSamplesDocuments" labelName="totalSamplesDocumentsLabel" defaultChecked={project?.showTotalSamplesDocuments ?? true} defaultLabel={project?.totalSamplesDocumentsLabel ?? "Total Sample/Documents"} />
              <DataSectionToggle name="showResponseRate" labelName="responseRateLabel" defaultChecked={project?.showResponseRate ?? true} defaultLabel={project?.responseRateLabel ?? "Response Rate"} />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" name="isActive" defaultChecked={project?.isActive ?? true} className="rounded border-input text-primary focus:ring-ring" />
            Active project
          </label>
          <div className="flex gap-2">
            <Button type="button" variant="outline" asChild>
              <Link href="/projects">Cancel</Link>
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4" aria-hidden="true" />
              {submitLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

function DataSectionToggle({
  name,
  labelName,
  defaultChecked,
  defaultLabel
}: {
  name: string;
  labelName: string;
  defaultChecked: boolean;
  defaultLabel: string;
}) {
  return (
    <div className="rounded-md border bg-white dark:bg-slate-900 dark:border-slate-800 p-3">
      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} className="rounded border-input text-primary focus:ring-ring" />
        Show section
      </label>
      <Label htmlFor={labelName} className="mt-3 block text-xs text-muted-foreground">
        Section label
      </Label>
      <Input id={labelName} name={labelName} defaultValue={defaultLabel} className="mt-1" />
    </div>
  );
}
