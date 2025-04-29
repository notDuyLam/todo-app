import { Request, Response } from "express";
import { Todo } from '../models/todo.model';
import { TodoList } from '../models/todoList.model';
import mongoose from "mongoose";

// Create a new todo list
export const createTodoList = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId,  title } = req.body;
        
        const newTodoList = new TodoList({
            title,
            userId,
        });
        
        const savedTodoList = await newTodoList.save();
        
        res.status(201).json({
            success: true,
            data: savedTodoList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create todo list',
            error: (error as Error).message
        });
    }
};



// TODO: Rewrite the function cause AI assume the database wrong

// Get all todo lists
export const getAllTodoLists = async (req: Request, res: Response): Promise<void> => {
    try {
        const todoLists = await TodoList.find().populate('todos');
        
        res.status(200).json({
            success: true,
            count: todoLists.length,
            data: todoLists
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch todo lists',
            error: (error as Error).message
        });
    }
};

// Get a single todo list by ID
export const getTodoListById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid todo list ID'
            });
            return;
        }
        
        const todoList = await TodoList.findById(id).populate('todos');
        
        if (!todoList) {
            res.status(404).json({
                success: false,
                message: 'Todo list not found'
            });
            return;
        }
        
        res.status(200).json({
            success: true,
            data: todoList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch todo list',
            error: (error as Error).message
        });
    }
};

// Update a todo list
export const updateTodoList = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid todo list ID'
            });
            return;
        }
        
        const updatedTodoList = await TodoList.findByIdAndUpdate(
            id,
            { title, description },
            { new: true, runValidators: true }
        ).populate('todos');
        
        if (!updatedTodoList) {
            res.status(404).json({
                success: false,
                message: 'Todo list not found'
            });
            return;
        }
        
        res.status(200).json({
            success: true,
            data: updatedTodoList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update todo list',
            error: (error as Error).message
        });
    }
};

// Delete a todo list
export const deleteTodoList = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid todo list ID'
            });
            return;
        }
        
        const deletedTodoList = await TodoList.findByIdAndDelete(id);
        
        if (!deletedTodoList) {
            res.status(404).json({
                success: false,
                message: 'Todo list not found'
            });
            return;
        }
        
        // Also delete all todos associated with this list
        // Call deleteTodo function here

        res.status(200).json({
            success: true,
            message: 'Todo list deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete todo list',
            error: (error as Error).message
        });
    }
};

