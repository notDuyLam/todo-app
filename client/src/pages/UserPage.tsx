import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  User,
  Mail,
  Calendar,
  Settings,
  Edit3,
  Shield,
  Clock,
  CheckCircle,
  ListTodo,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

type formData = {
  username: string;
  email: string;
  password: string;
};

function UserPage() {
  const [formData, setFormData] = useState<formData>({
    username: "",
    email: "",
    password: "",
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { user, loading, isAuthenticated, logout } = useAuth();

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        password: "",
      });
    }
  }, [user]);

  const handleDeleteUser = async () => {
    try {
      setIsLoading(true);
      const res = await api.delete(`/api/users/${user?._id}`);

      if (res.data.success) {
        setMessage("Your account has been successfully deleted");
        setIsDeleteDialogOpen(false);
        // Use auth context logout function to properly clear auth state
        logout();
        // Redirect to login page
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      } else {
        setMessage(res.data.message || "Error deleting your account.");
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      setMessage(
        error.response?.data?.message || "Error deleting your account."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const updateData: any = {
        username: formData.username,
        email: formData.email,
      };

      // Only include password if it's provided
      if (formData.password.trim()) {
        updateData.password = formData.password;
      }

      const res = await api.put(`/api/users/${user?._id}`, updateData);

      if (res.data.success) {
        setMessage("Profile updated successfully!");
        setIsEditDialogOpen(false);
        // Reset password field
        setFormData((prev) => ({ ...prev, password: "" }));
        // Refresh user data or update context
        window.location.reload(); // Simple refresh - you might want to update the auth context instead
      } else {
        setMessage(res.data.message || "Error updating profile.");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setMessage(error.response?.data?.message || "Error updating profile.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {}, []);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-background dark:to-secondary/20 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!user)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-background dark:to-secondary/20 flex items-center justify-center">
        <p>Can't find User</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-background dark:to-secondary/20">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        {/* Main Profile Card */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Info */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-xl font-semibold bg-primary text-primary-foreground">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-xl mb-1">
                    {user.username}
                  </CardTitle>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Active Member
                  </p>
                </div>
                <Dialog
                  open={isEditDialogOpen}
                  onOpenChange={setIsEditDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here. Click save when
                        you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleEditUser}
                            placeholder="Enter username"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleEditUser}
                            placeholder="Enter email"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="password">
                            New Password (optional)
                          </Label>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleEditUser}
                            placeholder="Leave blank to keep current password"
                          />
                        </div>
                        {message && (
                          <div
                            className={`text-sm p-2 rounded ${
                              message.includes("successfully")
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-red-100 text-red-700 border border-red-200"
                            }`}
                          >
                            {message}
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditDialogOpen(false);
                            setMessage("");
                            // Reset form to original values
                            if (user) {
                              setFormData({
                                username: user.username,
                                email: user.email,
                                password: "",
                              });
                            }
                          }}
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Updating..." : "Save Changes"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* User Details */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-md bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="font-medium">{user.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-md bg-primary/10">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 sm:col-span-2">
                  <div className="p-2 rounded-md bg-primary/10">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Member since
                    </p>
                    <p className="font-medium">
                      {new Date(user.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ListTodo className="h-5 w-5" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Tasks
                  </span>
                  <Badge variant="secondary">{user.totalTodos}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Completed
                  </span>
                  <Badge
                    variant="default"
                    className="bg-green-500 hover:bg-green-600"
                  >
                    {user.completedTodos}
                  </Badge>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="pt-2">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Completion Rate</span>
                  <span className="font-medium">
                    {Math.round((user.completedTodos / user.totalTodos) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        (user.completedTodos / user.totalTodos) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Section */}
        <div className="grid gap-6 md:grid-cols-2 mt-6">
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Edit3 className="h-4 w-4 mr-2" />
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Update Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Privacy Settings
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Completed "Buy groceries"
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                <ListTodo className="h-4 w-4 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Created "Weekend Plans"</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Completed "Finish project"
                  </p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Danger Zone */}
        <Card className="mt-6 border-destructive/20">
          <CardHeader>
            <CardTitle className="text-lg text-destructive">
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              These actions cannot be undone. Please proceed with caution.
            </p>
            <Dialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-destructive">
                    Delete Account
                  </DialogTitle>
                  <DialogDescription>
                    Are you absolutely sure you want to delete your account?
                    This action cannot be undone. This will permanently delete
                    your account and remove all your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                {message && (
                  <div
                    className={`text-sm p-2 rounded ${
                      message.includes("successfully")
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                  >
                    {message}
                  </div>
                )}
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDeleteDialogOpen(false);
                      setMessage("");
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteUser}
                    disabled={isLoading}
                  >
                    {isLoading ? "Deleting..." : "Delete Account"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UserPage;
