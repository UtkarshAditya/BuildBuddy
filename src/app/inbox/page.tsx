"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  UserPlus,
  Clock,
  CheckCircle2,
  XCircle,
  Mail,
} from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { teamsAPI } from "@/lib/api";
import { SuccessDialog } from "@/components/SuccessDialog";
import type { TeamInvite, JoinRequest } from "@/types";

function InboxContent() {
  const [teamInvites, setTeamInvites] = useState<TeamInvite[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasViewedRequests, setHasViewedRequests] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState({
    title: "Success!",
    message: "",
  });

  useEffect(() => {
    fetchData();
    // Mark invites as viewed when user opens inbox
    markAsViewed();
    // Check if user has viewed requests before
    const viewed = localStorage.getItem("hasViewedRequests");
    if (viewed === "true") {
      setHasViewedRequests(true);
    }
  }, []);

  const markAsViewed = async () => {
    try {
      await teamsAPI.markInvitesAsViewed();
    } catch (err) {
      console.error("Error marking invites as viewed:", err);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invites, requests] = await Promise.all([
        teamsAPI.getMyInvites(),
        teamsAPI.getMyJoinRequests(),
      ]);
      setTeamInvites(invites as TeamInvite[]);
      setJoinRequests(requests as JoinRequest[]);
    } catch (err) {
      console.error("Error fetching inbox data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvite = async (inviteId: number) => {
    try {
      await teamsAPI.acceptInvite(inviteId);
      setTeamInvites(teamInvites.filter((inv) => inv.id !== inviteId));
      setSuccessMessage({
        title: "Invite Accepted!",
        message: "Check 'My Teams' to see your new team.",
      });
      setShowSuccess(true);
    } catch (err) {
      const error = err as Error;
      alert(error.message || "Failed to accept invite");
    }
  };

  const handleRejectInvite = async (inviteId: number) => {
    try {
      await teamsAPI.rejectInvite(inviteId);
      setTeamInvites(teamInvites.filter((inv) => inv.id !== inviteId));
    } catch (err) {
      const error = err as Error;
      alert(error.message || "Failed to reject invite");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SuccessDialog
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title={successMessage.title}
        message={successMessage.message}
      />
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Inbox</h1>
          <p className="text-muted-foreground">
            Manage your team invitations and join requests
          </p>
        </div>

        <Tabs
          defaultValue="invites"
          className="w-full"
          onValueChange={(value) => {
            if (value === "requests" && !hasViewedRequests) {
              setHasViewedRequests(true);
              localStorage.setItem("hasViewedRequests", "true");
            }
          }}
        >
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="invites" className="gap-2">
              <Mail className="h-4 w-4" />
              Team Invites
              {teamInvites.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {teamInvites.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="requests" className="gap-2">
              <UserPlus className="h-4 w-4" />
              My Requests
              {joinRequests.length > 0 && !hasViewedRequests && (
                <Badge variant="destructive" className="ml-2">
                  {joinRequests.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Team Invites Tab */}
          <TabsContent value="invites" className="mt-6">
            {loading ? (
              <Card>
                <CardContent className="flex items-center justify-center py-16">
                  <p className="text-muted-foreground">Loading invites...</p>
                </CardContent>
              </Card>
            ) : teamInvites.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6">
                    <Mail className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    No Team Invites
                  </h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    You don&apos;t have any pending team invitations. When teams
                    invite you, they&apos;ll appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {teamInvites.map((invite) => (
                  <Card key={invite.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            {invite.team_name}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            Invited by {invite.inviter_name} • {invite.time_ago}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">{invite.role}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {invite.message}
                      </p>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleAcceptInvite(invite.id)}
                          className="gap-2"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Accept Invite
                        </Button>
                        <Button
                          onClick={() => handleRejectInvite(invite.id)}
                          variant="outline"
                          className="gap-2"
                        >
                          <XCircle className="h-4 w-4" />
                          Decline
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* My Requests Tab */}
          <TabsContent value="requests" className="mt-6">
            {loading ? (
              <Card>
                <CardContent className="flex items-center justify-center py-16">
                  <p className="text-muted-foreground">Loading requests...</p>
                </CardContent>
              </Card>
            ) : joinRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6">
                    <UserPlus className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    No Pending Requests
                  </h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    You haven&apos;t sent any join requests yet. Browse teams
                    and request to join ones that interest you!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {joinRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            {request.team_name}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            Requested {request.time_ago}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={
                            request.status === "pending"
                              ? "secondary"
                              : request.status === "accepted"
                              ? "default"
                              : "destructive"
                          }
                          className="gap-1"
                        >
                          {request.status === "pending" && (
                            <Clock className="h-3 w-3" />
                          )}
                          {request.status === "accepted" && (
                            <CheckCircle2 className="h-3 w-3" />
                          )}
                          {request.status === "rejected" && (
                            <XCircle className="h-3 w-3" />
                          )}
                          {request.status.charAt(0).toUpperCase() +
                            request.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">
                        <span className="font-medium">Your message:</span>{" "}
                        {request.message}
                      </p>
                      {request.status === "pending" && (
                        <p className="text-xs text-muted-foreground">
                          Waiting for team owner&apos;s response...
                        </p>
                      )}
                      {request.status === "accepted" && (
                        <p className="text-xs text-green-600 dark:text-green-400">
                          Your request was accepted! Check &quot;My Teams&quot;
                          to see your new team.
                        </p>
                      )}
                      {request.status === "rejected" && (
                        <p className="text-xs text-red-600 dark:text-red-400">
                          Your request was declined by the team owner.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function InboxPage() {
  return (
    <ProtectedRoute>
      <InboxContent />
    </ProtectedRoute>
  );
}
