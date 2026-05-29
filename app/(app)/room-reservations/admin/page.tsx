import Link from "next/link";
import { RoomReservationStatus } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { RoomAvailabilityForm, RoomReservationAdminForm } from "@/components/room/RoomAdminForms";
import { RoomReservationStatusBadge } from "@/components/room/RoomReservationStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  findRoomReservationConflicts,
  formatRoomReservationDates,
  formatRoomReservationType,
  isRoomAdmin
} from "@/lib/room-reservations";

type RoomReservationsAdminPageProps = {
  searchParams?: Promise<{
    status?: string;
    room?: string;
    date?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function RoomReservationsAdminPage({ searchParams }: RoomReservationsAdminPageProps) {
  const [user, params] = await Promise.all([requireUser(), searchParams]);
  if (!isRoomAdmin(user.role)) {
    throw new Error("Only administrators can manage room reservations.");
  }

  const dateFilter = params?.date ? new Date(`${params.date}T00:00:00`) : null;
  const statusFilter =
    params?.status && Object.values(RoomReservationStatus).includes(params.status as RoomReservationStatus)
      ? params.status as RoomReservationStatus
      : null;

  const [rooms, reservations] = await Promise.all([
    db.room.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" }
    }),
    db.roomReservation.findMany({
      where: {
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(params?.room && params.room !== "ALL" ? { roomId: params.room } : {}),
        ...(dateFilter
          ? {
              startDate: { lte: dateFilter },
              endDate: { gte: dateFilter }
            }
          : {})
      },
      include: {
        room: true,
        requester: true
      },
      orderBy: [{ startDate: "desc" }, { createdAt: "desc" }]
    })
  ]);

  const conflictsByReservation = new Map<string, number>();
  for (const reservation of reservations) {
    const conflicts = await findRoomReservationConflicts({
      roomId: reservation.roomId,
      reservationType: reservation.reservationType,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      halfDaySlot: reservation.halfDaySlot,
      excludeReservationId: reservation.id
    });
    conflictsByReservation.set(reservation.id, conflicts.length);
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
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">Room Reservation Management</h1>
        <p className="text-sm text-muted-foreground">
          Review requests, manage room availability, and prevent overlapping approved reservations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Official Rooms</CardTitle>
          <CardDescription>
            Only the four official rooms are available in this module.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          {rooms.map((room) => (
            <RoomAvailabilityForm key={room.id} room={room} />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Room Reservations</CardTitle>
          <CardDescription>
            Filter requests, review conflicts, and approve or reject reservations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="grid gap-3 md:grid-cols-[180px_220px_180px_auto]">
            <Select name="status" defaultValue={params?.status ?? "ALL"} aria-label="Filter by status">
              <option value="ALL">All statuses</option>
              {Object.values(RoomReservationStatus).map((status) => (
                <option key={status} value={status}>
                  {status.replaceAll("_", " ")}
                </option>
              ))}
            </Select>
            <Select name="room" defaultValue={params?.room ?? "ALL"} aria-label="Filter by room">
              <option value="ALL">All rooms</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </Select>
            <Input name="date" type="date" defaultValue={params?.date ?? ""} aria-label="Filter by date" />
            <div className="flex gap-2">
              <Button type="submit" variant="outline">Apply</Button>
              <Button asChild variant="ghost">
                <Link href="/room-reservations/admin">Clear</Link>
              </Button>
            </div>
          </form>

          {reservations.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              No room reservations match the current filters.
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
                  <TableHead>Conflicts</TableHead>
                  <TableHead className="min-w-[440px]">Admin Review</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => {
                  const conflictCount = conflictsByReservation.get(reservation.id) ?? 0;

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
                        {!reservation.room.isAvailable && (
                          <p className="text-xs text-amber-700">
                            Unavailable: {reservation.room.unavailableReason || "No reason provided"}
                          </p>
                        )}
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
                      <TableCell>
                        {conflictCount > 0 ? (
                          <p className="rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
                            {conflictCount} approved overlapping reservation{conflictCount === 1 ? "" : "s"}
                          </p>
                        ) : (
                          <span className="text-sm text-muted-foreground">No approved conflicts</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <RoomReservationAdminForm
                          reservationId={reservation.id}
                          status={reservation.status}
                          rejectionReason={reservation.rejectionReason}
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
