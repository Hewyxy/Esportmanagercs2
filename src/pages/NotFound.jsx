export default function NotFound() {
    // Show this page when the URL is not one of our routes.
    return (
        <div className="not-found">
            <h1>404</h1>
            <h2>Page not found</h2>
            <p>The page you're looking for doesn't exist.</p>
        </div>
    );
}
