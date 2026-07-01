"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  fetchSpecialOrdersPreview, 
  commitSpecialOrders, 
  type PreviewSO, 
  type SyncResult 
} from "./actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { DownloadCloud, Loader2, AlertTriangle, Users, MapPin, Calendar as CalendarIcon, CheckCircle2, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface SpecialOrderRecord {
  id: string;
  soNumber?: string | null;
  referenceNo?: string | null;
  purpose?: string | null;
  destination?: string | null;
  activityDateString?: string | null;
  activityDate?: Date | string | null;
  people?: { id: string; originalName: string; personnel?: { fullName?: string | null } }[] | null;
  [key: string]: unknown;
}

interface Props {
  initialData: SpecialOrderRecord[];
}

export function SpecialOrderClient({ initialData }: Props) {
  const [isFetching, setIsFetching] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [previewResult, setPreviewResult] = useState<SyncResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [personnelModalSO, setPersonnelModalSO] = useState<SpecialOrderRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  type SortField = 'soNumber' | 'referenceNo' | 'purpose' | 'destination' | 'activityDate' | 'personnel';
  const [sortField, setSortField] = useState<SortField>('soNumber');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const [monthFilter, setMonthFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");

  const filteredData = useMemo(() => {
    return initialData.filter(so => {
      let matchesMonth = true;
      if (monthFilter) {
        if (so.activityDateString) {
           matchesMonth = String(so.activityDateString).toLowerCase().includes(monthFilter.toLowerCase());
        } else if (so.activityDate) {
           matchesMonth = format(new Date(so.activityDate as string | number | Date), "MMMM").toLowerCase().includes(monthFilter.toLowerCase());
        } else {
           matchesMonth = false;
        }
      }

      let matchesEmployee = true;
      if (employeeFilter) {
        if (so.people) {
           matchesEmployee = (so.people as { originalName: string, personnel?: { fullName?: string } }[]).some((p) => 
             p.originalName.toLowerCase().includes(employeeFilter.toLowerCase()) || 
             (p.personnel?.fullName && p.personnel.fullName.toLowerCase().includes(employeeFilter.toLowerCase()))
           );
        } else {
           matchesEmployee = false;
        }
      }
      
      return matchesMonth && matchesEmployee;
    });
  }, [initialData, monthFilter, employeeFilter]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    
    if (sortField === 'personnel') {
      valA = (a.people as unknown[])?.length || 0;
      valB = (b.people as unknown[])?.length || 0;
    }
    
    if (valA === valB) return 0;
    if (valA === null || valA === undefined) return 1;
    if (valB === null || valB === undefined) return -1;
    
    const comparison = valA < valB ? -1 : 1;
    return sortDir === 'asc' ? comparison : -comparison;
  });
  }, [filteredData, sortField, sortDir]);

  const handleFetchPreview = async () => {
    setIsFetching(true);
    setError(null);
    try {
      const res = await fetchSpecialOrdersPreview();
      if (res.success && res.data) {
        setPreviewResult(res.data);
        setShowPreview(true);
      } else {
        setError(res.error || "Failed to fetch data.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsFetching(false);
    }
  };

  const handleCommit = async () => {
    if (!previewResult) return;
    setIsCommitting(true);
    setError(null);
    try {
      const res = await commitSpecialOrders(previewResult.previews);
      if (res.success) {
        setShowPreview(false);
        setPreviewResult(null);
        // Page will automatically revalidate
      } else {
        setError(res.error || "Failed to commit changes.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsCommitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Special Orders</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View and sync Special Orders from the central Google Sheet.
          </p>
        </div>
        <Button onClick={handleFetchPreview} disabled={isFetching || isCommitting} className="w-full sm:w-auto">
          {isFetching ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <DownloadCloud className="w-4 h-4 mr-2" />}
          Sync from Sheet
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-red-50 text-red-600 border border-red-200 text-sm flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Main Table View */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden flex flex-col h-full max-h-[80vh]">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
          <Input 
            placeholder="Filter by month (e.g. May)..." 
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="w-full sm:max-w-xs"
          />
          <Input 
            placeholder="Filter by employee name..." 
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            className="w-full sm:max-w-xs"
          />
        </div>
        <div className="overflow-auto flex-1 relative">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium">
              <tr>
                <th className="px-4 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => handleSort('soNumber')}><div className="flex items-center gap-1">SO No. {sortField === 'soNumber' && (sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}</div></th>
                <th className="px-4 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => handleSort('referenceNo')}><div className="flex items-center gap-1">Reference {sortField === 'referenceNo' && (sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}</div></th>
                <th className="px-4 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => handleSort('purpose')}><div className="flex items-center gap-1">Purpose {sortField === 'purpose' && (sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}</div></th>
                <th className="px-4 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => handleSort('destination')}><div className="flex items-center gap-1">Destination {sortField === 'destination' && (sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}</div></th>
                <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => handleSort('activityDate')}>
                  <div className="flex items-center gap-1 w-max">
                    Activity Date
                    {sortField === 'activityDate' && (sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                  </div>
                </th>
                <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => handleSort('personnel')}>
                  <div className="flex items-center gap-1 w-max">
                    Employee(s)
                    {sortField === 'personnel' && (sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {sortedData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No Special Orders found. Click &quot;Sync from Sheet&quot; to load data.
                  </td>
                </tr>
              ) : (
                sortedData.map((so) => (
                  <tr key={so.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <td className="px-4 py-3 font-medium">{so.soNumber || "-"}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {so.referenceNo ? (
                        <a 
                          href={`/api/drive?ref=${encodeURIComponent(so.referenceNo)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline flex items-center gap-1 w-max"
                          title="Open PDF"
                        >
                          {so.referenceNo}
                        </a>
                      ) : "-"}
                    </td>
                    <td className="px-4 py-3 max-w-[200px] truncate" title={so.purpose || undefined}>{so.purpose}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[150px]" title={so.destination || undefined}>{so.destination || "-"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {so.activityDateString || so.activityDate ? (
                        <div className="flex items-center gap-1.5 text-xs">
                          <CalendarIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate max-w-[200px]" title={so.activityDateString || (so.activityDate ? format(new Date(so.activityDate), "MMM d, yyyy") : undefined)}>
                            {so.activityDateString || (so.activityDate ? format(new Date(so.activityDate), "MMM d, yyyy") : "")}
                          </span>
                        </div>
                      ) : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => setPersonnelModalSO(so)}
                        className="flex items-center gap-2 cursor-pointer w-max text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors focus:outline-none"
                        title="Click to view all assigned employees"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span className="text-xs">{so.people?.length || 0} assigned</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employees Modal */}
      <Dialog open={!!personnelModalSO} onOpenChange={(open) => !open && setPersonnelModalSO(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assigned Employee(s)</DialogTitle>
            <DialogDescription>
              {personnelModalSO?.soNumber || personnelModalSO?.referenceNo || 'Special Order details'}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto mt-4 space-y-1">
            {personnelModalSO?.people && personnelModalSO.people.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {(personnelModalSO.people as {id: string, originalName: string}[]).map((p) => (
                  <li key={p.id} className="text-sm text-slate-700 dark:text-slate-300">
                    {p.originalName}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 italic">No employees assigned to this Special Order.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
            <DialogTitle>Review Special Orders Sync</DialogTitle>
            <DialogDescription>
              Review the fetched data before committing it to the database.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {previewResult && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/50">
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Rows Fetched</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{previewResult.totalRows}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 border border-green-100 dark:bg-green-900/20 dark:border-green-900/50">
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">New / Updated Records</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {previewResult.previews.filter(p => p.isNew).length} / {previewResult.previews.filter(p => !p.isNew).length}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-amber-50 border border-amber-100 dark:bg-amber-900/20 dark:border-amber-900/50">
                    <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">Unmatched Names</p>
                    <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{previewResult.unmatchedCount}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Data Preview</h3>
                  <div className="space-y-3">
                    {previewResult.previews.slice(0, 10).map((preview, idx) => (
                      <div key={idx} className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold text-sm">{preview.soNumber || preview.referenceNo || 'No Reference'}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{preview.purpose}</p>
                          </div>
                          {preview.isNew ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">New</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Update</Badge>
                          )}
                        </div>
                        
                        <div className="text-xs space-y-2 border-t border-slate-200 dark:border-slate-800 pt-3">
                          <div className="flex gap-2 items-center text-slate-600 dark:text-slate-400">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{preview.destination || 'No Destination'}</span>
                            <span className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded-md ml-auto text-[10px] uppercase font-medium">
                              {preview.locationType.replace("_", " ")}
                            </span>
                          </div>
                          <div className="flex gap-2 items-center text-slate-600 dark:text-slate-400">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            <span>{preview.activityDate || preview.assignedDate || 'No Date'}</span>
                          </div>
                        </div>

                        {preview.peoplePreview.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                            <p className="text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Assigned Personnel ({preview.peoplePreview.length})</p>
                            <div className="flex flex-wrap gap-1.5">
                              {preview.peoplePreview.map((p, i) => (
                                <Badge 
                                  key={i} 
                                  variant="secondary"
                                  className={cn(
                                    "text-[10px] px-1.5 py-0.5",
                                    p.matchStatus === "MATCHED" && "bg-green-100 text-green-800 hover:bg-green-200",
                                    p.matchStatus === "UNMATCHED" && "bg-amber-100 text-amber-800 hover:bg-amber-200",
                                    p.matchStatus === "CUSTOM" && "bg-slate-200 text-slate-700 hover:bg-slate-300"
                                  )}
                                  title={p.matchStatus === "MATCHED" ? `Matched to: ${p.dbName}` : `Unmatched: ${p.originalName}`}
                                >
                                  {p.matchStatus === "MATCHED" ? <CheckCircle2 className="w-3 h-3 mr-1 inline" /> : null}
                                  {p.originalName}
                                  {p.isTravelTagged && <span className="ml-1 opacity-70">(Travel)</span>}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {previewResult.previews.length > 10 && (
                      <p className="text-center text-sm text-slate-500 py-2">
                        + {previewResult.previews.length - 10} more records...
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex-shrink-0 bg-slate-50 dark:bg-slate-900/50">
            <Button variant="outline" onClick={() => setShowPreview(false)} disabled={isCommitting}>Cancel</Button>
            <Button onClick={handleCommit} disabled={isCommitting}>
              {isCommitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Confirm & Save Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
