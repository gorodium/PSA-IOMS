import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get("ref");
  
  if (!ref) {
    return new NextResponse("Missing reference number", { status: 400 });
  }

  // Use the API key provided or fallback to environment variable
  const API_KEY = process.env.GOOGLE_DRIVE_API_KEY || "AIzaSyAoQPbVBmmYEN6tkQU_m85c76WIMQIK4SU";
  const FOLDER_ID = "1i-Ku7fVaw1kjRKD7X60qV0VsEF4or8sP";

  let searchQueryRef = ref;

  // If the ref looks like an SO number (e.g. 2026-196) rather than a Reference No (e.g. 26PSO43-TO-196),
  // look it up in the database to get the actual Reference No for the Google Drive search.
  try {
    const so = await db.specialOrder.findFirst({
      where: {
        OR: [
          { soNumber: ref },
          { referenceNo: ref }
        ]
      },
      select: { referenceNo: true }
    });
    if (so && so.referenceNo) {
      searchQueryRef = so.referenceNo;
    }
  } catch (dbError) {
    console.error("Failed to lookup referenceNo in DB:", dbError);
  }

  // Build the search query using the resolved Reference No
  const query = `'${FOLDER_ID}' in parents and name contains '${searchQueryRef}' and mimeType='application/pdf'`;
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,webViewLink)&key=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.files && data.files.length > 0) {
      // Redirect directly to the PDF viewer in Google Drive
      return NextResponse.redirect(data.files[0].webViewLink);
    } else {
      return new NextResponse(`PDF for Reference "${ref}" not found in the Google Drive folder.`, { status: 404 });
    }
  } catch (error) {
    return new NextResponse("Failed to query Google Drive API", { status: 500 });
  }
}
