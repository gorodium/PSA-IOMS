"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { checkConflicts, quickReserve } from "@/lib/scheduling-actions";

export interface ResourceOption {
  id: string;
  name: string;
  isAvailable?: boolean;
}

interface QuickReserveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialDate?: Date;
  userId: string;
  isAdmin?: boolean;
  defaultType?: "ROOM" | "VEHICLE";
  resources?: ResourceOption[];
  employees?: { id: string; name: string; position?: string }[];
}

export function QuickReserveDialog({ 
  open, 
  onOpenChange, 
  onSuccess, 
  initialDate, 
  userId, 
  isAdmin = false,
  defaultType = "ROOM",
  resources = [],
  employees = []
}: QuickReserveDialogProps) {
  const type = defaultType;
  
  // Format dates for datetime-local input safely
  const formatForInput = (d?: Date) => {
    if (!d) return "";
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [resourceId, setResourceId] = useState("");
  const [purpose, setPurpose] = useState("");
  const getInitialStartTime = () => {
    if (!initialDate) return "";
    const start = new Date(initialDate);
    start.setHours(8, 0, 0, 0);
    return formatForInput(start);
  };

  const [startTime, setStartTime] = useState(getInitialStartTime());
  
  // Default end time to 5:00 PM if initialDate is provided
  const getInitialEndTime = () => {
    if (!initialDate) return "";
    const end = new Date(initialDate);
    end.setHours(17, 0, 0, 0);
    return formatForInput(end);
  };
  const [endTime, setEndTime] = useState(getInitialEndTime());
  const [isAdminAdd, setIsAdminAdd] = useState(isAdmin);
  const [requesterPersonnelId, setRequesterPersonnelId] = useState("");
  const [assignedDriverId, setAssignedDriverId] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [conflictMsg, setConflictMsg] = useState("");

  const drivers = employees.filter(e => e.position?.toLowerCase().includes("driver"));
  const otherEmployees = employees.filter(e => !e.position?.toLowerCase().includes("driver"));

  // Update dates if initialDate changes (when dialog opens)
  useEffect(() => {
    if (open && initialDate) {
      const start = new Date(initialDate);
      start.setHours(8, 0, 0, 0);
      setStartTime(formatForInput(start));

      const end = new Date(initialDate);
      end.setHours(17, 0, 0, 0);
      setEndTime(formatForInput(end));
    }
  }, [open, initialDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConflictMsg("");
    setLoading(true);

    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      
      const conflictRes = await checkConflicts(type, resourceId, start, end);
      
      if (conflictRes.hasConflict) {
        setConflictMsg("Conflict detected! The resource is already booked during this time. Please select another time or resource.");
        setLoading(false);
        return;
      }

      const res = await quickReserve({
        type,
        resourceId,
        purpose,
        startTime: start,
        endTime: end,
        userId: userId,
        isAdminAdd: isAdmin ? isAdminAdd : false,
        requesterPersonnelId: (isAdmin && isAdminAdd && requesterPersonnelId) ? requesterPersonnelId : undefined,
        assignedDriverId: (type === "VEHICLE" && isAdmin && isAdminAdd && assignedDriverId) ? assignedDriverId : undefined
      });

      if (res.success) {
        onSuccess();
        onOpenChange(false);
        // Reset form
        setResourceId("");
        setPurpose("");
        setRequesterPersonnelId("");
        setAssignedDriverId("");
      } else {
        alert("Failed to create reservation: " + res.error);
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Quick Booking Request</DialogTitle>
            <DialogDescription>
              Submit a quick {type === "ROOM" ? "room reservation" : "vehicle request"} for the selected date.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Resource ({type === "ROOM" ? "Room" : "Vehicle"})</Label>
              <select 
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
                value={resourceId}
                onChange={(e) => setResourceId(e.target.value)}
              >
                <option value="" disabled>Select {type === "ROOM" ? "a room" : "a vehicle"}</option>
                {resources.map(res => (
                  <option 
                    key={res.id} 
                    value={res.id}
                    disabled={res.isAvailable === false}
                  >
                    {res.name} {res.isAvailable === false ? "(Unavailable)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label>Purpose</Label>
              <Input 
                required 
                value={purpose} 
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="What is this for?"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Start Time</Label>
                <Input 
                  type="datetime-local" 
                  required 
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label>End Time</Label>
                <Input 
                  type="datetime-local" 
                  required 
                  value={endTime} 
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

              {isAdmin && isAdminAdd && employees && employees.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Requested By (Employee)</Label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={requesterPersonnelId}
                      onChange={e => setRequesterPersonnelId(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select the requesting employee</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {type === "VEHICLE" && (
                    <div className="grid gap-2">
                      <Label>Driver</Label>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={assignedDriverId}
                        onChange={e => setAssignedDriverId(e.target.value)}
                      >
                        <option value="">No driver assigned</option>
                        {drivers.length > 0 && (
                          <optgroup label="Drivers">
                            {drivers.map(driver => (
                              <option key={driver.id} value={driver.id}>
                                {driver.name}
                              </option>
                            ))}
                          </optgroup>
                        )}
                        {otherEmployees.length > 0 && (
                          <optgroup label="Other Employees">
                            {otherEmployees.map(emp => (
                              <option key={emp.id} value={emp.id}>
                                {emp.name}
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                    </div>
                  )}
                </div>
              )}

            {isAdmin && (
              <div className="flex items-center space-x-2 mt-2 p-3 border rounded-md bg-secondary/20">
                <Checkbox 
                  id="admin-add" 
                  checked={isAdminAdd} 
                  onCheckedChange={(checked) => setIsAdminAdd(checked === true)}
                />
                <Label htmlFor="admin-add" className="cursor-pointer font-medium text-primary">
                  Approve immediately (Admin Manual Booking)
                </Label>
              </div>
            )}

            {conflictMsg && (
              <div className="text-sm text-destructive font-medium p-3 bg-destructive/10 rounded-md">
                {conflictMsg}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Submit Booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
