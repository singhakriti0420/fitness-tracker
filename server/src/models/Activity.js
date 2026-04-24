import mongoose from "mongoose";

const activitySchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    steps: { type: Number, default: 0 },
    distance: { type: Number, default: 0 },
    calories: { type: Number, default: 0 },
    trainingTime: { type: Number, default: 0 },
    sprintCount: { type: Number, default: 0 },
    maxSpeed: { type: Number, default: 0 },
    acceleration: { type: Number, default: 0 },
    route: { type: [Object], default: [] },
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", activitySchema);
export default Activity;
