import { Todo } from "../models/todo.model";
import { TodoList } from "../models/todoList.model";
import mongoose from "mongoose";

export interface TodoCreateData {
  title: string;
  description?: string;
  dueDate?: string;
  completed?: boolean;
  listId: string;
}

export interface TodoUpdateData {
  title?: string;
  description?: string;
  dueDate?: string;
  completed?: boolean;
}

export class TodoService {
  /**
   * Get all todos
   */
  static async getAllTodos() {
    const todos = await Todo.find().populate("listId", "title");
    return todos;
  }

  /**
   * Get todos by list ID
   */
  static async getTodosByListId(listId: string) {
    if (!mongoose.Types.ObjectId.isValid(listId)) {
      throw new Error("Invalid list ID");
    }

    // Check if the todo list exists
    const todoList = await TodoList.findById(listId);
    if (!todoList) {
      throw new Error("Todo list not found");
    }

    const todos = await Todo.find({ listId }).populate("listId", "title");
    return todos;
  }

  /**
   * Get a single todo by ID
   */
  static async getTodoById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid todo ID");
    }

    const todo = await Todo.findById(id).populate("listId", "title");

    if (!todo) {
      throw new Error("Todo not found");
    }

    return todo;
  }

  /**
   * Create a new todo
   */
  static async createTodo(data: TodoCreateData) {
    const { title, description, dueDate, completed, listId } = data;

    // Validate required fields
    if (!title || !listId) {
      throw new Error("Title and listId are required");
    }

    // Validate listId
    if (!mongoose.Types.ObjectId.isValid(listId)) {
      throw new Error("Invalid list ID");
    }

    // Check if the todo list exists
    const todoList = await TodoList.findById(listId);
    if (!todoList) {
      throw new Error("Todo list not found");
    }

    const newTodo = new Todo({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      completed: completed || false,
      listId,
    });

    const savedTodo = await newTodo.save();
    const populatedTodo = await Todo.findById(savedTodo._id).populate(
      "listId",
      "title"
    );

    return populatedTodo;
  }

  /**
   * Update a todo
   */
  static async updateTodo(id: string, data: TodoUpdateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid todo ID");
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.dueDate !== undefined)
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    if (data.completed !== undefined) updateData.completed = data.completed;

    const updatedTodo = await Todo.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("listId", "title");

    if (!updatedTodo) {
      throw new Error("Todo not found");
    }

    return updatedTodo;
  }

  /**
   * Delete a todo
   */
  static async deleteTodo(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid todo ID");
    }

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      throw new Error("Todo not found");
    }

    return deletedTodo;
  }

  /**
   * Delete all todos by list ID
   */
  static async deleteAllTodosByListId(listId: string) {
    if (!mongoose.Types.ObjectId.isValid(listId)) {
      throw new Error("Invalid list ID");
    }

    const result = await Todo.deleteMany({ listId });
    return result;
  }
} 