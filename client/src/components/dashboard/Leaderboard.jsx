export default function Leaderboard({ items }) {
  return (
    <div className="leaderboard-card">
      <h3>Leaderboard</h3>
      <ol>
        {items.map((player, index) => (
          <li key={index}>
            <span>{player.name}</span>
            <strong>{player.score}</strong>
          </li>
        ))}
      </ol>
    </div>
  );
}
