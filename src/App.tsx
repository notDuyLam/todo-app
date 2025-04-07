import { useState } from "react";
import { Todo } from "./components/TodoItem";
import AddTodoObject from "./components/AddTodo";
import TodoListCom from "./components/TodoList";

function App() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      text: "Học React",
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

  function handleAddTodo(inputText: string, dueDate?: Date) {
    const newTodo: Todo = {
      id: todos.length + 1,
      text: inputText,
      completed: false,
      due: dueDate || new Date(),
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Task Manager</h1>
          <p className="text-muted-foreground">
            Keep track of your daily tasks
          </p>
        </header>

        <div className="space-y-6">
          <AddTodoObject onAddTodo={handleAddTodo} />
          <TodoListCom
            todos={todos}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTodo}
            onEdit={handleEdit}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
