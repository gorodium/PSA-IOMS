import "server-only";

import { readFile } from "fs/promises";
import path from "path";
import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFPage,
  type PDFFont
} from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { formatProgramDate } from "@/lib/convocation";
import { db } from "@/lib/db";

export type PdfTemplateField = {
  id: string;
  key: string;
  label: string;
  pageNumber: number;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: "Helvetica" | "Times Roman" | "Courier" | "Roboto" | "Open Sans" | "Montserrat" | "Lato" | "Poppins" | "Inter" | "Trajan Pro";
  fontColor?: string;
  isBold: boolean;
  alignment: "left" | "center" | "right";
  maxWidth: number;
  maxHeight?: number;
  wrap: boolean;
  shrinkToFit: boolean;
};

export type PdfTemplateFieldMap = {
  version: 1;
  pageSizes: Array<{
    width: number;
    height: number;
  }>;
  fields: PdfTemplateField[];
};

export const defaultPdfFieldMap = (pageSizes: PdfTemplateFieldMap["pageSizes"]): PdfTemplateFieldMap => ({
  version: 1,
  pageSizes,
  fields: []
});

export const convocationBindingOptions = [
  "programDate",
  "venue",
  "assignedGroup",
  "emcee",
  "openingPrayer",
  "nationalAnthem",
  "bagongPilipinas",
  "flagPledge",
  "lingkodBayanPledge",
  "psaVisionMission",
  "qualityPolicy",
  "welcomeRemarks",
  "message",
  "messagePosition",
  "closingRemarks",
  "zumba",
  "preparedBy"
] as const;

export function parsePdfFieldMap(value: unknown, pageCount = 1): PdfTemplateFieldMap {
  if (!value || typeof value !== "object") {
    return defaultPdfFieldMap(Array.from({ length: pageCount }, () => ({ width: 612, height: 792 })));
  }

  const maybeMap = value as Partial<PdfTemplateFieldMap>;
  return {
    version: 1,
    pageSizes: Array.isArray(maybeMap.pageSizes) && maybeMap.pageSizes.length > 0
      ? maybeMap.pageSizes.map((page) => ({
          width: Number(page.width) || 612,
          height: Number(page.height) || 792
        }))
      : Array.from({ length: pageCount }, () => ({ width: 612, height: 792 })),
    fields: Array.isArray(maybeMap.fields)
      ? maybeMap.fields.map((field) => ({
          id: String(field.id),
          key: String(field.key),
          label: String(field.label),
          pageNumber: Math.max(1, Number(field.pageNumber) || 1),
          x: Number(field.x) || 0,
          y: Number(field.y) || 0,
          fontSize: Math.max(6, Number(field.fontSize) || 11),
          fontFamily: (["Helvetica", "Times Roman", "Courier", "Roboto", "Open Sans", "Montserrat", "Lato", "Poppins", "Inter", "Trajan Pro"] as const).includes(field.fontFamily as PdfTemplateField["fontFamily"]) ? field.fontFamily as PdfTemplateField["fontFamily"] : "Helvetica",
          fontColor: typeof field.fontColor === "string" && /^#[0-9A-Fa-f]{6}$/.test(field.fontColor) ? field.fontColor : undefined,
          isBold: Boolean(field.isBold),
          alignment: field.alignment === "center" || field.alignment === "right" ? field.alignment : "left",
          maxWidth: Math.max(20, Number(field.maxWidth) || 180),
          maxHeight: field.maxHeight ? Math.max(10, Number(field.maxHeight)) : undefined,
          wrap: Boolean(field.wrap),
          shrinkToFit: Boolean(field.shrinkToFit)
        }))
      : []
  };
}

function fontNameFor(field: PdfTemplateField) {
  if (field.fontFamily === "Times Roman") {
    return field.isBold ? StandardFonts.TimesRomanBold : StandardFonts.TimesRoman;
  }

  if (field.fontFamily === "Courier") {
    return field.isBold ? StandardFonts.CourierBold : StandardFonts.Courier;
  }

  return field.isBold ? StandardFonts.HelveticaBold : StandardFonts.Helvetica;
}

function wrapText(value: string, font: PDFFont, fontSize: number, maxWidth: number) {
  const lines: string[] = [];
  const hardLines = value.split('\n');
  for (const hardLine of hardLines) {
    const words = hardLine.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push("");
      continue;
    }
    let current = "";
    for (const word of words) {
      const next = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(next, fontSize) <= maxWidth || !current) {
        current = next;
      } else {
        lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
  }
  return lines.length > 0 ? lines : [value];
}

function shrinkFontSize(value: string, font: PDFFont, initialSize: number, maxWidth: number) {
  let size = initialSize;
  const lines = value.split('\n');
  while (size > 6) {
    let maxLineWidth = 0;
    for (const line of lines) {
      maxLineWidth = Math.max(maxLineWidth, font.widthOfTextAtSize(line, size));
    }
    if (maxLineWidth <= maxWidth) break;
    size -= 0.5;
  }
  return size;
}

function alignedX(page: PDFPage, field: PdfTemplateField, line: string, font: PDFFont, fontSize: number) {
  const textWidth = font.widthOfTextAtSize(line, fontSize);
  if (field.alignment === "center") return field.x + Math.max(0, (field.maxWidth - textWidth) / 2);
  if (field.alignment === "right") return field.x + Math.max(0, field.maxWidth - textWidth);
  return Math.min(field.x, page.getWidth());
}

export async function getConvocationOverlayData(programId: string) {
  const program = await db.convocationProgram.findUnique({
    where: { id: programId },
    include: {
      group: true,
      items: {
        include: { assignedPersonnel: true }
      }
    }
  });

  if (!program) {
    throw new Error("Convocation program could not be found.");
  }

  const itemByKey = new Map(
    program.items.map((item) => [item.itemKey, item])
  );

  const getOutput = (itemKey: string, hideIfAvp = false) => {
    const item = itemByKey.get(itemKey);
    const val = item?.assignedPersonnel?.fullName ?? item?.fixedTextValue ?? "";
    if (!val) return "";
    if (hideIfAvp && val === "AVP") return "";
    return val;
  };

  const getPosition = (itemKey: string) => {
    const item = itemByKey.get(itemKey);
    return item?.assignedPersonnel?.position ?? "";
  };

  return {
    programDate: formatProgramDate(program.convocationDate),
    venue: "PSA Misamis Oriental",
    assignedGroup: program.group.name,
    emcee: getOutput("emcee"),
    nationalAnthem: getOutput("national_anthem"),
    openingPrayer: getOutput("prayer", true),
    bagongPilipinas: getOutput("bagong_pilipinas", true),
    flagPledge: getOutput("flag_pledge"),
    lingkodBayanPledge: getOutput("lingkod_bayan_pledge"),
    psaVisionMission: getOutput("psa_vision_mission_values"),
    qualityPolicy: getOutput("quality_policy"),
    zumba: getOutput("zumba", true),
    welcomeRemarks: getOutput("welcome_remarks"),
    message: (() => {
      const name = getOutput("message");
      const pos = getPosition("message");
      if (pos) return [name, pos].join("\n");
      if (name.includes(",")) {
        const parts = name.split(",");
        return `${parts[0].trim()}\n${parts.slice(1).join(",").trim()}`;
      }
      return name;
    })(),
    messagePosition: getPosition("message"),
    closingRemarks: getOutput("closing_remarks"),
    preparedBy: ""
  };
}

export async function createOverlayPdf(input: {
  templateFileUrl: string;
  fieldMap: PdfTemplateFieldMap;
  data: Record<string, string>;
}) {
  const absolutePath = path.join(process.cwd(), "public", input.templateFileUrl.replace(/^\//, ""));
  const templateBytes = await readFile(absolutePath);
  const pdf = await PDFDocument.load(templateBytes);
  pdf.registerFontkit(fontkit);
  const warnings: string[] = [];
  const fontCache = new Map<string, PDFFont>();

  async function getFont(field: PdfTemplateField) {
    const fontKey = `${field.fontFamily}-${field.isBold ? "Bold" : "Regular"}`;
    if (!fontCache.has(fontKey)) {
      if (["Helvetica", "Times Roman", "Courier"].includes(field.fontFamily)) {
        const standardFontName = fontNameFor(field);
        fontCache.set(fontKey, await pdf.embedFont(standardFontName));
      } else {
        // Map each custom font family to its actual filename and extension
        const customFontFiles: Record<string, { regular: string; bold: string }> = {
          "Trajan Pro": { regular: "TrajanPro-Regular.ttf", bold: "TrajanPro-Bold.otf" }
        };
        const defaultSuffix = field.isBold ? "Bold" : "Regular";
        const defaultExt = "woff2";
        const baseName = field.fontFamily.replace(/ /g, "");
        const fontFileName = customFontFiles[field.fontFamily]
          ? (field.isBold ? customFontFiles[field.fontFamily].bold : customFontFiles[field.fontFamily].regular)
          : `${baseName}-${defaultSuffix}.${defaultExt}`;
        const fontPath = path.join(process.cwd(), "public", "fonts", fontFileName);
        try {
          const fontBytes = await readFile(fontPath);
          fontCache.set(fontKey, await pdf.embedFont(fontBytes));
        } catch {
          warnings.push(`Custom font ${field.fontFamily} could not be loaded. Falling back to Helvetica.`);
          fontCache.set(fontKey, await pdf.embedFont(field.isBold ? StandardFonts.HelveticaBold : StandardFonts.Helvetica));
        }
      }
    }
    return fontCache.get(fontKey) as PDFFont;
  }

  for (const field of input.fieldMap.fields) {
    const page = pdf.getPage(field.pageNumber - 1);
    if (!page) {
      warnings.push(`${field.label} is assigned to a page that does not exist.`);
      continue;
    }

    const value = input.data[field.key] ?? "";
    if (!value) {
      warnings.push(`${field.label} has no assigned data.`);
      continue;
    }

    const font = await getFont(field);
    const fontSize = !field.wrap && field.shrinkToFit
      ? shrinkFontSize(value, font, field.fontSize, field.maxWidth)
      : field.fontSize;
    const lines = field.wrap ? wrapText(value, font, fontSize, field.maxWidth) : value.split('\n');
    const lineHeight = fontSize * 1.2;

    // Check max width per-line (value may contain \n which crashes widthOfTextAtSize)
    if (!field.wrap) {
      const maxLineWidth = lines.reduce((m, l) => Math.max(m, font.widthOfTextAtSize(l, fontSize)), 0);
      if (maxLineWidth > field.maxWidth) {
        warnings.push(`${field.label} exceeds its max width.`);
      }
    }

    const parsedColor = field.fontColor && /^#[0-9A-Fa-f]{6}$/.test(field.fontColor)
      ? rgb(
          parseInt(field.fontColor.slice(1, 3), 16) / 255,
          parseInt(field.fontColor.slice(3, 5), 16) / 255,
          parseInt(field.fontColor.slice(5, 7), 16) / 255
        )
      : rgb(0, 0, 0);

    lines.forEach((line, index) => {
      let currentFontSize = fontSize;
      let currentX = alignedX(page, field, line, font, currentFontSize);
      // field.y = distance from page TOP (0 = page top, increasing downward).
      // pdf-lib y = distance from page BOTTOM (0 = page bottom, increasing upward).
      // Text baseline is ~0.75*fontSize below the visual top of the text.
      // So: drawY = pageHeight - field.y - ascent, where ascent ≈ 0.75*fontSize
      let currentY = page.getHeight() - field.y - (currentFontSize * 0.75) - index * lineHeight;

      if (field.key === "message" && index > 0) {
        // Position line: smaller font, tight spacing under the name line
        currentFontSize = Math.max(6, fontSize - 2);
        const nameLine = lines[0];
        const nameWidth = font.widthOfTextAtSize(nameLine, fontSize);
        const posWidth = font.widthOfTextAtSize(line, currentFontSize);
        // Center position text under the name
        const nameX = alignedX(page, field, nameLine, font, fontSize);
        currentX = nameX + (nameWidth - posWidth) / 2;
        // Place immediately below the name with tight line spacing
        const nameY = page.getHeight() - field.y - (fontSize * 0.75);
        currentY = nameY - lineHeight;
      }

      page.drawText(line, {
        x: currentX,
        y: currentY,
        size: currentFontSize,
        font,
        color: parsedColor,
        maxWidth: field.maxWidth
      });
    });
  }

  return {
    bytes: await pdf.save(),
    warnings
  };
}
