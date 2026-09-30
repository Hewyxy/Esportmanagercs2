import { useEffect, useState } from "react";
import Tournament from "../components/tournament";

const API_URL = "http://localhost:3000/api";

const getTournamentSize = (typeOfEvent) => {
  switch (Number(typeOfEvent)) {
    case 1:
      return 8;
    case 2:
      return 16;
    case 4:
      return 32;
    case 3:
      return 16;
    default:
      return null;
  }
};

const shuffleTeams = (teams) => {
  const shuffled = [...teams];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}): ${url}`);
  }
  return response.json();
}

export default function TournamentPage() {
  const [eventId, setEventId] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function prepareTournament() {
      setIsReady(false);
      setError("");

      try {
        const user = await fetchJson(`${API_URL}/user/profile/0`);
        if (!user.CurrentEvent) {
          if (!cancelled) {
            setEventId(null);
            setIsReady(true);
          }
          return;
        }

        const tournament = await fetchJson(
          `${API_URL}/events/${user.CurrentEvent}`,
        );
        const tournamentSize = getTournamentSize(tournament.TypeOfEvent);
        if (!tournamentSize) {
          throw new Error("Unknown tournament format.");
        }

        const allMatches = await fetchJson(`${API_URL}/tournamentmatches`);
        const eventMatches = allMatches.filter(
          (match) => Number(match.tournamentId) === Number(user.CurrentEvent),
        );

        if (eventMatches.length === 0) {
          const teamsUrl = Number(tournament.TypeOfEvent) === 3
            ? `${API_URL}/teams/bottom/16`
            : `${API_URL}/teams/top/${tournamentSize}`;
          const teams = await fetchJson(teamsUrl);
          const uniqueTeams = [...new Map(teams.map((team) => [team.Id, team])).values()];
          const shuffledTeams = shuffleTeams(uniqueTeams);

          await fetchJson(`${API_URL}/tournamentmatches/initialize`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tournamentId: user.CurrentEvent,
              teamIds: shuffledTeams.map((team) => team.Id),
            }),
          });
        }

        if (!cancelled) {
          setEventId(user.CurrentEvent);
          setIsReady(true);
        }
      } catch (loadError) {
        console.error("Error loading tournament:", loadError);
        if (!cancelled) {
          setError("Could not load the tournament. Please try again later.");
          setIsReady(true);
        }
      }
    }

    prepareTournament();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!isReady) {
    return <div className="tournament-status">Loading tournament…</div>;
  }

  if (error) {
    return <div className="tournament-status" role="alert">{error}</div>;
  }

  if (!eventId) {
    return <div className="tournament-status">No active tournament.</div>;
  }

  return <Tournament eventId={eventId} />;
}
