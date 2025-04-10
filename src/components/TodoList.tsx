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

type TodoList = {
  todos: Todo[];
  filter: string;
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

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = todos.findIndex((todo) => todo.id === active.id);
      const newIndex = todos.findIndex((todo) => todo.id === over.id);
      const newTodos = arrayMove(todos, oldIndex, newIndex);
      setTodos(newTodos);
    }
  };
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Card className="w-full shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold">Your Tasks</CardTitle>
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
                items={todos.map((todo) => todo.id)}
                strategy={verticalListSortingStrategy}
              >
                <ul className="w-full space-y-3">
                  {todos
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
                        onCheck={onToggleComplete}
                        onDelete={onDelete}
                        onEdit={onEdit}
                      />
                    ))}
                </ul>
              </SortableContext>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </DndContext>
  );
};

export default TodoListCom;
