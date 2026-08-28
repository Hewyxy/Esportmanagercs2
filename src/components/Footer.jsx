import "./footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">

                <div className="footer-brand">
                    <img src="/path/to/logo.png" alt="Esport Manager Logo" />
                    <p>
                        Build your team. Manage your players.
                        Become the best manager.
                    </p>
                </div>

                <div className="footer-section">
                    <h3>Navigation</h3>
                    <a href="/">Home</a>
                    <a href="/teams">Teams</a>
                    <a href="/players">Players</a>
                    <a href="/tournaments">Tournaments</a>
                </div>

                <div className="footer-section">
                    <h3>Social</h3>
                    <a href="#">Discord</a>
                    <a href="#">GitHub</a>
                    <a href="#">Instagram</a>
                    <a href="#">YouTube</a>
                </div>

            </div>

            <div className="footer-bottom">
                <p>© 2026 Esport Manager CS2. All rights reserved.</p>

                <div className="footer-bottom-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
