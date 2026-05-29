import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { ChatChannelManager } from "@/components/chat/ChatChannelManager";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { canManageChatChannels } from "@/lib/chat";
import { listChatEligibleUsers, listManageableChatChannels } from "@/app/(app)/chat/actions";

export const dynamic = "force-dynamic";

export default async function ChatSettingsPage() {
  const user = await requireUser();
  if (!canManageChatChannels(user)) {
    throw new Error("Only Super Admin can manage chat channels.");
  }

  const [channels, users] = await Promise.all([
    listManageableChatChannels(),
    listChatEligibleUsers()
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 px-0">
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4" />
            Back to settings
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">
              Chat Channel Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Create channels, manage membership, and keep the protected admin request channel role-based.
            </p>
          </div>
        </div>
      </div>

      <ChatChannelManager channels={channels} users={users} />
    </div>
  );
}
