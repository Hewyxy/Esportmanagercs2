import TeamCard from "../components/smallComponents/teamCard";
export default function Ranking() {
    // The team sorting happens inside the ranking cards.
    return (
        <div>
            <h1 className="ranikng">World ranking</h1>
            <TeamCard />
        </div>
    );
}
