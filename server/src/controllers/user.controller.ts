import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import { Todo } from "../models/todo.model";
import { TodoList } from "../models/todoList.model";
import { generateToken } from "../utils/generateTokens";
import mongoose from "mongoose";
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

    // Validate required fields
    if (!username || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Username, email, and password are required",
      });
      return;
    }

    // Validate password length
    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
      return;
    }

    // Check if user already exists
    const userExists = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (userExists) {
      res.status(400).json({
        success: false,
        message: "User with that username or email already exists",
      });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    // Generate token
    const token = generateToken(
      (savedUser._id as mongoose.Types.ObjectId).toString()
    );

    res.status(201).json({
      success: true,
      data: {
        _id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        createdAt: savedUser.createdAt,
        token,
      },
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

    // Validate required fields
    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
      return;
    }

    // Find user and include password field
    const user = await User.findOne({ username }).select("+password");

    if (!user || !user.password) {
      res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
      return;
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
      return;
    }

    // Generate token
    const token = generateToken(
      (user._id as mongoose.Types.ObjectId).toString()
    );

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        token,
      },
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
    const users = await User.find();

    // Get stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const todoListCount = await TodoList.countDocuments({
          userId: user._id,
        });
        const todoCount = await Todo.countDocuments({
          listId: {
            $in: await TodoList.find({ userId: user._id }).distinct("_id"),
          },
        });

        return {
          ...user.toObject(),
          stats: {
            todoListCount,
            todoCount,
          },
        };
      })
    );

    res.status(200).json({
      success: true,
      count: users.length,
      data: usersWithStats,
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
      return;
    }

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Get user stats
    const todoListCount = await TodoList.countDocuments({ userId: id });
    const todoLists = await TodoList.find({ userId: id });
    const todoListIds = todoLists.map((list) => list._id);
    const todoCount = await Todo.countDocuments({
      listId: { $in: todoListIds },
    });

    const userWithStats = {
      ...user.toObject(),
      stats: {
        todoListCount,
        todoCount,
      },
    };

    res.status(200).json({
      success: true,
      data: userWithStats,
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
      return;
    }

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Check for duplicate username/email if they're being updated
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username, _id: { $ne: id } });
      if (usernameExists) {
        res.status(400).json({
          success: false,
          message: "Username already exists",
        });
        return;
      }
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: id } });
      if (emailExists) {
        res.status(400).json({
          success: false,
          message: "Email already exists",
        });
        return;
      }
    }

    // Update fields
    const updateData: any = {};
    if (username !== undefined) updateData.username = username;
    if (email !== undefined) updateData.email = email;

    // Hash new password if provided
    if (password) {
      if (password.length < 6) {
        res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long",
        });
        return;
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser!._id,
        username: updatedUser!.username,
        email: updatedUser!.email,
        createdAt: updatedUser!.createdAt,
      },
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
      return;
    }

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Get user's todo lists to delete associated todos
    const todoLists = await TodoList.find({ userId: id });
    const todoListIds = todoLists.map((list) => list._id);

    // Delete all todos associated with user's lists
    const todosDeleted = await Todo.deleteMany({
      listId: { $in: todoListIds },
    });

    // Delete all todo lists associated with the user
    const todoListsDeleted = await TodoList.deleteMany({ userId: id });

    // Delete the user
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User and associated data deleted successfully",
      data: {
        deletedUser: {
          _id: user._id,
          username: user.username,
        },
        deletedTodoLists: todoListsDeleted.deletedCount,
        deletedTodos: todosDeleted.deletedCount,
      },
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
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (err) {
    console.error("Error in getUserProfile:", err);
    res.status(500).json({ message: "Server error" });
  }
};
