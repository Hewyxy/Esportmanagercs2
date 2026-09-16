import { useState } from "react";
import { createPortal } from "react-dom";
import "./profile.css";

export default function Profile() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Profile in Navbar */}
            <div
                className="profile"
                onClick={() => setIsOpen(true)}
            >
                <img
                    src="/src/assets/profile.png"
                    alt="Profile"
                    className="profile-img"
                />

                <div className="profile-info">
                    <h1 className="profile-name">John Doe</h1>
                    <p className="profile-team">Cool Team</p>
                </div>
            </div>

            {/* Profile Window */}
            {isOpen &&
                createPortal(
                    <div
                        className="profile-overlay"
                        onClick={() => setIsOpen(false)}
                    >
                        <div
                            className="profile-modal"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="profile-close"
                                onClick={() => setIsOpen(false)}
                            >
                                ×
                            </button>

                            <img
                                src="/src/assets/profile.png"
                                alt="Profile"
                                className="profile-modal-img"
                            />

                            <div className="profile-modal-user">
                              <h2>John Doe</h2>
                              <button className="edit-profile-btn">
                                  ✎
                              </button>
                          </div>

                          <div className="profile-modal-team">
                              <p>Cool Team</p>
                              <button className="edit-profile-btn">
                                  ✎
                              </button>
                          </div>

                            <div className="profile-stats">
                                <div>
                                    <span>Balance</span>
                                    <strong>$10,000</strong>
                                </div>

                                <div>
                                    <span>Reputation</span>
                                    <strong>100</strong>
                                </div>
                            </div>

                            <button className="profile-settings">
                                Settings
                            </button>

                            <button className="profile-logout">
                                Log Out
                            </button>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}