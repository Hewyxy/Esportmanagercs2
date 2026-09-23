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
            <div className="market-toolbar" aria-label="Market sorting controls">
                <span className="market-sort-label">Sort players</span>
                <div className="market-sort-options" role="group" aria-label="Sort players by">
                    {sortOptions.map((option) => (
                        <button
                            key={option.value}
                            className={`market-sort-option${sortBy === option.value ? " is-active" : ""}`}
                            type="button"
                            aria-pressed={sortBy === option.value}
                            onClick={() => setSortBy(option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
                <button
                    className="market-sort-direction"
                    type="button"
                    onClick={() => setSortDirection((direction) => direction === "asc" ? "desc" : "asc")}
                    aria-label={`Sort ${sortDirection === "asc" ? "descending" : "ascending"}`}
                    title={`Currently ${sortDirection === "asc" ? "ascending" : "descending"}`}
                >
                    <span aria-hidden="true">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    <span>{sortDirection === "asc" ? "Ascending" : "Descending"}</span>
                </button>
            </div>
            <div className="market">
                <PlayerCard sortBy={sortBy} sortDirection={sortDirection} />
            </div>
        </div>
    );
}
