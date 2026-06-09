import { FullPageChat } from "@/components/chat/FullPageChat";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ChatPage() {
  await requireUser();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          IOMS Connect
        </h1>
        <p className="text-sm text-muted-foreground">
          Full-window channel messaging with search, attachments, and request notifications.
        </p>
      </div>
      <FullPageChat />
    </div>
  );
}
