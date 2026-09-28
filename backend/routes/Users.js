const express = require('express');
const db = require('../db/database');

const router = express.Router();

// The local game profile is stored in the reserved user row with id 0.
router.get("/profile/:id", (req, res) => {
    if (req.params.id !== "0") {
        return res.status(404).json({ error: "Profile not found" });
    }

    try {
        const profile = db.prepare("SELECT id, Username, TeamName FROM User WHERE id = 0").get();
        if (!profile) return res.status(404).json({ error: "Profile not found" });
        res.json(profile);
    } catch (error) {
        console.error("SQL error:", error);
        res.status(500).json({ error: error.message });
    }
});

router.put("/profile/0", (req, res) => {
    const username = typeof req.body.username === "string" ? req.body.username.trim() : "";
    const teamName = typeof req.body.teamName === "string" ? req.body.teamName.trim() : "";

    if (!username || !teamName) {
        return res.status(400).json({ error: "Nickname and team name are required" });
    }

    try {
        const saveProfile = db.transaction(() => {
            const existingProfile = db.prepare("SELECT id FROM User WHERE id = 0").get();
            if (existingProfile) {
                db.prepare("UPDATE User SET Username = ?, TeamName = ? WHERE id = 0").run(username, teamName);
            } else {
                db.prepare("INSERT INTO User (id, Username, TeamName) VALUES (0, ?, ?)").run(username, teamName);
            }

            const team = db.prepare("UPDATE Teams SET Name = ? WHERE Id = 1").run(teamName);
            if (team.changes === 0) {
                db.prepare("INSERT INTO Teams (Id, Name, Trophy, Points, Logo) VALUES (1, ?, 0, 0, NULL)").run(teamName);
            }
        });
        saveProfile();

        res.json({ id: 0, username, teamName });
    } catch (error) {
        console.error("SQL error:", error);
        res.status(500).json({ error: error.message });
    }
});

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

//Register a new user
router.post("/register", (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = db
            .prepare("SELECT * FROM User WHERE email = ?")
            .get(email);
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
    
        const result = db
            .prepare("INSERT INTO User (email, password) VALUES (?, ?)")
            .run(email, password);
        
        res.status(201).json({ message: "User registered successfully", userId: result.lastInsertRowid });
    }

    catch (error) {

        console.error("SQL error:", error);

        res.status(500).json({
            error: error.message
        });

    }
});


// Login
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    try {
        const user = db
            .prepare("SELECT * FROM User WHERE email = ?")
            .get(email);

        // User doesn't exist
        if (!user) {
            return res.status(400).json({
                error: "Invalid email or password"
            });
        }

        // Check password
        if (user.password !== password) {
            return res.status(400).json({
                error: "Invalid email or password"
            });
        }

        // Login successful
        res.status(200).json({
            message: "Login successful",
            userId: user.id,
            email: user.email
        });

    } catch (error) {

        console.error("SQL error:", error);

        res.status(500).json({
            error: "Internal server error"
        });

    }
});

//Update current id event
router.put("/:id", (req, res) => {
    const userId = req.params.id;
    const { email, password } = req.body;

    try {
        const user = db
            .prepare("SELECT * FROM User WHERE id = ?")
            .get(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        db
            .prepare("UPDATE User SET email = ?, password = ? WHERE id = ?")
            .run(email, password, userId);

        res.json({ message: "User updated successfully" });
    } catch (error) {
        console.error("SQL error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
