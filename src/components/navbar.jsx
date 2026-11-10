import { NavLink } from "react-router-dom";
import Profile from "./smallComponents/profile.jsx";

const links = [
    { to: "/", label: "Home", end: true },
    { to: "/ranking", label: "Ranking" },
    { to: "/news", label: "News" },
    { to: "/market", label: "Transfer Market" },
    { to: "/roaster", label: "Team" },
];

export default function Navbar() {
    return (
        <aside className="sidebar">
            <NavLink className="sidebar-brand" to="/" aria-label="CS2 Manager — home">
                <img src="/assets/logo.png" alt="" className="sidebar-logo" />
                <span>CS2 MANAGER</span>
            </NavLink>

            <nav className="sidebar-nav" aria-label="Main navigation">
                <span className="sidebar-heading">Menu</span>
                {links.map(({ to, label, end }) => (
                    <NavLink key={to} to={to} end={end} title={label} aria-label={label} className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
                        <span className="sidebar-link-marker" aria-hidden="true" />
                        {label}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-profile"><Profile /></div>
        </aside>
    );
}
