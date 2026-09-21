const express = require("express");
const cors = require("cors");

//Routes
const playerRoutes = require("./routes/players");
const teamRoutes = require("./routes/teams");
const EventRoutes = require("./routes/Events");
const UserRoutes = require("./routes/Users");

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//More Routes
app.use("/api/players", playerRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/events", EventRoutes);
app.use("/api/user", UserRoutes);

//404 Handler
app.use((req, res) => {
    res.status(404).json({
        error: "Not Found"
    });
});

//port
app.listen(3000, () => {
    console.log("Server running on port 3000");
});