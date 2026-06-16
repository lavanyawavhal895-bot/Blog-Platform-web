// 1. Load Environment Configuration Variables first to ensure they are available to all subsequent imports
import dotenv from "dotenv";
dotenv.config();

// 2. Standard Framework and Middleware Imports
import express, { Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db";
// 3. Routes Imports
import authRoutes from "./routes/authRoutes";
import blogRoutes from "./routes/blogRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import adminRoutes from "./routes/adminRoutes";
import profileRoutes from "./routes/profileRoutes";
import userRoutes from "./routes/userRoutes";

// Initialize Express Framework
const app = express();

// Connect to MongoDB Database Instances (Now securely reads the initialized process.env)
connectDB();

// Global Middleware Configuration
app.use(cors());
app.use(express.json());

// Main API Endpoints Mounting Matrix Setup
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes); // Secured admin endpoints layer fully operational
app.use("/api/profile", profileRoutes);
app.use("/api/users", userRoutes);

// Base Health Check Route
app.get("/", (req: Request, res: Response) => {
  res.send("Blog CMS API Running 🚀");
});

// Start Server Deployment Engine Listeners
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});