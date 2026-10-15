import { useEffect, useState } from "react";
import "./CurrentRoaster.css";
import "./smallComponents/stats.css";
import Stats from "./smallComponents/stats.jsx";
import ConfirmationModal from "./smallComponents/confirmation.jsx";

export default function CurrentRoaster({ teamId, teamName }) {
  const [players, setPlayers] = useState([]);
  const [teamImage, setTeamImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [notification, setNotification] = useState(null);
  const [notificationHiding, setNotificationHiding] = useState(false);
  const [showFireConfirm, setShowFireConfirm] = useState(false);
  const [playerToFire, setPlayerToFire] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    if (teamId == null) {
      setPlayers([]);
      setTeamImage(null);
      setLoading(false);
      return;
    }

    const loadPlayers = async () => {
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
        setTeamImage(data[0]?.TeamImage || null);
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

  const showNotification = (message) => {
    setNotification(message);
    setNotificationHiding(false);

    setTimeout(() => {
      setNotificationHiding(true);
    }, 1700);

    setTimeout(() => {
      setNotification(null);
      setNotificationHiding(false);
    }, 2000);
  };

  const firePlayer = async (playerId) => {
    const player = players.find((player) => player.id === playerId);

    if (!player) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/players/${playerId}/team`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            teamId: 0,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fire player");
      }

      setPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player.id !== playerId),
      );

      if (selectedPlayer?.id === playerId) {
        setSelectedPlayer(null);
      }

      showNotification(`${player.Name} was fired!`);
    } catch (error) {
      console.error("Error firing player:", error);
      showNotification("Failed to fire player.");
    }
  };

  return (
    <section className="current-roster-section">
      <div className="current-roster-header">
        <div>
          <span className="current-roster-label">TEAM</span>
          <h2>Current Roster</h2>
        </div>

        {!loading && (
          <div className="current-roster-count">{players.length} Players</div>
        )}
      </div>

      {notification && (
        <div
          className={`recruit-notification ${
            notificationHiding ? "hiding" : ""
          }`}
        >
          <span className="recruit-notification-icon">✓</span>
          <span>{notification}</span>
        </div>
      )}

      <div className="current-roster-container">
        <div className="current-roster-banner">
          <div className="current-roster-team-info">
            {teamImage && (
              <img
                className="current-roster-team-logo"
                src={teamImage}
                alt={`${teamName} logo`}
              />
            )}

            <div>
              <h3>{teamName}</h3>
              <span>Active Roster</span>
            </div>
          </div>
        </div>

        {selectedPlayer && (
          <div
            className="player-popup-overlay"
            onClick={() => setSelectedPlayer(null)}
          >
            <div className="player-popup" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="player-popup-close"
                onClick={() => setSelectedPlayer(null)}
                aria-label="Close player profile"
              >
                ×
              </button>

              {selectedPlayer.TeamImage && (
                <img
                  src={selectedPlayer.TeamImage}
                  alt=""
                  className="player-popup-background-logo"
                />
              )}

              <div className="player-popup-content">
                <div className="player-popup-left">
                  <div className="player-popup-header">
                    <span className="player-popup-label">PLAYER PROFILE</span>

                    <h1>{selectedPlayer.Name}</h1>

                    <span className="player-popup-role">
                      {selectedPlayer.Role}
                    </span>
                  </div>

                  <div className="player-popup-image-container">
                    {selectedPlayer.Image && (
                      <img
                        src={selectedPlayer.Image}
                        alt={selectedPlayer.Name}
                        className="player-popup-image"
                      />
                    )}

                    <div className="player-popup-rating">
                      <span>RATING</span>
                      <strong>{selectedPlayer.Rating}</strong>
                    </div>
                  </div>

                  <div className="player-popup-team">
                    {selectedPlayer.TeamImage && (
                      <img
                        src={selectedPlayer.TeamImage}
                        alt={selectedPlayer.Team || teamName}
                      />
                    )}

                    <div>
                      <span>TEAM</span>
                      <strong>{selectedPlayer.Team || teamName}</strong>
                    </div>
                  </div>
                </div>

                <div className="player-popup-right">
                  <div className="player-popup-stats-header">
                    <span>PERFORMANCE</span>
                    <h2>Player Statistics</h2>
                  </div>

                  <div className="player-popup-stats">
                    <Stats
                      Stat="Firepower"
                      Description="Combat efficiency"
                      Number={selectedPlayer.Firepower}
                    />

                    <Stats
                      Stat="Entrying"
                      Description="Entry performance"
                      Number={selectedPlayer.Entrying}
                    />

                    <Stats
                      Stat="Trading"
                      Description="Trade efficiency"
                      Number={selectedPlayer.Trading}
                    />

                    <Stats
                      Stat="Opening"
                      Description="Opening duels"
                      Number={selectedPlayer.Opening}
                    />

                    <Stats
                      Stat="Snipping"
                      Description="AWP performance"
                      Number={selectedPlayer.Snipping}
                    />

                    <Stats
                      Stat="Utility"
                      Description="Utility usage"
                      Number={selectedPlayer.Utill}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="current-roster-grid">
          {loading ? (
            <div className="current-roster-empty">Loading roster...</div>
          ) : players.length > 0 ? (
            players.map((player) => (
              <div
                className="current-roster-player"
                key={player.id}
                onClick={() => setSelectedPlayer(player)}
              >
                {player.TeamImage && (
                  <img
                    className="current-roster-team-bg"
                    src={player.TeamImage}
                    alt=""
                  />
                )}

                <div className="current-roster-card-overlay" />

                <div className="current-roster-player-image">
                  {player.Image && <img src={player.Image} alt={player.Name} />}
                </div>

                <div className="current-roster-player-content">
                  <span className="current-roster-player-role">
                    {player.Role}
                  </span>

                  <h4>{player.Name}</h4>
                </div>

                <div className="current-roster-rating">
                  <span>RATING</span>
                  <strong>{player.Rating}</strong>
                </div>

                <button
                  type="button"
                  className="current-roster-fire"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    setPlayerToFire(player);
                    setShowFireConfirm(true);
                  }}
                >
                  Fire
                </button>

                <div className="current-roster-arrow">→</div>
              </div>
            ))
          ) : (
            <div className="current-roster-empty">
              No players found for {teamName}.
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showFireConfirm}
        title="Fire Player"
        message={
          playerToFire
            ? `Are you sure you want to fire ${playerToFire.Name}?`
            : ""
        }
        confirmText="Fire"
        cancelText="Cancel"
        danger={true}
        onConfirm={async () => {
          if (!playerToFire) return;

          await firePlayer(playerToFire.id);

          setShowFireConfirm(false);
          setPlayerToFire(null);
        }}
        onCancel={() => {
          setShowFireConfirm(false);
          setPlayerToFire(null);
        }}
      />
    </section>
  );
}
