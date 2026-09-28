import Match from "../components/match.jsx";

export default function Battle() {
    return (
        <div> 
            <Match team1Id={3} team2Id={2} />
            <Match team1Id={1} team2Id={2} />
        </div>
    );
    
}
