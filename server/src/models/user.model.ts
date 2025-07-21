import mongoose, { Schema, Document } from "mongoose";

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
const UserSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // Exclude password from query results by default
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    // Add timestamps: true in the schema options if you want Mongoose
    // to automatically manage createdAt and updatedAt
  },
  { timestamps: false }
); // Set timestamps: true here if needed

// Cascade delete middleware - automatically delete related data when user is deleted
UserSchema.pre("findOneAndDelete", async function () {
  const userId = this.getQuery()["_id"];

  if (userId) {
    // Import models here to avoid circular dependency
    const { TodoList } = await import("./todoList.model");
    const { Todo } = await import("./todo.model");

    // Get user's todo lists
    const todoLists = await TodoList.find({ userId });
    const todoListIds = todoLists.map((list) => list._id);

    // Delete all todos associated with user's lists
    await Todo.deleteMany({ listId: { $in: todoListIds } });

    // Delete all todo lists associated with the user
    await TodoList.deleteMany({ userId });

    console.log(
      `Cascade delete: Removed ${todoLists.length} lists and associated todos for user ${userId}`
    );
  }
});

// Also handle deletion by ID directly
UserSchema.pre("deleteOne", async function () {
  const userId = this.getQuery()["_id"];

  if (userId) {
    // Import models here to avoid circular dependency
    const { TodoList } = await import("./todoList.model");
    const { Todo } = await import("./todo.model");

    // Get user's todo lists
    const todoLists = await TodoList.find({ userId });
    const todoListIds = todoLists.map((list) => list._id);

    // Delete all todos associated with user's lists
    await Todo.deleteMany({ listId: { $in: todoListIds } });

    // Delete all todo lists associated with the user
    await TodoList.deleteMany({ userId });

    console.log(
      `Cascade delete: Removed ${todoLists.length} lists and associated todos for user ${userId}`
    );
  }
});

// Create and export the Mongoose model for the User.
// Mongoose will create/use a collection named 'users'.
export const User = mongoose.model<IUser>("User", UserSchema);
