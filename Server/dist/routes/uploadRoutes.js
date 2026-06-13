"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
router.post("/image", upload.single("image"), async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded",
            });
        }
        const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
        const result = await cloudinary_1.default.uploader.upload(base64, {
            folder: "blog-cms",
        });
        res.status(200).json({
            imageUrl: result.secure_url,
        });
    }
    catch (error) {
        console.log("Upload Error:", error);
        res.status(500).json({
            message: "Upload failed",
        });
    }
});
exports.default = router;
