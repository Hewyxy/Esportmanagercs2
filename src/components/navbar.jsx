import { Link } from "react-router-dom";
import Profile from "./smallComponents/profile.jsx";

export default function Navbar() {
    // Top navigation bar, with the profile on the right.
    return (
        <header className="header">
            <nav className="navbar">
                <picture>
                    <img src="./logo.png" alt="Logo" className="logo" />
                </picture>

                <ul>
                    <li>
                        <Link className="nav-link" to="/ranking">
                            RANKING
                        </Link>
                    </li>

                    <li>
                        <Link className="nav-link" to="/news">
                            NEWS
                        </Link>
                    </li>

                    <li>
                        <Link className="nav-link" id="senter" to="/">
                            HOME
                        </Link>
                    </li>

                    <li>
                        <Link className="nav-link" to="/market">
                            MARKET
                        </Link>
                    </li>

                    <li>
                        <Link className="nav-link" to="/roaster">
                            TEAM
                        </Link>
                    </li>
                </ul>

                <Profile />
            </nav>
        </header>
    );
}
