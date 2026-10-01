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
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        // Grab our team too, for the header.
        fetch("http://localhost:3000/api/teams/1")
            .then(response => response.json())
            .then(data => setPlayers(data))
            .catch(error => console.error("Error loading team:", error));
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
        setIsOpen(true);
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
                <img src="/src/assets/profile.png" alt="" className="profile-img" />
                <span className="profile-info">
                    <span className="profile-name">{profile.name}</span>
                    <span className="profile-team">{profile.team}</span>
                </span>
            </button>

            {isOpen && createPortal(
                <div className="profile-overlay" onClick={() => setIsOpen(false)}>
                    <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="profile-close" onClick={() => setIsOpen(false)} aria-label="Close profile">×</button>
                        <img src="/src/assets/profile.png" alt="Profile" className="profile-modal-img" />

                        <label className="profile-field">
                                <span>Nickname</span>
                            <input
                                value={draft.name}
                                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                                maxLength={32}
                                required
                                autoFocus
                            />
                        </label>
                        <label className="profile-field">
                            <span>Team name</span>
                            <input
                                value={draft.team}
                                onChange={(e) => setDraft({ ...draft, team: e.target.value })}
                                maxLength={48}
                                required
                            />
                        </label>

                        <div className="profile-stats">
                            <div><span>Balance</span><strong>$10,000</strong></div>
                            <div><span>Reputation</span><strong>100</strong></div>
                        </div>
                        {error && <p className="profile-error" role="alert">{error}</p>}
                        <button className="profile-settings" onClick={saveProfile} disabled={isSaving}>
                            {isSaving ? "Saving…" : "Save changes"}
                        </button>
                        <button className="profile-logout" onClick={() => setIsOpen(false)}>Cancel</button>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
