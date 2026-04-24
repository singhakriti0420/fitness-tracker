import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function ActivityChart({ data }) {
  return (
    <div className="chart-card">
      <h3>Weekly Activity</h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="distanceColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#63a4ff" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#63a4ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="#8884d8" />
          <YAxis stroke="#8884d8" />
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="distance" name="Distance" stroke="#63a4ff" fillOpacity={1} fill="url(#distanceColor)" />
          <Area type="monotone" dataKey="calories" name="Calories" stroke="#f6d365" fillOpacity={0.6} fill="#f6d365" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
