const Database = require('better-sqlite3');
const path = require('path');

// Resolve the database next to this module so the server uses the same file
// regardless of the directory from which `node server.js` was started.
const db = new Database(path.join(__dirname, '..', 'database.db'));

// Give older player records a numeric team ID if they do not have one yet.
// Backfill the existing text based player assignments into the canonical team ID.
db.prepare(`
    UPDATE Players
    SET TeamId = CASE
        WHEN Team = 'None' THEN 0
        ELSE (SELECT Id FROM Teams WHERE Teams.Name = Players.Team LIMIT 1)
    END
    WHERE TeamId IS NULL
`).run();

module.exports = db;
