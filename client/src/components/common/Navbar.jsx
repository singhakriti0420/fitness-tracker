import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">Football Fitness</div>
      <nav className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/tracker">Tracker</Link>
        <Link to="/map">Ground Map</Link>
        <Link to="/stats">Stats</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      <div className="navbar-right">
        {user && <span>{user.name}</span>}
        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
