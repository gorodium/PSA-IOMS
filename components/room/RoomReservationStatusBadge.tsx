import { RoomReservationStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

const variants: Record<RoomReservationStatus, "neutral" | "success" | "warning" | "destructive"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
  CANCELLED: "neutral"
};

export function RoomReservationStatusBadge({ status }: { status: RoomReservationStatus }) {
  return <Badge variant={variants[status]}>{status.replaceAll("_", " ")}</Badge>;
}
