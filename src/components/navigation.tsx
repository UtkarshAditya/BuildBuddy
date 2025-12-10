"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  MessageSquare,
  Settings,
  Search,
  Home,
  LogOut,
  User,
  Inbox,
  UsersRound,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { teamsAPI, messagesAPI } from "@/lib/api";
import type { TeamInvite } from "@/types";

export function Navigation() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const invites = (await teamsAPI.getMyInvites()) as TeamInvite[];
      // Only count unviewed invites with 'invited' status
      const unviewedInvites = invites.filter(
        (invite) => invite.status === "invited" && !invite.viewed
      );
      setUnreadCount(unviewedInvites.length);
    } catch (err) {
      console.error("Error fetching invites:", err);
    }
  }, [isAuthenticated]);

  const fetchUnreadMessagesCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = (await messagesAPI.getUnreadCount()) as {
        unread_count: number;
      };
      setUnreadMessagesCount(response.unread_count || 0);
    } catch (err) {
      console.error("Error fetching unread messages:", err);
    }
  }, [isAuthenticated]);

  // Fetch unread invites count
  useEffect(() => {
    if (!isAuthenticated) return;

    fetchUnreadCount();
    fetchUnreadMessagesCount();

    // Poll every 30 seconds for updates
    const interval = setInterval(() => {
      fetchUnreadCount();
      fetchUnreadMessagesCount();
    }, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchUnreadCount, fetchUnreadMessagesCount]);

  // Refresh count when navigating away from inbox or messages
  useEffect(() => {
    if (isAuthenticated) {
      if (pathname !== "/inbox") {
        fetchUnreadCount();
      }
      if (pathname !== "/messages") {
        fetchUnreadMessagesCount();
      }
    }
  }, [pathname, isAuthenticated, fetchUnreadCount, fetchUnreadMessagesCount]);

  const publicNavItems = [{ href: "/", label: "Home", icon: Home }];

  const protectedNavItems = [
    { href: "/browse", label: "Find People", icon: Search },
    { href: "/inbox", label: "Inbox", icon: Inbox },
    { href: "/hackathons", label: "Hackathons", icon: Calendar },
    { href: "/messages", label: "Messages", icon: MessageSquare },
    { href: "/team-dashboard", label: "My Teams", icon: UsersRound },
    { href: "/settings", label: "Edit Profile", icon: User },
  ];

  const navItems = isAuthenticated
    ? [...publicNavItems, ...protectedNavItems]
    : publicNavItems;

  return (
    <nav className="border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-12">
            <Link
              href="/"
              className="flex items-center gap-2.5 transition-transform hover:scale-105"
            >
              <svg className="h-8 w-8" viewBox="0 0 512 512" fill="none">
                <circle cx="171" cy="171" r="85" fill="#10B981" />
                <circle cx="341" cy="256" r="85" fill="#3B82F6" />
                <path
                  d="M 120 260 Q 90 290 120 320"
                  stroke="#10B981"
                  strokeWidth="20"
                  fill="none"
                />
                <path
                  d="M 290 340 Q 320 370 350 360"
                  stroke="#3B82F6"
                  strokeWidth="20"
                  fill="none"
                />
              </svg>
              <span className="text-xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                BuildBuddy
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const isInbox = item.label === "Inbox";
                const isMessages = item.label === "Messages";

                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={`gap-2 transition-all duration-300 relative ${
                        isActive
                          ? "shadow-lg shadow-primary/50"
                          : "hover:bg-primary/10 hover:scale-105"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden lg:inline">{item.label}</span>
                      {isInbox && unreadCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full"
                        >
                          {unreadCount}
                        </Badge>
                      )}
                      {isMessages && unreadMessagesCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full"
                        >
                          {unreadMessagesCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            {!loading && (
              <>
                {isAuthenticated ? (
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 hover:scale-105 transition-transform"
                        >
                          <User className="h-4 w-4" />
                          <span className="hidden sm:inline">
                            {user?.full_name || user?.username}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link
                            href="/account-settings"
                            className="cursor-pointer"
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/team-dashboard"
                            className="cursor-pointer"
                          >
                            <UsersRound className="mr-2 h-4 w-4" />
                            My Teams
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={logout}
                          className="cursor-pointer text-red-600 dark:text-red-400"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:scale-105 transition-transform"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-primary to-cyan-600 hover:shadow-lg hover:shadow-primary/50 transition-all hover:scale-105"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
