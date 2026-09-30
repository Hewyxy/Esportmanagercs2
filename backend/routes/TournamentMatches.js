const express = require('express');
const db = require('../db/database');

const router = express.Router();

router.get("/", (req, res) => {
    const matches = db.prepare("SELECT * FROM TournamentMatches").all();

    res.json(matches);
});

// Create the first round as one atomic operation. This makes initialization
// safe when the client requests it more than once (for example in StrictMode).
router.post("/initialize", (req, res) => {
    const { tournamentId, teamIds } = req.body;

    if (tournamentId == null || !Array.isArray(teamIds) || teamIds.length < 2) {
        return res.status(400).json({ error: "Tournament ID and at least two team IDs are required" });
    }

    const normalizedTeamIds = teamIds.map(Number);
    if (normalizedTeamIds.some((id) => !Number.isInteger(id) || id <= 0)
        || new Set(normalizedTeamIds).size !== normalizedTeamIds.length) {
        return res.status(400).json({ error: "Team IDs must be valid and unique" });
    }

    try {
        const initialize = db.transaction(() => {
            const existingRound = db
                .prepare("SELECT COUNT(*) AS count FROM TournamentMatches WHERE tournamentId = ? AND round = 0")
                .get(tournamentId);

            if (existingRound.count > 0) {
                return { created: false };
            }

            const insertMatch = db.prepare(`
                INSERT INTO TournamentMatches
                    (tournamentId, round, team1Id, team2Id, score1, score2, winnerId, status)
                VALUES (?, 0, ?, ?, 0, 0, 0, 'ongoing')
            `);

            for (let index = 0; index + 1 < normalizedTeamIds.length; index += 2) {
                insertMatch.run(tournamentId, normalizedTeamIds[index], normalizedTeamIds[index + 1]);
            }

            return { created: true };
        });

        const result = initialize();
        res.status(result.created ? 201 : 200).json(result);
    } catch (error) {
        console.error("SQL error:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post("/add", (req, res) => {
    const {
        tournamentId,
        round,
        team1Id,
        team2Id,
        score1,
        score2,
        winnerId,
        status
    } = req.body;

    try {
        const result = db
            .prepare(`
                INSERT INTO TournamentMatches
                (
                    tournamentId,
                    round,
                    team1Id,
                    team2Id,
                    score1,
                    score2,
                    winnerId,
                    status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `)
            .run(
                tournamentId,
                round,
                team1Id,
                team2Id,
                score1,
                score2,
                winnerId,
                status
            );

        res.status(201).json({
            message: "Match added successfully",
            matchId: result.lastInsertRowid
        });

    } catch (error) {
        console.error("SQL error:", error);

        res.status(500).json({
            error: error.message
        });
    }
});

module.exports = router;
