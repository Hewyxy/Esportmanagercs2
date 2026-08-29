import { useEffect, useState } from "react";
import "./playerCard.css";

export default function PlayerCard(){
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/api/players")
            .then(response => response.json())
            .then(data => {
                setPlayers(data);
            });
    }, []);

    return (
        <div>
            {players.map(player => (
                <div className="PlayerCard" key={player.id}>
                <div className="player-avatar-container">
                    <img
                        src={player.image}
                        alt="Avatar"
                        className="player-avatar"
                    />
                </div>

                <p>{player.name}</p>

                <img
                    src={player.teamImage}
                    alt="Team"
                    className="team-logo"
                />

                <p>Rating: {player.rating}</p>
            </div>
        ))}
        </div>
        
    )
}
/*
export default function PlayerCard() {
    return (
        <div className="PlayerCard">
            <div className="player-avatar-container">
                <img
                    src="https://img-cdn.hltv.org/playerbodyshot/Z1p6r4ccCtZVGSyrYhI55u.png?ixlib=java-2.1.0&w=400&s=2b339fae86806e62359925ab6e03a6db"
                    alt="Avatar"
                    className="player-avatar"
                />
            </div>

            <p>Nickname</p>

            <img
                src="https://img-cdn.hltv.org/teamlogo/ywdn4tmAvXfllLeV2SkkvF.png?ixlib=java-2.1.0&w=100&s=e441b77b1cafbca20ba9f667caca56f4"
                alt="Team"
                className="team-logo"
            />

            <p>Rating: 0.00</p>
        </div>
    );
}
*/