import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import { updateProfile } from "../services/activityService";
import useAuth from "../hooks/useAuth";
import Loader from "../components/common/Loader";

export default function Profile() {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState(user || {});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setProfile(user || {});
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await updateProfile(profile);
      login(response.data, localStorage.getItem("fft_token"));
      setMessage("Profile updated successfully");
    } catch (err) {
      setMessage("Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <Loader />;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="page-content">
        <Navbar />
        <div className="form-panel">
          <h2>Profile</h2>
          <form onSubmit={handleSubmit} className="profile-form">
            <label>Name</label>
            <input name="name" value={profile.name || ""} onChange={handleChange} required />
            <label>Age</label>
            <input name="age" type="number" value={profile.age || 0} onChange={handleChange} required />
            <label>Position</label>
            <select name="position" value={profile.position || "Midfielder"} onChange={handleChange}>
              <option>Striker</option>
              <option>Midfielder</option>
              <option>Defender</option>
            </select>
            <label>Height (cm)</label>
            <input name="height" type="number" value={profile.height || 0} onChange={handleChange} required />
            <label>Weight (kg)</label>
            <input name="weight" type="number" value={profile.weight || 0} onChange={handleChange} required />
            <label>Fitness Level</label>
            <input name="fitnessLevel" value={profile.fitnessLevel || ""} onChange={handleChange} />
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Update Profile"}
            </button>
            {message && <p className="success-message">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
