import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Mail,
  Linkedin,
  Github,
  Trophy,
  Calendar,
  Code,
} from "lucide-react";

export default function ProfilePage() {
  const profile = {
    name: "Sarah Chen",
    role: "Full Stack Developer",
    location: "San Francisco, CA",
    email: "sarah.chen@example.com",
    bio: "Passionate about building scalable web applications and AI-powered tools. Love collaborating with diverse teams to create innovative solutions.",
    skills: {
      frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      backend: ["Node.js", "Python", "Django", "PostgreSQL"],
      tools: ["Git", "Docker", "AWS", "Figma"],
    },
    experience: [
      {
        title: "Winner - TechCrunch Disrupt Hackathon",
        date: "Oct 2023",
        description:
          "Built an AI-powered meeting assistant that transcribes and summarizes conversations in real-time.",
      },
      {
        title: "2nd Place - NASA Space Apps Challenge",
        date: "Aug 2023",
        description:
          "Developed a satellite data visualization tool for climate change monitoring.",
      },
      {
        title: "Winner - EthGlobal Hackathon",
        date: "Jun 2023",
        description:
          "Created a decentralized marketplace for digital art with smart contract integration.",
      },
    ],
    stats: {
      hackathons: 8,
      wins: 5,
      projects: 12,
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold shrink-0">
                SC
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-1">{profile.name}</h1>
                    <p className="text-xl text-muted-foreground mb-2">
                      {profile.role}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {profile.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {profile.email}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Button>
                      <Mail className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                    <Button variant="outline">Edit Profile</Button>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">{profile.bio}</p>

                <div className="flex gap-3">
                  <Button variant="outline" size="sm">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                  <Button variant="outline" size="sm">
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Hackathons Attended</CardDescription>
              <CardTitle className="text-3xl">
                {profile.stats.hackathons}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Wins</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                {profile.stats.wins}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Projects Completed</CardDescription>
              <CardTitle className="text-3xl">
                {profile.stats.projects}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-sm text-muted-foreground">
                  Frontend
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.frontend.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-sm text-muted-foreground">
                  Backend
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.backend.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-sm text-muted-foreground">
                  Tools & Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.tools.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Hackathon Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="border-l-2 border-primary pl-4 pb-4 last:pb-0"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold">{exp.title}</h3>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {exp.date}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
