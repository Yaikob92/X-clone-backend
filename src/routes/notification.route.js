import express from "express";
import { protectRoute } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/get", protectRoute, getNotification);
router.delete("/:notificationId", protectRoute, deleteNotification);

export default router;
