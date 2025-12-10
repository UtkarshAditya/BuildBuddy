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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Users,
  Calendar,
  MapPin,
  Mail,
  ExternalLink,
} from "lucide-react";
import { teamsAPI } from "@/lib/api";
import type { Team } from "@/types";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function BrowseTeamsPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    "AI/ML",
    "Web3",
    "HealthTech",
    "Cloud",
    "Blockchain",
    "Healthcare",
  ];

  // Fetch teams from API
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        setError("");

        if (searchQuery) {
          const data = (await teamsAPI.search(searchQuery, "")) as Team[];
          setTeams(data);
        } else {
          const data = (await teamsAPI.list("")) as Team[];
          setTeams(data);
        }
      } catch (err) {
        const error = err as Error;
        setError(error.message || "Failed to fetch teams");
        console.error("Error fetching teams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [searchQuery]);

  const toggleCategory = (category: string) => {
    setSelectedCategory((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredTeams = teams.filter((team) => {
    const matchesCategory =
      selectedCategory.length === 0 || selectedCategory.includes(team.category);
    return matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Browse Teams</h1>
        <p className="text-muted-foreground">
          Find teams looking for members and apply to join their hackathon
          projects
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <Card className="sticky top-24 shadow-md">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Refine team search</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Category</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={
                        selectedCategory.includes(category)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer hover:scale-110 transition-all"
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full hover:scale-105 transition-all"
                onClick={() => setSelectedCategory([])}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
              <Input
                placeholder="Search teams by name, hackathon, or required skills..."
                className="pl-12 h-12 text-base border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm hover:shadow-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Results Count */}
          <p className="text-muted-foreground mb-4">
            {loading ? (
              "Loading..."
            ) : error ? (
              <span className="text-red-500">{error}</span>
            ) : (
              <>
                Showing {filteredTeams.length}{" "}
                {filteredTeams.length === 1 ? "team" : "teams"}
              </>
            )}
          </p>

          {/* Team Cards */}
          <div className="space-y-6">
            {filteredTeams.map((team: Team) => (
              <Card
                key={team.id}
                className="hover:shadow-xl transition-all duration-300 hover:scale-[1.01] border-2 hover:border-primary/30"
              >
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <CardTitle className="text-2xl">{team.name}</CardTitle>
                        <Badge variant="secondary">{team.category}</Badge>
                      </div>
                      <CardDescription className="text-base mb-2">
                        For: {team.hackathon_name || "Hackathon"}
                      </CardDescription>
                      <p className="text-muted-foreground">
                        {team.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">Team Size</p>
                        <p className="text-muted-foreground">
                          {team.member_count} members
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">Open Positions</p>
                        <p className="text-muted-foreground">
                          {team.open_positions} available
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">Team Lead</p>
                        <p className="text-muted-foreground">
                          {team.lead_name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-2">Looking for:</p>
                    <div className="flex flex-wrap gap-2">
                      {team.required_skills &&
                      team.required_skills.length > 0 ? (
                        team.required_skills.map((skill: string) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No specific skills listed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1">
                      <Mail className="mr-2 h-4 w-4" />
                      Apply to Join
                    </Button>
                    <Button variant="outline">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BrowseTeamsPage() {
  return (
    <ProtectedRoute>
      <BrowseTeamsPageContent />
    </ProtectedRoute>
  );
}
