import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatChatName(name: string | null | undefined): string {
  if (!name) return "Unknown";
  let clean = name.replace(/\s+-\s+[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i, "");
  clean = clean.replace(/\s+-\s+c[a-z0-9]{24}$/i, "");
  return clean.trim();
}

export function getInitials(name: string): string {
  const words = name.split(" ").filter(w => w.length > 0);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}
