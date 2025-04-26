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
  onAddTodo: (text: string, dueDate?: Date, description?: string) => void;
};

const AddTodoObject = ({ onAddTodo }: AddTodo) => {
  const [text, setText] = useState("");
  const [des, setDes] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [addDesOpen, setAddDesOpen] = useState(false);

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDes(e.target.value);
  };

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (text.trim() !== "") {
      onAddTodo(text, date, des);
      setText("");
      setDes("");
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
              onChange={handleChangeTitle}
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
          <div className="flex items-center">
            <Popover open={addDesOpen} onOpenChange={setAddDesOpen}>
              <PopoverTrigger asChild>
                <Button>Add description</Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="w-full space-y-2">
                  <h1 className="font-bold">Description</h1>
                  <Input
                    placeholder="Add description"
                    className="flex-1 focus:border-primary focus:ring-1 focus:ring-primary"
                    type="text"
                    value={des}
                    onChange={handleChangeDescription}
                  />
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setAddDesOpen(false)}
                      className="hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        setAddDesOpen(false);
                      }}
                      className="transition-all hover:shadow-md"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddTodoObject;
