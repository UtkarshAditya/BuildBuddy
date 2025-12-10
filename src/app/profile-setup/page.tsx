"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import {
  Sparkles,
  User,
  Briefcase,
  MapPin,
  Code,
  Target,
  ArrowRight,
  Plus,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usersAPI } from "@/lib/api";

export default function ProfileSetupPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form data
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

  const [skillInput, setSkillInput] = useState("");

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

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      if (!user) {
        setError("You must be logged in to update your profile");
        return;
      }

      // Don't send 'role' since it's computed from skills on the backend
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { role, ...updateData } = formData;
      console.log("Submitting profile update:", updateData);
      const result = await usersAPI.updateProfile(updateData);
      console.log("Profile updated successfully:", result);
      router.push("/browse");
    } catch (err) {
      console.error("Profile update error:", err);
      const error = err as Error;
      setError(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Complete Your Profile
          </h1>
          <p className="text-muted-foreground">
            Let&apos;s make you stand out to potential teammates!
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-2xl border-2 animate-fade-in-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {step === 1 && (
                <>
                  <User className="h-5 w-5 text-blue-500" />
                  Basic Information
                </>
              )}
              {step === 2 && (
                <>
                  <Briefcase className="h-5 w-5 text-blue-500" />
                  Professional Details
                </>
              )}
              {step === 3 && (
                <>
                  <Code className="h-5 w-5 text-blue-500" />
                  Skills & Expertise
                </>
              )}
              {step === 4 && (
                <>
                  <Target className="h-5 w-5 text-blue-500" />
                  Social Links
                </>
              )}
            </CardTitle>
            <CardDescription>
              {step === 1 &&
                "Tell us about yourself and what you're looking for"}
              {step === 2 && "Share your role and experience level"}
              {step === 3 && "What technologies and tools do you work with?"}
              {step === 4 && "Connect your professional profiles (optional)"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    placeholder="e.g., Sarah Chen"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio *</Label>
                  <textarea
                    id="bio"
                    placeholder="Tell us about yourself... What drives you? What projects excite you?"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="w-full min-h-[120px] px-3 py-2 border rounded-md bg-background mt-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.bio.length} characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., San Francisco, CA or Remote"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Professional */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <Label htmlFor="role">Your Role *</Label>
                  <Input
                    id="role"
                    placeholder="e.g., Full Stack Developer, UI/UX Designer, Data Scientist"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="experience">Experience Level *</Label>
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
                    <option value="Intermediate">
                      Intermediate (1-3 years)
                    </option>
                    <option value="Advanced">Advanced (3-5 years)</option>
                    <option value="Expert">Expert (5+ years)</option>
                    <option value="First Hackathon">First Hackathon</option>
                    <option value="3+ Hackathons">3+ Hackathons</option>
                    <option value="5+ Hackathons">5+ Hackathons Won</option>
                  </select>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    💡 <strong>Pro tip:</strong> Being specific about your role
                    helps teammates find you faster!
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Skills */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <Label htmlFor="skills">Your Skills *</Label>
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

                <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
                  <p className="text-sm font-medium text-cyan-900 dark:text-cyan-100 mb-2">
                    🚀 Suggested Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "React",
                      "Python",
                      "Node.js",
                      "TypeScript",
                      "AWS",
                      "UI/UX Design",
                      "Machine Learning",
                      "Django",
                    ]
                      .filter((s) => !formData.skills.includes(s))
                      .map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              skills: [...formData.skills, skill],
                            })
                          }
                        >
                          + {skill}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Social Links */}
            {step === 4 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <Label htmlFor="github_url">GitHub Profile</Label>
                  <Input
                    id="github_url"
                    placeholder="https://github.com/yourusername"
                    value={formData.github_url}
                    onChange={(e) =>
                      setFormData({ ...formData, github_url: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
                  <Input
                    id="linkedin_url"
                    placeholder="https://linkedin.com/in/yourusername"
                    value={formData.linkedin_url}
                    onChange={(e) =>
                      setFormData({ ...formData, linkedin_url: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="portfolio_url">Portfolio / Website</Label>
                  <Input
                    id="portfolio_url"
                    placeholder="https://yourportfolio.com"
                    value={formData.portfolio_url}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        portfolio_url: e.target.value,
                      })
                    }
                    className="mt-2"
                  />
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ✨ <strong>Almost done!</strong> Adding social links helps
                    teammates learn more about your work.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                >
                  Back
                </Button>
              )}

              {step < totalSteps ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  className="flex-1"
                  disabled={
                    (step === 1 && (!formData.full_name || !formData.bio)) ||
                    (step === 2 && (!formData.role || !formData.experience)) ||
                    (step === 3 && formData.skills.length === 0)
                  }
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Complete Setup"}
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Skip Option */}
            <div className="text-center pt-2">
              <button
                onClick={() => router.push("/browse")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
              >
                Skip for now
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
