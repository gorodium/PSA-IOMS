import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { loginAction } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const nextPath = params?.next?.startsWith("/") ? params.next : "/dashboard";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center space-y-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="PSA Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <CardTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">PSA Misamis Oriental</CardTitle>
            <div className="text-sm font-semibold text-primary dark:text-blue-400 mt-1">
              Integrated Operations Management System
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form action={loginAction} className="space-y-4">
            <input type="hidden" name="next" value={nextPath} />
            <div className="space-y-2">
              <Label htmlFor="identifier">Username or Email</Label>
              <Input id="identifier" name="identifier" type="text" autoComplete="username" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" autoComplete="current-password" required />
            </div>
            <div className="min-h-6" role="status" aria-live="polite">
              {params?.error ? <p className="text-sm font-medium text-red-700">{params.error}</p> : null}
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
            <div className="mt-4 text-center text-sm">
              <Link href="/forgot-password" className="text-primary hover:underline">
                Forgot Password?
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
