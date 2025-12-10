"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, X, Flag, Calendar, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { teamsAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assigned_to_id: number | null;
  assigned_to_name: string | null;
  created_by_id: number;
  created_by_name: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

interface TeamMember {
  id: number;
  username: string;
  full_name: string;
  role: string;
  status: string;
}

interface TeamDetail {
  id: number;
  name: string;
  description: string;
  lead_id?: number;
  members?: TeamMember[];
}

function TeamDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const teamId = parseInt(params.id as string);

  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assigned_to_id: "",
    priority: "medium",
    due_date: "",
  });

  useEffect(() => {
    fetchTeamData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      const [teamData, tasksData] = await Promise.all([
        teamsAPI.getTeamMembers(teamId),
        teamsAPI.getTasks(teamId),
      ]);
      setTeam(teamData);
      setTasks(tasksData);

      if (teamData.members) {
        setMembers(teamData.members as TeamMember[]);
      }
    } catch (err) {
      console.error("Error fetching team data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (status: string) => {
    try {
      const taskData: {
        title: string;
        description: string;
        priority: string;
        status: string;
        assigned_to_id?: number;
        due_date?: string;
      } = {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        status: status,
      };

      if (newTask.assigned_to_id) {
        taskData.assigned_to_id = parseInt(newTask.assigned_to_id);
      }

      if (newTask.due_date) {
        taskData.due_date = new Date(newTask.due_date).toISOString();
      }

      const createdTask = await teamsAPI.createTask(teamId, taskData);
      setTasks([...tasks, createdTask]);
      setNewTask({
        title: "",
        description: "",
        assigned_to_id: "",
        priority: "medium",
        due_date: "",
      });
      setShowAddTask(false);
      setAddingToColumn(null);
    } catch (err) {
      const error = err as Error;
      alert(error.message || "Failed to create task");
    }
  };

  const handleUpdateTask = async (
    taskId: number,
    updates: Partial<Task>,
    newStatus?: string
  ) => {
    try {
      const updatedTask = await teamsAPI.updateTask(teamId, taskId, {
        ...updates,
        ...(newStatus && { status: newStatus }),
      });
      setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));
    } catch (err) {
      const error = err as Error;
      alert(error.message || "Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await teamsAPI.deleteTask(teamId, taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err) {
      const error = err as Error;
      alert(error.message || "Failed to delete task");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500 border-red-500";
      case "medium":
        return "text-yellow-500 border-yellow-500";
      case "low":
        return "text-blue-500 border-blue-500";
      default:
        return "text-gray-500 border-gray-500";
    }
  };

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 dark:bg-red-950/30";
      case "medium":
        return "bg-yellow-50 dark:bg-yellow-950/30";
      case "low":
        return "bg-blue-50 dark:bg-blue-950/30";
      default:
        return "bg-gray-50 dark:bg-gray-950/30";
    }
  };

  const isTeamLead = team && user && team.lead_id === user.id;

  const columns = [
    { id: "todo", title: "To Do", color: "border-gray-300" },
    { id: "in_progress", title: "In Progress", color: "border-blue-500" },
    { id: "completed", title: "Completed", color: "border-green-500" },
  ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p className="text-muted-foreground">Loading team...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p className="text-muted-foreground">Team not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            ← Back to Teams
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">{team.name}</h1>
              <p className="text-muted-foreground">{team.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {isTeamLead && (
                <Badge variant="default" className="text-sm">
                  Team Lead
                </Badge>
              )}
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  {getInitials(team.name)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        <Tabs defaultValue="board" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="members">
              Members ({members.length})
            </TabsTrigger>
          </TabsList>

          {/* Kanban Board */}
          <TabsContent value="board" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {columns.map((column) => (
                <div
                  key={column.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-t-4 ${column.color} min-h-[600px] flex flex-col`}
                >
                  {/* Column Header */}
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{column.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {getTasksByStatus(column.id).length}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        setAddingToColumn(column.id);
                        setShowAddTask(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add task
                    </Button>
                  </div>

                  {/* Tasks */}
                  <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                    {/* Add Task Form */}
                    {showAddTask && addingToColumn === column.id && (
                      <Card className="border-2 border-primary shadow-lg">
                        <CardContent className="pt-4 space-y-3">
                          <Input
                            placeholder="Task name"
                            value={newTask.title}
                            onChange={(e) =>
                              setNewTask({ ...newTask, title: e.target.value })
                            }
                            autoFocus
                          />
                          <textarea
                            placeholder="Description (optional)"
                            value={newTask.description}
                            onChange={(e) =>
                              setNewTask({
                                ...newTask,
                                description: e.target.value,
                              })
                            }
                            className="w-full min-h-[60px] px-3 py-2 text-sm border rounded-md bg-background resize-none"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <select
                              value={newTask.assigned_to_id}
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  assigned_to_id: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                            >
                              <option value="">Unassigned</option>
                              {members.map((member) => (
                                <option key={member.id} value={member.id}>
                                  {member.full_name || member.username}
                                </option>
                              ))}
                            </select>
                            <select
                              value={newTask.priority}
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  priority: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </div>
                          <Input
                            type="date"
                            value={newTask.due_date}
                            onChange={(e) =>
                              setNewTask({
                                ...newTask,
                                due_date: e.target.value,
                              })
                            }
                            className="text-sm"
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleAddTask(column.id)}
                              disabled={!newTask.title}
                              size="sm"
                              className="flex-1"
                            >
                              Add task
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => {
                                setShowAddTask(false);
                                setAddingToColumn(null);
                                setNewTask({
                                  title: "",
                                  description: "",
                                  assigned_to_id: "",
                                  priority: "medium",
                                  due_date: "",
                                });
                              }}
                              size="sm"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Task Cards */}
                    {getTasksByStatus(column.id).map((task) => (
                      <Card
                        key={task.id}
                        className={`group hover:shadow-md transition-all cursor-pointer border-l-4 ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        <CardContent className="p-4 space-y-3">
                          {/* Task Header */}
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-sm flex-1 leading-snug">
                              {task.title}
                            </h4>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUpdateTask(
                                      task.id,
                                      {},
                                      column.id === "todo"
                                        ? "in_progress"
                                        : column.id === "in_progress"
                                        ? "completed"
                                        : "todo"
                                    )
                                  }
                                >
                                  Move to{" "}
                                  {column.id === "todo"
                                    ? "In Progress"
                                    : column.id === "in_progress"
                                    ? "Completed"
                                    : "To Do"}
                                </DropdownMenuItem>
                                {(isTeamLead ||
                                  task.created_by_id === user?.id) && (
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="text-red-600"
                                  >
                                    Delete task
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Task Description */}
                          {task.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          {/* Task Footer */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {/* Priority */}
                              <div
                                className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs ${getPriorityBg(
                                  task.priority
                                )}`}
                              >
                                <Flag
                                  className={`h-3 w-3 ${getPriorityColor(
                                    task.priority
                                  )}`}
                                />
                                <span
                                  className={`capitalize ${getPriorityColor(
                                    task.priority
                                  )}`}
                                >
                                  {task.priority}
                                </span>
                              </div>

                              {/* Due Date */}
                              {task.due_date && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(task.due_date).toLocaleDateString(
                                    "en-US",
                                    { month: "short", day: "numeric" }
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Assigned User */}
                            {task.assigned_to_name && (
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                  {getInitials(task.assigned_to_name)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>All members of your team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          {getInitials(member.full_name || member.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">
                          {member.full_name || member.username}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          @{member.username}
                        </p>
                      </div>
                      <Badge
                        variant={
                          member.role === "leader" ? "default" : "secondary"
                        }
                      >
                        {member.role === "leader" ? "Lead" : "Member"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function TeamDetailPage() {
  return (
    <ProtectedRoute>
      <TeamDetailPageContent />
    </ProtectedRoute>
  );
}
