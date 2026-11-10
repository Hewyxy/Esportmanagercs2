import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./profile.css";

const EMPTY_PROFILE = { name: "Loading…", team: "" };
const PROFILE_URL = "http://localhost:3000/api/user/profile/0";

export default function Profile() {
    // Editable profile shown in the site header.
    const [isOpen, setIsOpen] = useState(false);
    const [profile, setProfile] = useState(EMPTY_PROFILE);
    const [draft, setDraft] = useState(profile);
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const lastProfileEvent = useRef(0);
    const [teamInfo, setTeamInfo] = useState(null);
    const [players, setPlayers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        let cancelled = false;
        fetch("http://localhost:3000/api/teams/1")
            .then(async response => {
                if (!response.ok) throw new Error("Could not load team");
                return response.json();
            })
            .then(async team => {
                if (cancelled) return;
                setTeamInfo(team);
                const response = await fetch(`http://localhost:3000/api/players/team/${encodeURIComponent(team.Id)}`);
                if (!response.ok) throw new Error("Could not load roster");
                const roster = await response.json();
                if (!cancelled) setPlayers(roster);
            })
            .catch(error => {
                if (!cancelled) console.error("Error loading profile team:", error);
            });
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        // Load the profile and listen for edits made by other components.
        let cancelled = false;

        fetch(PROFILE_URL)
            .then(async response => {
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Could not load profile");
                return data;
            })
            .then(data => {
                if (cancelled || lastProfileEvent.current) return;
                const loaded = { name: data.Username || "No Name", team: data.TeamName || "No Name" };
                setProfile(loaded);
                setDraft(loaded);
            })
            .catch(fetchError => { if (!cancelled) setError(fetchError.message); });

        const onProfileUpdated = event => {
            lastProfileEvent.current = Date.now();
            const updated = { name: event.detail.username, team: event.detail.teamName };
            setProfile(updated);
            setDraft(updated);
        };

        window.addEventListener("profile-updated", onProfileUpdated);
        return () => {
            cancelled = true;
            window.removeEventListener("profile-updated", onProfileUpdated);
        };
    }, []);

    const openProfile = () => {
        // Start edits from saved data each time, no stale draft mess.
        setDraft(profile);
        setError("");
        setIsEditing(false);
        setIsOpen(true);
        const teamId = teamInfo?.Id ?? 1;
        fetch(`http://localhost:3000/api/players/team/${encodeURIComponent(teamId)}`)
            .then(async response => {
                if (!response.ok) throw new Error("Could not refresh team roster");
                return response.json();
            })
            .then(setPlayers)
            .catch(fetchError => console.error("Error refreshing profile roster:", fetchError));
    };

    const saveProfile = async () => {
        // Validate the fields, save them, and let the other components know.
        const username = draft.name.trim();
        const teamName = draft.team.trim();
        if (!username || !teamName) {
            setError("Enter both your nickname and team name.");
            return;
        }

        setIsSaving(true);
        setError("");
        try {
            const response = await fetch(PROFILE_URL, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, teamName }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Could not save profile");

            const updated = { name: data.username, team: data.teamName };
            setProfile(updated);
            setDraft(updated);
            setIsEditing(false);
            setIsOpen(false);
            window.dispatchEvent(new CustomEvent("profile-updated", {
                detail: { username: data.username, teamName: data.teamName },
            }));
        } catch (saveError) {
            setError(saveError.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <button className="profile" onClick={openProfile} aria-label="Open profile">
                <img src="./profile.png" alt="" className="profile-img" />
                <span className="profile-info">
                    <span className="profile-name">{profile.name}</span>
                    <span className="profile-team">{profile.team}</span>
                </span>
            </button>

            {isOpen && createPortal(
                <div className="profile-overlay" onClick={() => setIsOpen(false)}>
                    <div className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-dialog-title" onClick={(e) => e.stopPropagation()}>
                        <button className="profile-close" onClick={() => setIsOpen(false)} aria-label="Close profile">×</button>
                        <div className="profile-modal-header">
                            <img src="/profile.png" alt="" className="profile-modal-img" />
                            <div className="profile-modal-identity">
                                <span className="profile-modal-eyebrow">Manager Profile</span>
                                {isEditing ? (
                                    <>
                                        <label className="profile-field">
                                            <span>Nickname</span>
                                            <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} maxLength={20} required autoFocus />
                                        </label>
                                        <label className="profile-field">
                                            <span>Team Name</span>
                                            <input value={draft.team} onChange={(e) => setDraft({ ...draft, team: e.target.value })} maxLength={48} required />
                                        </label>
                                    </>
                                ) : (
                                    <>
                                        <h2 id="profile-dialog-title">{profile.name}</h2>
                                        <p className="profile-modal-team">{profile.team}</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <section className="profile-roster" aria-labelledby="profile-roster-title">
                            <div className="profile-roster-heading">
                                <div>
                                    <span>CURRENT ROSTER</span>
                                    <h3 id="profile-roster-title">{teamInfo?.Name || profile.team}</h3>
                                </div>
                                <strong>{players.length}/5</strong>
                            </div>
                            {players.length ? (
                                <ul className="profile-roster-list">
                                    {players.map(player => (
                                        <li className="profile-roster-player" key={player.id}>
                                            <img src={player.Image || "/profile.png"} alt="" />
                                            <span className="profile-roster-player-info">
                                                <strong>{player.Name}</strong>
                                                <small>{player.Role}</small>
                                            </span>
                                            <span className="profile-roster-rating">{player.Rating ?? "—"}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="profile-roster-empty">The roster has not been formed yet.</p>
                            )}
                        </section>

                        {error && <p className="profile-error" role="alert">{error}</p>}
                        <div className="profile-modal-actions">
                            {isEditing ? (
                                <>
                                    <button className="profile-settings" onClick={saveProfile} disabled={isSaving}>
                                        {isSaving ? "Saving…" : "Save"}
                                    </button>
                                    <button className="profile-logout" onClick={() => { setDraft(profile); setIsEditing(false); }}>Cancel</button>
                                </>
                            ) : (
                                <button className="profile-settings" onClick={() => { setDraft(profile); setError(""); setIsEditing(true); }}>Edit Profile</button>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
