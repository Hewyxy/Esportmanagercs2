import { useEffect, useState } from "react";
import "./playerCard.css";

export default function PlayerCard({
    sortBy = "Rating",
    sortDirection = "desc"
}) {
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/api/players")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to load players");
                }

                return response.json();
            })
            .then(data => {
                setPlayers(data);
            })
            .catch(error => {
                console.error("Error loading players:", error);
            });
    }, []);

    const sortedPlayers = [...players].sort((a, b) => {
        const firstValue = a[sortBy] ?? "";
        const secondValue = b[sortBy] ?? "";

        const comparison =
            typeof firstValue === "number" &&
            typeof secondValue === "number"
                ? firstValue - secondValue
                : String(firstValue).localeCompare(String(secondValue));

        return sortDirection === "asc"
            ? comparison
            : -comparison;
    });

    return (
        <div className="player-list">

            {sortedPlayers.map((player, index) => (
                <div
                    className="PlayerCard"
                    key={player.id}
                    onClick={() => setSelectedPlayer(player)}
                >
                    {/* Rank */}
                    <div className="player-rank">
                        #{index + 1}
                    </div>

                    {/* Player image */}
                    <div className="player-avatar-container">
                        <img
                            src={player.Image}
                            alt={player.Name}
                            className="player-avatar"
                        />
                    </div>
                    
                    
                    {/* Player info */}
                    <div className="player-info">
                        <p className="player-name">
                            {player.Name}
                        </p>

                        <p className="player-role">
                            {player.Role}
                        </p>
                    </div>

                    {/* Team */}
                    <div className="player-team">
                        <img
                            src={player.TeamImage}
                            alt={player.Team}
                            className="team-logo"
                        />

                        <span>{player.Team}</span>
                    </div>

                    {/* Stats */}
                    <div className="player-stat">
                        <span>FIREPOWER</span>
                        <strong>{player.Firepower}</strong>
                    </div>

                    <div className="player-stat">
                        <span>ENTRYING</span>
                        <strong>{player.Entrying}</strong>
                    </div>

                    <div className="player-stat">
                        <span>TRADING</span>
                        <strong>{player.Trading}</strong>
                    </div>

                    <div className="player-stat">
                        <span>OPENING</span>
                        <strong>{player.Opening}</strong>
                    </div>

                    <div className="player-stat">
                        <span>UTILITY</span>
                        <strong>{player.Utill}</strong>
                    </div>

                    {/* Total rating */}
                    <div className="player-total">
                        <span>RATING</span>
                        <strong>{player.Rating}</strong>
                    </div>

                    <div className="player-arrow">
                        →
                    </div>

                    <button
                        className="player-recruit"
                        onClick={(e) => {
                            e.stopPropagation(); 
                            handleRecruit(player);
                        }}
                    >
                        Recruit
                    </button>

                </div>
            ))}


            {/* =========================
                PLAYER POPUP
            ========================= */}

            {selectedPlayer && (
                <div
                    className="player-popup-overlay"
                    onClick={() => setSelectedPlayer(null)}
                >
                    <div
                        className="player-popup"
                        onClick={e => e.stopPropagation()}
                    >

                        {/* Close */}
                        <button
                            className="player-popup-close"
                            onClick={() => setSelectedPlayer(null)}
                        >
                            ×
                        </button>

                        {/* Background logo */}
                        <img
                            src={selectedPlayer.TeamImage}
                            alt=""
                            className="player-popup-background-logo"
                        />

                        <div className="player-popup-content">

                            {/* LEFT */}
                            <div className="player-popup-left">

                                <div className="player-popup-header">
                                    <span className="player-popup-label">
                                        PLAYER PROFILE
                                    </span>

                                    <h1>
                                        {selectedPlayer.Name}
                                    </h1>

                                    <span className="player-popup-role">
                                        {selectedPlayer.Role}
                                    </span>
                                </div>

                                <div className="player-popup-image-container">
                                    <img
                                        src={selectedPlayer.Image}
                                        alt={selectedPlayer.Name}
                                        className="player-popup-image"
                                    />

                                    <div className="player-popup-rating">
                                        <span>RATING</span>
                                        <strong>
                                            {selectedPlayer.Rating}
                                        </strong>
                                    </div>
                                </div>

                                <div className="player-popup-team">

                                    <img
                                        src={selectedPlayer.TeamImage}
                                        alt={selectedPlayer.Team}
                                    />

                                    <div>
                                        <span>TEAM</span>
                                        <strong>
                                            {selectedPlayer.Team}
                                        </strong>
                                    </div>

                                </div>

                            </div>


                            {/* RIGHT */}
                            <div className="player-popup-right">

                                <div className="player-popup-stats-header">
                                    <span>PERFORMANCE</span>
                                    <h2>Player Statistics</h2>
                                </div>

                                <div className="player-popup-stats">

                                    <div className="player-popup-stat">
                                        <div>
                                            <span>Firepower</span>
                                            <small>
                                                Combat efficiency
                                            </small>
                                        </div>

                                        <strong>
                                            {selectedPlayer.Firepower}
                                        </strong>
                                    </div>

                                    <div className="player-popup-stat">
                                        <div>
                                            <span>Entrying</span>
                                            <small>
                                                Entry performance
                                            </small>
                                        </div>

                                        <strong>
                                            {selectedPlayer.Entrying}
                                        </strong>
                                    </div>

                                    <div className="player-popup-stat">
                                        <div>
                                            <span>Trading</span>
                                            <small>
                                                Trade efficiency
                                            </small>
                                        </div>

                                        <strong>
                                            {selectedPlayer.Trading}
                                        </strong>
                                    </div>

                                    <div className="player-popup-stat">
                                        <div>
                                            <span>Opening</span>
                                            <small>
                                                Opening duels
                                            </small>
                                        </div>

                                        <strong>
                                            {selectedPlayer.Opening}
                                        </strong>
                                    </div>

                                    <div className="player-popup-stat">
                                        <div>
                                            <span>Snipping</span>
                                            <small>
                                                AWP performance
                                            </small>
                                        </div>

                                        <strong>
                                            {selectedPlayer.Snipping}
                                        </strong>
                                    </div>

                                    <div className="player-popup-stat">
                                        <div>
                                            <span>Utility</span>
                                            <small>
                                                Utility usage
                                            </small>
                                        </div>

                                        <strong>
                                            {selectedPlayer.Utill}
                                        </strong>
                                    </div>

                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

