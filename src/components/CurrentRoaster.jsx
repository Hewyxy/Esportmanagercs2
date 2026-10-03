import React, { useEffect, useState } from "react";
import "./CurrentRoaster.css";
import ConfirmationModal from "./smallComponents/confirmation.jsx";

export default function CurrentRoaster({ teamId, teamName }) {
    // View the roster here and send a player to free agency.
    const [players, setPlayers] = useState([]);
    const [teamImage, setTeamImage] = useState(null);
    const [loading, setLoading] = useState(true);

    const [notification, setNotification] = useState(null);
    const [notificationHiding, setNotificationHiding] = useState(false);
    const [showFireConfirm, setShowFireConfirm] = useState(false);
    const [playerToFire, setPlayerToFire] = useState(null);

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
                    `http://localhost:3000/api/players/team/${encodeURIComponent(teamId)}`
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


    /* =========================
       NOTIFICATION
    ========================= */

    const showNotification = (message) => {
        // The notification pops up, then disappears on its own.
        setNotification(null);
        setNotificationHiding(false);

        setTimeout(() => {
            setNotification(message);
        }, 10);

        setTimeout(() => {
            setNotificationHiding(true);
        }, 1710);

        setTimeout(() => {
            setNotification(null);
            setNotificationHiding(false);
        }, 2010);
    };


    /* =========================
       FIRE PLAYER
    ========================= */

    const firePlayer = async (playerId) => {
        // Release the player on the server and remove them from the list.

        const player = players.find(
            player => player.id === playerId
        );

        if (!player) return;

        try {

            const response = await fetch(
                `http://localhost:3000/api/players/${playerId}/team`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        teamId: 0
                    })
                }
            );


            if (!response.ok) {
                throw new Error("Failed to fire player");
            }


            /* =========================
               REMOVE FROM ROSTER
            ========================= */

            setPlayers(prevPlayers =>
                prevPlayers.filter(
                    player => player.id !== playerId
                )
            );


            /* =========================
               NOTIFICATION
            ========================= */

            showNotification(
                `${player.Name} was fired!`
            );


        } catch (error) {

            console.error(
                "Error firing player:",
                error
            );

            showNotification(
                "Failed to fire player."
            );
        }
    };


    return (
        <section className="current-roster-section">

            {/* =========================
                HEADER
            ========================= */}

            <div className="current-roster-header">

                <div>
                    <span className="current-roster-label">
                        TEAM
                    </span>

                    <h2>
                        Current Roster
                    </h2>
                </div>


                {!loading && (
                    <div className="current-roster-count">
                        {players.length} Players
                    </div>
                )}

            </div>


            {/* =========================
                NOTIFICATION
            ========================= */}

            {notification && (
                <div
                    className={`recruit-notification ${notificationHiding
                        ? "hiding"
                        : ""
                        }`}
                >
                    <span className="recruit-notification-icon">
                        ✓
                    </span>

                    <span>
                        {notification}
                    </span>
                </div>
            )}


            <div className="current-roster-container">

                {/* =========================
                    TEAM BANNER
                ========================= */}

                <div className="current-roster-banner">

                    <div className="current-roster-team-info">

                        {teamImage && (
                            <img
                                className="current-roster-team-logo"
                                src="https://www.hltv.org/dynamic-svg/teamplaceholder"
                                alt={`${teamName} logo`}
                            />
                        )}

                        <div>
                            <h3>
                                {teamName}
                            </h3>

                            <span>
                                Active Roster
                            </span>
                        </div>

                    </div>

                </div>


                {/* =========================
                    PLAYERS
                ========================= */}

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
                                        src="https://www.hltv.org/dynamic-svg/teamplaceholder"
                                        alt=""
                                    />
                                )}


                                {/* Overlay */}

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

                                    <h4>
                                        {player.Name}
                                    </h4>

                                </div>


                                {/* Rating */}

                                <div className="current-roster-rating">

                                    <span>
                                        RATING
                                    </span>

                                    <strong>
                                        {player.Rating}
                                    </strong>

                                </div>


                                {/* Fire */}

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


                                {/* Arrow */}

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
