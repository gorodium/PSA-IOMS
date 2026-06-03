import type { ProjectCategory } from "@prisma/client";

export const projectCategoryOptions: Array<{
  value: ProjectCategory;
  label: string;
  subcategories: string[];
}> = [
  {
    value: "STATISTICAL_OPERATIONS",
    label: "Statistical Operations",
    subcategories: [
      "Household Surveys",
      "Census, Sampling Frames, and Community-Based Monitoring System",
      "Establishment Surveys",
      "Administrative Data",
      "Statistical Framework and Indicators System",
      "Provincial Product Accounts"
    ]
  },
  {
    value: "CIVIL_REGISTRATION_VITAL_STATISTICS",
    label: "Civil Registration and Vital Statistics",
    subcategories: []
  },
  {
    value: "PHILIPPINE_IDENTIFICATION_SYSTEM",
    label: "Philippine Identification System",
    subcategories: []
  },
  {
    value: "ADMINISTRATIVE_ACCOUNTING_REPORTS",
    label: "Administrative and Accounting",
    subcategories: []
  }
];

export const personnelSectionOptions = [
  "Provincial Head",
  ...projectCategoryOptions.map((category) => category.label)
];

export function getProjectCategoryLabel(value: string) {
  return projectCategoryOptions.find((category) => category.value === value)?.label ?? value;
}

export function getProjectSubcategories(value: string) {
  return projectCategoryOptions.find((category) => category.value === value)?.subcategories ?? [];
}

export const defaultTaskColumns = [
  {
    key: "operationWorkload",
    labelField: "operationWorkloadLabel",
    visibleField: "showOperationWorkload",
    fallbackLabel: "Project/Operation/Workload"
  },
  {
    key: "deadlineSubmission",
    labelField: "deadlineSubmissionLabel",
    visibleField: "showDeadlineSubmission",
    fallbackLabel: "Deadline of Submission"
  },
  {
    key: "dateSubmitted",
    labelField: "dateSubmittedLabel",
    visibleField: "showDateSubmitted",
    fallbackLabel: "Date Submitted"
  },
  {
    key: "totalSamplesDocuments",
    labelField: "totalSamplesDocumentsLabel",
    visibleField: "showTotalSamplesDocuments",
    fallbackLabel: "Total Sample/Documents"
  },
  {
    key: "responseRate",
    labelField: "responseRateLabel",
    visibleField: "showResponseRate",
    fallbackLabel: "Response Rate"
  }
] as const;

export const PREDEFINED_POSITIONS = [
  "SG 24 - Chief Statistical Specialist",
  "SG 22 - Supervising Statistical Specialist",
  "SG 19 - Senior Statistical Specialist",
  "SG 19 - Information Technology Officer I",
  "SG 16 - Statistical Specialist II",
  "SG 16 - Accountant II",
  "SG 16 - Information System Analyst II",
  "SG 14 - Registration Officer II",
  "SG 13 - Statistical Specialist I",
  "SG 12 - Accountant I",
  "SG 12 - Information System Analyst I",
  "SG 11 - Statistical Analyst",
  "SG 11 - Administrative Officer II",
  "SG 10 - Registration Officer I",
  "SG 10 - Administrative Officer I",
  "SG 9 - Assistant Statistician",
  "SG 9 - Administrative Assistant III",
  "SG 6 - Administrative Aide VI",
  "SG 4 - Administrative Aide IV",
];

export function getPositionSgLevel(position: string): number {
  const clean = position.replace(/\*{1,3}$/, "").trim();

  // Try matching SG from pattern "SG XX - ..." or similar
  const match = clean.match(/^SG\s*(\d+)/i);
  if (match) {
    return parseInt(match[1], 10);
  }

  // If there's no SG prefix, try matching against predefined positions to see if we can resolve it
  const normalize = (s: string) => s.trim().toLowerCase().replace(/specilist/g, "specialist");
  const getDesignationOnly = (s: string) => s.replace(/^SG \d+ - /i, "");
  const normalizedClean = normalize(clean);

  // See if it matches the prefix-stripped version of any predefined positions
  const matchedPredefined = PREDEFINED_POSITIONS.find(
    p => normalize(getDesignationOnly(p)) === normalizedClean
  );
  if (matchedPredefined) {
    const predefinedMatch = matchedPredefined.match(/^SG\s*(\d+)/i);
    if (predefinedMatch) {
      return parseInt(predefinedMatch[1], 10);
    }
  }

  return 0; // default for unrecognized custom positions
}

export function parseInitialSection(sectionStr: string | undefined | null) {
  if (!sectionStr) {
    return { selectedSection: "", customSectionText: "" };
  }

  const match = personnelSectionOptions.find(opt => opt === sectionStr);
  if (match) {
    return { selectedSection: match, customSectionText: "" };
  }

  return { selectedSection: "Custom", customSectionText: sectionStr };
}

export function parseInitialPosition(positionStr: string | undefined | null) {
  if (!positionStr) {
    return { isCosw: false, isCoterminous: false, isVei: false, selectedPosition: "", customPositionText: "" };
  }

  // 1. Check if it ends with '***', '**' or '*'
  const isVei = positionStr.endsWith("***");
  const isCoterminous = !isVei && positionStr.endsWith("**");
  const isCosw = !isVei && !isCoterminous && positionStr.endsWith("*");
  const cleanPosition = isVei ? positionStr.slice(0, -3) : isCoterminous ? positionStr.slice(0, -2) : isCosw ? positionStr.slice(0, -1) : positionStr;

  // Helper to normalize strings for comparison (case-insensitive, trimmed, replacing Specilist with Specialist)
  const normalize = (s: string) => s.trim().toLowerCase().replace(/specilist/g, "specialist");

  // Helper to get the designation without the "SG XX - " prefix
  const getDesignationOnly = (s: string) => s.replace(/^SG \d+ - /i, "");

  const normalizedClean = normalize(cleanPosition);

  // 2. Try exact match with predefined options (with prefix)
  const exactMatch = PREDEFINED_POSITIONS.find(p => normalize(p) === normalizedClean);
  if (exactMatch) {
    return { isCosw, isCoterminous, isVei, selectedPosition: exactMatch, customPositionText: "" };
  }

  // 3. Try match with prefix stripped (e.g., database has "Chief Statistical Specialist" which matches "SG 24 - Chief Statistical Specialist")
  const suffixMatch = PREDEFINED_POSITIONS.find(p => normalize(getDesignationOnly(p)) === normalizedClean);
  if (suffixMatch) {
    return { isCosw, isCoterminous, isVei, selectedPosition: suffixMatch, customPositionText: "" };
  }

  // 4. Fallback to custom
  return { isCosw, isCoterminous, isVei, selectedPosition: "Custom", customPositionText: cleanPosition };
}


