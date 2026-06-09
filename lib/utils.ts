import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatChatName(name: string | null | undefined): string {
  if (!name) return "";
  let clean = name.replace(/^DM:\s*/i, "").trim();
  clean = clean.replace(/\s+-\s+c[a-z0-9]{24}$/i, "");
  return clean.trim();
}
