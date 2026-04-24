import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import StatsCard from "../components/dashboard/StatsCard";
import ActivityChart from "../components/dashboard/ActivityChart";
import Leaderboard from "../components/dashboard/Leaderboard";
import { fetchDashboard } from "../services/activityService";
import Loader from "../components/common/Loader";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchDashboard();
        setData(response.data);
      } catch (err) {
        setError("Unable to load dashboard data");
      }
    };
    load();
  }, []);

  if (!data) return <Loader />;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="page-content">
        <Navbar />
        <section className="page-header">
          <div>
            <h1>Welcome back, {data.user.name}</h1>
            <p>Track your fitness, football stats, and weekly progress.</p>
          </div>
          <div className="badge">{data.user.position}</div>
        </section>

        <section className="summary-grid">
          <StatsCard title="Calories" value={data.summary.calories} unit=" kcal" />
          <StatsCard title="Distance" value={data.summary.distance} unit=" km" />
          <StatsCard title="Training Time" value={data.summary.trainingTime} unit=" min" />
          <StatsCard title="Fitness Level" value={data.user.fitnessLevel} unit="" />
        </section>

        <section className="main-grid">
          <div className="chart-panel">
            <ActivityChart data={data.weeklyProgress} />
          </div>
          <Leaderboard items={data.leaderboard} />
        </section>
      </div>
    </div>
  );
}
