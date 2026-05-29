"use server";

import { db } from "@/lib/db";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { ActivityType } from "@prisma/client";
import Holidays from "date-holidays";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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
        gte: start,
        lte: end
      },
      NOT: [
        {
          description: {
            contains: "[IOMS_HIDE_FROM_CALENDAR]"
          }
        },
        {
          description: {
            contains: "[IOMS_HIDE_ROOM_FROM_CALENDAR]"
          }
        },
        {
          description: {
            contains: "[IOMS_HIDE_CONVOCATION_FROM_CALENDAR]"
          }
        }
      ]
    },
    include: {
      personnel: true,
      involvedPersonnel: true,
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

export async function createCalendarActivityAction(formData: FormData) {
  const type = formData.get("type") as ActivityType;
  const title = formData.get("title") as string;
  const soNumber = formData.get("soNumber") as string | null;
  const description = formData.get("description") as string | null;
  const startDateStr = formData.get("startDate") as string;
  const endDateStr = formData.get("endDate") as string | null;
  const location = formData.get("location") as string | null;
  const personnelId = formData.get("personnelId") as string | null;
  
  // involvedPersonnelIds might be sent as a JSON array string if there are multiple
  const involvedPersonnelStr = formData.get("involvedPersonnelIds") as string | null;
  let involvedPersonnelIds: string[] = [];
  if (involvedPersonnelStr) {
    try {
      involvedPersonnelIds = JSON.parse(involvedPersonnelStr);
    } catch {
      // fallback if it's a single comma-separated string
      involvedPersonnelIds = involvedPersonnelStr.split(",").map(s => s.trim()).filter(Boolean);
    }
  }

  const soFile = formData.get("soFile") as File | null;
  let soFileUrl: string | undefined;

  if (soFile && soFile.size > 0) {
    const bytes = await soFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${soFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const uploadDir = path.join(process.cwd(), "public/uploads/so");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, fileName), buffer);
    soFileUrl = `/uploads/so/${fileName}`;
  }

  const startDate = new Date(startDateStr);
  const endDate = endDateStr ? new Date(endDateStr) : startDate;

  await db.calendarActivity.create({
    data: {
      type,
      title,
      soNumber,
      description,
      startDate,
      endDate,
      location,
      personnelId,
      soFileUrl,
      involvedPersonnel: {
        connect: involvedPersonnelIds.map(id => ({ id }))
      }
    }
  });
}

export async function updateCalendarActivityAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) throw new Error("Activity ID is required");

  const type = formData.get("type") as ActivityType;
  const title = formData.get("title") as string;
  const soNumber = formData.get("soNumber") as string | null;
  const description = formData.get("description") as string | null;
  const startDateStr = formData.get("startDate") as string;
  const endDateStr = formData.get("endDate") as string | null;
  const location = formData.get("location") as string | null;
  const personnelId = formData.get("personnelId") as string | null;
  
  const involvedPersonnelStr = formData.get("involvedPersonnelIds") as string | null;
  let involvedPersonnelIds: string[] = [];
  if (involvedPersonnelStr) {
    try {
      involvedPersonnelIds = JSON.parse(involvedPersonnelStr);
    } catch {
      involvedPersonnelIds = involvedPersonnelStr.split(",").map(s => s.trim()).filter(Boolean);
    }
  }

  const soFile = formData.get("soFile") as File | null;
  let soFileUrl: string | undefined;

  if (soFile && soFile.size > 0) {
    const bytes = await soFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${soFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const uploadDir = path.join(process.cwd(), "public/uploads/so");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, fileName), buffer);
    soFileUrl = `/uploads/so/${fileName}`;
  }

  const startDate = new Date(startDateStr);
  const endDate = endDateStr ? new Date(endDateStr) : startDate;

  await db.calendarActivity.update({
    where: { id },
    data: {
      type,
      title,
      soNumber,
      description,
      startDate,
      endDate,
      location,
      personnelId,
      ...(soFileUrl && { soFileUrl }),
      involvedPersonnel: {
        set: involvedPersonnelIds.map(id => ({ id }))
      }
    }
  });
}

export async function deleteCalendarActivityAction(id: string) {
  if (!id) throw new Error("Activity ID is required");
  await db.calendarActivity.delete({
    where: { id }
  });
}
