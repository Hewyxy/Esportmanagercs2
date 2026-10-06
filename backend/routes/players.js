const express = require('express');
const db = require('../db/database');

const router = express.Router();

// List players, find a team's roster, or move a player to another team.

// Gets all the players
router.get("/", (req, res) => {
    try {
        const players = db
            .prepare(`SELECT Players.*, COALESCE(Teams.Name, Players.Team) AS Team
                      FROM Players LEFT JOIN Teams ON Teams.Id = Players.TeamId`)
            .all();

        res.json(players);

    } catch (error) {
        console.error("SQL error:", error);

        res.status(500).json({
            error: error.message
        });
    }
});

// Players assigned to a team ID (0 means free agents).
router.get("/team/:teamId", (req, res) => {
    const teamId = Number(req.params.teamId);
    if (!Number.isInteger(teamId)) return res.status(400).json({ error: "Valid team ID is required" });

    try {
        const players = db
            .prepare(`SELECT Players.*, COALESCE(Teams.Name, Players.Team) AS Team
                      FROM Players LEFT JOIN Teams ON Teams.Id = Players.TeamId
                      WHERE Players.TeamId = ?`)
            .all(teamId);

        res.json(players);

    } catch (error) {
        console.error("SQL error:", error);

        res.status(500).json({
            error: error.message
        });
    }
});

// Change player's team
router.patch("/:id/team", (req, res) => {
    const playerId = req.params.id;
    const teamId = Number(req.body.teamId);

    if (!Number.isInteger(teamId) || teamId < 0) {
        return res.status(400).json({
            error: "Valid team ID is required"
        });
    }

    try {
        if (teamId !== 0 && !db.prepare("SELECT Id FROM Teams WHERE Id = ?").get(teamId)) {
            return res.status(404).json({ error: "Team not found" });
        }
        const movePlayer = db.transaction(() => {
            const previous = db.prepare(`
                SELECT Players.id, Players.Name AS playerName, Players.Image AS playerImage, Players.TeamId,
                       Players.TeamImage, Teams.Name AS teamName, Teams.Logo AS teamLogo
                FROM Players LEFT JOIN Teams ON Teams.Id = Players.TeamId
                WHERE Players.id = ?
            `).get(playerId);
            if (!previous) return { changes: 0 };

            const destination = teamId === 0 ? null : db.prepare(
                "SELECT Name, Logo FROM Teams WHERE Id = ?"
            ).get(teamId);
            db.prepare(`
                UPDATE Players
                SET TeamId = ?, Team = COALESCE((SELECT Name FROM Teams WHERE Id = ?), 'None')
                WHERE id = ?
            `).run(teamId, teamId, playerId);

            if (Number(previous.TeamId) !== teamId) {
                const isRelease = teamId === 0;
                const fromName = previous.teamName || "Free Agent";
                const toName = destination?.Name || "Free Agent";
                const newsType = isRelease ? "Release" : "Transfer";
                const message = isRelease
                    ? `${previous.playerName} was released by ${fromName}`
                    : `${previous.playerName} joined ${toName}${previous.teamName ? ` from ${fromName}` : ""}`;
                db.prepare(`
                    INSERT INTO News
                        (type, team1Logo, team2Logo, playerId, playerName, playerImage, team1Name, team2Name, message)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `).run(
                    newsType,
                    previous.teamLogo || previous.TeamImage || null,
                    destination?.Logo || null,
                    previous.id,
                    previous.playerName,
                    previous.playerImage || null,
                    fromName,
                    toName,
                    message
                );
            }

            return { changes: 1 };
        });
        const result = movePlayer();

        if (result.changes === 0) {
            return res.status(404).json({
                error: "Player not found"
            });
        }

        const player = db
            .prepare(`SELECT Players.*, COALESCE(Teams.Name, Players.Team) AS Team
                      FROM Players LEFT JOIN Teams ON Teams.Id = Players.TeamId
                      WHERE Players.id = ?`)
            .get(playerId);

        res.json(player);

    } catch (error) {
        console.error("SQL error:", error);

        res.status(500).json({
            error: error.message
        });
    }
});


module.exports = router;
