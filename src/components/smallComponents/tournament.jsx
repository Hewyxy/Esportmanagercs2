import "./tournament.css";;

export default function Tournament({name, image, prize}) {
    return (
        <div className="tournament">
            <img src={image} alt={name} />
            <h2>{name}</h2>
            <p>Prize: {prize}</p>
        </div>
    );
}