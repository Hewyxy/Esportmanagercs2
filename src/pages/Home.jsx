import Tournament from "../components/smallComponents/tournament";
import {useEffect, useState} from "react";

export default function Home() {
    const [tournaments, setTournaments] = useState([]);

    useEffect(() => {
        // Fetch tournaments from the API
        const fetchTournaments = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/events");
                if (!response.ok) {
                    throw new Error("Failed to fetch tournaments");
                }
                const data = await response.json();
                setTournaments(data);
            } catch (error) {
                console.error("Error fetching tournaments:", error);
            }
        };
        fetchTournaments();
    }, []);
    
    return (
        
        <div>
            <h1>Tournaments</h1>
            <div className="tournament-container">
                {tournaments.map((tournament) => (
                    
                    <Tournament
                        key={tournament.id}
                        name={tournament.Name}
                        image={tournament.BackgroundImage}
                        prize={tournament.PrizePool.toLocaleString()}
                    />
                ))}
                            </div>
            
        </div>
    );
}