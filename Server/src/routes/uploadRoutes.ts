import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/image",
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("BODY:", req.body);
      console.log("FILE:", req.file);

      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
        "base64"
      )}`;

      const result = await cloudinary.uploader.upload(
        base64,
        {
          folder: "blog-cms",
        }
      );

      res.status(200).json({
        imageUrl: result.secure_url,
      });
    } catch (error) {
      console.log("Upload Error:", error);

      res.status(500).json({
        message: "Upload failed",
      });
    }
  }
);

export default router;