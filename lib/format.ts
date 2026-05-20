import { format } from "date-fns";

export function formatDate(date: Date | string | null | undefined, fallback = "Not set") {
  if (!date) {
    return fallback;
  }

  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return fallback;
  }

  return format(parsedDate, "MMM d, yyyy");
}

export function formatDateTime(date: Date | string | null | undefined, fallback = "Not set") {
  if (!date) {
    return fallback;
  }

  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return fallback;
  }

  return format(parsedDate, "MMM d, yyyy h:mm a");
}

export function formatDateInput(date: Date | string | null | undefined) {
  if (!date) {
    return "";
  }

  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return format(parsedDate, "yyyy-MM-dd");
}

export function formatEnumLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
