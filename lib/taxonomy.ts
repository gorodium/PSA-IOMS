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
    label: "Administrative and Accounting Reports",
    subcategories: []
  }
];

export const personnelSectionOptions = projectCategoryOptions.map((category) => category.label);

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
