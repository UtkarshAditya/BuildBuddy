"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { teamsAPI } from "@/lib/api";
import type { Team } from "@/types";

function TeamDashboardPageContent() {
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        console.log("Fetching teams from API...");
        const teams = await teamsAPI.getMyTeams();
        console.log("Teams received:", teams);
        setMyTeams(teams as Team[]);
      } catch (err) {
        const error = err as Error;
        console.error("Error fetching teams:", err);
        console.error("Error message:", error.message);
        console.error("Full error object:", JSON.stringify(err, null, 2));
        setError(error.message || "Failed to load teams");
        setMyTeams([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p className="text-muted-foreground">Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">My Teams</h1>
            {myTeams.length > 0 && (
              <Link href="/create-team">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Team
                </Button>
              </Link>
            )}
          </div>

          {/* Empty State */}
          {myTeams.length === 0 ? (
            <div className="text-center py-16">
              <Card className="max-w-2xl mx-auto border-dashed border-2">
                <CardContent className="pt-12 pb-12">
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full mb-4">
                      <Users className="h-10 w-10 text-blue-500" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-3">No Teams Yet</h2>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    You haven&apos;t joined any teams yet. Start by creating
                    your own team or browse available teams!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/create-team">
                      <Button size="lg" className="w-full sm:w-auto">
                        <Plus className="mr-2 h-5 w-5" />
                        Create Team
                      </Button>
                    </Link>
                    <Link href="/browse">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        <Users className="mr-2 h-5 w-5" />
                        Find Teammates
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {myTeams.map((team) => (
                <Link key={team.id} href={`/team/${team.id}`}>
                  <Card className="cursor-pointer transition-all hover:shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{team.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {team.hackathon_name || team.hackathon}
                          </CardDescription>
                        </div>
                        <Badge variant="default">Active</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {team.role || "Member"}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {team.member_count ||
                            (team.members ? team.members.length : 0)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TeamDashboardPage() {
  return (
    <ProtectedRoute>
      <TeamDashboardPageContent />
    </ProtectedRoute>
  );
}
