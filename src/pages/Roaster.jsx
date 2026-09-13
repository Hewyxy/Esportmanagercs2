
import CurrentRoaster from "../components/CurrentRoaster";
import React, { useEffect, useState } from "react";

export default function Roaster() {

    const [team, setTeam] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/api/teams/1")
            .then(response => response.json())
            .then(data => setTeam(data))
            .catch(error => console.error("Error fetching team:", error));
    }, []);

    const teamName = team.Name || "";

    return (
        <div>
            <CurrentRoaster
                teamName="Falcons"
            />
        </div>  
    );
}
