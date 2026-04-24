import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

dotenv.config();
const app = express();
connectDB();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/workout", workoutRoutes);
app.use("/api/stats", statsRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Football Fitness Tracker API" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
