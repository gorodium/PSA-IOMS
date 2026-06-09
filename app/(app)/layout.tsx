import { getCurrentUser } from "@/lib/auth";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DeferredChatDock } from "@/components/chat/DeferredChatDock";
import { canManageChatChannels } from "@/lib/chat";
import { ChatGlobalProvider } from "@/components/chat/ChatGlobalProvider";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const canManageChat = canManageChatChannels(user);

  return (
    <ChatGlobalProvider>
      <div className="min-h-screen bg-background pt-16">
        <AppHeader user={user} />
        <AppSidebar user={user} />
        <div className="lg:pl-64">
          <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
        {user && <DeferredChatDock canManageChat={canManageChat} />}
      </div>
    </ChatGlobalProvider>
  );
}
