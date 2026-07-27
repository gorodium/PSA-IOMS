"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Car, CalendarDays } from "lucide-react";
import { CalendarEvent } from "@/lib/scheduling-actions";
import { useMemo } from "react";

interface AvailabilityCardsProps {
  events: CalendarEvent[];
}

export function AvailabilityCards({ events }: AvailabilityCardsProps) {
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingEvents = events.filter((e) => new Date(e.start) >= today);

    return {
      rooms: upcomingEvents.filter((e) => e.type === "ROOM").length,
      vehicles: upcomingEvents.filter((e) => e.type === "VEHICLE").length,
      specialOrders: upcomingEvents.filter((e) => e.type === "SPECIAL_ORDER").length,
    };
  }, [events]);

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Room Reservations</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.rooms}</div>
          <p className="text-xs text-muted-foreground">Upcoming</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vehicle Requests</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.vehicles}</div>
          <p className="text-xs text-muted-foreground">Upcoming</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Special Orders</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.specialOrders}</div>
          <p className="text-xs text-muted-foreground">Upcoming</p>
        </CardContent>
      </Card>
    </div>
  );
}
