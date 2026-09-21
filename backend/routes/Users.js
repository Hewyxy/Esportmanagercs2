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
