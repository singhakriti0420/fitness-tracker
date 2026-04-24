import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Tracker from "../pages/Tracker";
import Stats from "../pages/Stats";
import Map from "../pages/Map";
import ProtectedRoutes from "../components/common/ProtectedRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/map" element={<Map />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
