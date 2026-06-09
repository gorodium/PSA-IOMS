"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type { ICTMapFurniture, ICTMapSeat, ICTMapDevice, ICTMapConnection } from "@/app/(app)/ict-management/infrastructure-map/actions";
import { FurnitureObject } from "./FurnitureObject";
import { EmployeeSeatMarker } from "./EmployeeSeatMarker";
import { DeviceMarker } from "./DeviceMarker";
import { ConnectionLayer } from "./ConnectionLayer";
import { updateItemPositionAction } from "@/app/(app)/ict-management/infrastructure-map/actions";
import { OfficeMapBackground, type MapPresentationMode } from "./OfficeMapBackground";

type Layers = {
  background: boolean;
  furniture: boolean;
  seats: boolean;
  devices: boolean;
  connections: boolean;
  labels: boolean;
  status: boolean;
};

type Props = {
  imageUrl: string | null;
  furniture: ICTMapFurniture[];
  seats: ICTMapSeat[];
  devices: ICTMapDevice[];
  connections: ICTMapConnection[];
  layers: Layers;
  mapPresentation: MapPresentationMode;
  isEditMode: boolean;
  isAdmin: boolean;
  zoom: number;
  panX: number;
  panY: number;
  onZoomChange: (z: number) => void;
  onPanChange: (x: number, y: number) => void;
  onSelectDevice: (id: string | null) => void;
  onSelectFurniture: (id: string | null) => void;
  onSelectSeat: (id: string | null) => void;
  selectedDeviceId: string | null;
  selectedFurnitureId: string | null;
  selectedSeatId: string | null;
  onMapClick?: (xPercent: number, yPercent: number) => void;
  onDataRefresh: () => void;
};

const MIN_ZOOM = 0.3;
const MAX_ZOOM = 3;

export function MapCanvas({
  imageUrl, furniture, seats, devices, connections, layers, mapPresentation,
  isEditMode, zoom, panX, panY, onZoomChange, onPanChange,
  onSelectDevice, onSelectFurniture, onSelectSeat,
  selectedDeviceId, selectedFurnitureId, selectedSeatId,
  onMapClick, onDataRefresh,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const isPanning = useRef(false);
  const lastPan = useRef({ x: 0, y: 0 });

  // Track container size
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({ w: entry.contentRect.width, h: entry.contentRect.height });
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    onZoomChange(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom + delta * zoom)));
  }, [zoom, onZoomChange]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Pan with middle mouse or shift+drag on background
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      isPanning.current = true;
      lastPan.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastPan.current.x;
    const dy = e.clientY - lastPan.current.y;
    onPanChange(panX + dx, panY + dy);
    lastPan.current = { x: e.clientX, y: e.clientY };
  }, [isPanning, panX, panY, onPanChange]);

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  // Click on canvas background
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    // If clicking directly on canvas (not on a marker)
    const target = e.target as HTMLElement;
    if (target === e.currentTarget || target.dataset.canvasbg === "true") {
      onSelectDevice(null);
      onSelectFurniture(null);
      onSelectSeat(null);
      if (onMapClick) {
        const rect = e.currentTarget.getBoundingClientRect();
        const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
        const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
        onMapClick(xPercent, yPercent);
      }
    }
  }, [onSelectDevice, onSelectFurniture, onSelectSeat, onMapClick]);

  const handleDragEnd = useCallback(async (
    itemType: "furniture" | "seat" | "device",
    id: string,
    xPercent: number,
    yPercent: number
  ) => {
    await updateItemPositionAction(itemType, id, xPercent, yPercent);
    onDataRefresh();
  }, [onDataRefresh]);

  // The canvas map area occupies a 16:9 aspect within the container
  // but we use percentage-based positions so it's agnostic of actual size
  const mapStyle: React.CSSProperties = {
    transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
    transformOrigin: "center center",
    transition: isPanning.current ? "none" : "transform 0.05s ease",
    position: "relative",
    width: "100%",
    height: "100%",
    cursor: isEditMode ? "crosshair" : isPanning.current ? "grabbing" : "grab",
  };

  return (
    <div
      ref={containerRef}
      className="relative flex-1 overflow-hidden bg-[#ede5d8] select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div style={mapStyle} onClick={handleCanvasClick}>
        {/* Background layer */}
        {layers.background && (
          <div className="absolute inset-0 overflow-hidden" data-canvasbg="true">
            <OfficeMapBackground
              mode={mapPresentation}
              className="absolute inset-0 pointer-events-none"
            />
            {imageUrl && mapPresentation === "detailed" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-fill opacity-[0.035] mix-blend-multiply pointer-events-none"
                draggable={false}
                data-canvasbg="true"
              />
            )}
          </div>
        )}
        {/* Connection layer — SVG */}
        {layers.connections && (
          <ConnectionLayer
            connections={connections}
            devices={devices}
            showConnections={true}
            containerWidth={containerSize.w}
            containerHeight={containerSize.h}
          />
        )}

        {/* Furniture layer */}
        {layers.furniture &&
          furniture.map((f) => (
            <FurnitureObject
              key={f.id}
              furniture={f}
              isSelected={selectedFurnitureId === f.id}
              showLabels={layers.labels}
              isEditMode={isEditMode}
              onSelect={onSelectFurniture}
              onDragEnd={(id, x, y) => handleDragEnd("furniture", id, x, y)}
            />
          ))}

        {/* Seat layer */}
        {layers.seats &&
          seats.map((s) => (
            <EmployeeSeatMarker
              key={s.id}
              seat={s}
              isSelected={selectedSeatId === s.id}
              showLabels={layers.labels}
              isEditMode={isEditMode}
              onSelect={onSelectSeat}
              onDragEnd={(id, x, y) => handleDragEnd("seat", id, x, y)}
            />
          ))}

        {/* Device layer */}
        {layers.devices &&
          devices.map((d) => (
            <DeviceMarker
              key={d.id}
              device={d}
              isSelected={selectedDeviceId === d.id}
              showLabels={layers.labels}
              isEditMode={isEditMode}
              onSelect={onSelectDevice}
              onDragEnd={(id, x, y) => handleDragEnd("device", id, x, y)}
            />
          ))}
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-1 text-xs text-white font-mono pointer-events-none">
        {Math.round(zoom * 100)}%
      </div>

      {/* Edit mode indicator */}
      {isEditMode && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500/90 px-4 py-1 text-xs font-semibold text-white shadow-lg pointer-events-none">
          ✏️ Edit Mode Active — Drag items to reposition
        </div>
      )}
    </div>
  );
}
