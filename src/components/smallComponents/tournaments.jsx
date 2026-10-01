import Tournament from "./tournamentCard";
import { useEffect, useRef, useState } from "react";

export default function Tournaments() {
    // Load the tournament schedule and remember the current event's card.
    const [tournaments, setTournaments] = useState([]);
        const [currentEventId, setCurrentEventId] = useState(null);
        const tournamentRefs = useRef({});
    
        useEffect(() => {
            let cancelled = false;
    
            Promise.all([
                fetch("http://localhost:3000/api/events").then(async response => {
                    if (!response.ok) throw new Error("Failed to fetch tournaments");
                    return response.json();
                }),
                fetch("http://localhost:3000/api/user/").then(async response => {
                    if (!response.ok) throw new Error("Failed to fetch current tournament");
                    return response.json();
                }),
            ])
                .then(([events, profile]) => {
                    if (cancelled) return;
                    setTournaments(events);
                    const currentProfile = profile.find(user => String(user.id) === "0");
                    setCurrentEventId(currentProfile?.CurrentEvent ?? null);
                })
                .catch(error => console.error("Could not load tournaments:", error));
    
            return () => { cancelled = true; };
        }, []);
    
        useEffect(() => {
            // Scroll the carousel to the current tournament once it is loaded.
            if (currentEventId == null) return;
            const currentCard = tournamentRefs.current[currentEventId];
            if (currentCard) {
                currentCard.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            }
        }, [currentEventId, tournaments]);
        
        return (
            
            <main className="tournament-page">
                <h1>Tournaments</h1>
                <div className="tournament-container">
                    {tournaments.map((tournament) => (
                        
                        <Tournament
                            key={tournament.id}
                            cardRef={element => { tournamentRefs.current[tournament.id] = element; }}
                            name={tournament.Name}
                            image={tournament.BackgorundIMG}
                            prize={(tournament.PrizePool ?? 0).toLocaleString()}
                            isCurrent={String(tournament.id) === String(currentEventId)}
                        />
                    ))}
                                </div>
                
            </main>
        );
}
