"use client";

import { usePathname } from "next/navigation";
import { ChatDock } from "./ChatDock";
import { ChatBubblesContainer } from "./ChatBubblesContainer";
import { ChatGlobalProvider } from "./ChatGlobalProvider";

type ChatDockWrapperProps = {
  canManageChat: boolean;
  defaultOpen?: boolean;
};

export function ChatDockWrapper({ canManageChat, defaultOpen }: ChatDockWrapperProps) {
  const pathname = usePathname();

  if (pathname === "/chat" || pathname?.startsWith("/chat/")) {
    return null;
  }

  return (
    <>
      <ChatDock canManageChat={canManageChat} defaultOpen={defaultOpen} />
      <ChatBubblesContainer />
    </>
  );
}
