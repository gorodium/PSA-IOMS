"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { overrideConvocationItemCustomTextAction } from "@/app/(app)/convocation/actions";

export function CustomTextOverrideDialog({ itemId }: { itemId: string }) {
  const [open, setOpen] = useState(false);
  const [customText, setCustomText] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    if (!customText.trim()) return;
    startTransition(async () => {
      try {
        await overrideConvocationItemCustomTextAction(itemId, customText.trim());
        setOpen(false);
      } catch (error) {
        alert(error instanceof Error ? error.message : "Failed to save custom text.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="outline" className="h-7 px-2 text-xs">
          Custom
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Custom Text</DialogTitle>
          <DialogDescription>
            Enter a custom value for this program assignment (e.g. "To be played via AV", "Guest Speaker").
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Custom Value
          </label>
          <Input
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Enter custom assignment text..."
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending || !customText.trim()}>
            {isPending ? "Saving..." : "Save Selection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
