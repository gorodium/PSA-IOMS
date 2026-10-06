import { FieldAwardsNav } from "@/components/field-awards/FieldAwardsNav";

export default function FieldAwardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">
          Field Awards
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor performance, track evidence, and calculate ratings for the PSA Field Awards.
        </p>
      </div>

      <FieldAwardsNav />

      <div className="mt-6">{children}</div>
    </div>
  );
}
