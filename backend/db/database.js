const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

let dbPath;

if (process.env.DB_PATH) {
    dbPath = process.env.DB_PATH;

    const sourceDb = path.join(__dirname, "..", "database.db");

    if (!fs.existsSync(dbPath) && fs.existsSync(sourceDb)) {
        fs.copyFileSync(sourceDb, dbPath);
    }
} else {
    dbPath = path.join(__dirname, "..", "database.db");
}

console.log("Database path:", dbPath);

const db = new Database(dbPath);

db.prepare(`
    UPDATE Players
    SET TeamId = CASE
        WHEN Team = 'None' THEN 0
        ELSE (SELECT Id FROM Teams WHERE Teams.Name = Players.Team LIMIT 1)
    END
    WHERE TeamId IS NULL
`).run();

module.exports = db;