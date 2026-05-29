"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, Expand, FileText, ImageIcon, MessageSquare, Minus, Paperclip, Send, Settings, Smile, X } from "lucide-react";
import {
  getChatSnapshotAction,
  markChatChannelReadAction,
  sendChatMessageAction,
  type ChatSnapshot
} from "@/app/(app)/chat/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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

const emoticons = ["🙂", "😊", "👍", "👏", "🙏", "✅", "📌", "⚠️", "🎉", "😂", "❤️", "💡"];

function isRequestMetadata(value: unknown): value is RequestCardMetadata {
  return Boolean(value && typeof value === "object" && "requestType" in value);
}

function formatFileSize(size: number) {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

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
            width={640}
            height={360}
            unoptimized
            className="max-h-56 w-full object-contain bg-black/5 dark:bg-black/20"
          />
        </a>
      )}
      {isPdf && (
        <div className="border-b bg-white dark:border-slate-800">
          <iframe
            src={`${attachment.fileUrl}#toolbar=0&navpanes=0`}
            title={attachment.fileName}
            className="h-56 w-full bg-white"
          />
        </div>
      )}
      <a
        href={attachment.fileUrl}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <Icon className="h-4 w-4 shrink-0 text-primary" />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium text-slate-900 dark:text-slate-50">{attachment.fileName}</span>
          <span className="text-muted-foreground">{formatFileSize(attachment.fileSize)}</span>
        </span>
      </a>
    </div>
  );
}

function messageBadge(messageType: string) {
  if (messageType === "REQUEST_NOTIFICATION") {
    return <Badge variant="info">Request</Badge>;
  }

  if (messageType === "REQUEST_STATUS_UPDATE") {
    return <Badge variant="warning">Status update</Badge>;
  }

  if (messageType === "SYSTEM_MESSAGE") {
    return <Badge variant="neutral">System</Badge>;
  }

  return null;
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
          <div key={label} className="grid grid-cols-[88px_1fr] gap-2">
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

export function ChatDock({ canManageChat, defaultOpen = false }: ChatDockProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [snapshot, setSnapshot] = useState<ChatSnapshot | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [messageBody, setMessageBody] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showEmoticons, setShowEmoticons] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatFormRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedChannelIdRef = useRef<string | null>(null);
  const refreshRequestIdRef = useRef(0);

  const selectedChannel = useMemo(
    () => snapshot?.channels.find((channel) => channel.id === selectedChannelId) ?? null,
    [selectedChannelId, snapshot]
  );

  const setSelectedChannel = useCallback((channelId: string | null) => {
    selectedChannelIdRef.current = channelId;
    setSelectedChannelId(channelId);
  }, []);

  const refreshChat = useCallback((channelId?: string | null) => {
    const requestedChannelId = channelId ?? selectedChannelIdRef.current;
    const requestId = refreshRequestIdRef.current + 1;
    refreshRequestIdRef.current = requestId;

    startTransition(async () => {
      try {
        const nextSnapshot = await getChatSnapshotAction(requestedChannelId);
        if (requestId !== refreshRequestIdRef.current) {
          return;
        }

        const nextSelectedChannelId =
          requestedChannelId && nextSnapshot.channels.some((channel) => channel.id === requestedChannelId)
            ? requestedChannelId
            : nextSnapshot.selectedChannelId;

        setSnapshot({
          ...nextSnapshot,
          selectedChannelId: nextSelectedChannelId
        });
        setSelectedChannel(nextSelectedChannelId);
        setError("");
      } catch (caughtError) {
        if (requestId !== refreshRequestIdRef.current) {
          return;
        }
        setError(caughtError instanceof Error ? caughtError.message : "Chat could not be loaded.");
      }
    });
  }, [setSelectedChannel]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    refreshChat();
    const interval = window.setInterval(() => {
      refreshChat();
    }, 15000);

    return () => window.clearInterval(interval);
  }, [isOpen, refreshChat]);

  useEffect(() => {
    if (!isOpen || !selectedChannelId) {
      return;
    }

    const channelId = selectedChannelId;
    markChatChannelReadAction(channelId)
      .then(() => {
        if (selectedChannelIdRef.current === channelId) {
          refreshChat(channelId);
        }
      })
      .catch(() => undefined);
  }, [isOpen, refreshChat, selectedChannelId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight
    });
  }, [snapshot?.messages.length, isOpen]);

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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError("");
    refreshChat(currentChannelId);
  }

  const totalUnread = snapshot?.totalUnread ?? 0;

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-1 ring-black/10 transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Open internal chat"
      >
        <MessageSquare className="h-5 w-5" />
        {totalUnread > 0 && (
          <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-600 px-1.5 py-0.5 text-[11px] font-bold text-white">
            {totalUnread > 99 ? "99+" : totalUnread}
          </span>
        )}
      </button>
    );
  }

  return (
    <section className="fixed bottom-4 right-4 z-40 flex h-[min(680px,78vh)] w-[min(760px,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border bg-white shadow-2xl dark:bg-slate-950">
      <header className="flex items-center justify-between border-b px-4 py-3 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">Internal Chat</h2>
            {totalUnread > 0 && <Badge variant="destructive">{totalUnread} unread</Badge>}
          </div>
          <p className="text-xs text-muted-foreground">Message coworkers without leaving this page.</p>
        </div>
        <div className="flex items-center gap-1">
          <Button asChild size="icon" variant="ghost" title="Open full chat page">
            <Link href="/chat">
              <Expand className="h-4 w-4" />
            </Link>
          </Button>
          {canManageChat && (
            <Button asChild size="icon" variant="ghost" title="Manage chat channels">
              <Link href="/settings/chat">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          )}
          <Button type="button" size="icon" variant="ghost" onClick={() => setIsOpen(false)} title="Minimize chat">
            <Minus className="h-4 w-4" />
          </Button>
          <Button type="button" size="icon" variant="ghost" onClick={() => setIsOpen(false)} title="Close chat">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[190px_1fr]">
        <aside className="min-h-0 border-r bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="border-b px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground dark:border-slate-800">
            Channels
          </div>
          <div className="max-h-full overflow-y-auto p-2">
            {snapshot?.channels.length === 0 ? (
              <div className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
                No chat channels are available yet.
              </div>
            ) : (
              snapshot?.channels.map((channel) => (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => {
                    setSelectedChannel(channel.id);
                    refreshChat(channel.id);
                  }}
                  className={cn(
                    "mb-1 w-full rounded-md px-3 py-2 text-left text-sm transition hover:bg-white dark:hover:bg-slate-950",
                    selectedChannelId === channel.id && "bg-white shadow-sm ring-1 ring-border dark:bg-slate-950"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium">{channel.name}</span>
                    {channel.unreadCount > 0 && (
                      <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                        {channel.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{channel.channelTypeLabel}</p>
                </button>
              ))
            )}
          </div>
        </aside>

        <div className="flex min-h-0 flex-col">
          <div className="border-b px-4 py-3 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold">{selectedChannel?.name ?? "No channel selected"}</h3>
                <p className="line-clamp-1 text-xs text-muted-foreground">
                  {selectedChannel?.description ?? "Choose a channel to read and send messages."}
                </p>
              </div>
              {selectedChannel?.channelType === "ADMIN_REQUESTS" && (
                <Badge variant="warning">
                  <Bell className="mr-1 h-3 w-3" />
                  Admin only
                </Badge>
              )}
            </div>
          </div>

          <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {isPending && !snapshot ? (
              <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                Loading chat...
              </div>
            ) : snapshot?.messages.length === 0 ? (
              <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                No messages in this channel yet.
              </div>
            ) : (
              snapshot?.messages.map((message) => {
                const metadata = isRequestMetadata(message.metadata) ? message.metadata : null;

                return (
                  <article
                    key={message.id}
                    className={cn("flex", message.isOwnMessage ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[82%] rounded-2xl border p-3 text-sm shadow-sm",
                        message.isOwnMessage
                          ? "rounded-br-md border-primary/30 bg-primary text-primary-foreground"
                          : "rounded-bl-md bg-card"
                      )}
                    >
                      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{message.isOwnMessage ? "You" : message.senderName}</span>
                          {messageBadge(message.messageType)}
                        </div>
                        <span className={cn("text-[11px]", message.isOwnMessage ? "text-primary-foreground/75" : "text-muted-foreground")}>
                          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.body}</p>
                      {message.attachments.map((attachment) => (
                        <AttachmentPreview key={attachment.id} attachment={attachment} />
                      ))}
                      {metadata && <RequestMessageCard metadata={metadata} />}
                    </div>
                  </article>
                );
              })
            )}
          </div>

          <form ref={chatFormRef} onSubmit={handleSend} className="border-t p-3 dark:border-slate-800">
            {error && (
              <div className="mb-2 rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-800">
                {error}
              </div>
            )}
            <input type="hidden" name="channelId" value={selectedChannelId ?? ""} />
            <input
              ref={fileInputRef}
              type="file"
              name="attachment"
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,image/jpeg,image/png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setSelectedFile(file);
              }}
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
                    aria-label={`Insert ${emoticon}`}
                  >
                    {emoticon}
                  </button>
                ))}
              </div>
            )}
            {selectedFile && (
              <div className="mb-2 flex items-center justify-between gap-2 rounded-md border bg-slate-50 p-2 text-xs dark:bg-slate-900">
                <span className="min-w-0 truncate">
                  Attached: <span className="font-medium">{selectedFile.name}</span> ({formatFileSize(selectedFile.size)})
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  Remove
                </Button>
              </div>
            )}
            <div className="flex items-end gap-2">
              <Button
                type="button"
                size="icon"
                variant="outline"
                disabled={!selectedChannelId}
                title="Attach image, PDF, Word, Excel, or PowerPoint file"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                disabled={!selectedChannelId}
                title="Insert emoticon"
                onClick={() => setShowEmoticons((current) => !current)}
              >
                <Smile className="h-4 w-4" />
              </Button>
              <Textarea
                name="body"
                value={messageBody}
                onChange={(event) => setMessageBody(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    if (selectedChannelIdRef.current && (messageBody.trim() || selectedFile)) {
                      chatFormRef.current?.requestSubmit();
                    }
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
        </div>
      </div>
    </section>
  );
}
