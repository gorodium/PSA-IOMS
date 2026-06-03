import { DashboardCalendar } from "./DashboardCalendar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function MonitoringRightPane() {
  return (
    <div className="w-full xl:w-80 2xl:w-96 flex flex-col h-[500px] md:h-full border-t xl:border-t-0 xl:border-l bg-muted/10">
      <div className="p-4 flex flex-col h-full min-h-0">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <h2 className="text-lg font-semibold tracking-tight">Calendar of Activities</h2>
          <Button variant="outline" size="sm" asChild className="h-8 text-xs font-medium">
            <Link href="/calendar">
              Full View
            </Link>
          </Button>
        </div>
        
        <DashboardCalendar />
      </div>
    </div>
  );
}
