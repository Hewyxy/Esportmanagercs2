import React, { useEffect, useState } from "react";

export default function Test() {
    const [team1, setTeam1] = useState([]);
    const [team2, setTeam2] = useState([]);

    const [team1P, setTeam1P] = useState([]);
    const [team2P, setTeam2P] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/api/teams/3")
            .then(response => response.json())
            .then(data => setTeam1(data))
            .catch(error => console.error("Error fetching team:", error));
    }, []);

    useEffect(() => {
        fetch("http://localhost:3000/api/teams/2")
            .then(response => response.json())
            .then(data => setTeam2(data))
            .catch(error => console.error("Error fetching team:", error));
    }, []);

    const team1Name = team1.Name;
    const team2Name = team2.Name;

    useEffect(() => {
        if (!team1Name) return;

        fetch(`http://localhost:3000/api/players/sameteam/${encodeURIComponent(team1Name)}`)
            .then(response => response.json())
            .then(data => setTeam1P(data))
            .catch(error => console.error("Error fetching players:", error));
    }, [team1Name]);

    useEffect(() => {
        if (!team1Name) return;

        fetch(`http://localhost:3000/api/players/sameteam/${encodeURIComponent(team2Name)}`)
            .then(response => response.json())
            .then(data => setTeam2P(data))
            .catch(error => console.error("Error fetching players:", error));
    }, [team1Name]);

    const team1Stack = {
        "id": team1.Id,
        "Name": team1Name,
        "Players": team1P
    }

    const team2Stack = {
        "id": team2.Id,
        "Name": team2Name,
        "Players": team2P
    }

    console.log(team1Stack)
    console.log(team2Stack)

    return (
        <div>
            <h1>Test Page</h1>

            <p>
                {team1Name} vs {team2Name}
            </p>

            <button>
                play
            </button>
        </div>
    );
}