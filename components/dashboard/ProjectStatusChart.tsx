"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatEnumLabel } from "@/lib/format";

const statusColors: Record<string, string> = {
  COMPLETED: "#15803d",
  OVERDUE: "#b91c1c",
  DUE_TODAY: "#c2410c",
  DUE_SOON: "#d97706",
  ON_TRACK: "#0369a1",
  NO_DEADLINE: "#64748b",
  INACTIVE: "#475569"
};

export function ProjectStatusChart({ data }: { data: Array<{ status: string; count: number }> }) {
  const chartData = data
    .filter((item) => item.count > 0)
    .map((item) => ({
      ...item,
      label: formatEnumLabel(item.status)
    }));

  if (chartData.length === 0) {
    return <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">No project data yet.</div>;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} dataKey="count" nameKey="label" innerRadius={54} outerRadius={88} paddingAngle={2}>
            {chartData.map((entry) => (
              <Cell key={entry.status} fill={statusColors[entry.status] ?? "#64748b"} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [value, name]} />
          <Legend iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
