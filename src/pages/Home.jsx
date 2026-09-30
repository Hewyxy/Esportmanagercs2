import Tournaments from "../components/smallComponents/tournaments";
import PlayersLineUp from "../components/PlayersLineUp";
import { useEffect, useState } from "react";

export default function Home() {
  const [team, setTeam] = useState(null);
  const [tournament, setTournament] = useState(null);
  const [tournamentRank, setRank] = useState(null);
  const [user, setUser] = useState(null);
  const [isTop, setIsTop] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/user/profile/0")
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error("Error fetching user:", error));

    fetch("http://localhost:3000/api/teams/1")
      .then(response => response.json())
      .then(data => setTeam(data))
      .catch(error => console.error("Error fetching team:", error));
  }, []);

  useEffect(() => {
    if (!user?.CurrentEvent) return;

    fetch(`http://localhost:3000/api/events/${user.CurrentEvent}`)
      .then(response => response.json())
      .then(data => setTournament(data))
      .catch(error => console.error("Error fetching tournament:", error));
  }, [user]);

  useEffect(() => {
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
    if (!team?.Id || !tournamentRank) return;

    fetch(
      `http://localhost:3000/api/teams/top/${team.Id}/${tournamentRank}`
    )
      .then(response => response.json())
      .then(data => setIsTop(data.isTop))
      .catch(error => console.error("Error checking team rank:", error));
  }, [team, tournamentRank]);

  return (
    <div>
      <PlayersLineUp teamId={team?.Id} />

      <div className="next-event">
        <div className="next-event-info">
          <span className="next-event-label">NEXT EVENT</span>

          {isTop ? (
            <p className="NextEvent">{tournament?.Name}</p>
          ) : (
            <p className="NextEvent">Break</p>
          )}

        </div>
        {isTop ? (
            <button className="PlayButton">Play</button>
          ) : (
            <button className="PlayButton">Skip</button>
          )}
        
      </div>

      <Tournaments />
    </div>
  );
}