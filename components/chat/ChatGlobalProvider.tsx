"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef, useTransition } from "react";
import { getChatSnapshotAction, type ChatSnapshot } from "@/app/(app)/chat/actions";
import { usePathname } from "next/navigation";

export type BubbleState = {
  channelId: string;
  isMinimized: boolean;
};

type ChatContextType = {
  snapshot: ChatSnapshot | null;
  refreshChat: (channelId?: string | null) => void;
  activeBubbles: BubbleState[];
  openBubble: (channelId: string) => void;
  closeBubble: (channelId: string) => void;
  toggleBubbleMinimized: (channelId: string) => void;
  error: string;
  isDockOpen: boolean;
  setIsDockOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatGlobalProvider({ children }: { children: React.ReactNode }) {
  const [snapshot, setSnapshot] = useState<ChatSnapshot | null>(null);
  const [activeBubbles, setActiveBubbles] = useState<BubbleState[]>([]);
  const [isDockOpen, setIsDockOpen] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  
  const refreshRequestIdRef = useRef(0);

  const refreshChat = useCallback((channelId?: string | null) => {
    const requestId = refreshRequestIdRef.current + 1;
    refreshRequestIdRef.current = requestId;

    startTransition(async () => {
      try {
        const nextSnapshot = await getChatSnapshotAction(channelId);
        if (requestId !== refreshRequestIdRef.current) return;
        setSnapshot(nextSnapshot);
        setError("");
      } catch (caughtError) {
        if (requestId !== refreshRequestIdRef.current) return;
        setError(caughtError instanceof Error ? caughtError.message : "Chat could not be loaded.");
      }
    });
  }, []);

  // Global polling for notifications
  useEffect(() => {
    // Only fetch if user is likely logged in (in the /app area)
    // The provider is only rendered if user exists, so we are safe.
    refreshChat(null);
    const interval = window.setInterval(() => refreshChat(null), 2000);
    return () => window.clearInterval(interval);
  }, [refreshChat]);

  const openBubble = useCallback((channelId: string) => {
    setActiveBubbles((prev) => {
      if (prev.some((b) => b.channelId === channelId)) {
        // If already open, just maximize it
        return prev.map((b) => b.channelId === channelId ? { ...b, isMinimized: false } : b);
      }
      // Add new bubble
      return [...prev, { channelId, isMinimized: false }];
    });
  }, []);

  const closeBubble = useCallback((channelId: string) => {
    setActiveBubbles((prev) => prev.filter((b) => b.channelId !== channelId));
  }, []);

  const toggleBubbleMinimized = useCallback((channelId: string) => {
    setActiveBubbles((prev) => prev.map((b) => 
      b.channelId === channelId ? { ...b, isMinimized: !b.isMinimized } : b
    ));
  }, []);

  return (
    <ChatContext.Provider value={{ snapshot, refreshChat, activeBubbles, openBubble, closeBubble, toggleBubbleMinimized, error, isDockOpen, setIsDockOpen }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatGlobal() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatGlobal must be used within a ChatGlobalProvider");
  }
  return context;
}
