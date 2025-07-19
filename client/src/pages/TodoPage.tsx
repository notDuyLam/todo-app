import { useState, useEffect } from "react";
import { Todo } from "../components/TodoItem";
import AddTodoObject from "../components/AddTodo";
import TodoListCom from "../components/TodoList";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Loader2 } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-foreground transition-colors">
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Task Manager</h1>
          <p className="text-muted-foreground">
            Keep track of your daily tasks
          </p>
        </header>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-1">
            {listName}
          </h2>
          <p className="text-sm text-muted-foreground">
            {todos.length} {todos.length === 1 ? "task" : "tasks"} •{" "}
            {completedCount} completed
          </p>
        </div>

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
                completedCounts={completedCount}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTodo}
                onEdit={handleEdit}
                setTodos={setTodos}
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

export default TodoPage;
