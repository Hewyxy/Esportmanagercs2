import { useState } from "react";
import { createPortal } from "react-dom";
import "./profile.css";

const PROFILE_KEY = "esportmanager-profile";
const DEFAULT_PROFILE = { name: "John Doe", team: "Cool Team" };

function readProfile() {
    try {
        return { ...DEFAULT_PROFILE, ...JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}") };
    } catch {
        return DEFAULT_PROFILE;
    }
}

export default function Profile() {
    const [isOpen, setIsOpen] = useState(false);
    const [profile, setProfile] = useState(readProfile);
    const [draft, setDraft] = useState(profile);

    const openProfile = () => {
        setDraft(profile);
        setIsOpen(true);
    };

    const saveProfile = () => {
        const updated = {
            name: draft.name.trim() || DEFAULT_PROFILE.name,
            team: draft.team.trim() || DEFAULT_PROFILE.team,
        };
        setProfile(updated);
        localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
        setIsOpen(false);
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
                            <span>Your name</span>
                            <input
                                value={draft.name}
                                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                                maxLength={40}
                                autoFocus
                            />
                        </label>
                        <label className="profile-field">
                            <span>Team name</span>
                            <input
                                value={draft.team}
                                onChange={(e) => setDraft({ ...draft, team: e.target.value })}
                                maxLength={40}
                            />
                        </label>

                        <div className="profile-stats">
                            <div><span>Balance</span><strong>$10,000</strong></div>
                            <div><span>Reputation</span><strong>100</strong></div>
                        </div>
                        <button className="profile-settings" onClick={saveProfile}>Save changes</button>
                        <button className="profile-logout" onClick={() => setIsOpen(false)}>Cancel</button>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
