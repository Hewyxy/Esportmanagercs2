const express = require("express");
const cors = require("cors");

const playerRoutes = require("./routes/players");
const teamRoutes = require("./routes/teams");
const EventRoutes = require("./routes/Events");
const UserRoutes = require("./routes/Users");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/players", playerRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/events", EventRoutes);
app.use("/api/user", UserRoutes);

app.use((req, res) => {
    res.status(404).json({
        error: "Not Found"
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});