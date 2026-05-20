"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ClipboardList, FolderKanban, Settings, ShieldCheck, Users } from "lucide-react";
import type { AuthUser } from "@/lib/auth";
import { checkUserPermission } from "@/lib/permissions";
import { cn } from "@/lib/utils";

const categoryNavigation = [
  {
    name: "Statistical Operations",
    href: "/projects?category=STATISTICAL_OPERATIONS"
  },
  {
    name: "Civil Registration and Vital Statistics",
    href: "/projects?category=CIVIL_REGISTRATION_VITAL_STATISTICS"
  },
  {
    name: "Philippine Identification System",
    href: "/projects?category=PHILIPPINE_IDENTIFICATION_SYSTEM"
  },
  {
    name: "Administrative and Accounting Reports",
    href: "/projects?category=ADMINISTRATIVE_ACCOUNTING_REPORTS"
  }
];

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    resource: "dashboard" as const
  },
  {
    name: "Projects",
    href: "/projects",
    icon: FolderKanban,
    resource: "project" as const
  },
  {
    name: "Personnel",
    href: "/personnel",
    icon: Users,
    resource: "personnel" as const
  },
  {
    name: "Admin",
    href: "/admin",
    icon: ShieldCheck,
    resource: "admin" as const
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
  const visibleNavigation = navigation.filter((item) => {
    if (item.resource === "dashboard" || item.resource === "project") {
      return true;
    }

    return checkUserPermission(user, "view", item.resource);
  });

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-white lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-3 border-b px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <ClipboardList className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-950">PSA Misamis Oriental</p>
          <p className="text-xs text-muted-foreground">Operations Monitoring</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Main navigation">
        <div className="mb-4 border-b pb-4">
          <p className="px-3 text-xs font-semibold uppercase text-muted-foreground">Categories</p>
          <div className="mt-2 space-y-1">
            {categoryNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2 text-xs font-medium text-slate-700 hover:bg-accent hover:text-accent-foreground"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        {visibleNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-accent hover:text-accent-foreground",
                isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <p className="truncate text-sm font-medium text-slate-900">{user?.name ?? "Public Viewer"}</p>
        <p className="truncate text-xs text-muted-foreground">{user?.role.replaceAll("_", " ") ?? "Read-only access"}</p>
      </div>
    </aside>
  );
}
