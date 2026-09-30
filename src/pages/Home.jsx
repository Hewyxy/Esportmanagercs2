import Tournaments from "../components/smallComponents/tournaments";
import PlayersLineUp from "../components/PlayersLineUp";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [team, setTeam] = useState(null);
  const [tournament, setTournament] = useState(null);
  const [user, setUser] = useState(null);

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
console.log(user)

  return (
    <div>
      <PlayersLineUp teamId={team?.Id} />
      <div className="next-event">
        <div className="next-event-info">
          <span className="next-event-label">NEXT EVENT</span>
          <p className="NextEvent">{tournament?.Name}</p>
        </div>
        <button className="PlayButton"> Play </button>
      </div>
      <Tournaments />
    </div>
  );
}
