"use client";

import { useState } from "react";
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
import { Users, Plus, X, Save, AlertCircle } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { teamsAPI } from "@/lib/api";

function CreateTeamContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [requiredSkillInput, setRequiredSkillInput] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    hackathon: "",
    lookingFor: [] as string[],
    requiredSkills: [] as string[],
    maxMembers: "4",
  });

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.lookingFor.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        lookingFor: [...formData.lookingFor, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      lookingFor: formData.lookingFor.filter(
        (skill) => skill !== skillToRemove
      ),
    });
  };

  const handleAddRequiredSkill = () => {
    if (
      requiredSkillInput.trim() &&
      !formData.requiredSkills.includes(requiredSkillInput.trim())
    ) {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, requiredSkillInput.trim()],
      });
      setRequiredSkillInput("");
    }
  };

  const handleRemoveRequiredSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter(
        (skill) => skill !== skillToRemove
      ),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await teamsAPI.create({
        name: formData.name,
        description: formData.description,
        hackathon: formData.hackathon
          ? parseInt(formData.hackathon)
          : undefined,
        required_skills: formData.requiredSkills,
        team_size: parseInt(formData.maxMembers),
      });
      // Redirect to team dashboard
      router.push("/team-dashboard");
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create a Team</h1>
          <p className="text-muted-foreground">
            Start building your hackathon dream team
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 flex items-center gap-2 mb-6">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Team Details
              </CardTitle>
              <CardDescription>
                Tell us about your team and what you&apos;re looking for
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="name">Team Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Code Ninjas, Innovation Squad"
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="What's your team about? What are your goals?"
                  className="w-full min-h-[120px] px-3 py-2 border rounded-md bg-background mt-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <Label htmlFor="hackathon">Hackathon (Optional)</Label>
                <Input
                  id="hackathon"
                  value={formData.hackathon}
                  onChange={(e) =>
                    setFormData({ ...formData, hackathon: e.target.value })
                  }
                  placeholder="e.g., HackMIT 2024, TreeHacks"
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Which hackathon are you targeting?
                </p>
              </div>

              <div>
                <Label htmlFor="maxMembers">Max Team Members</Label>
                <select
                  id="maxMembers"
                  value={formData.maxMembers}
                  onChange={(e) =>
                    setFormData({ ...formData, maxMembers: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md bg-background mt-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="2">2 Members</option>
                  <option value="3">3 Members</option>
                  <option value="4">4 Members</option>
                  <option value="5">5 Members</option>
                  <option value="6">6 Members</option>
                </select>
              </div>

              <div>
                <Label htmlFor="lookingFor">Looking For (Skills/Roles)</Label>
                <p className="text-xs text-muted-foreground mt-1 mb-2">
                  Optional skills or roles you&apos;d like team members to have
                </p>
                <div className="flex gap-2">
                  <Input
                    id="lookingFor"
                    placeholder="e.g., React Developer, UI Designer"
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
                {formData.lookingFor.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.lookingFor.map((skill) => (
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
              </div>

              <div>
                <Label htmlFor="requiredSkills">Required Skills *</Label>
                <p className="text-xs text-muted-foreground mt-1 mb-2">
                  Essential skills that team members must have
                </p>
                <div className="flex gap-2">
                  <Input
                    id="requiredSkills"
                    placeholder="e.g., Python, Machine Learning, API Development"
                    value={requiredSkillInput}
                    onChange={(e) => setRequiredSkillInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddRequiredSkill();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddRequiredSkill}
                    size="icon"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.requiredSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="default"
                        className="px-3 py-1 text-sm flex items-center gap-2 cursor-pointer hover:bg-red-500 transition-colors group"
                      >
                        {skill}
                        <X
                          className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveRequiredSkill(skill)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Create Team
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

export default function CreateTeamPage() {
  return (
    <ProtectedRoute>
      <CreateTeamContent />
    </ProtectedRoute>
  );
}
