import express from "express";
import {
  getProfile,
  updateProfile,
  getPublicProfile,
} from "../controllers/profileController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Logged-in user profile
router.get("/", protect, getProfile);

// Update own profile
router.put("/", protect, updateProfile);

// Public profile (for viewing blog author profiles)
router.get("/user/:id", getPublicProfile);

export default router;