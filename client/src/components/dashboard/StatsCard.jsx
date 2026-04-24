export default function StatsCard({ title, value, unit }) {
  return (
    <div className="stats-card">
      <div className="stats-card-title">{title}</div>
      <div className="stats-card-value">{value}{unit}</div>
    </div>
  );
}
