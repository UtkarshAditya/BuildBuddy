"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Users, Calendar, MessageSquare } from "lucide-react";

// Counter animation hook
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  const animate = () => {
    if (hasAnimated) return;
    setHasAnimated(true);

    const startTime = Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress === 1) {
        clearInterval(timer);
      }
    }, 16);
  };

  return { count, animate };
}

export default function Home() {
  const featuredRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);

  const users = useCounter(10000);
  const teams = useCounter(2500);
  const hackathons = useCounter(500);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-up");

          // Trigger counter animation for stats section
          if (entry.target === statsRef.current) {
            users.animate();
            teams.animate();
            hackathons.animate();
          }
        }
      });
    }, observerOptions);

    if (featuredRef.current) observer.observe(featuredRef.current);
    if (skillsRef.current) observer.observe(skillsRef.current);
    if (statsRef.current) observer.observe(statsRef.current);

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const featuredHackathons = [
    {
      id: 1,
      name: "TechCrunch Disrupt Hackathon 2024",
      date: "Dec 15-17, 2024",
      participants: 450,
      category: "AI/ML",
    },
    {
      id: 2,
      name: "NASA Space Apps Challenge",
      date: "Jan 10-12, 2025",
      participants: 680,
      category: "Space Tech",
    },
    {
      id: 3,
      name: "EthGlobal Hackathon",
      date: "Feb 5-7, 2025",
      participants: 320,
      category: "Web3",
    },
  ];

  const howItWorks = [
    {
      icon: Search,
      title: "Find Your Match",
      description:
        "Browse through talented developers, designers, and innovators looking to team up.",
    },
    {
      icon: MessageSquare,
      title: "Connect & Chat",
      description:
        "Message potential teammates, discuss ideas, and see if you're a good fit.",
    },
    {
      icon: Users,
      title: "Build Your Team",
      description:
        "Form your dream team with complementary skills and shared goals.",
    },
    {
      icon: Calendar,
      title: "Join a Hackathon",
      description:
        "Register for hackathons together and start building amazing projects.",
    },
  ];

  return (
    <div className="flex flex-col bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section with Animated Gradient Background */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 dark:bg-primary/30 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/20 dark:bg-cyan-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative container mx-auto space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-blue-600 dark:text-blue-400 leading-tight">
            Find Your Hackathon Dream Team
          </h1>
          <p
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Connect with talented developers, designers, and innovators. Build
            amazing projects together.
          </p>

          <div
            className="flex flex-wrap gap-4 justify-center animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Link href="/browse">
              <Button
                size="lg"
                className="hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                <Users className="mr-2 h-5 w-5" />
                Browse Teammates
              </Button>
            </Link>
            <Link href="/hackathons">
              <Button
                size="lg"
                variant="outline"
                className="hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                <Calendar className="mr-2 h-5 w-5" />
                View Hackathons
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section with Animated Counters */}
      <section ref={statsRef} className="py-12 px-6 opacity-0">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-4xl font-bold">
                {users.count.toLocaleString()}+
              </CardTitle>
              <CardDescription>Active Users</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
              </div>
              <CardTitle className="text-4xl font-bold">
                {teams.count.toLocaleString()}+
              </CardTitle>
              <CardDescription>Teams Formed</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-4xl font-bold">
                {hackathons.count.toLocaleString()}+
              </CardTitle>
              <CardDescription>Hackathons</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-600 dark:text-blue-400">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card
                  key={index}
                  className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                      <Icon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{step.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Hackathons */}
      <section
        ref={featuredRef}
        className="py-16 px-4 bg-blue-50/30 dark:bg-gray-900/30 opacity-0 transition-opacity duration-1000"
      >
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
              Featured Hackathons
            </h2>
            <Link href="/hackathons">
              <Button
                variant="outline"
                className="hover:scale-105 transition-all"
              >
                View All
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredHackathons.map((hackathon, index) => (
              <Card
                key={hackathon.id}
                className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {hackathon.name}
                    </CardTitle>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {hackathon.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {hackathon.participants} participants
                    </div>
                    <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {hackathon.category}
                    </span>
                  </div>
                  <Button
                    className="w-full mt-4 hover:scale-105 hover:shadow-lg transition-all"
                    variant="outline"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section
        ref={skillsRef}
        className="py-16 px-4 opacity-0 transition-opacity duration-1000"
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-600 dark:text-blue-400">
            Find Teammates with Any Skill
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you need a developer, designer, or domain expert, BuildBuddy
            has you covered.
          </p>
          <div className="flex flex-wrap gap-4 justify-center max-w-4xl mx-auto">
            {[
              "React",
              "Python",
              "UI/UX Design",
              "Machine Learning",
              "Blockchain",
              "Mobile Dev",
              "DevOps",
            ].map((skill) => (
              <span
                key={skill}
                className="px-5 py-2.5 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium hover:scale-110 hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer"
              >
                {skill}
              </span>
            ))}
          </div>
          <Link href="/browse">
            <Button
              size="lg"
              className="mt-8 hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Start Finding Teammates
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
