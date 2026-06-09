"use client";

import { MousePointer2, LayoutDashboard, UserCircle, Cpu, Cable, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  activeTool: string;
  onToolSelect: (tool: string) => void;
  onAddFurniture: () => void;
  onAddSeat: () => void;
  onAddDevice: () => void;
  onAddConnection: () => void;
};

export function AdminMapTools({ activeTool, onToolSelect, onAddFurniture, onAddSeat, onAddDevice, onAddConnection }: Props) {
  const tools = [
    { id: "select", icon: MousePointer2, label: "Select & Move", action: () => onToolSelect("select") },
    { id: "furniture", icon: LayoutDashboard, label: "Add Furniture", action: () => { onToolSelect("furniture"); onAddFurniture(); } },
    { id: "seat", icon: UserCircle, label: "Add Seat", action: () => { onToolSelect("seat"); onAddSeat(); } },
    { id: "device", icon: Cpu, label: "Add Device", action: () => { onToolSelect("device"); onAddDevice(); } },
    { id: "connection", icon: Cable, label: "Add Connection", action: () => { onToolSelect("connection"); onAddConnection(); } },
    { id: "delete", icon: Trash2, label: "Delete Item", action: () => onToolSelect("delete"), danger: true },
  ];

  return (
    <div className="absolute left-2 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1 rounded-lg bg-background border shadow-lg p-1">
      {tools.map((t) => (
        <button
          key={t.id}
          onClick={t.action}
          title={t.label}
          className={cn(
            "p-2 rounded-md transition-colors group relative flex items-center justify-center",
            activeTool === t.id
              ? t.danger ? "bg-red-100 text-red-600 dark:bg-red-900/30" : "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <t.icon className="h-5 w-5" />
          <span className="absolute left-full ml-2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
            {t.label}
          </span>
        </button>
      ))}
    </div>
  );
}
