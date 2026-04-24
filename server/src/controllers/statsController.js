import Activity from "../models/Activity.js";
import MatchStats from "../models/MatchStats.js";
import Workout from "../models/Workout.js";
import User from "../models/User.js";

export const getDashboard = async (req, res) => {
  const activities = await Activity.find({ user: req.user._id }).sort({ date: -1 }).limit(14);
  const workouts = await Workout.find({ user: req.user._id }).sort({ date: -1 }).limit(14);
  const matchStats = await MatchStats.findOne({ user: req.user._id });
  const user = await User.findById(req.user._id);

  const totalCalories = activities.reduce((sum, item) => sum + item.calories, 0);
  const totalDistance = activities.reduce((sum, item) => sum + item.distance, 0);
  const totalTime = activities.reduce((sum, item) => sum + item.trainingTime, 0);
  const weeklyProgress = activities
    .slice(0, 7)
    .reverse()
    .map((item) => ({
      date: item.date.toISOString().slice(0, 10),
      calories: item.calories,
      distance: item.distance,
      trainingTime: item.trainingTime,
    }));

  const leaderboard = [
    { name: "Mason", score: 96 },
    { name: "Leo", score: 92 },
    { name: user.name, score: 89 },
    { name: "Jordan", score: 85 },
  ];

  res.json({
    user: { name: user.name, position: user.position, fitnessLevel: user.fitnessLevel },
    summary: {
      calories: totalCalories,
      distance: Number(totalDistance.toFixed(1)),
      trainingTime: totalTime,
    },
    weeklyProgress,
    recentWorkouts: workouts.slice(0, 4),
    leaderboard,
    matchStats,
  });
};

export const getMatchStats = async (req, res) => {
  const matchStats = await MatchStats.find({ user: req.user._id }).sort({ date: -1 }).limit(5);
  res.json(matchStats);
};

export const createMatchStats = async (req, res) => {
  const { goals, assists, passAccuracy, shotsOnTarget, tackles, performance } = req.body;

  const matchStats = await MatchStats.create({
    user: req.user._id,
    goals,
    assists,
    passAccuracy,
    shotsOnTarget,
    tackles,
    performance,
  });

  res.status(201).json(matchStats);
};
