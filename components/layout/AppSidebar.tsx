"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CarFront,
  ClipboardList,
  DoorOpen,
  FileText,
  FolderKanban,
  Settings,
  Users
} from "lucide-react";
import type { AuthUser } from "@/lib/auth";
import { checkUserPermission } from "@/lib/permissions";
import { cn } from "@/lib/utils";

// Always shown to everyone (including unauthenticated visitors)
const publicNavigation = [
  {
    name: "Monitoring Board",
    href: "/dashboard",
    icon: BarChart3
  },
  {
    name: "Calendar of Activities",
    href: "/calendar",
    icon: CalendarDays
  },
  {
    name: "Projects",
    href: "/projects",
    icon: FolderKanban
  },
  {
    name: "Administrative Reports",
    href: "/projects?category=ADMINISTRATIVE_ACCOUNTING_REPORTS",
    basePath: "/projects",
    icon: FileText
  },
  {
    name: "Civil Registration and Vital Statistics",
    href: "/projects?category=CIVIL_REGISTRATION_VITAL_STATISTICS",
    basePath: "/projects",
    icon: BookOpen
  },
  {
    name: "Employees",
    href: "/personnel",
    icon: Users
  },
  {
    name: "Convocation Program",
    href: "/convocation",
    icon: ClipboardList
  }
];

// Only shown to authenticated users with the right role
const authNavigation = [
  {
    name: "Vehicle Scheduling",
    href: "/vehicle-requests",
    icon: CarFront,
    resource: "vehicleRequest" as const
  },
  {
    name: "Room Reservation",
    href: "/room-reservations",
    icon: DoorOpen,
    resource: "roomReservation" as const
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    resource: "settings" as const
  }
];

export function AppSidebar({ user }: { user: AuthUser | null }) {
  const pathname = usePathname();

  const visibleAuthNav = authNavigation.filter((item) =>
    checkUserPermission(user, "view", item.resource)
  );

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-white dark:border-slate-800 dark:bg-slate-950 lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-50 p-1 dark:bg-slate-900 border dark:border-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="Philippine Statistics Authority Logo"
            className="h-full w-full object-contain"
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">PSA Misamis Oriental</p>
          <p className="text-xs text-muted-foreground">Operations Monitoring</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
        {publicNavigation.map((item) => {
          const isActive = "basePath" in item
            ? false // category links: never highlight (Projects parent handles it)
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-accent hover:text-accent-foreground dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50",
                isActive &&
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground dark:bg-primary dark:text-primary-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="leading-snug">{item.name}</span>
            </Link>
          );
        })}

        {visibleAuthNav.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`) ||
            (item.resource === "settings" && (pathname === "/admin" || pathname.startsWith("/admin/")));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-accent hover:text-accent-foreground dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50",
                isActive &&
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground dark:bg-primary dark:text-primary-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4 dark:border-slate-800">
        <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-50">
          {user?.name ?? "Public Viewer"}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {user?.role.replaceAll("_", " ") ?? "Read-only access"}
        </p>
      </div>
    </aside>
  );
}
