import express from "express";
import { protectRoute } from "../middleware/auth.middleware";

const router = express.Router();

// public routes
router.get("/post/:postId", getComment);

// protected routes

router.post("/post/:postId", protectRoute, createComment);
router.postt("/post/:commentId", protectRoute, deleteComment);

export default router;
