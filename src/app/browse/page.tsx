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
import { Search, MapPin, ChevronDown, UserPlus, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, Label, Select } from "@headlessui/react";
import clsx from "clsx";
import { usersAPI, teamsAPI } from "@/lib/api";
import type { User, Team } from "@/types";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { SuccessDialog } from "@/components/SuccessDialog";

function BrowsePageContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [availableNow, setAvailableNow] = useState(false);
  const [lookingForTeam, setLookingForTeam] = useState(false);
  const [teammates, setTeammates] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState({
    title: "Success!",
    message: "",
  });

  const allSkills = [
    "React",
    "Python",
    "UI/UX Design",
    "Machine Learning",
    "Blockchain",
    "Mobile Dev",
    "DevOps",
    "Node.js",
  ];

  // Fetch user's teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teams = await teamsAPI.getMyTeams();
        console.log("User teams fetched:", teams);
        setUserTeams(teams);
      } catch (err) {
        const error = err as Error;
        console.error("Error fetching teams:", error);
        console.error("Error message:", error.message);
        // If error fetching teams, set empty array to allow page to work
        setUserTeams([]);
      }
    };
    fetchTeams();
  }, []);

  const handleInviteToTeam = async (teammateId: number, teamId?: string) => {
    // Check if user has any teams
    if (userTeams.length === 0) {
      // Redirect to create team page if no teams
      router.push("/create-team");
    } else if (teamId) {
      try {
        await teamsAPI.inviteToTeam(parseInt(teamId), teammateId);

        // Find team name for better message
        const team = userTeams.find((t) => t.id === parseInt(teamId));

        setSuccessMessage({
          title: "Invite Sent!",
          message: team
            ? `Successfully invited to ${team.name}!`
            : "Team invitation has been sent successfully.",
        });
        setShowSuccess(true);
      } catch (err) {
        const error = err as Error;
        console.error("Invite error:", error);
        alert(error.message || "Failed to send invitation");
      }
    }
  };

  const handleRequestToJoin = async (teammateId: number) => {
    try {
      const result = (await teamsAPI.requestToJoinTeam(
        teammateId
      )) as unknown as {
        team_name: string;
      };
      setSuccessMessage({
        title: "Request Sent!",
        message: `Join request sent to ${result.team_name}!`,
      });
      setShowSuccess(true);
    } catch (err) {
      const error = err as Error;
      // Check if error is about user not having a team
      if (error.message.includes("does not lead any teams")) {
        alert(
          "This user doesn't have a team yet. You can invite them to your team instead!"
        );
      } else {
        alert(error.message || "Failed to send join request");
      }
    }
  };

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        // Build availability filter
        let availabilityFilter = "";
        if (availableNow && lookingForTeam) {
          availabilityFilter = "available,looking";
        } else if (availableNow) {
          availabilityFilter = "available";
        } else if (lookingForTeam) {
          availabilityFilter = "looking";
        }

        const data = await usersAPI.search(
          searchQuery,
          selectedSkills.join(","),
          availabilityFilter
        );

        // Filter out the logged-in user
        const filteredData = data.filter(
          (teammate) => teammate.id !== user?.id
        );

        setTeammates(filteredData);
      } catch (err) {
        const error = err as Error;
        setError(error.message || "Failed to fetch users");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchQuery, selectedSkills, availableNow, lookingForTeam, user]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case "available":
        return "Available";
      case "looking":
        return "Looking for team";
      case "busy":
        return "Busy";
      default:
        return availability;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <SuccessDialog
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title={successMessage.title}
        message={successMessage.message}
      />
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
          Find Teammates
        </h1>
        <p className="text-muted-foreground">
          Discover talented developers, designers, and innovators
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 animate-slide-in-left">
          <div className="sticky top-20">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>Refine your search</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {allSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant={
                          selectedSkills.includes(skill) ? "default" : "outline"
                        }
                        className="cursor-pointer hover:scale-110 transition-all"
                        onClick={() => toggleSkill(skill)}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Availability</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                      <input
                        type="checkbox"
                        className="rounded cursor-pointer"
                        checked={availableNow}
                        onChange={(e) => setAvailableNow(e.target.checked)}
                      />
                      <span className="text-sm">Available Now</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                      <input
                        type="checkbox"
                        className="rounded cursor-pointer"
                        checked={lookingForTeam}
                        onChange={(e) => setLookingForTeam(e.target.checked)}
                      />
                      <span className="text-sm">Looking for Team</span>
                    </label>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full hover:scale-105 transition-all"
                  onClick={() => {
                    setSelectedSkills([]);
                    setAvailableNow(false);
                    setLookingForTeam(false);
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3 animate-slide-in-right">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
              <Input
                placeholder="Search by name, role, or skills..."
                className="pl-12 h-12 text-base border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm hover:shadow-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Sort and Mode Selection */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <Label className="text-sm font-medium text-foreground mb-2 block">
                Sort by
              </Label>
              <div className="relative">
                <Select
                  className={clsx(
                    "block w-full appearance-none rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium",
                    "focus:outline-none focus:border-blue-500 dark:focus:border-blue-400",
                    "hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-sm hover:shadow-md",
                    "*:text-foreground"
                  )}
                >
                  <option value="relevance">Relevance</option>
                  <option value="exp-high">Experience (High to Low)</option>
                  <option value="exp-low">Experience (Low to High)</option>
                  <option value="recent">Recently Active</option>
                </Select>
                <ChevronDown
                  className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </Field>

            <Field>
              <Label className="text-sm font-medium text-foreground mb-2 block">
                Category
              </Label>
              <div className="relative">
                <Select
                  className={clsx(
                    "block w-full appearance-none rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium",
                    "focus:outline-none focus:border-blue-500 dark:focus:border-blue-400",
                    "hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-sm hover:shadow-md",
                    "*:text-foreground"
                  )}
                >
                  <option value="all">All Categories</option>
                  <option value="frontend">Frontend Developer</option>
                  <option value="backend">Backend Developer</option>
                  <option value="fullstack">Full Stack Developer</option>
                  <option value="uiux">UI/UX Designer</option>
                  <option value="ml">ML Engineer</option>
                  <option value="blockchain">Blockchain Developer</option>
                  <option value="mobile">Mobile Developer</option>
                  <option value="devops">DevOps Engineer</option>
                </Select>
                <ChevronDown
                  className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </Field>
          </div>

          {/* Results Count */}
          <p className="text-muted-foreground mb-4 animate-fade-in">
            {loading ? (
              "Loading..."
            ) : error ? (
              <span className="text-red-500">{error}</span>
            ) : (
              <>
                Showing {teammates.length}{" "}
                {teammates.length === 1 ? "result" : "results"}
              </>
            )}
          </p>

          {/* Teammate Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teammates.map((teammate: User, index: number) => (
              <Card
                key={teammate.id}
                className="card-3d glass hover:shadow-glow transition-all duration-300 hover:scale-[1.02] cursor-pointer group animate-fade-in-up flex flex-col h-full"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {teammate.full_name}
                      </CardTitle>
                      <CardDescription>{teammate.role}</CardDescription>
                    </div>
                    <Badge
                      variant="secondary"
                      className="hover:scale-110 transition-transform"
                    >
                      {getAvailabilityText(teammate.availability)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {teammate.bio || "No bio provided"}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {teammate.location || "Location not specified"}
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {teammate.skills && teammate.skills.length > 0 ? (
                        teammate.skills.map((skill: string) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="hover:scale-110 hover:shadow-glow transition-all"
                          >
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No skills listed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <strong>Experience:</strong>{" "}
                    {teammate.experience || "Not specified"}
                  </div>

                  <div className="flex gap-2 pt-2 mt-auto">
                    {/* Invite to Team Button - Only for Team Leaders */}
                    {userTeams.length > 0 &&
                    userTeams.some(
                      (team) => team.role === "leader" || team.role === "Lead"
                    ) ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className="flex-1 hover:scale-105 hover:shadow-glow-lg transition-all">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Invite to Team
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {userTeams
                            .filter(
                              (team) =>
                                team.role === "leader" || team.role === "Lead"
                            )
                            .map((team) => (
                              <DropdownMenuItem
                                key={team.id}
                                onClick={() =>
                                  handleInviteToTeam(
                                    teammate.id,
                                    team.id.toString()
                                  )
                                }
                              >
                                {team.name}
                              </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : userTeams.length === 0 ? (
                      <Button
                        className="flex-1 hover:scale-105 hover:shadow-glow-lg transition-all"
                        onClick={() => router.push("/create-team")}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create Team First
                      </Button>
                    ) : null}

                    {/* Request to Join Team Button */}
                    <Button
                      variant="outline"
                      className="flex-1 hover:scale-105 hover:shadow-glow transition-all"
                      onClick={() => handleRequestToJoin(teammate.id)}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Request to Join
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

export default function BrowsePage() {
  return (
    <ProtectedRoute>
      <BrowsePageContent />
    </ProtectedRoute>
  );
}
