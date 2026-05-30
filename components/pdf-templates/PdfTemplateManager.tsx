"use client";

import { FormEvent, PointerEvent, useCallback, useEffect, useMemo, useRef, useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Archive, FileText, Save, Trash2, Undo, Upload, AlignLeft, AlignCenter, AlignRight, AlignCenterHorizontal, AlignCenterVertical, Maximize } from "lucide-react";
import {
  archivePdfTemplateAction,
  deletePdfTemplateAction,
  savePdfTemplateFieldsAction,
  setDefaultPdfTemplateAction,
  getConvocationPreviewDataAction
} from "@/app/(app)/settings/pdf-templates/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// PDF.js canvas renderer — renders the PDF page at exact pixel dimensions for
// perfect coordinate alignment between the field-placement editor and the export.
// Falls back to an <iframe> if pdfjs fails (e.g. no internet for CDN worker).
function PdfPageCanvas({ fileUrl, pageNumber, className }: { fileUrl: string; pageNumber: number; className?: string }) {
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    async function render() {
      const pdfjsLib = await import("pdfjs-dist");

      // Use the unpkg CDN for the worker so it's always available regardless
      // of local static-file serving limitations in the dev server.
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const loadingTask = pdfjsLib.getDocument(fileUrl);
      const pdfDoc = await loadingTask.promise;
      if (cancelled) { pdfDoc.destroy(); return; }

      const page = await pdfDoc.getPage(pageNumber);
      if (cancelled) { pdfDoc.destroy(); return; }

      const canvas = canvasElRef.current;
      if (!canvas) { pdfDoc.destroy(); return; }

      // Render at device pixel ratio for crisp text on HiDPI screens.
      const dpr = window.devicePixelRatio || 1;
      const containerWidth = canvas.parentElement?.clientWidth ?? 800;
      const viewport = page.getViewport({ scale: 1 });
      const scale = (containerWidth / viewport.width) * dpr;
      const scaledViewport = page.getViewport({ scale });

      canvas.width = Math.round(scaledViewport.width);
      canvas.height = Math.round(scaledViewport.height);
      canvas.style.width = "100%";
      canvas.style.height = "100%";

      const ctx = canvas.getContext("2d");
      if (!ctx) { pdfDoc.destroy(); return; }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await page.render({ canvasContext: ctx, viewport: scaledViewport } as any).promise;
      if (!cancelled) {
        pdfDoc.destroy();
        setStatus("ready");
      }
    }

    render().catch((err) => {
      console.error("[PdfPageCanvas] render failed:", err);
      if (!cancelled) setStatus("error");
    });

    return () => { cancelled = true; };
  }, [fileUrl, pageNumber]);

  if (status === "error") {
    // Fallback: iframe so the layout is always visible even if pdfjs fails.
    return (
      <iframe
        src={`${fileUrl}#page=${pageNumber}&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
        title="PDF background"
        className={className}
        style={{ border: 0, position: "absolute", top: 0, left: 0, width: "calc(100% + 20px)", height: "calc(100% + 20px)" }}
        tabIndex={-1}
      />
    );
  }

  return (
    <div className={className} style={{ position: "absolute", inset: 0 }}>
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
          Loading PDF…
        </div>
      )}
      <canvas ref={canvasElRef} style={{ display: status === "ready" ? "block" : "none", width: "100%", height: "100%" }} />
    </div>
  );
}


type PdfField = {
  id: string;
  key: string;
  label: string;
  pageNumber: number;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: "Helvetica" | "Times Roman" | "Courier" | "Roboto" | "Open Sans" | "Montserrat" | "Lato" | "Poppins" | "Inter" | "Trajan Pro";
  fontColor?: string;
  isBold: boolean;
  alignment: "left" | "center" | "right";
  maxWidth: number;
  maxHeight?: number;
  wrap: boolean;
  shrinkToFit: boolean;
};

type FieldMap = {
  version: 1;
  pageSizes: Array<{ width: number; height: number }>;
  fields: PdfField[];
};

type Template = {
  id: string;
  name: string;
  description: string | null;
  templateFeature: string;
  fileName: string;
  fileUrl: string;
  pageCount: number;
  isDefault: boolean;
  fieldMap: FieldMap;
};

type ProgramOption = {
  id: string;
  label: string;
};

const featureOptions = [
  { value: "CONVOCATION_PROGRAM", label: "Convocation Program" },
  { value: "VEHICLE_SCHEDULING", label: "Vehicle Scheduling" },
  { value: "ROOM_RESERVATION", label: "Room Reservation" },
  { value: "GENERAL", label: "General / Other" }
];

const bindingOptionsByFeature: Record<string, string[]> = {
  CONVOCATION_PROGRAM: [
    "programDate",
    "venue",
    "assignedGroup",
    "emcee",
    "openingPrayer",
    "nationalAnthem",
    "bagongPilipinas",
    "flagPledge",
    "lingkodBayanPledge",
    "psaVisionMission",
    "qualityPolicy",
    "welcomeRemarks",
    "message",
    "closingRemarks",
    "zumba",
    "preparedBy"
  ],
  VEHICLE_SCHEDULING: [
    "requestingEmployee",
    "travelDate",
    "purpose",
    "destination",
    "departureTime",
    "expectedReturnTime",
    "joiningEmployees",
    "assignedVehicle",
    "soNumber",
    "status"
  ],
  ROOM_RESERVATION: [
    "requestingEmployee",
    "roomName",
    "reservationDate",
    "reservationSchedule",
    "halfDaySlot",
    "purpose",
    "remarks",
    "status"
  ],
  GENERAL: ["customText"]
};

const initialPdfTemplateActionState = {
  ok: false,
  message: ""
};

function FormMessage({ state }: { state: { ok: boolean; message: string } }) {
  if (!state.message) return null;
  return (
    <div className={state.ok ? "rounded-md border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-800" : "rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-800"}>
      {state.message}
    </div>
  );
}

function UploadTemplateForm() {
  const router = useRouter();
  const [state, setState] = useState(initialPdfTemplateActionState);
  const [isPending, setIsPending] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const templateFeature = String(formData.get("templateFeature") ?? "GENERAL");
    const file = formData.get("file");

    if (!name || name.length < 2) {
      setState({ ok: false, message: "Template name is required." });
      return;
    }

    if (!(file instanceof File) || file.size === 0) {
      setState({ ok: false, message: "Choose a PDF template file to upload." });
      return;
    }

    if (file instanceof File && file.size > 25 * 1024 * 1024) {
      setState({ ok: false, message: "PDF template files must be 25 MB or smaller." });
      return;
    }

    setIsPending(true);
    setUploadProgress(0);
    setState(initialPdfTemplateActionState);

    const params = new URLSearchParams({
      name,
      description,
      templateFeature
    });

    try {
      const result = await new Promise<{ ok: boolean; message: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `/settings/pdf-templates/upload?${params.toString()}`);
        xhr.setRequestHeader("content-type", file.type || "application/pdf");
        xhr.setRequestHeader("x-file-name", encodeURIComponent(file.name));

        xhr.upload.onprogress = (progressEvent) => {
          if (!progressEvent.lengthComputable) {
            return;
          }

          setUploadProgress(Math.min(99, Math.round((progressEvent.loaded / progressEvent.total) * 100)));
        };

        xhr.onload = () => {
          try {
            const parsed = JSON.parse(xhr.responseText || "{}") as { ok?: boolean; message?: string };
            resolve({
              ok: Boolean(parsed.ok && xhr.status >= 200 && xhr.status < 300),
              message: parsed.message ?? (xhr.status >= 200 && xhr.status < 300 ? "PDF template uploaded." : "PDF template could not be uploaded.")
            });
          } catch {
            reject(new Error("The server returned an invalid upload response."));
          }
        };

        xhr.onerror = () => reject(new Error("The PDF template upload was interrupted. Please try again."));
        xhr.onabort = () => reject(new Error("The PDF template upload was cancelled."));
        xhr.send(file);
      });

      setUploadProgress(100);
      setState(result);

      if (result.ok) {
        form.reset();
        router.refresh();
      }
    } catch (error) {
      setState({
        ok: false,
        message: error instanceof Error ? error.message : "The PDF template upload was interrupted. Please try again with a PDF file up to 25 MB."
      });
    } finally {
      setIsPending(false);
      window.setTimeout(() => setUploadProgress(null), 900);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload PDF Template</CardTitle>
        <CardDescription>The uploaded PDF is stored as the immutable background design. Dynamic text is overlaid only during export.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpload} encType="multipart/form-data" className="grid gap-3 lg:grid-cols-[220px_1fr_1.4fr_1fr_auto]">
          <Select name="templateFeature" defaultValue="CONVOCATION_PROGRAM" aria-label="Template feature">
            {featureOptions.map((feature) => (
              <option key={feature.value} value={feature.value}>{feature.label}</option>
            ))}
          </Select>
          <Input name="name" required placeholder="Template name, e.g. Convocation Program" />
          <Input name="description" placeholder="Optional description" />
          <Input name="file" required type="file" accept="application/pdf,.pdf" />
          <Button type="submit" disabled={isPending}>
            <Upload className="h-4 w-4" />
            {isPending ? "Uploading..." : "Upload"}
          </Button>
          <div className="lg:col-span-5">
            {uploadProgress !== null && (
              <div className="mb-2 space-y-1 rounded-md border bg-slate-50 p-3 text-sm dark:bg-slate-900">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-slate-900 dark:text-slate-50">
                    {uploadProgress >= 100 ? "Upload complete" : "Uploading PDF template"}
                  </span>
                  <span className="font-semibold text-primary">{uploadProgress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
            <FormMessage state={state} />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function SaveFieldsForm({ templateId, fieldMap, onSaved }: { templateId: string; fieldMap: FieldMap; onSaved?: () => void }) {
  const [state, action, isPending] = useActionState(savePdfTemplateFieldsAction, initialPdfTemplateActionState);

  // Call onSaved after a successful save
  const prevOk = useRef(false);
  useEffect(() => {
    if (state.ok && !prevOk.current) {
      onSaved?.();
    }
    prevOk.current = state.ok;
  }, [state.ok, onSaved]);

  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="templateId" value={templateId} />
      <input type="hidden" name="fieldMapJson" value={JSON.stringify(fieldMap)} />
      <Button type="submit" disabled={isPending} className="w-full">
        <Save className="h-4 w-4" />
        {isPending ? "Saving..." : "Save Changes"}
      </Button>
      <FormMessage state={state} />
    </form>
  );
}

function SetDefaultTemplateForm({ templateId, isDefault, feature }: { templateId: string; isDefault: boolean; feature: string }) {
  const [state, action, isPending] = useActionState(setDefaultPdfTemplateAction, initialPdfTemplateActionState);

  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="templateId" value={templateId} />
      <Button type="submit" variant="secondary" className="w-full" disabled={isDefault || isPending}>
        {isPending ? "Saving..." : isDefault ? "Currently Default" : `Set as Default for ${feature}`}
      </Button>
      <FormMessage state={state} />
    </form>
  );
}

export function PdfTemplateManager({ templates, programs }: { templates: Template[]; programs: ProgramOption[] }) {
  const [selectedFeature, setSelectedFeature] = useState("CONVOCATION_PROGRAM");
  const visibleTemplates = templates.filter((template) => template.templateFeature === selectedFeature);
  const [selectedTemplateId, setSelectedTemplateId] = useState(visibleTemplates[0]?.id ?? "");
  const [selectedProgramId, setSelectedProgramId] = useState(programs[0]?.id ?? "");
  const [previewData, setPreviewData] = useState<Record<string, string> | null>(null);
  const [isFetchingPreview, setIsFetchingPreview] = useState(false);

  // Fetch real program data whenever selectedProgramId changes
  useEffect(() => {
    if (!selectedProgramId) { setPreviewData(null); return; }
    setIsFetchingPreview(true);
    getConvocationPreviewDataAction(selectedProgramId)
      .then(data => setPreviewData(data))
      .finally(() => setIsFetchingPreview(false));
  }, [selectedProgramId]);
  const selectedTemplate = visibleTemplates.find((template) => template.id === selectedTemplateId) ?? visibleTemplates[0] ?? null;
  const bindingOptions = bindingOptionsByFeature[selectedTemplate?.templateFeature ?? selectedFeature] ?? bindingOptionsByFeature.GENERAL;
  const [fieldMapsByTemplate, setFieldMapsByTemplate] = useState<Record<string, FieldMap>>(
    Object.fromEntries(templates.map((template) => [template.id, template.fieldMap]))
  );
  // Track last-saved fieldMaps to detect unsaved changes
  const [savedFieldMaps, setSavedFieldMaps] = useState<Record<string, FieldMap>>(
    Object.fromEntries(templates.map((template) => [template.id, template.fieldMap]))
  );
  const fieldMap = selectedTemplate ? fieldMapsByTemplate[selectedTemplate.id] : null;
  const [pageNumber, setPageNumber] = useState(1);
  const [layoutColumns, setLayoutColumns] = useState(1);
  const [fieldToInsert, setFieldToInsert] = useState("");
  const [snapLines, setSnapLines] = useState<{ x?: number; y?: number }>({});
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [resizingFieldId, setResizingFieldId] = useState<string | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(fieldMap?.fields[0]?.id ?? null);
  // Multi-select state
  const [selectedFieldIds, setSelectedFieldIds] = useState<Set<string>>(new Set());
  // Marquee (rubber-band) selection state — coords in PDF points
  const [marquee, setMarquee] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const marqueeStartRef = useRef<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Undo History & Interaction States
  const fieldHistory = useRef<Record<string, FieldMap[]>>({});
  const isInteractingRef = useRef(false);
  const dragStartFieldMapRef = useRef<FieldMap | null>(null);

  const startInteraction = useCallback(() => {
    if (!selectedTemplate) return;
    isInteractingRef.current = true;
    dragStartFieldMapRef.current = fieldMapsByTemplate[selectedTemplate.id];
  }, [selectedTemplate, fieldMapsByTemplate]);

  const endInteraction = useCallback(() => {
    if (!isInteractingRef.current) return;
    isInteractingRef.current = false;
    if (!selectedTemplate || !dragStartFieldMapRef.current) return;
    
    const current = fieldMapsByTemplate[selectedTemplate.id];
    const start = dragStartFieldMapRef.current;
    
    if (JSON.stringify(current) !== JSON.stringify(start)) {
      const stack = fieldHistory.current[selectedTemplate.id] ?? [];
      fieldHistory.current[selectedTemplate.id] = [...stack.slice(-49), start];
    }
    dragStartFieldMapRef.current = null;
  }, [selectedTemplate, fieldMapsByTemplate]);

  const undo = useCallback(() => {
    if (!selectedTemplate) return;
    const stack = fieldHistory.current[selectedTemplate.id];
    if (!stack || stack.length === 0) return;
    
    const prev = stack[stack.length - 1];
    fieldHistory.current[selectedTemplate.id] = stack.slice(0, -1);
    
    setFieldMapsByTemplate((current) => ({
      ...current,
      [selectedTemplate.id]: prev
    }));
    
    const selectedStillExists = prev.fields.some((f) => f.id === selectedFieldId);
    if (!selectedStillExists) {
      setSelectedFieldId(prev.fields[0]?.id ?? null);
    }
  }, [selectedTemplate, selectedFieldId]);

  const canUndo = selectedTemplate
    ? (fieldHistory.current[selectedTemplate.id]?.length ?? 0) > 0
    : false;

  // These must be defined BEFORE the keyboard useEffect that depends on them
  const pageSize = fieldMap?.pageSizes[pageNumber - 1] ?? { width: 612, height: 792 };
  const fieldsOnPage = useMemo(
    () => fieldMap?.fields.filter((field) => field.pageNumber === pageNumber) ?? [],
    [fieldMap?.fields, pageNumber]
  );

  const selectAll = useCallback(() => {
    setSelectedFieldIds(new Set(fieldsOnPage.map((f) => f.id)));
  }, [fieldsOnPage]);

  const clearMultiSelect = useCallback(() => {
    setSelectedFieldIds(new Set());
  }, []);

  // Shared arrow-key movement — moves all selected fields (or just the primary one)
  const moveGroupByArrow = useCallback((dx: number, dy: number) => {
    if (!fieldMap || !selectedTemplate) return;
    // Determine which field IDs to move
    const ids: string[] = selectedFieldIds.size > 1
      ? Array.from(selectedFieldIds)
      : selectedFieldId ? [selectedFieldId] : [];
    if (ids.length === 0) return;

    const updated = fieldMap.fields.map((f) => {
      if (!ids.includes(f.id)) return f;
      return {
        ...f,
        x: Math.max(0, Math.min(pageSize.width, f.x + dx)),
        y: Math.max(0, Math.min(pageSize.height, f.y + dy))
      };
    });
    setFieldMapsByTemplate((cur) => ({
      ...cur,
      [selectedTemplate.id]: { ...fieldMap, fields: updated }
    }));
  }, [fieldMap, selectedTemplate, selectedFieldIds, selectedFieldId, pageSize, setFieldMapsByTemplate]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const activeEl = document.activeElement;
      const isInput = activeEl && (
        activeEl.tagName === "INPUT" ||
        activeEl.tagName === "TEXTAREA" ||
        activeEl.tagName === "SELECT" ||
        activeEl.getAttribute("contenteditable") === "true"
      );
      
      if (isInput) return; // Let input handle its own undo

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        undo();
      } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a") {
        // Ctrl+A: select all fields on the current page
        event.preventDefault();
        selectAll();
      } else if (event.key === "Escape") {
        clearMultiSelect();
      } else if (selectedFieldIds.size > 1 || selectedFieldId) {
        // Arrow keys move all selected fields (or just the primary one)
        const step = event.shiftKey ? 10 : 1;
        if (event.key === "ArrowUp")    { event.preventDefault(); moveGroupByArrow(0, -step); }
        else if (event.key === "ArrowDown")  { event.preventDefault(); moveGroupByArrow(0,  step); }
        else if (event.key === "ArrowLeft")  { event.preventDefault(); moveGroupByArrow(-step, 0); }
        else if (event.key === "ArrowRight") { event.preventDefault(); moveGroupByArrow( step, 0); }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, selectAll, clearMultiSelect, selectedFieldIds, selectedFieldId, moveGroupByArrow]);

  const hasUnsavedChanges = selectedTemplate
    ? JSON.stringify(fieldMapsByTemplate[selectedTemplate.id]) !== JSON.stringify(savedFieldMaps[selectedTemplate.id])
    : false;

  function markSaved() {
    if (selectedTemplate) {
      setSavedFieldMaps(prev => ({ ...prev, [selectedTemplate.id]: fieldMapsByTemplate[selectedTemplate.id] }));
    }
  }

  const selectedField = fieldMap?.fields.find((field) => field.id === selectedFieldId) ?? null;

  function updateFieldMap(next: FieldMap) {
    if (!selectedTemplate) return;
    
    // If not dragging/resizing, this is a discrete change, push history
    if (!isInteractingRef.current) {
      const current = fieldMapsByTemplate[selectedTemplate.id];
      if (current) {
        const stack = fieldHistory.current[selectedTemplate.id] ?? [];
        fieldHistory.current[selectedTemplate.id] = [...stack.slice(-49), current];
      }
    }

    setFieldMapsByTemplate((current) => ({
      ...current,
      [selectedTemplate.id]: next
    }));
  }

  function updateField(fieldId: string, patch: Partial<PdfField>) {
    if (!fieldMap) return;
    updateFieldMap({
      ...fieldMap,
      fields: fieldMap.fields.map((field) => field.id === fieldId ? { ...field, ...patch } : field)
    });
  }

  function addField(key?: string) {
    if (!fieldMap) return;
    const defaultKey = key || bindingOptions[0] || "customText";
    const field: PdfField = {
      id: crypto.randomUUID(),
      key: defaultKey,
      label: defaultKey.replace(/([A-Z])/g, " $1").replace(/^./, (value) => value.toUpperCase()),
      pageNumber,
      x: 72,
      y: 72,
      fontSize: 11,
      fontFamily: "Helvetica",
      fontColor: "#000000",
      isBold: false,
      alignment: "left",
      maxWidth: 180,
      wrap: false,
      shrinkToFit: true
    };
    updateFieldMap({ ...fieldMap, fields: [...fieldMap.fields, field] });
    setSelectedFieldId(field.id);
  }

  function removeField(fieldId: string) {
    if (!fieldMap) return;
    const remaining = fieldMap.fields.filter((field) => field.id !== fieldId);
    updateFieldMap({ ...fieldMap, fields: remaining });
    setSelectedFieldId(remaining[0]?.id ?? null);
  }

  function coordinatesFromPointer(event: PointerEvent<HTMLElement>) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: Math.round(((event.clientX - rect.left) / rect.width) * pageSize.width),
      y: Math.round(((event.clientY - rect.top) / rect.height) * pageSize.height)
    };
  }

  // Returns percentage-based position of pointer within the canvas container (0-100)
  function pctFromPointer(event: PointerEvent<HTMLElement>) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100))
    };
  }

  // Move a single primary field AND all co-selected fields by the same delta

  const groupMoveRef = useRef<{ baseX: number; baseY: number; fieldSnapshots: Record<string, { x: number; y: number }> } | null>(null);

  function moveSelectedField(event: PointerEvent<HTMLDivElement>) {
    if (!selectedField) return;
    const coords = coordinatesFromPointer(event);
    if (!coords) return;
    updateField(selectedField.id, {
      x: Math.max(0, Math.min(pageSize.width, coords.x)),
      y: Math.max(0, Math.min(pageSize.height, coords.y)),
      pageNumber
    });
  }

  return (
    <div className="space-y-6">
      <style>{`
        @font-face { font-family: 'Roboto'; src: url('/fonts/Roboto-Regular.woff2') format('woff2'); font-weight: normal; font-style: normal; }
        @font-face { font-family: 'Roboto'; src: url('/fonts/Roboto-Bold.woff2') format('woff2'); font-weight: bold; font-style: normal; }
        @font-face { font-family: 'Open Sans'; src: url('/fonts/OpenSans-Regular.woff2') format('woff2'); font-weight: normal; font-style: normal; }
        @font-face { font-family: 'Open Sans'; src: url('/fonts/OpenSans-Bold.woff2') format('woff2'); font-weight: bold; font-style: normal; }
        @font-face { font-family: 'Montserrat'; src: url('/fonts/Montserrat-Regular.woff2') format('woff2'); font-weight: normal; font-style: normal; }
        @font-face { font-family: 'Montserrat'; src: url('/fonts/Montserrat-Bold.woff2') format('woff2'); font-weight: bold; font-style: normal; }
        @font-face { font-family: 'Lato'; src: url('/fonts/Lato-Regular.woff2') format('woff2'); font-weight: normal; font-style: normal; }
        @font-face { font-family: 'Lato'; src: url('/fonts/Lato-Bold.woff2') format('woff2'); font-weight: bold; font-style: normal; }
        @font-face { font-family: 'Poppins'; src: url('/fonts/Poppins-Regular.woff2') format('woff2'); font-weight: normal; font-style: normal; }
        @font-face { font-family: 'Poppins'; src: url('/fonts/Poppins-Bold.woff2') format('woff2'); font-weight: bold; font-style: normal; }
        @font-face { font-family: 'Inter'; src: url('/fonts/Inter-Regular.woff2') format('woff2'); font-weight: normal; font-style: normal; }
        @font-face { font-family: 'Inter'; src: url('/fonts/Inter-Bold.woff2') format('woff2'); font-weight: bold; font-style: normal; }
        @font-face { font-family: 'Trajan Pro'; src: url('/fonts/TrajanPro-Regular.ttf') format('truetype'); font-weight: normal; font-style: normal; }
        @font-face { font-family: 'Trajan Pro'; src: url('/fonts/TrajanPro-Bold.otf') format('opentype'); font-weight: bold; font-style: normal; }
      `}</style>
      <UploadTemplateForm />

      <Card>
        <CardHeader>
          <CardTitle>Select Template Feature</CardTitle>
          <CardDescription>
            Choose which system feature this PDF template belongs to before uploading or editing placements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            {featureOptions.map((feature) => {
              const count = templates.filter((template) => template.templateFeature === feature.value).length;

              return (
                <button
                  key={feature.value}
                  type="button"
                  onClick={() => {
                    const nextTemplates = templates.filter((template) => template.templateFeature === feature.value);
                    setSelectedFeature(feature.value);
                    setSelectedTemplateId(nextTemplates[0]?.id ?? "");
                    setPageNumber(1);
                    setSelectedFieldId(nextTemplates[0] ? fieldMapsByTemplate[nextTemplates[0].id]?.fields[0]?.id ?? null : null);
                  }}
                  className={cn(
                    "rounded-lg border p-4 text-left transition hover:bg-accent",
                    selectedFeature === feature.value && "border-primary bg-primary/10"
                  )}
                >
                  <p className="font-semibold">{feature.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{count} template{count === 1 ? "" : "s"}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {visibleTemplates.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            No PDF templates uploaded for {featureOptions.find((feature) => feature.value === selectedFeature)?.label ?? "this feature"} yet.
          </CardContent>
        </Card>
      ) : selectedTemplate && fieldMap ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <Card className="min-w-0">
            <CardHeader>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle>PDF Field Placement Editor</CardTitle>
                  <CardDescription>Click the PDF preview to move the selected field. Coordinates are saved in PDF points, so they stay accurate across zoom levels.</CardDescription>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Select
                    value={selectedTemplate.id}
                    onChange={(event) => {
                      setSelectedTemplateId(event.target.value);
                      setPageNumber(1);
                      setSelectedFieldId(fieldMapsByTemplate[event.target.value]?.fields[0]?.id ?? null);
                    }}
                  >
                    {visibleTemplates.map((template) => (
                      <option key={template.id} value={template.id}>{template.name}</option>
                    ))}
                  </Select>
                  <Select value={String(pageNumber)} onChange={(event) => setPageNumber(Number(event.target.value))}>
                    {Array.from({ length: selectedTemplate.pageCount }, (_, index) => (
                      <option key={index + 1} value={index + 1}>Page {index + 1}</option>
                    ))}
                  </Select>
                  <Select value={String(layoutColumns)} onChange={(event) => setLayoutColumns(Number(event.target.value))}>
                    <option value="1">1 Column Layout</option>
                    <option value="2">2 Column Layout</option>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Unsaved changes banner */}
              {hasUnsavedChanges && (
                <div className="flex items-center justify-between gap-3 rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700 px-3 py-2">
                  <span className="text-xs font-medium text-amber-800 dark:text-amber-300">⚠ You have unsaved changes to this template&apos;s field placements.</span>
                  <SaveFieldsForm templateId={selectedTemplate.id} fieldMap={fieldMap} onSaved={markSaved} />
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={fieldToInsert || bindingOptions[0] || "customText"}
                  onChange={(event) => setFieldToInsert(event.target.value)}
                  className="w-[180px] h-8 text-xs"
                >
                  {bindingOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </Select>
                <Button type="button" size="sm" onClick={() => addField(fieldToInsert)}>
                  Insert
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-40"
                  disabled={!selectedFieldId}
                  onClick={() => selectedFieldId && removeField(selectedFieldId)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Delete
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={!canUndo}
                  onClick={undo}
                  className="disabled:opacity-40"
                  title="Undo last change (Ctrl+Z)"
                >
                  <Undo className="h-3.5 w-3.5 mr-1" />
                  Undo
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={selectAll}
                  title="Select all fields on this page (Ctrl+A)"
                >
                  <Maximize className="h-3.5 w-3.5 mr-1" />
                  Select All
                </Button>
                {selectedFieldIds.size > 1 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 text-primary text-xs font-medium px-2 py-0.5 border border-primary/30">
                    {selectedFieldIds.size} selected — drag any to move all
                  </span>
                )}
                <Button asChild variant="outline" size="sm" className="ml-auto">
                  <a href={selectedTemplate.fileUrl} target="_blank" rel="noreferrer">
                    <FileText className="h-3.5 w-3.5 mr-1" />
                    Open PDF
                  </a>
                </Button>
              </div>

              <div
                ref={canvasRef}
                className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-lg border bg-white shadow-sm select-none"
                style={{ aspectRatio: `${pageSize.width} / ${pageSize.height}`, containerType: "inline-size", cursor: marquee ? "crosshair" : "default" }}
                onPointerDown={(event) => {
                  // Only act when clicking on the canvas background itself (not a field)
                  if (event.target !== event.currentTarget) return;
                  event.currentTarget.setPointerCapture(event.pointerId);
                  const coords = coordinatesFromPointer(event);
                  if (!coords) return;
                  marqueeStartRef.current = coords;
                  setMarquee({ x1: coords.x, y1: coords.y, x2: coords.x, y2: coords.y });
                }}
                onPointerMove={(event) => {
                  if (!marqueeStartRef.current || event.buttons !== 1) return;
                  const coords = coordinatesFromPointer(event);
                  if (!coords) return;
                  setMarquee({
                    x1: marqueeStartRef.current.x,
                    y1: marqueeStartRef.current.y,
                    x2: coords.x,
                    y2: coords.y
                  });
                }}
                onPointerUp={(event) => {
                  if (!marqueeStartRef.current || !marquee) {
                    marqueeStartRef.current = null;
                    setMarquee(null);
                    return;
                  }
                  // Commit marquee: find all fields whose top-left corner is inside the selection rect
                  const minX = Math.min(marquee.x1, marquee.x2);
                  const maxX = Math.max(marquee.x1, marquee.x2);
                  const minY = Math.min(marquee.y1, marquee.y2);
                  const maxY = Math.max(marquee.y1, marquee.y2);
                  const dragged = Math.abs(marquee.x2 - marquee.x1) > 4 || Math.abs(marquee.y2 - marquee.y1) > 4;
                  if (dragged) {
                    const hit = fieldsOnPage
                      .filter((f) => f.x >= minX && f.x <= maxX && f.y >= minY && f.y <= maxY)
                      .map((f) => f.id);
                    if (hit.length > 0) {
                      setSelectedFieldIds(new Set(hit));
                      setSelectedFieldId(hit[0]);
                    } else {
                      clearMultiSelect();
                    }
                  } else {
                    // Plain click on background — clear multi-select
                    clearMultiSelect();
                  }
                  marqueeStartRef.current = null;
                  setMarquee(null);
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }}
              >
                {/* PDF background — rendered via pdf.js canvas for pixel-perfect alignment */}
                <div className="absolute inset-0 pointer-events-none">
                  <PdfPageCanvas
                    key={`${selectedTemplate.id}-${pageNumber}`}
                    fileUrl={selectedTemplate.fileUrl}
                    pageNumber={pageNumber}
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
                <div className="absolute inset-0 bg-transparent">
                  {layoutColumns === 2 && (
                    <div className="absolute top-0 bottom-0 left-1/2 w-px border-l-2 border-dashed border-red-500/50 mix-blend-multiply z-0 pointer-events-none" />
                  )}
                  {snapLines.x !== undefined && (
                    <div className="absolute top-0 bottom-0 w-px bg-blue-500/60 z-10 pointer-events-none" style={{ left: `${(snapLines.x / pageSize.width) * 100}%` }} />
                  )}
                  {snapLines.y !== undefined && (
                    <div className="absolute left-0 right-0 h-px bg-blue-500/60 z-10 pointer-events-none" style={{ top: `${(snapLines.y / pageSize.height) * 100}%` }} />
                  )}
                {/* Marquee selection rectangle */}
                  {marquee && (() => {
                    const minX = Math.min(marquee.x1, marquee.x2);
                    const minY = Math.min(marquee.y1, marquee.y2);
                    const maxX = Math.max(marquee.x1, marquee.x2);
                    const maxY = Math.max(marquee.y1, marquee.y2);
                    return (
                      <div
                        className="absolute pointer-events-none z-50 border-2 border-primary bg-primary/10"
                        style={{
                          left: `${(minX / pageSize.width) * 100}%`,
                          top: `${(minY / pageSize.height) * 100}%`,
                          width: `${((maxX - minX) / pageSize.width) * 100}%`,
                          height: `${((maxY - minY) / pageSize.height) * 100}%`
                        }}
                      />
                    );
                  })()}
                  {fieldsOnPage.map((field) => {
                    const fontSizeCqi = (field.fontSize / pageSize.width) * 100;
                    const isSelected = selectedFieldIds.has(field.id);
                    const isPrimary = selectedFieldId === field.id;
                    return (
                      <button
                        key={field.id}
                        type="button"
                        className={cn(
                          "absolute block border shadow-sm hover:ring hover:ring-primary/50 overflow-visible leading-[1.2]",
                          isPrimary
                            ? "border-primary/80 ring-2 ring-primary"
                            : isSelected
                            ? "border-primary/60 ring-1 ring-primary/60 bg-primary/10"
                            : "border-sky-400/60 bg-white/40 backdrop-blur-[1px]",
                          field.wrap ? "whitespace-pre-wrap break-words" : "whitespace-pre"
                        )}
                        style={{
                          left: `${(field.x / pageSize.width) * 100}%`,
                          top: `${(field.y / pageSize.height) * 100}%`,
                          width: `${(field.maxWidth / pageSize.width) * 100}%`,
                          height: field.maxHeight ? `${(field.maxHeight / pageSize.height) * 100}%` : undefined,
                          fontSize: `${fontSizeCqi}cqi`,
                          fontFamily: field.fontFamily === "Times Roman" ? "Times New Roman, serif" : field.fontFamily === "Courier" ? "Courier New, monospace" : field.fontFamily === "Helvetica" ? "Helvetica, Arial, sans-serif" : `'${field.fontFamily}', sans-serif`,
                          color: field.fontColor || "#000000",
                          fontWeight: field.isBold ? "bold" : "normal",
                          textAlign: field.alignment
                        }}
                      onClick={(event) => {
                        event.stopPropagation();
                        if (event.shiftKey) {
                          // Shift-click: toggle this field in the multi-selection
                          setSelectedFieldIds((prev) => {
                            const next = new Set(prev);
                            if (next.has(field.id)) next.delete(field.id);
                            else next.add(field.id);
                            return next;
                          });
                          setSelectedFieldId(field.id);
                        } else {
                          setSelectedFieldId(field.id);
                          // Plain click on a field that isn't already multi-selected → clear multi-select
                          if (!selectedFieldIds.has(field.id)) {
                            clearMultiSelect();
                          }
                        }
                      }}
                      onKeyDown={(event) => {
                        if (selectedFieldId !== field.id) return;
                        const step = event.shiftKey ? 10 : 1;
                        const isArrow = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key);
                        if (!isArrow) return;
                        event.preventDefault();
                        const dx = event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0;
                        const dy = event.key === "ArrowUp"   ? -step : event.key === "ArrowDown"  ? step : 0;
                        moveGroupByArrow(dx, dy);
                      }}
                      onPointerDown={(event) => {
                        event.stopPropagation();
                        setSelectedFieldId(field.id);
                        const target = event.currentTarget;
                        target.setPointerCapture(event.pointerId);
                        startInteraction();
                        // Snapshot start positions of all selected fields for group move
                        const ids = selectedFieldIds.size > 0 && selectedFieldIds.has(field.id)
                          ? selectedFieldIds
                          : new Set([field.id]);
                        const coords = coordinatesFromPointer(event);
                        if (coords) {
                          const snapshots: Record<string, { x: number; y: number }> = {};
                          for (const id of ids) {
                            const f = fieldsOnPage.find((ff) => ff.id === id);
                            if (f) snapshots[id] = { x: f.x, y: f.y };
                          }
                          groupMoveRef.current = { baseX: coords.x, baseY: coords.y, fieldSnapshots: snapshots };
                        }
                      }}
                      onPointerMove={(event) => {
                        if (event.buttons !== 1 || resizingFieldId === field.id) return;
                        setSelectedFieldId(field.id);
                        const coords = coordinatesFromPointer(event);
                        if (!coords || !groupMoveRef.current) return;

                        const dx = coords.x - groupMoveRef.current.baseX;
                        const dy = coords.y - groupMoveRef.current.baseY;
                        const ids = Object.keys(groupMoveRef.current.fieldSnapshots);

                        if (ids.length > 1) {
                          // Group move: update all selected fields simultaneously
                          if (!fieldMap) return;
                          const updated = fieldMap.fields.map((f) => {
                            const snap = groupMoveRef.current!.fieldSnapshots[f.id];
                            if (!snap) return f;
                            return {
                              ...f,
                              x: Math.max(0, Math.min(pageSize.width, snap.x + dx)),
                              y: Math.max(0, Math.min(pageSize.height, snap.y + dy))
                            };
                          });
                          setFieldMapsByTemplate((cur) => ({
                            ...cur,
                            [selectedTemplate.id]: { ...fieldMap, fields: updated }
                          }));
                        } else {
                          // Single field move with snapping
                          let newX = Math.max(0, Math.min(pageSize.width, coords.x));
                          let newY = Math.max(0, Math.min(pageSize.height, coords.y));
                          let snapX: number | undefined;
                          let snapY: number | undefined;

                          for (const other of fieldsOnPage) {
                            if (other.id === field.id) continue;
                            if (Math.abs(newX - other.x) < 5) { newX = other.x; snapX = other.x; }
                            if (Math.abs(newY - other.y) < 5) { newY = other.y; snapY = other.y; }
                          }

                          setSnapLines({ x: snapX, y: snapY });
                          updateField(field.id, { x: newX, y: newY });
                        }
                      }}
                      onPointerUp={(event) => {
                        setSnapLines({});
                        event.currentTarget.releasePointerCapture(event.pointerId);
                        endInteraction();
                      }}
                    >
                      {/* Show real data from selected program, fallback to key name */}
                        {(() => {
                          const raw = (previewData?.[field.key]) ?? field.label;
                          if (field.key === "message") {
                            // Split by real newline first, then fall back to comma
                            let name = raw;
                            let position = "";
                            if (raw.includes("\n")) {
                              const parts = raw.split("\n");
                              name = parts[0];
                              position = parts.slice(1).join("\n");
                            } else if (raw.includes(",")) {
                              const parts = raw.split(",");
                              name = parts[0].trim();
                              position = parts.slice(1).join(",").trim();
                            }
                            return (
                              <div className="inline-flex flex-col items-center leading-[1.2]">
                                <span>{name}</span>
                                {position && (
                                  <span style={{ fontSize: "calc(100% - 2cqi)" }}>{position}</span>
                                )}
                              </div>
                            );
                          }
                          return raw;
                        })()}
                        
                        {selectedFieldId === field.id && (
                          <>
                            <div
                              className="absolute right-0 top-0 bottom-0 w-3 cursor-ew-resize hover:bg-primary/20 z-10"
                              onPointerDown={(event) => {
                                event.stopPropagation();
                                setResizingFieldId(field.id);
                                event.currentTarget.setPointerCapture(event.pointerId);
                                startInteraction();
                              }}
                              onPointerMove={(event) => {
                                if (event.buttons !== 1 || resizingFieldId !== field.id) return;
                                event.stopPropagation();
                                const coords = coordinatesFromPointer(event);
                                if (coords) {
                                  const newWidth = Math.max(20, coords.x - field.x);
                                  updateField(field.id, { maxWidth: newWidth });
                                }
                              }}
                              onPointerUp={(event) => {
                                setResizingFieldId(null);
                                event.currentTarget.releasePointerCapture(event.pointerId);
                                endInteraction();
                              }}
                            />
                            <div
                              className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize hover:bg-primary/20 z-10"
                              onPointerDown={(event) => {
                                event.stopPropagation();
                                setResizingFieldId(field.id);
                                event.currentTarget.setPointerCapture(event.pointerId);
                                startInteraction();
                              }}
                              onPointerMove={(event) => {
                                if (event.buttons !== 1 || resizingFieldId !== field.id) return;
                                event.stopPropagation();
                                const coords = coordinatesFromPointer(event);
                                if (coords) {
                                  const newHeight = Math.max(10, coords.y - field.y);
                                  updateField(field.id, { maxHeight: newHeight });
                                }
                              }}
                              onPointerUp={(event) => {
                                setResizingFieldId(null);
                                event.currentTarget.releasePointerCapture(event.pointerId);
                                endInteraction();
                              }}
                            />
                            <div
                              className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize hover:bg-primary/20 z-20"
                              onPointerDown={(event) => {
                                event.stopPropagation();
                                setResizingFieldId(field.id);
                                event.currentTarget.setPointerCapture(event.pointerId);
                                startInteraction();
                              }}
                              onPointerMove={(event) => {
                                if (event.buttons !== 1 || resizingFieldId !== field.id) return;
                                event.stopPropagation();
                                const coords = coordinatesFromPointer(event);
                                if (coords) {
                                  const newWidth = Math.max(20, coords.x - field.x);
                                  const newHeight = Math.max(10, coords.y - field.y);
                                  updateField(field.id, { maxWidth: newWidth, maxHeight: newHeight });
                                }
                              }}
                              onPointerUp={(event) => {
                                setResizingFieldId(null);
                                event.currentTarget.releasePointerCapture(event.pointerId);
                                endInteraction();
                              }}
                            />
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
                The template PDF remains unchanged. The preview/export route loads this original file and draws text over the saved coordinates.
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Template</CardTitle>
                <CardDescription>
                  {featureOptions.find((feature) => feature.value === selectedTemplate.templateFeature)?.label ?? "General"} | {selectedTemplate.fileName} | {selectedTemplate.pageCount} page(s)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <SaveFieldsForm templateId={selectedTemplate.id} fieldMap={fieldMap} onSaved={markSaved} />
                <SetDefaultTemplateForm templateId={selectedTemplate.id} isDefault={selectedTemplate.isDefault} feature={selectedTemplate.templateFeature} />
                <form action={archivePdfTemplateAction.bind(null, selectedTemplate.id)}>
                  <Button type="submit" variant="outline" className="w-full border-red-200 text-red-700 hover:bg-red-50">
                    <Archive className="h-4 w-4 mr-2" />
                    Archive Template
                  </Button>
                </form>
                <form 
                  onSubmit={(e) => {
                    if (!confirm("Are you sure you want to permanently delete this PDF template? This cannot be undone.")) {
                      e.preventDefault();
                    }
                  }}
                  action={deletePdfTemplateAction.bind(null, selectedTemplate.id)}
                >
                  <Button type="submit" variant="outline" className="w-full border-red-200 text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Template
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Preview / Export</CardTitle>
                <CardDescription>
                  {selectedTemplate.templateFeature === "CONVOCATION_PROGRAM"
                    ? "Select a real saved convocation program to overlay actual data."
                    : "You can place fields for this feature now. Real-data preview/export will be connected from the selected module record."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedTemplate.templateFeature === "CONVOCATION_PROGRAM" ? (
                  <>
                    <Select value={selectedProgramId} onChange={(event) => setSelectedProgramId(event.target.value)}>
                      {programs.length === 0 ? (
                        <option value="">No programs available</option>
                      ) : programs.map((program) => (
                        <option key={program.id} value={program.id}>{program.label}</option>
                      ))}
                    </Select>
                    <div className="flex flex-wrap gap-2">
                      {hasUnsavedChanges ? (
                        <Button disabled variant="secondary" className="w-full">
                          Save before Exporting
                        </Button>
                      ) : (
                        <Button 
                          disabled={!selectedProgramId} 
                          onClick={() => {
                            if (selectedProgramId) {
                              window.location.href = `/settings/pdf-templates/${selectedTemplate.id}/overlay?source=convocation&programId=${selectedProgramId}&mode=download`;
                            }
                          }}
                        >
                          Download Program PDF
                        </Button>
                      )}
                    </div>
                    {isFetchingPreview && (
                      <p className="text-xs text-muted-foreground animate-pulse">Loading program data into canvas preview…</p>
                    )}
                    {!isFetchingPreview && previewData && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">✓ Canvas preview is showing real data from this program.</p>
                    )}
                    {programs.length === 0 && (
                      <p className="text-xs text-muted-foreground">Generate a convocation program first to preview real data bindings.</p>
                    )}
                  </>
                ) : (
                  <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                    Upload and edit templates here for this feature. Preview/export with real data will appear once you choose a specific request or reservation from that module.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Selected Field</CardTitle>
                <CardDescription>Edit binding, location, and text behavior.</CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedField ? (
                  <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                    Add or select a field to edit it.
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex border rounded-md overflow-hidden bg-background">
                        <Button 
                          type="button" 
                          variant={selectedField.alignment === 'left' ? 'secondary' : 'ghost'} 
                          size="icon" 
                          className="h-8 w-8 rounded-none border-r"
                          onClick={() => updateField(selectedField.id, { alignment: 'left' })}
                          title="Align Text Left"
                        >
                          <AlignLeft className="h-4 w-4" />
                        </Button>
                        <Button 
                          type="button" 
                          variant={selectedField.alignment === 'center' ? 'secondary' : 'ghost'} 
                          size="icon" 
                          className="h-8 w-8 rounded-none border-r"
                          onClick={() => updateField(selectedField.id, { alignment: 'center' })}
                          title="Center Text"
                        >
                          <AlignCenter className="h-4 w-4" />
                        </Button>
                        <Button 
                          type="button" 
                          variant={selectedField.alignment === 'right' ? 'secondary' : 'ghost'} 
                          size="icon" 
                          className="h-8 w-8 rounded-none"
                          onClick={() => updateField(selectedField.id, { alignment: 'right' })}
                          title="Align Text Right"
                        >
                          <AlignRight className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="w-px h-6 bg-border mx-1" />

                      <div className="flex border rounded-md overflow-hidden bg-background">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none border-r"
                          onClick={() => {
                            const colWidth = pageSize.width / layoutColumns;
                            const colStartX = layoutColumns === 2 && selectedField.x > colWidth ? colWidth : 0;
                            updateField(selectedField.id, { x: Math.max(colStartX, colStartX + (colWidth - selectedField.maxWidth) / 2) });
                          }}
                          title="Center Layout Horizontally"
                        >
                          <AlignCenterHorizontal className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none border-r"
                          onClick={() => updateField(selectedField.id, { y: pageSize.height / 2 })}
                          title="Center Layout Vertically"
                        >
                          <AlignCenterVertical className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => {
                            const colWidth = pageSize.width / layoutColumns;
                            const colStartX = layoutColumns === 2 && selectedField.x > colWidth ? colWidth : 0;
                            updateField(selectedField.id, { x: colStartX, maxWidth: colWidth, alignment: "center" });
                          }}
                          title="Stretch to Full Column Width"
                        >
                          <Maximize className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t mt-2">
                      <label className="space-y-1">
                        <span className="text-xs font-medium text-muted-foreground">Font size</span>
                        <Input type="number" value={selectedField.fontSize} onChange={(event) => updateField(selectedField.id, { fontSize: Number(event.target.value) })} />
                      </label>
                      <label className="space-y-1">
                        <span className="text-xs font-medium text-muted-foreground">Max width</span>
                        <Input type="number" value={selectedField.maxWidth} onChange={(event) => updateField(selectedField.id, { maxWidth: Number(event.target.value) })} />
                      </label>
                      <label className="space-y-1 col-span-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">Color</span>
                          {recentColors.length > 0 && (
                            <div className="flex items-center gap-1">
                              {recentColors.map(color => (
                                <button
                                  key={color}
                                  type="button"
                                  className="w-4 h-4 rounded-full border border-black/20"
                                  style={{ backgroundColor: color }}
                                  onClick={() => updateField(selectedField.id, { fontColor: color })}
                                  title={color}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Input 
                            type="color" 
                            className="w-12 h-9 p-1 cursor-pointer" 
                            value={selectedField.fontColor || "#000000"} 
                            onChange={(event) => updateField(selectedField.id, { fontColor: event.target.value })}
                            onBlur={() => {
                              if (selectedField.fontColor) {
                                setRecentColors(prev => {
                                  const c = selectedField.fontColor!.toUpperCase();
                                  const unique = prev.filter(p => p !== c);
                                  return [c, ...unique].slice(0, 3);
                                });
                              }
                            }}
                          />
                          <Input 
                            type="text" 
                            className="flex-1 uppercase font-mono text-xs" 
                            value={selectedField.fontColor || "#000000"} 
                            onChange={(event) => updateField(selectedField.id, { fontColor: event.target.value })}
                            onBlur={() => {
                              if (selectedField.fontColor) {
                                setRecentColors(prev => {
                                  const c = selectedField.fontColor!.toUpperCase();
                                  const unique = prev.filter(p => p !== c);
                                  return [c, ...unique].slice(0, 3);
                                });
                              }
                            }}
                          />
                        </div>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="space-y-1">
                        <span className="text-xs font-medium text-muted-foreground">Font family</span>
                        <Select value={selectedField.fontFamily} onChange={(event) => updateField(selectedField.id, { fontFamily: event.target.value as PdfField["fontFamily"] })}>
                          <option value="Helvetica">Helvetica (Standard)</option>
                          <option value="Times Roman">Times Roman (Standard)</option>
                          <option value="Courier">Courier (Standard)</option>
                          <optgroup label="Classic Fonts">
                            <option value="Trajan Pro">Trajan Pro</option>
                          </optgroup>
                          <optgroup label="Modern Fonts">
                            <option value="Roboto">Roboto</option>
                            <option value="Open Sans">Open Sans</option>
                            <option value="Montserrat">Montserrat</option>
                            <option value="Lato">Lato</option>
                            <option value="Poppins">Poppins</option>
                            <option value="Inter">Inter</option>
                          </optgroup>
                        </Select>
                      </label>
                      <label className="space-y-1">
                        <span className="text-xs font-medium text-muted-foreground">Alignment</span>
                        <Select value={selectedField.alignment} onChange={(event) => updateField(selectedField.id, { alignment: event.target.value as PdfField["alignment"] })}>
                          <option value="left">Left</option>
                          <option value="center">Center</option>
                          <option value="right">Right</option>
                        </Select>
                      </label>
                    </div>
                    <div className="grid gap-2 text-sm">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={selectedField.isBold} onChange={(event) => updateField(selectedField.id, { isBold: event.target.checked })} />
                        Bold
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={selectedField.wrap} onChange={(event) => updateField(selectedField.id, { wrap: event.target.checked })} />
                        Wrap long text
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={selectedField.shrinkToFit} onChange={(event) => updateField(selectedField.id, { shrinkToFit: event.target.checked })} />
                        Shrink to fit when not wrapping
                      </label>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
