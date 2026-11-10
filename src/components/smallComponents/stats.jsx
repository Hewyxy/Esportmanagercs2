import "./stats.css";

export default function Stats({ Stat, Description, Number: statValue }) {
  const parsedValue = globalThis.Number.isFinite(statValue) ? statValue : globalThis.Number.parseFloat(statValue);
  const score = globalThis.Number.isFinite(parsedValue) ? Math.max(0, Math.min(100, parsedValue)) : null;
  const tone = score === null ? "" : score <= 25 ? "bad" : score <= 50 ? "poor" : score <= 65 ? "average" : score <= 80 ? "good" : "excellent";

  return (
    <div className="player-popup-stat">
      <div>
        <span>{Stat}</span>
        <small>{Description}</small>
      </div>

      <strong>{score === null ? "—" : Math.round(score)}</strong>
      {score !== null && score > 0 && (
        <div className={`stat-bars ${tone}`} role="img" aria-label={`${Math.round(score)} out of 100`}>
          {[20, 40, 60, 80, 100].map((threshold) => (
            <div key={threshold} className={`stat-bar${score >= threshold ? " active" : ""}`} />
          ))}
        </div>
      )}
    </div>
  );
}
