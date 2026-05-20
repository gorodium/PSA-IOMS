"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Something went wrong</CardTitle>
        <CardDescription>{error.message || "The page could not be loaded."}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={reset}>Try again</Button>
      </CardContent>
    </Card>
  );
}
