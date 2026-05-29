import { getCurrentUser } from "@/lib/auth";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DeferredChatDock } from "@/components/chat/DeferredChatDock";
import { canManageChatChannels } from "@/lib/chat";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const canManageChat = canManageChatChannels(user);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar user={user} />
      <div className="min-h-screen lg:pl-64">
        <AppHeader user={user} />
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
      {user && <DeferredChatDock canManageChat={canManageChat} />}
    </div>
  );
}
