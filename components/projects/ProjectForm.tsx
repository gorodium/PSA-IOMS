import type { ProjectCategory, ProjectFrequency, ProjectPriority } from "@prisma/client";
import { ProjectFrequency as ProjectFrequencyEnum, ProjectPriority as ProjectPriorityEnum } from "@prisma/client";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  }>;
};

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
  const assignedPersonnelIds = project?.personnel.map((item) => item.personnelId) ?? [];
  const focalPersonnelId = project?.personnel.find((item) => item.isFocalPerson)?.personnelId ?? "";
  const subcategories = project ? getProjectSubcategories(project.category) : projectCategoryOptions[0].subcategories;

  return (
    <form action={action}>
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <Card>
        <CardHeader>
          <CardTitle>{project ? "Edit project" : "Add project"}</CardTitle>
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
              <Select id="frequency" name="frequency" defaultValue={project?.frequency ?? "ANNUAL"} required>
                {Object.values(ProjectFrequencyEnum).map((frequency) => (
                  <option key={frequency} value={frequency}>
                    {formatEnumLabel(frequency)}
                  </option>
                ))}
              </Select>
            </div>
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

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="section">Office section</Label>
              <Input id="section" name="section" defaultValue={project?.section ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workloadWeight">Workload weight</Label>
              <Input id="workloadWeight" name="workloadWeight" type="number" min={0} step="0.1" defaultValue={project?.workloadWeight ?? 1} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedMandays">Estimated mandays</Label>
              <Input id="estimatedMandays" name="estimatedMandays" type="number" min={0} step="0.5" defaultValue={project?.estimatedMandays ?? 0} required />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="focalPersonnelId">Focal person</Label>
              <Select id="focalPersonnelId" name="focalPersonnelId" defaultValue={focalPersonnelId}>
                <option value="">No focal person selected</option>
                {personnel.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.fullName} - {person.section}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="personnelIds">Other involved personnel</Label>
              <Select id="personnelIds" name="personnelIds" multiple className="h-32" defaultValue={assignedPersonnelIds}>
                {personnel.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.fullName} - {person.position}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="rounded-lg border bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-950">Google Sheet monitoring data sections</p>
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
          <div>
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
    <div className="rounded-md border bg-white p-3">
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
