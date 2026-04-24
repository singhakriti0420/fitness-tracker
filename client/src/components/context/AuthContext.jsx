import { createContext, useEffect, useState } from "react";
import { setAuthToken } from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("fft_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("fft_token") || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("fft_user", JSON.stringify(userData));
    localStorage.setItem("fft_token", jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("fft_user");
    localStorage.removeItem("fft_token");
    setAuthToken("");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
