"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, FileText, ImageIcon, Paperclip, Search, Send, Smile } from "lucide-react";
import {
  getChatSnapshotAction,
  markChatChannelReadAction,
  sendChatMessageAction,
  type ChatSnapshot
} from "@/app/(app)/chat/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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

function AttachmentPreview({
  attachment
}: {
  attachment: {
    fileName: string;
    fileUrl: string;
    mimeType: string;
    fileSize: number;
  };
}) {
  const isImage = attachment.mimeType.startsWith("image/");
  const isPdf = attachment.mimeType === "application/pdf";
  const Icon = isImage ? ImageIcon : FileText;

  return (
    <div className="mt-2 overflow-hidden rounded-md border bg-slate-50 text-xs dark:bg-slate-900">
      {isImage && (
        <a href={attachment.fileUrl} target="_blank" rel="noreferrer" className="block border-b dark:border-slate-800">
          <Image
            src={attachment.fileUrl}
            alt={attachment.fileName}
            width={760}
            height={428}
            unoptimized
            className="max-h-80 w-full object-contain bg-black/5 dark:bg-black/20"
          />
        </a>
      )}
      {isPdf && (
        <div className="border-b bg-white dark:border-slate-800">
          <iframe src={`${attachment.fileUrl}#toolbar=0&navpanes=0`} title={attachment.fileName} className="h-80 w-full bg-white" />
        </div>
      )}
      <a href={attachment.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800">
        <Icon className="h-4 w-4 shrink-0 text-primary" />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium text-slate-900 dark:text-slate-50">{attachment.fileName}</span>
          <span className="text-muted-foreground">{formatFileSize(attachment.fileSize)}</span>
        </span>
      </a>
    </div>
  );
}

function RequestMessageCard({ metadata }: { metadata: RequestCardMetadata }) {
  return (
    <div className="mt-2 rounded-lg border bg-slate-50 p-3 text-xs dark:bg-slate-900">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge variant={metadata.requestType === "Vehicle Request" ? "info" : "success"}>
          {metadata.requestType ?? "Request"}
        </Badge>
        {metadata.status && <Badge variant="outline">{metadata.status}</Badge>}
      </div>
      {metadata.actionLabel && (
        <p className="mb-2 font-semibold text-slate-900 dark:text-slate-50">
          {metadata.actionLabel}
          {metadata.actorName ? ` by ${metadata.actorName}` : ""}
        </p>
      )}
      <dl className="grid gap-1">
        {Object.entries(metadata.details ?? {}).map(([label, value]) => (
          <div key={label} className="grid grid-cols-[92px_1fr] gap-2">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-medium text-slate-900 dark:text-slate-50">{value}</dd>
          </div>
        ))}
      </dl>
      {metadata.href && (
        <Button asChild size="sm" variant="outline" className="mt-3 h-8">
          <Link href={metadata.href}>View request</Link>
        </Button>
      )}
    </div>
  );
}

export function FullPageChat() {
  const [snapshot, setSnapshot] = useState<ChatSnapshot | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
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
  }

  return (
    <div className="grid h-[calc(100vh-8rem)] min-h-[620px] overflow-hidden rounded-lg border bg-card shadow-sm lg:grid-cols-[300px_1fr]">
      <aside className="min-h-0 border-r bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="border-b p-4 dark:border-slate-800">
          <h2 className="text-lg font-semibold">Chat</h2>
          <p className="text-sm text-muted-foreground">Channels and request notifications</p>
        </div>
        <div className="min-h-0 overflow-y-auto p-3">
          {snapshot?.channels.length === 0 ? (
            <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">No chat channels are available.</div>
          ) : (
            snapshot?.channels.map((channel) => (
              <button
                key={channel.id}
                type="button"
                onClick={() => {
                  selectedChannelRef.current = channel.id;
                  setSelectedChannelId(channel.id);
                  refreshChat(channel.id, searchQuery);
                }}
                className={cn(
                  "mb-2 w-full rounded-lg px-4 py-3 text-left transition hover:bg-white dark:hover:bg-slate-950",
                  selectedChannelId === channel.id && "bg-white shadow-sm ring-1 ring-border dark:bg-slate-950"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-semibold">{channel.name}</span>
                  {channel.unreadCount > 0 && <Badge>{channel.unreadCount}</Badge>}
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">{channel.description ?? channel.channelTypeLabel}</p>
              </button>
            ))
          )}
        </div>
      </aside>

      <section className="flex min-h-0 flex-col">
        <header className="border-b p-4 dark:border-slate-800">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">{selectedChannel?.name ?? "No channel selected"}</h1>
                {selectedChannel?.channelType === "ADMIN_REQUESTS" && (
                  <Badge variant="warning">
                    <Bell className="mr-1 h-3 w-3" />
                    Admin only
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{selectedChannel?.description ?? "Choose a channel to start chatting."}</p>
            </div>
            <form onSubmit={handleSearch} className="flex w-full gap-2 xl:max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search messages, people, files..."
                  className="pl-9"
                />
              </div>
              <Button type="submit" variant="outline">Search</Button>
            </form>
          </div>
        </header>

        <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-background/40 p-4">
          {isPending && !snapshot ? (
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">Loading chat...</div>
          ) : snapshot?.messages.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              {searchQuery ? "No messages matched your search." : "No messages in this channel yet."}
            </div>
          ) : (
            snapshot?.messages.map((message) => {
              const metadata = isRequestMetadata(message.metadata) ? message.metadata : null;
              return (
                <article key={message.id} className={cn("flex", message.isOwnMessage ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[76%] rounded-2xl border p-3 text-sm shadow-sm",
                      message.isOwnMessage
                        ? "rounded-br-md border-primary/30 bg-primary text-primary-foreground"
                        : "rounded-bl-md bg-card"
                    )}
                  >
                    <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold">{message.isOwnMessage ? "You" : message.senderName}</span>
                      <span className={cn("text-[11px]", message.isOwnMessage ? "text-primary-foreground/75" : "text-muted-foreground")}>
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed">{message.body}</p>
                    {message.attachments.map((attachment) => <AttachmentPreview key={attachment.id} attachment={attachment} />)}
                    {metadata && <RequestMessageCard metadata={metadata} />}
                  </div>
                </article>
              );
            })
          )}
        </div>

        <form ref={formRef} onSubmit={handleSend} className="border-t bg-card p-4 dark:border-slate-800">
          {error && <div className="mb-2 rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-800">{error}</div>}
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
            <div className="mb-2 flex flex-wrap gap-1 rounded-md border bg-card p-2">
              {emoticons.map((emoticon) => (
                <button
                  key={emoticon}
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-lg hover:bg-accent"
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
            <div className="mb-2 flex items-center justify-between gap-2 rounded-md border bg-slate-50 p-2 text-xs dark:bg-slate-900">
              <span className="min-w-0 truncate">Attached: <span className="font-medium">{selectedFile.name}</span> ({formatFileSize(selectedFile.size)})</span>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 px-2"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                Remove
              </Button>
            </div>
          )}
          <div className="flex items-end gap-2">
            <Button type="button" size="icon" variant="outline" disabled={!selectedChannelId} onClick={() => fileInputRef.current?.click()}>
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button type="button" size="icon" variant="outline" disabled={!selectedChannelId} onClick={() => setShowEmoticons((current) => !current)}>
              <Smile className="h-4 w-4" />
            </Button>
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
              placeholder={selectedChannelId ? "Type a message..." : "No channel selected"}
              className="min-h-11 resize-none"
            />
            <Button type="submit" disabled={!selectedChannelId || (!messageBody.trim() && !selectedFile)}>
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
