import api from "./api";

export const startWorkout = (workoutData) => api.post("/workout/start", workoutData);
export const endWorkout = (workoutId, finalData) => api.put(`/workout/end/${workoutId}`, finalData);
export const getActiveWorkout = () => api.get("/workout/active");
export const getWorkoutHistory = () => api.get("/workout/history");
export const saveWorkoutRoute = (workoutId, route) => api.post(`/workout/${workoutId}/route`, { route });

export default {
  startWorkout,
  endWorkout,
  getActiveWorkout,
  getWorkoutHistory,
  saveWorkoutRoute,
};
