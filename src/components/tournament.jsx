import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./tournament.css";

const API_URL = "http://localhost:3000/api";
const TEAM_PLACEHOLDER =
  "https://www.hltv.org/dynamic-svg/teamplaceholder";

function getRoundName(teamCount) {
  if (teamCount === 2) return "Final";
  if (teamCount === 4) return "Semifinals";
  if (teamCount === 8) return "Quarterfinals";
  if (teamCount === 16) return "Round of 16";
  if (teamCount === 32) return "Round of 32";

  return `Round of ${teamCount}`;
}

export default function Tournament({ eventId }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState({});
  const [error, setError] = useState("");
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    if (!eventId) {
      setMatches([]);
      return undefined;
    }

    let cancelled = false;

    async function loadTournament() {
      setError("");

      try {
        const [
          matchesResponse,
          teamsResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/tournamentmatches`),
          fetch(`${API_URL}/teams`),
        ]);

        if (
          !matchesResponse.ok ||
          !teamsResponse.ok
        ) {
          throw new Error(
            "Failed to load tournament data"
          );
        }

        const [
          allMatches,
          teamsData,
        ] = await Promise.all([
          matchesResponse.json(),
          teamsResponse.json(),
        ]);

        if (cancelled) return;

        const eventMatches = allMatches.filter(
          (match) =>
            Number(match.tournamentId) ===
            Number(eventId)
        );

        // Remove old duplicate first-round fixtures.
        const assignedTeams = new Set();

        const uniqueFirstRound = eventMatches
          .filter(
            (match) =>
              Number(match.round) === 0
          )
          .sort(
            (a, b) =>
              Number(
                a.matchNumber ??
                  a.id ??
                  a.Id
              ) -
              Number(
                b.matchNumber ??
                  b.id ??
                  b.Id
              )
          )
          .filter((match) => {
            const team1Id = Number(
              match.team1Id
            );

            const team2Id = Number(
              match.team2Id
            );

            if (
              !team1Id ||
              !team2Id ||
              assignedTeams.has(team1Id) ||
              assignedTeams.has(team2Id)
            ) {
              return false;
            }

            assignedTeams.add(team1Id);
            assignedTeams.add(team2Id);

            return true;
          });

        const acceptedFirstRoundIds =
          new Set(
            uniqueFirstRound.map(
              (match) =>
                match.id ?? match.Id
            )
          );

        setMatches(
          eventMatches.filter(
            (match) =>
              Number(match.round) !== 0 ||
              acceptedFirstRoundIds.has(
                match.id ?? match.Id
              )
          )
        );

        setTeams(
          Object.fromEntries(
            teamsData.map((team) => [
              team.Id,
              team,
            ])
          )
        );
      } catch (loadError) {
        console.error(
          "Error loading tournament:",
          loadError
        );

        if (!cancelled) {
          setError(
            "Could not load tournament matches."
          );
        }
      }
    }

    loadTournament();

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  // ==========================================
  // CHECK IF TOURNAMENT IS FINISHED
  // ==========================================

  const tournamentFinished =
    matches.length > 0 &&
    matches.every(
      (match) =>
        match.status === "completed"
    );

  // ==========================================
  // FINISH TOURNAMENT
  // ==========================================

  async function finishTournament() {
    if (
      isFinishing ||
      !tournamentFinished
    ) {
      return;
    }

    setIsFinishing(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/tournamentmatches/finish`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tournamentId: eventId,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Could not finish tournament."
        );
      }

      navigate("/", {
        replace: true,
        state: {
          tournamentWinner:
            result.winnerName,
          tournamentTransfers:
            result.transfers ?? [],
        },
      });
    } catch (finishError) {
      console.error(
        "Could not finish tournament:",
        finishError
      );

      setError(
        finishError.message ||
          "Could not finish tournament."
      );

      setIsFinishing(false);
    }
  }

  // ==========================================
  // BRACKET
  // ==========================================

  const roundZeroMatches =
    matches.filter(
      (match) =>
        Number(match.round) === 0
    );

  const initialTeamCount =
    roundZeroMatches.length * 2;

  const roundCount =
    initialTeamCount > 1
      ? Math.ceil(
          Math.log2(initialTeamCount)
        )
      : 0;

  const rounds = Array.from(
    { length: roundCount },
    (_, roundIndex) => {
      const roundMatches = matches
        .filter(
          (match) =>
            Number(match.round) ===
            roundIndex
        )
        .sort((a, b) => {
          const aNumber = Number(
            a.matchNumber
          );

          const bNumber = Number(
            b.matchNumber
          );

          if (
            Number.isFinite(aNumber) &&
            Number.isFinite(bNumber) &&
            aNumber !== bNumber
          ) {
            return aNumber - bNumber;
          }

          return (
            Number(a.id ?? a.Id) -
            Number(b.id ?? b.Id)
          );
        });

      const expectedMatchCount =
        Math.ceil(
          initialTeamCount /
            2 ** (roundIndex + 1)
        );

      return {
        index: roundIndex,

        name: getRoundName(
          Math.ceil(
            initialTeamCount /
              2 ** roundIndex
          )
        ),

        matches: Array.from(
          {
            length: expectedMatchCount,
          },
          (_, matchIndex) =>
            roundMatches[
              matchIndex
            ] ?? null
        ),
      };
    }
  );

  // ==========================================
  // RENDER MATCH
  // ==========================================

  const renderMatch = (
    match,
    index
  ) => {
    const team1 = match
      ? teams[match.team1Id]
      : null;

    const team2 = match
      ? teams[match.team2Id]
      : null;

    return (
      <div
        className="match"
        key={
          match?.id ??
          match?.Id ??
          `${eventId}-${index}`
        }
      >
        {[team1, team2].map(
          (team, teamIndex) => {
            const score =
              teamIndex === 0
                ? match?.score1
                : match?.score2;

            const isWinner =
              match?.winnerId &&
              Number(match.winnerId) ===
                Number(team?.Id);

            return (
              <div
                className={`team${
                  isWinner
                    ? " team-winner"
                    : ""
                }`}
                key={teamIndex}
              >
                <div className="team-info">
                  <img
                    className="team-logo"
                    src={
                      team?.Logo ||
                      TEAM_PLACEHOLDER
                    }
                    alt={
                      team
                        ? `${team.Name} logo`
                        : "Team placeholder"
                    }
                  />

                  <span
                    className="team-name"
                    title={
                      team?.Name ??
                      "To be determined"
                    }
                  >
                    {team?.Name ?? "TBD"}
                  </span>
                </div>

                <strong>
                  {match?.status ===
                    "ongoing" ||
                  score == null
                    ? "-"
                    : score}
                </strong>
              </div>
            );
          }
        )}
      </div>
    );
  };

  // ==========================================
  // STATES
  // ==========================================

  if (error) {
    return (
      <div
        className="tournament-status"
        role="alert"
      >
        {error}
      </div>
    );
  }

  if (rounds.length === 0) {
    return (
      <div className="tournament-status">
        No matches in this tournament yet.
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <section
      className="tournament-view"
      aria-label="Tournament bracket"
    >
      <header className="tournament-header">
        <div>
          <span className="tournament-eyebrow">
            COMPETITION
          </span>

          <h1>
            Tournament bracket
          </h1>

          <p>
            {initialTeamCount} teams ·{" "}
            {roundCount} rounds
          </p>
        </div>

        <div className="tournament-controls">
          {tournamentFinished ? (
            <button
              className="play-button"
              onClick={finishTournament}
              disabled={isFinishing}
            >
              {isFinishing
                ? "Finishing..."
                : "Finish Tournament"}
            </button>
          ) : (
            <button
              className="play-button"
              onClick={() =>
                navigate("/match")
              }
            >
              Play
            </button>
          )}
        </div>
      </header>

      {location.state?.notice && (
        <p
          className="tournament-notice"
          role="status"
        >
          {location.state.notice}
        </p>
      )}

      {tournamentFinished && (
        <p
          className="tournament-notice"
          role="status"
        >
          All matches have been completed.
          Finish the tournament to start the
          next event.
        </p>
      )}

      <div className="bracket">
        {rounds.map((round) => (
          <section
            className="bracket-round"
            key={round.index}
          >
            <div className="round-heading">
              <h2>{round.name}</h2>

              <span>
                {round.matches.length}{" "}
                {round.matches.length === 1
                  ? "match"
                  : "matches"}
              </span>
            </div>

            <div className="round-matches">
              {round.matches.map(
                renderMatch
              )}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}