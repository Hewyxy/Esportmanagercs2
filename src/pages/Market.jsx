import PlayerCard from "../components/smallComponents/playerCard";
import { useState } from "react";

const sortOptions = [
    { value: "Rating", label: "Total rating" },
    { value: "Firepower", label: "Firepower" },
    { value: "Entrying", label: "Entrying" },
    { value: "Trading", label: "Trading" },
    { value: "Opening", label: "Opening" },
    { value: "Utill", label: "Utility" },
    { value: "Name", label: "Player name" },
    { value: "Team", label: "Team" },
    { value: "Role", label: "Role" },
];

export default function Market() {
    const [sortBy, setSortBy] = useState("Rating");
    const [sortDirection, setSortDirection] = useState("desc");

    return (
        <div>
            <h1>Market</h1>
            <div className="market-toolbar">
                <label htmlFor="market-sort">Sort by</label>
                <select
                    id="market-sort"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <button
                    className="market-sort-direction"
                    type="button"
                    onClick={() => setSortDirection((direction) => direction === "asc" ? "desc" : "asc")}
                    aria-label={`Sort ${sortDirection === "asc" ? "descending" : "ascending"}`}
                >
                    {sortDirection === "asc" ? "Ascending ↑" : "Descending ↓"}
                </button>
            </div>
            <div className="market">
                <PlayerCard sortBy={sortBy} sortDirection={sortDirection} />
            </div>
        </div>
    );
}
