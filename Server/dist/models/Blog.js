"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const blogSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    image: {
        type: String,
        default: "",
    },
    backgroundColor: {
        type: String,
        default: "#0B0B0B",
    },
    textColor: {
        type: String,
        default: "#FFFFFF",
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Blog", blogSchema);
