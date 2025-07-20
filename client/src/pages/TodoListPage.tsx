import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Plus,
  Search,
  Filter,
  List,
  Calendar,
  MoreVertical,
  CheckCircle,
  Clock,
  Folder,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/api/axios";
import { Loader2 } from "lucide-react"; // For loading spinner

type TodoList = {
  _id: string;
  title: string;
  category: string;
  userId: string;
  todoCount: number;
  completedTodos: number;
  createdAt: string;
  updatedAt: string;
};

function TodoListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all"); // all, completed, incomplete
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [newListCategory, setNewListCategory] = useState("general");
  const [isCreating, setIsCreating] = useState(false);
  const [customCategory, setCustomCategory] = useState("");

  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchTodoLists = async () => {
      try {
        setLoading(true);
        setError("");

        if (!isAuthenticated || !user) {
          setError("Please log in to view your todo lists");
          return;
        }

        // Fetch user's todo lists
        const response = await api.get(`/api/todoList/user/${user._id}`);

        if (response.data.success) {
          setTodoLists(response.data.data);
        } else {
          setError("Failed to fetch todo lists");
        }
      } catch (error: any) {
        console.error("Error fetching todo lists", error);
        setError(error.resonse?.data?.message || "Faied to fetch todo lists");
      } finally {
        setLoading(false);
      }
    };
    fetchTodoLists();
  }, [isAuthenticated, user]);

  // What I wanna do?
  // I want to extract category of each list to make my new own category fiedld

  const categoriesMap: Record<string, number> = {};

  todoLists.forEach((list) => {
    const category = list.category || "general";
    categoriesMap[category] = (categoriesMap[category] || 0) + 1;
  });

  const categories = [
    { id: "all", label: "All Lists", count: todoLists.length },
    ...Object.entries(categoriesMap).map(([key, count]) => ({
      id: key,
      label: key.charAt(0).toUpperCase() + key.slice(1), // capitalize
      count,
    })),
  ];

  const filteredLists = todoLists.filter((list) => {
    const matchesSearch = list.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || list.category === selectedCategory;

    // Filter by completion status
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "completed" &&
        list.todoCount > 0 &&
        list.completedTodos === list.todoCount) ||
      (selectedStatus === "incomplete" &&
        (list.todoCount === 0 || list.completedTodos < list.todoCount));

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "1 day ago";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const handleCreateList = async () => {
    if (!newListTitle.trim()) return;

    const finalCategory =
      newListCategory === "Other" ? customCategory.trim() : newListCategory;

    // Validate custom category if "Other" is selected
    if (newListCategory === "Other" && !customCategory.trim()) {
      setError("Please enter a custom category name");
      return;
    }

    try {
      setIsCreating(true);
      setError(""); // Clear any previous errors
      const response = await api.post("/api/todoList", {
        title: newListTitle.trim(),
        category: finalCategory,
        userId: user?._id,
      });

      if (response.data.success) {
        setTodoLists((prev) => [...prev, response.data.data]);

        // Reset all form fields
        setNewListTitle("");
        setNewListCategory("general");
        setCustomCategory("");
        setIsDialogOpen(false);

        navigate(`/todolists/${response.data.data._id}`);
      }
    } catch (error: any) {
      console.error("Error creating todo list:", error);
      setError(error.response?.data?.message || "Failed to create todo list");
    } finally {
      setIsCreating(false);
    }
  };

  // Get existing categories for the select dropdown
  const existingCategories = [
    ...new Set(todoLists.map((list) => list.category).filter(Boolean)),
  ];
  const categoryOptions = [...existingCategories, "Other"];

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading your todo lists...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        <Card className="py-12">
          <CardContent className="text-center">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-red-500 text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Error Loading Lists</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        <Card className="py-12">
          <CardContent className="text-center">
            <h3 className="text-lg font-semibold mb-2">Please Log In</h3>
            <p className="text-muted-foreground mb-4">
              You need to log in to view your todo lists
            </p>
            <Button onClick={() => navigate("/login")}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Todo Lists</h1>
            <p className="text-muted-foreground">
              Organize your tasks into different lists and categories
            </p>
          </div>
          {/* New List Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New List
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Todo List</DialogTitle>
                <DialogDescription>
                  Create a new todo list to organize your tasks. Choose a title
                  and category.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">List Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter list title..."
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleCreateList();
                      }
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newListCategory}
                    onValueChange={setNewListCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {newListCategory === "Other" && (
                    <div className="grid gap-2 mt-3 p-4 bg-muted/50 rounded-lg border border-dashed">
                      <Label
                        htmlFor="customCategory"
                        className="text-sm font-medium"
                      >
                        Custom Category Name
                      </Label>
                      <Input
                        id="customCategory"
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="e.g. Work, Study, Fitness..."
                        className="bg-background"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleCreateList();
                          }
                        }}
                      />
                      <p className="text-xs text-muted-foreground">
                        Create a custom category to organize your lists
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setNewListTitle("");
                    setNewListCategory("general");
                    setCustomCategory("");
                    setError(""); // Clear any errors
                  }}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateList}
                  disabled={
                    !newListTitle.trim() ||
                    (newListCategory === "Other" && !customCategory.trim()) ||
                    isCreating
                  }
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create List
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search todo lists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter Dropdown */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                  All Lists
                </div>
              </SelectItem>
              <SelectItem value="completed">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Completed
                </div>
              </SelectItem>
              <SelectItem value="incomplete">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  Incomplete
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Folder className="h-5 w-5" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <span className="font-medium">{category.label}</span>
                  <Badge
                    variant={
                      selectedCategory === category.id ? "secondary" : "outline"
                    }
                  >
                    {category.count}
                  </Badge>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Lists
                </span>
                <Badge variant="secondary">{todoLists.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Completed Lists
                </span>
                <Badge
                  variant="default"
                  className="bg-green-500 hover:bg-green-600"
                >
                  {
                    todoLists.filter(
                      (list) =>
                        list.todoCount > 0 &&
                        list.completedTodos === list.todoCount
                    ).length
                  }
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Incomplete Lists
                </span>
                <Badge
                  variant="outline"
                  className="border-blue-500 text-blue-600"
                >
                  {
                    todoLists.filter(
                      (list) =>
                        list.todoCount === 0 ||
                        list.completedTodos < list.todoCount
                    ).length
                  }
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Tasks
                </span>
                <Badge variant="outline">
                  {todoLists.reduce((sum, list) => sum + list.todoCount, 0)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Completed Tasks
                </span>
                <Badge
                  variant="default"
                  className="bg-emerald-500 hover:bg-emerald-600"
                >
                  {todoLists.reduce(
                    (sum, list) => sum + list.completedTodos,
                    0
                  )}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Todo Lists Grid */}
        <div className="lg:col-span-3">
          <div className="columns-1 md:columns-2 xl:columns-3 gap-4 space-y-4">
            {filteredLists.map((list) => (
              <Card
                key={list._id}
                onClick={() => navigate(`/todolists/${list._id}`)}
                className="hover:shadow-lg transition-shadow cursor-pointer group break-inside-avoid mb-4"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <CardTitle className="text-lg line-clamp-1">
                          {list.title}
                        </CardTitle>
                        <Badge variant="outline" className="mt-1 capitalize">
                          {list.category}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Section */}
                  {list.todoCount === 0 ? (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 mx-auto mb-3 bg-muted rounded-full flex items-center justify-center">
                        <Plus className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        No tasks yet
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Click to add your first task
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Progress Bar */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-muted-foreground">
                            Progress
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">
                              {Math.round(
                                (list.completedTodos / list.todoCount) * 100
                              )}
                              %
                            </span>
                            {list.completedTodos === list.todoCount && (
                              <Badge
                                variant="default"
                                className="bg-green-500 hover:bg-green-600 text-xs px-2 py-0"
                              >
                                Complete
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-muted/60 rounded-full h-2.5 shadow-inner">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-500 ease-out shadow-sm ${
                              list.completedTodos === list.todoCount
                                ? "bg-gradient-to-r from-green-500 to-green-600"
                                : list.completedTodos > 0
                                ? "bg-gradient-to-r from-blue-500 to-blue-600"
                                : "bg-gradient-to-r from-gray-400 to-gray-500"
                            }`}
                            style={{
                              width: `${
                                (list.completedTodos / list.todoCount) * 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <List className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-lg font-bold text-foreground">
                              {list.todoCount}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Total Tasks
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-lg font-bold text-green-700 dark:text-green-400">
                              {list.completedTodos}
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-500">
                              Completed Tasks
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Summary */}
                      {list.todoCount > 0 && (
                        <div className="pt-2">
                          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                            {list.completedTodos === list.todoCount ? (
                              <>
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                All tasks completed! 🎉
                              </>
                            ) : list.completedTodos === 0 ? (
                              <>
                                <Clock className="h-3 w-3" />
                                Ready to start
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3" />
                                {list.todoCount - list.completedTodos} tasks
                                remaining
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Created {formatDate(list.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatRelativeTime(list.updatedAt)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredLists.length === 0 && (
            <Card className="py-12">
              <CardContent className="text-center">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                  <List className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No lists found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm
                    ? `No lists match "${searchTerm}"`
                    : "Get started by creating your first todo list"}
                </p>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create New List
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoListPage;
