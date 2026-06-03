"use client";

import { useState, useTransition, useMemo, useEffect } from "react";
import Image from "next/image";
import { formatDistanceToNow, format } from "date-fns";
import { Smile, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { unsendChatMessageAction, toggleChatReactionAction, type ChatSnapshot } from "@/app/(app)/chat/actions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "😡"];

type MessageType = ChatSnapshot["messages"][0];
type CustomEmojiType = ChatSnapshot["customEmojis"][0];

function parseCustomEmojis(text: string, customEmojis: CustomEmojiType[]) {
  const parts = text.split(/(:[a-z0-9_]+:)/g);
  return parts.map((part, i) => {
    if (part.startsWith(":") && part.endsWith(":")) {
      const name = part.slice(1, -1);
      const emoji = customEmojis.find(e => e.name === name);
      if (emoji) {
        return (
          <Image
            key={i}
            src={emoji.imageUrl.startsWith('/uploads/') ? emoji.imageUrl.replace('/uploads/', '/api/file/') : emoji.imageUrl}
            alt={part}
            title={part}
            width={24}
            height={24}
            className="inline-block mx-0.5 -mt-1 object-contain align-middle"
            unoptimized
          />
        );
      }
    }
    return part;
  });
}

export function ChatMessageItem({ 
  message, 
  customEmojis, 
  currentUserId,
  currentUserRole,
  selectedChannelId,
  refreshChat,
  children 
}: { 
  message: MessageType; 
  customEmojis: CustomEmojiType[]; 
  currentUserId: string;
  currentUserRole: string;
  selectedChannelId: string | null;
  refreshChat: (id?: string | null) => void;
  children: React.ReactNode; 
}) {
  const [isPending, startTransition] = useTransition();
  const [isReactionPickerOpen, setIsReactionPickerOpen] = useState(false);

  useEffect(() => {
    if (!isReactionPickerOpen) return;
    
    const handleScroll = (e: Event) => {
      // Close the picker on any scroll event in the document
      setIsReactionPickerOpen(false);
    };

    // Use capture phase to catch scroll events from any scrollable child
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [isReactionPickerOpen]);

  const handleToggleReaction = (emoji: string | null, customEmojiId: string | null) => {
    startTransition(async () => {
      await toggleChatReactionAction(message.id, emoji, customEmojiId);
      refreshChat(selectedChannelId);
    });
  };

  // Group reactions
  const reactionGroups = useMemo(() => {
    const groups: Record<string, { count: number; users: string[]; hasReacted: boolean; emoji: string | null; customUrl: string | null; customName: string | null; customEmojiId: string | null; }> = {};
    for (const r of message.reactions) {
      const key = r.customEmojiId || r.emoji || "unknown";
      if (!groups[key]) {
        groups[key] = { count: 0, users: [], hasReacted: false, emoji: r.emoji, customUrl: r.customEmojiUrl, customName: r.customEmojiName, customEmojiId: r.customEmojiId };
      }
      groups[key].count++;
      groups[key].users.push(r.userName);
      if (r.userId === currentUserId) groups[key].hasReacted = true;
    }
    return Object.values(groups);
  }, [message.reactions, currentUserId]);

  return (
    <article className={cn("group relative flex w-full gap-2.5 rounded-lg px-2 py-1.5 transition-colors", message.isOwnMessage ? "bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50" : "hover:bg-muted/40")}>
      <div className="shrink-0 mt-0.5">
        {message.senderPhotoUrl ? (
          <img src={message.senderPhotoUrl} alt={message.senderName} className="h-8 w-8 rounded-md object-cover shadow-sm border border-border/50" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary border border-primary/20">
            {message.senderName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="font-semibold text-xs text-foreground">{message.isOwnMessage ? "You" : message.senderName}</span>
          <span className="text-[10px] text-muted-foreground" title={format(new Date(message.createdAt), "PPpp")}>
            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
          </span>
        </div>
        <div className="mt-0.5 text-[13px] text-foreground/90">
          {message.isUnsent ? (
            <p className="italic text-muted-foreground opacity-75 text-xs">{message.senderName} unsent a message</p>
          ) : (
            <>
              {(!message.attachments?.some(a => a.mimeType.startsWith('image/') && message.body === `Attached ${a.fileName}`)) && (
                <p className="whitespace-pre-wrap break-words leading-relaxed">
                  {parseCustomEmojis(message.body, customEmojis)}
                </p>
              )}
              {children}
            </>
          )}
        </div>
        
        {/* Reactions Display */}
        {reactionGroups.length > 0 && !message.isUnsent && (
          <div className="mt-1 flex flex-wrap gap-1">
            {reactionGroups.map((rg, idx) => (
              <button 
                key={idx}
                onClick={() => handleToggleReaction(rg.emoji, rg.customEmojiId)}
                title={rg.users.join(", ")}
                className={cn(
                  "flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[11px] transition-colors",
                  rg.hasReacted ? "bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700 text-blue-600 dark:text-blue-400" : "bg-background hover:bg-muted"
                )}
              >
                {rg.customUrl ? (
                  <Image src={rg.customUrl.startsWith('/uploads/') ? rg.customUrl.replace('/uploads/', '/api/file/') : rg.customUrl} alt={rg.customName || "emoji"} width={14} height={14} unoptimized className="object-contain" />
                ) : (
                  <span>{rg.emoji}</span>
                )}
                <span className="font-semibold">{rg.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hover Action Menu */}
      {!message.isUnsent && (
        <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100 flex items-center bg-background rounded-md shadow-sm border p-0.5 z-10 gap-0.5">
          <Popover open={isReactionPickerOpen} onOpenChange={setIsReactionPickerOpen}>
            <PopoverTrigger asChild>
              <button type="button" className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                <Smile className="h-3.5 w-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent side="top" align="end" className="w-64 p-0 shadow-xl bg-background border border-border" avoidCollisions={false}>
              <Tabs defaultValue="standard" className="w-full">
                <div className="bg-muted px-2 pt-2 border-b border-border">
                  <TabsList className="h-7 bg-transparent p-0 w-full justify-start gap-4">
                    <TabsTrigger value="standard" className="text-xs h-7 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 data-[state=active]:shadow-none">Standard</TabsTrigger>
                    <TabsTrigger value="custom" className="text-xs h-7 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 data-[state=active]:shadow-none">Custom</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="standard" className="p-2 m-0 grid grid-cols-6 gap-1">
                  {REACTION_EMOJIS.map(emoji => (
                    <button key={emoji} onClick={() => handleToggleReaction(emoji, null)} className="flex h-8 items-center justify-center rounded hover:bg-muted text-lg transition-transform hover:scale-110">
                      {emoji}
                    </button>
                  ))}
                </TabsContent>
                <TabsContent value="custom" className="p-2 m-0 h-32 overflow-y-auto">
                  {customEmojis.length === 0 ? (
                    <div className="text-xs text-center text-muted-foreground pt-4">No custom emojis found.</div>
                  ) : (
                    <div className="grid grid-cols-5 gap-1">
                      {customEmojis.map(ce => (
                        <button key={ce.id} onClick={() => handleToggleReaction(null, ce.id)} title={`:${ce.name}:`} className="flex h-9 items-center justify-center rounded hover:bg-muted transition-transform hover:scale-110 p-1">
                          <Image src={ce.imageUrl.startsWith('/uploads/') ? ce.imageUrl.replace('/uploads/', '/api/file/') : ce.imageUrl} alt={ce.name} width={24} height={24} unoptimized className="object-contain max-h-full" />
                        </button>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </PopoverContent>
          </Popover>
          
          {message.isOwnMessage && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button type="button" className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Unsend Message</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to unsend this message? 
                    {currentUserRole === "SUPER_ADMIN" ? " As a System Administrator, you can hard delete this message to remove all traces." : " This will leave an 'unsent message' tombstone."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  {currentUserRole === "SUPER_ADMIN" && (
                    <AlertDialogAction
                      onClick={async () => {
                        await unsendChatMessageAction(message.id, true);
                        refreshChat(selectedChannelId);
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Hard Delete
                    </AlertDialogAction>
                  )}
                  <AlertDialogAction
                    onClick={async () => {
                      await unsendChatMessageAction(message.id, false);
                      refreshChat(selectedChannelId);
                    }}
                  >
                    Unsend
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      )}
    </article>
  );
}
