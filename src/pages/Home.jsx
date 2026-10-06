import Tournaments from "../components/smallComponents/tournaments";
import PlayersLineUp from "../components/PlayersLineUp";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

//News injection should be handled here in the future.
export default function Home() {
  // Keep the player's profile and event data for the home page here.
  const [team, setTeam] = useState(null);
  const [tournament, setTournament] = useState(null);
  const [tournamentRank, setRank] = useState(null);
  const [user, setUser] = useState(null);
  const [isTop, setIsTop] = useState(false);
  const [rosterWarning, setRosterWarning] = useState("");
  const [isCheckingRoster, setIsCheckingRoster] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Make sure the roster is full before opening the tournament.
  const handlePlay = async () => {
    setIsCheckingRoster(true);
    setRosterWarning("");

    try {
      const response = await fetch(
        `http://localhost:3000/api/players/team/${encodeURIComponent(team.Id)}`,
      );
      const players = await response.json();
      if (!response.ok) throw new Error("Could not check the team roster.");

      if (players.length < 5) {
        setRosterWarning(
          `Your team needs 5 players to enter. You currently have ${players.length}.`,
        );
        return;
      }

      navigate("/tournament");
    } catch (error) {
      console.error("Could not check team roster:", error);
      setRosterWarning("Could not check your roster. Please try again.");
    } finally {
      setIsCheckingRoster(false);
    }
  };


  useEffect(() => {
    // Load our profile and team.
    fetch("http://localhost:3000/api/user/profile/0")
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error("Error fetching user:", error));

    fetch("http://localhost:3000/api/teams/1")
      .then((response) => response.json())
      .then((data) => setTeam(data))
      .catch((error) => console.error("Error fetching team:", error));
  }, []);

  useEffect(() => {
    // Fetch the details for the current event.
    if (!user?.CurrentEvent) return;

    fetch(`http://localhost:3000/api/events/${user.CurrentEvent}`)
      .then((response) => response.json())
      .then((data) => setTournament(data))
      .catch((error) => console.error("Error fetching tournament:", error));
  }, [user]);

  useEffect(() => {
    // The event format tells me how many teams qualify.
    if (!tournament) return;

    if (tournament.TypeOfEvent == 1) {
      setRank(8);
    } else if (tournament.TypeOfEvent == 2) {
      setRank(16);
    } else if (tournament.TypeOfEvent == 4) {
      setRank(32);
    } else if (tournament.TypeOfEvent == 3) {
      setRank(35);
    }
  }, [tournament]);

  useEffect(() => {
    // Check whether our team made the tournament cutoff.
    if (!team?.Id || !tournamentRank) return;

    fetch(`http://localhost:3000/api/teams/top/${team.Id}/${tournamentRank}`)
      .then((response) => response.json())
      .then((data) => setIsTop(data.isTop))
      .catch((error) => console.error("Error checking team rank:", error));
  }, [team, tournamentRank]);

  return (
    <div>
      {location.state?.tournamentWinner && (
        <div className="tournament-winner-notice" role="status">
          <span className="tournament-winner-notice__icon" aria-hidden="true"></span>
          <span>
            <strong>{location.state.tournamentWinner}</strong> won the tournament!
            Your next event is ready.
          </span>
          {location.state.tournamentTransfers?.length > 0 && (
            <span className="tournament-winner-notice__transfers">
              Roster moves: {location.state.tournamentTransfers.map((transfer) =>
                `${transfer.teamName}: ${transfer.signedPlayer} joined, ${transfer.releasedPlayer} left`,
              ).join(" · ")}
            </span>
          )}
        </div>
      )}
      <PlayersLineUp teamId={team?.Id} />

      <div className="next-event">
        <div className="next-event-info">
          <span className="next-event-label">NEXT EVENT</span>

          {isTop ? (
            <p className="NextEvent">{tournament?.Name}</p>
          ) : (
            <p className="NextEvent">Break</p>
          )}
          {rosterWarning && (
            <p className="roster-warning" role="alert">
              {rosterWarning}
            </p>
          )}
        </div>
        {isTop ? (
          <button
            className="PlayButton"
            onClick={handlePlay}
            disabled={isCheckingRoster || !team?.Id}
          >
            {isCheckingRoster ? "Checking..." : "Play"}
          </button>
        ) : (
          <button className="PlayButton" onClick={() => navigate("/tournament")}>Skip</button>
        )}
      </div>

      <Tournaments />
    </div>
  );
}
