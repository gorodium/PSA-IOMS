"use server";

import { db } from "@/lib/db";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { ActivityType } from "@prisma/client";
import Holidays from "date-holidays";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

import { revalidatePath } from "next/cache";

export async function getCalendarActivitiesAction(date: Date, view: "day" | "week" | "month") {
  let start, end;
  
  if (view === "day") {
    start = startOfDay(date);
    end = endOfDay(date);
  } else if (view === "week") {
    start = startOfWeek(date, { weekStartsOn: 0 });
    end = endOfWeek(date, { weekStartsOn: 0 });
  } else {
    start = startOfMonth(date);
    end = endOfMonth(date);
  }

  const activities = await db.calendarActivity.findMany({
    where: {
      startDate: {
        lte: end
      },
      AND: [
        {
          OR: [
            { endDate: null },
            { endDate: { gte: start } }
          ]
        },
        {
          OR: [
            { description: null },
            {
              AND: [
                { NOT: { description: { contains: "[IOMS_HIDE_FROM_CALENDAR]" } } },
                { NOT: { description: { contains: "[IOMS_HIDE_ROOM_FROM_CALENDAR]" } } },
                { NOT: { description: { contains: "[IOMS_HIDE_CONVOCATION_FROM_CALENDAR]" } } }
              ]
            }
          ]
        }
      ]
    },
    include: {
      personnel: true,
      involvedPersonnel: true,
      specialOrders: true,
    },
    orderBy: {
      startDate: "asc"
    }
  });

  const hd = new Holidays("PH");
  const yearStart = start.getFullYear();
  const yearEnd = end.getFullYear();
  
  const years = yearStart === yearEnd ? [yearStart] : [yearStart, yearEnd];
  
  const holidayActivities = years
    .flatMap((y) => hd.getHolidays(y) || [])
    .filter((h) => isWithinInterval(new Date(h.date), { start, end }))
    .map((h) => ({
      id: `holiday-${h.date}`,
      type: ActivityType.HOLIDAY,
      additionalTypes: [],
      title: h.name,
      description: h.type === "public" ? "Regular Holiday" : "Special Non-Working Holiday",
      startDate: new Date(h.date),
      endDate: new Date(h.date),
      location: "Philippines",
      personnelId: null,
      vehicleName: null,
      soNumber: null,
      soFileUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      personnel: null,
      involvedPersonnel: [],
    }));

  return [...activities, ...holidayActivities].sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime()
  );
}

export type ActivityPayload = {
  id?: string;
  type: ActivityType;
  additionalTypes?: ActivityType[];
  title: string;
  specialOrderId?: string | null;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
  location?: string | null;
  personnelId?: string | null;
  involvedPersonnelIds?: string[];
};

export async function createCalendarActivityAction(payload: ActivityPayload) {
  const { type, additionalTypes = [], title, specialOrderId, description, startDate: startDateStr, endDate: endDateStr, location, personnelId, involvedPersonnelIds = [] } = payload;
  
  const startDate = new Date(startDateStr);
  const endDate = endDateStr ? new Date(endDateStr) : startDate;

  await db.calendarActivity.create({
    data: {
      type,
      additionalTypes,
      title,
      description,
      startDate,
      endDate,
      location,
      personnelId,
      involvedPersonnel: {
        connect: involvedPersonnelIds.map(id => ({ id }))
      },
      ...(specialOrderId && {
        specialOrders: {
          connect: { id: specialOrderId }
        }
      })
    }
  });

  revalidatePath("/calendar");
}

export async function updateCalendarActivityAction(payload: ActivityPayload) {
  const { id, type, additionalTypes = [], title, specialOrderId, description, startDate: startDateStr, endDate: endDateStr, location, personnelId, involvedPersonnelIds = [] } = payload;
  
  if (!id) throw new Error("Activity ID is required");

  const startDate = new Date(startDateStr);
  const endDate = endDateStr ? new Date(endDateStr) : startDate;

  await db.calendarActivity.update({
    where: { id },
    data: {
      type,
      additionalTypes,
      title,
      description,
      startDate,
      endDate,
      location,
      personnelId,
      involvedPersonnel: {
        set: involvedPersonnelIds.map(id => ({ id }))
      },
      specialOrders: {
        set: specialOrderId ? [{ id: specialOrderId }] : []
      }
    }
  });

  revalidatePath("/calendar");
}

export async function deleteCalendarActivityAction(id: string) {
  if (!id) throw new Error("Activity ID is required");
  await db.calendarActivity.delete({
    where: { id }
  });

  revalidatePath("/calendar");
}
