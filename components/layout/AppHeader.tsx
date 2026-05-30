"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn, LogOut, Menu } from "lucide-react";
import type { AuthUser } from "@/lib/auth";
import { logoutAction } from "@/app/(app)/actions";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNav } from "@/components/layout/AppSidebar";

export function AppHeader({ user }: { user: AuthUser | null }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 shadow-sm">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Sidebar Trigger & Title */}
        <div className="flex items-center gap-4 lg:hidden min-w-0">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0 -ml-2 text-slate-700 dark:text-slate-300">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 flex flex-col">
              <div className="flex h-16 shrink-0 items-center gap-3 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-transparent">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo.svg" alt="PSA Logo" className="h-full w-full object-contain" />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-50 leading-tight">PSA Misamis Oriental IOMS</p>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-primary/80 dark:text-primary-foreground/70">Internal Operations Platform</p>
                </div>
              </div>
              <SidebarNav user={user} onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold text-slate-950 dark:text-slate-50 leading-tight truncate">
              PSA Misamis Oriental IOMS
            </p>
          </div>
        </div>

        {/* Desktop Title */}
        <div className="hidden lg:flex flex-col min-w-0 flex-1">
          <p className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight truncate tracking-tight">
            PSA Misamis Oriental IOMS
          </p>
          <p className="text-xs font-medium text-muted-foreground truncate mt-0.5">
            Internal Operations Management Platform
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <ThemeToggle />
          
          {user ? (
            <div className="flex items-center gap-4 pl-2 border-l border-slate-200 dark:border-slate-700">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-50 leading-tight">{user.name}</p>
                <p className="text-xs font-medium text-muted-foreground leading-tight">{user.email}</p>
              </div>
              <form action={logoutAction}>
                <Button type="submit" variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <LogOut className="h-4 w-4 mr-0 sm:mr-2" aria-hidden="true" />
                  <span className="hidden sm:inline">Sign out</span>
                </Button>
              </form>
            </div>
          ) : (
            <div className="pl-2 border-l border-slate-200 dark:border-slate-700">
              <Button asChild size="sm">
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" aria-hidden="true" />
                  Sign in
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
