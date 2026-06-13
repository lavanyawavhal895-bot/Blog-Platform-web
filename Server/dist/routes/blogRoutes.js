"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blogController_1 = require("../controllers/blogController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Public Routes - anyone can browse blogs or read a single post
router.get("/", blogController_1.getBlogs);
router.get("/:id", blogController_1.getBlogById);
// Protected Routes - requires a user to be logged in with a valid Bearer token
router.post("/", authMiddleware_1.protect, blogController_1.createBlog);
router.get("/user/:userId", authMiddleware_1.protect, blogController_1.getMyBlogs);
router.put("/:id", authMiddleware_1.protect, blogController_1.updateBlog);
router.delete("/:id", authMiddleware_1.protect, blogController_1.deleteBlog);
exports.default = router;
