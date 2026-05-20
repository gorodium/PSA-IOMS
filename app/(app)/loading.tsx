import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-64 animate-pulse rounded-md bg-muted" />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-5">
              <div className="h-5 w-24 animate-pulse rounded bg-muted" />
              <div className="mt-4 h-9 w-16 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-lg border bg-card" />
    </div>
  );
}
