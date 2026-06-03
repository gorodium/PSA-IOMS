"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteCustomEmojiAction } from "./actions";

export function EmojiDeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (confirm("Are you sure you want to delete this custom emoji?")) {
          startTransition(async () => {
            await deleteCustomEmojiAction(id);
          });
        }
      }}
      disabled={isPending}
      className="absolute top-1 right-1 p-1 bg-background/80 hover:bg-destructive hover:text-destructive-foreground rounded opacity-0 group-hover:opacity-100 transition-opacity"
      title="Delete Emoji"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}
