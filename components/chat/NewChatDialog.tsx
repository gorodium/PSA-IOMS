"use client";

import { useState, useEffect, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { searchChatUsersAction, createDirectMessageAction } from "@/app/(app)/chat/actions";
import { useChatGlobal } from "@/components/chat/ChatGlobalProvider";
import { formatChatName } from "@/lib/utils";
import { cn } from "@/lib/utils";

type SearchUser = {
  id: string;
  name: string;
  email: string | null;
  photoUrl: string | null;
};

export function NewChatDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { openBubble, snapshot } = useChatGlobal();
  const channels = snapshot?.channels ?? [];
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) {
      setQuery("");
      setUsers([]);
    }
  }, [open]);

  useEffect(() => {
    if (query.trim().length >= 2) {
      startTransition(async () => {
        const results = await searchChatUsersAction(query.trim());
        setUsers(results);
      });
    } else {
      setUsers([]);
    }
  }, [query]);

  // Filter existing channels
  const searchLower = query.trim().toLowerCase();
  const isDirectMessage = (c: { name: string, channelType?: string }) => c.name.startsWith("DM: ") || c.name.startsWith("DM_") || c.channelType === "DIRECT";
  
  const filteredGroupChats = channels.filter(c => 
    !isDirectMessage(c) && c.name.toLowerCase().includes(searchLower)
  );

  const filteredDirectMessages = channels.filter(c => 
    isDirectMessage(c) && c.name.toLowerCase().includes(searchLower)
  );

  const handleUserClick = async (userId: string) => {
    onOpenChange(false);
    const res = await createDirectMessageAction(userId);
    if (res.ok && res.channelId) {
      openBubble(res.channelId);
    }
  };

  const handleChannelClick = (channelId: string) => {
    onOpenChange(false);
    openBubble(channelId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl gap-0 p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-xl">New Chat</DialogTitle>
        </DialogHeader>
        <div className="p-4 border-b bg-muted/30">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              value={query} 
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for an employee or group chat..." 
              className="pl-12 h-14 text-base bg-background shadow-sm"
              autoFocus
            />
            {isPending && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />}
          </div>
        </div>
        
        <div className="max-h-[500px] overflow-y-auto p-4">
          {query.trim().length < 2 && (
            <div className="text-center p-4 text-sm text-muted-foreground">
              Type at least 2 characters to search.
            </div>
          )}
          
          {query.trim().length >= 2 && !isPending && users.length === 0 && filteredGroupChats.length === 0 && filteredDirectMessages.length === 0 && (
            <div className="text-center p-4 text-sm text-muted-foreground">
              No results found.
            </div>
          )}

          {filteredGroupChats.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3 mt-2">Group Chats</h4>
              {filteredGroupChats.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => handleChannelClick(c.id)}
                  className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-accent text-left transition-colors"
                >
                  {c.photoUrl ? (
                    <img src={c.photoUrl.startsWith("/uploads/") ? c.photoUrl.replace("/uploads/", "/api/file/") : c.photoUrl} alt={c.name} className="w-12 h-12 rounded-lg object-cover border shadow-sm" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600 font-bold border border-emerald-600/20 text-lg">
                      {c.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-base text-foreground truncate">{formatChatName(c.name)}</div>
                    <div className="text-sm text-muted-foreground truncate">{c.channelTypeLabel}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {filteredDirectMessages.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3 mt-2">Direct Messages</h4>
              {filteredDirectMessages.map(c => {
                const displayName = formatChatName(c.name);
                return (
                  <button 
                    key={c.id} 
                    onClick={() => handleChannelClick(c.id)}
                    className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-accent text-left transition-colors"
                  >
                    {c.photoUrl ? (
                      <img src={c.photoUrl.startsWith("/uploads/") ? c.photoUrl.replace("/uploads/", "/api/file/") : c.photoUrl} alt={displayName} className="w-12 h-12 rounded-lg object-cover border shadow-sm" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 font-bold border border-blue-600/20 text-lg">
                        {displayName.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-base text-foreground truncate">{displayName}</div>
                      <div className="text-sm text-muted-foreground truncate">Direct Message</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {users.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3 mt-2">Employees</h4>
              {users.map(u => (
                <button 
                  key={u.id} 
                  onClick={() => handleUserClick(u.id)}
                  className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-accent text-left transition-colors"
                >
                  {u.photoUrl ? (
                    <img src={u.photoUrl.startsWith("/uploads/") ? u.photoUrl.replace("/uploads/", "/api/file/") : u.photoUrl} alt={u.name} className="w-12 h-12 rounded-lg object-cover border shadow-sm" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold border border-primary/20 text-lg">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-base text-foreground truncate">{u.name}</div>
                    <div className="text-sm text-muted-foreground truncate">{u.email ?? "No email"}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
