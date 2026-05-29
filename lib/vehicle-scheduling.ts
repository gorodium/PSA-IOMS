import "server-only";

import { endOfDay, format, isSameDay, startOfDay } from "date-fns";
import { ActivityType, VehicleRequestStatus, type VehicleRequest } from "@prisma/client";
import { db } from "@/lib/db";

export const vehicleCalendarHideMarker = "[IOMS_HIDE_FROM_CALENDAR]";

const scheduledStatuses: VehicleRequestStatus[] = [
  VehicleRequestStatus.APPROVED,
  VehicleRequestStatus.ASSIGNED
];

export function isVehicleAdmin(role: string | null | undefined) {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}

export function combineTravelDateTime(travelDate: string, time: string | null | undefined) {
  if (!time) {
    return null;
  }

  return new Date(`${travelDate}T${time}:00`);
}

export function normalizeTravelDate(travelDate: string) {
  return startOfDay(new Date(`${travelDate}T00:00:00`));
}

export function formatVehicleLabel(vehicle: { name: string; plateNumber: string | null } | null | undefined) {
  if (!vehicle) {
    return "Pending assignment";
  }

  return vehicle.plateNumber ? `${vehicle.name} (${vehicle.plateNumber})` : vehicle.name;
}

function rangesOverlap(
  firstStart: Date,
  firstEnd: Date,
  secondStart: Date,
  secondEnd: Date
) {
  return firstStart < secondEnd && secondStart < firstEnd;
}

function conflictsOnDate(
  request: Pick<VehicleRequest, "travelDate" | "departureAt" | "expectedReturnAt">,
  travelDate: Date,
  departureAt: Date | null,
  expectedReturnAt: Date | null
) {
  if (!isSameDay(request.travelDate, travelDate)) {
    return false;
  }

  if (departureAt && expectedReturnAt && request.departureAt && request.expectedReturnAt) {
    return rangesOverlap(departureAt, expectedReturnAt, request.departureAt, request.expectedReturnAt);
  }

  return true;
}

export async function findVehicleConflicts(input: {
  vehicleId: string;
  travelDate: Date;
  departureAt?: Date | null;
  expectedReturnAt?: Date | null;
  excludeRequestId?: string | null;
}) {
  const conflicts = await db.vehicleRequest.findMany({
    where: {
      assignedVehicleId: input.vehicleId,
      status: { in: scheduledStatuses },
      travelDate: {
        gte: startOfDay(input.travelDate),
        lte: endOfDay(input.travelDate)
      },
      ...(input.excludeRequestId ? { id: { not: input.excludeRequestId } } : {})
    },
    include: {
      requester: true,
      assignedVehicle: true
    },
    orderBy: { travelDate: "asc" }
  });

  return conflicts.filter((request) =>
    conflictsOnDate(
      request,
      input.travelDate,
      input.departureAt ?? null,
      input.expectedReturnAt ?? null
    )
  );
}

export async function getVehicleAvailability(input: {
  travelDate: Date;
  departureAt?: Date | null;
  expectedReturnAt?: Date | null;
  excludeRequestId?: string | null;
}) {
  const vehicles = await db.vehicle.findMany({
    where: { isActive: true },
    orderBy: [{ name: "asc" }, { plateNumber: "asc" }]
  });

  const availability = await Promise.all(
    vehicles.map(async (vehicle) => {
      const conflicts = await findVehicleConflicts({
        vehicleId: vehicle.id,
        travelDate: input.travelDate,
        departureAt: input.departureAt,
        expectedReturnAt: input.expectedReturnAt,
        excludeRequestId: input.excludeRequestId
      });

      return {
        vehicle,
        isAvailable: conflicts.length === 0,
        conflicts
      };
    })
  );

  return {
    vehicles,
    availableVehicles: availability.filter((item) => item.isAvailable).map((item) => item.vehicle),
    unavailableVehicles: availability.filter((item) => !item.isAvailable)
  };
}

export async function syncVehicleRequestCalendarEntry(requestId: string) {
  const request = await db.vehicleRequest.findUnique({
    where: { id: requestId },
    include: {
      requester: true,
      assignedVehicle: true,
      passengers: {
        include: {
          personnel: true
        }
      }
    }
  });

  if (!request) {
    return;
  }

  if (!scheduledStatuses.includes(request.status)) {
    if (request.calendarActivityId) {
      await db.calendarActivity.update({
        where: { id: request.calendarActivityId },
        data: {
          description: `${vehicleCalendarHideMarker}\nVehicle request status: ${request.status}`
        }
      });
    }
    return;
  }

  const vehicleLabel = formatVehicleLabel(request.assignedVehicle);
  const description = [
    `Vehicle travel request`,
    `Requester: ${request.requester.fullName}`,
    `Purpose: ${request.purpose}`,
    `Status: ${request.status.replaceAll("_", " ")}`,
    `Vehicle: ${vehicleLabel}`
  ].join("\n");
  const startDate = request.departureAt ?? request.travelDate;
  const endDate = request.expectedReturnAt ?? request.departureAt ?? request.travelDate;
  const passengerIds = request.passengers.map((passenger) => passenger.personnelId);

  const data = {
    type: ActivityType.VEHICLE,
    title: `Vehicle Request: ${request.destination}`,
    soNumber: request.soNumber,
    soFileUrl: request.soFileUrl,
    description,
    startDate,
    endDate,
    location: request.destination,
    personnelId: request.requesterPersonnelId,
    vehicleName: vehicleLabel
  };

  if (request.calendarActivityId) {
    await db.calendarActivity.update({
      where: { id: request.calendarActivityId },
      data: {
        ...data,
        involvedPersonnel: {
          set: passengerIds.map((id) => ({ id }))
        }
      }
    });
    return;
  }

  const activity = await db.calendarActivity.create({
    data: {
      ...data,
      involvedPersonnel: {
        connect: passengerIds.map((id) => ({ id }))
      }
    }
  });
  await db.vehicleRequest.update({
    where: { id: request.id },
    data: { calendarActivityId: activity.id }
  });
}

export function formatRequestSchedule(request: {
  travelDate: Date;
  departureAt: Date | null;
  expectedReturnAt: Date | null;
}) {
  const date = format(request.travelDate, "MMM d, yyyy");
  if (!request.departureAt && !request.expectedReturnAt) {
    return date;
  }

  const departure = request.departureAt ? format(request.departureAt, "h:mm a") : "No departure time";
  const expectedReturn = request.expectedReturnAt ? format(request.expectedReturnAt, "h:mm a") : "No return time";
  return `${date}, ${departure} - ${expectedReturn}`;
}
