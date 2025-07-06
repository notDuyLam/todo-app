import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import userRoutes from "./src/routes/user.routes";
import todoRoutes from "./src/routes/todo.routes";
import todoListRoutes from "./src/routes/todoList.routes";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json()); // Để đọc JSON body từ req.body
app.use(express.urlencoded({ extended: true })); // Để đọc form data

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("MongoDB connected");

    // Use Routes
    app.use("/api/users", userRoutes);
    app.use("/api/todo", todoRoutes);
    app.use("/api/todoList", todoListRoutes);

    app.get("/", (req, res) => {
      res.send("You have access the server");
    });

    // Start Server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
