const express = require('express');
const db = require('../db/database');

const router = express.Router();

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
        const result = db
            .prepare("UPDATE Players SET TeamId = ? WHERE id = ?")
            .run(teamId, playerId);

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
