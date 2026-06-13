import { Request, Response } from "express";
import Blog from "../models/Blog";

// Custom interface to extend Express Request with user authentication middleware data
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string; // Added role parameter type definition mapping
    [key: string]: any;
  };
}

export const createBlog = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const {
      title,
      content,
      image,
      backgroundColor,
      textColor,
      fontStyle,
    } = req.body;

    const blog = await Blog.create({
      title,
      content,
      image,
      backgroundColor,
      textColor,
      fontStyle,
      author: req.user?.id,
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
export const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (error) {
    console.log("Get Blogs Error:", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get My Blogs
export const getMyBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find({
      author: req.params.userId,
    })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    console.log("Get My Blogs Error:", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get Single Blog By ID
export const getBlogById = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "username");

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
export const updateBlog = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    // Comprehensive Admin & Owner Bypass Check
    const isOwner = req.user && blog.author.toString() === req.user.id;
    const isAdmin = req.user && req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You do not have permission to edit this blog",
      });
    }

    // Assign properties safely, keeping old values if fields are missing in payload
    Object.assign(blog, {
      title: req.body.title !== undefined ? req.body.title : blog.title,
      content: req.body.content !== undefined ? req.body.content : blog.content,
      image: req.body.image !== undefined ? req.body.image : blog.image,
      backgroundColor: req.body.backgroundColor !== undefined ? req.body.backgroundColor : blog.backgroundColor,
      textColor: req.body.textColor !== undefined ? req.body.textColor : blog.textColor,
      fontStyle: req.body.fontStyle !== undefined ? req.body.fontStyle : (blog as any).fontStyle,
    });

    await blog.save();
    res.status(200).json(blog);
  } catch (error) {
    console.log("Update Blog Error:", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Delete Blog
export const deleteBlog = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    // Comprehensive Admin & Owner Bypass Check
    const isOwner = req.user && blog.author.toString() === req.user.id;
    const isAdmin = req.user && req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You do not have permission to delete this blog",
      });
    }

    await blog.deleteOne();

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