const express = require('express');
const db = require('../db/database');
const { route } = require('./Users');

const router = express.Router();

router.get("/", (req, res) => {

    try {
        const events = db
            .prepare("SELECT * FROM Events")
            .all();

        res.json(events);

    } catch (error) {

        console.error("SQL error:", error);

        res.status(500).json({
            error: error.message
        });

    }
});

//Get an event with a specific id
router.get("/:id", (req, res) => {

    const eventId = req.params.id;

    try {
        const event = db
            .prepare("SELECT * FROM Events WHERE Id = ?")
            .get(eventId);

        if (!event) {
            return res.status(404).json({
                error: "Event not found"
            });
        }
    } catch (error) {

        console.error("SQL error:", error);

        res.status(500).json({
            error: error.message
        });

    }
});


module.exports = router;