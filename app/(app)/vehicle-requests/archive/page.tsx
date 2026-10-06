import Link from "next/link";
import { ArrowLeft, CarFront } from "lucide-react";
import { VehicleRequestStatusBadge } from "@/components/vehicle/VehicleRequestStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatRequestSchedule, formatVehicleLabel, isVehicleAdmin } from "@/lib/vehicle-scheduling";

type VehicleRequestsArchivePageProps = {
  searchParams?: Promise<{
    year?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function VehicleRequestsArchivePage({ searchParams }: VehicleRequestsArchivePageProps) {
  const [user, params] = await Promise.all([requireUser(), searchParams]);
  if (!isVehicleAdmin(user.role)) {
    throw new Error("Only administrators can view the vehicle requests archive.");
  }

  const currentYear = new Date().getFullYear();
  const selectedYear = params?.year ? parseInt(params.year, 10) : currentYear;

  const startOfYear = new Date(selectedYear, 0, 1);
  const endOfYear = new Date(selectedYear, 11, 31, 23, 59, 59, 999);

  const requests = await db.vehicleRequest.findMany({
    where: {
      departureAt: { lte: endOfYear },
      expectedReturnAt: { gte: startOfYear }
    },
    include: {
      requester: true,
      assignedVehicle: true,
      requestedDriver: true,
      passengers: true
    },
    orderBy: [{ departureAt: "desc" }, { createdAt: "desc" }]
  });

  // Generate years (e.g. from 2024 up to current year + 1)
  const availableYears = [];
  for (let y = 2024; y <= currentYear + 1; y++) {
    availableYears.push(y);
  }

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 px-0">
          <Link href="/vehicle-requests">
            <ArrowLeft className="h-4 w-4" />
            Back to vehicle requests
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">Vehicle Requests Archive</h1>
        <p className="text-sm text-muted-foreground">
          View historical vehicle requests by year.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Archived Requests for {selectedYear}</CardTitle>
          <CardDescription>
            Showing all vehicle requests that occurred in the year {selectedYear}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="grid gap-3 md:grid-cols-[200px_auto]">
            <select 
              name="year" 
              defaultValue={selectedYear.toString()} 
              aria-label="Filter by year"
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <Button type="submit" variant="outline">View Year</Button>
            </div>
          </form>

          {requests.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              No vehicle requests found for {selectedYear}.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Requester</TableHead>
                  <TableHead>Destination & Purpose</TableHead>
                  <TableHead>Assigned Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id} id={`vehicle-request-${req.id}`} className="scroll-mt-24 align-top">
                    <TableCell>
                      <p className="font-medium whitespace-nowrap">{formatRequestSchedule(req)}</p>
                      <p className="text-xs text-muted-foreground mt-1">Passengers: {req.passengers.length}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{req.requester.fullName}</p>
                      <p className="text-xs text-muted-foreground">{req.requester.section}</p>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="font-medium">{req.destination}</p>
                      <p className="text-sm text-muted-foreground mt-1">{req.purpose}</p>
                    </TableCell>
                    <TableCell>
                      {req.assignedVehicle ? (
                        <div className="flex items-center gap-2">
                          <CarFront className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="font-medium">{formatVehicleLabel(req.assignedVehicle)}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not assigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {req.requestedDriver ? (
                        <p className="font-medium">{req.requestedDriver.fullName}</p>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not assigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <VehicleRequestStatusBadge status={req.status} />
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
