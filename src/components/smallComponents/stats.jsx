import "./stats.css";

export default function Stats({ Stat, Description, Number }) {
  return (
    <div className="player-popup-stat">
      <div>
        <span>{Stat}</span>
        <small>{Description}</small>
      </div>

      <strong>{Number}</strong>
      <div
        className={`stat-bars ${
          Number <= 25
            ? "bad"
            : Number <= 50
              ? "poor"
              : Number  <= 65
                ? "average"
                : Number <= 80
                  ? "good"
                  : "excellent"
        }`}
      >
        <div
          className={
            Number >= 25 ? "stat-bar active" : "stat-bar"
          }
        />
        <div
          className={
            Number >= 50 ? "stat-bar active" : "stat-bar"
          }
        />
        <div
          className={
            Number >= 65 ? "stat-bar active" : "stat-bar"
          }
        />
        <div
          className={
            Number >= 80 ? "stat-bar active" : "stat-bar"
          }
        />
        <div
          className={
            Number >= 95 ? "stat-bar active" : "stat-bar"
          }
        />
      </div>
    </div>
  );
}
