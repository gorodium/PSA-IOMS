import Link from "next/link";
import { CalendarDays, FileText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VehicleRequestForm } from "@/components/vehicle/VehicleRequestForm";
import { VehicleRequestStatusBadge } from "@/components/vehicle/VehicleRequestStatusBadge";
import { SchedulingClient } from "@/components/scheduling/SchedulingClient";
import { cancelVehicleRequestAction } from "@/app/(app)/vehicle-requests/actions";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatRequestSchedule, formatVehicleLabel, isVehicleAdmin } from "@/lib/vehicle-scheduling";

export const dynamic = "force-dynamic";

export default async function VehicleRequestsPage() {
  const user = await requireUser();
  const isAdmin = isVehicleAdmin(user.role);

  const [personnel, specialOrders, requests, vehicles, personnelList] = await Promise.all([
    db.personnel.findMany({
      where: { isActive: true },
      orderBy: { fullName: "asc" },
      select: {
        id: true,
        fullName: true,
        position: true,
        section: true
      }
    }),
    db.specialOrder.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        soNumber: true,
        purpose: true,
        activityDate: true
      }
    }),
    user.personnelId
      ? db.vehicleRequest.findMany({
          where: { requesterPersonnelId: user.personnelId },
          include: {
            requester: true,
            assignedVehicle: true,
            passengers: { include: { personnel: true } }
          },
          orderBy: { createdAt: "desc" }
        })
      : Promise.resolve([]),
    db.vehicle.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" }
    }),
    isAdmin ? db.personnel.findMany({
      where: { isActive: true },
      orderBy: { fullName: "asc" }
    }) : Promise.resolve([])
  ]);

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  const startOfYear = new Date(startOfDay.getFullYear(), 0, 1);
  const endOfYear = new Date(startOfDay.getFullYear(), 11, 31, 23, 59, 59);

  const [
    yearlyTrips,
    pendingRequests,
    upcomingTrips,
    todayAssignedVehicles
  ] = await Promise.all([
    db.vehicleRequest.count({
      where: {
        departureAt: { gte: startOfYear },
        expectedReturnAt: { lte: endOfYear }
      }
    }),
    db.vehicleRequest.count({
      where: {
        status: "PENDING"
      }
    }),
    db.vehicleRequest.count({
      where: {
        status: "APPROVED",
        departureAt: { gt: endOfDay }
      }
    }),
    db.vehicleRequest.findMany({
      where: {
        status: "APPROVED",
        departureAt: { lte: endOfDay },
        expectedReturnAt: { gte: startOfDay },
        assignedVehicleId: { not: null }
      },
      select: { assignedVehicleId: true }
    })
  ]);

  const assignedVehicleIds = new Set(todayAssignedVehicles.map(r => r.assignedVehicleId));
  const vehiclesAssignedCount = assignedVehicleIds.size;
  const activeVehiclesCount = vehicles.filter(v => v.isActive).length;
  const vehiclesAvailableCount = Math.max(0, activeVehiclesCount - vehiclesAssignedCount);

  const resources = vehicles.map(v => ({ 
    id: v.id, 
    name: v.plateNumber ? `${v.name} (${v.plateNumber})` : v.name,
    isAvailable: !assignedVehicleIds.has(v.id)
  }));
  const employeeOptions = personnelList.map(p => ({ id: p.id, name: p.fullName, position: p.position }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">Vehicle Scheduling</h1>
          <p className="text-sm text-muted-foreground">
            Request official vehicle use and track the admin assignment status.
          </p>
        </div>
        {isAdmin && (
          <Button asChild variant="outline">
            <Link href="/vehicle-requests/admin">
              <ShieldCheck className="h-4 w-4" />
              Admin Management
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-emerald-800 dark:text-emerald-400 font-medium">Vehicles Available</CardDescription>
            <CardTitle className="text-3xl text-emerald-900 dark:text-emerald-50">{vehiclesAvailableCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardDescription className="font-medium">Vehicles Assigned</CardDescription>
            <CardTitle className="text-3xl">{vehiclesAssignedCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardDescription className="font-medium">Yearly Trips</CardDescription>
            <CardTitle className="text-3xl">{yearlyTrips}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-amber-800 dark:text-amber-400 font-medium">Pending Requests</CardDescription>
            <CardTitle className="text-3xl text-amber-900 dark:text-amber-50">{pendingRequests}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-blue-800 dark:text-blue-400 font-medium">Upcoming Trips</CardDescription>
            <CardTitle className="text-3xl text-blue-900 dark:text-blue-50">{upcomingTrips}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-semibold text-lg">Vehicle Status</h3>
          <div className="grid gap-3 max-h-[600px] overflow-y-auto pr-2 pb-4">
            {vehicles.map((vehicle) => {
              const isAssigned = assignedVehicleIds.has(vehicle.id);
              return (
                <Card key={vehicle.id} className="shadow-sm">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base truncate" title={vehicle.name}>{vehicle.name}</CardTitle>
                      {isAssigned ? (
                        <span className="flex h-2 w-2 rounded-full bg-red-500 mt-1 flex-shrink-0" />
                      ) : (
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                      )}
                    </div>
                    {vehicle.plateNumber && (
                      <CardDescription className="text-xs">{vehicle.plateNumber}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs text-muted-foreground">
                      {isAssigned ? 'Assigned Today' : 'Available'}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-3 h-[700px] shadow-sm rounded-xl overflow-hidden border">
          <SchedulingClient 
            userId={user.id} 
            defaultType="VEHICLE" 
            isAdmin={isAdmin} 
            resources={resources} 
            employees={employeeOptions}
          />
        </div>
      </div>

      {!user.personnelId ? (
        <Card>
          <CardHeader>
            <CardTitle>Employee Link Required</CardTitle>
            <CardDescription>
              Your account must be linked to a real employee record before submitting vehicle requests.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <VehicleRequestForm
          personnel={personnel}
          requesterPersonnelId={user.personnelId}
          specialOrders={specialOrders}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>My Vehicle Requests</CardTitle>
          <CardDescription>
            Requests you submitted as the main requesting employee.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              No vehicle use requests have been submitted from your account yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Joining Employees</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        {formatRequestSchedule(request)}
                      </div>
                    </TableCell>
                    <TableCell>{request.destination}</TableCell>
                    <TableCell className="max-w-sm">{request.purpose}</TableCell>
                    <TableCell>
                      {request.passengers.length > 0
                        ? request.passengers.map((passenger) => passenger.personnel.fullName).join(", ")
                        : "None"}
                    </TableCell>
                    <TableCell>{formatVehicleLabel(request.assignedVehicle)}</TableCell>
                    <TableCell>
                      <VehicleRequestStatusBadge status={request.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/vehicle-requests/${request.id}/print`}>
                            <FileText className="h-4 w-4" />
                            Print
                          </Link>
                        </Button>
                        {!["REJECTED", "CANCELLED"].includes(request.status) && (
                          <form action={cancelVehicleRequestAction.bind(null, request.id)}>
                            <Button size="sm" variant="ghost" type="submit">
                              Cancel
                            </Button>
                          </form>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
