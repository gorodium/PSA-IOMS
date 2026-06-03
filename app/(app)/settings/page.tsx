import Link from "next/link";
import { FileClock, FileText, MessageSquare, ShieldCheck, Users, Info } from "lucide-react";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { checkUserPermission } from "@/lib/permissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const settingsCards = [
  {
    title: "User Account Management",
    description: "Manage user accounts, roles, and employee account links.",
    href: "/admin/users",
    icon: Users,
    resource: "settings" as const,
    superAdminOnly: true
  },
  {
    title: "Chat Channels",
    description: "Create channels and manage channel access for internal chat.",
    href: "/settings/chat",
    icon: MessageSquare,
    resource: "settings" as const,
    superAdminOnly: true
  },
  {
    title: "PDF Template Overlay Generator",
    description: "Upload official PDF templates and place dynamic overlay fields.",
    href: "/settings/pdf-templates",
    icon: FileText,
    resource: "settings" as const,
    superAdminOnly: true
  },
  {
    title: "Project Permissions",
    description: "Assign users who can view, edit, submit, approve, or manage projects.",
    href: "/admin/permissions",
    icon: ShieldCheck,
    resource: "settings" as const,
    superAdminOnly: true
  },
  {
    title: "Audit Logs",
    description: "Review saved system activity and administrative changes.",
    href: "/admin/audit-logs",
    icon: FileClock,
    resource: "admin" as const,
    superAdminOnly: true
  },
  {
    title: "About / System Information",
    description: "Learn about the IOMS purpose, modules, and intended users.",
    href: "/settings/about",
    icon: Info,
    resource: "settings" as const,
    superAdminOnly: false
  },
  {
    title: "My Profile (System Administrator)",
    description: "Update your system name and profile picture.",
    href: "/settings/profile",
    icon: Users,
    resource: "settings" as const,
    superAdminOnly: true
  },
  {
    title: "Custom Emojis",
    description: "Upload animated GIFs or images for Discord-style custom chat emojis.",
    href: "/settings/emojis",
    icon: MessageSquare,
    resource: "settings" as const,
    superAdminOnly: true
  }
];

export default async function SettingsPage() {
  const user = await requireUser();

  if (!checkUserPermission(user, "view", "settings")) {
    redirect("/dashboard");
  }

  const visibleCards = settingsCards.filter((card) =>
    checkUserPermission(user, "view", card.resource) && (!card.superAdminOnly || user.role === "SUPER_ADMIN")
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage account access, communication, PDF templates, and administrative references.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleCards.map((card) => {
          const Icon = card.icon;

          return (
            <Link key={card.href} href={card.href} className="group block">
              <Card className="h-full transition hover:border-primary/40 hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-base group-hover:text-primary">{card.title}</CardTitle>
                  </div>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm font-medium text-primary">
                  Open section
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {visibleCards.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            No settings sections are available for your account.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
