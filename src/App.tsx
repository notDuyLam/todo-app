import { useState, useEffect } from "react";
import { Todo } from "./components/TodoItem";
import AddTodoObject from "./components/AddTodo";
import TodoListCom from "./components/TodoList";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { Loader2, Moon, Sun } from "lucide-react";

function App() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      text: "Learn React",
      description: "This is a prototype task!",
      due: new Date("2024-04-13"),
      completed: false,
    },
    {
      id: 2,
      text: "Luyện tập TypeScript",
      completed: false,
      due: new Date(),
    },
  ]);

  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("todo-theme") === "light" ? false : true
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("todo-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleFilterChange = (newFilter: string) => {
    if (filter === newFilter) return;

    setIsLoading(true);

    setTimeout(() => {
      setFilter(newFilter);
      setIsLoading(false);
    }, 300);
  };

  function handleAddTodo(inputText: string, dueDate?: Date) {
    const newTodo: Todo = {
      id: todos.length + 1,
      text: inputText,
      completed: false,
      due: dueDate,
    };
    setTodos([...todos, newTodo]);
  }

  function handleToggleComplete(id: number) {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function handleDeleteTodo(id: number) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function handleEdit(
    id: number,
    newText: string,
    dueDate?: Date,
    isComplete?: boolean
  ) {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              text: newText,
              ...(dueDate !== undefined && { due: dueDate }),
              ...(isComplete !== undefined && { completed: isComplete }),
            }
          : todo
      )
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-foreground transition-colors">
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Task Manager</h1>
          <p className="text-muted-foreground">
            Keep track of your daily tasks
          </p>
        </header>

        <Button
          variant="outline"
          className="fixed top-4 right-4 rounded-full w-10 h-10 p-0 flex items-center justify-center"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="font-medium">Filter:</div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("all")}
                  disabled={isLoading}
                  className="transition-all duration-200"
                >
                  All
                </Button>
                <Button
                  variant={filter === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("active")}
                  disabled={isLoading}
                  className="transition-all duration-200"
                >
                  Active
                </Button>
                <Button
                  variant={filter === "completed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("completed")}
                  disabled={isLoading}
                  className="transition-all duration-200"
                >
                  Completed
                </Button>
              </div>

              {isLoading && (
                <div className="animate-in fade-in duration-200">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {!isLoading ? (
            <>
              <AddTodoObject onAddTodo={handleAddTodo} />
              <TodoListCom
                todos={todos}
                filter={filter}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTodo}
                onEdit={handleEdit}
              />
            </>
          ) : (
            <div className="h-[200px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
