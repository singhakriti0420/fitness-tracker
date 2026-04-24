import api from "./api";

export const fetchDashboard = () => api.get("/stats/dashboard");
export const fetchActivities = () => api.get("/activity");
export const fetchWeeklySummary = () => api.get("/activity/summary");
export const logActivity = (payload) => api.post("/activity", payload);
export const fetchMatchStats = () => api.get("/stats/match");
export const fetchWorkouts = () => api.get("/workout");
export const createWorkout = (payload) => api.post("/workout", payload);
export const updateProfile = (payload) => api.put("/user/profile", payload);
