"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, CheckCircle, Calendar, Settings, FileText, ListTree } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Overview", href: "/field-awards", exact: true, icon: Trophy },
  { name: "Categories", href: "/field-awards/categories", exact: false, icon: ListTree },
  { name: "Requirements", href: "/field-awards/requirements", exact: false, icon: CheckCircle },
  { name: "Deadlines", href: "/field-awards/deadlines", exact: false, icon: Calendar },
  { name: "Configuration", href: "/field-awards/configuration", exact: false, icon: Settings },
  { name: "Reports", href: "/field-awards/reports", exact: false, icon: FileText },
];

export function FieldAwardsNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-slate-200 dark:border-slate-800">
      <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
        {navigation.map((item) => {
          const isActive = item.exact 
            ? pathname === item.href 
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium whitespace-nowrap transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-300"
              )}
            >
              <item.icon
                className={cn(
                  "-ml-0.5 mr-2 h-5 w-5",
                  isActive
                    ? "text-primary"
                    : "text-slate-400 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-400"
                )}
                aria-hidden="true"
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
