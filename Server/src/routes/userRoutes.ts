import express from "express";
import { getPublicProfile } from "../controllers/userController";

const router = express.Router();

router.get("/:id", getPublicProfile);

export default router;