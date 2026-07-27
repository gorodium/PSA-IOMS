import Link from "next/link";
import { format } from "date-fns";
import { VehicleRequestStatus } from "@prisma/client";
import { ArrowLeft, CarFront, FileText } from "lucide-react";
import { VehicleAdminRequestForm, VehicleCreateForm } from "@/components/vehicle/VehicleAdminForms";
import { VehicleRequestStatusBadge } from "@/components/vehicle/VehicleRequestStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatRequestSchedule, formatVehicleLabel, getVehicleAvailability, isVehicleAdmin } from "@/lib/vehicle-scheduling";

type VehicleRequestsAdminPageProps = {
  searchParams?: Promise<{
    status?: string;
    date?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function VehicleRequestsAdminPage({ searchParams }: VehicleRequestsAdminPageProps) {
  const [user, params] = await Promise.all([requireUser(), searchParams]);
  if (!isVehicleAdmin(user.role)) {
    throw new Error("Only administrators can manage vehicle requests.");
  }

  const dateFilter = params?.date ? new Date(`${params.date}T00:00:00`) : null;
  const statusFilter =
    params?.status && Object.values(VehicleRequestStatus).includes(params.status as VehicleRequestStatus)
      ? params.status as VehicleRequestStatus
      : null;

  const [vehicles, requests, personnel] = await Promise.all([
    db.vehicle.findMany({
      where: { isActive: true },
      orderBy: [{ name: "asc" }, { plateNumber: "asc" }]
    }),
    db.vehicleRequest.findMany({
      where: {
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(dateFilter
          ? {
              travelDate: {
                gte: dateFilter,
                lt: new Date(dateFilter.getTime() + 24 * 60 * 60 * 1000)
              }
            }
          : {})
      },
      include: {
        requester: true,
        assignedVehicle: true,
        passengers: {
          include: {
            personnel: true
          }
        }
      },
      orderBy: [{ travelDate: "desc" }, { createdAt: "desc" }]
    }),
    db.personnel.findMany({
      where: { isActive: true },
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true, position: true, section: true }
    })
  ]);

  const availabilityByRequest = new Map<string, Awaited<ReturnType<typeof getVehicleAvailability>>>();
  for (const request of requests) {
    availabilityByRequest.set(
      request.id,
      await getVehicleAvailability({
        travelDate: request.travelDate,
        departureAt: request.departureAt,
        expectedReturnAt: request.expectedReturnAt,
        excludeRequestId: request.id
      })
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2 px-0">
            <Link href="/vehicle-requests">
              <ArrowLeft className="h-4 w-4" />
              Back to requests
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">Vehicle Request Management</h1>
          <p className="text-sm text-muted-foreground">
            Review requests, assign available real vehicles, and record SO details.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CarFront className="h-5 w-5" />
            Registered Vehicles
          </CardTitle>
          <CardDescription>
            Add only actual office vehicles. No sample vehicles are created automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <VehicleCreateForm />
          {vehicles.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
              No active vehicles are registered yet. Add the office&apos;s actual vehicles before approving or assigning requests.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="rounded-lg border bg-background p-4">
                  <p className="font-medium">{formatVehicleLabel(vehicle)}</p>
                  {vehicle.description && <p className="mt-1 text-sm text-muted-foreground">{vehicle.description}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Vehicle Requests</CardTitle>
          <CardDescription>
            Filter by date or status, then update status, vehicle, and SO details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="grid gap-3 md:grid-cols-[180px_180px_auto]">
            <Select name="status" defaultValue={params?.status ?? "ALL"} aria-label="Filter by status">
              <option value="ALL">All statuses</option>
              {Object.values(VehicleRequestStatus).map((status) => (
                <option key={status} value={status}>
                  {status.replaceAll("_", " ")}
                </option>
              ))}
            </Select>
            <Input name="date" type="date" defaultValue={params?.date ?? ""} aria-label="Filter by travel date" />
            <div className="flex gap-2">
              <Button type="submit" variant="outline">Apply</Button>
              <Button asChild variant="ghost">
                <Link href="/vehicle-requests/admin">Clear</Link>
              </Button>
            </div>
          </form>

          {requests.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              No vehicle requests match the current filters.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-64">Request</TableHead>
                  <TableHead>Requester</TableHead>
                  <TableHead>Employees Joining</TableHead>
                  <TableHead>Current Assignment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="min-w-[760px]">Admin Update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => {
                  const availability = availabilityByRequest.get(request.id);
                  const allVehiclesBooked = Boolean(availability && availability.vehicles.length > 0 && availability.availableVehicles.length === 0);

                  return (
                    <TableRow key={request.id} id={`vehicle-request-${request.id}`} className="scroll-mt-24 align-top">
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{request.destination}</p>
                          <p className="text-sm text-muted-foreground">{formatRequestSchedule(request)}</p>
                          <p className="text-sm">{request.purpose}</p>
                          <Button asChild variant="outline" size="sm" className="mt-2">
                            <Link href={`/vehicle-requests/${request.id}/print`}>
                              <FileText className="h-4 w-4" />
                              Print
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{request.requester.fullName}</p>
                        <p className="text-xs text-muted-foreground">{request.requester.section}</p>
                      </TableCell>
                      <TableCell>
                        {request.passengers.length > 0
                          ? request.passengers.map((passenger) => passenger.personnel.fullName).join(", ")
                          : "None"}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p>{formatVehicleLabel(request.assignedVehicle)}</p>
                          <p className="text-xs text-muted-foreground">
                            SO: {request.soNumber || "Pending assignment"}
                          </p>
                          {request.soFileUrl && (
                            <a href={request.soFileUrl} target="_blank" rel="noreferrer" className="text-xs font-medium text-primary underline">
                              View SO file
                            </a>
                          )}
                          {allVehiclesBooked && (
                            <p className="rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
                              All active vehicles are already scheduled for {format(request.travelDate, "MMM d, yyyy")}.
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <VehicleRequestStatusBadge status={request.status} />
                      </TableCell>
                      <TableCell>
                        <VehicleAdminRequestForm
                          requestId={request.id}
                          status={request.status}
                          assignedVehicleId={request.assignedVehicleId}
                          assignedDriverId={request.requestedDriverId}
                          soNumber={request.soNumber}
                          vehicles={vehicles}
                          personnel={personnel}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
