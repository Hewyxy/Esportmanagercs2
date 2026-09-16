const express = require('express');
const db = require('../db/database');

const router = express.Router();

// Gets all the players
router.get("/", (req, res) => {
    try {
        const players = db
            .prepare("SELECT * FROM Players")
            .all();

        res.json(players);

    } catch (error) {
        console.error("SQL error:", error);

        res.status(500).json({
            error: error.message
        });
    }
});

// Players from the same team
router.get("/sameteam/:teamName", (req, res) => {
    const teamName = req.params.teamName;

    try {
        const players = db
            .prepare("SELECT * FROM Players WHERE Team = ?")
            .all(teamName);

        res.json(players);

    } catch (error) {
        console.error("SQL error:", error);

        res.status(500).json({
            error: error.message
        });
    }
});

module.exports = router;