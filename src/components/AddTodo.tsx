import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { PlusCircle, CalendarIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { cn } from "../lib/utils";

type AddTodo = {
  onAddTodo: (text: string, dueDate?: Date) => void;
};

const AddTodoObject = ({ onAddTodo }: AddTodo) => {
  const [text, setText] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (text.trim() !== "") {
      onAddTodo(text, date);
      setText("");
      setDate(undefined);
    }
  };

  return (
    <Card className="w-full mb-6 shadow-sm">
      <CardContent className="p-4">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="flex space-x-3 items-center">
            <Input
              placeholder="Add a new task..."
              className="flex-1 focus:border-primary focus:ring-1 focus:ring-primary"
              type="text"
              value={text}
              onChange={handleChange}
            />
            <Button
              type="submit"
              className="transition-all active:scale-95"
              variant="default"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>

          <div className="flex items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-auto justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                  type="button"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Set due date (optional)"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {date && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-2"
                onClick={() => setDate(undefined)}
              >
                Clear
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddTodoObject;
