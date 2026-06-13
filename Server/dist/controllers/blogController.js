"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.getBlogById = exports.getMyBlogs = exports.getBlogs = exports.createBlog = void 0;
const Blog_1 = __importDefault(require("../models/Blog"));
const createBlog = async (req, res) => {
    try {
        const { title, content, image, backgroundColor, textColor, fontStyle, } = req.body;
        const blog = await Blog_1.default.create({
            title,
            content,
            image,
            backgroundColor,
            textColor,
            fontStyle,
            author: req.user?.id,
        });
        res.status(201).json(blog);
    }
    catch (error) {
        console.log("Create Blog Error:", error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};
exports.createBlog = createBlog;
// Get All Blogs
const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog_1.default.find()
            .populate("author", "username")
            .sort({ createdAt: -1 });
        res.json(blogs);
    }
    catch (error) {
        console.log("Get Blogs Error:", error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};
exports.getBlogs = getBlogs;
// Get My Blogs
const getMyBlogs = async (req, res) => {
    try {
        const blogs = await Blog_1.default.find({
            author: req.params.userId,
        })
            .populate("author", "username")
            .sort({ createdAt: -1 });
        res.status(200).json(blogs);
    }
    catch (error) {
        console.log("Get My Blogs Error:", error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};
exports.getMyBlogs = getMyBlogs;
// Get Single Blog By ID
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog_1.default.findById(req.params.id).populate("author", "username");
        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
            });
        }
        res.status(200).json(blog);
    }
    catch (error) {
        console.log("Get Blog Error:", error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};
exports.getBlogById = getBlogById;
// Update Blog
const updateBlog = async (req, res) => {
    try {
        const blog = await Blog_1.default.findById(req.params.id);
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
            fontStyle: req.body.fontStyle !== undefined ? req.body.fontStyle : blog.fontStyle,
        });
        await blog.save();
        res.status(200).json(blog);
    }
    catch (error) {
        console.log("Update Blog Error:", error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};
exports.updateBlog = updateBlog;
// Delete Blog
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog_1.default.findById(req.params.id);
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
    }
    catch (error) {
        console.log("Delete Blog Error:", error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};
exports.deleteBlog = deleteBlog;
