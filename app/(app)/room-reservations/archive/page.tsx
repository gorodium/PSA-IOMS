import Link from "next/link";
import { RoomReservationStatus } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { RoomReservationStatusBadge } from "@/components/room/RoomReservationStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  formatRoomReservationDates,
  formatRoomReservationType,
  isRoomAdmin
} from "@/lib/room-reservations";

type RoomReservationsArchivePageProps = {
  searchParams?: Promise<{
    year?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function RoomReservationsArchivePage({ searchParams }: RoomReservationsArchivePageProps) {
  const [user, params] = await Promise.all([requireUser(), searchParams]);
  if (!isRoomAdmin(user.role)) {
    throw new Error("Only administrators can view the room reservations archive.");
  }

  const currentYear = new Date().getFullYear();
  const selectedYear = params?.year ? parseInt(params.year, 10) : currentYear;

  const startOfYear = new Date(selectedYear, 0, 1);
  const endOfYear = new Date(selectedYear, 11, 31, 23, 59, 59, 999);

  const reservations = await db.roomReservation.findMany({
    where: {
      startDate: { lte: endOfYear },
      endDate: { gte: startOfYear }
    },
    include: {
      room: true,
      requester: true
    },
    orderBy: [{ startDate: "desc" }, { createdAt: "desc" }]
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
          <Link href="/room-reservations">
            <ArrowLeft className="h-4 w-4" />
            Back to reservations
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">Room Reservations Archive</h1>
        <p className="text-sm text-muted-foreground">
          View historical room reservations by year.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Archived Reservations for {selectedYear}</CardTitle>
          <CardDescription>
            Showing all room reservations that occurred in the year {selectedYear}.
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

          {reservations.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              No room reservations found for {selectedYear}.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Requester</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => {
                  return (
                    <TableRow key={reservation.id} id={`room-reservation-${reservation.id}`} className="scroll-mt-24 align-top">
                      <TableCell>
                        <p className="font-medium">{formatRoomReservationDates(reservation)}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatRoomReservationType(reservation.reservationType, reservation.halfDaySlot)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{reservation.room.name}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{reservation.requester.fullName}</p>
                        <p className="text-xs text-muted-foreground">{reservation.requester.section}</p>
                      </TableCell>
                      <TableCell className="max-w-sm">
                        <p>{reservation.purpose}</p>
                        {reservation.remarks && <p className="mt-1 text-xs text-muted-foreground">{reservation.remarks}</p>}
                      </TableCell>
                      <TableCell>
                        <RoomReservationStatusBadge status={reservation.status} />
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
