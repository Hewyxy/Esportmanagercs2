const express = require('express');
const db = require('../db/database');

const router = express.Router();

//Gets all the events from the events table
router.get("/", (req, res) => {

    try {
        const teams = db
            .prepare("SELECT * FROM User")
            .all();

        res.json(teams);

    } catch (error) {

        console.error("SQL error:", error);

        res.status(500).json({
            error: error.message
        });

    }
});

//Get a user with a specific email from the User table      
router.get("/:email", (req, res) => {
    try {
        const user = db
            .prepare("SELECT * FROM User WHERE email = ?")
            .get(req.params.email);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("SQL error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
