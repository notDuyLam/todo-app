import { useState } from "react";
import TodoItem from "./TodoItem";
import { Todo } from "./TodoItem";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "./ui/button";

type TodoList = {
  todos: Todo[];
  filter: string;
  completedCounts: number;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (
    id: number,
    newText: string,
    dueDate?: Date,
    isComplete?: boolean
  ) => void;
  setTodos: (todos: Todo[]) => void;
};

const TodoListCom = ({
  todos,
  filter,
  completedCounts,
  onToggleComplete,
  onDelete,
  onEdit,
  setTodos,
}: TodoList) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const [showCompleted, setShowCompleted] = useState(false);
  const [isEditing, setEditing] = useState(false);

  const handleSetEditing = () => {
    setEditing(!isEditing);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = todos.findIndex((todo) => todo.id === active.id);
      const newIndex = todos.findIndex((todo) => todo.id === over.id);
      const newTodos = arrayMove(todos, oldIndex, newIndex);
      setTodos(newTodos);
    }
  };

  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed === b.completed) return 0; // Keep original order if both are the same
    return a.completed ? 1 : -1; // Move completed tasks to the bottom
  });

  const completedTodos = todos.filter((todo) => todo.completed);
  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Card className="w-full shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold">Your Tasks</CardTitle>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Completed:</span>
              <span className="font-medium">{completedCounts}</span>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-280px)] pr-4">
              {todos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <p>You have no tasks yet</p>
                  <p className="text-sm">Add one using the form above</p>
                </div>
              ) : (
                <SortableContext
                  disabled={isEditing}
                  items={sortedTodos.map((todo) => todo.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <ul className="w-full space-y-3">
                    {sortedTodos
                      .filter((todo) => {
                        if (filter === "all") return true;
                        if (filter === "active") return !todo.completed;
                        if (filter === "completed") return todo.completed;
                        return true;
                      })
                      .map((todo) => (
                        <TodoItem
                          key={todo.id}
                          todo={todo}
                          isEditing={isEditing}
                          onCheck={onToggleComplete}
                          onDelete={onDelete}
                          onEdit={onEdit}
                          setIsEditing={handleSetEditing}
                        />
                      ))}
                  </ul>
                </SortableContext>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </DndContext>

      {/* Completed todos start here */}
      <Card className="completed-todos w-full shadow-sm h-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between w-full">
            <CardTitle className="text-xl font-semibold">
              Completed Tasks ({completedCounts})
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-2 transition-transform duration-300"
              onClick={() => setShowCompleted(!showCompleted)}
            >
              <span
                className={`transition-transform duration-300 ${
                  showCompleted ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </Button>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground"></div>
        </CardHeader>
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: showCompleted ? "1000px" : "0px" }}
        >
          <CardContent>
            {completedTodos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <p>You have no completed tasks</p>
              </div>
            ) : (
              <SortableContext
                disabled={isEditing}
                items={completedTodos.map((todo) => todo.id)}
                strategy={verticalListSortingStrategy}
              >
                <ul className="w-full space-y-3">
                  {completedTodos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      isEditing={isEditing}
                      onCheck={onToggleComplete}
                      onDelete={onDelete}
                      onEdit={onEdit}
                      setIsEditing={handleSetEditing}
                    />
                  ))}
                </ul>
              </SortableContext>
            )}
          </CardContent>
        </div>
      </Card>
    </>
  );
};

export default TodoListCom;
