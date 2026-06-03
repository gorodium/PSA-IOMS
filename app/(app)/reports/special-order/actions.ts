"use server";

import { db as prisma } from "@/lib/db";
import { LocationType, MatchStatus, ActivityType } from "@prisma/client";
import Papa from "papaparse";
import { revalidatePath } from "next/cache";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1V5-jL9_AxVosbPslGNF56XiUbuUOXhcA/export?format=csv&gid=1270341224";

export interface ParsedSO {
  referenceNo: string;
  soNumber: string;
  assignedDate: string;
  activityDate: string;
  purpose: string;
  destination: string;
  remarks: string;
  status: string;
  originalNames: string[];
}

export interface PreviewPerson {
  originalName: string;
  normalizedName: string;
  personnelId: string | null;
  matchStatus: MatchStatus;
  isTravelTagged: boolean;
  dbName?: string;
}

export interface PreviewSO extends ParsedSO {
  locationType: LocationType;
  peoplePreview: PreviewPerson[];
  isNew: boolean;
  activityDateString?: string;
}

export interface SyncResult {
  previews: PreviewSO[];
  totalRows: number;
  unmatchedCount: number;
}

// Helpers
function normalizeName(name: string) {
  return name.toLowerCase().replace(/[^a-z\s]/g, '').trim().replace(/\s+/g, ' ');
}

function determineLocationType(destination: string): LocationType {
  const destLower = destination.toLowerCase();
  if (!destLower) return LocationType.UNKNOWN;
  if (destLower.includes("psa") || destLower.includes("office") || destLower.includes("training room")) {
    // Some external venues have "training room", so need to be careful.
    if (destLower.includes("misamis oriental") && destLower.includes("training")) {
      return LocationType.OFFICE;
    }
  }
  // Fallback to OUTSIDE_OFFICE if there is a destination but it's not the office
  return LocationType.OUTSIDE_OFFICE;
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  // Many formats in sheet: "January 06, 2026", "January 07-09, 2026", "Monday, 5 January 2026"
  // Let's try to extract the first valid date string segment
  // A simple strategy is taking everything up to the first dash if there's a range, or just use JS Date.
  let cleaned = dateStr.split("-")[0].split("(")[0].trim();
  // Strip day of week if present like "Monday,5 January 2026"
  if (cleaned.includes(",")) {
    const parts = cleaned.split(",");
    if (parts.length > 1 && isNaN(parseInt(parts[0]))) {
      cleaned = parts.slice(1).join(",").trim();
    }
  }
  
  const d = new Date(cleaned);
  if (isNaN(d.getTime())) return null;
  return d;
}

function parseDateRanges(dateStr: string | undefined): { startDate: Date; endDate: Date }[] {
  if (!dateStr) return [];
  let s = dateStr.replace(/\(.*?\)/g, "").trim();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  let currentYear = new Date().getFullYear();
  let currentMonth = "";
  
  const tokens = s.match(/[A-Za-z]+|\d{1,4}|-/g);
  if (!tokens) return [];

  for (let i = tokens.length - 1; i >= 0; i--) {
    let t = tokens[i];
    if (/^\d{4}$/.test(t)) {
      currentYear = parseInt(t);
    } else if (months.some(m => m.toLowerCase() === t.toLowerCase())) {
      currentMonth = t;
    }
  }

  currentYear = new Date().getFullYear();
  currentMonth = "";
  let ranges: { startDate: Date; endDate: Date }[] = [];
  
  let pendingStart: Date | null = null;
  let expectingRangeEnd = false;

  for (let i = 0; i < tokens.length; i++) {
    let t = tokens[i];
    if (/^\d{4}$/.test(t)) {
      currentYear = parseInt(t);
    } else if (months.some(m => m.toLowerCase() === t.toLowerCase())) {
      currentMonth = t;
    } else if (t === '-') {
      expectingRangeEnd = true;
    } else if (/^\d{1,2}$/.test(t)) {
      if (currentMonth) {
        const day = parseInt(t);
        const d = new Date(`${currentMonth} ${day}, ${currentYear}`);
        
        if (expectingRangeEnd && pendingStart) {
          ranges.push({ startDate: pendingStart, endDate: d });
          pendingStart = null;
          expectingRangeEnd = false;
        } else {
          if (pendingStart && !expectingRangeEnd) {
             ranges.push({ startDate: pendingStart, endDate: pendingStart });
          }
          pendingStart = d;
        }
      }
    }
  }
  
  if (pendingStart && !expectingRangeEnd) {
     ranges.push({ startDate: pendingStart, endDate: pendingStart });
  }

  return ranges.filter(r => !isNaN(r.startDate.getTime()) && !isNaN(r.endDate.getTime()));
}

function formatReferenceNumber(ref: string | undefined): string | undefined {
  if (!ref) return ref;
  // Matches trailing digits and pads them to 3 characters
  return ref.replace(/(\d+)$/, (match) => match.padStart(3, '0'));
}

function streamlineDateString(input: string | undefined): string {
  if (!input) return "";

  let s = input.trim();

  // Normalize spaces
  s = s.replace(/\s+/g, ' ');

  // Standardize " - " to "-" when between numbers (e.g. 01 - 05 -> 01-05)
  // But leave spaces if between different months (e.g. May 01, 2026 - June 01, 2026)
  s = s.replace(/(\d{1,2})\s*-\s*(\d{1,2})/g, "$1-$2");

  // Fix inverted dates like ",30 April 2026" or "30 April 2026" -> "April 30, 2026" anywhere in the string
  // Use a lookaround or capture group to not swallow preceding characters
  s = s.replace(/(^|[^a-zA-Z0-9])[,]?\s*(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/gi, "$1$3 $2, $4");

  // Titlecase months
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  months.forEach(month => {
    const regex = new RegExp(`\\b${month}\\b`, 'gi');
    s = s.replace(regex, month);
  });

  // Zero-pad single digit days: e.g. "May 1" -> "May 01"
  s = s.replace(/\b(\d)\b(?!\d{3})/g, "0$1");

  // Remove weekdays
  s = s.replace(/\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)s?\b/gi, "");

  // Titlecase anything in parentheses and simplify "any X days"
  s = s.replace(/\((.*?)\)/g, (match, content) => {
    let inner = content.toLowerCase();
    
    // If after removing weekdays, the parenthesis is just "every and", "evey", "and", etc, return empty string
    if (/^\s*(every|evey|all|any)?\s*(and|or|,|\s)*\s*(every|evey|all|any)?\s*(and|or|,|\s)*\s*$/i.test(inner)) {
      return "";
    }

    const anyDaysMatch = inner.match(/any (\d+) days/);
    if (anyDaysMatch) {
      inner = `Any ${anyDaysMatch[1]} Days`;
    } else {
      inner = inner.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    return `(${inner})`;
  });

  // Clean up any double spaces caused by removals
  s = s.replace(/\s+/g, ' ').trim();
  
  // Clean up leading commas
  s = s.replace(/^,\s*/, '');

  return s;
}

export async function fetchSpecialOrdersPreview(): Promise<{ success: boolean; data?: SyncResult; error?: string }> {
  try {
    const response = await fetch(SHEET_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`Failed to fetch sheet: ${response.statusText}`);
    
    const csvText = await response.text();
    
    const parsed = Papa.parse(csvText, {
      skipEmptyLines: true,
    });

    const rows = parsed.data as string[][];
    if (rows.length < 2) throw new Error("Sheet is empty or missing headers");

    // Row 10 is the header (index 9) based on inspection
    let headerIndex = -1;
    for (let i = 0; i < Math.min(20, rows.length); i++) {
      if (rows[i][0] === "DATE" && rows[i][1] === "REFERENCE NO.") {
        headerIndex = i;
        break;
      }
    }

    if (headerIndex === -1) throw new Error("Could not find standard headers in sheet.");

    const dataRows = rows.slice(headerIndex + 1);
    
    // Fetch all personnel to do fuzzy matching
    const allPersonnel = await prisma.personnel.findMany({
      select: { id: true, fullName: true, locationStatus: true, travelStartDate: true, travelEndDate: true },
      where: { isActive: true }
    });

    // Fetch existing SOs to diff
    const existingSOs = await prisma.specialOrder.findMany({
      select: { referenceNo: true, soNumber: true, purpose: true }
    });
    
    const previews: PreviewSO[] = [];
    let unmatchedCount = 0;

    for (const row of dataRows) {
      const assignedDate = row[0]?.trim() || "";
      let referenceNo = row[1]?.trim() || "";
      if (referenceNo) {
        referenceNo = formatReferenceNumber(referenceNo) || "";
      }
      
      const soYear = row[3]?.trim();
      let soSeq = row[4]?.trim();
      if (soSeq) {
        soSeq = soSeq.padStart(3, '0');
      }
      const soNumber = (soYear && soSeq) ? `${soYear}-${soSeq}` : (soYear || soSeq || "");

      const namesStr = row[5]?.trim();
      const purpose = row[6]?.trim();
      const destination = row[7]?.trim();
      const activityDateString = streamlineDateString(row[8]);
      const status = row[9]?.trim();
      const remarks = row[10]?.trim();

      if (!referenceNo && !purpose && !namesStr) continue;

      const originalNames = namesStr ? namesStr.split("\n").map(n => n.trim()).filter(n => n) : [];
      const locationType = determineLocationType(destination);
      const isOutside = locationType === LocationType.OUTSIDE_OFFICE;

      const peoplePreview: PreviewPerson[] = [];

      for (const rawName of originalNames) {
        if (rawName.toUpperCase().includes("ALL CONCERNED") || rawName.toUpperCase().includes("PERSONNEL")) {
          peoplePreview.push({
            originalName: rawName,
            normalizedName: rawName,
            personnelId: null,
            matchStatus: MatchStatus.CUSTOM,
            isTravelTagged: false,
          });
          continue;
        }

        const normalized = normalizeName(rawName);
        let bestMatch = null;
        
        for (const p of allPersonnel) {
          const normP = normalizeName(p.fullName);
          if (normP === normalized || normP.includes(normalized) || normalized.includes(normP)) {
            bestMatch = p;
            break;
          }
        }

        if (bestMatch) {
          peoplePreview.push({
            originalName: rawName,
            normalizedName: normalized,
            personnelId: bestMatch.id,
            dbName: bestMatch.fullName,
            matchStatus: MatchStatus.MATCHED,
            isTravelTagged: isOutside,
          });
        } else {
          peoplePreview.push({
            originalName: rawName,
            normalizedName: normalized,
            personnelId: null,
            matchStatus: MatchStatus.UNMATCHED,
            isTravelTagged: false,
          });
          unmatchedCount++;
        }
      }

      const isNew = !existingSOs.some(so => so.referenceNo === referenceNo && so.purpose === purpose);

      previews.push({
        referenceNo,
        soNumber,
        assignedDate,
        purpose,
        destination,
        remarks,
        status,
        originalNames,
        locationType,
        peoplePreview,
        isNew,
        activityDate: activityDateString,
        activityDateString: activityDateString,
      });
    }

    return {
      success: true,
      data: {
        previews,
        totalRows: previews.length,
        unmatchedCount
      }
    };

  } catch (error: any) {
    console.error("Fetch error:", error);
    return { success: false, error: error.message || "Unknown error occurred" };
  }
}

export async function commitSpecialOrders(previews: PreviewSO[]) {
  try {
    let newCount = 0;
    let updatedCount = 0;
    
    for (const preview of previews) {
      const actDateObj = parseDate(preview.activityDate);
      const assignDateObj = parseDate(preview.assignedDate);
      const actDateRanges = parseDateRanges(preview.activityDateString);
      if (actDateRanges.length === 0 && actDateObj) {
        actDateRanges.push({ startDate: actDateObj, endDate: actDateObj });
      }

      // Upsert SO
      const so = await prisma.specialOrder.upsert({
        where: {
          referenceNo_soNumber_purpose: {
            referenceNo: preview.referenceNo || "",
            soNumber: preview.soNumber || "",
            purpose: preview.purpose || ""
          }
        },
        update: {
          assignedDate: assignDateObj,
          activityDate: actDateRanges.length > 0 ? actDateRanges[0].startDate : null,
          destination: preview.destination,
          remarks: preview.remarks,
          status: preview.status,
          locationType: preview.locationType,
          activityDateString: preview.activityDateString
        },
        create: {
          referenceNo: preview.referenceNo || "",
          soNumber: preview.soNumber || "",
          purpose: preview.purpose || "",
          assignedDate: assignDateObj,
          activityDate: actDateRanges.length > 0 ? actDateRanges[0].startDate : null,
          activityDateString: preview.activityDateString,
          destination: preview.destination,
          remarks: preview.remarks,
          status: preview.status,
          locationType: preview.locationType
        }
      });

      if (preview.isNew) newCount++; else updatedCount++;

      // Delete existing people and recreate to keep it simple
      await prisma.specialOrderPerson.deleteMany({
        where: { specialOrderId: so.id }
      });

      const personnelIds: string[] = [];

      for (const person of preview.peoplePreview) {
        await prisma.specialOrderPerson.create({
          data: {
            specialOrderId: so.id,
            originalName: person.originalName,
            normalizedName: person.normalizedName,
            personnelId: person.personnelId,
            matchStatus: person.matchStatus,
            isTravelTagged: person.isTravelTagged
          }
        });

        if (person.personnelId) personnelIds.push(person.personnelId);
        
        // Update travel status if matched and tagged
        if (person.isTravelTagged && person.personnelId && actDateRanges.length > 0) {
           await prisma.personnel.update({
             where: { id: person.personnelId },
             data: {
               locationStatus: "on_travel",
               travelDestination: preview.destination,
               travelStartDate: actDateRanges[0].startDate,
               travelEndDate: actDateRanges[actDateRanges.length - 1].endDate
             }
           });
        }
      }

      // Sync Calendar Activity
      if (actDateRanges.length > 0 && preview.purpose) {
        // Show ONLY SO Number on Calendar, fallback to Purpose if no SO Number
        const title = preview.soNumber ? `SO Number: ${preview.soNumber}` : `SO: ${preview.purpose}`;
        const description = `Purpose: ${preview.purpose}\n\n${preview.remarks || ""}`;
        
        // Delete all calendar activities previously generated for this SO Number
        if (preview.soNumber) {
          await prisma.calendarActivity.deleteMany({
            where: { soNumber: preview.soNumber }
          });
        } else if (so.calendarActivityId) {
          await prisma.calendarActivity.deleteMany({
            where: { id: so.calendarActivityId }
          }).catch(() => {});
        }
        
        let firstCalActId: string | null = null;
        
        for (const range of actDateRanges) {
          const isTraining = preview.purpose?.toLowerCase().includes("taining") || preview.purpose?.toLowerCase().includes("training");
          const isOutsideOffice = preview.locationType === LocationType.OUTSIDE_OFFICE;
          
          const mainType = isTraining ? ActivityType.TRAINING : (isOutsideOffice ? ActivityType.TRAVEL : ActivityType.EVENT);
          const additionalTypes: ActivityType[] = [];
          if (isTraining && isOutsideOffice) {
            additionalTypes.push(ActivityType.TRAVEL);
          }

          const calAct = await prisma.calendarActivity.create({
            data: {
              type: mainType,
              additionalTypes,
              title,
              soNumber: preview.soNumber,
              startDate: range.startDate,
              endDate: range.endDate,
              location: preview.destination,
              description,
              involvedPersonnel: {
                connect: personnelIds.map(id => ({ id }))
              }
            }
          });
          if (!firstCalActId) {
            firstCalActId = calAct.id;
          }
        }
          
        await prisma.specialOrder.update({
          where: { id: so.id },
          data: { calendarActivityId: firstCalActId }
        });
      }
    }

    // Now delete any existing SOs that are no longer in the sheet
    const existingSOs = await prisma.specialOrder.findMany();
    const previewKeys = new Set(previews.map(p => `${p.referenceNo || ""}_${p.soNumber || ""}_${p.purpose || ""}`));
    
    let deletedCount = 0;
    for (const existing of existingSOs) {
      const key = `${existing.referenceNo || ""}_${existing.soNumber || ""}_${existing.purpose || ""}`;
      if (!previewKeys.has(key)) {
        // Delete personnel mapping
        await prisma.specialOrderPerson.deleteMany({
          where: { specialOrderId: existing.id }
        });
        
        // Delete SO
        await prisma.specialOrder.delete({
          where: { id: existing.id }
        });
        
        // If it had a calendar activity, delete any associated by soNumber
        if (existing.soNumber) {
          await prisma.calendarActivity.deleteMany({
            where: { soNumber: existing.soNumber }
          }).catch(() => {});
        } else if (existing.calendarActivityId) {
          await prisma.calendarActivity.delete({
            where: { id: existing.calendarActivityId }
          }).catch(() => {});
        }
        
        deletedCount++;
      }
    }

    revalidatePath("/reports/special-order");
    revalidatePath("/calendar");
    
    return { success: true, newCount, updatedCount, deletedCount };
  } catch (error: any) {
    console.error("Commit error:", error);
    return { success: false, error: error.message || "Unknown error" };
  }
}
