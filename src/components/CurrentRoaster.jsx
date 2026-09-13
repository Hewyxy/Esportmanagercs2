
import React, { useEffect, useState } from "react";
import "./CurrentRoaster.css";

export default function CurrentRoaster({ teamName }) {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!teamName) {
            setPlayers([]);
            setLoading(false);
            return;
        }

        const loadPlayers = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `http://localhost:3000/api/players/sameteam/${encodeURIComponent(teamName)}`
                );

                if (!response.ok) {
                    throw new Error("Failed to load players");
                }

                const data = await response.json();

                setPlayers(data);
            } catch (error) {
                console.error("Error loading players:", error);
                setPlayers([]);
            } finally {
                setLoading(false);
            }
        };

        loadPlayers();
    }, [teamName]);

    return (
        <section className="current-roster-section">

            <div className="current-roster-header">
                <div>
                    <span className="current-roster-label">TEAM</span>
                    <h2>Current Roster</h2>
                </div>

                {!loading && (
                    <div className="current-roster-count">
                        {players.length} Players
                    </div>
                )}
            </div>

            <div className="current-roster-container">

                <div className="current-roster-banner">
                    <div>
                        <h3>{teamName}</h3>
                        <span>Active Roster</span>
                    </div>
                </div>

                <div className="current-roster-grid">

                    {loading ? (
                        <div className="current-roster-empty">
                            Loading roster...
                        </div>

                    ) : players.length > 0 ? (

                        players.map((player) => (
                            <div
                                className="current-roster-player"
                                key={player.id}
                            >
                                {/* Team logo background */}
                                {player.TeamImage && (
                                    <img
                                        className="current-roster-team-bg"
                                        src={player.TeamImage}
                                        alt=""
                                    />
                                )}

                                <div className="current-roster-card-overlay" />

                                {/* Player image */}
                                <div className="current-roster-player-image">
                                    {player.Image && (
                                        <img
                                            src={player.Image}
                                            alt={player.Name}
                                        />
                                    )}
                                </div>

                                {/* Player information */}
                                <div className="current-roster-player-content">
                                    <span className="current-roster-player-role">
                                        {player.Role}
                                    </span>

                                    <h4>{player.Name}</h4>
                                </div>

                                {/* Rating */}
                                <div className="current-roster-rating">
                                    <span>RATING</span>
                                    <strong>{player.Rating}</strong>
                                </div>

                                <div className="current-roster-arrow">
                                    →
                                </div>
                            </div>
                        ))

                    ) : (

                        <div className="current-roster-empty">
                            No players found for {teamName}.
                        </div>
                    )}

                </div>
            </div>
        </section>
    );
}
