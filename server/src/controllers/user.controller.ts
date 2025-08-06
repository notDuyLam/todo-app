import { Request, Response } from "express";
import { UserService } from "../services";
import { AuthRequest } from "../middleware/authMiddleware";

/**
 * @desc Register a new user
 * @route POST /api/users/register
 * @access Public
 */
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const userData = await UserService.registerUser({ username, email, password });

    res.status(201).json({
      success: true,
      data: userData,
      message: "User registered successfully",
    });
  } catch (error) {
    // Handle duplicate key errors
    if ((error as any).code === 11000) {
      const field = Object.keys((error as any).keyValue)[0];
      res.status(400).json({
        success: false,
        message: `${field} already exists`,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: (error as Error).message,
    });
  }
};

/**
 * @desc Login user & get token
 * @route POST /api/users/login
 * @access Public
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const userData = await UserService.loginUser({ username, password });

    res.status(200).json({
      success: true,
      data: userData,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to login user",
      error: (error as Error).message,
    });
  }
};

/**
 * @desc Logout user
 * @route POST /api/users/logout
 * @access Public
 */
export const logoutUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  // For JWT tokens, logout is handled client-side by removing the token
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

/**
 * @desc Get all users
 * @route GET /api/users
 * @access Private (Admin)
 */
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await UserService.getAllUsers();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: (error as Error).message,
    });
  }
};

/**
 * @desc Get user profile by ID
 * @route GET /api/users/:id
 * @access Private
 */
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await UserService.getUserById(id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: (error as Error).message,
    });
  }
};

/**
 * @desc Update user profile
 * @route PUT /api/users/:id
 * @access Private
 */
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;

    const updatedUser = await UserService.updateUser(id, { username, email, password });

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: (error as Error).message,
    });
  }
};

/**
 * @desc Delete user account
 * @route DELETE /api/users/:id
 * @access Private
 */
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await UserService.deleteUser(id);

    res.status(200).json({
      success: true,
      message: "User and associated data deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: (error as Error).message,
    });
  }
};

export const getUserProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const userProfile = await UserService.getUserProfile(userId);

    res.status(200).json({
      success: true,
      data: userProfile,
    });
  } catch (err) {
    console.error("Error in getUserProfile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Update user password
 * @route PUT /api/users/:id/password
 * @access Private
 */
export const updatePassword = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.params.id;

    await UserService.updatePassword(userId, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("Error in updatePassword:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
