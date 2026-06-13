"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 1. Load Environment Configuration Variables first to ensure they are available to all subsequent imports
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// 2. Standard Framework and Middleware Imports
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
// 3. Routes Imports
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const blogRoutes_1 = __importDefault(require("./routes/blogRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
// Initialize Express Framework
const app = (0, express_1.default)();
// Connect to MongoDB Database Instances (Now securely reads the initialized process.env)
(0, db_1.default)();
// Global Middleware Configuration
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Main API Endpoints Mounting Matrix Setup
app.use("/api/auth", authRoutes_1.default);
app.use("/api/blogs", blogRoutes_1.default);
app.use("/api/upload", uploadRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default); // Secured admin endpoints layer fully operational
// Base Health Check Route
app.get("/", (req, res) => {
    res.send("Blog CMS API Running 🚀");
});
// Start Server Deployment Engine Listeners
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
