"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type Node,
  type Edge,
  type Connection,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { ICTMapDevice, ICTMapConnection } from "@/app/(app)/ict-management/infrastructure-map/actions";

// ── Type helpers ───────────────────────────────────────────────────────────────

type DeviceNodeData = {
  label: string;
  deviceCode: string;
  deviceType: ICTMapDevice["type"];
  status: ICTMapDevice["status"];
};

// ── Style maps ─────────────────────────────────────────────────────────────────

const TYPE_BG: Record<ICTMapDevice["type"], string> = {
  FIREWALL:      "#fee2e2", // red-100
  SWITCH:        "#dbeafe", // blue-100
  ACCESS_POINT:  "#cffafe", // cyan-100
  DESKTOP:       "#f1f5f9", // slate-100
  LAPTOP:        "#f8fafc", // slate-50
  PRINTER:       "#dcfce7", // green-100
  SERVER:        "#f3e8ff", // purple-100
  NAS:           "#e0e7ff", // indigo-100
  CCTV:          "#fef9c3", // yellow-100
  NVR:           "#fef3c7", // amber-100
  UPS:           "#d1fae5", // emerald-100
  ROUTER:        "#fed7aa", // orange-200
  IP_PHONE:      "#fce7f3", // pink-100
  OTHER:         "#f3f4f6", // gray-100
};

const STATUS_BORDER: Record<ICTMapDevice["status"], string> = {
  ONLINE:  "#22c55e", // green-500
  OFFLINE: "#ef4444", // red-500
  WARNING: "#f59e0b", // amber-500
  UNKNOWN: "#9ca3af", // gray-400
};

const STATUS_SHADOW: Record<ICTMapDevice["status"], string> = {
  ONLINE:  "0 0 0 2px #22c55e",
  OFFLINE: "0 0 0 2px #ef4444",
  WARNING: "0 0 0 2px #f59e0b",
  UNKNOWN: "0 0 0 2px #9ca3af",
};

// ── Edge style helpers ─────────────────────────────────────────────────────────

function edgeStyle(connectionType: ICTMapConnection["connectionType"]): Partial<Edge> {
  switch (connectionType) {
    case "LAN":
      return { style: { strokeWidth: 2, stroke: "#3b82f6" } };
    case "WIFI":
      return { style: { strokeWidth: 2, stroke: "#06b6d4", strokeDasharray: "6 3" }, animated: true };
    case "FIBER":
      return { style: { strokeWidth: 4, stroke: "#f97316" } };
    case "VPN":
      return { style: { strokeWidth: 2, stroke: "#8b5cf6", strokeDasharray: "4 4" }, animated: true };
    case "USB":
      return { style: { strokeWidth: 2, stroke: "#84cc16" } };
    case "SHARED_PRINTER":
      return { style: { strokeWidth: 2, stroke: "#ec4899", strokeDasharray: "3 3" } };
    case "UNKNOWN":
    default:
      return { style: { strokeWidth: 1.5, stroke: "#9ca3af", strokeDasharray: "4 4" } };
  }
}

// ── Grid layout ────────────────────────────────────────────────────────────────

const COLS = 8;
const H_GAP = 200;
const V_GAP = 140;

function deviceToNode(device: ICTMapDevice, index: number): Node<DeviceNodeData> {
  // Use stored percentage positions scaled to canvas px, with grid fallback
  const hasPosition = device.xPercent > 0 || device.yPercent > 0;
  const x = hasPosition
    ? device.xPercent * 8   // scale: 0-100 → 0-800
    : (index % COLS) * H_GAP + 40;
  const y = hasPosition
    ? device.yPercent * 6   // scale: 0-100 → 0-600
    : Math.floor(index / COLS) * V_GAP + 40;

  return {
    id: device.id,
    type: "default",
    position: { x, y },
    data: {
      label: device.deviceName,
      deviceCode: device.deviceCode,
      deviceType: device.type,
      status: device.status,
    },
    style: {
      background: TYPE_BG[device.type] ?? "#f3f4f6",
      border: `2px solid ${STATUS_BORDER[device.status] ?? "#9ca3af"}`,
      boxShadow: STATUS_SHADOW[device.status],
      borderRadius: 8,
      padding: "8px 12px",
      minWidth: 130,
      fontSize: 12,
      fontFamily: "Inter, sans-serif",
    },
  };
}

function connectionToEdge(connection: ICTMapConnection): Edge {
  const extra = edgeStyle(connection.connectionType);
  return {
    id: connection.id,
    source: connection.sourceDeviceId,
    target: connection.targetDeviceId,
    label: connection.connectionType,
    labelStyle: { fontSize: 10, fill: "#6b7280", fontFamily: "Inter, sans-serif" },
    labelBgStyle: { fill: "#ffffff", fillOpacity: 0.8 },
    ...extra,
  };
}

// ── Component ──────────────────────────────────────────────────────────────────

interface LogicalTopologyProps {
  devices: ICTMapDevice[];
  connections: ICTMapConnection[];
  onDeviceClick: (device: ICTMapDevice) => void;
}

export default function LogicalTopology({
  devices,
  connections,
  onDeviceClick,
}: LogicalTopologyProps) {
  const initialNodes = useMemo(
    () => devices.map((d, i) => deviceToNode(d, i)),
    [devices]
  );

  const initialEdges = useMemo(
    () => connections.map(connectionToEdge),
    [connections]
  );

  const [nodes, , onNodesChange] = useNodesState<Node<DeviceNodeData>>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick: NodeMouseHandler<Node<DeviceNodeData>> = useCallback(
    (_event, node) => {
      const device = devices.find((d) => d.id === node.id);
      if (device) onDeviceClick(device);
    },
    [devices, onDeviceClick]
  );

  if (devices.length === 0) {
    return (
      <div className="w-full h-[600px] flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-gray-500 gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 opacity-40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"
          />
        </svg>
        <p className="text-sm font-medium">No devices to display</p>
        <p className="text-xs text-gray-400">Add devices to the map to see the logical topology.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-lg border border-gray-200 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#d1d5db" />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(node) => {
            const data = node.data as DeviceNodeData;
            return STATUS_BORDER[data.status] ?? "#9ca3af";
          }}
          maskColor="rgba(255,255,255,0.7)"
          style={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
        />
      </ReactFlow>
    </div>
  );
}
