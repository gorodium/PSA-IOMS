import { ShieldAlert } from "lucide-react";
import { forgotPasswordAction } from "@/app/forgot-password/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export const dynamic = "force-dynamic";

type ForgotPasswordPageProps = {
  searchParams?: Promise<{
    message?: string;
  }>;
};

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ShieldAlert className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <CardTitle className="text-xl">Forgot Password</CardTitle>
            <CardDescription className="mt-2">
              Enter your username or email address. We will send you instructions if the account exists and email is configured, or contact your System Administrator to reset it manually.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form action={forgotPasswordAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Enter username or work email</Label>
              <Input id="identifier" name="identifier" type="text" placeholder="username or email" required />
            </div>
            
            <div className="min-h-6" role="status" aria-live="polite">
              {params?.message ? <p className="text-sm font-medium text-green-700 bg-green-50 p-2 rounded">{params.message}</p> : null}
            </div>

            <Button type="submit" className="w-full">
              Request Reset
            </Button>

            <div className="mt-4 text-center text-sm">
              <Link href="/login" className="text-primary hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
