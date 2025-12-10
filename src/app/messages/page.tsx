"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Send, Check, CheckCheck } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { teamsAPI, messagesAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface TeamMember {
  id: number;
  username: string;
  full_name: string;
  role: string;
  status: string;
}

interface Team {
  id: number;
  name: string;
  members: TeamMember[];
}

interface Message {
  id: number;
  sender_id: number;
  sender_name: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface Conversation {
  id: number;
  participants: number[];
  participant_names: string[];
  last_message: string | null;
  unread_count: number;
  updated_at: string;
  messages?: Message[];
  is_group_chat?: boolean;
  team_id?: number;
  team_name?: string;
}

function MessagesPageContent() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTeamsAndMembers();
    fetchConversations();
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change, but maintain scroll if user scrolled up
    if (messagesEndRef.current && chatContainerRef.current) {
      const container = chatContainerRef.current;
      const isScrolledToBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 100;

      if (isScrolledToBottom) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }, 100);
      }
    }
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const convos = (await messagesAPI.getConversations()) as Conversation[];
      setConversations(convos);
    } catch (err) {
      console.error("Error fetching conversations:", err);
    }
  };

  const fetchTeamsAndMembers = async () => {
    try {
      setLoading(true);
      const myTeams = (await teamsAPI.getMyTeams()) as Team[];

      // Fetch detailed team info with members for each team
      const teamsWithMembers = await Promise.all(
        myTeams.map(async (team: Team) => {
          try {
            const teamDetails = (await teamsAPI.getTeamMembers(
              team.id
            )) as Team;
            return {
              id: team.id,
              name: team.name,
              members: teamDetails.members || [],
            };
          } catch (err) {
            console.error(`Error fetching members for team ${team.id}:`, err);
            return {
              id: team.id,
              name: team.name,
              members: [],
            };
          }
        })
      );

      setTeams(teamsWithMembers);
    } catch (err) {
      const error = err as Error;
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || sending) return;
    if (!selectedMember && !isGroupChat) return;

    setSending(true);
    const messageText = message.trim();

    // Clear input immediately for better UX
    setMessage("");

    // Optimistically add message to UI
    const optimisticMessage: Message = {
      id: Date.now(), // temporary ID
      sender_id: user!.id,
      sender_name: user!.full_name || user!.username,
      content: messageText,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      let response: Message;

      if (isGroupChat && selectedConversation) {
        // Send to team conversation
        response = await messagesAPI.replyToConversation(
          selectedConversation.id,
          messageText
        );
      } else if (!isGroupChat && selectedMember) {
        // Send to individual member only if NOT in group chat
        response = await messagesAPI.sendMessage(
          selectedMember.id,
          messageText
        );
      } else {
        throw new Error("No valid conversation selected");
      }

      // Replace optimistic message with real one
      setMessages((prev) =>
        prev.map((msg) => (msg.id === optimisticMessage.id ? response : msg))
      );

      // Refresh conversations to update last message
      fetchConversations();
    } catch (err) {
      console.error("Error sending message:", err);
      // Remove optimistic message on error
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== optimisticMessage.id)
      );
      alert("Failed to send message");
      // Restore message on error
      setMessage(messageText);
    } finally {
      setSending(false);
    }
  };

  const handleSelectMember = async (member: TeamMember, team: Team) => {
    setSelectedMember(member);
    setSelectedTeam(team);
    setIsGroupChat(false);

    // Find existing conversation with this member (exclude team conversations)
    const conversation = conversations.find(
      (conv) =>
        !conv.is_group_chat &&
        conv.participants.includes(member.id) &&
        conv.participants.includes(user!.id)
    );

    if (conversation) {
      // Load conversation messages
      try {
        const conv = (await messagesAPI.getConversation(
          conversation.id
        )) as Conversation;
        setSelectedConversation(conv);
        setMessages(conv.messages || []);

        // Refresh conversations to update unread count
        fetchConversations();
      } catch (err) {
        console.error("Error loading conversation:", err);
      }
    } else {
      // No existing conversation
      setSelectedConversation(null);
      setMessages([]);
    }
  };

  const handleSelectTeamChat = async (team: Team) => {
    setSelectedMember(null);
    setSelectedTeam(team);
    setIsGroupChat(true);

    try {
      const conv = (await messagesAPI.getTeamConversation(
        team.id
      )) as Conversation;
      setSelectedConversation(conv);
      setMessages(conv.messages || []);

      // Refresh conversations
      fetchConversations();
    } catch (err) {
      console.error("Error loading team conversation:", err);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const allMembers = teams.flatMap((team) =>
    team.members.map((member) => ({
      ...member,
      teamName: team.name,
      teamId: team.id,
    }))
  );

  // Filter out current user
  const filteredMembers = allMembers.filter((member) => member.id !== user?.id);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="h-[calc(100vh-4rem)]">
        <div className="container mx-auto px-4 py-6 h-full">
          <h1 className="text-3xl font-bold mb-6">Messages</h1>

          {/* Empty State */}
          <div className="flex items-center justify-center h-[calc(100%-4rem)]">
            <Card className="max-w-2xl w-full border-dashed border-2">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full mb-4">
                    <MessageSquare className="h-10 w-10 text-purple-500" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-3">No Teams Yet</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Join a team first to start messaging with teammates!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/browse">
                    <Button size="lg" className="w-full sm:w-auto">
                      <Users className="mr-2 h-5 w-5" />
                      Find Teammates
                    </Button>
                  </Link>
                  <Link href="/team-dashboard">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      <Users className="mr-2 h-5 w-5" />
                      My Teams
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 py-6 h-full">
        <h1 className="text-3xl font-bold mb-6">Team Messages</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100%-4rem)]">
          {/* Members List */}
          <Card className="md:col-span-1 overflow-hidden flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">Conversations</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
              <div className="space-y-1 px-6 pb-6">
                {/* Team Group Chats */}
                {teams.map((team) => {
                  const teamConvo = conversations.find(
                    (conv) => conv.is_group_chat && conv.team_id === team.id
                  );
                  const hasUnread = teamConvo && teamConvo.unread_count > 0;

                  return (
                    <button
                      key={`team-${team.id}`}
                      onClick={() => handleSelectTeamChat(team)}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        isGroupChat && selectedTeam?.id === team.id
                          ? "bg-primary/10 shadow-sm"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="bg-gradient-to-br from-blue-500 to-purple-600">
                            <AvatarFallback className="bg-transparent text-white font-bold">
                              <Users className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          {hasUnread && (
                            <div className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-xs text-primary-foreground font-bold">
                                {teamConvo.unread_count}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-semibold truncate ${
                              hasUnread ? "text-foreground" : ""
                            }`}
                          >
                            {team.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {teamConvo?.last_message || "Team Group Chat"}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          Team
                        </Badge>
                      </div>
                    </button>
                  );
                })}

                {/* Divider if there are teams */}
                {teams.length > 0 && filteredMembers.length > 0 && (
                  <div className="border-t my-4"></div>
                )}

                {/* Individual Members */}
                {filteredMembers.length === 0 && teams.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No conversations yet
                  </p>
                ) : (
                  filteredMembers.map((member) => {
                    // Find if there's an unread conversation with this member (exclude team chats)
                    const memberConvo = conversations.find(
                      (conv) =>
                        !conv.is_group_chat &&
                        conv.participants.includes(member.id)
                    );
                    const hasUnread =
                      memberConvo && memberConvo.unread_count > 0;

                    return (
                      <button
                        key={`${member.teamId}-${member.id}`}
                        onClick={() => {
                          const team =
                            teams.find((t) => t.id === member.teamId) || null;
                          if (team) {
                            handleSelectMember(member, team);
                          }
                        }}
                        className={`w-full p-3 rounded-lg text-left transition-all ${
                          selectedMember?.id === member.id &&
                          selectedTeam?.id === member.teamId
                            ? "bg-primary/10 shadow-sm"
                            : "hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar>
                              <AvatarFallback>
                                {getInitials(member.full_name)}
                              </AvatarFallback>
                            </Avatar>
                            {hasUnread && (
                              <div className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-xs text-primary-foreground font-bold">
                                  {memberConvo.unread_count}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-semibold truncate ${
                                hasUnread ? "text-foreground" : ""
                              }`}
                            >
                              {member.full_name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {memberConvo?.last_message || member.teamName}
                            </p>
                          </div>
                          {member.role === "leader" && (
                            <Badge variant="secondary" className="text-xs">
                              Lead
                            </Badge>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="md:col-span-2 flex flex-col overflow-hidden">
            {selectedMember || isGroupChat ? (
              <>
                <CardHeader className="border-b shrink-0">
                  <div className="flex items-center gap-3">
                    <Avatar
                      className={
                        isGroupChat
                          ? "bg-gradient-to-br from-blue-500 to-purple-600"
                          : ""
                      }
                    >
                      <AvatarFallback
                        className={
                          isGroupChat
                            ? "bg-transparent text-white font-bold"
                            : ""
                        }
                      >
                        {isGroupChat ? (
                          <Users className="h-5 w-5" />
                        ) : (
                          getInitials(selectedMember!.full_name)
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {isGroupChat
                          ? selectedTeam?.name
                          : selectedMember?.full_name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {isGroupChat ? "Team Group Chat" : selectedTeam?.name}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent
                  className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent"
                  ref={chatContainerRef}
                >
                  {messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((msg, index) => {
                        const isOwnMessage = msg.sender_id === user?.id;
                        const showAvatar =
                          index === 0 ||
                          messages[index - 1]?.sender_id !== msg.sender_id;

                        return (
                          <div
                            key={msg.id}
                            className={`flex gap-2 ${
                              isOwnMessage ? "justify-end" : "justify-start"
                            } animate-fade-in`}
                          >
                            {!isOwnMessage && showAvatar && (
                              <Avatar className="h-8 w-8 mt-1">
                                <AvatarFallback className="text-xs">
                                  {getInitials(msg.sender_name)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            {!isOwnMessage && !showAvatar && (
                              <div className="w-8" />
                            )}

                            <div
                              className={`max-w-[70%] rounded-2xl p-3 shadow-sm ${
                                isOwnMessage
                                  ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-sm"
                                  : "bg-muted rounded-bl-sm"
                              }`}
                            >
                              {!isOwnMessage && showAvatar && (
                                <p className="text-xs font-semibold mb-1 opacity-80">
                                  {msg.sender_name}
                                </p>
                              )}
                              <p className="text-sm break-words">
                                {msg.content}
                              </p>
                              <div
                                className={`flex items-center gap-1 mt-1 ${
                                  isOwnMessage ? "justify-end" : "justify-start"
                                }`}
                              >
                                <p className="text-xs opacity-70">
                                  {new Date(msg.created_at).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </p>
                                {isOwnMessage && (
                                  <span className="opacity-70">
                                    {msg.is_read ? (
                                      <CheckCheck className="h-3 w-3" />
                                    ) : (
                                      <Check className="h-3 w-3" />
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">
                        No messages yet. Start the conversation!
                      </p>
                    </div>
                  )}
                </CardContent>
                <div className="border-t p-4 bg-muted/30 shrink-0">
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      disabled={sending}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || sending}
                      className="hover:scale-105 transition-transform"
                    >
                      {sending ? (
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 px-1">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <ProtectedRoute>
      <MessagesPageContent />
    </ProtectedRoute>
  );
}
