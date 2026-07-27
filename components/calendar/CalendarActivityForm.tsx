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
  specialOrders,
  onClose,
  onSuccess
}: {
  activity?: {
    id?: string;
    type: ActivityType;
    additionalTypes?: ActivityType[];
    title: string;
    soNumber?: string | null;
    description?: string | null;
    startDate: string | Date;
    endDate?: string | Date | null;
    location?: string | null;
    personnelId?: string | null;
    soFileUrl?: string | null;
    soFileUrl?: string | null;
    involvedPersonnel?: { id: string }[];
    specialOrders?: { id: string }[];
  };
  personnel: Personnel[];
  specialOrders?: { id: string; soNumber: string; purpose: string; activityDateString: string | null; activityDate: Date | null }[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [type, setType] = React.useState<ActivityType>(activity?.type || "EVENT");
  const [additionalTypes, setAdditionalTypes] = React.useState<ActivityType[]>(activity?.additionalTypes || []);
  const [title, setTitle] = React.useState(activity?.title || "");
  const [specialOrderId, setSpecialOrderId] = React.useState(activity?.specialOrders?.[0]?.id || "");
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
  const [isOffice, setIsOffice] = React.useState(activity?.location === "PSA Misamis Oriental");

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const togglePersonnel = (id: string) => {
    setInvolvedPersonnelIds(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    let finalTitle = title;
    if (type === "EVENT" && !title) finalTitle = specialOrderId ? `Work Event` : "Work Event";
    if (type === "TRAINING" && !title) finalTitle = specialOrderId ? `Training` : "Training";
    if (type === "TRAVEL" && !title) finalTitle = specialOrderId ? `Travel` : "Employee Travel";
    if (type === "HOLIDAY" && !title) finalTitle = "Holiday";

    try {
      const payload = {
        id: activity?.id,
        type,
        additionalTypes,
        title: finalTitle,
        specialOrderId: specialOrderId || null,
        description: description || null,
        startDate,
        endDate: (isMultiDay && endDate) ? endDate : null,
        location: (type === "EVENT" && isOffice) ? "PSA Misamis Oriental" : (location || null),
        personnelId: personnelId || null,
        involvedPersonnelIds: involvedPersonnelIds.length > 0 ? involvedPersonnelIds : []
      };

      if (activity?.id) {
        await updateCalendarActivityAction(payload);
      } else {
        await createCalendarActivityAction(payload);
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
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Primary Type</Label>
            <Select 
              value={type} 
              onChange={(e) => setType(e.target.value as ActivityType)}
              required
              className="w-full"
            >
              <option value="EVENT">Work Event</option>
              <option value="TRAINING">Training</option>
              <option value="TRAVEL">Employee Travel</option>
              <option value="HOLIDAY">Holiday</option>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Additional Tags (Optional)</Label>
            <div className="border border-slate-200 dark:border-slate-800 rounded-md p-2 space-y-1 bg-slate-50 dark:bg-slate-900/50 h-10 flex items-center overflow-x-auto scrollbar-thin">
              {["EVENT", "TRAINING", "TRAVEL", "HOLIDAY"].filter(t => t !== type).map((t) => (
                <label key={t} className="flex items-center gap-1.5 text-xs px-2 py-0.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded cursor-pointer shrink-0">
                  <input 
                    type="checkbox" 
                    checked={additionalTypes.includes(t as ActivityType)}
                    onChange={(e) => {
                      if (e.target.checked) setAdditionalTypes([...additionalTypes, t as ActivityType]);
                      else setAdditionalTypes(additionalTypes.filter(x => x !== t));
                    }}
                    className="rounded border-input text-primary focus:ring-ring w-3 h-3"
                  />
                  {t === "EVENT" ? "Event" : t === "TRAINING" ? "Training" : t === "TRAVEL" ? "Travel" : "Holiday"}
                </label>
              ))}
            </div>
          </div>
        </div>

        {type === "HOLIDAY" && (
          <div className="space-y-2">
            <Label>Name of Holiday</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Independence Day" />
          </div>
        )}

        {(type === "EVENT" || type === "TRAINING") && (
          <div className="space-y-2">
            <Label>{type === "TRAINING" ? "Training Name" : "Event Name"}</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder={type === "TRAINING" ? "e.g. Leadership Training" : "e.g. Strategic Planning"} />
          </div>
        )}

        {(type === "EVENT" || type === "TRAVEL" || type === "TRAINING") && (
          <div className="space-y-2">
            <Label>Link Special Order (Optional)</Label>
            <Select value={specialOrderId} onChange={e => setSpecialOrderId(e.target.value)} className="w-full">
              <option value="">No linked SO</option>
              {specialOrders?.map(so => (
                <option key={so.id} value={so.id}>
                  {so.soNumber} {so.purpose ? `- ${so.purpose}` : ''}
                </option>
              ))}
            </Select>
          </div>
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

        {(type === "EVENT" || type === "TRAINING") && (
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
            <Label>{type === "HOLIDAY" ? "Date" : (type === "EVENT" || type === "TRAINING" ? (isMultiDay ? "Start Date" : (type === "TRAINING" ? "Training Date" : "Event Date")) : (isMultiDay ? "Start Date" : "Date of Travel"))}</Label>
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
            {type === "TRAVEL" ? "Multi-day travel" : "Multi-day event"}
          </label>
        )}

        {(type === "EVENT" || type === "TRAVEL" || type === "TRAINING") && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Location</Label>
              {(type === "EVENT" || type === "TRAINING") && (
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer text-slate-600 dark:text-slate-400">
                  <input 
                    type="checkbox" 
                    checked={isOffice} 
                    onChange={e => setIsOffice(e.target.checked)} 
                    className="rounded border-input text-primary focus:ring-ring w-3.5 h-3.5"
                  />
                  Held in office
                </label>
              )}
            </div>
            <Input 
              value={isOffice ? "PSA Misamis Oriental" : location} 
              onChange={e => setLocation(e.target.value)} 
              placeholder="e.g. Quezon City" 
              disabled={isOffice}
              className={isOffice ? "bg-slate-100 dark:bg-white/5 text-slate-500 cursor-not-allowed" : ""}
            />
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
