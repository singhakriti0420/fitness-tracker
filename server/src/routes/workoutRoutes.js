import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createWorkout,
  getWorkouts,
  startWorkout,
  endWorkout,
  getActiveWorkout,
  saveWorkoutRoute,
} from "../controllers/workoutController.js";

const router = express.Router();

// Traditional workout endpoints
router.post("/", protect, createWorkout);
router.get("/", protect, getWorkouts);

// Real-time tracking endpoints
router.post("/start", protect, startWorkout);
router.get("/active", protect, getActiveWorkout);
router.put("/end/:workoutId", protect, endWorkout);
router.post("/:workoutId/route", protect, saveWorkoutRoute);

export default router;
