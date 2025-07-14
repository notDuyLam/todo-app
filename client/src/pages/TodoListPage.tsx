import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
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
import { useState } from "react";

function TodoListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data - replace with real data later
  const mockTodoLists = [
    {
      id: "1",
      title: "Work Projects",
      category: "work",
      todoCount: 12,
      completedTodos: 8,
      createdAt: "2024-01-15",
      lastUpdated: "2 hours ago",
    },
    {
      id: "2",
      title: "Personal Goals",
      category: "personal",
      todoCount: 7,
      completedTodos: 3,
      createdAt: "2024-01-10",
      lastUpdated: "1 day ago",
    },
    {
      id: "3",
      title: "Shopping List",
      category: "shopping",
      todoCount: 15,
      completedTodos: 15,
      createdAt: "2024-01-20",
      lastUpdated: "3 days ago",
    },
    {
      id: "4",
      title: "Study Schedule",
      category: "education",
      todoCount: 9,
      completedTodos: 5,
      createdAt: "2024-01-05",
      lastUpdated: "5 hours ago",
    },
    {
      id: "5",
      title: "Fitness Plan",
      category: "health",
      todoCount: 6,
      completedTodos: 2,
      createdAt: "2024-01-12",
      lastUpdated: "1 week ago",
    },
  ];

  const categories = [
    { id: "all", label: "All Lists", count: mockTodoLists.length },
    {
      id: "work",
      label: "Work",
      count: mockTodoLists.filter((list) => list.category === "work").length,
    },
    {
      id: "personal",
      label: "Personal",
      count: mockTodoLists.filter((list) => list.category === "personal")
        .length,
    },
    {
      id: "shopping",
      label: "Shopping",
      count: mockTodoLists.filter((list) => list.category === "shopping")
        .length,
    },
    {
      id: "education",
      label: "Education",
      count: mockTodoLists.filter((list) => list.category === "education")
        .length,
    },
    {
      id: "health",
      label: "Health",
      count: mockTodoLists.filter((list) => list.category === "health").length,
    },
  ];

  const getCategoryColor = (type: string) => {
    const colors = {
      work: "bg-blue-500",
      personal: "bg-green-500",
      shopping: "bg-purple-500",
      education: "bg-orange-500",
      health: "bg-pink-500",
    };
    return colors[type as keyof typeof colors] || "bg-gray-500";
  };

  const getCategoryIcon = (type: string) => {
    const icons = {
      work: "💼",
      personal: "🏠",
      shopping: "🛒",
      education: "📚",
      health: "💪",
    };
    return icons[type as keyof typeof icons] || "📋";
  };

  const filteredLists = mockTodoLists.filter((list) => {
    const matchesSearch = list.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || list.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New List
          </Button>
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
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
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
                <Badge variant="secondary">{mockTodoLists.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Tasks
                </span>
                <Badge variant="outline">
                  {mockTodoLists.reduce((sum, list) => sum + list.todoCount, 0)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completed</span>
                <Badge
                  variant="default"
                  className="bg-green-500 hover:bg-green-600"
                >
                  {mockTodoLists.reduce(
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
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredLists.map((list) => (
              <Card
                key={list.id}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg ${getCategoryColor(
                          list.category
                        )} flex items-center justify-center text-white text-lg`}
                      >
                        {getCategoryIcon(list.category)}
                      </div>
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
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {Math.round(
                          (list.completedTodos / list.todoCount) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getCategoryColor(
                          list.category
                        )}`}
                        style={{
                          width: `${
                            (list.completedTodos / list.todoCount) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <List className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{list.todoCount}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">
                          {list.completedTodos}
                        </p>
                        <p className="text-xs text-muted-foreground">Done</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Created {list.createdAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {list.lastUpdated}
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
