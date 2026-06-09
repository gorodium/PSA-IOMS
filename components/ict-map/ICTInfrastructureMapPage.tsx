"use client";

import { useState, useCallback, useRef, useEffect, useTransition } from "react";
import {
  Activity, ChevronDown, Download, HardDrive, Laptop, Lock, LockOpen,
  Monitor, Network, Plus, RefreshCw, Search, Server, Settings, Shield,
  Upload, Users, Wifi, Zap, AlertTriangle, CheckCircle, XCircle,
  HelpCircle, Printer, Camera, Battery, Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type {
  ICTMapPageData, ICTMapDevice, ICTMapFurniture, ICTMapSeat, ICTMapConnection, ICTMap
} from "@/app/(app)/ict-management/infrastructure-map/actions";
import {
  getICTMapPageDataAction, uploadMapBackgroundAction, createNetworkMapAction,
  setActiveMapAction, toggleMapLockAction, deleteNetworkMapAction,
  addNetworkDeviceAction, deleteNetworkDeviceAction,
  addFurnitureAction, deleteFurnitureAction,
  addEmployeeSeatAction, deleteEmployeeSeatAction,
  addNetworkConnectionAction, deleteNetworkConnectionAction,
} from "@/app/(app)/ict-management/infrastructure-map/actions";
import { MapCanvas } from "./MapCanvas";
import { MapToolbar } from "./MapToolbar";
import { LayerTogglePanel } from "./LayerTogglePanel";
import { AdminMapTools } from "./AdminMapTools";
import { DeviceDrawer } from "./DeviceDrawer";
import { FurnitureDrawer } from "./FurnitureDrawer";
import { EmployeeSeatDrawer } from "./EmployeeSeatDrawer";
import DeviceForm from "./DeviceForm";
import FurnitureForm from "./FurnitureForm";
import ConnectionForm from "./ConnectionForm";
import { DeviceInventoryTable } from "./DeviceInventoryTable";
import { ConnectionTable } from "./ConnectionTable";
import LogicalTopology from "./LogicalTopology";
import type { MapPresentationMode } from "./OfficeMapBackground";

type Personnel = {
  id: string;
  fullName: string;
  position: string;
  section: string;
  photoUrl: string | null;
};

type Props = {
  initialData: ICTMapPageData;
  personnel: Personnel[];
};

type Layers = {
  background: boolean;
  furniture: boolean;
  seats: boolean;
  devices: boolean;
  connections: boolean;
  labels: boolean;
  status: boolean;
};

function StatusBadge({ status }: { status: string }) {
  if (status === "ONLINE") return <Badge className="bg-green-500/15 text-green-700 dark:text-green-400 border-green-300 hover:bg-green-500/20 gap-1"><CheckCircle className="h-3 w-3" />Online</Badge>;
  if (status === "OFFLINE") return <Badge className="bg-red-500/15 text-red-700 dark:text-red-400 border-red-300 hover:bg-red-500/20 gap-1"><XCircle className="h-3 w-3" />Offline</Badge>;
  if (status === "WARNING") return <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-300 hover:bg-amber-500/20 gap-1"><AlertTriangle className="h-3 w-3" />Warning</Badge>;
  return <Badge variant="outline" className="gap-1 text-muted-foreground"><HelpCircle className="h-3 w-3" />Unknown</Badge>;
}

function KpiCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <Card className="flex-1 min-w-[110px]">
      <CardContent className="pt-3 pb-3 px-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{label}</p>
            <p className={cn("text-2xl font-bold mt-0.5", color)}>{value}</p>
          </div>
          <Icon className={cn("h-8 w-8 opacity-20", color)} />
        </div>
      </CardContent>
    </Card>
  );
}

export function ICTInfrastructureMapPage({ initialData, personnel }: Props) {
  const [data, setData] = useState<ICTMapPageData>(initialData);
  const [activeTab, setActiveTab] = useState("map");
  const [, startTransition] = useTransition();

  // Map state
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [layers, setLayers] = useState<Layers>({
    background: true, furniture: true, seats: true,
    devices: true, connections: true, labels: true, status: true,
  });
  const [mapPresentation, setMapPresentation] = useState<MapPresentationMode>("detailed");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenRef = useRef<HTMLDivElement>(null);

  // Selection state
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [selectedFurnitureId, setSelectedFurnitureId] = useState<string | null>(null);
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);

  // Admin tool state
  const [activeTool, setActiveTool] = useState("select");
  const [isDeviceFormOpen, setIsDeviceFormOpen] = useState(false);
  const [isFurnitureFormOpen, setIsFurnitureFormOpen] = useState(false);
  const [isConnectionFormOpen, setIsConnectionFormOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<ICTMapDevice | null>(null);
  const [editingFurniture, setEditingFurniture] = useState<ICTMapFurniture | null>(null);
  const [editingConnection, setEditingConnection] = useState<ICTMapConnection | null>(null);

  // Upload / map management
  const [isCreateMapOpen, setIsCreateMapOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isMapSelectorOpen, setIsMapSelectorOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  const showToast = useCallback((msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const refreshData = useCallback((mapId?: string) => {
    startTransition(async () => {
      const fresh = await getICTMapPageDataAction(mapId ?? data.activeMap?.id);
      setData(fresh);
    });
  }, [data.activeMap?.id]);

  // Fullscreen
  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement && fullscreenRef.current) {
      fullscreenRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Fit to screen
  const handleFitToScreen = useCallback(() => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  }, []);

  // Map click handler (when adding in edit mode)
  const handleMapClick = useCallback((xPercent: number, yPercent: number) => {
    if (!isEditMode || !data.activeMap) return;
    if (activeTool === "device") {
      setEditingDevice(null);
      setIsDeviceFormOpen(true);
    } else if (activeTool === "furniture") {
      setEditingFurniture(null);
      setIsFurnitureFormOpen(true);
    } else if (activeTool === "seat") {
      // Quick add seat at click position
    }
  }, [isEditMode, activeTool, data.activeMap]);

  const handleSelectDevice = useCallback((id: string | null) => {
    setSelectedDeviceId(id);
    setSelectedFurnitureId(null);
    setSelectedSeatId(null);
    if (id && isEditMode && activeTool === "delete") {
      if (confirm("Delete this device?")) {
        deleteNetworkDeviceAction(id).then(() => { showToast("Device deleted."); refreshData(); });
      }
    }
  }, [isEditMode, activeTool, showToast, refreshData]);

  const handleSelectFurniture = useCallback((id: string | null) => {
    setSelectedFurnitureId(id);
    setSelectedDeviceId(null);
    setSelectedSeatId(null);
    if (id && isEditMode && activeTool === "delete") {
      if (confirm("Delete this furniture?")) {
        deleteFurnitureAction(id).then(() => { showToast("Furniture deleted."); refreshData(); });
      }
    }
  }, [isEditMode, activeTool, showToast, refreshData]);

  const handleSelectSeat = useCallback((id: string | null) => {
    setSelectedSeatId(id);
    setSelectedDeviceId(null);
    setSelectedFurnitureId(null);
    if (id && isEditMode && activeTool === "delete") {
      if (confirm("Delete this seat?")) {
        deleteEmployeeSeatAction(id).then(() => { showToast("Seat deleted."); refreshData(); });
      }
    }
  }, [isEditMode, activeTool, showToast, refreshData]);

  const selectedDevice = data.devices.find((d) => d.id === selectedDeviceId) ?? null;
  const selectedFurnitureItem = data.furniture.find((f) => f.id === selectedFurnitureId) ?? null;
  const selectedSeatItem = data.seats.find((s) => s.id === selectedSeatId) ?? null;

  // Upload background
  const handleUploadBackground = useCallback(async () => {
    if (!uploadFile || !data.activeMap) return;
    const fd = new FormData();
    fd.append("image", uploadFile);
    const res = await uploadMapBackgroundAction(data.activeMap.id, fd);
    if (res.ok) { showToast("Background uploaded!"); setIsUploadOpen(false); refreshData(); }
    else showToast(res.message, false);
  }, [uploadFile, data.activeMap, showToast, refreshData]);

  // Create map
  const handleCreateMap = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await createNetworkMapAction(fd);
    if (res.ok) { showToast("Map created!"); setIsCreateMapOpen(false); refreshData(res.id); }
    else showToast(res.message, false);
  }, [showToast, refreshData]);

  // Toggle map lock
  const handleToggleLock = useCallback(async () => {
    if (!data.activeMap) return;
    const res = await toggleMapLockAction(data.activeMap.id);
    if (res.ok) { showToast(res.message); refreshData(); }
  }, [data.activeMap, showToast, refreshData]);

  const { kpi, isAdmin } = data;

  return (
    <div className="flex flex-col gap-4">
      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed top-20 right-4 z-[200] rounded-lg px-4 py-3 text-sm font-medium shadow-lg border transition-all",
          toast.ok
            ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:text-green-200"
            : "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:text-red-200"
        )}>
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
            <Network className="h-6 w-6 text-primary" />
            ICT Infrastructure Map
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Office Network Operations Map — mapped ICT assets, workstations, printers, access points, and connection references.
          </p>
          {data.activeMap && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
              <span className="font-medium">{data.activeMap.name}</span>
              {data.activeMap.isLocked && <Lock className="h-3 w-3 text-amber-500" />}
              {!data.activeMap.isActive && <Badge variant="outline" className="text-[10px] py-0">Inactive</Badge>}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => refreshData()}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          {isAdmin && (
            <>
              {data.activeMap && (
                <Button variant="outline" size="sm" onClick={() => setIsUploadOpen(true)}>
                  <Upload className="h-4 w-4" />
                  Upload Map
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setIsMapSelectorOpen(true)}>
                <Settings className="h-4 w-4" />
                Manage Maps
              </Button>
              {!data.activeMap && (
                <Button size="sm" onClick={() => setIsCreateMapOpen(true)}>
                  <Plus className="h-4 w-4" />
                  New Map
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="flex flex-wrap gap-3">
        <KpiCard label="Total Devices" value={kpi.totalDevices} icon={Cpu} color="text-slate-700 dark:text-slate-300" />
        <KpiCard label="Online" value={kpi.online} icon={CheckCircle} color="text-green-600" />
        <KpiCard label="Offline" value={kpi.offline} icon={XCircle} color="text-red-600" />
        <KpiCard label="Warning" value={kpi.warning} icon={AlertTriangle} color="text-amber-600" />
        <KpiCard label="Unknown" value={kpi.unknown} icon={HelpCircle} color="text-slate-500" />
        <KpiCard label="Desks" value={kpi.totalDesks} icon={Monitor} color="text-blue-600" />
        <KpiCard label="Assigned Seats" value={kpi.assignedSeats} icon={Users} color="text-teal-600" />
        <KpiCard label="Unassigned" value={kpi.unassignedDevices} icon={HardDrive} color="text-orange-600" />
      </div>

      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search devices, employees, IP address…"
          className="pl-9 text-sm"
        />
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="map">🗺️ Physical Map</TabsTrigger>
          <TabsTrigger value="topology">🔗 Logical Topology</TabsTrigger>
          <TabsTrigger value="inventory">💻 Device Inventory</TabsTrigger>
          <TabsTrigger value="desks">🪑 Desk Layout</TabsTrigger>
          <TabsTrigger value="connections">📡 Connections</TabsTrigger>
          {isAdmin && <TabsTrigger value="admin">⚙️ Admin Tools</TabsTrigger>}
        </TabsList>

        {/* Physical Map Tab */}
        <TabsContent value="map" className="mt-3">
          {!data.activeMap ? (
            <div className="rounded-lg border-2 border-dashed p-16 text-center">
              <Network className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-1">No ICT Map Background Uploaded Yet</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                Upload or configure a floor plan background to begin mapping ICT assets.
              </p>
              {isAdmin && (
                <Button onClick={() => setIsCreateMapOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Create First Map
                </Button>
              )}
            </div>
          ) : (
            <div ref={fullscreenRef} className={cn("flex flex-col gap-2 rounded-lg bg-slate-100 dark:bg-slate-900 overflow-hidden border", isFullscreen && "fixed inset-0 z-[100] rounded-none border-0")}>
              {/* Map toolbar row */}
              <div className="flex flex-wrap items-center gap-2 px-3 pt-2 pb-1 border-b bg-background/80 backdrop-blur-sm">
                <MapToolbar
                  zoom={zoom}
                  onZoomIn={() => setZoom((z) => Math.min(MAX_ZOOM, z + 0.1))}
                  onZoomOut={() => setZoom((z) => Math.max(MIN_ZOOM, z - 0.1))}
                  onResetView={handleFitToScreen}
                  onFitToScreen={handleFitToScreen}
                  onToggleFullscreen={handleFullscreen}
                  isFullscreen={isFullscreen}
                  mapPresentation={mapPresentation}
                  onMapPresentationChange={setMapPresentation}
                  isAdmin={isAdmin}
                  isEditMode={isEditMode}
                  onToggleEditMode={() => { setIsEditMode((v) => !v); setActiveTool("select"); }}
                  isSaving={false}
                  onSave={() => showToast("Layout saved.")}
                  isLocked={data.activeMap.isLocked}
                  onToggleLock={handleToggleLock}
                />
                <div className="ml-auto">
                  <LayerTogglePanel layers={layers} onChange={(key, val) => setLayers((prev) => ({ ...prev, [key]: val }))} />
                </div>
              </div>

              {/* Map area + drawers */}
              <div className="relative flex" style={{ height: isFullscreen ? "calc(100vh - 56px)" : "600px" }}>
                {/* Admin tools panel */}
                {isAdmin && isEditMode && (
                  <AdminMapTools
                    activeTool={activeTool}
                    onToolSelect={setActiveTool}
                    onAddFurniture={() => { setEditingFurniture(null); setIsFurnitureFormOpen(true); }}
                    onAddSeat={async () => {
                      if (!data.activeMap) return;
                      const fd = new FormData();
                      fd.append("mapId", data.activeMap.id);
                      fd.append("seatCode", `SEAT-${Date.now()}`);
                      fd.append("xPercent", "50");
                      fd.append("yPercent", "50");
                      await addEmployeeSeatAction(fd);
                      refreshData();
                    }}
                    onAddDevice={() => { setEditingDevice(null); setIsDeviceFormOpen(true); }}
                    onAddConnection={() => { setEditingConnection(null); setIsConnectionFormOpen(true); }}
                  />
                )}

                {/* Canvas */}
                <MapCanvas
                  imageUrl={data.activeMap.imageUrl}
                  furniture={data.furniture}
                  seats={data.seats}
                  devices={data.devices}
                  connections={data.connections}
                  layers={layers}
                  mapPresentation={mapPresentation}
                  isEditMode={isAdmin && isEditMode && !data.activeMap.isLocked}
                  isAdmin={isAdmin}
                  zoom={zoom}
                  panX={panX}
                  panY={panY}
                  onZoomChange={setZoom}
                  onPanChange={(x, y) => { setPanX(x); setPanY(y); }}
                  onSelectDevice={handleSelectDevice}
                  onSelectFurniture={handleSelectFurniture}
                  onSelectSeat={handleSelectSeat}
                  selectedDeviceId={selectedDeviceId}
                  selectedFurnitureId={selectedFurnitureId}
                  selectedSeatId={selectedSeatId}
                  onMapClick={handleMapClick}
                  onDataRefresh={refreshData}
                />

                {/* Right Drawers */}
                <DeviceDrawer
                  device={selectedDevice}
                  connections={data.connections}
                  furniture={data.furniture}
                  seats={data.seats}
                  isAdmin={isAdmin}
                  onClose={() => setSelectedDeviceId(null)}
                  onEdit={(d) => { setEditingDevice(d); setIsDeviceFormOpen(true); }}
                />
                <FurnitureDrawer
                  furniture={selectedFurnitureItem}
                  seats={data.seats.filter((s) => s.furnitureId === selectedFurnitureId)}
                  devices={data.devices.filter((d) => d.furnitureId === selectedFurnitureId)}
                  isAdmin={isAdmin}
                  onClose={() => setSelectedFurnitureId(null)}
                  onEdit={(f) => { setEditingFurniture(f); setIsFurnitureFormOpen(true); }}
                />
                <EmployeeSeatDrawer
                  seat={selectedSeatItem}
                  devices={data.devices.filter((d) => d.employeeSeatId === selectedSeatId)}
                  furniture={data.furniture}
                  isAdmin={isAdmin}
                  onClose={() => setSelectedSeatId(null)}
                  onEdit={() => {}}
                />
              </div>
            </div>
          )}
        </TabsContent>

        {/* Logical Topology Tab */}
        <TabsContent value="topology" className="mt-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Logical Network Topology</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <LogicalTopology
                devices={data.devices}
                connections={data.connections}
                onDeviceClick={(d) => { setSelectedDeviceId(d.id); setActiveTab("map"); }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Device Inventory Tab */}
        <TabsContent value="inventory" className="mt-3">
          <DeviceInventoryTable
            devices={data.devices.filter((d) => {
              if (!searchQuery) return true;
              const q = searchQuery.toLowerCase();
              return (
                d.deviceCode.toLowerCase().includes(q) ||
                d.deviceName.toLowerCase().includes(q) ||
                (d.hostname ?? "").toLowerCase().includes(q) ||
                (d.ipAddress ?? "").toLowerCase().includes(q) ||
                (d.macAddress ?? "").toLowerCase().includes(q) ||
                (d.personnelName ?? "").toLowerCase().includes(q)
              );
            })}
            furniture={data.furniture}
            isAdmin={isAdmin}
            onEdit={(d) => { setEditingDevice(d); setIsDeviceFormOpen(true); }}
            onDelete={async (id) => {
              await deleteNetworkDeviceAction(id);
              showToast("Device deleted.");
              refreshData();
            }}
          />
          {isAdmin && (
            <div className="mt-3">
              <Button size="sm" onClick={() => { setEditingDevice(null); setIsDeviceFormOpen(true); }}>
                <Plus className="h-4 w-4" />
                Add Device
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Desk Layout Tab */}
        <TabsContent value="desks" className="mt-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Desk &amp; Employee Seat Layout</CardTitle>
            </CardHeader>
            <CardContent>
              {data.furniture.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">No furniture added to the map yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Code</th>
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Name</th>
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Type</th>
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Section</th>
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Room</th>
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Assigned Employee</th>
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Devices</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.furniture.map((f) => {
                        const fSeats = data.seats.filter((s) => s.furnitureId === f.id);
                        const fDevices = data.devices.filter((d) => d.furnitureId === f.id);
                        return (
                          <tr key={f.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                            <td className="py-2 px-3 font-mono text-xs">{f.furnitureCode}</td>
                            <td className="py-2 px-3">{f.furnitureName}</td>
                            <td className="py-2 px-3 text-muted-foreground capitalize text-xs">{f.type.replace(/_/g, " ")}</td>
                            <td className="py-2 px-3 text-xs text-muted-foreground">{f.section ?? "—"}</td>
                            <td className="py-2 px-3 text-xs text-muted-foreground">{f.room ?? "—"}</td>
                            <td className="py-2 px-3">
                              {fSeats.filter((s) => s.personnelName).map((s) => (
                                <span key={s.id} className="inline-flex items-center gap-1 text-xs bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded px-2 py-0.5 mr-1">
                                  {s.personnelName}
                                </span>
                              ))}
                              {fSeats.filter((s) => s.personnelName).length === 0 && <span className="text-xs text-muted-foreground italic">Vacant</span>}
                            </td>
                            <td className="py-2 px-3">
                              {fDevices.map((d) => (
                                <StatusBadge key={d.id} status={d.status} />
                              ))}
                              {fDevices.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Connections Tab */}
        <TabsContent value="connections" className="mt-3">
          <ConnectionTable
            connections={data.connections}
            isAdmin={isAdmin}
            onEdit={(c) => { setEditingConnection(c); setIsConnectionFormOpen(true); }}
            onDelete={async (id) => {
              await deleteNetworkConnectionAction(id);
              showToast("Connection deleted.");
              refreshData();
            }}
          />
          {isAdmin && (
            <div className="mt-3">
              <Button size="sm" onClick={() => { setEditingConnection(null); setIsConnectionFormOpen(true); }}>
                <Plus className="h-4 w-4" />
                Add Connection
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Admin Tools Tab */}
        {isAdmin && (
          <TabsContent value="admin" className="mt-3">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Map Management */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><Network className="h-4 w-4" />Map Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setIsCreateMapOpen(true)}>
                    <Plus className="h-4 w-4" />New Map
                  </Button>
                  {data.activeMap && (
                    <>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => setIsUploadOpen(true)}>
                        <Upload className="h-4 w-4" />Upload Background
                      </Button>
                      <Button variant="outline" size="sm" className="w-full" onClick={handleToggleLock}>
                        {data.activeMap.isLocked ? <LockOpen className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                        {data.activeMap.isLocked ? "Unlock Map" : "Lock Map"}
                      </Button>
                    </>
                  )}
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setIsMapSelectorOpen(true)}>
                    <Settings className="h-4 w-4" />All Maps
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Add */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><Plus className="h-4 w-4" />Quick Add</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => { setEditingDevice(null); setIsDeviceFormOpen(true); }} disabled={!data.activeMap}>
                    <Cpu className="h-4 w-4" />Add Device
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => { setEditingFurniture(null); setIsFurnitureFormOpen(true); }} disabled={!data.activeMap}>
                    <Monitor className="h-4 w-4" />Add Furniture
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => { setEditingConnection(null); setIsConnectionFormOpen(true); }} disabled={!data.activeMap || data.devices.length < 2}>
                    <Activity className="h-4 w-4" />Add Connection
                  </Button>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><Zap className="h-4 w-4" />Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1.5">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Total Maps</span><span className="font-medium text-foreground">{data.maps.length}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Furniture Items</span><span className="font-medium text-foreground">{data.furniture.length}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Employee Seats</span><span className="font-medium text-foreground">{data.seats.length}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Connections</span><span className="font-medium text-foreground">{data.connections.length}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Verified Connections</span><span className="font-medium text-foreground">{data.connections.filter((c) => c.isVerified).length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Modals */}

      {/* Create Map */}
      <Dialog open={isCreateMapOpen} onOpenChange={setIsCreateMapOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create New ICT Map</DialogTitle></DialogHeader>
          <form onSubmit={handleCreateMap} className="space-y-4">
            <div>
              <Label htmlFor="map-name">Map Name *</Label>
              <Input id="map-name" name="name" required placeholder="e.g. PSA MisOr Main Office" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="map-desc">Description</Label>
              <Input id="map-desc" name="description" placeholder="Optional description" className="mt-1" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateMapOpen(false)}>Cancel</Button>
              <Button type="submit">Create Map</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload background */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Upload Map Background</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Upload your SketchUp office layout image (PNG or JPG, max 10 MB).</p>
            <Input type="file" accept="image/*" onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
            <Button onClick={handleUploadBackground} disabled={!uploadFile}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Map Selector */}
      <Dialog open={isMapSelectorOpen} onOpenChange={setIsMapSelectorOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>All ICT Maps</DialogTitle></DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {data.maps.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No maps yet.</p>}
            {data.maps.map((m) => (
              <div key={m.id} className={cn("flex items-center justify-between rounded-lg border p-3", m.isActive && "border-primary bg-primary/5")}>
                <div>
                  <p className="font-medium text-sm">{m.name}</p>
                  {m.isActive && <Badge variant="default" className="text-[10px] mt-0.5">Active</Badge>}
                </div>
                <div className="flex gap-2">
                  {!m.isActive && (
                    <Button size="sm" variant="outline" onClick={async () => {
                      await setActiveMapAction(m.id);
                      refreshData(m.id);
                      setIsMapSelectorOpen(false);
                    }}>Set Active</Button>
                  )}
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={async () => {
                    if (!confirm("Delete this map and all its data?")) return;
                    await deleteNetworkMapAction(m.id);
                    showToast("Map deleted.");
                    refreshData();
                    setIsMapSelectorOpen(false);
                  }}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateMapOpen(true)}>
              <Plus className="h-4 w-4" />New Map
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Device Form */}
      {data.activeMap && (
        <DeviceForm
          mapId={data.activeMap.id}
          device={editingDevice}
          furniture={data.furniture}
          seats={data.seats}
          personnel={personnel}
          isOpen={isDeviceFormOpen}
          onClose={() => setIsDeviceFormOpen(false)}
          onSaved={() => { setIsDeviceFormOpen(false); refreshData(); }}
        />
      )}

      {/* Furniture Form */}
      {data.activeMap && (
        <FurnitureForm
          mapId={data.activeMap.id}
          furniture={editingFurniture}
          isOpen={isFurnitureFormOpen}
          onClose={() => setIsFurnitureFormOpen(false)}
          onSaved={() => { setIsFurnitureFormOpen(false); refreshData(); }}
        />
      )}

      {/* Connection Form */}
      {data.activeMap && (
        <ConnectionForm
          mapId={data.activeMap.id}
          connection={editingConnection}
          devices={data.devices}
          isOpen={isConnectionFormOpen}
          onClose={() => setIsConnectionFormOpen(false)}
          onSaved={() => { setIsConnectionFormOpen(false); refreshData(); }}
        />
      )}
    </div>
  );
}

const MAX_ZOOM = 3;
const MIN_ZOOM = 0.3;
