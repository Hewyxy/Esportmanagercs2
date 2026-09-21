const express = require('express');
const db = require('../db/database');

const router = express.Router();

//Gets all the teams from the teams table
router.get("/", (req, res) => {

    try {
        const teams = db
            .prepare("SELECT * FROM Teams")
            .all();

        res.json(teams);

    } catch (error) {

        console.error("SQL error:", error);

        res.status(500).json({
            error: error.message
        });

    }
});

//Get a team with a specific id
router.get("/:id", (req, res) => {

    const teamId = req.params.id;

    try {
        const team = db
            .prepare("SELECT * FROM Teams WHERE Id = ?")
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


module.exports = router;