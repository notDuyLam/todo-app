import mongoose, { Schema, Document } from 'mongoose';

// Interface representing a User document in MongoDB.
export interface IUser extends Document {
  username: string;
  password?: string; // Often excluded from default queries or handled separately
  email: string;
  createdAt: Date;
  // Note: Relationships are typically handled via references ('ref')
  // and querying rather than embedding arrays of IDs directly in the User model.
}

// Mongoose Schema corresponding to the IUser interface.
const UserSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false, // Exclude password from query results by default
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Add timestamps: true in the schema options if you want Mongoose
  // to automatically manage createdAt and updatedAt
}, { timestamps: false }); // Set timestamps: true here if needed


// Create and export the Mongoose model for the User.
// Mongoose will create/use a collection named 'users'.
export const User = mongoose.model<IUser>('User', UserSchema);