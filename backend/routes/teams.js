const express = require('express');
const db = require('../db/database');

const router = express.Router();

// Team API: rosters, points, and picking tournament teams by ranking.

const {
    getTopTeams,
    getBottomTeams,
    getTeamSeeds,
    isTeamInTop
} = require("../gameLogic/seeds");


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

//Change team name
router.put("/:id", (req, res) => {

    const teamId = req.params.id;
    const { Name } = req.body;


    try {
        const result = db
            .prepare("UPDATE Teams SET Name = ? WHERE Id = ?")
            .run(Name, teamId);
        
        if (result.changes === 0) {
            return res.status(404).json({
                error: "Team not found"
            });
        }
        res.json({ message: "Team updated successfully" });

    } catch (error) {

        console.error("SQL error:", error);

        res.status(500).json({
            error: error.message
        });

    }
});

// Update team points
router.patch("/:id/points", (req, res) => {

    const teamId = req.params.id;
    const { Points } = req.body;

    if (Points === undefined || Points === null) {
        return res.status(400).json({
            error: "Points are required"
        });
    }

    try {
        const result = db
            .prepare("UPDATE Teams SET Points = ? WHERE Id = ?")
            .run(Points, teamId);

        if (result.changes === 0) {
            return res.status(404).json({
                error: "Team not found"
            });
        }

        const team = db
            .prepare("SELECT * FROM Teams WHERE Id = ?")
            .get(teamId);

        res.json(team);

    } catch (error) {

        console.error("SQL error:", error);

        res.status(500).json({
            error: error.message
        });

    }
});

router.get("/top/:count", (req, res) => {
    try {
        const count = Number(req.params.count);

        const teams = getTopTeams(count);

        res.json(teams);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});

router.get("/bottom/:count", (req, res) => {
    try {
        const count = Number(req.params.count);

        const teams = getBottomTeams(count);

        res.json(teams);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});

router.get("/seeds", (req, res) => {
    try {
        const teams = getTeamSeeds();

        res.json(teams);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});

router.get("/top/:teamId/:count", (req, res) => {
    try {
        const teamId = Number(req.params.teamId);
        const count = Number(req.params.count);

        const isTop = isTeamInTop(teamId, count);

        res.json({ isTop });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});

module.exports = router;
