import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import userRoutes from './src/routes/user.routes'; // Import route vừa tạo
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json()); // Để đọc JSON body từ req.body


// Connect MongoDB
mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('✅ MongoDB connected');

    // Use Routes
    app.use('/api/users', userRoutes);

    // Start Server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });