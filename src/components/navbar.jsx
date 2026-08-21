import { useState } from "react";
import Profile from "./smallComponents/profile.jsx";

const link = [
  {name: "Ranking", href: "/ranking"},
  {name: "Contracts", href: "/contracts"},
  {name: "Home", href: "/"},
  {name: "Transfers", href: "/transfers"},
  {name: "Team", href: "/team"},
];

export default function Navbar() {
    return (
        <header className="header">
            <nav className="navbar">
                <picture>
                    <img src="/src/assets/logo.png" alt="Logo" className="logo" />
                </picture>
                <ul>
                    <li>
                        <a className="nav-link" href="/">
                            RANKING
                        </a>
                    </li>
                    <li>
                        <a className="nav-link" href="/">
                            TRANSFERS
                        </a>
                    </li>
                    <li>
                        <a className="nav-link" id="senter" href="/">
                            HOME
                        </a>
                    </li>
                    <li>
                        <a className="nav-link" href="/">
                            CONTRACTS
                        </a>
                    </li>
                    <li>
                        <a className="nav-link" href="/">
                            TEAM
                        </a>
                    </li>
                </ul>
                <Profile />
            </nav>
        </header>
    );
}