'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type MapPresentationMode = 'clean' | 'detailed' | 'network';

interface OfficeMapBackgroundProps {
  mode: MapPresentationMode;
  className?: string;
}

type LabelProps = {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  anchor?: 'start' | 'middle' | 'end';
  rotate?: number;
  opacity?: number;
};

const MODE_STYLE: Record<MapPresentationMode, {
  detailOpacity: number;
  labelOpacity: number;
  furnitureOpacity: number;
  plantOpacity: number;
  lineOpacity: number;
}> = {
  clean: {
    detailOpacity: 0.55,
    labelOpacity: 0.42,
    furnitureOpacity: 0.75,
    plantOpacity: 0.65,
    lineOpacity: 0.78,
  },
  detailed: {
    detailOpacity: 1,
    labelOpacity: 0.64,
    furnitureOpacity: 0.95,
    plantOpacity: 0.92,
    lineOpacity: 1,
  },
  network: {
    detailOpacity: 0.24,
    labelOpacity: 0.18,
    furnitureOpacity: 0.32,
    plantOpacity: 0.2,
    lineOpacity: 0.48,
  },
};

function Label({ x, y, children, size = 15, anchor = 'middle', rotate = 0, opacity = 1 }: LabelProps) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}
      fill="#64748b"
      fontSize={size}
      fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
      fontWeight={700}
      letterSpacing={0}
      opacity={opacity}
      pointerEvents="none"
    >
      {children}
    </text>
  );
}

function Room({ x, y, w, h, label, labelY, labelSize = 15 }: { x: number; y: number; w: number; h: number; label?: string; labelY?: number; labelSize?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} fill="#fbfcfd" stroke="#cbd5df" strokeWidth={4} />
      <rect x={x + 8} y={y + 8} width={Math.max(0, w - 16)} height={Math.max(0, h - 16)} rx={3} fill="#ffffff" opacity={0.55} />
      {label ? <Label x={x + w / 2} y={labelY ?? y + h / 2} size={labelSize} opacity={0.58}>{label}</Label> : null}
    </g>
  );
}

function Workstation({ x, y, rotation = 0, scale = 1 }: { x: number; y: number; rotation?: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}>
      <rect x={-27} y={-18} width={54} height={36} rx={4} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1.5} />
      <rect x={-25} y={-16} width={50} height={8} rx={2} fill="#eef2f7" />
      <rect x={-22} y={4} width={18} height={7} rx={1.5} fill="#d7dde5" />
      <rect x={7} y={2} width={12} height={9} rx={1.5} fill="#cbd5e1" />
      <path d="M -15 25 Q 0 35 15 25" fill="none" stroke="#4b5563" strokeWidth={4} strokeLinecap="round" opacity={0.7} />
    </g>
  );
}

function CubiclePod({ x, y, cols, rows = 2, gapX = 72, gapY = 60, scale = 1 }: { x: number; y: number; cols: number; rows?: number; gapX?: number; gapY?: number; scale?: number }) {
  const stations = Array.from({ length: cols * rows }, (_, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    return { x: x + col * gapX, y: y + row * gapY, flip: row % 2 === 1 };
  });

  const width = (cols - 1) * gapX + 82;
  const height = (rows - 1) * gapY + 76;

  return (
    <g opacity={0.98}>
      <rect x={x - 42} y={y - 36} width={width} height={height} rx={6} fill="none" stroke="#d8dde3" strokeWidth={6} />
      <path d={`M ${x - 42} ${y + 1} H ${x + width - 42}`} stroke="#e3e7ec" strokeWidth={7} strokeLinecap="round" />
      {Array.from({ length: Math.max(0, cols - 1) }, (_, col) => (
        <path key={col} d={`M ${x + col * gapX + gapX / 2} ${y - 34} V ${y + height - 36}`} stroke="#e3e7ec" strokeWidth={5} strokeLinecap="round" />
      ))}
      {stations.map((station, index) => (
        <Workstation key={index} x={station.x} y={station.y} rotation={station.flip ? 180 : 0} scale={scale} />
      ))}
    </g>
  );
}

function ReceptionDesk({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-220} y={-54} width={440} height={108} rx={8} fill="#f8fafc" stroke="#c9d0d8" strokeWidth={4} />
      <rect x={-205} y={-39} width={410} height={34} rx={5} fill="#eceff3" />
      <rect x={-205} y={8} width={410} height={30} rx={4} fill="#ffffff" stroke="#d6dce4" />
      <path d="M -150 74 Q -125 94 -100 74" fill="none" stroke="#4b5563" strokeWidth={8} strokeLinecap="round" opacity={0.72} />
      <path d="M -35 74 Q -10 94 15 74" fill="none" stroke="#4b5563" strokeWidth={8} strokeLinecap="round" opacity={0.72} />
      <path d="M 85 74 Q 110 94 135 74" fill="none" stroke="#4b5563" strokeWidth={8} strokeLinecap="round" opacity={0.72} />
      <Label x={0} y={-68} size={16} opacity={0.7}>ASSISTANCE DESK</Label>
    </g>
  );
}

function PlantCluster({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  const leaves = [
    [-18, -12, 15, '#2f855a'],
    [-3, -21, 17, '#38a169'],
    [14, -12, 14, '#2f855a'],
    [-11, 6, 13, '#276749'],
    [9, 5, 15, '#48bb78'],
  ] as const;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx={0} cy={13} rx={26} ry={9} fill="#7c6f57" opacity={0.36} />
      {leaves.map(([lx, ly, r, color], index) => (
        <ellipse key={index} cx={lx} cy={ly} rx={r} ry={r * 0.55} fill={color} opacity={0.88} transform={`rotate(${index * 34} ${lx} ${ly})`} />
      ))}
      <rect x={-11} y={7} width={22} height={16} rx={3} fill="#8b6f47" opacity={0.78} />
    </g>
  );
}

function GlassCorridor({ mode }: { mode: MapPresentationMode }) {
  const paneOpacity = mode === 'network' ? 0.18 : mode === 'clean' ? 0.34 : 0.5;
  return (
    <g>
      <rect x={1246} y={56} width={274} height={636} rx={8} fill="#d9f0fb" opacity={paneOpacity} stroke="#8ecae6" strokeWidth={4} />
      <rect x={1262} y={72} width={242} height={604} rx={5} fill="#f8fdff" opacity={0.24} />
      {Array.from({ length: 7 }, (_, index) => {
        const y = 84 + index * 82;
        return <path key={index} d={`M 1260 ${y} H 1505`} stroke="#8ecae6" strokeWidth={2} opacity={0.42} />;
      })}
      {Array.from({ length: 5 }, (_, index) => {
        const x = 1294 + index * 42;
        return <path key={index} d={`M ${x} 72 V 676`} stroke="#9bd4ea" strokeWidth={1.5} opacity={0.3} />;
      })}
      <path d="M 1235 74 V 676" stroke="#8ecae6" strokeWidth={8} strokeLinecap="round" opacity={0.46} />
      <Label x={1390} y={708} size={16} opacity={mode === 'network' ? 0.18 : 0.52}>GLASS CORRIDOR</Label>
    </g>
  );
}

function FloorHighlights({ opacity }: { opacity: number }) {
  const highlights = [
    [315, 570, 130],
    [495, 585, 110],
    [710, 570, 150],
    [955, 610, 118],
    [1130, 575, 92],
    [1375, 530, 120],
  ];
  return (
    <g opacity={opacity}>
      {highlights.map(([x, y, width], index) => (
        <rect key={index} x={x} y={y} width={width} height={8} rx={4} fill="#ffffff" opacity={0.42} transform={`rotate(-7 ${x} ${y})`} />
      ))}
    </g>
  );
}

function OfficeRooms({ labelOpacity }: { labelOpacity: number }) {
  return (
    <g>
      <Room x={62} y={58} w={220} h={176} label="OFFICE" labelSize={14} />
      <Room x={62} y={246} w={220} h={234} label="ADMIN" labelSize={14} />
      <Room x={62} y={490} w={220} h={92} label="STORAGE" labelSize={13} />
      <Room x={62} y={606} w={220} h={82} label="SUPPORT" labelSize={13} />

      <Room x={312} y={58} w={120} h={142} />
      <Room x={448} y={58} w={120} h={142} />
      <Room x={584} y={58} w={120} h={142} />
      <Room x={720} y={58} w={120} h={142} />
      <Room x={856} y={58} w={120} h={142} />
      <Room x={990} y={58} w={224} h={142} label="OFFICE ROOMS" labelY={134} labelSize={14} />

      <Room x={920} y={250} w={246} h={336} label="CONFERENCE" labelSize={15} />
      <Room x={1172} y={298} w={136} h={288} label="TRAINING" labelSize={14} />
      <Room x={1326} y={58} w={194} h={180} label="OFFICE" labelSize={14} />
      <Room x={1326} y={250} w={194} h={248} label="WORK AREA" labelSize={14} />
      <Room x={1326} y={506} w={194} h={182} label="RECORDS" labelSize={14} />

      <Label x={610} y={244} size={16} opacity={labelOpacity}>OPEN CUBICLE AREA</Label>
      <Label x={760} y={455} size={15} opacity={labelOpacity}>MAIN HALLWAY</Label>
      <Label x={1128} y={226} size={13} opacity={labelOpacity}>SERVICE HALL</Label>
    </g>
  );
}

function Partitions({ opacity }: { opacity: number }) {
  return (
    <g opacity={opacity} stroke="#d6dce3" strokeWidth={6} strokeLinecap="round" fill="none">
      <path d="M 294 198 H 365" />
      <path d="M 430 198 H 494" />
      <path d="M 566 198 H 632" />
      <path d="M 704 198 H 770" />
      <path d="M 840 198 H 906" />
      <path d="M 304 430 H 916" />
      <path d="M 610 430 V 584" />
      <path d="M 304 314 H 880" opacity={0.34} />
      <path d="M 284 486 V 570" />
      <path d="M 1196 210 V 606" />
      <path d="M 1288 232 V 690" opacity={0.48} />
    </g>
  );
}

function DetailedFurniture({ mode }: { mode: MapPresentationMode }) {
  const style = MODE_STYLE[mode];
  return (
    <g opacity={style.furnitureOpacity}>
      <CubiclePod x={390} y={286} cols={5} rows={2} />
      <CubiclePod x={426} y={392} cols={4} rows={2} gapX={78} gapY={58} scale={0.96} />
      <CubiclePod x={790} y={300} cols={3} rows={2} gapX={74} gapY={58} scale={0.94} />
      <CubiclePod x={975} y={618} cols={3} rows={1} gapX={78} scale={0.92} />
      <CubiclePod x={1352} y={338} cols={2} rows={2} gapX={76} gapY={62} scale={0.92} />

      <ReceptionDesk x={560} y={610} />

      <rect x={952} y={388} width={176} height={82} rx={20} fill="#f7f4ec" stroke="#cbd5df" strokeWidth={3} />
      <rect x={986} y={404} width={108} height={50} rx={16} fill="#ffffff" stroke="#dde3ea" strokeWidth={2} />
      <path d="M 934 420 Q 914 438 934 456" stroke="#4b5563" strokeWidth={7} fill="none" opacity={0.55} />
      <path d="M 1144 420 Q 1164 438 1144 456" stroke="#4b5563" strokeWidth={7} fill="none" opacity={0.55} />
    </g>
  );
}

function Plants({ opacity }: { opacity: number }) {
  return (
    <g opacity={opacity}>
      <PlantCluster x={142} y={518} scale={1.24} />
      <PlantCluster x={198} y={548} scale={0.92} />
      <PlantCluster x={1180} y={640} scale={1.14} />
      <PlantCluster x={1230} y={648} scale={0.94} />
      <PlantCluster x={1340} y={565} scale={0.74} />
      <Label x={174} y={584} size={12} opacity={0.44}>PLANT ZONE</Label>
      <Label x={1218} y={692} size={12} opacity={0.44}>PLANT ZONE</Label>
    </g>
  );
}

export function OfficeMapBackground({ mode, className }: OfficeMapBackgroundProps) {
  const style = MODE_STYLE[mode];
  const showDetailedObjects = mode !== 'network';
  const tileId = `office-floor-tiles-${mode}`;
  const fineTileId = `office-floor-fine-tiles-${mode}`;

  return (
    <svg
      className={cn('h-full w-full bg-[#f6f1e7]', className)}
      viewBox="0 0 1600 750"
      preserveAspectRatio="none"
      role="img"
      aria-label="Clean top view office layout background"
      data-canvasbg="true"
    >
      <defs>
        <pattern id={tileId} width="80" height="80" patternUnits="userSpaceOnUse">
          <rect width="80" height="80" fill="#f8f3e8" />
          <path d="M 80 0 H 0 V 80" fill="none" stroke="#ddd4c4" strokeWidth="1.25" opacity="0.78" />
        </pattern>
        <pattern id={fineTileId} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 H 0 V 40" fill="none" stroke="#fefcf8" strokeWidth="0.75" opacity="0.5" />
        </pattern>
        <filter id="soft-room-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#94a3b8" floodOpacity="0.12" />
        </filter>
      </defs>

      <rect width="1600" height="750" fill={`url(#${tileId})`} data-canvasbg="true" />
      <rect width="1600" height="750" fill={`url(#${fineTileId})`} opacity={mode === 'network' ? 0.22 : 0.6} data-canvasbg="true" />
      <FloorHighlights opacity={mode === 'detailed' ? 0.72 : 0.24} />

      <g filter="url(#soft-room-shadow)">
        <OfficeRooms labelOpacity={style.labelOpacity} />
      </g>

      <GlassCorridor mode={mode} />
      <Partitions opacity={style.lineOpacity} />

      {showDetailedObjects ? <DetailedFurniture mode={mode} /> : null}
      {showDetailedObjects ? <Plants opacity={style.plantOpacity} /> : null}

      <g opacity={style.detailOpacity}>
        <rect x={38} y={34} width={1524} height={682} rx={6} fill="none" stroke="#b9c1ca" strokeWidth={9} />
        <path d="M 284 58 V 688" stroke="#cbd5df" strokeWidth={5} opacity={0.65} />
        <path d="M 1234 58 V 690" stroke="#cbd5df" strokeWidth={5} opacity={0.55} />
      </g>

      <Label x={555} y={704} size={15} opacity={style.labelOpacity}>FRONT ASSISTANCE AND PUBLIC SERVICE AREA</Label>
    </svg>
  );
}