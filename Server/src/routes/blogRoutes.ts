import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getMyBlogs,
   getBlogsByAuthor,
} from "../controllers/blogController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Public Routes - anyone can browse blogs or read a single post
router.get("/", getBlogs);
router.get("/author/:authorId", getBlogsByAuthor);
router.get("/:id", getBlogById);

// Protected Routes - requires a user to be logged in with a valid Bearer token
router.post("/", protect, createBlog);
router.get("/user/:userId", protect, getMyBlogs);
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);

export default router;