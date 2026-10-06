import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Match from "../components/match.jsx";

const API_URL = "http://localhost:3000/api";

export default function Battle() {
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  const [roundFinished, setRoundFinished] = useState(false);
  const [matchesLoaded, setMatchesLoaded] = useState(false);
  const [backgroundSimulationStarted, setBackgroundSimulationStarted] =
    useState(false);

  const currentRound = useRef(null);

  const loadMatches = useCallback(
    async () => {
      try {
        const response = await fetch(`${API_URL}/tournamentmatches`);

        if (!response.ok) {
          throw new Error("Failed to load matches");
        }

        const data = await response.json();

        setMatches(data);
        setError("");
        setMatchesLoaded(true);

        /*
         * Find the first/current ongoing round.
         *
         * We only set this once so that finishing matches
         * does not make Battle jump to another round.
         */
        if (currentRound.current === null) {
          const ongoing = data.filter(
            (match) =>
              match.status === "ongoing" &&
              match.team1Id &&
              match.team2Id
          );

          if (ongoing.length > 0) {
            currentRound.current = Math.min(
              ...ongoing.map((match) => Number(match.round))
            );
          }
        }
      } catch (loadError) {
        console.error(loadError);
        setError("Could not load matches");
      }
    },
    [navigate]
  );

  /*
   * Initial load.
   */
  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  /*
   * Only matches from the current round.
   */
  const roundMatches = matches.filter(
    (match) =>
      Number(match.round) === Number(currentRound.current) &&
      match.status === "ongoing" &&
      match.team1Id &&
      match.team2Id
  );

  /*
   * Find player's match.
   */
  const playerMatch = roundMatches.find(
    (match) => match.team1Id === 1 || match.team2Id === 1
  );

  /*
   * Background matches where neither team is the player.
   */
  const backgroundMatches = roundMatches.filter(
    (match) => match.team1Id !== 1 && match.team2Id !== 1
  );

  /*
   * If the player is playing:
   *
   *   Render the player's match and all background matches.
   *
   * If the player is NOT playing:
   *
   *   Render only ONE background match.
   *
   * This prevents all background matches from starting
   * at the same time.
   */
  const matchesToRender = playerMatch
    ? roundMatches
    : backgroundMatches.slice(0, 1);

  /*
   * Remember that background simulation has actually started.
   *
   * This prevents the auto-return effect from firing immediately
   * while the initial API request is still being processed.
   */
  useEffect(() => {
    if (playerMatch) {
      return;
    }

    if (backgroundMatches.length > 0) {
      setBackgroundSimulationStarted(true);
    }
  }, [playerMatch, backgroundMatches]);

  /*
   * Player's match finished.
   *
   * We intentionally DON'T reload tournament matches here.
   *
   * If we reload them, the completed player's match disappears
   * from Battle and the player can't see the result.
   */
  const handlePlayerMatchFinished = () => {
    setRoundFinished(true);
  };

  /*
   * Background match finished.
   *
   * Reloading the matches removes the completed match from
   * backgroundMatches, which causes the next one to render.
   */
  const handleBackgroundMatchUpdated = async () => {
    await loadMatches();
  };

  /*
   * If the player is NOT playing this round and all background
   * matches are finished, return to the tournament page.
   */
  useEffect(() => {
    if (!matchesLoaded) {
      return;
    }

    if (!backgroundSimulationStarted) {
      return;
    }

    if (currentRound.current === null) {
      return;
    }

    // Player has a match in this round.
    // Don't automatically leave Battle.
    if (playerMatch) {
      return;
    }

    // There are still background matches left.
    if (backgroundMatches.length > 0) {
      return;
    }

    /*
     * No player match + no background matches remaining.
     *
     * The entire current round is finished.
     */
    navigate("/tournament", {
      replace: true,
      state: {
        notice: `Round ${Number(currentRound.current) + 1} completed.`,
      },
    });
  }, [
    matchesLoaded,
    backgroundSimulationStarted,
    playerMatch,
    backgroundMatches,
    navigate,
  ]);

  /*
   * Manual return after player's match.
   */
  const returnToTournament = () => {
    navigate("/tournament", {
      replace: true,
      state: {
        notice: `Round ${Number(currentRound.current) + 1} completed.`,
      },
    });
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {matchesToRender.map((match) => (
        <Match
          key={match.id ?? match.Id}
          tournamentMatchId={match.id ?? match.Id}
          team1Id={match.team1Id}
          team2Id={match.team2Id}
          onTournamentMatchUpdated={handleBackgroundMatchUpdated}
          onPlayerMatchFinished={handlePlayerMatchFinished}
        />
      ))}
      {roundFinished && (
        <div className="battle-finished">
          <h2>Match Completed</h2>

          <button
            className="battle-return-button"
            onClick={returnToTournament}
          >
            Return to Tournament
          </button>
        </div>
      )}
    </div>
  );
}
