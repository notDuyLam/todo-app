import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/user.model'; 
import { generateToken } from '../utils/generateTokens';
import mongoose from 'mongoose';

// Helper function to handle Mongoose validation errors
const handleMongooseError = (err: any, res: Response) => {
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map(val => (val as any).message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }
  // Add other specific Mongoose error types here if needed (e.g., CastError)
  return res.status(500).json({ success: false, message: 'Server Error' });
};

/**
 * @desc Register a new user
 * @route POST /api/users/register
 * @access Public
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;
  console.log(password);

  // Basic validation (more robust validation should ideally be done with a library like Joi or express-validator)
  if (!username || !email || !password) {
    res.status(400).json({ success: false, message: 'Please enter all fields' });
    return;
  }

  try {
    // Check if user already exists (username or email unique constraints in model handle this too,
    // but explicit check can give a clearer message)
    const userExists = await User.findOne({ $or: [{ username }, { email }] });

    if (userExists) {
      res.status(400).json({ success: false, message: 'User with that username or email already exists' });
      return;
    }

    // --- Password Hashing would typically happen here ---
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (user) {
      // Generate a token for authentication
      const token = generateToken((user._id as mongoose.Types.ObjectId).toString());

      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
          token: token, // Include token in response
        },
        message: 'User registered successfully',
      });
    } else {
       // This case should ideally be caught by validation errors or DB errors
       res.status(400).json({ success: false, message: 'Invalid user data received' });
    }

  } catch (error: any) {
    console.error('Error registering user:', error); // Log the error server-side
    handleMongooseError(error, res); // Use the helper for Mongoose errors
  }
};

/**
 * @desc Get user profile
 * @route GET /api/users/:id
 * @access Private (typically requires authentication)
 */
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;

  // Validate if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ success: false, message: 'Invalid User ID format' });
      return;
  }

  try {
    // Find the user by ID. The 'select: false' on password in the model
    // means it won't be returned by default.
    const user = await User.findById(userId);

    if (user) {
      res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }

  } catch (error: any) {
    console.error('Error fetching user profile:', error); // Log the error server-side
    handleMongooseError(error, res); // Use the helper for Mongoose errors
    // res.status(500).json({ success: false, message: 'Server Error fetching user profile' }); // Generic server error
  }
};

export const getAllUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find(); // Excluding password from results
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
    } catch (error: any) {
    console.error('Error fetching all users:', error);
    handleMongooseError(error, res);
  }
};

/**
 * @desc Login user & get token
 * @route POST /api/users/login
 * @access Public
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    res.status(400).json({ success: false, message: 'Please provide username and password' });
    return;
  }

  try {
    // Find the user by email
    const user = await User.findOne({ username }).select('+password');

    // Check if user exists and password is correct
    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      // Generate token
      const token = generateToken((user._id as mongoose.Types.ObjectId).toString());

      res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
          token,
        },
        message: 'Login successful',
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error: any) {
    console.error('Error logging in user:', error);
    handleMongooseError(error, res);
  }
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  // On the server side, we don't need to do much for logout
  // Since we're using JWT tokens, we don't store session state on the server
  // The client will handle removing the token from storage
  
  // We can just send back a success response
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// --- Add other controller functions here (e.g., loginUser, updateUserProfile, deleteUser) ---
/*
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  // Logic for logging in user, comparing hashed password, generating token
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  // Logic for finding user by ID and updating their data (e.g., username, email, password)
  // Remember to handle password updates carefully (re-hashing)
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    // Logic for finding user by ID and deleting
    // Consider implications of deleting a user with associated TodoLists and Todos
};
*/

