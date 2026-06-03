"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Save, X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { personnelSectionOptions, PREDEFINED_POSITIONS, parseInitialPosition, parseInitialSection } from "@/lib/taxonomy";
import { ImageCropper, type CroppedImage } from "@/components/personnel/ImageCropper";
import { PersonnelDeleteButtons } from "@/components/personnel/PersonnelDeleteButtons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type PersonnelFormRecord = {
  id: string;
  employeeNo: string | null;
  fullName: string;
  position: string;
  section: string;
  email: string | null;
  contactNo: string | null;
  isActive: boolean;
  locationStatus?: string;
  travelDetails?: string | null;
  travelDestination?: string | null;
  travelStartDate?: Date | null;
  travelStartDate?: Date | null;
  travelEndDate?: Date | null;
  photoUrl?: string | null;
};


export function PersonnelForm({
  action,
  personnel,
  canDelete = false,
  isSuperAdmin = false,
}: {
  action: (formData: FormData) => Promise<void>;
  personnel?: PersonnelFormRecord | null;
  canDelete?: boolean;
  isSuperAdmin?: boolean;
}) {
  const router = useRouter();
  const initial = React.useMemo(() => {
    return parseInitialPosition(personnel?.position);
  }, [personnel?.position]);

  const initialSection = React.useMemo(() => {
    return parseInitialSection(personnel?.section);
  }, [personnel?.section]);

  const [selectedPosition, setSelectedPosition] = React.useState(initial.selectedPosition);
  const [customPositionText, setCustomPositionText] = React.useState(initial.customPositionText);
  const [isCosw, setIsCosw] = React.useState(initial.isCosw);
  const [isCoterminous, setIsCoterminous] = React.useState(initial.isCoterminous);
  const [isVei, setIsVei] = React.useState(initial.isVei);

  const [selectedSection, setSelectedSection] = React.useState(initialSection.selectedSection);
  const [customSectionText, setCustomSectionText] = React.useState(initialSection.customSectionText);

  const [locationStatus, setLocationStatus] = React.useState(personnel?.locationStatus || "office");

  const [showSuccess, setShowSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Photo state
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(personnel?.photoUrl || null);
  const [photoBase64, setPhotoBase64] = React.useState<string>("");
  const [cropperSrc, setCropperSrc] = React.useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setCropperSrc(reader.result?.toString() || null));
      reader.readAsDataURL(e.target.files[0]);
    }
    // reset input so the same file can be selected again if needed
    e.target.value = "";
  };

  const handleCropComplete = (cropped: CroppedImage) => {
    setPhotoPreview(cropped.base64);
    setPhotoBase64(cropped.base64);
    setCropperSrc(null);
  };


  React.useEffect(() => {
    setSelectedPosition(initial.selectedPosition);
    setCustomPositionText(initial.customPositionText);
    setIsCosw(initial.isCosw);
    setIsCoterminous(initial.isCoterminous);
    setIsVei(initial.isVei);
  }, [initial]);

  React.useEffect(() => {
    setSelectedSection(initialSection.selectedSection);
    setCustomSectionText(initialSection.customSectionText);
  }, [initialSection]);

  const derivedPosition = (selectedPosition === "Custom" ? customPositionText : selectedPosition) + (isVei ? "***" : isCoterminous ? "**" : isCosw ? "*" : "");
  const derivedSection = selectedSection === "Custom" ? customSectionText : selectedSection;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    try {
      await action(formData);
      setShowSuccess(true);
    } catch (err) {
      const errorMsgText = err instanceof Error ? err.message : "An error occurred while saving employee data.";
      setErrorMsg(errorMsgText);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {personnel ? <input type="hidden" name="id" value={personnel.id} /> : null}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle>{personnel ? "Edit Employee" : "Add Employee"}</CardTitle>
              <CardDescription>Employee records are used for assignments and dashboard ownership.</CardDescription>
            </div>
            <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Link href="/personnel">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4">
            
            <div className="flex items-center gap-6 mb-2">
              <div className={`relative group w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 ${!photoPreview ? "bg-slate-100 dark:bg-slate-800" : ""}`}>
                {photoPreview ? (
                  <img src={photoPreview} alt="Employee" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-slate-400" />
                )}
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                  <span className="text-white text-xs font-medium">Change</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                </label>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Profile Photo</h3>
                <p className="text-xs text-muted-foreground">Upload a professional headshot. Recommended size is 500x500px. The image will be auto-resized to keep file size small.</p>
              </div>
            </div>
            <input type="hidden" name="photoBase64" value={photoBase64} />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="employeeNo">Employee No.</Label>
                <Input id="employeeNo" name="employeeNo" defaultValue={personnel ? (personnel.employeeNo ?? "") : "PSA1043-"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" defaultValue={personnel?.fullName ?? ""} required />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="position-select">Position</Label>
                <div className="flex flex-col gap-3">
                  <Select
                    id="position-select"
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    required
                  >
                    <option value="">Select Position...</option>
                    {PREDEFINED_POSITIONS.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                    <option value="Custom">Custom</option>
                  </Select>
                  <div className="flex flex-wrap gap-2">
                    <label className={`flex items-center gap-1.5 text-sm font-medium border rounded-md h-9 px-3 transition-colors select-none ${isCosw || isVei ? "opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800/50 text-muted-foreground border-border/50" : "cursor-pointer bg-white dark:bg-slate-900 border-input hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                      <input
                        type="checkbox"
                        checked={isCoterminous}
                        disabled={isCosw || isVei}
                        onChange={(e) => {
                          setIsCoterminous(e.target.checked);
                          if (e.target.checked) { setIsCosw(false); setIsVei(false); }
                        }}
                        className="rounded border-input text-primary focus:ring-ring h-3.5 w-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <span>Coterminous / Contractual</span>
                    </label>
                    <label className={`flex items-center gap-1.5 text-sm font-medium border rounded-md h-9 px-3 transition-colors select-none ${isCoterminous || isVei ? "opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800/50 text-muted-foreground border-border/50" : "cursor-pointer bg-white dark:bg-slate-900 border-input hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                      <input
                        type="checkbox"
                        checked={isCosw}
                        disabled={isCoterminous || isVei}
                        onChange={(e) => {
                          setIsCosw(e.target.checked);
                          if (e.target.checked) { setIsCoterminous(false); setIsVei(false); }
                        }}
                        className="rounded border-input text-primary focus:ring-ring h-3.5 w-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <span>COSW</span>
                    </label>
                    <label className={`flex items-center gap-1.5 text-sm font-medium border rounded-md h-9 px-3 transition-colors select-none ${isCoterminous || isCosw ? "opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800/50 text-muted-foreground border-border/50" : "cursor-pointer bg-white dark:bg-slate-900 border-input hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                      <input
                        type="checkbox"
                        checked={isVei}
                        disabled={isCoterminous || isCosw}
                        onChange={(e) => {
                          setIsVei(e.target.checked);
                          if (e.target.checked) { setIsCoterminous(false); setIsCosw(false); }
                        }}
                        className="rounded border-input text-primary focus:ring-ring h-3.5 w-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <span>VEI</span>
                    </label>
                  </div>
                </div>

                {selectedPosition === "Custom" && (
                  <div className="space-y-1.5 pt-1">
                    <Label htmlFor="custom-position" className="text-xs text-muted-foreground">Custom Position Name</Label>
                    <Input
                      id="custom-position"
                      placeholder="Enter custom position name"
                      value={customPositionText}
                      onChange={(e) => setCustomPositionText(e.target.value)}
                      required
                    />
                  </div>
                )}

                <input type="hidden" name="position" value={derivedPosition} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="section-select">Section</Label>
                <Select
                  id="section-select"
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  required
                >
                  <option value="">Select Section...</option>
                  {personnelSectionOptions.map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                  <option value="Custom">Custom</option>
                </Select>

                {selectedSection === "Custom" && (
                  <div className="space-y-1.5 pt-1">
                    <Label htmlFor="custom-section" className="text-xs text-muted-foreground">Custom Section Name</Label>
                    <Input
                      id="custom-section"
                      placeholder="Enter custom section name"
                      value={customSectionText}
                      onChange={(e) => setCustomSectionText(e.target.value)}
                      required
                    />
                  </div>
                )}

                <input type="hidden" name="section" value={derivedSection} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={personnel?.email ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactNo">Contact No.</Label>
                <Input id="contactNo" name="contactNo" defaultValue={personnel?.contactNo ?? ""} />
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="locationStatus">Location / Status</Label>
                <Select
                  id="locationStatus"
                  name="locationStatus"
                  value={locationStatus}
                  onChange={(e) => setLocationStatus(e.target.value)}
                  required
                >
                  <option value="office">Office</option>
                  <option value="on_travel">On Travel</option>
                </Select>
              </div>
            </div>

            {locationStatus === "on_travel" && (
              <div className="grid gap-4 md:grid-cols-2 border border-slate-200 dark:border-slate-800 rounded-md p-4 bg-slate-50 dark:bg-slate-900/50">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="travelDetails">Travel Purpose / Details</Label>
                  <Input id="travelDetails" name="travelDetails" defaultValue={personnel?.travelDetails ?? ""} placeholder="e.g. Supervision for CPI" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="travelDestination">Destination</Label>
                  <Input id="travelDestination" name="travelDestination" defaultValue={personnel?.travelDestination ?? ""} placeholder="e.g. Head Office" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="travelStartDate">Start Date</Label>
                  <Input type="date" id="travelStartDate" name="travelStartDate" defaultValue={personnel?.travelStartDate ? new Date(personnel.travelStartDate).toISOString().split('T')[0] : ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="travelEndDate">End Date</Label>
                  <Input type="date" id="travelEndDate" name="travelEndDate" defaultValue={personnel?.travelEndDate ? new Date(personnel.travelEndDate).toISOString().split('T')[0] : ""} />
                </div>
              </div>
            )}

            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" name="isActive" defaultChecked={personnel?.isActive ?? true} className="rounded border-input text-primary focus:ring-ring" />
              Active employee
            </label>

            {errorMsg && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium border border-destructive/20 animate-in fade-in-50 duration-200">
                {errorMsg}
              </div>
            )}

            <div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" aria-hidden="true" />
                    {personnel ? "Save Changes" : "Add Employee"}
                  </>
                )}
              </Button>
            </div>
            {personnel && canDelete && (
              <PersonnelDeleteButtons 
                personnelId={personnel.id} 
                isSuperAdmin={isSuperAdmin} 
                isActive={personnel.isActive} 
              />
            )}
          </CardContent>
        </Card>
      </form>

      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-emerald-600 dark:text-emerald-500">Success</AlertDialogTitle>
            <AlertDialogDescription>
              {personnel
                ? "Employee information has been successfully updated."
                : "New employee has been successfully added."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600"
              onClick={() => {
                setShowSuccess(false);
                router.push("/personnel");
              }}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {cropperSrc && (
        <ImageCropper
          imageSrc={cropperSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropperSrc(null)}
        />
      )}
    </>
  );
}
