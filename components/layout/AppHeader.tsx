"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { 
  LogIn, 
  LogOut, 
  Menu, 
  ChevronDown, 
  ChevronRight, 
  ArrowLeft, 
  Type, 
  Moon, 
  Bell, 
  MessageSquare, 
  Car, 
  Building2, 
  Search, 
  MessageCircle, 
  Expand, 
  SquarePen,
  Settings,
  AArrowUp
} from "lucide-react";
import type { AuthUser } from "@/lib/auth";
import { logoutAction, getNotificationsAction, type SystemNotification } from "@/app/(app)/actions";
import { formatChatName } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function getCompactTime(dateStr: string) {
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    
    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin}m`;
    if (diffHr < 24) return `${diffHr}h`;
    if (diffDay < 7) return `${diffDay}d`;
    return new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch (e) {
    return "";
  }
}
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNav } from "@/components/layout/AppSidebar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useChatGlobal } from "@/components/chat/ChatGlobalProvider";
import { formatDistanceToNow } from "date-fns";
import { usePathname } from "next/navigation";

export function AppHeader({ user }: { user: AuthUser | null }) {
  const pathname = usePathname();
  const isChatPage = pathname === "/chat" || pathname?.startsWith("/chat/");
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'display'>('main');
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [compact, setCompact] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<string>("16px");

  const rawPhotoUrl = user?.photoUrl || user?.personnel?.photoUrl;
  const safePhotoUrl = rawPhotoUrl 
    ? (rawPhotoUrl.startsWith('/uploads/') 
        ? rawPhotoUrl.replace('/uploads/', '/api/file/') 
        : rawPhotoUrl)
    : null;

  // Load theme and compact settings on mount
  useEffect(() => {
    const savedTheme = window.localStorage.getItem("ioms_theme") as "light" | "dark" | "system" | null;
    let initialTheme: "light" | "dark" | "system" = "system";
    if (savedTheme === "dark" || savedTheme === "light" || savedTheme === "system") {
      initialTheme = savedTheme;
    }
    setTheme(initialTheme);

    const savedCompact = window.localStorage.getItem("ioms_compact") === "true";
    setCompact(savedCompact);
    document.documentElement.classList.toggle("compact", savedCompact);

    const savedFontSize = window.localStorage.getItem("ioms_font_size") || "16px";
    setFontSize(savedFontSize);
    document.documentElement.style.fontSize = savedFontSize;
  }, []);

  // Update theme class on change
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
        document.documentElement.classList.toggle("dark", e.matches);
      };
      handleChange(mediaQuery);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    window.localStorage.setItem("ioms_theme", newTheme);
  };

  const handleCompactChange = (enable: boolean) => {
    setCompact(enable);
    window.localStorage.setItem("ioms_compact", enable ? "true" : "false");
    document.documentElement.classList.toggle("compact", enable);
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    window.localStorage.setItem("ioms_font_size", size);
    document.documentElement.style.fontSize = size;
  };

  // Chat and Notifications Integration
  const chatGlobal = useChatGlobal();
  const snapshot = chatGlobal?.snapshot ?? null;
  const refreshChat = chatGlobal?.refreshChat ?? (() => {});
  const isDockOpen = chatGlobal?.isDockOpen ?? false;
  const setIsDockOpen = chatGlobal?.setIsDockOpen ?? (() => {});
  const openBubble = chatGlobal?.openBubble ?? (() => {});

  const [chatMenuOpen, setChatMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [lastOpenedNotif, setLastOpenedNotif] = useState<number>(0);

  const [chatSearch, setChatSearch] = useState('');
  const [chatFilter, setChatFilter] = useState<'all' | 'unread' | 'groups' | 'dms'>('all');

  const isDirectMessage = (c?: { name: string } | null) => {
    if (!c || !c.name) return false;
    return c.name.startsWith("DM_") || c.name.startsWith("DM: ");
  };

  const loadNotifications = useCallback(async () => {
    try {
      const list = await getNotificationsAction();
      setNotifications(list);
      
      const lastOpened = Number(window.localStorage.getItem("ioms_notif_last_opened") || 0);
      setLastOpenedNotif(lastOpened);
      
      const unreadCount = list.filter(n => new Date(n.createdAt).getTime() > lastOpened).length;
      setUnreadNotifications(unreadCount);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user, loadNotifications]);

  const handleOpenNotifications = () => {
    const now = Date.now();
    window.localStorage.setItem("ioms_notif_last_opened", now.toString());
    setUnreadNotifications(0);
    // Note: We don't update setLastOpenedNotif(now) here so that the highlights 
    // remain visible while the menu is open. We update it when it closes.
  };

  const handleOpenChannel = (channelId: string) => {
    setChatMenuOpen(false);
    openBubble(channelId);
  };

  const totalUnread = snapshot?.totalUnread ?? 0;

  const filteredChannels = useMemo(() => {
    if (!snapshot) return [];
    return snapshot.channels.filter(c => {
      if (chatFilter === 'unread') return c.unreadCount > 0;
      if (chatFilter === 'groups') return !isDirectMessage(c);
      if (chatFilter === 'dms') return isDirectMessage(c);
      return true;
    });
  }, [snapshot, chatFilter]);

  const searchedChannels = useMemo(() => {
    const list = filteredChannels;
    if (!chatSearch.trim()) return list;
    const q = chatSearch.toLowerCase();
    return list.filter(c => {
      const displayName = formatChatName(c.name);
      return displayName.toLowerCase().includes(q) || c.latestMessage?.body?.toLowerCase().includes(q);
    });
  }, [filteredChannels, chatSearch]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 shadow-sm">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Mobile Menu + Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <div className="lg:hidden shrink-0">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-2 text-slate-700 dark:text-slate-300">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0 flex flex-col">
                <div className="flex h-16 shrink-0 items-center gap-3 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-transparent">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.svg" alt="PSA Logo" className="h-full w-full object-contain" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-50 leading-tight">PSA Misamis Oriental</p>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-primary/80 dark:text-primary-foreground/70">IOMS</p>
                  </div>
                </div>
                <SidebarNav user={user} onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>

          <Link href="/dashboard" className="flex items-center gap-3 shrink-0 min-w-0">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded bg-transparent">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="PSA Logo" className="h-full w-full object-contain" />
            </div>
            <div className="hidden sm:flex flex-col min-w-0">
              <p className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight truncate tracking-tight">
                PSA Misamis Oriental IOMS
              </p>
              <p className="text-xs font-medium text-muted-foreground truncate mt-0.5">
                Internal Operations Management Platform
              </p>
            </div>
            {/* Mobile Title */}
            <div className="flex sm:hidden flex-col min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
                PSA Misamis Oriental
              </p>
            </div>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-3 animate-in fade-in duration-200">
              {/* Chat Button & Dropdown */}
              {!isChatPage && (
                <DropdownMenu
                  open={chatMenuOpen}
                  onOpenChange={setChatMenuOpen}
                >
                <DropdownMenuTrigger asChild>
                  <button className="relative flex h-12 w-12 shrink-0 select-none items-center justify-center rounded-full bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-105 active:scale-95 text-slate-700 dark:text-slate-200" aria-label="Open chats">
                    <MessageCircle className="h-5 w-5 fill-current" />
                    {totalUnread > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-background bg-destructive px-1 text-[10px] font-bold text-white shadow-sm animate-bounce">
                        {totalUnread > 99 ? "99+" : totalUnread}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" alignOffset={-240} className="w-[380px] max-h-[85vh] mt-2 flex flex-col p-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
                    <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Chats</span>
                    <div className="flex items-center gap-1.5">
                      <Button asChild size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200" title="Chat Settings">
                        <Link href="/settings/chat">
                          <Settings className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200" title="Open Fullpage Chat">
                        <Link href="/chat">
                          <Expand className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200" title="New Message">
                        <Link href="/chat?new=true">
                          <SquarePen className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="px-4 py-2 shrink-0">
                    <div className="relative">
                      <Search className="absolute left-3.5 top-3 h-3.5 w-3.5 text-slate-400" />
                      <Input
                        placeholder="Search IOMS Connect"
                        value={chatSearch}
                        onChange={(e) => setChatSearch(e.target.value)}
                        className="h-9 pl-9 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-xs focus-visible:ring-2 focus-visible:ring-primary/20 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                      />
                    </div>
                  </div>

                  {/* Tabs / Filters */}
                  <div className="flex items-center gap-1.5 px-4 py-2 text-xs overflow-x-auto shrink-0 scrollbar-none">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'unread', label: 'Unread' },
                      { id: 'groups', label: 'Groups' },
                      { id: 'dms', label: 'Direct Messages' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setChatFilter(tab.id as 'all' | 'unread' | 'groups' | 'dms'); }}
                        className={cn(
                          "px-3 py-1.5 rounded-full font-semibold transition-all duration-150 shrink-0",
                          chatFilter === tab.id 
                            ? "bg-blue-600 text-white shadow-sm dark:bg-blue-600 dark:text-white" 
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Chats list */}
                  <div className="flex-1 overflow-y-auto max-h-[calc(85vh-180px)] p-2 space-y-0.5">
                    {searchedChannels.length === 0 ? (
                      <div className="text-center text-xs text-slate-400 py-10">No chats found.</div>
                    ) : (
                      searchedChannels.map((c) => {
                        const isUnread = c.unreadCount > 0;
                        const displayName = formatChatName(c.name);
                        
                        const safePhoto = c.photoUrl
                          ? (c.photoUrl.startsWith('/uploads/') 
                              ? c.photoUrl.replace('/uploads/', '/api/file/') 
                              : c.photoUrl)
                          : null;

                        return (
                          <DropdownMenuItem
                            key={c.id}
                            onSelect={() => handleOpenChannel(c.id)}
                            className={cn(
                              "flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:bg-slate-100 dark:focus:bg-slate-800 border-none outline-none",
                              isUnread && "bg-blue-500/5 dark:bg-blue-500/10"
                            )}
                          >
                            {/* Avatar */}
                            <div className="h-11 w-11 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center font-bold text-sm border border-slate-200 dark:border-slate-700 relative text-slate-700 dark:text-slate-300">
                              {safePhoto ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={safePhoto} alt={displayName} className="h-full w-full rounded-full object-cover" />
                              ) : (
                                <span>
                                  {isDirectMessage(c) ? displayName.charAt(0).toUpperCase() : '#'}
                                </span>
                              )}
                            </div>
                            {/* Details */}
                            <div className="flex-1 min-w-0 pr-1">
                              <span className={cn("text-xs truncate block", isUnread ? "font-bold text-slate-950 dark:text-white" : "font-semibold text-slate-700 dark:text-slate-300")}>
                                {displayName}
                              </span>
                              {c.latestMessage ? (
                                <p className={cn("text-[11px] truncate mt-0.5", isUnread ? "font-bold text-slate-900 dark:text-slate-150" : "text-slate-500 dark:text-slate-400")}>
                                  {c.latestMessage.senderName && <span className="font-semibold">{c.latestMessage.senderName}: </span>}
                                  {c.latestMessage.body}
                                  <span className="mx-1 text-slate-400">·</span>
                                  <span className="text-[10px] text-slate-400 font-normal shrink-0">
                                    {getCompactTime(c.latestMessage.createdAt)}
                                  </span>
                                </p>
                              ) : (
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 italic mt-0.5">No messages yet</p>
                              )}
                            </div>
                            {/* Unread dot */}
                            {isUnread && (
                              <span className="h-2.5 w-2.5 rounded-full bg-blue-600 dark:bg-blue-500 shrink-0 ml-2" />
                            )}
                          </DropdownMenuItem>
                        );
                      })
                    )}
                  </div>

                  {/* Footer */}
                  <div className="border-t py-2.5 text-center bg-slate-50 dark:bg-slate-900/30 shrink-0">
                    <Link 
                      href="/chat" 
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
                      onClick={() => setChatMenuOpen(false)}
                    >
                      See all in IOMS Connect
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              )}

              {/* Notifications Button & Dropdown */}
              <DropdownMenu
                open={notifMenuOpen}
                onOpenChange={(open) => {
                  setNotifMenuOpen(open);
                  if (open) {
                    handleOpenNotifications();
                  } else {
                    setLastOpenedNotif(Date.now());
                  }
                }}
              >
                <DropdownMenuTrigger asChild>
                  <button className="relative flex h-12 w-12 shrink-0 select-none items-center justify-center rounded-full bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-105 active:scale-95 text-slate-700 dark:text-slate-200" aria-label="Open notifications">
                    <Bell className="h-5 w-5 fill-current" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-background bg-destructive px-1 text-[10px] font-bold text-white shadow-sm animate-pulse">
                        {unreadNotifications > 99 ? "99+" : unreadNotifications}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" alignOffset={-57} className="w-[360px] max-h-[500px] mt-2 flex flex-col p-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b shrink-0">
                    <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Notifications</span>
                  </div>

                  {/* List */}
                  <div className="flex-1 overflow-y-auto max-h-[360px] p-2 space-y-1">
                    {notifications.length === 0 ? (
                      <div className="text-center text-xs text-slate-400 py-14 flex flex-col items-center justify-center gap-2">
                        <Bell className="h-8 w-8 text-slate-300 dark:text-slate-700 animate-pulse" />
                        <span>No new notifications</span>
                      </div>
                    ) : (
                      notifications.map((n) => {
                        const Icon = n.type === "VEHICLE" ? Car : n.type === "ROOM" ? Building2 : MessageCircle;
                        const isNew = new Date(n.createdAt).getTime() > lastOpenedNotif;
                        
                        return (
                          <DropdownMenuItem
                            key={n.id}
                            asChild
                            className={cn(
                              "flex items-start gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:bg-slate-100 dark:focus:bg-slate-800 border-none outline-none",
                              isNew && "bg-blue-500/5 dark:bg-blue-500/10"
                            )}
                          >
                            <Link href={n.link} className="flex items-start gap-3 w-full" onClick={() => setNotifMenuOpen(false)}>
                              {/* Circle Icon */}
                              <div className={cn(
                                "h-10 w-10 rounded-full shrink-0 flex items-center justify-center shadow-sm border",
                                n.status === "PENDING" ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-900/40" :
                                n.status === "APPROVED" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40" :
                                n.status === "INFO" ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-900/40" :
                                "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-900/40"
                              )}>
                                <Icon className="h-4 w-4" />
                              </div>
                              
                              {/* Text */}
                              <div className="flex-1 min-w-0">
                                <span className={cn("text-xs block truncate", isNew ? "font-bold text-slate-950 dark:text-white" : "font-semibold text-slate-700 dark:text-slate-300")}>{n.title}</span>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">{n.description}</p>
                                <span className="text-[10px] text-slate-400 block mt-1">
                                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                </span>
                              </div>
                              
                              {/* New badge dot */}
                              {isNew && (
                                <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-500 shrink-0 self-center" />
                              )}
                            </Link>
                          </DropdownMenuItem>
                        );
                      })
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Separator Line */}
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1 shrink-0" />

              {/* Avatar Button & Dropdown */}
              <DropdownMenu 
                open={menuOpen} 
                onOpenChange={(open) => {
                  setMenuOpen(open);
                  if (!open) {
                    setTimeout(() => setCurrentView('main'), 150);
                  }
                }}
              >
                <DropdownMenuTrigger asChild>
                  <button className="relative flex h-12 w-12 shrink-0 select-none items-center justify-center rounded-full bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-105 active:scale-95">
                    {safePhotoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={safePhotoUrl} alt={user.name} className="h-full w-full rounded-full object-cover" />
                    ) : (
                      <span className="text-base font-bold text-slate-700 dark:text-slate-200">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-950 border border-slate-200 shadow-sm dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700">
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className={cn(
                    "mt-2 overflow-hidden transition-all duration-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl", 
                    currentView === 'display' ? "w-72" : "w-56"
                  )}
                >
                  {currentView === 'main' ? (
                    <div className="p-1">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 leading-none">{user.name}</p>
                          <p className="text-xs text-muted-foreground leading-none mt-1 truncate">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem 
                        onSelect={(e) => { 
                          e.preventDefault(); 
                          setCurrentView('display'); 
                        }}
                        className="cursor-pointer flex items-center justify-between rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4 text-muted-foreground" />
                          <span>Display & Accessibility</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem asChild className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                        <form action={logoutAction} className="w-full">
                          <button type="submit" className="flex w-full items-center gap-2 text-sm outline-none">
                            <LogOut className="h-4 w-4" />
                            <span>Sign out</span>
                          </button>
                        </form>
                      </DropdownMenuItem>
                    </div>
                  ) : (
                    <div className="p-2">
                      <div className="flex items-center gap-2 pb-2 mb-2 border-b">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setCurrentView('main');
                          }}
                          className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          type="button"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </button>
                        <span className="font-semibold text-sm">Display & Accessibility</span>
                      </div>

                      <div className="space-y-3">
                        {/* Dark Mode */}
                        <div className="space-y-2">
                          <div className="flex items-start gap-2 px-1 py-1">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
                              <Moon className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-semibold">Dark mode</span>
                              <span className="text-[10px] text-muted-foreground leading-tight">
                                Adjust the appearance to reduce glare and give your eyes a break.
                              </span>
                            </div>
                          </div>
                          
                          <div className="pl-9 space-y-1">
                            {[
                              { id: "light", label: "Off" },
                              { id: "dark", label: "On" },
                              { id: "system", label: "Automatic" }
                            ].map((opt) => (
                              <label 
                                key={opt.id} 
                                className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50 cursor-pointer text-xs font-medium"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleThemeChange(opt.id as 'light' | 'dark' | 'system');
                                }}
                              >
                                <span>{opt.label}</span>
                                <input 
                                  type="radio" 
                                  name="theme-option" 
                                  checked={theme === opt.id}
                                  onChange={() => {}}
                                  className="h-3.5 w-3.5 text-primary border-slate-300 dark:border-slate-700 focus:ring-primary/20 cursor-pointer"
                                />
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Compact Mode */}
                        <div className="space-y-2">
                          <div className="flex items-start gap-2 px-1 py-1">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
                              <Type className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-semibold">Compact mode</span>
                              <span className="text-[10px] text-muted-foreground leading-tight">
                                Make your font size smaller so more content can fit on the screen.
                              </span>
                            </div>
                          </div>
                          
                          <div className="pl-9 space-y-1">
                            {[
                              { id: false, label: "Off" },
                              { id: true, label: "On" }
                            ].map((opt) => (
                              <label 
                                key={opt.label} 
                                className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50 cursor-pointer text-xs font-medium"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCompactChange(opt.id);
                                }}
                              >
                                <span>{opt.label}</span>
                                <input 
                                  type="radio" 
                                  name="compact-option" 
                                  checked={compact === opt.id}
                                  onChange={() => {}}
                                  className="h-3.5 w-3.5 text-primary border-slate-300 dark:border-slate-700 focus:ring-primary/20 cursor-pointer"
                                />
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Font Size Mode */}
                        <div className="space-y-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                          <div className="flex items-start gap-2 px-1 py-1">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
                              <AArrowUp className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-semibold">Global Font Size</span>
                              <span className="text-[10px] text-muted-foreground leading-tight">
                                Adjust the base text size of the entire platform.
                              </span>
                            </div>
                          </div>
                          
                          <div className="pl-9 space-y-1">
                            {[
                              { id: "14px", label: "Small" },
                              { id: "16px", label: "Medium (Default)" },
                              { id: "18px", label: "Large" },
                              { id: "20px", label: "Extra Large" }
                            ].map((opt) => (
                              <label 
                                key={opt.id} 
                                className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50 cursor-pointer text-xs font-medium"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFontSizeChange(opt.id);
                                }}
                              >
                                <span>{opt.label}</span>
                                <input 
                                  type="radio" 
                                  name="fontsize-option" 
                                  checked={fontSize === opt.id}
                                  onChange={() => {}}
                                  className="h-3.5 w-3.5 text-primary border-slate-300 dark:border-slate-700 focus:ring-primary/20 cursor-pointer"
                                />
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="pl-2 border-l border-slate-200 dark:border-slate-700">
              <Button asChild size="sm">
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" aria-hidden="true" />
                  Sign in
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
