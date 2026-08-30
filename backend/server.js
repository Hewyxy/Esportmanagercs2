const express = require("express");
const cors = require("cors");
const { DatabaseSync } = require("node:sqlite");

const app = express();

app.use(cors());
app.use(express.json());

const db = new DatabaseSync("./database.db");

app.get("/api/test", (req, res) => {
    res.json({
        message: "Hello from Backend!",
        status: "success"
    });
});

app.get("/api/players", (req, res) => {

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




app.listen(3000, () => {
    console.log("Backend running on http://localhost:3000");
});