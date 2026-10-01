const express = require('express');
const db = require('../db/database');

const router = express.Router();

// Legacy API for matches linked to a specific team.

//get Matches of specific team
router.get("/:id", (req, res) => {
     const teamId = req.params.id;

    try {
        const team = db
            .prepare("SELECT * FROM TournamentMatches WHERE Id = ?")
            .get(teamId);

        if (!team) {
            return res.status(404).json({
                error: "Team not found"
            });
        }

        res.json(team);

    } catch (error) {

        console.error("SQL error:", error);

        res.status(500).json({
            error: error.message
        });

    }
});

//send Match Data to the DB
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
