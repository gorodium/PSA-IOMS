"use client";

import { useState, useRef, useTransition, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { updateSuperAdminProfileAction } from "./actions";
import { Loader2, Upload, UserRound, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/components/ui/cropImage";

export function ProfileForm({ initialName, initialPhotoUrl }: { initialName: string, initialPhotoUrl: string | null }) {
  const [name, setName] = useState(initialName);
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialPhotoUrl);
  const [file, setFile] = useState<File | null>(null);
  
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Cropper state
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ width: number; height: number; x: number; y: number } | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.type.startsWith("image/")) {
        setError("Please select an image file.");
        return;
      }
      if (selected.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB.");
        return;
      }
      
      const imageUrl = URL.createObjectURL(selected);
      setImageToCrop(imageUrl);
      setCropDialogOpen(true);
      setError(null);
      setSuccess(null);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropApply = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;
    
    setIsCropping(true);
    try {
      const croppedFile = await getCroppedImg(imageToCrop, croppedAreaPixels);
      setFile(croppedFile);
      setPhotoPreview(URL.createObjectURL(croppedFile));
      setCropDialogOpen(false);
    } catch (err) {
      console.error(err);
      setError("Failed to crop image");
    } finally {
      setIsCropping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError("Name cannot be empty");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.set("name", name);
      if (file) {
        formData.set("photo", file);
      }

      const result = await updateSuperAdminProfileAction(formData);
      
      if (!result.ok) {
        setError(result.message);
      } else {
        setSuccess(result.message);
        setFile(null); // Clear selected file after upload
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive ring-1 ring-destructive/20">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-600 ring-1 ring-emerald-500/20">
            {success}
          </div>
        )}

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <div className="flex flex-col items-center gap-3">
            <Label className="self-start text-muted-foreground">Profile Picture</Label>
            <div 
              className="group relative flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted/30 transition-colors hover:border-primary/50 hover:bg-muted/50 shadow-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              {photoPreview ? (
                <Image 
                  src={photoPreview} 
                  alt="Profile Preview" 
                  fill 
                  className="object-cover" 
                  unoptimized
                />
              ) : (
                <UserRound className="h-12 w-12 text-muted-foreground/50" />
              )}
              
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <Upload className="h-6 w-6" />
                <span className="mt-1 text-xs font-medium">Upload</span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <p className="text-center text-[10px] text-muted-foreground">
              JPG, PNG.<br />Max size 5MB.
            </p>
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">System Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
                placeholder="e.g. System Administrator"
                required
              />
              <p className="text-[11px] text-muted-foreground">
                This name will be displayed in the internal chat and system logs.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={isPending || (!file && name === initialName)}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>

      <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-slate-950 border-slate-800 text-white">
          <DialogHeader className="p-4 bg-slate-900 border-b border-slate-800">
            <DialogTitle className="text-slate-50">Adjust Profile Picture</DialogTitle>
            <DialogDescription className="text-slate-400">
              Drag to position and use the slider to zoom.
            </DialogDescription>
          </DialogHeader>
          <div className="relative w-full h-[350px] bg-slate-950">
            {imageToCrop && (
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <ZoomOut className="w-4 h-4 text-slate-400" />
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <ZoomIn className="w-4 h-4 text-slate-400" />
            </div>
            <DialogFooter className="sm:justify-end gap-2">
              <Button type="button" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white" onClick={() => setCropDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleCropApply} disabled={isCropping}>
                {isCropping && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Crop & Apply
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
