import { useState } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar as CalendarIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "../lib/utils";

export type Todo = {
  id: number;
  text: string;
  description?: string;
  due?: Date;
  completed: boolean;
};

type TodoItemProps = {
  todo: Todo;
  isEditing: boolean;
  onCheck: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit?: (id: number, text: string, due?: Date, completed?: boolean) => void;
  setIsEditing: () => void;
};

const TodoItem = ({
  todo,
  isEditing,
  onCheck,
  onDelete,
  onEdit,
  setIsEditing,
}: TodoItemProps) => {
  const [open, setOpen] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDue, setEditDue] = useState<Date | undefined>(todo.due);
  const [editDes, setEditDes] = useState(todo.description);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    if (onEdit) {
      onEdit(todo.id, editText, editDue, todo.completed);
    }
    setOpen(false);
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-3 shadow-sm hover:shadow-md transition-all cursor-move"
    >
      <CardContent className="p-4 flex items-center justify-between gap-x-4">
        <div className="flex items-center gap-3 flex-1">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => onCheck(todo.id)}
            className="h-5 w-5 rounded-md"
          />
          <div
            className={`flex-1 text-md transition-all ${
              todo.completed ? "text-gray-400 line-through" : ""
            }`}
          >
            {todo.text}
          </div>
        </div>
        {todo.description && (
          <Badge
            variant="secondary"
            className="p-2 text-xs gap-1 items-center flex"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-file-text"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span>Note</span>
          </Badge>
        )}
        <div className="flex items-center gap-3">
          {todo.due && (
            <Badge variant="outline" className="flex gap-1 items-center">
              <CalendarIcon className="h-3 w-3" />
              <span className="text-xs">{todo.due.toLocaleDateString()}</span>
            </Badge>
          )}

          <Popover open={open} onOpenChange={setOpen}>
            {open && (
              <div className="fixed inset-0 bg-gray-400/40 backdrop-blur-sm z-40"></div>
            )}
            <PopoverTrigger asChild>
              <Button onClick={setIsEditing} className="edit-btn" size="sm">
                Edit
              </Button>
            </PopoverTrigger>
            {open && (
              <div
                className={cn(
                  "fixed inset-0 flex items-center justify-center z-50",
                  isEditing ? "cursor-default" : "cursor-move"
                )}
              >
                <div className="w-[90%] max-w-2xl p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none text-xl">
                        Edit Task
                      </h4>
                      <div className="space-y-1">
                        <label
                          htmlFor="edit-task"
                          className="text-sm font-medium text-muted-foreground"
                        >
                          Title
                        </label>
                        <Input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full"
                          id="edit-task"
                          placeholder="Enter task title"
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="edit-des"
                          className="text-sm font-medium text-muted-foreground"
                        >
                          Description
                        </label>
                        <Input
                          value={editDes}
                          onChange={(e) => setEditDes(e.target.value)}
                          className="w-full"
                          id="edit-des"
                          placeholder="Enter task description"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium leading-none text-sm">
                        Due Date
                      </h4>
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
                        checked={todo.completed}
                        onCheckedChange={() => onCheck(todo.id)}
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
                        onClick={() => {
                          setOpen(false);
                          setIsEditing();
                        }}
                        className="mr-2"
                        variant="outline"
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-primary"
                        onClick={() => {
                          handleSave();
                          setIsEditing();
                        }}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
