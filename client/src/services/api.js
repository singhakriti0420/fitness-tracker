import axios from "axios";

const rawApiUrl = import.meta.env.VITE_API_URL || "https://fitness-tracker-server-s3dh.onrender.com/api";
const normalizedApiUrl = rawApiUrl.endsWith("/api")
  ? rawApiUrl
  : rawApiUrl.replace(/\/$/, "") + "/api";

const api = axios.create({
  baseURL: normalizedApiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("fft_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("fft_token");
      localStorage.removeItem("fft_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export default api;
