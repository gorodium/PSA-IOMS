import { VehicleRequestStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

const statusStyles: Record<VehicleRequestStatus, "neutral" | "success" | "warning" | "info" | "destructive"> = {
  PENDING: "warning",
  APPROVED: "info",
  ASSIGNED: "success",
  REJECTED: "destructive",
  CANCELLED: "neutral"
};

export function VehicleRequestStatusBadge({ status }: { status: VehicleRequestStatus }) {
  return (
    <Badge variant={statusStyles[status]}>
      {status.replaceAll("_", " ")}
    </Badge>
  );
}
