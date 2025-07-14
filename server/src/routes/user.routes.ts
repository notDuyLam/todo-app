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
} from "../controllers/user.controller";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Protected routes - PUT SPECIFIC ROUTES FIRST
router.get("/profile", authenticateJWT, getUserProfile); // ✅ Specific route first
router.get("/", getAllUsers);
router.get("/:id", getUserById); // ✅ Dynamic route last

// Other protected routes
router.put("/:id", authenticateJWT, updateUser); // Consider adding auth
router.delete("/:id", authenticateJWT, deleteUser);

export default router;
