import Link from "next/link";
import { CalendarDays, ShieldCheck } from "lucide-react";
import { cancelRoomReservationAction } from "@/app/(app)/room-reservations/actions";
import { RoomReservationForm } from "@/components/room/RoomReservationForm";
import { RoomReservationStatusBadge } from "@/components/room/RoomReservationStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatRoomReservationDates, formatRoomReservationType, isRoomAdmin } from "@/lib/room-reservations";

export const dynamic = "force-dynamic";

export default async function RoomReservationsPage() {
  const user = await requireUser();
  const isAdmin = isRoomAdmin(user.role);

  const [rooms, reservations] = await Promise.all([
    db.room.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" }
    }),
    user.personnelId
      ? db.roomReservation.findMany({
          where: { requesterPersonnelId: user.personnelId },
          include: {
            room: true,
            requester: true
          },
          orderBy: [{ createdAt: "desc" }]
        })
      : Promise.resolve([])
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">Room Reservation</h1>
          <p className="text-sm text-muted-foreground">
            Reserve official rooms for meetings, trainings, and work activities.
          </p>
        </div>
        {isAdmin && (
          <Button asChild variant="outline">
            <Link href="/room-reservations/admin">
              <ShieldCheck className="h-4 w-4" />
              Admin Management
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {rooms.map((room) => (
          <Card key={room.id}>
            <CardHeader>
              <CardTitle>{room.name}</CardTitle>
              <CardDescription>
                {room.isAvailable ? "Available for reservation" : `Unavailable${room.unavailableReason ? `: ${room.unavailableReason}` : ""}`}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {!user.personnelId ? (
        <Card>
          <CardHeader>
            <CardTitle>Employee Link Required</CardTitle>
            <CardDescription>
              Your account must be linked to a real employee record before submitting room reservations.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <RoomReservationForm rooms={rooms} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>My Room Reservations</CardTitle>
          <CardDescription>Reservations you submitted as the requesting employee.</CardDescription>
        </CardHeader>
        <CardContent>
          {reservations.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              No room reservations have been submitted from your account yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Booking</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        {formatRoomReservationDates(reservation)}
                      </div>
                    </TableCell>
                    <TableCell>{reservation.room.name}</TableCell>
                    <TableCell>{formatRoomReservationType(reservation.reservationType, reservation.halfDaySlot)}</TableCell>
                    <TableCell className="max-w-sm">{reservation.purpose}</TableCell>
                    <TableCell>
                      <RoomReservationStatusBadge status={reservation.status} />
                    </TableCell>
                    <TableCell>
                      {!["REJECTED", "CANCELLED"].includes(reservation.status) && (
                        <form action={cancelRoomReservationAction.bind(null, reservation.id)}>
                          <Button size="sm" variant="ghost" type="submit">
                            Cancel
                          </Button>
                        </form>
                      )}
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
