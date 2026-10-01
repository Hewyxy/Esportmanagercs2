
import CurrentRoaster from "../components/CurrentRoaster";
import React, { useEffect, useState } from "react";

export default function Roaster() {

    // Load our team first, then use its ID to fetch the roster.
    const [team, setTeam] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/api/teams/1")
            .then(response => response.json())
            .then(data => setTeam(data))
            .catch(error => console.error("Error fetching team:", error));
    }, []);

    

    return (
        <div>
            <CurrentRoaster
                teamId={team.Id}
                teamName={team.Name}
            />
        </div>  
    );
}
