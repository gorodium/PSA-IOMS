"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { Bell, Expand, FileText, ImageIcon, MessageSquare, Minus, Paperclip, Send, Settings, Smile, Trash2, X, Info, Clock, Hash, ShieldAlert, Car, Building2, ChevronRight, AlertCircle, ChevronDown, Check } from "lucide-react";
import {
  getChatSnapshotAction,
  markChatChannelReadAction,
  sendChatMessageAction,
  unsendChatMessageAction,
  type ChatSnapshot
} from "@/app/(app)/chat/actions";
import { ChatMessageItem } from "./ChatMessageItem";
import { ChatImageLightbox } from "./ChatImageLightbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const emoticons = ["🙂", "😊", "👍", "👏", "🙏", "✅", "📌", "⚠️", "🎉", "😂", "❤️", "💡"];

type ChatDockProps = {
  canManageChat: boolean;
  defaultOpen?: boolean;
};

type RequestCardMetadata = {
  requestType?: string;
  status?: string;
  href?: string;
  actionLabel?: string;
  actorName?: string;
  details?: Record<string, string>;
};

function isRequestMetadata(value: unknown): value is RequestCardMetadata {
  return Boolean(value && typeof value === "object" && "requestType" in value);
}

function formatFileSize(size: number) {
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

function AttachmentPreview({ attachment }: { attachment: { fileName: string; fileUrl: string; mimeType: string; fileSize: number; }}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const isImage = attachment.mimeType.startsWith("image/");
  const isPdf = attachment.mimeType === "application/pdf";
  const Icon = isImage ? ImageIcon : FileText;

  // Serve uploads via the new dynamic API route instead of Next.js static asset folder
  const safeUrl = attachment.fileUrl.startsWith('/uploads/') 
    ? attachment.fileUrl.replace('/uploads/', '/api/file/') 
    : attachment.fileUrl;

  return (
    <>
      <div className={`mt-1.5 overflow-hidden transition-all ${isImage ? 'rounded-lg' : 'rounded-md border bg-background text-xs shadow-sm'}`}>
        {isImage && (
          <button type="button" onClick={() => setLightboxOpen(true)} className="block w-full cursor-zoom-in relative">
            <Image
              src={safeUrl}
              alt={attachment.fileName}
              width={760}
              height={428}
              unoptimized
              className="max-h-[300px] w-auto max-w-full rounded-lg object-contain"
            />
          </button>
        )}
        {isPdf && (
          <div className="border-b bg-white">
            <iframe src={`${safeUrl}#toolbar=0&navpanes=0`} title={attachment.fileName} className="h-32 w-full bg-white" />
          </div>
        )}
        {!isImage && (
          <a href={safeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 hover:bg-muted/50 transition">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 truncate font-medium text-left">
              {attachment.fileName}
            </div>
            <div className="text-muted-foreground">
              {formatFileSize(attachment.fileSize)}
            </div>
          </a>
        )}
      </div>
      {isImage && (
        <ChatImageLightbox 
          isOpen={lightboxOpen} 
          onClose={() => setLightboxOpen(false)} 
          imageUrl={safeUrl} 
          altText={attachment.fileName} 
        />
      )}
    </>
  );
}

function getRequestIcon(type: string | undefined) {
  if (type?.includes("Vehicle")) return <Car className="h-3.5 w-3.5" />;
  if (type?.includes("Room")) return <Building2 className="h-3.5 w-3.5" />;
  if (type?.includes("Admin")) return <ShieldAlert className="h-3.5 w-3.5" />;
  return <Info className="h-3.5 w-3.5" />;
}

function getStatusColor(status: string | undefined) {
  const s = status?.toLowerCase() || "";
  if (s.includes("approved") || s.includes("success")) return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  if (s.includes("rejected") || s.includes("cancelled") || s.includes("declined")) return "bg-rose-500/10 text-rose-600 border-rose-500/20";
  if (s.includes("pending") || s.includes("review")) return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  return "bg-slate-500/10 text-slate-600 border-slate-500/20";
}

function RequestMessageCard({ metadata }: { metadata: RequestCardMetadata }) {
  const icon = getRequestIcon(metadata.requestType);
  const statusColor = getStatusColor(metadata.status);

  return (
    <div className="mt-1.5 overflow-hidden rounded-lg border bg-card shadow-sm transition-all w-full">
      <div className="border-b bg-muted/30 px-3 py-2 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-semibold text-[13px] text-foreground">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-background shadow-sm border text-muted-foreground">
              {icon}
            </div>
            <span className="truncate">{metadata.requestType ?? "System Notification"}</span>
          </div>
          {metadata.status && (
            <div className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium border shrink-0", statusColor)}>
              {metadata.status}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-3 text-xs">
        {metadata.actionLabel && (
          <p className="mb-2.5 font-medium text-foreground">
            {metadata.actionLabel}
            {metadata.actorName ? <span className="text-muted-foreground"> by {metadata.actorName}</span> : ""}
          </p>
        )}
        <dl className="grid gap-x-3 gap-y-1.5 grid-cols-1">
          {Object.entries(metadata.details ?? {}).map(([label, value]) => (
            <div key={label} className="grid grid-cols-[80px_1fr] gap-1">
              <dt className="font-medium text-muted-foreground truncate">{label}</dt>
              <dd className="font-medium text-foreground line-clamp-2">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {metadata.href && (
        <div className="border-t bg-muted/10 px-3 py-2">
          <Button asChild size="sm" variant="secondary" className="w-full h-7 text-xs">
            <Link href={metadata.href}>
              View Details <ChevronRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

export function ChatDock({ canManageChat, defaultOpen = false }: ChatDockProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [snapshot, setSnapshot] = useState<ChatSnapshot | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [messageBody, setMessageBody] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only set dragging to false if we're leaving the main container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (fileInputRef.current) {
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInputRef.current.files = dt.files;
      }
    }
  };
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showEmoticons, setShowEmoticons] = useState(false);
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatFormRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedChannelIdRef = useRef<string | null>(null);
  const refreshRequestIdRef = useRef(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedChannel = useMemo(
    () => snapshot?.channels.find((channel) => channel.id === selectedChannelId) ?? null,
    [selectedChannelId, snapshot]
  );

  const setSelectedChannel = useCallback((channelId: string | null) => {
    selectedChannelIdRef.current = channelId;
    setSelectedChannelId(channelId);
    setShowChannelDropdown(false);
  }, []);

  const refreshChat = useCallback((channelId?: string | null) => {
    const requestedChannelId = channelId ?? selectedChannelIdRef.current;
    const requestId = refreshRequestIdRef.current + 1;
    refreshRequestIdRef.current = requestId;

    startTransition(async () => {
      try {
        const nextSnapshot = await getChatSnapshotAction(requestedChannelId);
        if (requestId !== refreshRequestIdRef.current) return;

        const nextSelectedChannelId =
          requestedChannelId && nextSnapshot.channels.some((channel) => channel.id === requestedChannelId)
            ? requestedChannelId
            : nextSnapshot.selectedChannelId;

        setSnapshot({ ...nextSnapshot, selectedChannelId: nextSelectedChannelId });
        if (nextSelectedChannelId !== selectedChannelIdRef.current) {
          setSelectedChannel(nextSelectedChannelId);
        }
        setError("");
      } catch (caughtError) {
        if (requestId !== refreshRequestIdRef.current) return;
        setError(caughtError instanceof Error ? caughtError.message : "Chat could not be loaded.");
      }
    });
  }, [setSelectedChannel]);

  useEffect(() => {
    if (!isOpen) return;
    refreshChat();
    const interval = window.setInterval(() => refreshChat(), 15000);
    return () => window.clearInterval(interval);
  }, [isOpen, refreshChat]);

  useEffect(() => {
    if (!isOpen || !selectedChannelId) return;
    markChatChannelReadAction(selectedChannelId)
      .then(() => { if (selectedChannelIdRef.current === selectedChannelId) refreshChat(selectedChannelId); })
      .catch(() => undefined);
  }, [isOpen, refreshChat, selectedChannelId, snapshot?.messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 80;
      if (isNearBottom || scrollTop === 0) {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight });
      }
    }
  }, [snapshot?.messages.length, isOpen]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowChannelDropdown(false);
      }
    }
    if (showChannelDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showChannelDropdown]);

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const currentChannelId = selectedChannelIdRef.current;
    if (!currentChannelId) {
      setError("Choose a chat channel before sending.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    formData.set("channelId", currentChannelId);
    const result = await sendChatMessageAction(formData);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    setMessageBody("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError("");
    refreshChat(currentChannelId);
    
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 100);
  }

  const totalUnread = snapshot?.totalUnread ?? 0;
  const adminChannels = snapshot?.channels.filter(c => c.channelType === "ADMIN_REQUESTS") || [];
  const systemChannels = snapshot?.channels.filter(c => c.channelType === "SYSTEM") || [];
  const generalChannels = snapshot?.channels.filter(c => c.channelType !== "ADMIN_REQUESTS" && c.channelType !== "SYSTEM") || [];
  const hasCriticalUnread = snapshot?.channels.some(c => c.channelType === "ADMIN_REQUESTS" && c.unreadCount > 0);

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full text-primary-foreground shadow-xl ring-1 ring-black/10 transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          hasCriticalUnread ? "bg-red-600 animate-pulse" : "bg-primary"
        )}
        aria-label="Open internal chat"
      >
        <MessageSquare className="h-6 w-6" />
        {totalUnread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-background bg-destructive px-1 text-[10px] font-bold text-white shadow-sm">
            {totalUnread > 99 ? "99+" : totalUnread}
          </span>
        )}
      </button>
    );
  }

  return (
    <section 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex h-[min(600px,85vh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-border/50 bg-background shadow-2xl animate-in slide-in-from-bottom-10 duration-200"
    >
      {isDragging && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm border-2 border-dashed border-primary rounded-xl m-2">
          <div className="flex flex-col items-center text-primary pointer-events-none">
            <Paperclip className="h-10 w-10 mb-2 animate-bounce" />
            <p className="font-medium">Drop file to attach</p>
          </div>
        </div>
      )}
      <header className="relative flex shrink-0 flex-col border-b bg-muted/20">
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="relative flex-1" ref={dropdownRef}>
            <button
              onClick={() => setShowChannelDropdown(!showChannelDropdown)}
              className="flex w-full items-center justify-between rounded-md border bg-background px-3 py-1.5 text-sm shadow-sm transition-colors hover:bg-muted/50 focus:outline-none"
            >
              <div className="flex items-center gap-2 truncate">
                {selectedChannel?.channelType === "ADMIN_REQUESTS" ? <ShieldAlert className="h-4 w-4 text-amber-500" /> : 
                 selectedChannel?.channelType === "SYSTEM" ? <Bell className="h-4 w-4 text-blue-500" /> : 
                 <Hash className="h-4 w-4 text-muted-foreground" />}
                <span className="font-semibold truncate">{selectedChannel?.name ?? "Select Channel"}</span>
              </div>
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", showChannelDropdown && "rotate-180")} />
            </button>

            {/* Custom Channel Dropdown */}
            {showChannelDropdown && snapshot && (
              <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-md border bg-background text-popover-foreground shadow-lg slide-in-from-top-2 animate-in duration-150">
                <div className="max-h-[300px] overflow-y-auto p-1">
                  {adminChannels.length > 0 && (
                    <div className="mb-1">
                      <div className="px-2 py-1.5 text-[10px] font-semibold uppercase text-muted-foreground">Secure</div>
                      {adminChannels.map(channel => (
                        <button key={channel.id} onClick={() => { setSelectedChannel(channel.id); refreshChat(channel.id); }} className={cn("relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground", selectedChannelId === channel.id && "bg-accent text-accent-foreground")}>
                          <ShieldAlert className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                          <span className="flex-1 text-left truncate">{channel.name}</span>
                          {channel.unreadCount > 0 && <span className="ml-auto rounded-full bg-destructive px-1.5 py-0.5 text-[9px] font-bold text-destructive-foreground">{channel.unreadCount}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                  {systemChannels.length > 0 && (
                    <div className="mb-1">
                      <div className="px-2 py-1.5 text-[10px] font-semibold uppercase text-muted-foreground">Notifications</div>
                      {systemChannels.map(channel => (
                        <button key={channel.id} onClick={() => { setSelectedChannel(channel.id); refreshChat(channel.id); }} className={cn("relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground", selectedChannelId === channel.id && "bg-accent text-accent-foreground")}>
                          <Bell className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                          <span className="flex-1 text-left truncate">{channel.name}</span>
                          {channel.unreadCount > 0 && <span className="ml-auto rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">{channel.unreadCount}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                  {generalChannels.length > 0 && (
                    <div className="mb-1">
                      <div className="px-2 py-1.5 text-[10px] font-semibold uppercase text-muted-foreground">Channels</div>
                      {generalChannels.map(channel => (
                        <button key={channel.id} onClick={() => { setSelectedChannel(channel.id); refreshChat(channel.id); }} className={cn("relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground", selectedChannelId === channel.id && "bg-accent text-accent-foreground")}>
                          <Hash className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                          <span className="flex-1 text-left truncate">{channel.name}</span>
                          {channel.unreadCount > 0 && <span className="ml-auto rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">{channel.unreadCount}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="ml-2 flex shrink-0 items-center gap-0.5 text-muted-foreground">
            <Button asChild size="icon" variant="ghost" className="h-8 w-8 hover:bg-muted" title="Open full chat page">
              <Link href="/chat"><Expand className="h-4 w-4" /></Link>
            </Button>
            {canManageChat && (
              <Button asChild size="icon" variant="ghost" className="h-8 w-8 hover:bg-muted" title="Manage chat channels">
                <Link href="/settings/chat"><Settings className="h-4 w-4" /></Link>
              </Button>
            )}
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8 hover:bg-muted" onClick={() => setIsOpen(false)} title="Minimize chat">
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-background">
        {isPending && !snapshot ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading...</div>
        ) : snapshot?.messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-2 text-muted-foreground">
            <MessageSquare className="h-6 w-6 opacity-30" />
            <p className="text-xs">No messages yet.</p>
          </div>
        ) : (
          snapshot?.messages.map((message) => {
            const metadata = isRequestMetadata(message.metadata) ? message.metadata : null;
            return (
              <ChatMessageItem 
                key={message.id} 
                message={message} 
                customEmojis={snapshot.customEmojis}
                currentUserId={snapshot.currentUserId}
                currentUserRole={snapshot.currentUserRole}
                selectedChannelId={selectedChannelId}
                refreshChat={refreshChat}
              >
                {message.attachments.map((attachment) => <AttachmentPreview key={attachment.id} attachment={attachment} />)}
                {metadata && <RequestMessageCard metadata={metadata} />}
              </ChatMessageItem>
            );
          })
        )}
      </div>

      <div className="shrink-0 p-3 bg-muted/10 border-t">
        <form ref={chatFormRef} onSubmit={handleSend} className="relative rounded-lg border bg-background shadow-sm focus-within:ring-1 focus-within:ring-primary/50 transition-all flex flex-col">
          {error && <div className="absolute -top-10 left-0 right-0 rounded bg-destructive/10 px-2 py-1 text-[11px] text-destructive ring-1 ring-destructive/20">{error}</div>}
          
          <input type="hidden" name="channelId" value={selectedChannelId ?? ""} />
          <input ref={fileInputRef} type="file" name="attachment" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*,application/pdf" className="hidden" onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)} />
          
          {showEmoticons && (
            <div className="absolute bottom-full left-0 z-10 mb-1 flex flex-wrap gap-1 w-full rounded-lg border bg-background p-2 shadow-lg">
              {emoticons.map((emoticon) => (
                <button key={emoticon} type="button" className="flex h-7 w-7 items-center justify-center rounded hover:bg-muted text-sm" onClick={() => { setMessageBody((current) => `${current}${emoticon}`); setShowEmoticons(false); }}>
                  {emoticon}
                </button>
              ))}
            </div>
          )}
          
          {selectedFile && (
            <div className="flex items-center gap-2 border-b bg-muted/20 px-2.5 py-1.5 text-[11px] relative">
              {selectedFile.type.startsWith('image/') ? (
                <div className="relative h-12 w-12 overflow-hidden rounded border bg-black/5">
                  <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="h-full w-full object-cover" />
                </div>
              ) : (
                <span className="min-w-0 truncate font-medium flex items-center gap-1.5 flex-1">
                  <Paperclip className="h-3 w-3 text-muted-foreground" />
                  {selectedFile.name}
                </span>
              )}
              <Button type="button" size="sm" variant="ghost" className="absolute right-1.5 top-1.5 h-5 w-5 p-0 rounded-full bg-background/80 text-muted-foreground hover:text-foreground shadow-sm hover:bg-background" onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          <Textarea
            name="body"
            value={messageBody}
            onChange={(event) => setMessageBody(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); if (selectedChannelIdRef.current && (messageBody.trim() || selectedFile)) chatFormRef.current?.requestSubmit(); } }}
            disabled={!selectedChannelId}
            placeholder={selectedChannelId ? "Type a message..." : "Select a channel"}
            className="min-h-[44px] max-h-[120px] w-full resize-none border-0 bg-transparent py-2.5 px-3 text-[13px] text-foreground dark:text-gray-100 focus-visible:ring-0"
          />
          
          <div className="flex items-center justify-between px-2 py-1.5 bg-muted/5 border-t">
            <div className="flex items-center gap-0.5">
              <Button type="button" size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground" disabled={!selectedChannelId} onClick={() => fileInputRef.current?.click()}>
                <Paperclip className="h-3.5 w-3.5" />
              </Button>
              <Button type="button" size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground" disabled={!selectedChannelId} onClick={() => setShowEmoticons(!showEmoticons)}>
                <Smile className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Button type="submit" size="sm" className="h-7 rounded px-3 text-xs font-medium shadow-none" disabled={!selectedChannelId || (!messageBody.trim() && !selectedFile)}>
              <Send className="mr-1.5 h-3 w-3" />
              Send
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
