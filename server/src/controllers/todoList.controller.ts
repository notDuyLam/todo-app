import { Request, Response } from "express";
import { TodoListService } from "../services";

// Create a new todo list
export const createTodoList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, category, title } = req.body;

    const todoList = await TodoListService.createTodoList({ userId, category, title });

    res.status(201).json({
      success: true,
      data: todoList,
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
    const todoLists = await TodoListService.getAllTodoLists();

    res.status(200).json({
      success: true,
      count: todoLists.length,
      data: todoLists,
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

    const todoLists = await TodoListService.getTodoListsByUserId(userId);

    res.status(200).json({
      success: true,
      count: todoLists.length,
      data: todoLists,
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

    const todoList = await TodoListService.getTodoListById(id);

    res.status(200).json({
      success: true,
      data: todoList,
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

    const updatedTodoList = await TodoListService.updateTodoList(id, { title });

    res.status(200).json({
      success: true,
      data: updatedTodoList,
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

    const result = await TodoListService.deleteTodoList(id);

    res.status(200).json({
      success: true,
      message: "Todo list deleted successfully",
      deletedTodosCount: result.deletedTodosCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete todo list",
      error: (error as Error).message,
    });
  }
};
