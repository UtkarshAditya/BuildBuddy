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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  User,
  Briefcase,
  Code,
  Link as LinkIcon,
  Plus,
  X,
  Save,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usersAPI } from "@/lib/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function SettingsPageContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [skillInput, setSkillInput] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    role: "",
    location: "",
    skills: [] as string[],
    experience: "",
    github_url: "",
    linkedin_url: "",
    portfolio_url: "",
  });

  const roleOptions = [
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Mobile Developer",
    "DevOps Engineer",
    "Data Scientist",
    "ML Engineer",
    "UI/UX Designer",
    "Product Manager",
    "Project Manager",
    "Business Analyst",
    "Marketing Specialist",
    "Content Creator",
    "Other",
  ];

  const suggestedSkills = [
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "Django",
    "TypeScript",
    "JavaScript",
    "Java",
    "C++",
    "Go",
    "Rust",
    "Flutter",
    "Swift",
    "Kotlin",
    "AWS",
    "Azure",
    "GCP",
    "Docker",
    "Kubernetes",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Firebase",
    "GraphQL",
    "REST API",
    "Machine Learning",
    "Deep Learning",
    "TensorFlow",
    "PyTorch",
    "Figma",
    "Adobe XD",
    "Photoshop",
    "Git",
    "CI/CD",
    "Agile",
    "Scrum",
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        bio: user.bio || "",
        role: user.role || "",
        location: user.location || "",
        skills: user.skills || [],
        experience: user.experience || "",
        github_url: user.github_url || "",
        linkedin_url: user.linkedin_url || "",
        portfolio_url: user.portfolio_url || "",
      });
    }
  }, [user]);

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await usersAPI.updateProfile(formData);
      setSuccess(true);
      // Auto-dismiss success dialog after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">
            Update your profile information and preferences
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success Dialog with Checkmark Animation */}
          <Dialog open={success} onOpenChange={setSuccess}>
            <DialogContent className="sm:max-w-md">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative mb-6">
                  <svg
                    className="w-24 h-24"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Circle background */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="4"
                      className="animate-circle-fill"
                      opacity="0.2"
                    />
                    {/* Checkmark */}
                    <path
                      d="M 30 50 L 45 65 L 70 35"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-checkmark"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Changes Saved!</h3>
                <p className="text-muted-foreground text-center">
                  Your profile has been updated successfully
                </p>
              </div>
            </DialogContent>
          </Dialog>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your basic information visible to other users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  placeholder="e.g., Sarah Chen"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="mt-2 bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed
                </p>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Tell us about yourself..."
                  className="w-full min-h-[100px] px-3 py-2 border rounded-md bg-background mt-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.bio.length} characters
                </p>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="e.g., San Francisco, CA or Remote"
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Professional Details
              </CardTitle>
              <CardDescription>
                Your role and experience information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md bg-background mt-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select your role...</option>
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="experience">Experience Level</Label>
                <select
                  id="experience"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md bg-background mt-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select experience level...</option>
                  <option value="Beginner">Beginner (0-1 years)</option>
                  <option value="Intermediate">Intermediate (1-3 years)</option>
                  <option value="Advanced">Advanced (3-5 years)</option>
                  <option value="Expert">Expert (5+ years)</option>
                  <option value="First Hackathon">First Hackathon</option>
                  <option value="3+ Hackathons">3+ Hackathons</option>
                  <option value="5+ Hackathons Won">5+ Hackathons Won</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Skills & Technologies
              </CardTitle>
              <CardDescription>
                Technologies and tools you work with
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="skills">Add Skills</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="skills"
                    placeholder="Type a skill and press Enter or Add"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddSkill}
                    size="icon"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="px-3 py-1 text-sm flex items-center gap-2 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group"
                    >
                      {skill}
                      <X
                        className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              )}

              {/* Suggested Skills */}
              <div>
                <Label className="text-sm text-muted-foreground">
                  Suggested Skills
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {suggestedSkills
                    .filter((skill) => !formData.skills.includes(skill))
                    .slice(0, 12)
                    .map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="px-3 py-1 text-sm cursor-pointer hover:bg-primary/10 transition-colors"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            skills: [...formData.skills, skill],
                          });
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {skill}
                      </Badge>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-primary" />
                Social Links
              </CardTitle>
              <CardDescription>
                Connect your professional profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="github_url">GitHub Profile</Label>
                <Input
                  id="github_url"
                  type="url"
                  value={formData.github_url}
                  onChange={(e) =>
                    setFormData({ ...formData, github_url: e.target.value })
                  }
                  placeholder="https://github.com/yourusername"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
                <Input
                  id="linkedin_url"
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) =>
                    setFormData({ ...formData, linkedin_url: e.target.value })
                  }
                  placeholder="https://linkedin.com/in/yourusername"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="portfolio_url">Portfolio / Website</Label>
                <Input
                  id="portfolio_url"
                  type="url"
                  value={formData.portfolio_url}
                  onChange={(e) =>
                    setFormData({ ...formData, portfolio_url: e.target.value })
                  }
                  placeholder="https://yourportfolio.com"
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex gap-3 justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="min-w-32"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsPageContent />
    </ProtectedRoute>
  );
}
