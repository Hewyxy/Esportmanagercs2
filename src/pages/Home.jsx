import Tournaments from "../components/smallComponents/tournaments";
import PlayersLineUp from "../components/PlayersLineUp";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [team, setTeam] = useState([]);
  
      useEffect(() => {
          fetch("http://localhost:3000/api/teams/1")
              .then(response => response.json())
              .then(data => setTeam(data))
              .catch(error => console.error("Error fetching team:", error));
      }, []);

  return (
    <div>
      <PlayersLineUp teamId={team.Id} />
      <div className="next-event">
        <div className="next-event-info">
          <span className="next-event-label">NEXT EVENT</span>
          <p className="NextEvent">Blast Bounty</p>
        </div>
        <button className="PlayButton"> Play </button>
      </div>
      <Tournaments />
    </div>
  );
}
