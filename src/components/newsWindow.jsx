import { useEffect, useState } from "react";
import "./newsWindow.css";

export default function NewsWindow() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        fetch("http://localhost:3000/api/news")
            .then((response) => {
                if (!response.ok) throw new Error("Could not load news");
                return response.json();
            })
            .then((items) => {
                if (!cancelled) setNews(Array.isArray(items) ? items : []);
            })
            .catch((loadError) => {
                if (!cancelled) setError(loadError.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, []);

    return (
        <main className="news-page">
            <header className="news-page-heading">
                <div>
                    <span className="news-page-kicker">ESPORTS MANAGER · FEED</span>
                    <h1>News</h1>
                    <p>The latest moves and tournament results from your scene.</p>
                </div>
                <div className="news-page-count">
                    <span className="news-live-dot" />
                    {news.length} {news.length === 1 ? "story" : "stories"}
                </div>
            </header>

            <section className="news-window" aria-label="Latest news">
                <div className="news-window-toolbar">
                    <div className="news-toolbar-title">
                        <span className="news-toolbar-indicator" />
                        <span>Latest updates</span>
                    </div>
                    <span className="news-toolbar-count">LATEST 20</span>
                </div>
                <div className="news-window-content" aria-live="polite">
                {loading ? (
                    <p className="news-empty">Loading news…</p>
                ) : error ? (
                    <p className="news-empty" role="alert">{error}</p>
                ) : news.length === 0 ? (
                    <p className="news-empty">No news yet.</p>
                ) : (
                    <ul className="news-list">
                        {news.map((item) => (
                            <li className={`news-item news-item-${item.type?.toLowerCase() || "default"}`} key={item.id}>
                                {item.type === "Transfer" || item.type === "Release" ? (
                                    <div className="news-transfer-visual" aria-hidden="true">
                                        <div className="news-player-avatar">
                                            {item.playerImage ? (
                                                <img src={item.playerImage} alt="" />
                                            ) : (
                                                <span>{item.playerName?.charAt(0) || "?"}</span>
                                            )}
                                        </div>
                                        <div className="news-team-route">
                                            {item.team1Logo
                                                ? <img src={item.team1Logo} alt="" />
                                                : item.type === "Transfer" && <span className="news-free-agent">FA</span>}
                                            <span>→</span>
                                            {item.team2Logo
                                                ? <img src={item.team2Logo} alt="" />
                                                : item.type === "Release" && <span className="news-free-agent">FA</span>}
                                        </div>
                                    </div>
                                ) : item.team1Logo ? (
                                    <div className="news-feature-logo"><img src={item.team1Logo} alt="" /></div>
                                ) : (
                                    <div className="news-feature-icon" aria-hidden="true">🏆</div>
                                )}
                                <div className="news-item-copy">
                                    <span className="news-type-label">
                                        {item.type === "Winner" ? "TOURNAMENT RESULT" : item.type === "Release" ? "PLAYER RELEASED" : "ROSTER MOVE"}
                                    </span>
                                    <strong>{item.message || getNewsMessage(item)}</strong>
                                    <span className="news-item-detail">
                                        {item.type === "Transfer"
                                            ? `${item.team1Name || "Free Agent"}  →  ${item.team2Name || "New team"}`
                                            : item.type === "Release"
                                                ? `${item.team1Name || "Team"}  →  Free Agent`
                                                : item.tournamentName || "Tournament"}
                                    </span>
                                </div>
                                <span className="news-item-mark" aria-hidden="true">↗</span>
                            </li>
                        ))}
                    </ul>
                )}
                </div>
            </section>
        </main>
    );
}

function getNewsMessage(item) {
    if (item.type === "Winner") {
        return `${item.team1Name || "A team"} won ${item.tournamentName || "a tournament"}`;
    }
    if (item.type === "Transfer") {
        return `${item.playerName || "A player"} joined ${item.team2Name || "a team"}`;
    }
    return item.type || "News";
}

