import mongoose from "mongoose";

const workoutSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["Running", "Sprint Drill", "Gym Workout", "field_training"],
      default: "Running",
    },
    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      default: "active",
    },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    duration: { type: Number, default: 0 },
    distance: { type: Number, default: 0 },
    calories: { type: Number, default: 0 },
    steps: { type: Number, default: 0 },
    laps: { type: Number, default: 0 },
    speed: { type: Number, default: 0 },
    maxSpeed: { type: Number, default: 0 },
    avgSpeed: { type: Number, default: 0 },
    intensity: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    notes: { type: String, default: "" },
    route: [
      {
        lat: Number,
        lng: Number,
        time: Number,
      },
    ],
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Workout = mongoose.model("Workout", workoutSchema);
export default Workout;
