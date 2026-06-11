import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getMyBlogs,
} from "../controllers/blogController";

const router = express.Router();

router.post("/", createBlog);

router.get("/", getBlogs);

// IMPORTANT: put this BEFORE "/:id"
router.get(
  "/user/:userId",
  getMyBlogs
);

router.get("/:id", getBlogById);

router.put("/:id", updateBlog);

router.delete("/:id", deleteBlog);

export default router;