import express from "express";
import {
  getAllUsers,
  getAdminStats,
  adminUpdateUserRole,
  adminGetAllBlogs,
  adminDeleteUser,
  adminDeleteBlog,
} from "../controllers/adminController";
import { protect, authorize } from "../middleware/authMiddleware";

const router = express.Router();

// Enforce absolute protection across all administrative pipelines
router.use(protect);
router.use(authorize("admin"));

// Route Enforcements
router.get("/stats", getAdminStats);                // Analytics Summary counters + Recharts payload data
router.get("/users", getAllUsers);                  // User directory lists (Supports ?search= query params)
router.patch("/user-role/:id", adminUpdateUserRole); // Update privilege roles dynamically
router.get("/blogs", adminGetAllBlogs);              // Fetch every single article written globally
router.delete("/user/:id", adminDeleteUser);        // Purge user and their data
router.delete("/blog/:id", adminDeleteBlog);        // Force drop arbitrary content

export default router; 