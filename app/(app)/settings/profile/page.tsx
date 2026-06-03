import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { ProfileForm } from "./ProfileForm";

export default async function ProfileSettingsPage() {
  const user = await requireUser();

  // Strict restriction: only SUPER_ADMIN can view this page
  if (user.role !== "SUPER_ADMIN") {
    redirect("/settings");
  }

  const dbUser = await db.user.findUnique({ where: { id: user.id } });

  if (!dbUser) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">My Profile (System Administrator)</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your system name and profile picture. This is only visible to the System Administrator.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Changes will instantly appear across the platform, including the chat dock.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm initialName={dbUser.name} initialPhotoUrl={dbUser.photoUrl} />
        </CardContent>
      </Card>
    </div>
  );
}
