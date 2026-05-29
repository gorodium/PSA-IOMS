import Link from "next/link";
import { CalendarDays, FileText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VehicleRequestForm } from "@/components/vehicle/VehicleRequestForm";
import { VehicleRequestStatusBadge } from "@/components/vehicle/VehicleRequestStatusBadge";
import { cancelVehicleRequestAction } from "@/app/(app)/vehicle-requests/actions";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatRequestSchedule, formatVehicleLabel, isVehicleAdmin } from "@/lib/vehicle-scheduling";

export const dynamic = "force-dynamic";

export default async function VehicleRequestsPage() {
  const user = await requireUser();
  const isAdmin = isVehicleAdmin(user.role);

  const [personnel, requests] = await Promise.all([
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
      : Promise.resolve([])
  ]);

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
        <VehicleRequestForm personnel={personnel} requesterPersonnelId={user.personnelId} />
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
