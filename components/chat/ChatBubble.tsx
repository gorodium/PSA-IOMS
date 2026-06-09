"use client";

import { useEffect, useRef, useState, useTransition, FormEvent } from "react";
import { useChatGlobal } from "./ChatGlobalProvider";
import { getChatSnapshotAction, markChatChannelReadAction, sendChatMessageAction } from "@/app/(app)/chat/actions";
import { X, Minus, Paperclip, Smile, Send, MessageSquare, Hash, ShieldAlert, Bell, Plus, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatChatName } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ChatMessageItem } from "./ChatMessageItem";
import { NotificationBadge } from "@/components/ui/notification-badge";

// ── Emoji palette ─────────────────────────────────────────────────────────────
const emoticons = ["🙂", "😊", "👍", "👏", "🙏", "✅", "📌", "⚠️", "🎉", "😂", "❤️", "💡", "🔥", "💯", "🤔", "👀", "✨", "🚀", "😎", "🥳", "🤝", "💪"];

// ── GIF search using Tenor public API ─────────────────────────────────────────
const TENOR_KEY = process.env.NEXT_PUBLIC_TENOR_API_KEY || "";
const TENOR_SEARCH_URL = "https://tenor.googleapis.com/v2/search";
const TENOR_FEATURED_URL = "https://tenor.googleapis.com/v2/featured";

interface TenorGif {
  id: string;
  title: string;
  media_formats: {
    tinygif?: { url: string; dims: number[] };
    gif?: { url: string };
  };
}

export function ChatBubble({ channelId, isMinimized }: { channelId: string; isMinimized: boolean }) {
  const { snapshot, closeBubble, toggleBubbleMinimized, refreshChat: globalRefreshChat } = useChatGlobal();

  const [messagesData, setMessagesData] = useState<Record<string, unknown> | null>(null);
  const [messageBody, setMessageBody] = useState("");
  const [showEmoticons, setShowEmoticons] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifQuery, setGifQuery] = useState("");
  const [gifs, setGifs] = useState<TenorGif[]>([]);
  const [gifLoading, setGifLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [dragCounter, setDragCounter] = useState(0);

  const [isPending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatFormRef = useRef<HTMLFormElement>(null);
  const gifSearchRef = useRef<HTMLInputElement>(null);
  const gifDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const channel = snapshot?.channels.find(c => c.id === channelId);
  const isTyping = messageBody.trim().length > 0;

  // ── Messages ────────────────────────────────────────────────────────────────
  const refreshMessages = () => {
    startTransition(async () => {
      try {
        const data = await getChatSnapshotAction(channelId);
        setMessagesData(data);
      } catch (e) {
        console.error(e);
      }
    });
  };

  useEffect(() => {
    refreshMessages();
    const interval = window.setInterval(refreshMessages, 2000);
    return () => window.clearInterval(interval);
  }, [channelId]);

  useEffect(() => {
    if (!isMinimized && channel?.unreadCount && channel.unreadCount > 0) {
      markChatChannelReadAction(channelId).then(() => globalRefreshChat());
    }
  }, [isMinimized, channel?.unreadCount, channelId, globalRefreshChat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight });
    }
  }, [messagesData?.messages?.length, isMinimized]);

  // Close overlays when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-plus-menu]")) setShowPlusMenu(false);
      if (!target.closest("[data-emoji-panel]")) setShowEmoticons(false);
      if (!target.closest("[data-gif-panel]")) {
        setShowGifPicker(false);
        setGifQuery("");
        setGifs([]);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ── GIF loader ──────────────────────────────────────────────────────────────
  async function loadGifs(q: string) {
    setGifLoading(true);
    try {
      const url = q.trim()
        ? `${TENOR_SEARCH_URL}?key=${TENOR_KEY}&q=${encodeURIComponent(q)}&limit=16&media_filter=tinygif`
        : `${TENOR_FEATURED_URL}?key=${TENOR_KEY}&limit=16&media_filter=tinygif`;
      const res = await fetch(url);
      const data = await res.json();
      setGifs(data.results ?? []);
    } catch {
      setGifs([]);
    } finally {
      setGifLoading(false);
    }
  }

  function openGifPicker() {
    setShowGifPicker(true);
    setShowPlusMenu(false);
    setShowEmoticons(false);
    if (gifs.length === 0) loadGifs("");
    setTimeout(() => gifSearchRef.current?.focus(), 50);
  }

  function handleGifQueryChange(v: string) {
    setGifQuery(v);
    if (gifDebounceRef.current) clearTimeout(gifDebounceRef.current);
    gifDebounceRef.current = setTimeout(() => loadGifs(v), 400);
  }

  async function sendGifMessage(gif: TenorGif) {
    const gifUrl = gif.media_formats?.gif?.url ?? gif.media_formats?.tinygif?.url;
    if (!gifUrl) return;
    setShowGifPicker(false);
    setGifQuery("");
    setGifs([]);

    const formData = new FormData();
    formData.set("channelId", channelId);
    formData.set("body", gifUrl); // store as body; rendering detects .gif URLs
    const result = await sendChatMessageAction(formData);
    if (!result.ok) { setError(result.message); return; }
    refreshMessages();
    globalRefreshChat();
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 100);
  }

  // ── Send message ────────────────────────────────────────────────────────────
  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("channelId", channelId);

    const result = await sendChatMessageAction(formData);
    if (!result.ok) { setError(result.message); return; }

    setMessageBody("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError("");
    refreshMessages();
    globalRefreshChat();
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 100);
  }

  // ── Drag & Drop and Paste ───────────────────────────────────────────────────
  function handlePaste(e: React.ClipboardEvent) {
    if (e.clipboardData.files && e.clipboardData.files.length > 0) {
      e.preventDefault();
      setSelectedFile(e.clipboardData.files[0]);
      setShowPlusMenu(false);
    }
  }

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault();
    setDragCounter(prev => prev + 1);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragCounter(prev => prev - 1);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragCounter(0);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
      setShowPlusMenu(false);
    }
  }

  const isDragging = dragCounter > 0;

  if (!channel) return null;

  const safePhotoUrl = channel.photoUrl?.startsWith("/uploads/") ? channel.photoUrl.replace("/uploads/", "/api/file/") : channel.photoUrl;
  const displayName = formatChatName(channel.name);
  const isDirectMessage = channel.channelType === "DIRECT" || channel.name.startsWith("DM_") || channel.name.startsWith("DM: ");
  const isGroupChat = !isDirectMessage && channel.channelType !== "ADMIN_REQUESTS" && channel.channelType !== "SYSTEM" && channel.channelType !== "ADMIN_FEEDBACK";

  const getInitials = (name: string) => {
    const words = name.split(" ").filter(w => w.length > 0);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const bubbleIcon = safePhotoUrl ? (
    <img src={safePhotoUrl} alt="" className="h-full w-full object-cover rounded-full" />
  ) : isDirectMessage ? (
    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary text-xl font-bold rounded-full">
      {displayName.charAt(0).toUpperCase()}
    </div>
  ) : isGroupChat ? (
    <div className="flex h-full w-full items-center justify-center bg-emerald-600 text-white text-xl font-bold rounded-full">
      {getInitials(displayName)}
    </div>
  ) : (
    <MessageSquare className="h-6 w-6" />
  );

  // ── Minimized pill ──────────────────────────────────────────────────────────
  if (isMinimized) {
    return (
      <div className="relative group">
        <button
          onClick={() => toggleBubbleMinimized(channelId)}
          className={cn(
            "relative flex h-14 w-14 items-center justify-center rounded-full shadow-xl ring-1 ring-black/10 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring overflow-hidden",
            isGroupChat
              ? "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-emerald-950"
              : "bg-primary text-primary-foreground dark:bg-white dark:text-[hsl(222,47%,25%)]"
          )}
        >
          {bubbleIcon}
        </button>
        <NotificationBadge open={channel.unreadCount > 0} count={channel.unreadCount > 99 ? "99+" : channel.unreadCount} />
        <button
          onClick={(e) => { e.stopPropagation(); closeBubble(channelId); }}
          className="absolute -top-2 -right-2 h-5 w-5 bg-background border border-border rounded-full flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-foreground hover:bg-muted shadow-sm"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  }

  // ── Expanded bubble ─────────────────────────────────────────────────────────
  return (
    <div 
      className="relative flex flex-col h-[480px] w-[340px] bg-background border border-border shadow-2xl rounded-t-xl rounded-bl-xl overflow-hidden animate-in slide-in-from-bottom-2"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onPaste={handlePaste}
    >
      {isDragging && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm border-2 border-dashed border-primary rounded-xl">
          <div className="flex flex-col items-center text-primary pointer-events-none">
            <Paperclip className="h-10 w-10 mb-2 animate-bounce" />
            <p className="font-semibold text-lg">Drop file to attach</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={cn("flex items-center justify-between px-3 py-2 text-primary-foreground shadow-sm shrink-0", isGroupChat ? "bg-emerald-600 dark:bg-emerald-700" : "bg-primary")}>
        <div className="flex items-center gap-2 truncate cursor-pointer flex-1" onClick={() => toggleBubbleMinimized(channelId)}>
          <div className={cn("h-6 w-6 rounded-full overflow-hidden shrink-0 flex items-center justify-center", isGroupChat ? "bg-emerald-700/50" : "bg-primary-foreground/20")}>
            {safePhotoUrl ? (
              <img src={safePhotoUrl} alt="" className="h-full w-full object-cover" />
            ) : isDirectMessage ? (
              <span className="text-xs font-bold">{displayName.charAt(0).toUpperCase()}</span>
            ) : isGroupChat ? (
              <span className="text-[10px] font-bold text-white">{getInitials(displayName)}</span>
            ) : channel.channelType === "ADMIN_REQUESTS" ? <ShieldAlert className="h-3.5 w-3.5" /> :
              channel.channelType === "SYSTEM" || channel.channelType === "ADMIN_FEEDBACK" ? <Bell className="h-3.5 w-3.5" /> :
                <Hash className="h-3.5 w-3.5" />}
          </div>
          <span className="font-semibold text-sm truncate">{displayName}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => toggleBubbleMinimized(channelId)} className="h-6 w-6 rounded hover:bg-primary-foreground/20 flex items-center justify-center transition-colors">
            <Minus className="h-4 w-4" />
          </button>
          <button onClick={() => closeBubble(channelId)} className="h-6 w-6 rounded hover:bg-primary-foreground/20 flex items-center justify-center transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 bg-muted/5">
        {isPending && !messagesData ? (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">Loading...</div>
        ) : messagesData?.messages?.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground/50">
            <MessageSquare className="h-8 w-8 mb-2" />
            <p className="text-xs">No messages yet.</p>
          </div>
        ) : (
          messagesData?.messages?.map((message: Record<string, unknown>) => (
            <ChatMessageItem
              key={message.id}
              message={message}
              customEmojis={messagesData.customEmojis}
              currentUserId={messagesData.currentUserId}
              currentUserRole={messagesData.currentUserRole}
              selectedChannelId={channelId}
              refreshChat={refreshMessages}
            />
          ))
        )}
      </div>

      {/* ── Input area ────────────────────────────────────────────────────── */}
      <div className="relative shrink-0 px-2 py-1.5 bg-background border-t">
        <form ref={chatFormRef} onSubmit={handleSend}>
          {error && (
            <div className="mb-1 rounded bg-destructive/10 px-2 py-1 text-[10px] text-destructive ring-1 ring-destructive/20 truncate">{error}</div>
          )}

          {/* Selected file preview */}
          {selectedFile && (
            <div className="mb-1.5 flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-1.5 text-xs">
              <Paperclip className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="truncate flex-1 font-medium">{selectedFile.name}</span>
              <button type="button" className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}>
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* ── GIF picker panel ─────────────────────────────────────────── */}
          {showGifPicker && (
            <div data-gif-panel className="absolute bottom-[calc(100%+4px)] left-0 right-0 z-50 mx-2 rounded-xl border bg-background shadow-xl overflow-hidden" style={{ bottom: "calc(100% + 56px)" }}>
              <div className="p-2 border-b">
                <input
                  ref={gifSearchRef}
                  type="text"
                  placeholder="Search GIFs..."
                  value={gifQuery}
                  onChange={e => handleGifQueryChange(e.target.value)}
                  className="w-full rounded-full bg-muted px-3 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <div className="h-[200px] overflow-y-auto p-1.5">
                {gifLoading ? (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">Loading GIFs...</div>
                ) : gifs.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No GIFs found.</div>
                ) : (
                  <div className="grid grid-cols-3 gap-1">
                    {gifs.map(gif => {
                      const thumbUrl = gif.media_formats?.tinygif?.url;
                      if (!thumbUrl) return null;
                      return (
                        <button
                          key={gif.id}
                          type="button"
                          onClick={() => sendGifMessage(gif)}
                          className="relative aspect-video rounded overflow-hidden hover:ring-2 hover:ring-primary transition-all bg-muted"
                        >
                          <img src={thumbUrl} alt={gif.title} className="w-full h-full object-cover" loading="lazy" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="px-2 py-1 border-t text-[10px] text-muted-foreground text-right">Powered by Tenor</div>
            </div>
          )}

          {/* ── Plus menu popup ───────────────────────────────────────────── */}
          {showPlusMenu && (
            <div data-plus-menu className="absolute bottom-[calc(100%+8px)] left-1 z-50 rounded-xl border bg-popover shadow-xl py-1 w-52">
              <button
                type="button"
                data-plus-menu
                onClick={() => { setShowPlusMenu(false); fileInputRef.current?.click(); }}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm hover:bg-muted transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Paperclip className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">Attach a file</div>
                  <div className="text-[10px] text-muted-foreground">Up to 100 MB</div>
                </div>
              </button>
              <button
                type="button"
                data-plus-menu
                onClick={openGifPicker}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm hover:bg-muted transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                  <span className="text-purple-500 font-black text-[11px] leading-none">GIF</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">Choose a GIF</div>
                  <div className="text-[10px] text-muted-foreground">Search Tenor GIFs</div>
                </div>
              </button>
            </div>
          )}

          {/* ── Emoji picker popup ────────────────────────────────────────── */}
          {showEmoticons && (
            <div data-emoji-panel className="absolute bottom-[calc(100%+8px)] right-2 z-50 rounded-xl border bg-background shadow-xl p-2 w-[220px]">
              <div className="flex flex-wrap gap-0.5">
                {emoticons.map((emoticon) => (
                  <button key={emoticon} type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted text-base transition-colors"
                    onClick={() => { setMessageBody(c => `${c}${emoticon}`); setShowEmoticons(false); }}>
                    {emoticon}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Row: + | attach | GIF | input pill | send ── */}
          <div className="flex items-center gap-1 w-full">

            {/* + / × toggle */}
            <button
              type="button"
              data-plus-menu
              onClick={() => { setShowPlusMenu(v => !v); setShowEmoticons(false); setShowGifPicker(false); }}
              className={cn(
                "shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-200",
                showPlusMenu
                  ? "bg-muted text-foreground rotate-45"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              aria-label={showPlusMenu ? "Close menu" : "More options"}
            >
              <Plus className="h-[18px] w-[18px]" />
            </button>

            {/* Attach button — hidden when typing */}
            <button
              type="button"
              onClick={() => { setShowPlusMenu(false); fileInputRef.current?.click(); }}
              className={cn(
                "shrink-0 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200",
                isTyping ? "w-0 opacity-0 pointer-events-none overflow-hidden" : "w-8 opacity-100"
              )}
              aria-label="Attach a file"
            >
              <ImageIcon className="h-[18px] w-[18px]" />
            </button>

            {/* GIF button — hidden when typing */}
            <button
              type="button"
              data-gif-panel
              onClick={openGifPicker}
              className={cn(
                "shrink-0 h-8 rounded-full px-1 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 font-black text-[10px]",
                isTyping ? "w-0 px-0 opacity-0 pointer-events-none overflow-hidden" : "w-8 opacity-100"
              )}
              aria-label="GIF"
            >
              GIF
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              name="attachment"
              accept="image/*,image/gif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.mp4,.webm,.mp3,.wav,.zip,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/zip"
              className="hidden"
              onChange={(e) => { setSelectedFile(e.target.files?.[0] ?? null); setShowPlusMenu(false); }}
            />

            {/* Input pill */}
            <div className="flex-1 flex items-center bg-muted/60 rounded-full min-h-[32px] relative">
              <Textarea
                name="body"
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (messageBody.trim() || selectedFile) chatFormRef.current?.requestSubmit();
                  }
                }}
                placeholder="Aa"
                rows={1}
                className="flex-1 min-h-0 resize-none border-0 bg-transparent py-1.5 pl-3 pr-1 text-sm leading-tight text-foreground dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
              />
              {/* Emoji button inside pill */}
              <button
                type="button"
                data-emoji-panel
                onClick={() => { setShowEmoticons(v => !v); setShowPlusMenu(false); setShowGifPicker(false); }}
                className="shrink-0 mr-1 h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-amber-500 transition-colors"
                aria-label="Emoji"
              >
                <Smile className="h-4 w-4" />
              </button>
            </div>

            {/* Send / thumb button */}
            <button
              type="submit"
              disabled={!messageBody.trim() && !selectedFile}
              className={cn(
                "shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-all",
                messageBody.trim() || selectedFile
                  ? "text-primary hover:bg-primary/10"
                  : "text-primary/40"
              )}
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
