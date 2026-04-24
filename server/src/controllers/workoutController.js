import Workout from "../models/Workout.js";

export const startWorkout = async (req, res) => {
  const { type } = req.body;

  // End any active workouts
  await Workout.updateMany(
    { user: req.user._id, status: "active" },
    { status: "completed", endTime: new Date() }
  );

  const workout = await Workout.create({
    user: req.user._id,
    type: type || "field_training",
    status: "active",
    startTime: new Date(),
    distance: 0,
    calories: 0,
    laps: 0,
    maxSpeed: 0,
    avgSpeed: 0,
    steps: 0,
    route: [],
  });

  res.status(201).json(workout);
};

export const endWorkout = async (req, res) => {
  const { workoutId } = req.params;
  const { distance, calories, laps, maxSpeed, avgSpeed, steps, route } = req.body;

  const workout = await Workout.findByIdAndUpdate(
    workoutId,
    {
      status: "completed",
      endTime: new Date(),
      distance: parseFloat(distance) || 0,
      calories: parseFloat(calories) || 0,
      laps: parseInt(laps) || 0,
      maxSpeed: parseFloat(maxSpeed) || 0,
      avgSpeed: parseFloat(avgSpeed) || 0,
      steps: parseInt(steps) || 0,
      route: route || [],
    },
    { new: true }
  );

  res.json(workout);
};

export const getActiveWorkout = async (req, res) => {
  const workout = await Workout.findOne({
    user: req.user._id,
    status: "active",
  });

  if (workout) {
    res.json(workout);
  } else {
    res.status(404).json({ message: "No active workout" });
  }
};

export const saveWorkoutRoute = async (req, res) => {
  const { workoutId } = req.params;
  const { route } = req.body;

  const workout = await Workout.findByIdAndUpdate(
    workoutId,
    { route: route || [] },
    { new: true }
  );

  res.json(workout);
};

export const createWorkout = async (req, res) => {
  const { type, duration, intensity, notes, date } = req.body;

  const workout = await Workout.create({
    user: req.user._id,
    type,
    duration,
    intensity,
    notes,
    date: date ? new Date(date) : Date.now(),
  });

  res.status(201).json(workout);
};

export const getWorkouts = async (req, res) => {
  const workouts = await Workout.find({ user: req.user._id }).sort({ date: -1 });
  res.json(workouts);
};
