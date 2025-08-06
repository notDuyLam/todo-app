import { Request, Response } from "express";
import { TodoService } from "../services";

// Get all todos
export const getAllTodos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const todos = await TodoService.getAllTodos();

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

    const todos = await TodoService.getTodosByListId(listId);

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

    const todo = await TodoService.getTodoById(id);

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

    const todo = await TodoService.createTodo({ title, description, dueDate, completed, listId });

    res.status(201).json({
      success: true,
      data: todo,
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
    const { id } = req.params;
    const { title, description, dueDate, completed } = req.body;

    const updatedTodo = await TodoService.updateTodo(id, { title, description, dueDate, completed });

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

    await TodoService.deleteTodo(id);

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

    const result = await TodoService.deleteAllTodosByListId(listId);

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
