import Link from "next/link";
import { CalendarDays, ShieldCheck } from "lucide-react";
import { cancelRoomReservationAction } from "@/app/(app)/room-reservations/actions";
import { RoomReservationForm } from "@/components/room/RoomReservationForm";
import { RoomReservationStatusBadge } from "@/components/room/RoomReservationStatusBadge";
import { SchedulingClient } from "@/components/scheduling/SchedulingClient";
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

  const [rooms, personnelList, specialOrders, reservations] = await Promise.all([
    db.room.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" }
    }),
    isAdmin ? db.personnel.findMany({
      where: { isActive: true },
      orderBy: { fullName: "asc" }
    }) : Promise.resolve([]),
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

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  const startOfYear = new Date(startOfDay.getFullYear(), 0, 1);
  const endOfYear = new Date(startOfDay.getFullYear(), 11, 31, 23, 59, 59);

  const [
    yearlyReservations,
    pendingReservations,
    upcomingReservations,
    todayApprovedReservations
  ] = await Promise.all([
    db.roomReservation.count({
      where: {
        startDate: { gte: startOfYear },
        endDate: { lte: endOfYear }
      }
    }),
    db.roomReservation.count({
      where: {
        status: "PENDING"
      }
    }),
    db.roomReservation.count({
      where: {
        status: "APPROVED",
        startDate: { gt: endOfDay }
      }
    }),
    db.roomReservation.findMany({
      where: {
        status: "APPROVED",
        startDate: { lte: endOfDay },
        endDate: { gte: startOfDay }
      },
      select: { roomId: true }
    })
  ]);

  const occupiedRoomIds = new Set(todayApprovedReservations.map(r => r.roomId));
  const roomsOccupiedCount = occupiedRoomIds.size;
  const activeRoomsCount = rooms.filter(r => r.isAvailable).length;
  const roomsAvailableCount = Math.max(0, activeRoomsCount - roomsOccupiedCount);

  const resources = rooms.map(r => ({ id: r.id, name: r.name, isAvailable: r.isAvailable }));
  const employeeOptions = personnelList.map(p => ({ id: p.id, name: p.fullName }));

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-emerald-800 dark:text-emerald-400 font-medium">Rooms Available</CardDescription>
            <CardTitle className="text-3xl text-emerald-900 dark:text-emerald-50">{roomsAvailableCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardDescription className="font-medium">Rooms Occupied</CardDescription>
            <CardTitle className="text-3xl">{roomsOccupiedCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardDescription className="font-medium">Yearly Reservations</CardDescription>
            <CardTitle className="text-3xl">{yearlyReservations}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-amber-800 dark:text-amber-400 font-medium">Pending Approval</CardDescription>
            <CardTitle className="text-3xl text-amber-900 dark:text-amber-50">{pendingReservations}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-blue-800 dark:text-blue-400 font-medium">Upcoming Reservations</CardDescription>
            <CardTitle className="text-3xl text-blue-900 dark:text-blue-50">{upcomingReservations}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-semibold text-lg">Room Status</h3>
          <div className="grid gap-3 max-h-[600px] overflow-y-auto pr-2 pb-4">
            {rooms.map((room) => {
              const isOccupied = occupiedRoomIds.has(room.id);
              return (
                <Card key={room.id} className={`shadow-sm ${!room.isAvailable ? 'opacity-60' : ''}`}>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{room.name}</CardTitle>
                      {isOccupied ? (
                        <span className="flex h-2 w-2 rounded-full bg-red-500 mt-1" />
                      ) : room.isAvailable ? (
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 mt-1" />
                      ) : (
                        <span className="flex h-2 w-2 rounded-full bg-slate-400 mt-1" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs text-muted-foreground">
                      {isOccupied ? 'Occupied Today' : room.isAvailable ? 'Available' : 'Unavailable'}
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
            defaultType="ROOM" 
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
              Your account must be linked to a real employee record before submitting room reservations.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <RoomReservationForm rooms={rooms} specialOrders={specialOrders} />
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
