import { useEffect, useState } from "react";
import "./playerCard.css";

export default function PlayerCard() {
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/api/players")
            .then(response => response.json())
            .then(data => {
                setPlayers(data);
            })
            .catch(error => {
                console.error("Error loading players:", error);
            });
    }, []);

    const sortedPlayers = [...players].sort(
        (a, b) => b.Firepower - a.Firepower
    );

    return (
        <div>
            {sortedPlayers.map(player => (
                <div 
                    className="PlayerCard" 
                    key={player.id} 
                    onClick={() => setSelectedPlayer(player)} 
                >
                    <div className="player-avatar-container"> 
                        <img 
                            src={player.Image} 
                            alt="Avatar" 
                            className="player-avatar" 
                        /> 
                    </div> 

                    <div className="player-info">
                        <p className="player-name">{player.Name}</p>
                        <p className="player-role">{player.Role}</p>
                    </div>

                    <img 
                        src={player.TeamImage} 
                        alt="Team" 
                        className="team-logo" 
                    /> 

                    <div className="player-rating">
                        <span>FIREPOWER</span>
                        <strong>{player.Firepower}</strong>
                    </div>
                    <div className="player-rating">
                        <span>ENTRYING</span>
                        <strong>{player.Entrying}</strong>
                    </div>
                    <div className="player-rating">
                        <span>TRADING</span>
                        <strong>{player.Trading}</strong>
                    </div>
                    <div className="player-rating">
                        <span>OPENING</span>
                        <strong>{player.Opening}</strong>
                    </div>
                    <div className="player-rating">
                        <span>UTILLITY</span>
                        <strong>{player.Utill}</strong>
                    </div>
                </div>
            ))}

            {selectedPlayer && (
                <div
                    className="popup-overlay"
                    onClick={() => setSelectedPlayer(null)}
                >
                    <div
                        className="player-popup"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="popup-close"
                            onClick={() => setSelectedPlayer(null)}
                        >
                            ×
                        </button>

                        {/* Background team logo */}
                        <img
                            src={selectedPlayer.TeamImage}
                            alt=""
                            className="popup-background-logo"
                        />

                        {/* Left side */}
                        <div className="popup-player">

                            <div className="popup-player-header">
                                <h1>{selectedPlayer.Name}</h1>
                                <span>{selectedPlayer.Role}</span>
                            </div>

                            <div className="popup-player-image-container">
                                <img
                                    src={selectedPlayer.Image}
                                    alt={selectedPlayer.Name}
                                    className="popup-player-image"
                                />
                            </div>

                            <div className="popup-team">
                                <img
                                    src={selectedPlayer.TeamImage}
                                    alt={selectedPlayer.Team}
                                />

                                <span>{selectedPlayer.Team}</span>
                            </div>

                        </div>

                        {/* Right side */}
                        <div className="popup-info">

                            <div className="popup-stats-title">
                                PLAYER STATISTICS
                            </div>

                            <div className="player-stats">

                                <div className="stat">
                                    <span>Firepower</span>
                                    <strong>{selectedPlayer.Firepower}</strong>
                                </div>

                                <div className="stat">
                                    <span>Entrying</span>
                                    <strong>{selectedPlayer.Entrying}</strong>
                                </div>

                                <div className="stat">
                                    <span>Trading</span>
                                    <strong>{selectedPlayer.Trading}</strong>
                                </div>

                                <div className="stat">
                                    <span>Opening</span>
                                    <strong>{selectedPlayer.Opening}</strong>
                                </div>

                                <div className="stat">
                                    <span>Snipping</span>
                                    <strong>{selectedPlayer.Snipping}</strong>
                                </div>

                                <div className="stat">
                                    <span>Utility</span>
                                    <strong>{selectedPlayer.Utill}</strong>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}