'use client';

import React, { useMemo } from 'react';
import type { ICTMapConnection, ICTMapDevice } from '@/app/(app)/ict-management/infrastructure-map/actions';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ConnectionLayerProps {
  connections: ICTMapConnection[];
  devices: ICTMapDevice[];
  showConnections: boolean;
  containerWidth: number;
  containerHeight: number;
}

// ─── Style config ─────────────────────────────────────────────────────────────

interface LineStyle {
  stroke:      string;
  strokeWidth: number;
  dashArray?:  string;
}

const CONNECTION_STYLES: Record<string, LineStyle> = {
  LAN:            { stroke: '#475569', strokeWidth: 2 },
  WIFI:           { stroke: '#3b82f6', strokeWidth: 1.5, dashArray: '6 3' },
  FIBER:          { stroke: '#f97316', strokeWidth: 3 },
  VPN:            { stroke: '#a855f7', strokeWidth: 1.5, dashArray: '8 4' },
  USB:            { stroke: '#16a34a', strokeWidth: 1.5 },
  SHARED_PRINTER: { stroke: '#14b8a6', strokeWidth: 1.5, dashArray: '2 3' },
  UNKNOWN:        { stroke: '#94a3b8', strokeWidth: 1,   dashArray: '4 4' },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ConnectionLineProps {
  connection: ICTMapConnection;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  markerId: string;
}

function ConnectionLine({ connection, x1, y1, x2, y2, markerId }: ConnectionLineProps) {
  const ctype = connection.connectionType ?? 'UNKNOWN';
  const style = CONNECTION_STYLES[ctype] ?? CONNECTION_STYLES.UNKNOWN;
  const opacity = connection.isVerified === false ? 0.45 : 1;

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return (
    <g opacity={opacity}>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
        strokeDasharray={style.dashArray}
        strokeLinecap="round"
        markerEnd={`url(#${markerId})`}
      />
      {connection.cableLabel && (
        <>
          <rect
            x={midX - 18}
            y={midY - 7}
            width={36}
            height={14}
            rx={3}
            fill="white"
            fillOpacity={0.85}
            stroke={style.stroke}
            strokeWidth={0.75}
          />
          <text
            x={midX}
            y={midY + 4}
            textAnchor="middle"
            fontSize={8}
            fontFamily="ui-monospace, monospace"
            fill={style.stroke}
          >
            {connection.cableLabel}
          </text>
        </>
      )}
    </g>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ConnectionLayer({
  connections,
  devices,
  showConnections,
  containerWidth,
  containerHeight,
}: ConnectionLayerProps) {
  const deviceMap = useMemo(() => {
    const map = new Map<string, ICTMapDevice>();
    devices.forEach((d) => map.set(d.id, d));
    return map;
  }, [devices]);

  if (!showConnections || containerWidth === 0 || containerHeight === 0) {
    return null;
  }

  // Collect unique connection types for marker defs
  const usedTypes = Array.from(new Set(connections.map((c) => c.connectionType ?? 'UNKNOWN')));

  return (
    <svg
      style={{
        position:      'absolute',
        inset:         0,
        pointerEvents: 'none',
        zIndex:        10,
        overflow:      'visible',
      }}
      width={containerWidth}
      height={containerHeight}
      aria-hidden="true"
    >
      <defs>
        {usedTypes.map((ctype) => {
          const s = CONNECTION_STYLES[ctype] ?? CONNECTION_STYLES.UNKNOWN;
          const markerId = `arrow-${ctype}`;
          return (
            <marker
              key={markerId}
              id={markerId}
              viewBox="0 0 10 10"
              refX={9}
              refY={5}
              markerWidth={6}
              markerHeight={6}
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={s.stroke} />
            </marker>
          );
        })}
      </defs>

      {connections.map((conn) => {
        const src = conn.sourceDeviceId ? deviceMap.get(conn.sourceDeviceId) : undefined;
        const tgt = conn.targetDeviceId ? deviceMap.get(conn.targetDeviceId) : undefined;

        if (!src || !tgt) return null;
        if (src.xPercent == null || src.yPercent == null) return null;
        if (tgt.xPercent == null || tgt.yPercent == null) return null;

        const x1 = (src.xPercent / 100) * containerWidth;
        const y1 = (src.yPercent / 100) * containerHeight;
        const x2 = (tgt.xPercent / 100) * containerWidth;
        const y2 = (tgt.yPercent / 100) * containerHeight;

        const ctype    = conn.connectionType ?? 'UNKNOWN';
        const markerId = `arrow-${ctype}`;

        return (
          <ConnectionLine
            key={conn.id}
            connection={conn}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            markerId={markerId}
          />
        );
      })}
    </svg>
  );
}
