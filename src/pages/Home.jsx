import Tournament from "../components/smallComponents/tournament";

export default function Home() {
    return (
        <div className="page">
            <h1>Tournaments</h1>
            <div className="tournament-container">
                <Tournament name="Esports World Cup" image="/src/assets/EWC.png" prize="$2,000,000" />
                <Tournament name="PGL Major" image="/src/assets/PGL.png" prize="$5,000,000" />
                <Tournament name="BLAST Premier" image="/src/assets/BLAST.png" prize="$2,500,000" />
            </div>
            
        </div>
    );
}