import Tournament from "../components/smallComponents/tournament";

export default function Home() {
    return (
        <div className="page">
            <h1>Tournaments</h1>
            <div className="tournament-container">
                <Tournament name="Esports World Cup" image="/path/to/image1.jpg" prize="$2,000,000" />
                <Tournament name="PGL Major" image="/path/to/image2.jpg" prize="$5,000,000" />
                <Tournament name="BLAST Premier" image="/path/to/image3.jpg" prize="$2,500,000" />
            </div>
            
        </div>
    );
}