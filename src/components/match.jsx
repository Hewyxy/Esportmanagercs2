import React, { useEffect, useRef, useState } from "react";
import shuffle from "../../backend/util/util";
import akIcon from "../assets/ak.png";
import "./match.css";

const sleep = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));


async function simulateMatch(team1, team2, onUpdate) {

    const match = {
        team1,
        team2,

        mapPool: [
            "Mirage",
            "Dust II",
            "Inferno",
            "Anubis",
            "Ancient",
            "Nuke",
            "Cache"
        ],

        maps: [],

        finalScore: {
            team1: 0,
            team2: 0
        }
    };


    const game = {
        name: null,

        score: {
            team1: 0,
            team2: 0
        },

        rounds: []
    };


    const roundTemp = {
        number: 0,
        winner: 0,
        events: []
    };


    while (
        match.finalScore.team1 !== 2 &&
        match.finalScore.team2 !== 2
    ) {

        const map = structuredClone(game);

        map.name =
            match.mapPool[
                Math.floor(
                    Math.random() * match.mapPool.length
                )
            ];

        //Make only up to 5 Rounds for More entertaimnet (13 originaly)
        while (
            map.score.team1 !== 5 &&
            map.score.team2 !== 5
        ) {

            const round = structuredClone(roundTemp);

            round.number =
                map.rounds.length + 1;


            const team1Players =
                [...match.team1.Players];

            const team2Players =
                [...match.team2.Players];


            while (
                team1Players.length !== 0 &&
                team2Players.length !== 0
            ) {

                shuffle(team1Players);
                shuffle(team2Players);


                const player1 =
                    team1Players[0];

                const player2 =
                    team2Players[0];


                const total =
                    player1.Rating +
                    player2.Rating;


                const winner =
                    Math.floor(
                        Math.random() * total
                    );


                if (winner < player1.Rating) {

                    round.events.push({
                        type: "Kill",
                        killer: player1.Name,
                        victim: player2.Name
                    });

                    team2Players.shift();

                } else {

                    round.events.push({
                        type: "Kill",
                        killer: player2.Name,
                        victim: player1.Name
                    });

                    team1Players.shift();
                }


                // Live update

                const liveMap =
                    structuredClone(map);

                liveMap.rounds.push(
                    structuredClone(round)
                );


                const liveMatch = {
                    ...structuredClone(match),
                    maps: [...structuredClone(match.maps), liveMap]
                };


                onUpdate(liveMatch);

                await sleep(500);
            }


            // Round winner

            if (
                team1Players.length >
                team2Players.length
            ) {

                round.winner = 1;
                map.score.team1++;

            } else {

                round.winner = 2;
                map.score.team2++;
            }


            map.rounds.push(round);


            const liveMatch = {
                ...structuredClone(match),
                maps: [...structuredClone(match.maps), structuredClone(map)]
            };

            onUpdate(liveMatch);

            await sleep(1000);
        }


        // Map winner

        if (
            map.score.team1 >
            map.score.team2
        ) {

            match.finalScore.team1++;

        } else {

            match.finalScore.team2++;
        }


        // Save map

        match.maps.push(map);

        onUpdate(
            structuredClone(match)
        );

        await sleep(1500);
    }


    return match;
}


export default function Match({ team1Id = 3, team2Id = 2 }) {

    const [team1, setTeam1] =
        useState(null);

    const [team2, setTeam2] =
        useState(null);


    const [team1P, setTeam1P] =
        useState([]);

    const [team2P, setTeam2P] =
        useState([]);


    const [match, setMatch] =
        useState(null);

    const [isSimulating, setIsSimulating] =
        useState(false);
    const [error, setError] = useState("");
    const roundFeedRefs = useRef({});
    const followRoundFeeds = useRef([]);

    useEffect(() => {
        Object.entries(roundFeedRefs.current).forEach(([index, element]) => {
            if (element && followRoundFeeds.current[Number(index)]) {
                element.scrollTop = element.scrollHeight;
            }
        });
    }, [match]);


    // Team 1

    useEffect(() => {
        let cancelled = false;
        setTeam1(null);
        setTeam1P([]);
        fetch(`http://localhost:3000/api/teams/${encodeURIComponent(team1Id)}`)
            .then(response => {
                if (!response.ok) throw new Error(`Team ${team1Id} was not found`);
                return response.json();
            })
            .then(data => { if (!cancelled) setTeam1(data); })
            .catch(error => { if (!cancelled) setError(error.message); });
        return () => { cancelled = true; };
    }, [team1Id]);


    // Team 2

    useEffect(() => {
        let cancelled = false;
        setTeam2(null);
        setTeam2P([]);
        fetch(`http://localhost:3000/api/teams/${encodeURIComponent(team2Id)}`)
            .then(response => {
                if (!response.ok) throw new Error(`Team ${team2Id} was not found`);
                return response.json();
            })
            .then(data => { if (!cancelled) setTeam2(data); })
            .catch(error => { if (!cancelled) setError(error.message); });
        return () => { cancelled = true; };
    }, [team2Id]);


    const team1Name =
        team1?.Name;

    const team2Name =
        team2?.Name;


    // Team 1 players

    useEffect(() => {

        if (!team1Name) return;

        let cancelled = false;
        fetch(
            `http://localhost:3000/api/players/sameteam/${encodeURIComponent(team1Name)}`
        )
            .then(response => { if (!response.ok) throw new Error("Could not load team 1 players"); return response.json(); })
            .then(data => { if (!cancelled) setTeam1P(data); })
            .catch(error => { if (!cancelled) setError(error.message); });
        return () => { cancelled = true; };

    }, [team1Name]);


    // Team 2 players

    useEffect(() => {

        if (!team2Name) return;

        let cancelled = false;
        fetch(
            `http://localhost:3000/api/players/sameteam/${encodeURIComponent(team2Name)}`
        )
            .then(response => { if (!response.ok) throw new Error("Could not load team 2 players"); return response.json(); })
            .then(data => { if (!cancelled) setTeam2P(data); })
            .catch(error => { if (!cancelled) setError(error.message); });
        return () => { cancelled = true; };

    }, [team2Name]);


    // Start match

    async function startMatch() {

        if (
            !team1 ||
            !team2 ||
            team1P.length === 0 ||
            team2P.length === 0
        ) {
            return;
        }


        setIsSimulating(true);
        setError("");


        const team1Stack = {
            id: team1.Id,
            Name: team1.Name,
            Players: team1P
        };


        const team2Stack = {
            id: team2.Id,
            Name: team2.Name,
            Players: team2P
        };


        setMatch(null);


        try {
        await simulateMatch(
            team1Stack,
            team2Stack,

            (updatedMatch) => {
                followRoundFeeds.current = updatedMatch.maps.map((_, index) => {
                    const feed = roundFeedRefs.current[index];
                    return !feed || feed.scrollHeight - feed.scrollTop - feed.clientHeight < 48;
                });
                setMatch(updatedMatch);
            }
        );
        } catch (error) {
            setError(error.message || "The match could not be simulated.");
        } finally {
            setIsSimulating(false);
        }
    }


    return (

        <main className="match-page">
            <header className="match-page__header">
                <p className="match-page__eyebrow">COMPETITIVE SIMULATION</p>
                <h1>Match Center</h1>
                <p>Follow every round as these teams battle for the series.</p>
            </header>


            {error && <p className="match-error" role="alert">{error}</p>}
            <section className="match-scoreboard">
                <div className="match-team">
                    {team1?.Logo ? <img className="match-team__logo" src={team1.Logo} alt={`${team1.Name} logo`} /> : <span className="match-team__logo match-team__logo--fallback">{team1?.Name?.slice(0, 2) || "T1"}</span>}
                    <span className="match-team__label">TEAM 1 · #{team1Id}</span>
                    <strong>{team1?.Name || "Loading team…"}</strong>
                    <div className="match-roster" aria-label={`${team1?.Name || "Team 1"} roster`}>
                        <span className="match-roster__title">ROSTER</span>
                        {team1P.length ? team1P.map(player => (
                            <div className="match-roster__player" key={player.Id ?? player.Name}>
                                <span>{player.Name}</span>
                                <span className="match-roster__rating">{player.Rating}</span>
                            </div>
                        )) : <span className="match-roster__loading">Loading players…</span>}
                    </div>
                </div>
                <div className="match-scoreboard__vs">VS</div>
                <div className="match-team match-team--right">
                    {team2?.Logo ? <img className="match-team__logo" src={team2.Logo} alt={`${team2.Name} logo`} /> : <span className="match-team__logo match-team__logo--fallback">{team2?.Name?.slice(0, 2) || "T2"}</span>}
                    <span className="match-team__label">TEAM 2 · #{team2Id}</span>
                    <strong>{team2?.Name || "Loading team…"}</strong>
                    <div className="match-roster" aria-label={`${team2?.Name || "Team 2"} roster`}>
                        <span className="match-roster__title">ROSTER</span>
                        {team2P.length ? team2P.map(player => (
                            <div className="match-roster__player" key={player.Id ?? player.Name}>
                                <span>{player.Name}</span>
                                <span className="match-roster__rating">{player.Rating}</span>
                            </div>
                        )) : <span className="match-roster__loading">Loading players…</span>}
                    </div>
                </div>
            </section>

            <button
                className="match-start-button"
                onClick={startMatch}
                disabled={
                    isSimulating ||
                    !team1 ||
                    !team2 ||
                    team1P.length === 0 ||
                    team2P.length === 0
                }
            >

                {isSimulating
                    ? "Match in Progress..."
                    : "Simulate Match"}

            </button>


            {match && (
                <section className="match-results">
                    <div className="match-series-score">
                        <div>{match.team1.Logo ? <img className="match-series-score__logo" src={match.team1.Logo} alt="" /> : <span className="match-series-score__logo match-team__logo--fallback">{match.team1.Name.slice(0, 2)}</span>}<span>{match.team1.Name}</span><strong>{match.finalScore.team1}</strong></div>
                        <span className="match-series-score__divider">SERIES</span>
                        <div><strong>{match.finalScore.team2}</strong><span>{match.team2.Name}</span>{match.team2.Logo ? <img className="match-series-score__logo" src={match.team2.Logo} alt="" /> : <span className="match-series-score__logo match-team__logo--fallback">{match.team2.Name.slice(0, 2)}</span>}</div>
                    </div>


                    {match.maps.map(
                        (map, mapIndex) => (

                            <article className="match-map" key={`${map.name}-${mapIndex}`}>
                                <header className="match-map__header">
                                    <div><span className="match-map__index">MAP {mapIndex + 1}</span><h2>{map.name}</h2></div>
                                    <strong>{map.score.team1}<span>:</span>{map.score.team2}</strong>
                                </header>


                                <div
                                    className="match-rounds-scroll"
                                    ref={element => { roundFeedRefs.current[mapIndex] = element; }}
                                >
                                {map.rounds.map(
                                    round => (

                                        <div className={`match-round ${round.winner ? "match-round--complete" : "match-round--live"}`} key={round.number}>

                                            <h3>

                                                <span>ROUND {round.number}</span>
                                                <span className="match-round__status">{round.winner === 0 ? "LIVE" : `${round.winner === 1 ? match.team1.Name : match.team2.Name} won`}</span>

                                            </h3>


                                            {round.events.map(
                                                (
                                                    event,
                                                    eventIndex
                                                ) => (

                                                    <p className={`match-event ${match.team1.Players.some(player => player.Name === event.killer) ? "match-event--team-one" : "match-event--team-two"}`} key={eventIndex}>
                                                        <strong className="match-event__killer">{event.killer}</strong>
                                                        <img className="match-event__weapon" src={akIcon} alt="" aria-hidden="true" />
                                                        <strong className="match-event__victim">{event.victim}</strong>
                                                        <span className="match-event__tag">ELIMINATION</span>
                                                    </p>

                                                )
                                            )}

                                        </div>
                                    )
                                )}
                                </div>

                            </article>
                        )
                    )}

                </section>
            )}

        </main>
    );
}
