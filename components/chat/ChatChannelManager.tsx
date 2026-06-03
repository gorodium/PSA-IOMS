"use client";

import { useActionState, useMemo, useState } from "react";
import { Archive, Lock, PlusCircle, Save } from "lucide-react";
import {
  archiveChatChannelAction,
  createChatChannelAction,
  saveChatChannelMembersAction,
  updateChatChannelAction,
  type ChatActionResult
} from "@/app/(app)/chat/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type UserOption = {
  id: string;
  name: string;
  email: string | null;
  role: string;
};

type Channel = {
  id: string;
  name: string;
  description: string | null;
  channelType: string;
  members: Array<{
    userId: string;
    user: UserOption;
  }>;
};

const initialState: ChatActionResult = {
  ok: false,
  message: ""
};

function FormMessage({ state }: { state: ChatActionResult }) {
  if (!state.message) {
    return null;
  }

  return (
    <div className={state.ok ? "rounded-md border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-800" : "rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-800"}>
      {state.message}
    </div>
  );
}

export function CreateChatChannelForm() {
  const [state, action, isPending] = useActionState(createChatChannelAction, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Channel</CardTitle>
        <CardDescription>Create real internal channels only. No sample channels are generated.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-3 md:grid-cols-[1fr_180px_1.5fr_auto]">
          <Input name="name" placeholder="Channel name" required />
          <Select name="channelType" defaultValue="GENERAL">
            <option value="GENERAL">General</option>
            <option value="PRIVATE">Private</option>
            <option value="SYSTEM">System</option>
          </Select>
          <Input name="description" placeholder="Optional description" />
          <Button type="submit" disabled={isPending}>
            <PlusCircle className="h-4 w-4" />
            {isPending ? "Creating..." : "Create"}
          </Button>
          <div className="md:col-span-4">
            <FormMessage state={state} />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ChannelEditForm({ channel }: { channel: Channel }) {
  const [state, action, isPending] = useActionState(updateChatChannelAction, initialState);
  const isAdminRequests = channel.channelType === "ADMIN_REQUESTS";

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="channelId" value={channel.id} />
      <div className="grid gap-3 lg:grid-cols-[1fr_180px]">
        <label className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Channel name</span>
          <Input name="name" defaultValue={channel.name} disabled={isAdminRequests} />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Type</span>
          <Select name="channelType" defaultValue={channel.channelType} disabled={isAdminRequests}>
            <option value="GENERAL">General</option>
            <option value="PRIVATE">Private</option>
            <option value="SYSTEM">System</option>
            {isAdminRequests && <option value="ADMIN_REQUESTS">Admin Requests</option>}
          </Select>
        </label>
      </div>
      <label className="space-y-1 block">
        <span className="text-xs font-medium text-muted-foreground">Description</span>
        <Textarea name="description" defaultValue={channel.description ?? ""} className="min-h-20" />
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          <Save className="h-4 w-4" />
          {isPending ? "Saving..." : "Save Channel"}
        </Button>
      </div>
      <FormMessage state={state} />
    </form>
  );
}

function ArchiveChannelForm({ channel }: { channel: Channel }) {
  if (channel.channelType === "ADMIN_REQUESTS") {
    return null;
  }

  return (
    <form action={archiveChatChannelAction.bind(null, channel.id)}>
      <Button type="submit" size="sm" variant="outline">
        <Archive className="h-4 w-4" />
        Archive Channel
      </Button>
    </form>
  );
}

function ChannelMembersForm({ channel, users }: { channel: Channel; users: UserOption[] }) {
  const [state, action, isPending] = useActionState(saveChatChannelMembersAction, initialState);
  const initialSelectedIds = useMemo(() => channel.members.map((member) => member.userId), [channel.members]);
  const [selectedIds, setSelectedIds] = useState(initialSelectedIds);
  const isAdminRequests = channel.channelType === "ADMIN_REQUESTS";
  const allUserIds = useMemo(() => users.map((user) => user.id), [users]);
  const allSelected = users.length > 0 && selectedIds.length === users.length;

  if (isAdminRequests) {
    return (
      <div className="rounded-lg border bg-amber-50 p-3 text-sm text-amber-900">
        <div className="flex items-center gap-2 font-semibold">
          <Lock className="h-4 w-4" />
          Access is role-protected
        </div>
        <p className="mt-1">
          Only Admin and Super Admin accounts can see request notifications. Membership is enforced on the backend.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="channelId" value={channel.id} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {selectedIds.length} of {users.length} account{users.length === 1 ? "" : "s"} selected
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={allSelected || users.length === 0}
          onClick={() => setSelectedIds(allUserIds)}
        >
          Select All
        </Button>
      </div>
      <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border p-3">
        {users.map((user) => (
          <label key={user.id} className="flex items-center justify-between gap-3 rounded-md px-2 py-1 hover:bg-accent">
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">{user.name}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {user.email ?? "No email"} • {user.role === "SUPER_ADMIN" ? "System Administrator" : user.role.replaceAll("_", " ")}
              </span>
            </span>
            <input
              type="checkbox"
              name="userIds"
              value={user.id}
              checked={selectedIds.includes(user.id)}
              onChange={(event) => {
                setSelectedIds((currentIds) =>
                  event.target.checked
                    ? Array.from(new Set([...currentIds, user.id]))
                    : currentIds.filter((id) => id !== user.id)
                );
              }}
              className="h-4 w-4 shrink-0"
            />
          </label>
        ))}
      </div>
      <Button type="submit" size="sm" variant="outline" disabled={isPending}>
        {isPending ? "Saving members..." : "Save Members"}
      </Button>
      <FormMessage state={state} />
    </form>
  );
}

export function ChatChannelManager({ channels, users }: { channels: Channel[]; users: UserOption[] }) {
  return (
    <div className="space-y-6">
      <CreateChatChannelForm />

      <div className="grid gap-4 xl:grid-cols-2">
        {channels.map((channel) => (
          <Card key={channel.id}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle>{channel.name}</CardTitle>
                  <CardDescription>{channel.description ?? "No description provided."}</CardDescription>
                </div>
                <Badge variant={channel.channelType === "ADMIN_REQUESTS" ? "warning" : "outline"}>
                  {channel.channelType.replaceAll("_", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <ChannelEditForm channel={channel} />
              <ArchiveChannelForm channel={channel} />
              <div>
                <h3 className="mb-2 text-sm font-semibold">Channel Access</h3>
                <ChannelMembersForm channel={channel} users={users} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
