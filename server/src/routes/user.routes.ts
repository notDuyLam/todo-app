import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
  updatePassword,
} from "../controllers/user.controller";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = express.Router();

// api/users

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Protected routes - PUT SPECIFIC ROUTES FIRST
router.get("/profile", authenticateJWT, getUserProfile); //
router.put("/:id/password", authenticateJWT, updatePassword);
router.get("/", getAllUsers);
router.get("/:id", getUserById); //

// Other protected routes
router.put("/:id", authenticateJWT, updateUser);
router.delete("/:id", authenticateJWT, deleteUser);

export default router;
