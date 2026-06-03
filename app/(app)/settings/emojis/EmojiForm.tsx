"use client";

import { useState, useRef, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadCustomEmojiAction, deleteCustomEmojiAction } from "./actions";
import { Loader2, Upload, Trash2 } from "lucide-react";
import Image from "next/image";

export function EmojiForm() {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.type.startsWith("image/")) {
        setError("Please select an image file (GIF/PNG).");
        return;
      }
      if (selected.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB.");
        return;
      }
      
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || /\s/.test(name)) {
      setError("Name cannot contain spaces.");
      return;
    }
    if (!file) {
      setError("Please select an image file.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.set("name", name.trim().toLowerCase());
      formData.set("file", file);

      const result = await uploadCustomEmojiAction(formData);
      
      if (!result.ok) {
        setError(result.message);
      } else {
        setName("");
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive ring-1 ring-destructive/20">
          {error}
        </div>
      )}
      
      <div className="flex gap-4 items-start">
        <div 
          className="shrink-0 flex h-24 w-24 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-muted-foreground/30 bg-muted/30 transition-colors hover:border-primary/50"
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? (
            <div className="relative h-16 w-16">
              <Image src={preview} alt="Preview" fill className="object-contain" unoptimized />
            </div>
          ) : (
            <>
              <Upload className="h-6 w-6 text-muted-foreground/50 mb-1" />
              <span className="text-[10px] text-muted-foreground">Select File</span>
            </>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        <div className="flex-1 space-y-2">
          <Label htmlFor="name">Emoji Code</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            disabled={isPending}
            placeholder="e.g. party_parrot"
            required
          />
          <p className="text-[11px] text-muted-foreground">
            Type <code>:name:</code> in chat to use it. Only lowercase letters, numbers, and underscores allowed.
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isPending || !file || !name}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Upload Emoji
        </Button>
      </div>
    </form>
  );
}

export function EmojiDeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (confirm("Delete this emoji?")) {
          startTransition(() => { deleteCustomEmojiAction(id); });
        }
      }}
      disabled={isPending}
      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 bg-destructive/90 text-destructive-foreground rounded-sm transition-opacity hover:bg-destructive"
      title="Delete Emoji"
    >
      {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
    </button>
  );
}
