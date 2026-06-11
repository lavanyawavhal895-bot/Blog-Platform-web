import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";

import authRoutes from "./routes/authRoutes";
import blogRoutes from "./routes/blogRoutes";
import uploadRoutes from "./routes/uploadRoutes";

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("Blog CMS API Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});