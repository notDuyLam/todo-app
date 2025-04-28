import mongoose, { Schema, Document, Types } from 'mongoose';

// Interface representing a TodoList document in MongoDB.
export interface ITodoList extends Document {
  title: string;
  userId: Types.ObjectId; // Reference to the User who owns this list
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema corresponding to the ITodoList interface.
const TodoListSchema: Schema<ITodoList> = new Schema({
  title: {
    type: String,
    required: [true, 'TodoList title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  // Store the ObjectId of the related User document.
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Creates a reference to the 'User' model
    required: true,
    index: true, // Index for faster lookups by user
  },
}, {
  // Automatically add `createdAt` and `updatedAt` fields
  timestamps: true
});

// Create and export the Mongoose model for the TodoList.
// Mongoose will create/use a collection named 'todolists'.
export const TodoList = mongoose.model<ITodoList>('TodoList', TodoListSchema);