const express = require("express");
const cors = require("cors");

//Routes
const playerRoutes = require("./routes/players");
const teamRoutes = require("./routes/teams");
const EventRoutes = require("./routes/Events");
const UserRoutes = require("./routes/Users");
const MathesRoutes = require("./routes/Matches");
const TournamnetMathesRoutes = require("./routes/TournamentMatches");
const TournamnetTeamsRoutes = require("./routes/TournamentTeams");

const app = express();

// Parse JSON and let the frontend talk to the API.
//Middleware
app.use(cors());
app.use(express.json());

const path = require("path");

app.use("/assets", express.static(path.join(__dirname, "..", "assets")));

//More Routes
// Each part of the API gets its own router.
app.use("/api/players", playerRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/events", EventRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/matches", MathesRoutes);
app.use("/api/tournamentmatches", TournamnetMathesRoutes);
app.use("/api/TournamentTeams", TournamnetTeamsRoutes);

//404 Handler
// If nothing matched the URL, say so plainly.
app.use((req, res) => {
    res.status(404).json({
        error: "Not Found"
    });
});

//port
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
