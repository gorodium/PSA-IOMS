"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const ChatDockWrapper = dynamic(
  () => import("@/components/chat/ChatDockWrapper").then((module) => module.ChatDockWrapper),
  { ssr: false }
);

type DeferredChatDockProps = {
  canManageChat: boolean;
};

export function DeferredChatDock({ canManageChat }: DeferredChatDockProps) {
  const pathname = usePathname();

  if (pathname === "/chat" || pathname?.startsWith("/chat/")) {
    return null;
  }

  return <ChatDockWrapper canManageChat={canManageChat} defaultOpen={false} />;
}
