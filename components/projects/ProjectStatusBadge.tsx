import { Badge, type BadgeProps } from "@/components/ui/badge";
import { formatEnumLabel } from "@/lib/format";

const statusVariant: Record<string, BadgeProps["variant"]> = {
  COMPLETED: "success",
  OVERDUE: "destructive",
  DUE_TODAY: "warning",
  DUE_SOON: "warning",
  ON_TRACK: "info",
  NO_DEADLINE: "neutral",
  INACTIVE: "neutral"
};

export function ProjectStatusBadge({ status }: { status: string }) {
  return <Badge variant={statusVariant[status] ?? "neutral"}>{formatEnumLabel(status)}</Badge>;
}
