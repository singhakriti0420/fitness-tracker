import Activity from "../models/Activity.js";
import { suggestWorkout } from "../utils/suggestions.js";

export const logActivity = async (req, res) => {
  const {
    date,
    steps = 0,
    distance = 0,
    calories = 0,
    trainingTime = 0,
    sprintCount = 0,
    maxSpeed = 0,
    acceleration = 0,
    route = [],
  } = req.body;

  const activityDate = date ? new Date(date) : new Date();
  activityDate.setHours(0, 0, 0, 0);

  const activity = await Activity.findOneAndUpdate(
    { user: req.user._id, date: activityDate },
    {
      user: req.user._id,
      date: activityDate,
      steps,
      distance,
      calories,
      trainingTime,
      sprintCount,
      maxSpeed,
      acceleration,
      route,
    },
    { upsert: true, new: true }
  );

  const weekly = await Activity.find({ user: req.user._id }).sort({ date: -1 }).limit(7);
  const averageDistance = weekly.reduce((sum, item) => sum + item.distance, 0) / Math.max(weekly.length, 1);

  res.status(201).json({
    activity,
    suggestion: suggestWorkout(distance, averageDistance),
  });
};

export const getActivities = async (req, res) => {
  const activities = await Activity.find({ user: req.user._id }).sort({ date: -1 }).limit(30);
  res.json(activities);
};

export const getWeeklySummary = async (req, res) => {
  const activities = await Activity.find({ user: req.user._id }).sort({ date: -1 }).limit(7);
  const summary = activities.map((item) => ({
    date: item.date.toISOString().slice(0, 10),
    steps: item.steps,
    distance: item.distance,
    calories: item.calories,
    trainingTime: item.trainingTime,
  }));
  res.json(summary.reverse());
};
