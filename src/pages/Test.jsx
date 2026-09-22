import React, { useEffect, useState } from "react";
import shuffle from "../../backend/util/util";

export default function Test() {
    //declaring all variables
    const [team1, setTeam1] = useState([]);
    const [team2, setTeam2] = useState([]);

    const [team1P, setTeam1P] = useState([]);
    const [team2P, setTeam2P] = useState([]);

    //Fetching team info
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

    //Pullin all of out players for the teams
    useEffect(() => {
        if (!team1Name) return;

        fetch(`http://localhost:3000/api/players/sameteam/${encodeURIComponent(team1Name)}`)
            .then(response => response.json())
            .then(data => setTeam1P(data))
            .catch(error => console.error("Error fetching players:", error));
    }, [team1Name]);

    useEffect(() => {
        if (!team2Name) return;

        fetch(`http://localhost:3000/api/players/sameteam/${encodeURIComponent(team2Name)}`)
            .then(response => response.json())
            .then(data => setTeam2P(data))
            .catch(error => console.error("Error fetching players:", error));
    }, [team1Name]);

    //Creating our teams for match up
    const team1Stack = {
        id: team1.Id,
        Name: team1Name,
        Players: team1P
    }

    const team2Stack = {
        id: team2.Id,
        Name: team2Name,
        Players: team2P
    }

    //Test check of all roaster
    console.log(team1Stack)
    console.log(team2Stack)


    //Check For The power just for test
    for (const player of team1Stack.Players){
        console.log(player.Rating)
    }

    for (const player of team2Stack.Players){
        console.log(player.Rating)
    }


    const match = {
        team1: team1Stack,
        team2: team2Stack,
        mapPool: ["Mirage", "Dust II", "Inferno","Anubis", "Ancient", "Nuke", "Cache"],
        maps: [],
        finalScore: {
            team1: 0,
            team2: 0
        }

    }
    const game = {
        name: null,
        score: {
            team1: 0,
            team2: 0,
        },
        rounds: []

    }

    const roundTemp = {
        number: 0,
        winner: 0,
        events:[]
    }

    while (match.finalScore.team1 != 2 && match.finalScore.team2 != 2) {

        const map = structuredClone(game);

        const mapName =
            match.mapPool[Math.floor(Math.random() * match.mapPool.length)];

        map.name = mapName;

        while (map.score.team1 != 13 && map.score.team2 != 13) {

            const round = structuredClone(roundTemp);
            const roundNumber = map.rounds.length + 1;

            const team1Players = [...match.team1.Players];
            const team2Players = [...match.team2.Players];

            round.number = roundNumber;

            while (team1Players.length != 0 && team2Players.length != 0) {

                shuffle(team1Players);
                shuffle(team2Players);

                const total =
                    team1Players[0].Rating +
                    team2Players[0].Rating;

                const winner = Math.floor(Math.random() * total);

                if (winner < team1Players[0].Rating) {

                    round.events.push({
                        type: "Kill",
                        killer: team1Players[0].Name,
                        victim: team2Players[0].Name
                    });

                    team2Players.shift();

                } else {

                    round.events.push({
                        type: "Kill",
                        killer: team2Players[0].Name,
                        victim: team1Players[0].Name
                    });

                    team1Players.shift();
                }
            }

            if (team1Players.length > team2Players.length) {
                round.winner = 1;
                map.score.team1++;
            } else {
                round.winner = 2;
                map.score.team2++;
            }

            map.rounds.push(round);
        }

        if (map.score.team1 > map.score.team2) {
            match.finalScore.team1++;
        } else {
            match.finalScore.team2++;
        }

        match.maps.push(map);
    }

    console.log(match);


    

    return (
        <div>
            <h1>Test Page</h1>

            <h2>
                {match.team1.Name} {match.finalScore.team1} - {match.finalScore.team2} {match.team2.Name}
            </h2>

            {match.maps.map((map, index) => (
                <div key={index}>
                    <h3>
                        {map.name}: {map.score.team1} - {map.score.team2}
                    </h3>
                    {match.maps.map((map, mapIndex) => (
                <div key={mapIndex}>

                    <h2>
                        {map.name} — {map.score.team1}:{map.score.team2}
                    </h2>

                    {map.rounds.map((round) => (
                        <div key={round.number}>

                            <h3>
                                Round {round.number} — Team {round.winner}
                            </h3>

                            {round.events.map((event, eventIndex) => (
                                <p key={eventIndex}>
                                    {event.killer} killed {event.victim}
                                </p>
                            ))}

                        </div>
                    ))}

                </div>
            ))}
                </div>
            ))}
        </div>
    );
}