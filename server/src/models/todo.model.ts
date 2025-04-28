import mongoose, { Schema, Document, Types } from 'mongoose';

// Interface representing a Todo document in MongoDB.
export interface ITodo extends Document {
  title: string;
  description?: string;
  dueDate?: Date;
  completed: boolean;
  listId: Types.ObjectId; // Reference to the TodoList this todo belongs to
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema corresponding to the ITodo interface.
const TodoSchema: Schema<ITodo> = new Schema({
  title: {
    type: String,
    required: [true, 'Todo title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    trim: true,
    default: null,
     maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  dueDate: {
    type: Date,
    default: null,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  // Store the ObjectId of the related TodoList document.
  listId: {
    type: Schema.Types.ObjectId,
    ref: 'TodoList', // Creates a reference to the 'TodoList' model
    required: true,
    index: true, // Index for faster lookups by list
  },
}, {
  // Automatically add `createdAt` and `updatedAt` fields
  timestamps: true
});

// Create and export the Mongoose model for the Todo.
// Mongoose will create/use a collection named 'todos'.
export const Todo = mongoose.model<ITodo>('Todo', TodoSchema);