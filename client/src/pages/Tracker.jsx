import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import { fetchWeeklySummary, logActivity, fetchActivities } from "../services/activityService";
import Loader from "../components/common/Loader";

export default function Tracker() {
  const [activity, setActivity] = useState({ steps: 0, distance: 0, calories: 0, trainingTime: 0, sprintCount: 0, maxSpeed: 0, acceleration: 0 });
  const [errors, setErrors] = useState({});
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const summary = await fetchWeeklySummary();
        setHistory(summary.data);
      } catch (err) {
        setMessage("Unable to load tracker history");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (activity.distance < 0) newErrors.distance = "Distance cannot be negative";
    if (activity.calories < 0) newErrors.calories = "Calories cannot be negative";
    if (activity.trainingTime < 0) newErrors.trainingTime = "Training time cannot be negative";
    if (activity.steps < 0) newErrors.steps = "Steps cannot be negative";
    if (activity.sprintCount < 0) newErrors.sprintCount = "Sprint count cannot be negative";
    if (activity.maxSpeed < 0) newErrors.maxSpeed = "Max speed cannot be negative";
    if (activity.acceleration < 0) newErrors.acceleration = "Acceleration cannot be negative";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const numValue = Number(value);
    setActivity((prev) => ({ ...prev, [name]: numValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    if (!validateForm()) return;
    setSubmitting(true);

    try {
      await logActivity(activity);
      setMessage("Activity saved successfully.");
      // Reset form
      setActivity({ steps: 0, distance: 0, calories: 0, trainingTime: 0, sprintCount: 0, maxSpeed: 0, acceleration: 0 });
    } catch (err) {
      setMessage("Unable to save activity.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="page-content">
        <Navbar />
        <section className="tracker-grid">
          <div className="tracker-form-card">
            <h2>Daily Activity</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Steps</label>
                <input name="steps" type="number" value={activity.steps} onChange={handleChange} min="0" />
                {errors.steps && <p className="input-error">{errors.steps}</p>}
              </div>
              <div>
                <label>Distance (km)</label>
                <input name="distance" type="number" step="0.1" value={activity.distance} onChange={handleChange} min="0" />
                {errors.distance && <p className="input-error">{errors.distance}</p>}
              </div>
              <div>
                <label>Calories</label>
                <input name="calories" type="number" value={activity.calories} onChange={handleChange} min="0" />
                {errors.calories && <p className="input-error">{errors.calories}</p>}
              </div>
              <div>
                <label>Training Time (min)</label>
                <input name="trainingTime" type="number" value={activity.trainingTime} onChange={handleChange} min="0" />
                {errors.trainingTime && <p className="input-error">{errors.trainingTime}</p>}
              </div>
              <div>
                <label>Sprint Count</label>
                <input name="sprintCount" type="number" value={activity.sprintCount} onChange={handleChange} min="0" />
                {errors.sprintCount && <p className="input-error">{errors.sprintCount}</p>}
              </div>
              <div>
                <label>Max Speed (km/h)</label>
                <input name="maxSpeed" type="number" step="0.1" value={activity.maxSpeed} onChange={handleChange} min="0" />
                {errors.maxSpeed && <p className="input-error">{errors.maxSpeed}</p>}
              </div>
              <div>
                <label>Acceleration</label>
                <input name="acceleration" type="number" step="0.1" value={activity.acceleration} onChange={handleChange} min="0" />
                {errors.acceleration && <p className="input-error">{errors.acceleration}</p>}
              </div>
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save Activity"}
              </button>
              {message && (
                <p className={message.includes("successfully") ? "success-message" : "error-message"}>
                  {message}
                </p>
              )}
            </form>
          </div>
          <div className="map-card">
            <h2>Route Simulation</h2>
            <div className="map-mock">
              <span>Start</span>
              <div className="map-line" />
              <span>End</span>
            </div>
            <p>Simulated route preview for field runs and speed work.</p>
          </div>
        </section>

        <section className="history-card">
          <h3>Weekly Progress</h3>
          <div className="history-list">
            {history.map((item) => (
              <div key={item.date} className="history-item">
                <strong>{item.date}</strong>
                <span>{item.distance} km</span>
                <span>{item.calories} kcal</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
