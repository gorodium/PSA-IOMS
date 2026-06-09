"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { Bell, FileText, ImageIcon, Paperclip, Search, Send, Smile, Trash2, X, Info, Clock, Hash, ShieldAlert, Car, Building2, ChevronRight, AlertCircle, MessageSquare } from "lucide-react";
import { formatChatName } from "@/lib/utils";
import {
  getChatSnapshotAction,
  markChatChannelReadAction,
  sendChatMessageAction,
  unsendChatMessageAction,
  type ChatSnapshot
} from "@/app/(app)/chat/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ChatImageLightbox } from "./ChatImageLightbox";

const emoticons = ["🙂", "😊", "👍", "👏", "🙏", "✅", "📌", "⚠️", "🎉", "😂", "❤️", "💡"];

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
  const isImage = attachment.mimeType.startsWith("image/");
  const isPdf = attachment.mimeType === "application/pdf";
  const Icon = isImage ? ImageIcon : FileText;

  // Serve uploads via the dynamic API route to fix caching issues in prod
  const safeUrl = attachment.fileUrl.startsWith('/uploads/') 
    ? attachment.fileUrl.replace('/uploads/', '/api/file/') 
    : attachment.fileUrl;

  return (
    <div className={`mt-2 overflow-hidden transition-all max-w-sm ${isImage ? 'rounded-lg' : 'rounded-lg border bg-background text-xs shadow-sm hover:shadow-md'}`}>
      {isImage && (
        <a href={safeUrl} target="_blank" rel="noreferrer" className="block relative">
          <Image
            src={safeUrl}
            alt={attachment.fileName}
            width={760}
            height={428}
            unoptimized
            className="max-h-[300px] w-auto max-w-full rounded-lg object-contain"
          />
        </a>
      )}
      {isPdf && (
        <div className="border-b bg-white">
          <iframe src={`${safeUrl}#toolbar=0&navpanes=0`} title={attachment.fileName} className="h-64 w-full bg-white" />
        </div>
      )}
      {!isImage && (
        <a href={safeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 transition hover:bg-muted/50">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium">{attachment.fileName}</span>
            <span className="text-muted-foreground">{formatFileSize(attachment.fileSize)}</span>
          </span>
        </a>
      )}
    </div>
  );
}

function getRequestIcon(type: string | undefined) {
  if (type?.includes("Vehicle")) return <Car className="h-4 w-4" />;
  if (type?.includes("Room")) return <Building2 className="h-4 w-4" />;
  if (type?.includes("Admin")) return <ShieldAlert className="h-4 w-4" />;
  return <Info className="h-4 w-4" />;
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
    <div className="mt-2 overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md max-w-lg">
      <div className="border-b bg-muted/30 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-background shadow-sm border text-muted-foreground">
              {icon}
            </div>
            {metadata.requestType ?? "System Notification"}
          </div>
          {metadata.status && (
            <div className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", statusColor)}>
              {metadata.status}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 text-sm">
        {metadata.actionLabel && (
          <p className="mb-4 font-medium text-foreground">
            {metadata.actionLabel}
            {metadata.actorName ? <span className="text-muted-foreground"> by {metadata.actorName}</span> : ""}
          </p>
        )}
        <dl className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
          {Object.entries(metadata.details ?? {}).map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-medium text-muted-foreground mb-1">{label}</dt>
              <dd className="font-medium text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {metadata.href && (
        <div className="border-t bg-muted/10 px-4 py-3">
          <Button asChild size="sm" variant="secondary" className="w-full sm:w-auto">
            <Link href={metadata.href}>
              View Details <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

export function FullPageChat() {
  const [snapshot, setSnapshot] = useState<ChatSnapshot | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{url: string; alt: string} | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
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
  const [showEmoticons, setShowEmoticons] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedChannelRef = useRef<string | null>(null);
  const refreshIdRef = useRef(0);

  const selectedChannel = useMemo(
    () => snapshot?.channels.find((channel) => channel.id === selectedChannelId) ?? null,
    [selectedChannelId, snapshot]
  );

  const selectedMessage = useMemo(
    () => snapshot?.messages.find((m) => m.id === selectedMessageId) ?? null,
    [selectedMessageId, snapshot]
  );

  const refreshChat = useCallback((channelId?: string | null, query = searchQuery) => {
    const requestedChannel = channelId ?? selectedChannelRef.current;
    const refreshId = refreshIdRef.current + 1;
    refreshIdRef.current = refreshId;

    startTransition(async () => {
      try {
        const next = await getChatSnapshotAction(requestedChannel, query);
        if (refreshId !== refreshIdRef.current) return;

        const nextSelected =
          requestedChannel && next.channels.some((channel) => channel.id === requestedChannel)
            ? requestedChannel
            : next.selectedChannelId;
        selectedChannelRef.current = nextSelected;
        setSelectedChannelId(nextSelected);
        setSnapshot({ ...next, selectedChannelId: nextSelected });
        setError("");
      } catch (caughtError) {
        if (refreshId !== refreshIdRef.current) return;
        setError(caughtError instanceof Error ? caughtError.message : "Chat could not be loaded.");
      }
    });
  }, [searchQuery]);

  useEffect(() => {
    refreshChat(null, "");
    const interval = window.setInterval(() => refreshChat(selectedChannelRef.current, searchQuery), 15000);
    return () => window.clearInterval(interval);
  }, [refreshChat, searchQuery]);

  useEffect(() => {
    if (!selectedChannelId) return;
    markChatChannelReadAction(selectedChannelId).catch(() => undefined);
  }, [selectedChannelId, snapshot?.messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      if (isNearBottom || scrollTop === 0) {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight });
      }
    }
  }, [snapshot?.messages.length]);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    refreshChat(selectedChannelId, searchQuery);
  }

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const channelId = selectedChannelRef.current;
    if (!channelId) {
      setError("Choose a chat channel before sending.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    formData.set("channelId", channelId);
    const result = await sendChatMessageAction(formData);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    setMessageBody("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    refreshChat(channelId, searchQuery);
    
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 100);
  }

  const isDirectMessage = (c?: { name: string } | null) => {
    if (!c || !c.name) return false;
    return c.name.startsWith("DM_") || c.name.startsWith("DM: ");
  };

  const adminChannels = snapshot?.channels.filter(c => c.channelType === "ADMIN_REQUESTS") || [];
  const systemChannels = snapshot?.channels.filter(c => c.channelType === "SYSTEM") || [];
  const directMessages = snapshot?.channels.filter(c => isDirectMessage(c)) || [];
  const generalChannels = snapshot?.channels.filter(c => c.channelType !== "ADMIN_REQUESTS" && c.channelType !== "SYSTEM" && !isDirectMessage(c)) || [];

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-[620px] overflow-hidden rounded-xl border bg-background shadow-sm">
      {/* LEFT SIDEBAR */}
      <aside className="hidden lg:flex w-[260px] shrink-0 flex-col border-r bg-muted/10">
        <div className="border-b px-4 py-4 h-16 flex items-center shrink-0 bg-muted/20">
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight text-foreground">IOMS Connect</h2>
            <p className="text-xs text-muted-foreground font-medium">Internal Operations</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          {snapshot?.channels.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">No channels available.</div>
          ) : (
            <div className="space-y-6 px-3">
              {adminChannels.length > 0 && (
                <div>
                  <h3 className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    Secure
                  </h3>
                  <div className="space-y-0.5">
                    {adminChannels.map(channel => (
                      <ChannelItem 
                        key={channel.id} channel={channel} 
                        isActive={selectedChannelId === channel.id} 
                        icon={<ShieldAlert className="h-4 w-4" />}
                        onClick={() => { setSelectedChannelId(channel.id); selectedChannelRef.current = channel.id; refreshChat(channel.id, searchQuery); }} 
                      />
                    ))}
                  </div>
                </div>
              )}

              {systemChannels.length > 0 && (
                <div>
                  <h3 className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    Notifications
                  </h3>
                  <div className="space-y-0.5">
                    {systemChannels.map(channel => (
                      <ChannelItem 
                        key={channel.id} channel={channel} 
                        isActive={selectedChannelId === channel.id} 
                        icon={<Bell className="h-4 w-4" />}
                        onClick={() => { setSelectedChannelId(channel.id); selectedChannelRef.current = channel.id; refreshChat(channel.id, searchQuery); }} 
                      />
                    ))}
                  </div>
                </div>
              )}

              {generalChannels.length > 0 && (
                <div>
                  <h3 className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    Channels
                  </h3>
                  <div className="space-y-0.5">
                    {generalChannels.map(channel => (
                      <ChannelItem 
                        key={channel.id} channel={channel} 
                        isActive={selectedChannelId === channel.id} 
                        icon={<Hash className="h-4 w-4" />}
                        onClick={() => { setSelectedChannelId(channel.id); selectedChannelRef.current = channel.id; refreshChat(channel.id, searchQuery); }} 
                      />
                    ))}
                  </div>
                </div>
              )}

              {directMessages.length > 0 && (
                <div className="pt-2">
                  <h3 className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    Direct Messages
                  </h3>
                  <div className="space-y-0.5">
                    {directMessages.map(channel => (
                      <ChannelItem 
                        key={channel.id} 
                        channel={{...channel, name: formatChatName(channel.name)}} 
                        isActive={selectedChannelId === channel.id} 
                        icon={<MessageSquare className="h-4 w-4" />}
                        onClick={() => { setSelectedChannelId(channel.id); selectedChannelRef.current = channel.id; refreshChat(channel.id, searchQuery); }} 
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* CENTER MAIN CHAT */}
      <section 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="relative flex min-w-0 flex-1 flex-col bg-background"
      >
        {isDragging && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm border-2 border-dashed border-primary m-4 rounded-xl">
            <div className="flex flex-col items-center text-primary pointer-events-none">
              <Paperclip className="h-10 w-10 mb-2 animate-bounce" />
              <p className="font-medium">Drop file to attach</p>
            </div>
          </div>
        )}
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 lg:px-6 shadow-sm z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-base lg:text-lg font-semibold text-foreground flex items-center gap-2">
                {selectedChannel?.channelType === "ADMIN_REQUESTS" ? <ShieldAlert className="h-5 w-5 text-amber-500" /> : 
                 selectedChannel?.channelType === "SYSTEM" ? <Bell className="h-5 w-5 text-blue-500" /> : 
                 isDirectMessage(selectedChannel) ? <MessageSquare className="h-5 w-5 text-primary" /> :
                 <Hash className="h-5 w-5 text-muted-foreground" />}
                {selectedChannel ? formatChatName(selectedChannel.name) : "No channel selected"}
              </h1>
            </div>
            {selectedChannel?.description && (
              <p className="truncate text-xs lg:text-sm text-muted-foreground">
                {selectedChannel.description}
              </p>
            )}
          </div>
          <form onSubmit={handleSearch} className="ml-4 flex w-48 lg:w-64 items-center relative">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="h-8 lg:h-9 w-full rounded-md bg-muted/50 pl-8 focus-visible:ring-1 focus-visible:ring-primary/50 text-sm"
            />
          </form>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-2">
          {isPending && !snapshot ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading chat...</div>
          ) : snapshot?.messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-3 text-muted-foreground">
              <div className="rounded-full bg-muted p-4">
                <Search className="h-8 w-8 opacity-50" />
              </div>
              <p className="text-sm">{searchQuery ? "No messages matched your search." : "This is the beginning of the channel."}</p>
            </div>
          ) : (
            snapshot?.messages.map((message) => {
              const metadata = isRequestMetadata(message.metadata) ? message.metadata : null;
              const isSelected = selectedMessageId === message.id;
              
              return (
                <article
                  key={message.id}
                  onClick={() => setSelectedMessageId(isSelected ? null : message.id)}
                  className={cn(
                    "group relative flex w-full gap-3 lg:gap-4 rounded-xl px-2 lg:px-3 py-2 transition-colors cursor-pointer",
                    message.isOwnMessage ? "bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50" : "hover:bg-muted/50",
                    isSelected && "bg-muted/70 ring-1 ring-border"
                  )}
                >
                  <div className="shrink-0 mt-0.5">
                    {message.senderPhotoUrl ? (
                      <img
                        src={message.senderPhotoUrl}
                        alt={message.senderName}
                        onClick={(e) => { e.stopPropagation(); setLightboxImage({ url: message.senderPhotoUrl!, alt: `${message.senderName}'s Profile` }); }}
                        className="h-9 w-9 lg:h-10 lg:w-10 rounded-md object-cover shadow-sm border border-border/50 cursor-zoom-in hover:opacity-90 transition-opacity"
                      />
                    ) : (
                      <div className="flex h-9 w-9 lg:h-10 lg:w-10 items-center justify-center rounded-md bg-primary/10 text-sm font-bold text-primary border border-primary/20">
                        {message.senderName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-sm text-foreground">{message.isOwnMessage ? "You" : message.senderName}</span>
                      <span className="text-[11px] text-muted-foreground" title={format(new Date(message.createdAt), "PPpp")}>
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </span>
                    </div>

                    <div className="mt-0.5 text-[13px] lg:text-sm text-foreground/90">
                      {message.isUnsent ? (
                        <p className="italic text-muted-foreground opacity-75">{message.senderName} unsent a message</p>
                      ) : (
                        <>
                          {(!message.attachments?.some(a => a.mimeType.startsWith('image/') && message.body === `Attached ${a.fileName}`)) && (
                            <p className="whitespace-pre-wrap break-words leading-relaxed">{message.body}</p>
                          )}
                          {message.attachments.map((attachment) => <AttachmentPreview key={attachment.id} attachment={attachment} />)}
                          {metadata && <RequestMessageCard metadata={metadata} />}
                        </>
                      )}
                    </div>
                  </div>

                  {message.isOwnMessage && !message.isUnsent && (
                    <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100 bg-background rounded-md shadow-sm border">
                       <button
                         type="button"
                         title="Unsend message"
                         onClick={async (e) => {
                           e.stopPropagation();
                           if (window.confirm("Are you sure you want to unsend this message?")) {
                             await unsendChatMessageAction(message.id);
                             refreshChat(selectedChannelId);
                           }
                         }}
                         className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md"
                       >
                         <Trash2 className="h-4 w-4" />
                       </button>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>

        <div className="p-4 lg:p-6 pt-0">
          <form ref={formRef} onSubmit={handleSend} className="relative rounded-xl border bg-background shadow-sm focus-within:ring-1 focus-within:ring-primary/50 transition-all">
            {error && <div className="absolute -top-12 left-0 right-0 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive ring-1 ring-destructive/20 backdrop-blur-sm">{error}</div>}
            
            <input type="hidden" name="channelId" value={selectedChannelId ?? ""} />
            <input
              ref={fileInputRef}
              type="file"
              name="attachment"
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,image/jpeg,image/png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
              className="hidden"
              onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
            />
            
            {showEmoticons && (
              <div className="absolute -top-14 left-0 z-10 flex gap-1 rounded-lg border bg-background p-2 shadow-lg">
                {emoticons.map((emoticon) => (
                  <button
                    key={emoticon}
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded hover:bg-muted"
                    onClick={() => {
                      setMessageBody((current) => `${current}${emoticon}`);
                      setShowEmoticons(false);
                    }}
                  >
                    {emoticon}
                  </button>
                ))}
              </div>
            )}
            
            {selectedFile && (
              <div className="flex items-center gap-2 border-b bg-muted/30 px-3 py-2 text-xs relative">
                {selectedFile.type.startsWith('image/') ? (
                  <div className="relative h-16 w-16 overflow-hidden rounded-md border bg-black/5">
                    <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <span className="min-w-0 truncate font-medium flex items-center gap-2 flex-1">
                    <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                    {selectedFile.name} <span className="text-muted-foreground font-normal">({formatFileSize(selectedFile.size)})</span>
                  </span>
                )}
                <Button type="button" size="sm" variant="ghost" className="absolute right-2 top-2 h-6 w-6 p-0 rounded-full bg-background/80 text-muted-foreground hover:text-foreground shadow-sm hover:bg-background" onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
            
            <Textarea
              name="body"
              value={messageBody}
              onChange={(event) => setMessageBody(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  if (selectedChannelRef.current && (messageBody.trim() || selectedFile)) formRef.current?.requestSubmit();
                }
              }}
              disabled={!selectedChannelId}
              placeholder={selectedChannelId ? `Message ${selectedChannel?.name}...` : "No channel selected"}
              className="min-h-[60px] w-full resize-none border-0 bg-transparent py-3 pl-4 pr-32 text-foreground dark:text-gray-100 focus-visible:ring-0 text-sm"
            />
            
            <div className="absolute bottom-2 right-2 flex items-center gap-1">
              <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground" disabled={!selectedChannelId} onClick={() => fileInputRef.current?.click()}>
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground" disabled={!selectedChannelId} onClick={() => setShowEmoticons((current) => !current)}>
                <Smile className="h-4 w-4" />
              </Button>
              <Button type="submit" size="sm" className="ml-1 h-8 rounded-md px-3 font-medium shadow-none" disabled={!selectedChannelId || (!messageBody.trim() && !selectedFile)}>
                <Send className="lg:mr-1.5 h-3.5 w-3.5" />
                <span className="hidden lg:inline">Send</span>
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* RIGHT DETAILS PANEL */}
      {selectedMessage && (
        <aside className="hidden lg:flex w-[320px] shrink-0 flex-col border-l bg-muted/10 animate-in slide-in-from-right-4 duration-200">
          <header className="flex h-16 shrink-0 items-center justify-between border-b px-5 bg-background">
            <h2 className="text-[15px] font-semibold text-foreground">Message Details</h2>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setSelectedMessageId(null)}>
              <X className="h-4 w-4" />
            </Button>
          </header>
          
          <div className="flex-1 overflow-y-auto p-5">
            <div className="mb-6 flex flex-col items-center text-center">
              {selectedMessage.senderPhotoUrl ? (
                <img 
                  src={selectedMessage.senderPhotoUrl} 
                  alt="Avatar" 
                  onClick={(e) => { e.stopPropagation(); setLightboxImage({ url: selectedMessage.senderPhotoUrl!, alt: `${selectedMessage.senderName}'s Profile` }); }}
                  className="mb-3 h-14 w-14 rounded-md object-cover shadow-sm border border-border cursor-zoom-in hover:opacity-90 transition-opacity" 
                />
              ) : (
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-md bg-primary/10 text-lg font-bold text-primary border border-primary/20">
                  {selectedMessage.senderName.charAt(0).toUpperCase()}
                </div>
              )}
              <h3 className="font-semibold text-foreground text-sm">{selectedMessage.senderName}</h3>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                <Clock className="h-3 w-3" />
                {format(new Date(selectedMessage.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>

            {isRequestMetadata(selectedMessage.metadata) ? (
              <div className="space-y-4">
                <div className="rounded-xl border bg-background p-4 shadow-sm">
                  <div className="mb-4 flex items-center gap-2 font-medium text-foreground pb-3 border-b">
                    <div className="p-1.5 bg-muted rounded-md text-muted-foreground">
                      {getRequestIcon(selectedMessage.metadata.requestType)}
                    </div>
                    <span className="text-sm">{selectedMessage.metadata.requestType}</span>
                  </div>
                  
                  {selectedMessage.metadata.status && (
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Current Status</span>
                      <div className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-medium border", getStatusColor(selectedMessage.metadata.status))}>
                        {selectedMessage.metadata.status}
                      </div>
                    </div>
                  )}

                  <dl className="space-y-2.5 text-sm">
                    {Object.entries(selectedMessage.metadata.details ?? {}).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-1 gap-1">
                        <dt className="text-xs font-medium text-muted-foreground">{key}</dt>
                        <dd className="text-foreground text-sm">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {selectedMessage.metadata.href && (
                  <Button asChild className="w-full shadow-sm">
                    <Link href={selectedMessage.metadata.href}>
                      Open Request Form
                    </Link>
                  </Button>
                )}
                
                <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 p-4 text-center">
                   <AlertCircle className="mx-auto mb-2 h-5 w-5 text-muted-foreground/50" />
                   <p className="text-[11px] text-muted-foreground">Actions for this request can be performed from the full request form.</p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border bg-background p-4 shadow-sm">
                <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Original Message</h4>
                <p className="whitespace-pre-wrap break-words text-sm text-foreground/90">{selectedMessage.body || <span className="italic text-muted-foreground">No text content</span>}</p>
                {selectedMessage.attachments.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Attachments ({selectedMessage.attachments.length})</h4>
                    <ul className="space-y-2">
                      {selectedMessage.attachments.map(a => (
                        <li key={a.id} className="text-xs text-primary hover:underline truncate">
                          <a href={a.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                            <Paperclip className="h-3 w-3" />
                            {a.fileName}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      )}

      {lightboxImage && (
        <ChatImageLightbox
          isOpen={!!lightboxImage}
          onClose={() => setLightboxImage(null)}
          imageUrl={lightboxImage.url}
          altText={lightboxImage.alt}
        />
      )}
    </div>
  );
}

function ChannelItem({ channel, isActive, icon, onClick }: { channel: ChatSnapshot["channels"][0]; isActive: boolean; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-[13px] transition-all",
        isActive 
          ? "bg-primary/10 font-medium text-primary dark:bg-primary/20" 
          : "text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5"
      )}
    >
      <div className="flex items-center gap-2 truncate">
        <div className={cn("text-muted-foreground opacity-70 transition-colors", isActive && "text-primary opacity-100")}>
          {icon}
        </div>
        <span className="truncate">{channel.name}</span>
      </div>
      {channel.unreadCount > 0 && (
        <span className={cn(
          "ml-2 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold",
          isActive ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-foreground"
        )}>
          {channel.unreadCount}
        </span>
      )}
    </button>
  );
}
