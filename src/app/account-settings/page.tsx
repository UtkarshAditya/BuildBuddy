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
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Bell,
  Lock,
  Trash2,
  AlertTriangle,
  Save,
  AlertCircle,
} from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function AccountSettingsContent() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    teamInvites: true,
    hackathonUpdates: true,
    messages: true,
    weeklyDigest: false,
  });

  // Password Change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications({ ...notifications, [key]: value });
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // TODO: Implement API call to save notification preferences
      // await settingsAPI.updateNotifications(notifications);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to update notification settings");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      // TODO: Implement API call to change password
      // await authAPI.changePassword(passwordData);
      setSuccess(true);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // TODO: Implement API call to delete account
      // await authAPI.deleteAccount();
      // logout();
      alert("Account deletion functionality will be implemented soon");
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to delete account");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and security settings
          </p>
        </div>

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
                Your settings have been updated successfully
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Success Message */}
        {success && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-6">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200 mb-2">
              <Save className="h-5 w-5" />
              <span className="font-semibold">
                Settings Updated Successfully!
              </span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300 ml-7">
              Your changes have been saved.
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 flex items-center gap-2 mb-6">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your account activity
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("emailNotifications", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="team-invites">Team Invites</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone invites you to their team
                  </p>
                </div>
                <Switch
                  id="team-invites"
                  checked={notifications.teamInvites}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("teamInvites", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="hackathon-updates">Hackathon Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Updates about hackathons you&apos;re registered for
                  </p>
                </div>
                <Switch
                  id="hackathon-updates"
                  checked={notifications.hackathonUpdates}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("hackathonUpdates", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="messages">Direct Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications for new messages from other users
                  </p>
                </div>
                <Switch
                  id="messages"
                  checked={notifications.messages}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("messages", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly-digest">Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Weekly summary of your activity and opportunities
                  </p>
                </div>
                <Switch
                  id="weekly-digest"
                  checked={notifications.weeklyDigest}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("weeklyDigest", checked)
                  }
                />
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleSaveNotifications}
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Preferences
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    placeholder="Enter current password"
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    placeholder="Enter new password"
                    className="mt-2"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Must be at least 8 characters long
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirm new password"
                    className="mt-2"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Update Password
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/10">
                  <div>
                    <h4 className="font-semibold text-red-600 dark:text-red-400">
                      Delete Account
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove all your data from our
                          servers, including:
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Your profile and personal information</li>
                            <li>All teams you&apos;ve created or joined</li>
                            <li>Your message history</li>
                            <li>Your hackathon registrations</li>
                          </ul>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Yes, Delete My Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AccountSettingsPage() {
  return (
    <ProtectedRoute>
      <AccountSettingsContent />
    </ProtectedRoute>
  );
}
