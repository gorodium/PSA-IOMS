"use client";

import type { SerializedProject, WidgetConfig } from "@/lib/canvas-types";
import { WidgetHeader } from "./WidgetHeader";
import { useState, useEffect, useTransition, useRef } from "react";
import { searchPersonnelAction, updateProjectMetadataAction } from "@/app/(app)/projects/canvas-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, X, Loader2 } from "lucide-react";

interface Props {
  project: SerializedProject;
  config?: WidgetConfig;
  isEditing?: boolean;
  onConfigChange?: (config: WidgetConfig) => void;
}

function PersonnelSearchSelect({ placeholder, onSelect, disabledIds, disabled }: { placeholder: string, onSelect: (id: string) => void, disabledIds: string[], disabled?: boolean }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Array<{ id: string; fullName: string; position: string }>>([]);
  const [isSearching, startSearch] = useTransition();
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

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      startSearch(async () => {
        const data = await searchPersonnelAction(query);
        setResults(data);
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div 
      className={`relative ${isOpen ? 'z-50' : 'z-10'}`}
      ref={wrapperRef}
    >
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          className="pl-9 h-9 text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          disabled={disabled}
        />
        {isSearching && <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />}
      </div>
      {isOpen && results.length > 0 && query && (
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
                  setResults([]);
                }}
                disabled={isAssigned || disabled}
              >
                <div className="font-medium">{person.fullName}</div>
                <div className="text-xs text-muted-foreground">{person.position}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function PersonnelWidget({ project, config, isEditing, onConfigChange }: Props) {
  const [isUpdating, startUpdate] = useTransition();

  const focal = project.personnel.find((p) => p.roleInProject === "Focal Person");
  const alternate = project.personnel.find((p) => p.roleInProject === "Alternate Focal Person");
  const assistant = project.personnel.find((p) => p.roleInProject === "Assistant Focal Person");
  const others = project.personnel.filter((p) => p.roleInProject === "Other Employee Involved");

  const [withAssistant, setWithAssistant] = useState(!!assistant);

  const updateRoles = (newRoles: { focalId?: string | null, alternateId?: string | null, assistantId?: string | null, otherIds?: string[] }) => {
    const fId = newRoles.focalId !== undefined ? newRoles.focalId : focal?.personnelId;
    const altId = newRoles.alternateId !== undefined ? newRoles.alternateId : alternate?.personnelId;
    const asstId = newRoles.assistantId !== undefined ? newRoles.assistantId : assistant?.personnelId;
    const othIds = newRoles.otherIds !== undefined ? newRoles.otherIds : others.map(o => o.personnelId);

    const formData = new FormData();
    formData.append("id", project.id);
    if (fId) formData.append("focalPersonnelId", fId);
    if (altId) formData.append("alternatePersonnelId", altId);
    if (asstId && withAssistant) formData.append("assistantPersonnelId", asstId);
    othIds.forEach(id => formData.append("otherPersonnelIds", id));
    
    startUpdate(async () => {
      await updateProjectMetadataAction(formData);
    });
  };

  const handleToggleAssistant = (checked: boolean) => {
    setWithAssistant(checked);
    if (!checked && assistant) {
      updateRoles({ assistantId: null });
    }
  };

  const existingIds = project.personnel.map(p => p.personnelId);

  return (
    <div className="h-full flex flex-col overflow-auto">
      <WidgetHeader
        defaultTitle="Assigned Employees"
        config={config}
        isEditing={!!isEditing}
        onConfigChange={onConfigChange}
        className="px-0 pt-0"
      />
      <div className="flex-1 overflow-auto py-5 space-y-6 text-sm">
        
        {isEditing ? (
          <div className="space-y-5">
            {/* Focal Person */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <p className="text-xs font-medium uppercase text-muted-foreground">Focal Person</p>
                {focal && (
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => updateRoles({ focalId: null })} disabled={isUpdating}>
                    Remove
                  </Button>
                )}
              </div>
              {focal ? (
                <div className="flex items-center gap-2 p-2 border border-border rounded-md bg-muted/50">
                  <div className="flex-1 font-medium">{focal.personnel.fullName}</div>
                </div>
              ) : (
                <PersonnelSearchSelect 
                  placeholder="Search for Focal Person..." 
                  onSelect={(id) => updateRoles({ focalId: id })} 
                  disabledIds={existingIds} 
                  disabled={isUpdating} 
                />
              )}
            </div>

            {/* Alternate Focal Person */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <p className="text-xs font-medium uppercase text-muted-foreground">Alternate Focal Person</p>
                {alternate && (
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => updateRoles({ alternateId: null })} disabled={isUpdating}>
                    Remove
                  </Button>
                )}
              </div>
              {alternate ? (
                <div className="flex items-center gap-2 p-2 border border-border rounded-md bg-muted/50">
                  <div className="flex-1 font-medium">{alternate.personnel.fullName}</div>
                </div>
              ) : (
                <PersonnelSearchSelect 
                  placeholder="Search for Alternate Focal Person..." 
                  onSelect={(id) => updateRoles({ alternateId: id })} 
                  disabledIds={existingIds} 
                  disabled={isUpdating} 
                />
              )}
            </div>

            {/* Assistant Focal Person Checkbox */}
            <div className="flex flex-col space-y-2 pt-2 border-t border-border">
              <div className="flex items-center space-x-2">
                <Checkbox id="withAssistant" checked={withAssistant} onCheckedChange={handleToggleAssistant} disabled={isUpdating} />
                <label htmlFor="withAssistant" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  With Assistant Focal Person
                </label>
              </div>

              {withAssistant && (
                <div className="pl-6 pt-1">
                  {assistant ? (
                    <div className="flex items-center gap-2 p-2 border border-border rounded-md bg-muted/50">
                      <div className="flex-1 font-medium">{assistant.personnel.fullName}</div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => updateRoles({ assistantId: null })} disabled={isUpdating}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <PersonnelSearchSelect 
                      placeholder="Search for Assistant Focal Person..." 
                      onSelect={(id) => updateRoles({ assistantId: id })} 
                      disabledIds={existingIds} 
                      disabled={isUpdating} 
                    />
                  )}
                </div>
              )}
            </div>

            {/* Other Employees */}
            <div className="pt-2 border-t border-border">
              <p className="text-xs font-medium uppercase text-muted-foreground mb-2">Other Employee Involved</p>
              <PersonnelSearchSelect 
                placeholder="Search to add other employees..." 
                onSelect={(id) => updateRoles({ otherIds: [...others.map(o => o.personnelId), id] })} 
                disabledIds={existingIds} 
                disabled={isUpdating} 
              />
              <div className="mt-3 space-y-2">
                {others.map(o => (
                  <div key={o.id} className="flex items-center gap-2 p-2 border border-border rounded-md bg-muted/50">
                    <div className="flex-1 font-medium">{o.personnel.fullName}</div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => updateRoles({ otherIds: others.map(x => x.personnelId).filter(id => id !== o.personnelId) })} disabled={isUpdating}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="grid gap-6">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Focal Person</p>
              <p className="mt-0.5 text-foreground font-medium">{focal?.personnel.fullName || "Not assigned"}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Alternate Focal Person</p>
              <p className="mt-0.5 text-foreground font-medium">{alternate?.personnel.fullName || "None"}</p>
            </div>
            {(withAssistant || assistant) && (
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">Assistant Focal Person</p>
                <p className="mt-0.5 text-foreground font-medium">{assistant?.personnel.fullName || "None"}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Other Employee Involved</p>
              {others.length > 0 ? (
                <ul className="mt-0.5 space-y-1">
                  {others.map(o => (
                    <li key={o.id} className="text-foreground font-medium">{o.personnel.fullName}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-0.5 text-muted-foreground">None</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
