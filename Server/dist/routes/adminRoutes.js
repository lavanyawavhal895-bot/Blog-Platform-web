"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Enforce absolute protection across all administrative pipelines
router.use(authMiddleware_1.protect);
router.use((0, authMiddleware_1.authorize)("admin"));
// Route Enforcements
router.get("/stats", adminController_1.getAdminStats); // Analytics Summary counters + Recharts payload data
router.get("/users", adminController_1.getAllUsers); // User directory lists (Supports ?search= query params)
router.patch("/user-role/:id", adminController_1.adminUpdateUserRole); // Update privilege roles dynamically
router.get("/blogs", adminController_1.adminGetAllBlogs); // Fetch every single article written globally
router.delete("/user/:id", adminController_1.adminDeleteUser); // Purge user and their data
router.delete("/blog/:id", adminController_1.adminDeleteBlog); // Force drop arbitrary content
exports.default = router;
