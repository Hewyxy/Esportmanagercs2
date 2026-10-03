import React, { useEffect, useRef, useState } from "react";
import shuffle from "../../backend/util/util";
import akIcon from "../assets/ak.png";
import "./match.css";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const TEAM_PLACEHOLDER =
  "https://www.hltv.org/dynamic-svg/teamplaceholder";

function PlayerAvatar({ player, name }) {
  const displayName = player?.Name ?? name ?? "?";

  return player?.Image ? (
    <img
      className="match-player-avatar"
      src={player.Image}
      alt=""
    />
  ) : (
    <span
      className="match-player-avatar match-player-avatar--fallback"
      aria-hidden="true"
    >
      {displayName.slice(0, 2).toUpperCase()}
    </span>
  );
}

// Simulate a map series and send live-feed updates as it goes.
async function simulateMatch(
  team1,
  team2,
  onUpdate,
  showLiveFeed = true
) {
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
      "Cache",
    ],

    maps: [],

    finalScore: {
      team1: 0,
      team2: 0,
    },
  };

  const game = {
    name: null,

    score: {
      team1: 0,
      team2: 0,
    },

    rounds: [],
  };

  const roundTemp = {
    number: 0,
    winner: 0,
    events: [],
  };

  while (
    match.finalScore.team1 !== 2 &&
    match.finalScore.team2 !== 2
  ) {
    const map = structuredClone(game);

    map.name =
      match.mapPool[
        Math.floor(Math.random() * match.mapPool.length)
      ];

    // Maximum 5 rounds per map for faster simulation.
    while (
      map.score.team1 !== 5 &&
      map.score.team2 !== 5
    ) {
      const round = structuredClone(roundTemp);

      round.number = map.rounds.length + 1;

      const team1Players = [...match.team1.Players];
      const team2Players = [...match.team2.Players];

      while (
        team1Players.length !== 0 &&
        team2Players.length !== 0
      ) {
        shuffle(team1Players);
        shuffle(team2Players);

        const player1 = team1Players[0];
        const player2 = team2Players[0];

        const total = player1.Rating + player2.Rating;

        const winner = Math.floor(Math.random() * total);

        if (winner < player1.Rating) {
          round.events.push({
            type: "Kill",
            killer: player1.Name,
            victim: player2.Name,
          });

          team2Players.shift();
        } else {
          round.events.push({
            type: "Kill",
            killer: player2.Name,
            victim: player1.Name,
          });

          team1Players.shift();
        }

        // Live update.
        const liveMap = structuredClone(map);

        liveMap.rounds.push(structuredClone(round));

        const liveMatch = {
          ...structuredClone(match),
          maps: [
            ...structuredClone(match.maps),
            liveMap,
          ],
        };

        onUpdate(liveMatch);

        if (showLiveFeed) {
          await sleep(
            Math.floor(Math.random() * 1001) + 1000
          );
        }
      }

      // Round winner.
      if (team1Players.length > team2Players.length) {
        round.winner = 1;
        map.score.team1++;
      } else {
        round.winner = 2;
        map.score.team2++;
      }

      map.rounds.push(round);

      const liveMatch = {
        ...structuredClone(match),
        maps: [
          ...structuredClone(match.maps),
          structuredClone(map),
        ],
      };

      onUpdate(liveMatch);

      if (showLiveFeed) {
        await sleep(
          Math.floor(Math.random() * 1001) + 1000
        );
      }
    }

    // Map winner.
    if (map.score.team1 > map.score.team2) {
      match.finalScore.team1++;
    } else {
      match.finalScore.team2++;
    }

    // Save map.
    match.maps.push(map);

    onUpdate(structuredClone(match));

    if (showLiveFeed) {
      await sleep(
        Math.floor(Math.random() * 1001) + 1000
      );
    }
  }

  return match;
}

export default function Match({
  team1Id,
  team2Id,
  tournamentMatchId,
  onTournamentMatchUpdated,
  onPlayerMatchFinished,
}) {
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);

  const [team1P, setTeam1P] = useState([]);
  const [team2P, setTeam2P] = useState([]);

  const [match, setMatch] = useState(null);

  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState("");

  const roundFeedRefs = useRef({});
  const followRoundFeeds = useRef([]);

  const backgroundMatchKey = useRef(null);

  // Prevent multiple startMatch calls at the same time.
  const matchRunningRef = useRef(false);

  const playersByName = new Map(
    [...team1P, ...team2P].map((player) => [
      player.Name,
      player,
    ])
  );

  useEffect(() => {
    Object.entries(roundFeedRefs.current).forEach(
      ([index, element]) => {
        if (
          element &&
          followRoundFeeds.current[Number(index)]
        ) {
          element.scrollTop = element.scrollHeight;
        }
      }
    );
  }, [match]);

  // =========================
  // TEAM 1
  // =========================

  useEffect(() => {
    let cancelled = false;

    setTeam1(null);
    setTeam1P([]);

    fetch(
      `http://localhost:3000/api/teams/${encodeURIComponent(
        team1Id
      )}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Team ${team1Id} was not found`
          );
        }

        return response.json();
      })
      .then((data) => {
        if (!cancelled) {
          setTeam1(data);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setError(error.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [team1Id]);

  // =========================
  // TEAM 2
  // =========================

  useEffect(() => {
    let cancelled = false;

    setTeam2(null);
    setTeam2P([]);

    fetch(
      `http://localhost:3000/api/teams/${encodeURIComponent(
        team2Id
      )}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Team ${team2Id} was not found`
          );
        }

        return response.json();
      })
      .then((data) => {
        if (!cancelled) {
          setTeam2(data);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setError(error.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [team2Id]);

  // =========================
  // TEAM 1 PLAYERS
  // =========================

  useEffect(() => {
    if (!team1?.Id) {
      return;
    }

    let cancelled = false;

    fetch(
      `http://localhost:3000/api/players/team/${encodeURIComponent(
        team1.Id
      )}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Could not load team 1 players"
          );
        }

        return response.json();
      })
      .then((data) => {
        if (!cancelled) {
          setTeam1P(data);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setError(error.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [team1?.Id]);

  // =========================
  // TEAM 2 PLAYERS
  // =========================

  useEffect(() => {
    if (!team2?.Id) {
      return;
    }

    let cancelled = false;

    fetch(
      `http://localhost:3000/api/players/team/${encodeURIComponent(
        team2.Id
      )}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Could not load team 2 players"
          );
        }

        return response.json();
      })
      .then((data) => {
        if (!cancelled) {
          setTeam2P(data);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setError(error.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [team2?.Id]);

  // =========================
  // START MATCH
  // =========================

  async function startMatch(skipSimulation = false) {
    /*
     * Hard protection against starting the same match twice.
     */
    if (matchRunningRef.current) {
      return;
    }

    /*
     * Don't allow another simulation after this match
     * has already finished.
     */
    if (match !== null) {
      return;
    }

    // Wait for teams and rosters.
    if (
      !team1 ||
      !team2 ||
      team1P.length === 0 ||
      team2P.length === 0
    ) {
      return;
    }

    // Lock immediately.
    matchRunningRef.current = true;

    setIsSimulating(true);
    setError("");
    setMatch(null);

    const team1Stack = {
      id: team1.Id,
      Name: team1.Name,
      Players: team1P,
      Seed: team1.Seed,
      Logo: team1.Logo,
    };

    const team2Stack = {
      id: team2.Id,
      Name: team2.Name,
      Players: team2P,
      Seed: team2.Seed,
      Logo: team2.Logo,
    };

    const isPlayerMatch =
      team1.Id === 1 || team2.Id === 1;

    try {
      const result = await simulateMatch(
        team1Stack,
        team2Stack,
        (updatedMatch) => {
          /*
           * Background matches don't need live UI.
           *
           * Skip Simulation also doesn't stream the feed.
           */
          if (!isPlayerMatch || skipSimulation) {
            return;
          }

          followRoundFeeds.current =
            updatedMatch.maps.map((_, index) => {
              const feed = roundFeedRefs.current[index];

              return (
                !feed ||
                feed.scrollHeight -
                  feed.scrollTop -
                  feed.clientHeight <
                  48
              );
            });

          setMatch(updatedMatch);
        },
        !skipSimulation && isPlayerMatch
      );

      /*
       * Show the completed result for player's match.
       */
      if (isPlayerMatch) {
        setMatch(result);
      }

      // =========================
      // SAVE MATCH HISTORY
      // =========================

      const response = await fetch(
        "http://localhost:3000/api/matches/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            team1Id: result.team1.id,
            team2Id: result.team2.id,
            score1: result.finalScore.team1,
            score2: result.finalScore.team2,
            winnerId:
              result.finalScore.team1 >
              result.finalScore.team2
                ? result.team1.id
                : result.team2.id,
          }),
        }
      );

      const savedMatch = await response.json();

      if (!response.ok) {
        throw new Error(
          savedMatch.error ||
            "The match history could not be saved."
        );
      }

      // =========================
      // UPDATE TOURNAMENT MATCH
      // =========================

      if (tournamentMatchId) {
        const winnerId =
          result.finalScore.team1 >
          result.finalScore.team2
            ? result.team1.id
            : result.team2.id;

        const tournamentResponse = await fetch(
          `http://localhost:3000/api/tournamentmatches/${encodeURIComponent(
            tournamentMatchId
          )}/result`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              score1: result.finalScore.team1,
              score2: result.finalScore.team2,
              winnerId,
            }),
          }
        );

        const tournamentResult =
          await tournamentResponse.json();

        if (!tournamentResponse.ok) {
          throw new Error(
            tournamentResult.error ||
              "The tournament bracket could not be updated."
          );
        }

        /*
         * Player match:
         * keep the result visible and tell Battle that
         * the player's match is finished.
         */
        if (isPlayerMatch) {
          onPlayerMatchFinished?.();
        } else {
          /*
           * Background match:
           * Battle will load the next background match.
           */
          await onTournamentMatchUpdated?.(
            tournamentResult
          );
        }
      }
    } catch (error) {
      console.error(
        "Could not simulate or save match:",
        error
      );

      setError(
        error.message ||
          "The match could not be simulated."
      );
    } finally {
      /*
       * Unlock only after the entire simulation and
       * database operations are finished.
       */
      matchRunningRef.current = false;
      setIsSimulating(false);
    }
  }

  // =========================
  // BACKGROUND MATCH
  // =========================

  useEffect(() => {
    if (
      !team1 ||
      !team2 ||
      team1.Id === 1 ||
      team2.Id === 1 ||
      team1P.length === 0 ||
      team2P.length === 0
    ) {
      return;
    }

    const key = `${team1.Id}-${team2.Id}`;

    if (backgroundMatchKey.current === key) {
      return;
    }

    backgroundMatchKey.current = key;

    void startMatch();
  }, [team1, team2, team1P, team2P]);

  // =========================
  // HIDE BACKGROUND MATCH
  // =========================

  if (!team1 || !team2) {
    return null;
  }

  if (team1.Id !== 1 && team2.Id !== 1) {
    return null;
  }

  // =========================
  // UI
  // =========================

  return (
    <main className="match-page">
      <header className="match-page__header">
        <p className="match-page__eyebrow">
          COMPETITIVE SIMULATION
        </p>

        <h1>Match Center</h1>

        <p>
          Follow every round as these teams battle for the
          series.
        </p>
      </header>

      {error && (
        <p className="match-error" role="alert">
          {error}
        </p>
      )}

      <section className="match-scoreboard">
        <div className="match-team">
          <img
            className="match-team__logo"
            src={team1?.Logo || TEAM_PLACEHOLDER}
            alt={`${team1?.Name ?? "Team 1"} logo`}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = TEAM_PLACEHOLDER;
            }}
          />

          <span className="match-team__label">
            TEAM 1 · #{team1.Seed}
          </span>

          <strong>
            {team1?.Name || "Loading team…"}
          </strong>

          <div
            className="match-roster"
            aria-label={`${team1?.Name || "Team 1"} roster`}
          >
            <span className="match-roster__title">
              ROSTER
            </span>

            {team1P.length ? (
              team1P.map((player) => (
                <div
                  className="match-roster__player"
                  key={player.Id ?? player.Name}
                >
                  <span className="match-roster__identity">
                    <PlayerAvatar player={player} />
                    <span>{player.Name}</span>
                  </span>

                  <span className="match-roster__rating">
                    {player.Rating}
                  </span>
                </div>
              ))
            ) : (
              <span className="match-roster__loading">
                Loading players…
              </span>
            )}
          </div>
        </div>

        <div className="match-scoreboard__vs">
          VS
        </div>

        <div className="match-team match-team--right">
          <img
            className="match-team__logo"
            src={team2?.Logo || TEAM_PLACEHOLDER}
            alt={`${team2?.Name ?? "Team 2"} logo`}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = TEAM_PLACEHOLDER;
            }}
          />

          <span className="match-team__label">
            TEAM 2 · #{team2.Seed}
          </span>

          <strong>
            {team2?.Name || "Loading team…"}
          </strong>

          <div
            className="match-roster"
            aria-label={`${team2?.Name || "Team 2"} roster`}
          >
            <span className="match-roster__title">
              ROSTER
            </span>

            {team2P.length ? (
              team2P.map((player) => (
                <div
                  className="match-roster__player"
                  key={player.Id ?? player.Name}
                >
                  <span className="match-roster__identity">
                    <span>{player.Name}</span>
                    <PlayerAvatar player={player} />
                  </span>

                  <span className="match-roster__rating">
                    {player.Rating}
                  </span>
                </div>
              ))
            ) : (
              <span className="match-roster__loading">
                Loading players…
              </span>
            )}
          </div>
        </div>
      </section>

      {/* =========================
          MATCH BUTTONS
         ========================= */}

      <div className="match-actions">
        <button
          className="match-start-button"
          onClick={() => startMatch(false)}
          disabled={
            isSimulating ||
            match !== null ||
            !team1 ||
            !team2 ||
            team1P.length === 0 ||
            team2P.length === 0
          }
        >
          {isSimulating
            ? "Match in Progress..."
            : match
              ? "Match Completed"
              : "Simulate Match"}
        </button>

        <button
          className="match-skip-button"
          onClick={() => startMatch(true)}
          disabled={
            isSimulating ||
            match !== null ||
            !team1 ||
            !team2 ||
            team1P.length === 0 ||
            team2P.length === 0
          }
        >
          Skip Simulation
        </button>
      </div>

      {/* =========================
          RESULTS
         ========================= */}

      {match && (
        <section className="match-results">
          <div className="match-series-score">
            <div>
              <img
                className="match-series-score__logo"
                src={
                  match.team1.Logo ||
                  TEAM_PLACEHOLDER
                }
                alt=""
              />

              <span>{match.team1.Name}</span>

              <strong>
                {match.finalScore.team1}
              </strong>
            </div>

            <span className="match-series-score__divider">
              SERIES
            </span>

            <div>
              <strong>
                {match.finalScore.team2}
              </strong>

              <span>{match.team2.Name}</span>

              <img
                className="match-series-score__logo"
                src={
                  match.team2.Logo ||
                  TEAM_PLACEHOLDER
                }
                alt=""
              />
            </div>
          </div>

          {match.maps.map((map, mapIndex) => (
            <article
              className="match-map"
              key={`${map.name}-${mapIndex}`}
            >
              <header className="match-map__header">
                <div>
                  <span className="match-map__index">
                    MAP {mapIndex + 1}
                  </span>

                  <h2>{map.name}</h2>
                </div>

                <strong>
                  {map.score.team1}
                  <span>:</span>
                  {map.score.team2}
                </strong>
              </header>

              <div
                className="match-rounds-scroll"
                ref={(element) => {
                  roundFeedRefs.current[mapIndex] =
                    element;
                }}
              >
                {map.rounds.map((round) => (
                  <div
                    className={`match-round ${
                      round.winner
                        ? "match-round--complete"
                        : "match-round--live"
                    }`}
                    key={round.number}
                  >
                    <h3>
                      <span>
                        ROUND {round.number}
                      </span>

                      <span className="match-round__status">
                        {round.winner === 0
                          ? "LIVE"
                          : `${
                              round.winner === 1
                                ? match.team1.Name
                                : match.team2.Name
                            } won`}
                      </span>
                    </h3>

                    {round.events.map(
                      (event, eventIndex) => (
                        <p
                          className={`match-event ${
                            match.team1.Players.some(
                              (player) =>
                                player.Name ===
                                event.killer
                            )
                              ? "match-event--team-one"
                              : "match-event--team-two"
                          }`}
                          key={eventIndex}
                        >
                          <PlayerAvatar
                            player={playersByName.get(
                              event.killer
                            )}
                            name={event.killer}
                          />

                          <strong className="match-event__killer">
                            {event.killer}
                          </strong>

                          <img
                            className="match-event__weapon"
                            src={akIcon}
                            alt=""
                            aria-hidden="true"
                          />

                          <strong className="match-event__victim">
                            {event.victim}
                          </strong>

                          <PlayerAvatar
                            player={playersByName.get(
                              event.victim
                            )}
                            name={event.victim}
                          />

                          <span className="match-event__tag">
                            ELIMINATION
                          </span>
                        </p>
                      )
                    )}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}