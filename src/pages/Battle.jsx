import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Match from "../components/match.jsx";

const API_URL = "http://localhost:3000/api";

export default function Battle() {
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");

  const currentRound = useRef(null);
  const hasReturnedToBracket = useRef(false);

  const loadMatches = useCallback(
    async (result) => {
      try {
        const response = await fetch(`${API_URL}/tournamentmatches`);

        if (!response.ok) {
          throw new Error("Failed to load matches");
        }

        const data = await response.json();

        setMatches(data);
        setError("");

        if (result?.tournamentFinished) {
          navigate("/", {
            replace: true,
            state: {
              tournamentWinner: result.winnerName,
              tournamentTransfers: result.transfers ?? [],
            },
          });
        }

        // Запоминаем текущий раунд только один раз
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

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const activeMatches = matches.filter(
    (match) =>
      match.status === "ongoing" &&
      match.team1Id &&
      match.team2Id
  );

  useEffect(() => {
    if (currentRound.current === null) return;
    if (hasReturnedToBracket.current) return;

    const roundMatches = matches.filter(
      (match) =>
        Number(match.round) === Number(currentRound.current)
    );

    if (roundMatches.length === 0) return;

    const allFinished = roundMatches.every(
      (match) => match.status === "completed"
    );

    if (allFinished) {
      hasReturnedToBracket.current = true;

      navigate("/tournament", {
        replace: true,
        state: {
          notice: `Round ${Number(currentRound.current) + 1} completed.`,
        },
      });
    }
  }, [matches, navigate]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {activeMatches.map((match) => (
        <Match
          key={match.id ?? match.Id}
          tournamentMatchId={match.id ?? match.Id}
          team1Id={match.team1Id}
          team2Id={match.team2Id}
          onTournamentMatchUpdated={loadMatches}
        />
      ))}
    </div>
  );
}
