import { useState, useEffect } from "react";
import { Todo } from "../components/TodoItem";
import AddTodoObject from "../components/AddTodo";
import TodoListCom from "../components/TodoList";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Loader2, CheckCircle2, Circle, Target } from "lucide-react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { listId } = useParams();

  const [listName, setListName] = useState("");
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await api.get(`/api/todo/list/${listId}`);
        const list = await api.get(`/api/todoList/${listId}`);

        setListName(list.data.data.title);
        setTodos(res.data.data);
      } catch (err) {
        console.error("Failed to fetch todos:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (listId) fetchTodos();
  }, [listId]);

  const completedCount = todos.filter((todo) => todo.completed).length;

  const handleFilterChange = (newFilter: string) => {
    if (filter === newFilter) return;

    setIsLoading(true);

    setTimeout(() => {
      setFilter(newFilter);
      setIsLoading(false);
    }, 300);
  };

  async function handleAddTodo(
    inputText: string,
    dueDate?: string,
    des?: string
  ) {
    let newTodo: Todo = {
      _id: todos.length + 1,
      title: inputText,
      completed: false,
      dueDate: dueDate,
      description: des,
      listId: listId ?? "",
    };

    const res = await api.post(`/api/todo`, newTodo);

    // Use the actual todo returned from the server
    const createdTodo = res.data.data;
    setTodos([...todos, createdTodo]);
    return res.data;
  }

  async function handleToggleComplete(id: number, completed: boolean) {
    const res = await api.put<Todo>(`/api/todo/${id}`, { completed });
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    return res.data;
  }

  async function handleDeleteTodo(id: number) {
    const res = await api.delete<Todo>(`/api/todo/${id}`);
    setTodos(todos.filter((todo) => todo._id !== id));
    return res.data;
  }

  async function handleEdit(
    id: number,
    title: string,
    isComplete?: boolean,
    dueDate?: string | undefined,
    description?: string
  ) {
    const res = await api.put<Todo>(`/api/todo/${id}`, {
      title,
      dueDate,
      isComplete,
      description,
    });
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === id
          ? {
              ...todo,
              title: title,
              ...(dueDate !== undefined && { dueDate: dueDate }),
              ...(isComplete !== undefined && { completed: isComplete }),
              ...(description !== undefined && { description: description }),
            }
          : todo
      )
    );
    return res.data;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-foreground transition-colors">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-primary mb-2">
              {listName || "Task Manager"}
            </h1>
            <p className="text-muted-foreground text-lg">
              Stay organized and productive with your tasks
            </p>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Tasks
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {todos.length}
                    </p>
                  </div>
                  <Circle className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {completedCount}
                    </p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-orange-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Remaining
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {todos.length - completedCount}
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <Card className="mb-6 bg-white dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Progress
                </span>
                <span className="text-sm font-medium text-foreground">
                  {todos.length > 0
                    ? Math.round((completedCount / todos.length) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      todos.length > 0
                        ? (completedCount / todos.length) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Section */}
        <Card className="mb-8 bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="pb-3">
            <h3 className="text-lg font-semibold text-foreground">
              Filter Tasks
            </h3>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("all")}
                disabled={isLoading}
                className="transition-all duration-200 hover:scale-105"
              >
                All Tasks
              </Button>
              <Button
                variant={filter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("active")}
                disabled={isLoading}
                className="transition-all duration-200 hover:scale-105"
              >
                Active
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("completed")}
                disabled={isLoading}
                className="transition-all duration-200 hover:scale-105"
              >
                Completed
              </Button>

              {isLoading && (
                <div className="ml-2 animate-in fade-in duration-200">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-6">
          {!isLoading ? (
            <div className="grid gap-6">
              {/* Add Todo Section */}
              <Card className="bg-white dark:bg-gray-800 shadow-sm">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-foreground">
                    Add New Task
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Create a new task to stay organized
                  </p>
                </CardHeader>
                <CardContent>
                  <AddTodoObject onAddTodo={handleAddTodo} />
                </CardContent>
              </Card>

              {/* Todo List Section */}
              <Card className="bg-white dark:bg-gray-800 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">
                      Your Tasks
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      {filter === "all" && `${todos.length} total`}
                      {filter === "active" &&
                        `${todos.length - completedCount} active`}
                      {filter === "completed" && `${completedCount} completed`}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <TodoListCom
                    todos={todos}
                    filter={filter}
                    completedCounts={completedCount}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteTodo}
                    onEdit={handleEdit}
                    setTodos={setTodos}
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-12">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground text-lg">
                    Loading your tasks...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoPage;
