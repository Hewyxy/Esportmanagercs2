import React, { useEffect, useState } from "react";
import "./PlayersLineUp.css";

export default function PlayersLineUp({ teamId }) {
  // This block shows the selected team's players.
  const [players, setPlayers] = useState([]);
  const [teamImage, setTeamImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (teamId == null) {
      setPlayers([]);
      setTeamImage(null);
      setLoading(false);
      return;
    }

    const loadPlayers = async () => {
      // Fetch the roster by team ID; if the API hiccups, show an empty list.
      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:3000/api/players/team/${encodeURIComponent(teamId)}`,
        );

        if (!response.ok) {
          throw new Error("Failed to load players");
        }

        const data = await response.json();

        setPlayers(data);
      } catch (error) {
        console.error("Error loading players:", error);
        setPlayers([]);
        setTeamImage(null);
      } finally {
        setLoading(false);
      }
    };
    loadPlayers();
  }, [teamId]);

  return (
    <div>
      <h1 className="LineUp-text">Current LineUp</h1>
      {loading ? (
        <div className="current-LineUp"> Loading roster... </div>
      ) : players.length > 0 ? (
        <div className="LineUp-container">
          {players.map((player) => (
            <div className="LineUp-Player" key={player.id}>
              <div className="LineUp-Player-image">
                <img src={player.Image} alt={player.Name} />
              </div>
              <div className="LineUp-Player-info">
                <div>
                  <h3>{player.Name}</h3>
                  <span>{player.Role}</span>
                </div>
                <strong>{player.Rating}</strong>{" "}
              </div>{" "}
            </div>
          ))}{" "}
        </div>
      ) : (
        <div className="current-roster-empty"> No players found. </div>
      )}
    </div>
  );
}
