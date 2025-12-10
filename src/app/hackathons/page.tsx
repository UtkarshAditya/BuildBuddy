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
import { Input } from "@/components/ui/input";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Search,
  ChevronDown,
} from "lucide-react";
import { Field, Label, Select } from "@headlessui/react";
import clsx from "clsx";
import { hackathonsAPI } from "@/lib/api";
import type { Hackathon } from "@/types";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function HackathonsPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedMode, setSelectedMode] = useState("All Modes");
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch hackathons from API
  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        setLoading(true);
        setError("");

        const category =
          selectedCategory === "All Categories" ? "" : selectedCategory;
        const mode =
          selectedMode === "All Modes"
            ? ""
            : selectedMode.toLowerCase().replace("-", "-");

        let data;
        if (searchQuery) {
          data = await hackathonsAPI.search(searchQuery);
        } else {
          data = await hackathonsAPI.list(category, mode, "");
        }

        setHackathons(data);
      } catch (err) {
        const error = err as Error;
        setError(error.message || "Failed to fetch hackathons");
        console.error("Error fetching hackathons:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, [searchQuery, selectedCategory, selectedMode]);

  const formatDate = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    return `${start.toLocaleDateString(
      "en-US",
      options
    )} - ${end.toLocaleDateString("en-US", options)}, ${start.getFullYear()}`;
  };

  const getModeText = (mode: string) => {
    switch (mode) {
      case "in-person":
        return "In-person";
      case "remote":
        return "Remote";
      case "hybrid":
        return "Hybrid";
      default:
        return mode;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Registration Open";
      case "registration":
        return "Registration Open";
      case "ongoing":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
            Upcoming Hackathons
          </h1>
          <p className="text-muted-foreground">
            Discover and register for hackathons happening around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex flex-col gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
              <Input
                placeholder="Search hackathons..."
                className="pl-12 h-12 text-base border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm hover:shadow-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <Label className="text-sm font-medium text-foreground mb-2 block">
                  Category
                </Label>
                <div className="relative">
                  <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={clsx(
                      "block w-full appearance-none rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium",
                      "focus:outline-none focus:border-blue-500 dark:focus:border-blue-400",
                      "hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-sm hover:shadow-md",
                      "*:text-foreground"
                    )}
                  >
                    <option>All Categories</option>
                    <option>AI/ML</option>
                    <option>Web3</option>
                    <option>HealthTech</option>
                    <option>Cloud</option>
                    <option>Space Tech</option>
                  </Select>
                  <ChevronDown
                    className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
              </Field>

              <Field>
                <Label className="text-sm font-medium text-foreground mb-2 block">
                  Mode
                </Label>
                <div className="relative">
                  <Select
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value)}
                    className={clsx(
                      "block w-full appearance-none rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium",
                      "focus:outline-none focus:border-blue-500 dark:focus:border-blue-400",
                      "hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-sm hover:shadow-md",
                      "*:text-foreground"
                    )}
                  >
                    <option>All Modes</option>
                    <option>In-person</option>
                    <option>Remote</option>
                    <option>Hybrid</option>
                  </Select>
                  <ChevronDown
                    className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
              </Field>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-muted-foreground mb-4 animate-fade-in">
          {loading ? (
            "Loading..."
          ) : error ? (
            <span className="text-red-500">{error}</span>
          ) : (
            <>
              Showing {hackathons.length}{" "}
              {hackathons.length === 1 ? "hackathon" : "hackathons"}
            </>
          )}
        </p>

        {/* Hackathon List */}
        <div className="space-y-6">
          {hackathons.map((hackathon: Hackathon, index: number) => (
            <Card
              key={hackathon.id}
              className="card-3d glass hover:shadow-glow transition-all duration-300 hover:scale-[1.01] group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                        {hackathon.name}
                      </CardTitle>
                      <Badge
                        variant={
                          hackathon.status === "registration" ||
                          hackathon.status === "upcoming"
                            ? "default"
                            : "secondary"
                        }
                        className="hover:scale-110 transition-transform"
                      >
                        {getStatusText(hackathon.status)}
                      </Badge>
                    </div>
                    <CardDescription className="text-base">
                      {hackathon.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">Date</p>
                      <p className="text-muted-foreground">
                        {formatDate(hackathon.start_date, hackathon.end_date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="text-muted-foreground">
                        {hackathon.location || "TBA"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">Participants</p>
                      <p className="text-muted-foreground">
                        {hackathon.participant_count || 0} /{" "}
                        {hackathon.max_participants || "∞"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">Prize</p>
                      <p className="text-muted-foreground">
                        {hackathon.prize || "TBA"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className="hover:scale-110 hover:shadow-glow transition-all"
                    >
                      {hackathon.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="hover:scale-110 hover:shadow-glow transition-all"
                    >
                      {getModeText(hackathon.mode)}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="hover:scale-105 transition-all"
                    >
                      View Details
                    </Button>
                    <Button
                      disabled={
                        hackathon.status !== "registration" &&
                        hackathon.status !== "upcoming"
                      }
                      className="hover:scale-105 hover:shadow-glow-lg transition-all"
                    >
                      {hackathon.status === "registration" ||
                      hackathon.status === "upcoming"
                        ? "Register Now"
                        : "Coming Soon"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HackathonsPage() {
  return (
    <ProtectedRoute>
      <HackathonsPageContent />
    </ProtectedRoute>
  );
}
