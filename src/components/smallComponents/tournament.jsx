import "./tournament.css";

export default function Tournament({ name, image, prize, isCurrent = false, cardRef }) {
    return (
        <article
            className={`tournament${isCurrent ? " tournament--current" : ""}`}
            aria-current={isCurrent ? "true" : undefined}
            ref={cardRef}
        >
            <img src={image} alt={`${name} tournament`} loading="lazy" />
            {isCurrent && <span className="tournament-current-badge">CURRENT</span>}
            <div className="tournament-info">
                <h2 title={name}>{name}</h2>
                <p><span>Prize pool</span><strong>${prize}</strong></p>
            </div>
        </article>
    );
}
