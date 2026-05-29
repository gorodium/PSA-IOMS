import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";
import type { AuthUser } from "@/lib/auth";
import { logoutAction } from "@/app/(app)/actions";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function AppHeader({ user }: { user: AuthUser | null }) {
  return (
    <header className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-950 dark:text-slate-50 lg:hidden leading-none mb-1">
            PSA Misamis Oriental
          </p>
          <p className="text-xs sm:text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100 leading-tight">
            Philippine Statistics Authority Misamis Oriental Integrated Operations Monitoring System
          </p>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-50">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <ThemeToggle />
              <form action={logoutAction}>
                <Button type="submit" variant="outline" size="sm">
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Button asChild variant="outline" size="sm">
                <Link href="/login">
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  Sign in
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
