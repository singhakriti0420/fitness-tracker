import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import { fetchMatchStats, fetchWorkouts } from "../services/activityService";
import Loader from "../components/common/Loader";

export default function Stats() {
  const [matchStats, setMatchStats] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [matchRes, workoutRes] = await Promise.all([fetchMatchStats(), fetchWorkouts()]);
        setMatchStats(matchRes.data);
        setWorkouts(workoutRes.data.slice(0, 5));
      } catch (err) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="page-content">
        <Navbar />
        <h2>Performance Stats</h2>
        <div className="stats-grid">
          <div className="stats-panel">
            <h3>Match Summary</h3>
            {matchStats.length === 0 ? (
              <p>No match stats available yet.</p>
            ) : (
              matchStats.map((match) => (
                <div key={match._id} className="match-card">
                  <strong>{new Date(match.date).toLocaleDateString()}</strong>
                  <p>Goals: {match.goals}</p>
                  <p>Assists: {match.assists}</p>
                  <p>Pass Acc: {match.passAccuracy}%</p>
                  <p>Shots on Target: {match.shotsOnTarget}</p>
                  <p>Tackles: {match.tackles}</p>
                  <div className="performance-row">
                    <span>Speed: {match.performance.speed}/10</span>
                    <span>Stamina: {match.performance.stamina}/10</span>
                    <span>Strength: {match.performance.strength}/10</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="stats-panel">
            <h3>Workout Log</h3>
            {workouts.length === 0 ? (
              <p>No workouts recorded yet.</p>
            ) : (
              workouts.map((item) => (
                <div key={item._id} className="workout-card">
                  <strong>{item.type}</strong>
                  <p>{new Date(item.date).toLocaleDateString()}</p>
                  <p>Duration: {item.duration} min</p>
                  <p>Intensity: {item.intensity}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
