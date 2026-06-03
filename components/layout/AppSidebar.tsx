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
  Users,
  ActivitySquare
} from "lucide-react";
import type { AuthUser } from "@/lib/auth";
import { checkUserPermission } from "@/lib/permissions";
import { cn } from "@/lib/utils";

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  basePath?: string;
  resource?: "vehicleRequest" | "roomReservation" | "settings";
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

export const navigationGroups: NavGroup[] = [
  {
    label: "Operations",
    items: [
      { name: "Monitoring Board", href: "/dashboard", icon: BarChart3 },
      { name: "Workload Monitoring", href: "/reports/workload", icon: ActivitySquare },
      { name: "Calendar of Activities", href: "/calendar", icon: CalendarDays },
      { name: "Projects", href: "/projects", icon: FolderKanban },
      { name: "CRVS", href: "/reports/crvs", icon: BookOpen }
    ]
  },
  {
    label: "Records",
    items: [
      { name: "Employees", href: "/personnel", icon: Users }
    ]
  },
  {
    label: "Programs",
    items: [
      { name: "Convocation Program", href: "/convocation", icon: ClipboardList }
    ]
  },
  {
    label: "Requests",
    items: [
      { name: "Vehicle Scheduling", href: "/vehicle-requests", icon: CarFront, resource: "vehicleRequest" },
      { name: "Room Reservation", href: "/room-reservations", icon: DoorOpen, resource: "roomReservation" }
    ]
  },
  {
    label: "Reports",
    items: [
      { name: "Administrative Reports", href: "/reports/administrative", icon: FileText },
      { name: "Special Orders", href: "/reports/special-order", icon: ClipboardList }
    ]
  },
  {
    label: "Administration",
    items: [
      { name: "Settings", href: "/settings", icon: Settings, resource: "settings" }
    ]
  }
];

export function SidebarNav({ user, onNavigate }: { user: AuthUser | null, onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-6" aria-label="Main navigation">
      {navigationGroups.map((group) => {
        const visibleItems = group.items.filter((item) => {
          if (item.resource) return checkUserPermission(user, "view", item.resource);
          return true;
        });

        if (visibleItems.length === 0) return null;

        return (
          <div key={group.label} className="space-y-2">
            <h3 className="px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
              {group.label}
            </h3>
            <div className="space-y-1">
              {visibleItems.map((item) => {
                const isActive = item.basePath
                  ? false // Don't highlight query params as active automatically
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
                
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm dark:bg-primary/90"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    )}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", isActive ? "opacity-100" : "opacity-70")} aria-hidden="true" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

export function AppSidebar({ user }: { user: AuthUser | null }) {
  return (
    <aside className="fixed top-16 bottom-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 lg:flex lg:flex-col">
      <SidebarNav user={user} />

      <div className="border-t border-slate-200 p-4 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-2 dark:bg-slate-900">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
            <Users className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
              {user?.name ?? "Public Viewer"}
            </p>
            <p className="truncate text-xs font-medium text-muted-foreground">
              {user?.role === "SUPER_ADMIN" ? "System Administrator" : (user?.role.replaceAll("_", " ") ?? "Read-only access")}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
