import Tournaments from "../components/smallComponents/tournaments";
import PlayersLineUp from "../components/PlayersLineUp";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  return (
    <div>
      <PlayersLineUp teamName="Falcons" />
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
