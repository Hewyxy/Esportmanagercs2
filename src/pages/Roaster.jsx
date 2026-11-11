
import CurrentRoaster from "../components/CurrentRoaster";
import React, { useEffect, useState } from "react";

export default function Roaster() {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/api/teams")
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch teams");
                return response.json();
            })
            .then(data => {
                setTeams(data);

                const initialTeam = data.find(team => team.Id === 1) || data[0];
                setSelectedTeam(initialTeam);
            })
            .catch(error => console.error("Error fetching teams:", error));
    }, []);

    return (
        <div>
            {selectedTeam && (
                <CurrentRoaster
                    teamId={selectedTeam.Id}
                    teamName={selectedTeam.Name}
                    teams={teams}
                    onTeamChange={setSelectedTeam}
                />
            )}
        </div>
    );
}

