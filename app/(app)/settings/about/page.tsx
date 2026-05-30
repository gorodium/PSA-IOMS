import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Target, LayoutDashboard, Users, Activity, Lightbulb, ShieldAlert, CheckCircle2 } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { checkUserPermission } from "@/lib/permissions";
import { redirect } from "next/navigation";

export const metadata = {
  title: "About IOMS | PSA Misamis Oriental",
  description: "About the Integrated Operations Management System",
};

export default async function AboutPage() {
  const user = await requireUser();

  if (!checkUserPermission(user, "view", "settings")) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">About PSA Misamis Oriental IOMS</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          System Information and Overview
        </p>
      </div>

      <div className="grid gap-6">
        {/* Overview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="h-5 w-5 text-primary" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>
              <strong>PSA Misamis Oriental IOMS</strong> stands for <strong>Integrated Operations Management System</strong>. It is an internal operations platform designed to help PSA Misamis Oriental monitor, manage, and coordinate office activities in one centralized system.
            </p>
            <p>
              The system supports the office by bringing together project monitoring, employee assignments, workload visibility, calendar activities, room reservations, vehicle scheduling, convocation program assignments, document templates, internal communication, permissions, and audit logs.
            </p>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-2">
              <h4 className="font-semibold text-primary mb-1 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Management and Monitoring
              </h4>
              <p className="text-sm">
                IOMS is both a management and monitoring system. It monitors deadlines, submissions, assignments, schedules, and operational status. It also helps manage office workflows such as requests, reservations, employee assignments, permissions, document templates, and administrative coordination. The term &quot;Management&quot; is used in the official name because it covers both monitoring and coordination.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Purpose */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-primary" />
                Purpose
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                The purpose of IOMS is to reduce fragmented tracking, minimize manual follow-ups, improve visibility of office responsibilities, and support faster coordination among personnel, focal persons, supervisors, administrators, and management.
              </p>
            </CardContent>
          </Card>

          {/* What the System Helps With */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                What the System Helps With
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                Instead of relying only on separate spreadsheets, messages, printed notes, and manual reminders, IOMS provides one place where authorized users can view important operational information, track deadlines, check assignments, submit requests, and monitor office activities.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Core Modules */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              Core Modules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li><strong className="text-slate-900 dark:text-slate-100">Monitoring Board:</strong> Tracks project deliverables, deadlines, submission status, remarks, and operational progress.</li>
              <li><strong className="text-slate-900 dark:text-slate-100">Workload Monitoring:</strong> Intended to help visualize employee responsibilities, assignment load, deadlines, and possible workload imbalance.</li>
              <li><strong className="text-slate-900 dark:text-slate-100">Calendar of Activities:</strong> Consolidates office schedules, activities, holidays, project deadlines, reservations, and other important events.</li>
              <li><strong className="text-slate-900 dark:text-slate-100">Projects:</strong> Maintains the list of monitored projects, project details, categories, frequencies, focal persons, and related monitoring information.</li>
              <li><strong className="text-slate-900 dark:text-slate-100">CRVS:</strong> Reserved for Civil Registration and Vital Statistics operational workflows and monitoring.</li>
              <li><strong className="text-slate-900 dark:text-slate-100">Employees:</strong> Maintains employee records used for assignments, permissions, contact information, employment type, section, and workload references.</li>
              <li><strong className="text-slate-900 dark:text-slate-100">Convocation Program:</strong> Helps prepare and manage Monday convocation assignments and program flow.</li>
              <li><strong className="text-slate-900 dark:text-slate-100">Vehicle Scheduling:</strong> Supports requests, review, approval, and scheduling of official vehicle use.</li>
              <li><strong className="text-slate-900 dark:text-slate-100">Room Reservation:</strong> Supports reservation and conflict checking for official rooms and office spaces.</li>
              <li><strong className="text-slate-900 dark:text-slate-100">Administrative Reports:</strong> Reserved for administrative reporting workflows and document-related outputs.</li>
              <li><strong className="text-slate-900 dark:text-slate-100">Settings:</strong> Manages user accounts, permissions, chat channels, PDF template overlays, audit logs, and administrative references.</li>
            </ul>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Who Can Use the System */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" />
                Who Can Use the System
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 dark:text-slate-300">
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Super Admins</li>
                <li>Admin personnel</li>
                <li>Project focal persons</li>
                <li>Alternate and assistant focal persons</li>
                <li>Employees submitting requests or checking assignments</li>
                <li>Supervisors and management personnel who need operational visibility</li>
              </ul>
              <div className="flex items-start gap-2 text-xs bg-slate-100 dark:bg-slate-800 p-3 rounded-md border border-slate-200 dark:border-slate-700">
                <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Important Note:</strong> Access to system features depends on the user&apos;s assigned role and permissions. Some modules are limited to administrators or authorized personnel.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Innovation and Scalability */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="h-5 w-5 text-primary" />
                Innovation and Scalability
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 dark:text-slate-300 space-y-4">
              <p>
                IOMS is designed as an internal government innovation initiative for improving operational efficiency, accountability, coordination, and visibility within PSA Misamis Oriental. The system is built with future scalability in mind, so it may be improved or expanded for broader use if needed.
              </p>
              <div className="flex items-start gap-2 text-xs bg-slate-100 dark:bg-slate-800 p-3 rounded-md border border-slate-200 dark:border-slate-700">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p>
                  <strong>Development Note:</strong> Some modules may appear as &quot;Under Construction&quot; while features are being developed or prepared for future implementation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Optional Footer */}
      <div className="text-center pt-8 pb-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          PSA Misamis Oriental IOMS &mdash; Integrated Operations Management System
        </p>
      </div>
    </div>
  );
}
