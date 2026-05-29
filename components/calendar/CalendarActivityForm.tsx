"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { createCalendarActivityAction, updateCalendarActivityAction } from "@/app/(app)/calendar/actions";
import { ActivityType, Personnel } from "@prisma/client";
import { format } from "date-fns";
import imageCompression from "browser-image-compression";

export function CalendarActivityForm({
  activity,
  personnel,
  onClose,
  onSuccess
}: {
  activity?: {
    id?: string;
    type: ActivityType;
    title: string;
    soNumber?: string | null;
    description?: string | null;
    startDate: string | Date;
    endDate?: string | Date | null;
    location?: string | null;
    personnelId?: string | null;
    soFileUrl?: string | null;
    involvedPersonnel?: { id: string }[];
  };
  personnel: Personnel[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [type, setType] = React.useState<ActivityType>(activity?.type || "EVENT");
  const [title, setTitle] = React.useState(activity?.title || "");
  const [soNumber, setSoNumber] = React.useState(activity?.soNumber || "");
  const description = activity?.description || "";
  const [location, setLocation] = React.useState(activity?.location || "");
  const [personnelId, setPersonnelId] = React.useState(activity?.personnelId || "");
  const [involvedPersonnelIds, setInvolvedPersonnelIds] = React.useState<string[]>(
    activity?.involvedPersonnel?.map((p: { id: string }) => p.id) || []
  );
  
  const initialStartDate = activity?.startDate ? format(new Date(activity.startDate), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
  const initialEndDate = activity?.endDate ? format(new Date(activity.endDate), "yyyy-MM-dd") : "";
  const [startDate, setStartDate] = React.useState(initialStartDate);
  const [endDate, setEndDate] = React.useState(initialEndDate);
  const [isMultiDay, setIsMultiDay] = React.useState(Boolean(activity?.endDate && activity.startDate !== activity.endDate));

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [soFile, setSoFile] = React.useState<File | null>(null);
  const [soFileError, setSoFileError] = React.useState<string | null>(null);

  const togglePersonnel = (id: string) => {
    setInvolvedPersonnelIds(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSoFileError(null);
    if (!file) {
      setSoFile(null);
      return;
    }

    if (file.type === "application/pdf") {
      if (file.size > 3 * 1024 * 1024) {
        setSoFileError("PDF file exceeds 3MB limit. Please compress it before uploading.");
        e.target.value = '';
        setSoFile(null);
        return;
      }
      setSoFile(file);
    } else if (file.type.startsWith("image/")) {
      try {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 3,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        });
        setSoFile(compressedFile);
      } catch {
        setSoFileError("Failed to compress image.");
        e.target.value = '';
        setSoFile(null);
      }
    } else {
      setSoFileError("Invalid file type.");
      e.target.value = '';
      setSoFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const formData = new FormData();
    if (activity?.id) formData.append("id", activity.id);
    formData.append("type", type);
    
    // Default title based on type if not explicitly set (Work Event / Employee Travel)
    let finalTitle = title;
    if (type === "EVENT" && !title) finalTitle = soNumber ? `Work Event: ${soNumber}` : "Work Event";
    if (type === "TRAVEL" && !title) finalTitle = soNumber ? `Travel: ${soNumber}` : "Employee Travel";
    if (type === "HOLIDAY" && !title) finalTitle = "Holiday";
    
    formData.append("title", finalTitle);
    if (soNumber) formData.append("soNumber", soNumber);
    if (description) formData.append("description", description);
    formData.append("startDate", startDate);
    if (isMultiDay && endDate) formData.append("endDate", endDate);
    if (location) formData.append("location", location);
    if (personnelId) formData.append("personnelId", personnelId);
    if (involvedPersonnelIds.length > 0) formData.append("involvedPersonnelIds", JSON.stringify(involvedPersonnelIds));
    if (soFile) formData.append("soFile", soFile);

    try {
      if (activity?.id) {
        await updateCalendarActivityAction(formData);
      } else {
        await createCalendarActivityAction(formData);
      }
      onSuccess();
    } catch (err) {
      const errorMsgText = err instanceof Error ? err.message : "An error occurred.";
      setErrorMsg(errorMsgText);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1C2130] p-6 rounded-lg shadow-xl max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
      <Button variant="ghost" size="icon" onClick={onClose} className="absolute right-4 top-4 text-slate-500">
        <X className="h-5 w-5" />
      </Button>
      <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">
        {activity ? "Edit Activity" : "Add Activity"}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Activity Type</Label>
          <Select 
            value={type} 
            onChange={(e) => setType(e.target.value as ActivityType)}
            required
            className="w-full"
          >
            <option value="EVENT">Work Event</option>
            <option value="TRAVEL">Employee Travel</option>
            <option value="HOLIDAY">Holiday</option>
          </Select>
        </div>

        {type === "HOLIDAY" && (
          <div className="space-y-2">
            <Label>Name of Holiday</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Independence Day" />
          </div>
        )}

        {type === "EVENT" && (
          <div className="space-y-2">
            <Label>Event Name</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Strategic Planning" />
          </div>
        )}

        {(type === "EVENT" || type === "TRAVEL") && (
          <>
            <div className="space-y-2">
              <Label>SO Number</Label>
              <Input value={soNumber} onChange={e => setSoNumber(e.target.value)} placeholder="e.g. SO-2026-001" />
            </div>
            <div className="space-y-2">
              <Label>SO File (Optional)</Label>
              <div className="text-xs text-slate-500 mb-1">Upload a scanned copy or photo (PDF, JPG, PNG). Images are compressed to under 3MB. Max 3MB for PDF.</div>
              <Input 
                type="file" 
                accept=".pdf, .jpg, .jpeg, .png" 
                onChange={handleFileChange}
                disabled={isSubmitting}
                className="cursor-pointer"
              />
              {soFileError && <p className="text-xs text-red-500 mt-1">{soFileError}</p>}
              {activity?.soFileUrl && !soFile && (
                <p className="text-xs text-slate-500 mt-1">
                  Current file: <a href={activity.soFileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">View attached file</a>
                </p>
              )}
            </div>
          </>
        )}

        {type === "TRAVEL" && (
          <>
            <div className="space-y-2">
              <Label>Employee</Label>
              <Select value={personnelId} onChange={e => setPersonnelId(e.target.value)} required className="w-full">
                <option value="">Select Employee...</option>
                {personnel.map(p => (
                  <option key={p.id} value={p.id}>{p.fullName}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Purpose of Travel</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Purpose..." />
            </div>
          </>
        )}

        {type === "EVENT" && (
          <div className="space-y-2">
            <Label>Employee(s) Involved</Label>
            <div className="border border-slate-200 dark:border-slate-800 rounded-md max-h-[150px] overflow-y-auto p-2 space-y-1 bg-slate-50 dark:bg-slate-900/50">
              {personnel.map(p => (
                <label key={p.id} className="flex items-center gap-2 text-sm p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={involvedPersonnelIds.includes(p.id)}
                    onChange={() => togglePersonnel(p.id)}
                    className="rounded border-input text-primary focus:ring-ring"
                  />
                  {p.fullName}
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{type === "HOLIDAY" ? "Date" : (type === "EVENT" ? "Event Date" : "Date of Travel")}</Label>
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
          </div>
          {isMultiDay && (
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required={isMultiDay} min={startDate} />
            </div>
          )}
        </div>

        {type !== "HOLIDAY" && (
          <label className="flex items-center gap-2 text-sm font-medium mt-2 mb-4 cursor-pointer">
            <input 
              type="checkbox" 
              checked={isMultiDay} 
              onChange={e => setIsMultiDay(e.target.checked)} 
              className="rounded border-input text-primary focus:ring-ring"
            />
            Multi-day event
          </label>
        )}

        {(type === "EVENT" || type === "TRAVEL") && (
          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Quezon City" />
          </div>
        )}

        {errorMsg && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
            {errorMsg}
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-primary">
            {isSubmitting ? "Saving..." : (activity ? "Save Changes" : "Add Activity")}
          </Button>
        </div>
      </form>
    </div>
  );
}
