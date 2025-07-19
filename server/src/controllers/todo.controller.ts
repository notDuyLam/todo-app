import { Request, Response } from "express";
import { Todo } from "../models/todo.model";
import { TodoList } from "../models/todoList.model";
import mongoose from "mongoose";

// Get all todos
export const getAllTodos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const todos = await Todo.find().populate("listId", "title");

    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch todos",
      error: (error as Error).message,
    });
  }
};

// Get todos by list ID
export const getTodosByListId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { listId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(listId)) {
      res.status(400).json({
        success: false,
        message: "Invalid list ID",
      });
      return;
    }

    // Check if the todo list exists
    const todoList = await TodoList.findById(listId);
    if (!todoList) {
      res.status(404).json({
        success: false,
        message: "Todo list not found",
      });
      return;
    }

    const todos = await Todo.find({ listId }).populate("listId", "title");

    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch todos",
      error: (error as Error).message,
    });
  }
};

// Get a single todo by ID
export const getTodoById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid todo ID",
      });
      return;
    }

    const todo = await Todo.findById(id).populate("listId", "title");

    if (!todo) {
      res.status(404).json({
        success: false,
        message: "Todo not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch todo",
      error: (error as Error).message,
    });
  }
};

// Create a new todo
export const createTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, dueDate, completed, listId } = req.body;

    // Validate required fields
    if (!title || !listId) {
      res.status(400).json({
        success: false,
        message: "Title and listId are required",
      });
      return;
    }

    // Validate listId
    if (!mongoose.Types.ObjectId.isValid(listId)) {
      res.status(400).json({
        success: false,
        message: "Invalid list ID",
      });
      return;
    }

    // Check if the todo list exists
    const todoList = await TodoList.findById(listId);
    if (!todoList) {
      res.status(404).json({
        success: false,
        message: "Todo list not found",
      });
      return;
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

    res.status(201).json({
      success: true,
      data: populatedTodo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create todo",
      error: (error as Error).message,
    });
  }
};

// Update a todo
export const updateTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("Request params:", req.params);
    console.log("Request body:", req.body);

    const { id } = req.params;
    const { title, description, dueDate, completed } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid todo ID",
      });
      return;
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (dueDate !== undefined)
      updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (completed !== undefined) updateData.completed = completed;

    const updatedTodo = await Todo.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("listId", "title");

    if (!updatedTodo) {
      res.status(404).json({
        success: false,
        message: "Todo not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: updatedTodo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update todo",
      error: (error as Error).message,
    });
  }
};

// Delete a todo
export const deleteTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid todo ID",
      });
      return;
    }

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      res.status(404).json({
        success: false,
        message: "Todo not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete todo",
      error: (error as Error).message,
    });
  }
};

// Delete all todos by list ID
export const deleteAllTodosByListId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { listId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(listId)) {
      res.status(400).json({
        success: false,
        message: "Invalid list ID",
      });
      return;
    }

    const result = await Todo.deleteMany({ listId });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} todos deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete todos",
      error: (error as Error).message,
    });
  }
};
