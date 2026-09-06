import { useEffect, useState } from "react";
import "./teamCard.css";

export default function Teams() {
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [openTeam, setOpenTeam] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/api/teams")
            .then(response => response.json())
            .then(data => setTeams(data));

        fetch("http://localhost:3000/api/players")
            .then(response => response.json())
            .then(data => setPlayers(data));
    }, []);

    const sortedTeams = [...teams].sort(
        (a, b) => b.Points - a.Points
    );

    const toggleTeam = (teamId) => {
        setOpenTeam(openTeam === teamId ? null : teamId);
    };

    return (
        <div className="teams-list">

            {sortedTeams.map((team, index) => {

                const teamPlayers = players.filter(
                    player => player.Team === team.Name
                );

                const isOpen = openTeam === team.Id;

                return (
                    <div
                        key={team.Id}
                        className={`team-wrapper ${isOpen ? "open" : ""}`}
                    >

                        {/* TEAM CARD */}
                        <div
                            className="team-card"
                            onClick={() => toggleTeam(team.Id)}
                        >
                            <span className="team-rank">
                                #{index + 1}
                            </span>

                            <img
                                src={team.Logo}
                                alt={team.Name}
                                className="team-logo"
                            />

                            <h3>{team.Name}</h3>

                            <p>{team.Points} pts</p>

                            <span className="team-arrow">
                                {isOpen ? "▲" : "▼"}
                            </span>
                        </div>


                        {/* ROSTER */}
                        <div className={`team-roster ${isOpen ? "show" : ""}`}>
                            <div className="roster-inner">

                                <h4>ROSTER</h4>

                                {teamPlayers.map(player => (
                                    <div
                                        className="roster-player"
                                        key={player.id}
                                    >

                                        <img
                                            src={player.Image}
                                            alt={player.Name}
                                            className="roster-avatar"
                                        />

                                        <span className="roster-name">
                                            {player.Name}
                                        </span>

                                        <span className="roster-role">
                                            {player.Role}
                                        </span>

                                        <span className="roster-rating">
                                            {player.Rating}
                                        </span>

                                    </div>
                                ))}

                            </div>
                        </div>

                    </div>
                );
            })}

        </div>
    );
}