import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("fft_token");
    if (token) {
      // Verify token and get user data
      authService.getProfile()
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem("fft_token");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.loginUser({ email, password });
      const { token, _id, name, email: userEmail, profilePhoto, fitnessLevel } = response.data;
      const userData = { _id, name, email: userEmail, profilePhoto, fitnessLevel };
      localStorage.setItem("fft_token", token);
      setUser(userData);
      navigate("/dashboard");
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.registerUser(userData);
      const { token, _id, name, email, profilePhoto, fitnessLevel } = response.data;
      const user = { _id, name, email, profilePhoto, fitnessLevel };
      localStorage.setItem("fft_token", token);
      setUser(user);
      navigate("/dashboard");
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Registration failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("fft_token");
    setUser(null);
    navigate("/login");
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};