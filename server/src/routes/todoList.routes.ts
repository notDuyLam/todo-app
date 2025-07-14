import express from "express";
import {
  createTodoList,
  getAllTodoLists,
  getTodoListsByUserId,
  getTodoListById,
  updateTodoList,
  deleteTodoList,
} from "../controllers/todoList.controller";

const router = express.Router();

router.post("/", createTodoList);
router.get("/", getAllTodoLists);
router.get("/user/:userId", getTodoListsByUserId);
router.get("/id", getTodoListById);
router.put("/", updateTodoList);
router.delete("/", deleteTodoList);

export default router;
