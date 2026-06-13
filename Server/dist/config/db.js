"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    const dbUri = process.env.MONGODB_URI;
    if (!dbUri) {
        console.error("❌ Database Connection Error: MONGODB_URI is not defined in your environment variables.\n" +
            "Please check that your .env file contains MONGODB_URI and that dotenv.config() is initialized at the absolute top of your application entry point.");
        process.exit(1);
    }
    try {
        await mongoose_1.default.connect(dbUri);
        console.log("🍃 MongoDB Connected Successfully");
    }
    catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
};
exports.default = connectDB;
