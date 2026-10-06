const express = require("express");
const router = express.Router();

const db = require("../db/database");

// GET the latest 20 news items
router.get("/", (req, res) => {
    try {
        const news = db.prepare(`
            SELECT *
            FROM News
            ORDER BY id DESC
            LIMIT 20
        `).all();

        res.json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get news" });
    }
});


// GET news by id
router.get("/:id", (req, res) => {
    try {
        const news = db.prepare(`
            SELECT *
            FROM News
            WHERE id = ?
        `).get(req.params.id);

        if (!news) {
            return res.status(404).json({ error: "News not found" });
        }

        res.json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get news" });
    }
});


// POST news
router.post("/", (req, res) => {
    try {
        const {
            type,
            team1Logo,
            team2Logo,
            playerId,
            tournamentName,
            playerName,
            playerImage,
            team1Name,
            team2Name,
            message
        } = req.body;

        const result = db.prepare(`
            INSERT INTO News (
                type,
                team1Logo,
                team2Logo,
                playerId,
                tournamentName,
                playerName,
                playerImage,
                team1Name,
                team2Name,
                message
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            type,
            team1Logo,
            team2Logo,
            playerId,
            tournamentName,
            playerName,
            playerImage,
            team1Name,
            team2Name,
            message
        );

        const news = db.prepare(`
            SELECT *
            FROM News
            WHERE id = ?
        `).get(result.lastInsertRowid);

        res.status(201).json(news);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create news" });
    }
});


// DELETE news
router.delete("/:id", (req, res) => {
    try {
        const result = db.prepare(`
            DELETE FROM News
            WHERE id = ?
        `).run(req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({ error: "News not found" });
        }

        res.json({ message: "News deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete news" });
    }
});


module.exports = router;
