import { Todo } from "../models/todo.model";
import { TodoList } from "../models/todoList.model";
import { User } from "../models/user.model";
import mongoose from "mongoose";

export interface TodoListCreateData {
  userId: string;
  category?: string;
  title: string;
}

export interface TodoListUpdateData {
  title?: string;
}

export interface TodoListWithCounts {
  _id: mongoose.Types.ObjectId;
  title: string;
  category?: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  todoCount: number;
  completedTodos?: number;
}

export interface TodoListWithTodos {
  _id: mongoose.Types.ObjectId;
  title: string;
  category?: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  todos: any[];
  todoCount: number;
}

export class TodoListService {
  /**
   * Create a new todo list
   */
  static async createTodoList(data: TodoListCreateData) {
    const { userId, category, title } = data;

    // Validate required fields
    if (!title || !userId) {
      throw new Error("Title and userId are required");
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const newTodoList = new TodoList({
      title,
      category,
      userId,
    });

    const savedTodoList = await newTodoList.save();
    const populatedTodoList = await TodoList.findById(
      savedTodoList._id
    ).populate("userId", "username email");

    return populatedTodoList;
  }

  /**
   * Get all todo lists with counts
   */
  static async getAllTodoLists(): Promise<TodoListWithCounts[]> {
    const todoLists = await TodoList.find().populate(
      "userId",
      "username email"
    );

    // Get todos count for each list
    const todoListsWithCounts = await Promise.all(
      todoLists.map(async (list) => {
        const todoCount = await Todo.countDocuments({ listId: list._id });
        return {
          ...list.toObject(),
          todoCount,
        };
      })
    );

    return todoListsWithCounts;
  }

  /**
   * Get todo lists by user ID with counts
   */
  static async getTodoListsByUserId(userId: string): Promise<TodoListWithCounts[]> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const todoLists = await TodoList.find({ userId }).populate(
      "userId",
      "username email"
    );

    // Get todos count for each list
    const todoListsWithCounts = await Promise.all(
      todoLists.map(async (list) => {
        const todoCount = await Todo.countDocuments({ listId: list._id });
        const completedTodos = await Todo.countDocuments({
          listId: list._id,
          completed: true,
        });
        return {
          ...list.toObject(),
          todoCount,
          completedTodos,
        };
      })
    );

    return todoListsWithCounts;
  }

  /**
   * Get a single todo list by ID with todos
   */
  static async getTodoListById(id: string): Promise<TodoListWithTodos> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid todo list ID");
    }

    const todoList = await TodoList.findById(id).populate(
      "userId",
      "username email"
    );

    if (!todoList) {
      throw new Error("Todo list not found");
    }

    // Get todos for this list
    const todos = await Todo.find({ listId: id });
    const todoCount = todos.length;

    return {
      ...todoList.toObject(),
      todos,
      todoCount,
    };
  }

  /**
   * Update a todo list
   */
  static async updateTodoList(id: string, data: TodoListUpdateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid todo list ID");
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;

    const updatedTodoList = await TodoList.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("userId", "username email");

    if (!updatedTodoList) {
      throw new Error("Todo list not found");
    }

    // Get todos count for the list
    const todoCount = await Todo.countDocuments({ listId: id });

    return {
      ...updatedTodoList.toObject(),
      todoCount,
    };
  }

  /**
   * Delete a todo list and its todos
   */
  static async deleteTodoList(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid todo list ID");
    }

    const deletedTodoList = await TodoList.findByIdAndDelete(id);

    if (!deletedTodoList) {
      throw new Error("Todo list not found");
    }

    // Delete all todos associated with this list
    const deleteResult = await Todo.deleteMany({ listId: id });

    return {
      deletedTodoList,
      deletedTodosCount: deleteResult.deletedCount,
    };
  }
} 