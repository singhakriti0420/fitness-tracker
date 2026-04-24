import api from "./api";

export const loginUser = (payload) => api.post("/auth/login", payload);
export const registerUser = (payload) => api.post("/auth/register", payload);
export const getProfile = () => api.get("/auth/profile");

export default {
  loginUser,
  registerUser,
  getProfile
};
