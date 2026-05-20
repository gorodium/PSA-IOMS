import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
  title,
  value,
  description,
  icon: Icon,
  className
}: {
  title: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-normal text-current">{value}</p>
          {description ? <p className="mt-2 text-xs text-muted-foreground">{description}</p> : null}
        </div>
        <div className="rounded-md bg-accent p-2 text-accent-foreground">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  );
}
