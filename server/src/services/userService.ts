import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import { Todo } from "../models/todo.model";
import { TodoList } from "../models/todoList.model";
import { generateToken } from "../utils/generateTokens";
import mongoose from "mongoose";

export interface UserRegistrationData {
  username: string;
  email: string;
  password: string;
}

export interface UserLoginData {
  username: string;
  password: string;
}

export interface UserUpdateData {
  username?: string;
  email?: string;
  password?: string;
}

export interface UserStats {
  todoListCount: number;
  todoCount: number;
}

export interface UserWithStats {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  createdAt: Date;
  stats: UserStats;
}

export interface UserProfileData {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  createdAt: Date;
  todoListCount: number;
  totalTodos: number;
  completedTodos: number;
}

export class UserService {
  /**
   * Register a new user
   */
  static async registerUser(data: UserRegistrationData) {
    const { username, email, password } = data;

    // Validate required fields
    if (!username || !email || !password) {
      throw new Error("Username, email, and password are required");
    }

    // Validate password length
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    // Check if user already exists
    const userExists = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (userExists) {
      throw new Error("User with that username or email already exists");
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

    return {
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      createdAt: savedUser.createdAt,
      token,
    };
  }

  /**
   * Login user and get token
   */
  static async loginUser(data: UserLoginData) {
    const { username, password } = data;

    // Validate required fields
    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    // Find user and include password field
    const user = await User.findOne({ username }).select("+password");

    if (!user || !user.password) {
      throw new Error("Invalid username or password");
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid username or password");
    }

    // Generate token
    const token = generateToken(
      (user._id as mongoose.Types.ObjectId).toString()
    );

    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      token,
    };
  }

  /**
   * Get all users with stats
   */
  static async getAllUsers(): Promise<UserWithStats[]> {
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

    return usersWithStats;
  }

  /**
   * Get user by ID with stats
   */
  static async getUserById(id: string): Promise<UserWithStats> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid user ID");
    }

    const user = await User.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    // Get user stats
    const todoListCount = await TodoList.countDocuments({ userId: id });
    const todoLists = await TodoList.find({ userId: id });
    const todoListIds = todoLists.map((list) => list._id);
    const todoCount = await Todo.countDocuments({
      listId: { $in: todoListIds },
    });

    return {
      ...user.toObject(),
      stats: {
        todoListCount,
        todoCount,
      },
    };
  }

  /**
   * Update user
   */
  static async updateUser(id: string, data: UserUpdateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid user ID");
    }

    const user = await User.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    // Check for duplicate username/email if they're being updated
    if (data.username && data.username !== user.username) {
      const usernameExists = await User.findOne({ 
        username: data.username, 
        _id: { $ne: id } 
      });
      if (usernameExists) {
        throw new Error("Username already exists");
      }
    }

    if (data.email && data.email !== user.email) {
      const emailExists = await User.findOne({ 
        email: data.email, 
        _id: { $ne: id } 
      });
      if (emailExists) {
        throw new Error("Email already exists");
      }
    }

    // Update fields
    const updateData: any = {};
    if (data.username !== undefined) updateData.username = data.username;
    if (data.email !== undefined) updateData.email = data.email;

    // Hash new password if provided
    if (data.password) {
      if (data.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(data.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw new Error("Failed to update user");
    }

    return {
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
    };
  }

  /**
   * Delete user and associated data
   */
  static async deleteUser(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid user ID");
    }

    const user = await User.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    // Get counts before deletion for response
    const todoLists = await TodoList.find({ userId: id });
    const todoListIds = todoLists.map((list) => list._id);
    const todoCount = await Todo.countDocuments({
      listId: { $in: todoListIds },
    });

    // Delete the user - cascade delete middleware will handle related data
    await User.findByIdAndDelete(id);

    return {
      deletedUser: {
        _id: user._id,
        username: user.username,
      },
      deletedTodoLists: todoLists.length,
      deletedTodos: todoCount,
    };
  }

  /**
   * Get user profile with stats
   */
  static async getUserProfile(userId: string): Promise<UserProfileData> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    // Get user stats
    const todoListCount = await TodoList.countDocuments({ userId });
    const todoLists = await TodoList.find({ userId });
    const todoListIds = todoLists.map((list) => list._id);
    const totalTodos = await Todo.countDocuments({
      listId: { $in: todoListIds },
    });
    const completedTodos = await Todo.countDocuments({
      listId: { $in: todoListIds },
      completed: true,
    });

    return {
      ...user.toObject(),
      todoListCount,
      totalTodos,
      completedTodos,
    };
  }

  /**
   * Update user password
   */
  static async updatePassword(userId: string, currentPassword: string, newPassword: string) {
    // Validate required fields
    if (!currentPassword || !newPassword) {
      throw new Error("Current password and new password are required");
    }

    // Validate new password length
    if (newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters long");
    }

    // Check if user exists and explicitly select password field
    const user = await User.findById(userId).select("+password");

    if (!user || !user.password) {
      throw new Error("User not found");
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });
  }
} 