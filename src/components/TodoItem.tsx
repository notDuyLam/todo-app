import { useState } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar as CalendarIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";

export type Todo = {
  id: number;
  text: string;
  due?: Date;
  completed: boolean;
};

type TodoItemProps = {
  todo: Todo;
  onCheck: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit?: (id: number, text: string, due?: Date, completed?: boolean) => void;
};

const TodoItem = ({ todo, onCheck, onDelete, onEdit }: TodoItemProps) => {
  const [open, setOpen] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDue, setEditDue] = useState<Date | undefined>(todo.due);
  const [editCompleted, setEditCompleted] = useState(todo.completed);

  const handleSave = () => {
    if (onEdit) {
      onEdit(todo.id, editText, editDue, editCompleted);
    }
    setOpen(false);
  };

  return (
    <Card className="mb-3 shadow-sm hover:shadow-md transition-all">
      <CardContent className="p-4 flex items-center justify-between gap-x-4">
        <div className="flex items-center gap-3 flex-1">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => onCheck(todo.id)}
            className="h-5 w-5 rounded-md"
          />
          <div
            className={`flex-1 text-lg transition-all ${
              todo.completed ? "text-gray-400 line-through" : ""
            }`}
          >
            {todo.text}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {todo.due && (
            <Badge variant="outline" className="flex gap-1 items-center">
              <CalendarIcon className="h-3 w-3" />
              <span className="text-xs">{todo.due.toLocaleDateString()}</span>
            </Badge>
          )}

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button className="edit-btn" size="sm">
                Edit
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" sideOffset={5}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Edit Task</h4>
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full"
                    id="edit-task"
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium leading-none text-sm">Due Date</h4>
                  <div className="flex items-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          size="sm"
                        >
                          <CalendarIcon className="mr-2 h-3 w-3" />
                          {editDue
                            ? editDue.toLocaleDateString()
                            : "Add due date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={editDue}
                          onSelect={setEditDue}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="completed"
                    checked={editCompleted}
                    onCheckedChange={(checked) =>
                      setEditCompleted(checked === true)
                    }
                  />
                  <label
                    htmlFor="completed"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Mark as completed
                  </label>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={() => setOpen(false)}
                    className="mr-2"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button className="bg-primary" onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(todo.id);
            }}
            className="hover:bg-red-700"
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoItem;
