import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">FIT FOOTBALL</div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/tracker">Tracker</NavLink>
        <NavLink to="/map">Ground Map</NavLink>
        <NavLink to="/stats">Stats</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </nav>
    </aside>
  );
}
