import { Request, Response } from "express";
import { Todo } from "../models/todo.model";
import { TodoList } from "../models/todoList.model";
import { User } from "../models/user.model";
import mongoose from "mongoose";

// Create a new todo list
export const createTodoList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, category, title } = req.body;

    // Validate required fields
    if (!title || !userId) {
      res.status(400).json({
        success: false,
        message: "Title and userId are required",
      });
      return;
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
      return;
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
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

    res.status(201).json({
      success: true,
      data: populatedTodoList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create todo list",
      error: (error as Error).message,
    });
  }
};

// Get all todo lists
export const getAllTodoLists = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
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

    res.status(200).json({
      success: true,
      count: todoLists.length,
      data: todoListsWithCounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch todo lists",
      error: (error as Error).message,
    });
  }
};

// Get todo lists by user ID
export const getTodoListsByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
      return;
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
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

    res.status(200).json({
      success: true,
      count: todoLists.length,
      data: todoListsWithCounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch todo lists",
      error: (error as Error).message,
    });
  }
};

// Get a single todo list by ID
export const getTodoListById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid todo list ID",
      });
      return;
    }

    const todoList = await TodoList.findById(id).populate(
      "userId",
      "username email"
    );

    if (!todoList) {
      res.status(404).json({
        success: false,
        message: "Todo list not found",
      });
      return;
    }

    // Get todos for this list
    const todos = await Todo.find({ listId: id });
    const todoCount = todos.length;

    const response = {
      ...todoList.toObject(),
      todos,
      todoCount,
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch todo list",
      error: (error as Error).message,
    });
  }
};

// Update a todo list
export const updateTodoList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid todo list ID",
      });
      return;
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;

    const updatedTodoList = await TodoList.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("userId", "username email");

    if (!updatedTodoList) {
      res.status(404).json({
        success: false,
        message: "Todo list not found",
      });
      return;
    }

    // Get todos count for the list
    const todoCount = await Todo.countDocuments({ listId: id });

    const response = {
      ...updatedTodoList.toObject(),
      todoCount,
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update todo list",
      error: (error as Error).message,
    });
  }
};

// Delete a todo list
export const deleteTodoList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid todo list ID",
      });
      return;
    }

    const deletedTodoList = await TodoList.findByIdAndDelete(id);

    if (!deletedTodoList) {
      res.status(404).json({
        success: false,
        message: "Todo list not found",
      });
      return;
    }

    // Delete all todos associated with this list
    const deleteResult = await Todo.deleteMany({ listId: id });

    res.status(200).json({
      success: true,
      message: "Todo list deleted successfully",
      deletedTodosCount: deleteResult.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete todo list",
      error: (error as Error).message,
    });
  }
};
