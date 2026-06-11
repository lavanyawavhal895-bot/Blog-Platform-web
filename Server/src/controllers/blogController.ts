import { Request, Response } from "express";
import Blog from "../models/Blog";

// Create Blog
export const createBlog = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      title,
      content,
      image,
      backgroundColor,
      textColor,
      author,
    } = req.body;

    const blog = await Blog.create({
      title,
      content,
      image,
      backgroundColor,
      textColor,
      author,
    });

    res.status(201).json(blog);
  } catch (error) {
    console.log("Create Blog Error:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get All Blogs
export const getBlogs = async (
  req: Request,
  res: Response
) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    console.log("Get Blogs Error:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get My Blogs
export const getMyBlogs = async (
  req: Request,
  res: Response
) => {
  try {
    const blogs = await Blog.find({
      author: req.params.userId,
    })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    console.log("getMyBlogs Error:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get Single Blog
export const getBlogById = async (
  req: Request,
  res: Response
) => {
  try {
    const blog = await Blog.findById(
      req.params.id
    ).populate("author", "username");

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.log("Get Blog Error:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Update Blog
export const updateBlog = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      title,
      content,
      image,
      backgroundColor,
      textColor,
    } = req.body;

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        image,
        backgroundColor,
        textColor,
      },
      {
        new: true,
      }
    ).populate("author", "username");

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.log("Update Blog Error:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Delete Blog
export const deleteBlog = async (
  req: Request,
  res: Response
) => {
  try {
    const blog = await Blog.findByIdAndDelete(
      req.params.id
    );

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.status(200).json({
      message: "Blog Deleted Successfully",
    });
  } catch (error) {
    console.log("Delete Blog Error:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};