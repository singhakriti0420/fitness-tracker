import mongoose from "mongoose";

const matchStatsSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    goals: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
    passAccuracy: { type: Number, default: 70 },
    shotsOnTarget: { type: Number, default: 0 },
    tackles: { type: Number, default: 0 },
    performance: {
      speed: { type: Number, default: 5 },
      stamina: { type: Number, default: 5 },
      strength: { type: Number, default: 5 },
    },
  },
  { timestamps: true }
);

const MatchStats = mongoose.model("MatchStats", matchStatsSchema);
export default MatchStats;
