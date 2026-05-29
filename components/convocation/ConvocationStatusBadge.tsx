import { ConvocationProgramStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

const variants: Record<ConvocationProgramStatus, "neutral" | "success" | "warning"> = {
  DRAFT: "warning",
  FINALIZED: "success",
  ARCHIVED: "neutral"
};

export function ConvocationStatusBadge({ status }: { status: ConvocationProgramStatus }) {
  return <Badge variant={variants[status]}>{status}</Badge>;
}
