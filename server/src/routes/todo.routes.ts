import express from "express";
import {
  getAllTodos,
  getTodosByListId,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  deleteAllTodosByListId,
} from "../controllers/todo.controller";

const router = express.Router();
router.get("/", getAllTodos);
router.get("/:id", getTodoById);
router.get("/:listId", getTodosByListId);
router.post("/", createTodo);
router.put("/", updateTodo);
router.delete("/:id", deleteTodo);
router.delete("/:listId", deleteAllTodosByListId);
