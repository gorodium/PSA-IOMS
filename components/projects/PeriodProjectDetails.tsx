"use client";

import { useState, useMemo, useTransition } from "react";
import { format } from "date-fns";
import { Save, Plus, Trash2, ChevronDown, ChevronRight, Edit3, Settings2, CheckCircle2, ArrowUp, ArrowDown, Copy, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { calculateTaskStatus } from "@/lib/status";
import { cn } from "@/lib/utils";
import { updateProjectMonthlyDetails, type ProjectDetailsUpdatePayload } from "@/app/(app)/projects/actions";
import { ProjectFrequency } from "@prisma/client";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getProjectCategoryLabel } from "@/lib/taxonomy";

interface ProjectPersonnel {
  isFocalPerson: boolean;
  roleInProject: string | null;
  personnelId: string;
}

interface CustomValues {
  disabledColumns?: Record<string, boolean>;
  [key: string]: unknown;
}

export interface CustomColumnDef {
  id: string;
  name: string;
  type: "text" | "number";
}

interface Task {
  id: string;
  taskName: string;
  deadline: string | Date | null;
  dateSubmitted: string | Date | null;
  totalSamplesDocuments: number | string | null;
  responseRate: number | string | null;
  remarks: string | null;
  isSubtitle: boolean;
  customValues?: unknown;
}

interface Cycle {
  id: string;
  cycleName: string;
  month: number | null;
  year: number;
  tasks: Task[];
}

interface Project {
  id: string;
  name: string;
  year: number;
  category: string;
  subcategory: string | null;
  frequency: string;
  customFrequency: string | null;
  description: string | null;
  showDescription: boolean | null;
  showDeadlineSubmission: boolean | null;
  showDateSubmitted: boolean | null;
  showTotalSamplesDocuments: boolean | null;
  showResponseRate: boolean | null;
  totalSamplesDocumentsLabel: string | null;
  customTaskColumns?: unknown;
  personnel: ProjectPersonnel[];
  cycles: Cycle[];
}

interface Personnel {
  id: string;
  fullName: string;
}

// Compute overall status (declared outside the component to avoid react-hooks warning)
const computeCycleStatus = (tasks: Task[], today: Date) => {
  const activeTasks = tasks.filter(t => !t.isSubtitle);
  if (activeTasks.length === 0) return "No Entries";
  const statuses = activeTasks.map(t => calculateTaskStatus(t, today));
  if (statuses.includes("OVERDUE")) return "Critical";
  if (statuses.includes("DUE_TODAY") || statuses.includes("DUE_SOON")) return "Due Soon";
  if (statuses.every(s => s === "COMPLETED")) return "Completed";
  return "Active";
};

export function PeriodProjectDetails({ project, canEdit, allPersonnel }: { project: Project, canEdit: boolean, allPersonnel: Personnel[] }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessPrompt, setShowSuccessPrompt] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Local state for editing cycles
  const [cycles, setCycles] = useState<Cycle[]>(() => JSON.parse(JSON.stringify(project.cycles)));
  const [deletedCycleIds, setDeletedCycleIds] = useState<string[]>([]);
  const [deletedTaskIds, setDeletedTaskIds] = useState<string[]>([]);
  const [expandedCycles, setExpandedCycles] = useState<Record<string, boolean>>({});

  // Project Settings State
  const [frequency, setFrequency] = useState<ProjectFrequency>((project.frequency as ProjectFrequency) || ProjectFrequency.MONTHLY);
  const [customFrequency, setCustomFrequency] = useState(project.customFrequency || "");

  // Personnel Mapping
  const initialFocal = project.personnel.find((p) => p.isFocalPerson)?.personnelId 
    ?? project.personnel.find((p) => p.roleInProject?.toLowerCase().includes("focal") && !p.roleInProject?.toLowerCase().includes("alternate") && !p.roleInProject?.toLowerCase().includes("assistant"))?.personnelId 
    ?? "";
  const initialAlt = project.personnel.find((p) => p.roleInProject?.toLowerCase().includes("alternate"))?.personnelId ?? "";
  const initialAsst = project.personnel.find((p) => p.roleInProject?.toLowerCase().includes("assistant"))?.personnelId ?? "";
  const initialOthers = project.personnel.filter((p) => !p.isFocalPerson && !p.roleInProject?.toLowerCase().includes("focal") && !p.roleInProject?.toLowerCase().includes("alternate") && !p.roleInProject?.toLowerCase().includes("assistant")).map((p) => p.personnelId);

  const [focalPersonId, setFocalPersonId] = useState(initialFocal);
  const [alternateFocalPersonId, setAlternateFocalPersonId] = useState(initialAlt);
  const [assistantFocalPersonId, setAssistantFocalPersonId] = useState(initialAsst);
  const [hasAssistant, setHasAssistant] = useState(!!initialAsst);
  const [otherInvolvedEmployeeIds, setOtherInvolvedEmployeeIds] = useState<string[]>(initialOthers.length > 0 ? initialOthers : [""]);
  const [hasOthers, setHasOthers] = useState(initialOthers.length > 0);

  // Description State
  const [description, setDescription] = useState(project.description || "");
  const [showDescription, setShowDescription] = useState(project.showDescription ?? true);

  // Column Visibility State
  const [showDeadline, setShowDeadline] = useState(project.showDeadlineSubmission ?? true);
  const [showSubmitted, setShowSubmitted] = useState(project.showDateSubmitted ?? true);
  const [showTotal, setShowTotal] = useState(project.showTotalSamplesDocuments ?? true);
  const [showRate, setShowRate] = useState(project.showResponseRate ?? true);
  const [totalLabel, setTotalLabel] = useState(project.totalSamplesDocumentsLabel === "Total Documents" ? "Total Documents" : "Total Samples");
  const [customColumns, setCustomColumns] = useState<CustomColumnDef[]>(() => (project.customTaskColumns as CustomColumnDef[]) || []);

  const today = useMemo(() => new Date(), []);

  const projectStatus = useMemo(() => {
    const allTasks = cycles.flatMap(c => c.tasks);
    return computeCycleStatus(allTasks, today);
  }, [cycles, today]);

  const getBadgeColor = (status: string) => {
    switch (status) {
      case "OVERDUE":
      case "Critical": return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
      case "DUE_TODAY": return "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400";
      case "DUE_SOON":
      case "Due Soon": return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400";
      case "COMPLETED":
      case "Completed": return "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400";
      case "NO_DEADLINE":
      case "No Entries": return "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400";
      default: return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
    }
  };

  const formatLabel = (s: string) => {
    if (s === "DUE_TODAY") return "Due Today";
    if (s === "DUE_SOON") return "Due Soon";
    if (s === "NO_DEADLINE") return "No Deadline";
    if (s === "OVERDUE") return "Overdue";
    if (s === "COMPLETED") return "Submitted";
    return s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, ' ');
  };

  const getPersonnelName = (id: string) => allPersonnel.find(p => p.id === id)?.fullName || "None";

  // Handlers
  const toggleCycle = (cycleId: string) => setExpandedCycles(prev => ({ ...prev, [cycleId]: !prev[cycleId] }));

  const handleGenerateCycles = () => {
    if (cycles.length > 0 && !confirm("This will append new cycles. Proceed?")) return;
    
    let numCycles = 0;
    if (frequency === "MONTHLY") numCycles = 12;
    else if (frequency === "QUARTERLY") numCycles = 4;
    else if (frequency === "SEMI_ANNUAL") numCycles = 2;
    else if (frequency === "ANNUAL") numCycles = 1;

    const newCycles = [];
    for (let i = 1; i <= numCycles; i++) {
      let cycleName = `Section ${i}`;
      if (frequency === "MONTHLY") {
        const d = new Date(project.year, i - 1, 1);
        cycleName = format(d, "MMMM yyyy");
      } else if (frequency === "QUARTERLY") {
        cycleName = `Quarter ${i} ${project.year}`;
      } else if (frequency === "SEMI_ANNUAL") {
        cycleName = `Semester ${i} ${project.year}`;
      } else if (frequency === "ANNUAL") {
        cycleName = `Year ${project.year}`;
      }

      newCycles.push({
        id: `new-cycle-${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${i}`,
        cycleName,
        year: project.year,
        month: frequency === "MONTHLY" ? i : null,
        tasks: [],
      });
    }

    setCycles([...cycles, ...newCycles]);
  };

  const handleAddCycle = () => {
    const newCycleId = `new-cycle-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newCycle: Cycle = { id: newCycleId, cycleName: `New Section ${cycles.length + 1}`, month: null, year: new Date().getFullYear(), tasks: [] };
    setCycles([...cycles, newCycle]);
    setExpandedCycles(prev => ({ ...prev, [newCycleId]: true }));
  };

  const handleCopyTasksToOtherCycles = (sourceCycleId: string) => {
    if (!confirm("This will replace the activities in ALL other sections with the activities from this section. Are you sure you want to proceed?")) {
      return;
    }
    
    setCycles(prev => {
      const sourceCycle = prev.find(c => c.id === sourceCycleId);
      if (!sourceCycle) return prev;
      
      prev.forEach(c => {
        if (c.id !== sourceCycleId) {
          c.tasks.forEach((t) => {
            if (!t.id.startsWith("new-")) {
              setDeletedTaskIds(d => [...d, t.id]);
            }
          });
        }
      });
      
      return prev.map(c => {
        if (c.id === sourceCycleId) return c;
        
        const newTasks = sourceCycle.tasks.map((t) => ({
          ...t,
          id: `new-task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          deadline: null,
          dateSubmitted: null,
          totalSamplesDocuments: null,
          responseRate: null,
          remarks: "",
        }));
        
        return { ...c, tasks: newTasks };
      });
    });
  };

  const handleAddTask = (cycleId: string, isSubtitle = false) => {
    setCycles(prev => prev.map(c => {
      if (c.id === cycleId) {
        return {
          ...c,
          tasks: [...c.tasks, {
            id: `new-task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            taskName: "",
            deadline: null,
            dateSubmitted: null,
            totalSamplesDocuments: null,
            responseRate: null,
            manualStatusOverride: null,
            remarks: "",
            isSubtitle,
          }]
        };
      }
      return c;
    }));
  };

  const handleDeleteTask = (cycleId: string, taskId: string) => {
    if (!taskId.startsWith("new-")) setDeletedTaskIds(prev => [...prev, taskId]);
    setCycles(prev => prev.map(c => c.id === cycleId ? { ...c, tasks: c.tasks.filter((t) => t.id !== taskId) } : c));
  };

  const handleMoveTask = (cycleId: string, taskId: string, direction: "up" | "down") => {
    setCycles(prevCycles => prevCycles.map(cycle => {
      if (cycle.id !== cycleId) return cycle;
      const tasks = [...cycle.tasks];
      const index = tasks.findIndex((t) => t.id === taskId);
      if (index === -1) return cycle;
      
      if (direction === "up" && index > 0) {
        const temp = tasks[index];
        tasks[index] = tasks[index - 1];
        tasks[index - 1] = temp;
      } else if (direction === "down" && index < tasks.length - 1) {
        const temp = tasks[index];
        tasks[index] = tasks[index + 1];
        tasks[index + 1] = temp;
      }
      return { ...cycle, tasks };
    }));
  };

  const handleDeleteCycle = (cycleId: string) => {
    if (!confirm("Are you sure you want to delete this entire section and all its activities?")) return;
    const cycleToDelete = cycles.find(c => c.id === cycleId);
    if (cycleToDelete) {
      if (!cycleId.startsWith("new-")) setDeletedCycleIds(prev => [...prev, cycleId]);
      cycleToDelete.tasks.forEach((t) => {
        if (!t.id.startsWith("new-")) setDeletedTaskIds(prev => [...prev, t.id]);
      });
    }
    setCycles(prev => prev.filter(c => c.id !== cycleId));
  };

  const updateTaskCustomValue = (cycleId: string, taskId: string, customColId: string, value: string | number) => {
    setCycles(prev => prev.map(c => c.id === cycleId ? { ...c, tasks: c.tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, customValues: { ...(t.customValues as CustomValues || {}), [customColId]: value } };
      }
      return t;
    })} : c));
  };

  const updateTaskField = (cycleId: string, taskId: string, field: keyof Task, value: string | number | boolean | Date | null) => {
    setCycles(prev => prev.map(c => c.id === cycleId ? { ...c, tasks: c.tasks.map((t) => t.id === taskId ? { ...t, [field]: value } as Task : t) } : c));
  };

  const toggleTaskColumn = (cycleId: string, taskId: string, column: string) => {
    setCycles(prev => prev.map(c => {
      if (c.id !== cycleId) return c;
      return {
        ...c,
        tasks: c.tasks.map((t) => {
          if (t.id !== taskId) return t;
          const currentCustomValues = (t.customValues as CustomValues | null) || {};
          const disabledColumns = currentCustomValues.disabledColumns || {};
          return {
            ...t,
            customValues: {
              ...currentCustomValues,
              disabledColumns: {
                ...disabledColumns,
                [column]: !disabledColumns[column]
              }
            }
          };
        })
      };
    }));
  };

  const updateCycleField = (cycleId: string, field: keyof Cycle, value: string | number | null) => {
    setCycles(prev => prev.map(c => c.id === cycleId ? { ...c, [field]: value } as Cycle : c));
  };

  const handleCancel = () => {
    setCycles(JSON.parse(JSON.stringify(project.cycles)));
    setDeletedCycleIds([]);
    setDeletedTaskIds([]);
    setFrequency((project.frequency as ProjectFrequency) || ProjectFrequency.MONTHLY);
    setCustomFrequency(project.customFrequency || "");
    setFocalPersonId(initialFocal);
    setAlternateFocalPersonId(initialAlt);
    setAssistantFocalPersonId(initialAsst);
    setHasAssistant(!!initialAsst);
    setOtherInvolvedEmployeeIds(initialOthers.length > 0 ? initialOthers : [""]);
    setHasOthers(initialOthers.length > 0);
    setDescription(project.description || "");
    setShowDescription(project.showDescription ?? true);
    setShowDeadline(project.showDeadlineSubmission ?? true);
    setShowSubmitted(project.showDateSubmitted ?? true);
    setShowTotal(project.showTotalSamplesDocuments ?? true);
    setShowRate(project.showResponseRate ?? true);
    setIsEditing(false);
  };

  const handleSave = () => {
    const cycleNames = new Set<string>();

    for (const cycle of cycles) {
      const trimmedCycleName = cycle.cycleName.trim();
      if (!trimmedCycleName) {
        alert("All sections must have a name.");
        return;
      }
      const lowerCycleName = trimmedCycleName.toLowerCase();
      if (cycleNames.has(lowerCycleName)) {
        alert(`The section name "${trimmedCycleName}" is duplicated. Please ensure all sections/months are completely unique.`);
        return;
      }
      cycleNames.add(lowerCycleName);
      
      const taskNames = new Set<string>();
      
      for (const task of cycle.tasks) {
        const trimmedName = task.taskName.trim();
        if (!trimmedName) {
          alert(`Activity/Subtitle name cannot be empty in ${cycle.cycleName}`);
          return;
        }
        
        const lowerName = trimmedName.toLowerCase();
        if (taskNames.has(lowerName)) {
          alert(`Name "${trimmedName}" is duplicated in ${cycle.cycleName}. Names must be unique within the same section.`);
          return;
        }
        taskNames.add(lowerName);

        if (!task.isSubtitle && task.responseRate !== null && task.responseRate !== "") {
          const rateNum = Number(task.responseRate);
          if (isNaN(rateNum) || rateNum < 0 || rateNum > 100) {
            alert(`Response rate must be between 0 and 100 in ${task.taskName}`);
            return;
          }
        }
      }
    }

    const payload: ProjectDetailsUpdatePayload = {
      projectId: project.id,
      frequency,
      customFrequency: frequency === "CUSTOM" ? customFrequency : null,
      focalPersonId: focalPersonId || null,
      alternateFocalPersonId: alternateFocalPersonId || null,
      assistantFocalPersonId: hasAssistant && assistantFocalPersonId ? assistantFocalPersonId : null,
      otherInvolvedEmployeeIds: hasOthers ? otherInvolvedEmployeeIds.filter(id => id) : [],
      description,
      showDescription,
      showDeadlineSubmission: showDeadline,
      showDateSubmitted: showSubmitted,
      showTotalSamplesDocuments: showTotal,
      showResponseRate: showRate,
      totalSamplesDocumentsLabel: totalLabel,
      customTaskColumns: customColumns,
      cycles: cycles.map(c => ({
        id: c.id,
        cycleName: c.cycleName,
        month: c.month,
        year: c.year,
        tasks: c.tasks.map((t) => ({
          id: t.id,
          taskName: t.taskName,
          deadline: t.deadline ? (t.deadline instanceof Date ? t.deadline.toISOString() : new Date(t.deadline).toISOString()) : null,
          dateSubmitted: t.dateSubmitted ? (t.dateSubmitted instanceof Date ? t.dateSubmitted.toISOString() : new Date(t.dateSubmitted).toISOString()) : null,
          totalSamplesDocuments: t.totalSamplesDocuments ? Number(t.totalSamplesDocuments) : null,
          responseRate: t.responseRate ? Number(t.responseRate) : null,
          customValues: t.customValues || null,
          manualStatusOverride: null, // Removed manual status override in edit mode
          remarks: t.remarks || null,
          isSubtitle: t.isSubtitle || false,
        }))
      })),
      deletedCycleIds,
      deletedTaskIds,
    };

    startTransition(async () => {
      try {
        await updateProjectMonthlyDetails(payload);
        setShowSuccessPrompt(true);
        setTimeout(() => setShowSuccessPrompt(false), 3000);
        setIsEditing(false);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to update project";
        alert(errorMsg);
      }
    });
  };

  // Determine grid columns dynamically based on visibility toggles
  let colConfig = "2fr ";
  if (showDeadline) colConfig += "140px "; // Exact width for date
  if (showSubmitted) colConfig += "140px "; // Exact width for date
  if (showTotal) colConfig += "100px "; // Less width
  if (showRate) colConfig += "80px "; // Less width
  customColumns.forEach(() => {
    colConfig += "120px ";
  });
  if (!isEditing) colConfig += "120px "; // Status only visible in View Mode
  colConfig += "2fr auto";

  return (
    <div className="space-y-6 relative">
      {/* Success Prompt Overlay */}
      {showSuccessPrompt && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold">Project Successfully Saved!</span>
        </div>
      )}

      {/* Top Card: Project Info & Settings */}
      <div className="rounded-xl border bg-white dark:bg-[#1C212E] dark:border-white/10 shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start gap-4">
            <div className="w-full max-w-4xl">
              <div className="mb-6 space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="font-bold text-2xl text-slate-900 dark:text-white leading-tight">
                    {project.name}
                  </h1>
                  <span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider", getBadgeColor(projectStatus))}>
                    {projectStatus}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    {project.year}
                  </span>
                  <span>{getProjectCategoryLabel(project.category)}</span>
                  {project.subcategory && (
                    <>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span>{project.subcategory}</span>
                    </>
                  )}
                </div>
              </div>
              
              {isEditing ? (
                <div className="flex flex-col gap-6 bg-slate-50 dark:bg-white/[0.02] p-6 rounded-lg border border-slate-100 dark:border-white/5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 border-b pb-2 dark:border-white/10">Project Settings</h3>
                    
                    <div className="space-y-2">
                      <Label className="text-xs">Frequency</Label>
                      <Select value={frequency} onChange={e => setFrequency(e.target.value as ProjectFrequency)} className="h-9">
                        <option value="DAILY">Daily</option>
                        <option value="WEEKLY">Weekly</option>
                        <option value="BI_WEEKLY">Bi-Weekly</option>
                        <option value="MONTHLY">Monthly</option>
                        <option value="QUARTERLY">Quarterly</option>
                        <option value="SEMI_ANNUAL">Semi-Annually</option>
                        <option value="ANNUAL">Annually</option>
                        <option value="CUSTOM">Custom</option>
                      </Select>
                      {frequency === "CUSTOM" && (
                        <Input placeholder="Enter custom frequency" value={customFrequency} onChange={e => setCustomFrequency(e.target.value)} className="h-9 mt-2" />
                      )}
                    </div>
                    
                    <div className="space-y-3 pt-2">
                      <Label className="text-xs">Column Visibility</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <Label className="flex items-center gap-2 cursor-pointer text-sm">
                          <Checkbox checked={showDeadline} onCheckedChange={(c) => setShowDeadline(!!c)} /> Deadline
                        </Label>
                        <Label className="flex items-center gap-2 cursor-pointer text-sm">
                          <Checkbox checked={showSubmitted} onCheckedChange={(c) => setShowSubmitted(!!c)} /> Submitted
                        </Label>
                        <Label className="flex items-center gap-2 cursor-pointer text-sm">
                          <Checkbox checked={showTotal} onCheckedChange={(c) => setShowTotal(!!c)} /> 
                          <Select value={totalLabel} onChange={e => setTotalLabel(e.target.value)} className="h-7 text-xs px-2 py-0">
                            <option value="Total Samples">Total Samples</option>
                            <option value="Total Documents">Total Documents</option>
                          </Select>
                        </Label>
                        <Label className="flex items-center gap-2 cursor-pointer text-sm">
                          <Checkbox checked={showRate} onCheckedChange={(c) => setShowRate(!!c)} /> Rate (%)
                        </Label>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <Label className="text-xs">Custom Columns</Label>
                      <div className="space-y-2">
                        {customColumns.map((col, idx) => (
                          <div key={col.id} className="flex gap-2 items-center">
                            <Input 
                              value={col.name}
                              onChange={e => {
                                const newCols = [...customColumns];
                                newCols[idx].name = e.target.value;
                                setCustomColumns(newCols);
                              }}
                              className="h-8 text-sm"
                              placeholder="Column Name"
                            />
                            <Select 
                              value={col.type} 
                              onChange={e => {
                                const newCols = [...customColumns];
                                newCols[idx].type = e.target.value as "text" | "number";
                                setCustomColumns(newCols);
                              }} 
                              className="h-8 text-sm"
                            >
                              <option value="text">Text</option>
                              <option value="number">Number</option>
                            </Select>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => setCustomColumns(customColumns.filter((_, i) => i !== idx))} 
                              className="h-8 w-8 text-red-500 hover:bg-red-50 flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setCustomColumns([...customColumns, { id: `custom-col-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, name: "", type: "text" }])} 
                          className="text-xs h-8 w-full"
                        >
                          + Add Custom Column
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 border-b pb-2 dark:border-white/10">Personnel Assigned</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Focal Person</Label>
                        <Select value={focalPersonId} onChange={e => setFocalPersonId(e.target.value)} className="h-9 text-sm">
                          <option value="">-- Select --</option>
                          {allPersonnel.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Alternate Focal Person</Label>
                        <Select value={alternateFocalPersonId} onChange={e => setAlternateFocalPersonId(e.target.value)} className="h-9 text-sm">
                          <option value="">-- Select --</option>
                          {allPersonnel.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 cursor-pointer text-sm">
                        <Checkbox checked={hasAssistant} onCheckedChange={(c) => setHasAssistant(!!c)} /> Add Assistant Focal Person
                      </Label>
                      {hasAssistant && (
                        <Select value={assistantFocalPersonId} onChange={e => setAssistantFocalPersonId(e.target.value)} className="h-9 text-sm">
                          <option value="">-- Select --</option>
                          {allPersonnel.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
                        </Select>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 cursor-pointer text-sm">
                        <Checkbox checked={hasOthers} onCheckedChange={(c) => setHasOthers(!!c)} /> Add Other involved employee(s)
                      </Label>
                      {hasOthers && (
                        <div className="space-y-2">
                          {otherInvolvedEmployeeIds.map((empId, idx) => (
                            <div key={idx} className="flex gap-2">
                              <Select value={empId} onChange={e => {
                                const newArr = [...otherInvolvedEmployeeIds];
                                newArr[idx] = e.target.value;
                                setOtherInvolvedEmployeeIds(newArr);
                              }} className="h-9 text-sm">
                                <option value="">-- Select --</option>
                                {allPersonnel.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
                              </Select>
                              <Button variant="ghost" size="icon" onClick={() => setOtherInvolvedEmployeeIds(otherInvolvedEmployeeIds.filter((_, i) => i !== idx))} className="h-9 w-9 text-red-500 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <Button variant="outline" size="sm" onClick={() => setOtherInvolvedEmployeeIds([...otherInvolvedEmployeeIds, ""])} className="text-xs h-8">
                            + Add Employee
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  </div>

                  {/* Project Description Edit */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between border-b pb-2 dark:border-white/10">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Project Description</h3>
                      <Label className="flex items-center gap-2 cursor-pointer text-xs font-normal text-slate-600 dark:text-slate-400">
                        <Checkbox checked={showDescription} onCheckedChange={(c) => setShowDescription(!!c)} /> Show Description
                      </Label>
                    </div>
                    <textarea 
                      value={description} 
                      onChange={e => setDescription(e.target.value)} 
                      placeholder="Enter project description or important information here..."
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-white dark:bg-slate-900 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1.5 grid grid-cols-1 md:grid-cols-2">
                  <div>
                    <p><span className="font-semibold text-slate-900 dark:text-slate-300">Frequency:</span> {frequency === "CUSTOM" ? customFrequency : frequency.split('_').map((w: string) => w.charAt(0) + w.slice(1).toLowerCase()).join('-')}</p>
                    <p><span className="font-semibold text-slate-900 dark:text-slate-300">Focal Person:</span> {getPersonnelName(focalPersonId)}</p>
                    <p><span className="font-semibold text-slate-900 dark:text-slate-300">Alternate Focal Person:</span> {getPersonnelName(alternateFocalPersonId)}</p>
                  </div>
                  <div>
                    {hasAssistant && <p><span className="font-semibold text-slate-900 dark:text-slate-300">Assistant Focal Person:</span> {getPersonnelName(assistantFocalPersonId)}</p>}
                    {hasOthers && otherInvolvedEmployeeIds.filter(id => id).length > 0 && (
                      <p><span className="font-semibold text-slate-900 dark:text-slate-300">Other Employees:</span> {otherInvolvedEmployeeIds.filter(id => id).map(getPersonnelName).join(", ")}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-end gap-3 flex-shrink-0">
              {canEdit && !isEditing && (
                <Button onClick={() => setIsEditing(true)} className="gap-2">
                  <Edit3 className="w-4 h-4" /> Edit Mode
                </Button>
              )}
              {isEditing && (
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <Button variant="outline" onClick={handleCancel} disabled={isPending}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isPending} className="gap-2">
                    <Save className="w-4 h-4" /> Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Description / Info Box */}
      {!isEditing && showDescription && description && (
        <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
            {description}
          </p>
        </div>
      )}

      {/* Monthly Sections */}
      <div className="space-y-4">
        {isEditing && ["MONTHLY", "QUARTERLY", "SEMI_ANNUAL", "ANNUAL"].includes(frequency) && (
          <div className="flex justify-end">
             <Button variant="secondary" onClick={handleGenerateCycles} className="gap-2 text-sm h-9">
               <Settings2 className="w-4 h-4" /> Auto-Generate Sections ({frequency.split('_').map((w: string) => w.charAt(0) + w.slice(1).toLowerCase()).join('-')})
             </Button>
          </div>
        )}

        {cycles.map((cycle) => {
          const isExpanded = expandedCycles[cycle.id] ?? true; 
          const tasks = cycle.tasks;
          const submittedCount = tasks.filter((t) => !t.isSubtitle && calculateTaskStatus(t, today) === "COMPLETED").length;
          const overdueCount = tasks.filter((t) => !t.isSubtitle && calculateTaskStatus(t, today) === "OVERDUE").length;
          const cycleStatusBadge = computeCycleStatus(tasks, today);

          return (
            <div key={cycle.id} className="rounded-xl border bg-white dark:bg-[#1C212E] dark:border-white/10 shadow-sm overflow-hidden transition-all">
              <div 
                className={cn(
                  "p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors select-none",
                  isExpanded ? "border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]" : ""
                )}
                onClick={() => toggleCycle(cycle.id)}
              >
                <div className="flex items-center gap-4">
                  {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                  {isEditing ? (
                    <Input 
                      value={cycle.cycleName} 
                      onChange={e => updateCycleField(cycle.id, "cycleName", e.target.value)} 
                      onClick={e => e.stopPropagation()}
                      className="w-48 h-8 font-bold"
                    />
                  ) : (
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{cycle.cycleName}</h3>
                  )}
                  
                  {!isEditing && (
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider", getBadgeColor(cycleStatusBadge))}>
                      {cycleStatusBadge}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {!isEditing && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <span>{tasks.filter((t) => !t.isSubtitle).length} activities</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <span className="text-green-600 dark:text-green-400">{submittedCount} submitted</span>
                      {overdueCount > 0 && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                          <span className="text-red-600 dark:text-red-400">{overdueCount} overdue</span>
                        </>
                      )}
                    </div>
                  )}
                  {isEditing && (
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDeleteCycle(cycle.id); }} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="p-0 overflow-x-auto">
                  <div className="min-w-[800px] p-4">
                    <div 
                      className="grid gap-3 mb-2 px-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider"
                      style={{ gridTemplateColumns: colConfig }}
                    >
                      <div>Task / Activity</div>
                      {showDeadline && <div className="text-center w-full" style={{ textAlign: "center" }}>Deadline</div>}
                      {showSubmitted && <div className="text-center w-full" style={{ textAlign: "center" }}>Submitted</div>}
                      {showTotal && <div className="text-center w-full" style={{ textAlign: "center" }}>{totalLabel}</div>}
                      {showRate && <div className="text-center w-full" style={{ textAlign: "center" }}>Rate (%)</div>}
                      {customColumns.map(col => <div key={col.id} className="text-center w-full" style={{ textAlign: "center" }}>{col.name}</div>)}
                      {!isEditing && <div className="text-center w-full" style={{ textAlign: "center" }}>Status</div>}
                      <div className="text-left">Remarks</div>
                      <div className="w-8"></div>
                    </div>

                    <div className="space-y-1.5">
                      {tasks.length === 0 && !isEditing && (
                        <div className="py-12 flex flex-col items-center justify-center text-center text-sm text-muted-foreground border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-900/20 m-2">
                          <FolderOpen className="h-10 w-10 mb-3 text-slate-300 dark:text-slate-700" />
                          <p className="font-medium text-slate-600 dark:text-slate-400">No activities recorded for this section.</p>
                          <p className="text-xs text-slate-500 mt-1">Activities added in edit mode will appear here.</p>
                        </div>
                      )}
                      
                      {tasks.map((task) => {
                        const status = calculateTaskStatus(task, today);
                        
                        // Subtitle Row
                        if (task.isSubtitle) {
                          return (
                            <div key={task.id} className="w-full flex items-center px-2 py-3 mt-4 mb-2 rounded bg-slate-100 dark:bg-white/10 group">
                              {isEditing ? (
                                <>
                                  <Input 
                                    value={task.taskName} 
                                    onChange={e => updateTaskField(cycle.id, task.id, "taskName", e.target.value)} 
                                    className="h-8 font-bold flex-1 mr-4 bg-white dark:bg-slate-800 dark:text-white" 
                                    placeholder="Enter Subtitle Name"
                                  />
                                  <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(cycle.id, task.id)} className="h-8 w-8 text-slate-400 hover:text-red-500 mr-1">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                  <div className="flex flex-col border-l border-slate-300 dark:border-slate-600 pl-1">
                                    <Button variant="ghost" size="icon" onClick={() => handleMoveTask(cycle.id, task.id, "up")} className="h-4 w-6 rounded-none text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                                      <ArrowUp className="w-3 h-3" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleMoveTask(cycle.id, task.id, "down")} className="h-4 w-6 rounded-none text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                                      <ArrowDown className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </>
                              ) : (
                                <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm flex-1">
                                  {task.taskName}
                                </div>
                              )}
                            </div>
                          );
                        }

                        // Regular Activity Row
                        const disabledCols = (task.customValues as CustomValues | null)?.disabledColumns || {};
                        return (
                          <div key={task.id} className="grid gap-3 items-start px-2 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-sm border-b border-slate-50 dark:border-white/5 last:border-0 group" style={{ gridTemplateColumns: colConfig }}>
                            {isEditing ? (
                              <>
                                <Input value={task.taskName} onChange={e => updateTaskField(cycle.id, task.id, "taskName", e.target.value)} className="h-8" />
                                {showDeadline && <Input type={disabledCols.deadline ? "text" : "date"} value={disabledCols.deadline ? "" : (task.deadline ? format(new Date(task.deadline), "yyyy-MM-dd") : "")} onChange={e => updateTaskField(cycle.id, task.id, "deadline", e.target.value)} disabled={disabledCols.deadline} className="h-8 text-center" />}
                                {showSubmitted && <Input type={disabledCols.submitted ? "text" : "date"} value={disabledCols.submitted ? "" : (task.dateSubmitted ? format(new Date(task.dateSubmitted), "yyyy-MM-dd") : "")} onChange={e => updateTaskField(cycle.id, task.id, "dateSubmitted", e.target.value)} disabled={disabledCols.submitted} className="h-8 text-center" />}
                                {showTotal && <Input type={disabledCols.total ? "text" : "number"} placeholder={disabledCols.total ? "" : "Total"} value={disabledCols.total ? "" : (task.totalSamplesDocuments ?? "")} onChange={e => updateTaskField(cycle.id, task.id, "totalSamplesDocuments", e.target.value)} disabled={disabledCols.total} className="h-8 text-center" />}
                                {showRate && <Input type={disabledCols.rate ? "text" : "number"} step="0.01" placeholder={disabledCols.rate ? "" : "Rate"} value={disabledCols.rate ? "" : (task.responseRate ?? "")} onChange={e => updateTaskField(cycle.id, task.id, "responseRate", e.target.value)} disabled={disabledCols.rate} className="h-8 text-center" />}
                                {customColumns.map(col => (
                                  <Input 
                                    key={col.id} 
                                    type={disabledCols[col.id] ? "text" : col.type} 
                                    placeholder={disabledCols[col.id] ? "" : col.name} 
                                    value={disabledCols[col.id] ? "" : (String((task.customValues as Record<string, unknown> || {})[col.id] ?? ""))}
                                    onChange={e => updateTaskCustomValue(cycle.id, task.id, col.id, e.target.value)} 
                                    disabled={disabledCols[col.id]} 
                                    className="h-8 text-center" 
                                  />
                                ))}
                                <Input value={disabledCols.remarks ? "" : (task.remarks || "")} onChange={e => updateTaskField(cycle.id, task.id, "remarks", e.target.value)} disabled={disabledCols.remarks} className="h-8" placeholder={disabledCols.remarks ? "" : "Remarks"} />
                                <div className="flex items-center">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 mr-1" title="Disable Columns">
                                        <Settings2 className="w-4 h-4" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-48 p-3 bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 z-50" align="end">
                                      <div className="space-y-3">
                                        <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">Disable Columns</h4>
                                        <div className="space-y-2">
                                          {showDeadline && <Label className="flex items-center gap-2 cursor-pointer text-xs"><Checkbox checked={!!disabledCols.deadline} onCheckedChange={() => toggleTaskColumn(cycle.id, task.id, "deadline")} /> Deadline</Label>}
                                          {showSubmitted && <Label className="flex items-center gap-2 cursor-pointer text-xs"><Checkbox checked={!!disabledCols.submitted} onCheckedChange={() => toggleTaskColumn(cycle.id, task.id, "submitted")} /> Submitted</Label>}
                                          {showTotal && <Label className="flex items-center gap-2 cursor-pointer text-xs"><Checkbox checked={!!disabledCols.total} onCheckedChange={() => toggleTaskColumn(cycle.id, task.id, "total")} /> {totalLabel}</Label>}
                                          {showRate && <Label className="flex items-center gap-2 cursor-pointer text-xs"><Checkbox checked={!!disabledCols.rate} onCheckedChange={() => toggleTaskColumn(cycle.id, task.id, "rate")} /> Rate (%)</Label>}
                                          {customColumns.map(col => (
                                            <Label key={col.id} className="flex items-center gap-2 cursor-pointer text-xs">
                                              <Checkbox checked={!!disabledCols[col.id]} onCheckedChange={() => toggleTaskColumn(cycle.id, task.id, col.id)} /> {col.name}
                                            </Label>
                                          ))}
                                          <Label className="flex items-center gap-2 cursor-pointer text-xs"><Checkbox checked={!!disabledCols.remarks} onCheckedChange={() => toggleTaskColumn(cycle.id, task.id, "remarks")} /> Remarks</Label>
                                        </div>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                  <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(cycle.id, task.id)} className="h-8 w-8 text-slate-400 hover:text-red-500 mr-1">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                  <div className="flex flex-col border-l border-slate-200 dark:border-slate-700 pl-1">
                                    <Button variant="ghost" size="icon" onClick={() => handleMoveTask(cycle.id, task.id, "up")} className="h-4 w-6 rounded-none text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                                      <ArrowUp className="w-3 h-3" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleMoveTask(cycle.id, task.id, "down")} className="h-4 w-6 rounded-none text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                                      <ArrowDown className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="font-medium text-slate-900 dark:text-slate-200 truncate pr-2 pt-1" title={task.taskName}>{task.taskName}</div>
                                {showDeadline && <div className="text-slate-700 dark:text-slate-300 text-center w-full pt-1" style={{ textAlign: "center" }}>{disabledCols.deadline ? "" : (task.deadline ? format(new Date(task.deadline), "MMM d, yyyy") : "N/A")}</div>}
                                {showSubmitted && <div className={cn("text-slate-600 dark:text-slate-400 text-center w-full pt-1", !disabledCols.submitted && !disabledCols.deadline && task.dateSubmitted && task.deadline && new Date(task.dateSubmitted) > new Date(task.deadline) ? "text-red-600 dark:text-red-400 font-medium" : "")} style={{ textAlign: "center" }}>{disabledCols.submitted ? "" : (task.dateSubmitted ? format(new Date(task.dateSubmitted), "MMM d, yyyy") : "N/A")}</div>}
                                {showTotal && <div className="text-slate-600 dark:text-slate-400 text-center w-full pt-1" style={{ textAlign: "center" }}>{disabledCols.total ? "" : (task.totalSamplesDocuments ?? "-")}</div>}
                                {showRate && <div className="text-slate-600 dark:text-slate-400 text-center w-full pt-1" style={{ textAlign: "center" }}>{disabledCols.rate ? "" : (task.responseRate !== null && task.responseRate !== undefined ? `${task.responseRate}%` : "-")}</div>}
                                {customColumns.map(col => (
                                  <div key={col.id} className="text-slate-600 dark:text-slate-400 text-center w-full pt-1" style={{ textAlign: "center" }}>
                                    {disabledCols[col.id] ? "" : (String((task.customValues as Record<string, unknown> || {})[col.id] ?? "-"))}
                                  </div>
                                ))}
                                <div className="text-center w-full pt-1" style={{ textAlign: "center" }}>
                                  <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold leading-none", getBadgeColor(status))}>
                                    {formatLabel(status)}
                                  </span>
                                </div>
                                <div className="text-slate-500 dark:text-slate-400 text-xs py-1 text-left leading-relaxed" title={disabledCols.remarks ? "" : (task.remarks ?? "")}>
                                  {disabledCols.remarks ? "" : (task.remarks || "-")}
                                </div>
                                <div></div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {isEditing && (
                      <div className="mt-4 px-2 flex flex-wrap items-center gap-3">
                        <Button variant="outline" size="sm" onClick={() => handleAddTask(cycle.id, false)} className="gap-1.5 text-xs h-8 border-dashed border-slate-300 dark:border-slate-700">
                          <Plus className="w-3.5 h-3.5" /> Add Activity Row
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => handleAddTask(cycle.id, true)} className="gap-1.5 text-xs h-8 text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10">
                          <Plus className="w-3.5 h-3.5" /> Add Subtitle Row
                        </Button>
                        {cycles.length > 1 && (
                          <Button variant="ghost" size="sm" onClick={() => handleCopyTasksToOtherCycles(cycle.id)} className="gap-1.5 text-xs h-8 ml-auto text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 transition-colors">
                            <Copy className="w-3.5 h-3.5" /> Copy to All Other Sections
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {isEditing && (
          <Button variant="outline" onClick={handleAddCycle} className="w-full py-6 border-dashed border-2 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
            <Plus className="w-5 h-5 mr-2" /> Add Section
          </Button>
        )}
      </div>
    </div>
  );
}
