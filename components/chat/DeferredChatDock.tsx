"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { MessageSquare } from "lucide-react";

const ChatDock = dynamic(
  () => import("@/components/chat/ChatDock").then((module) => module.ChatDock),
  { ssr: false }
);

type DeferredChatDockProps = {
  canManageChat: boolean;
};

export function DeferredChatDock({ canManageChat }: DeferredChatDockProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  if (isLoaded) {
    return <ChatDock canManageChat={canManageChat} defaultOpen />;
  }

  return (
    <button
      type="button"
      onClick={() => setIsLoaded(true)}
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-1 ring-black/10 transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Open internal chat"
    >
      <MessageSquare className="h-5 w-5" />
    </button>
  );
}
