const express = require('express');
const db = require('../db/database');

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


module.exports = router;