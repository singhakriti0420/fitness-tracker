import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";
import Activity from "./src/models/Activity.js";
import Workout from "./src/models/Workout.js";
import MatchStats from "./src/models/MatchStats.js";
import connectDB from "./src/config/db.js";

dotenv.config();
await connectDB();

const sampleUsers = [
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    age: 25,
    position: "Striker",
    height: 180,
    weight: 75,
    fitnessLevel: "Advanced",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    age: 22,
    position: "Midfielder",
    height: 165,
    weight: 60,
    fitnessLevel: "Intermediate",
  },
];

const sampleActivities = [
  {
    user: null, // Will be set after user creation
    date: new Date(),
    steps: 8500,
    distance: 6.2,
    calories: 320,
    trainingTime: 45,
    sprintCount: 12,
    maxSpeed: 28.5,
    acceleration: 2.1,
  },
  {
    user: null,
    date: new Date(Date.now() - 86400000), // Yesterday
    steps: 9200,
    distance: 7.1,
    calories: 380,
    trainingTime: 52,
    sprintCount: 15,
    maxSpeed: 30.2,
    acceleration: 2.4,
  },
];

const sampleWorkouts = [
  {
    user: null,
    type: "Running",
    duration: 30,
    intensity: "High",
    notes: "Interval training session",
    date: new Date(),
  },
  {
    user: null,
    type: "Gym Workout",
    duration: 45,
    intensity: "Medium",
    notes: "Strength training focus",
    date: new Date(Date.now() - 86400000),
  },
];

const sampleMatchStats = [
  {
    user: null,
    date: new Date(),
    goals: 2,
    assists: 1,
    passAccuracy: 85,
    shotsOnTarget: 5,
    tackles: 8,
    performance: {
      speed: 8,
      stamina: 7,
      strength: 8,
    },
  },
];

const seedDB = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Activity.deleteMany();
    await Workout.deleteMany();
    await MatchStats.deleteMany();

    // Create users
    const users = await User.create(sampleUsers);
    console.log("Users created:", users.length);

    // Set user IDs for related data
    sampleActivities.forEach(activity => activity.user = users[0]._id);
    sampleWorkouts.forEach(workout => workout.user = users[0]._id);
    sampleMatchStats.forEach(stats => stats.user = users[0]._id);

    // Create related data
    await Activity.create(sampleActivities);
    await Workout.create(sampleWorkouts);
    await MatchStats.create(sampleMatchStats);

    console.log("Sample data seeded successfully!");
    console.log("Login with: john@example.com / password123");

    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDB();