import { redirect } from "next/navigation";
import { KeyRound } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { changePasswordAction } from "@/app/change-password/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const dynamic = "force-dynamic";

type ChangePasswordPageProps = {
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function ChangePasswordPage({ searchParams }: ChangePasswordPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // If they don't need to change password, redirect to dashboard
  if (!user.mustChangePassword) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const nextPath = params?.next?.startsWith("/") ? params.next : "/dashboard";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <KeyRound className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <CardTitle className="text-xl">Change Required</CardTitle>
            <CardDescription className="mt-2">
              You must change your password before you can proceed to your account.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form action={changePasswordAction} className="space-y-4">
            <input type="hidden" name="next" value={nextPath} />
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" name="currentPassword" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" name="newPassword" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required />
            </div>
            <div className="min-h-6" role="status" aria-live="polite">
              {params?.error ? <p className="text-sm font-medium text-red-700">{params.error}</p> : null}
            </div>
            <Button type="submit" className="w-full">
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
