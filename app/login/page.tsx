import { redirect } from "next/navigation";
import { LogIn } from "lucide-react";
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
        <CardHeader className="space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LogIn className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <CardTitle className="text-xl">PSA Misamis Oriental</CardTitle>
            <CardDescription className="mt-2">Sign in with your office email and password.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form action={loginAction} className="space-y-4">
            <input type="hidden" name="next" value={nextPath} />
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
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
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
