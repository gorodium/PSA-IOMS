'use client';

import React from 'react';
import {
  Image,
  LayoutDashboard,
  UserCircle,
  Cpu,
  Cable,
  Tag,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type LayerKey =
  | 'background'
  | 'furniture'
  | 'seats'
  | 'devices'
  | 'connections'
  | 'labels'
  | 'status';

interface Layers {
  background:  boolean;
  furniture:   boolean;
  seats:       boolean;
  devices:     boolean;
  connections: boolean;
  labels:      boolean;
  status:      boolean;
}

interface LayerTogglePanelProps {
  layers:   Layers;
  onChange: (key: string, value: boolean) => void;
}

// ─── Layer config ─────────────────────────────────────────────────────────────

interface LayerConfig {
  key:   LayerKey;
  label: string;
  icon:  React.ReactNode;
}

const LAYER_CONFIG: LayerConfig[] = [
  { key: 'background',  label: 'BG',      icon: <Image      className="h-3 w-3" strokeWidth={1.8} /> },
  { key: 'furniture',   label: 'Desks',   icon: <LayoutDashboard className="h-3 w-3" strokeWidth={1.8} /> },
  { key: 'seats',       label: 'Seats',   icon: <UserCircle className="h-3 w-3" strokeWidth={1.8} /> },
  { key: 'devices',     label: 'Devices', icon: <Cpu        className="h-3 w-3" strokeWidth={1.8} /> },
  { key: 'connections', label: 'Links',   icon: <Cable      className="h-3 w-3" strokeWidth={1.8} /> },
  { key: 'labels',      label: 'Labels',  icon: <Tag        className="h-3 w-3" strokeWidth={1.8} /> },
  { key: 'status',      label: 'Status',  icon: <Activity   className="h-3 w-3" strokeWidth={1.8} /> },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function LayerTogglePanel({ layers, onChange }: LayerTogglePanelProps) {
  return (
    <div className="flex items-center gap-1">
      {LAYER_CONFIG.map(({ key, label, icon }) => {
        const isOn = layers[key];
        return (
          <Button
            key={key}
            variant={isOn ? 'default' : 'outline'}
            size="sm"
            aria-label={`Toggle ${label} layer`}
            aria-pressed={isOn}
            onClick={() => onChange(key, !isOn)}
            className={cn(
              'h-7 gap-1 rounded-full px-2.5 text-[10px] font-semibold transition-all duration-150',
              isOn
                ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700'
                : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700',
            )}
          >
            {icon}
            {label}
          </Button>
        );
      })}
    </div>
  );
}
