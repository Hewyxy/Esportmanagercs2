import { MoveRight } from "lucide-react";

export default function News({
  isOpen,
  Type,
  title = "Confirm Action",
  team1,
  team2 = null,
  tournament = null,
  player,
}) {
  if (!isOpen) {
    return null;
  }

  if (Type === "Transfer") {
    if (!player || !team1 || !team2) {
      return null;
    }

    return (
      <div>
        {player.Image && (
          <img src={player.Image} alt={player.Name} />
        )}

        {team1.Logo && (
          <img src={team1.Logo} alt={team1.Name} />
        )}

        <MoveRight size={24} />

        {team2.Logo && (
          <img src={team2.Logo} alt={team2.Name} />
        )}

        <p>
          {player.Name} transferred from {team1.Name} to {team2.Name}
        </p>
      </div>
    );
  }

  if (Type === "Winner") {
    if (!team1 || !tournament) {
      return null;
    }

    return (
      <div>
        {team1.Logo && (
          <img src={team1.Logo} alt={team1.Name} />
        )}

        <p>
          {team1.Name} won {tournament.Name}
        </p>
      </div>
    );
  }

  return null;
}
