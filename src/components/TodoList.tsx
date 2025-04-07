import TodoItem from "./TodoItem";
import { Todo } from "./TodoItem";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

type TodoList = {
  todos: Todo[];
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (
    id: number,
    newText: string,
    dueDate?: Date,
    isComplete?: boolean
  ) => void;
};

const TodoListCom = ({
  todos,
  onToggleComplete,
  onDelete,
  onEdit,
}: TodoList) => {
  return (
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
            <ul className="w-full space-y-3">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onCheck={onToggleComplete}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TodoListCom;
