import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { logActivity, getActivities, getWeeklySummary } from "../controllers/activityController.js";

const router = express.Router();
router.post("/", protect, logActivity);
router.get("/", protect, getActivities);
router.get("/summary", protect, getWeeklySummary);

export default router;
