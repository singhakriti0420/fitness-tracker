import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getDashboard, getMatchStats, createMatchStats } from "../controllers/statsController.js";

const router = express.Router();
router.get("/dashboard", protect, getDashboard);
router.get("/match", protect, getMatchStats);
router.post("/match", protect, createMatchStats);

export default router;
