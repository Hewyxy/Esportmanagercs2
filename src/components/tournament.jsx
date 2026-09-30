import { useEffect, useState } from "react";
import "./tournament.css";

const API_URL = "http://localhost:3000/api";

function getRoundName(teamCount) {
  if (teamCount === 2) return "Final";
  if (teamCount === 4) return "Semifinals";
  if (teamCount === 8) return "Quarterfinals";
  if (teamCount === 16) return "Round of 16";
  if (teamCount === 32) return "Round of 32";
  return `Round of ${teamCount}`;
}

export default function Tournament({ eventId }) {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (!eventId) {
      setMatches([]);
      return undefined;
    }

    let cancelled = false;

    async function loadTournament() {
      setError("");

      try {
        const [matchesResponse, teamsResponse] = await Promise.all([
          fetch(`${API_URL}/tournamentmatches`),
          fetch(`${API_URL}/teams`),
        ]);

        if (!matchesResponse.ok || !teamsResponse.ok) {
          throw new Error("Failed to load tournament data");
        }

        const [allMatches, teamsData] = await Promise.all([
          matchesResponse.json(),
          teamsResponse.json(),
        ]);

        if (cancelled) return;

        const eventMatches = allMatches.filter(
          (match) => Number(match.tournamentId) === Number(eventId),
        );
        const assignedTeams = new Set();
        const uniqueFirstRound = eventMatches
          .filter((match) => Number(match.round) === 0)
          .sort((a, b) => Number(a.Id) - Number(b.Id))
          .filter((match) => {
            const team1Id = Number(match.team1Id);
            const team2Id = Number(match.team2Id);
            if (!team1Id || !team2Id || assignedTeams.has(team1Id) || assignedTeams.has(team2Id)) {
              return false;
            }
            assignedTeams.add(team1Id);
            assignedTeams.add(team2Id);
            return true;
          });
        const acceptedFirstRoundIds = new Set(uniqueFirstRound.map((match) => match.Id));

        setMatches(
          eventMatches.filter(
            (match) => Number(match.round) !== 0 || acceptedFirstRoundIds.has(match.Id),
          ),
        );
        setTeams(
          Object.fromEntries(teamsData.map((team) => [team.Id, team])),
        );
      } catch (loadError) {
        console.error("Error loading tournament:", loadError);
        if (!cancelled) setError("Could not load tournament matches.");
      }
    }

    loadTournament();
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  const roundZeroMatches = matches.filter((match) => Number(match.round) === 0);
  const initialTeamCount = roundZeroMatches.length * 2;
  const roundCount = initialTeamCount > 1
    ? Math.ceil(Math.log2(initialTeamCount))
    : 0;

  const rounds = Array.from({ length: roundCount }, (_, roundIndex) => {
    const roundMatches = matches.filter(
      (match) => Number(match.round) === roundIndex,
    );
    const expectedMatchCount = Math.ceil(initialTeamCount / 2 ** (roundIndex + 1));

    return {
      index: roundIndex,
      name: getRoundName(Math.ceil(initialTeamCount / 2 ** roundIndex)),
      matches: Array.from({ length: expectedMatchCount }, (_, matchIndex) =>
        roundMatches[matchIndex] ?? null,
      ),
    };
  });

  const renderMatch = (match, index) => {
    const team1 = match ? teams[match.team1Id] : null;
    const team2 = match ? teams[match.team2Id] : null;

    return (
      <div className="match" key={match?.Id ?? `${eventId}-${index}`}>
        {[team1, team2].map((team, teamIndex) => {
          const score = teamIndex === 0 ? match?.score1 : match?.score2;
          const isWinner = match?.winnerId && Number(match.winnerId) === Number(team?.Id);

          return (
            <div className={`team${isWinner ? " team-winner" : ""}`} key={teamIndex}>
              <span className="team-name" title={team?.Name ?? "To be determined"}>
                {team?.Name ?? "TBD"}
              </span>
              <strong>{match?.status === "ongoing" || score == null ? "-" : score}</strong>
            </div>
          );
        })}
      </div>
    );
  };

  if (error) {
    return <div className="tournament-status" role="alert">{error}</div>;
  }

  if (rounds.length === 0) {
    return <div className="tournament-status">No matches in this tournament yet.</div>;
  }

  return (
    <section className="tournament-view" aria-label="Tournament bracket">
      <header className="tournament-header">
        <div>
          <span className="tournament-eyebrow">COMPETITION</span>
          <h1>Tournament bracket</h1>
          <p>{initialTeamCount} teams · {roundCount} rounds</p>
        </div>
        <span className="tournament-live"><i /> LIVE BRACKET</span>
      </header>

      <div className="bracket">
        {rounds.map((round) => (
          <section className="bracket-round" key={round.index}>
            <div className="round-heading">
              <h2>{round.name}</h2>
              <span>{round.matches.length} {round.matches.length === 1 ? "match" : "matches"}</span>
            </div>
            <div className="round-matches">
              {round.matches.map(renderMatch)}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
