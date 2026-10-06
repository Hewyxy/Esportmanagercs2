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

function runMigrations() {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS Migrations (
            Id INTEGER PRIMARY KEY,
            Name TEXT NOT NULL,
            AppliedAt TEXT NOT NULL
        )
    `).run();

    const migrationsPath = path.join(__dirname, "migrations");

    if (!fs.existsSync(migrationsPath)) {
        fs.mkdirSync(migrationsPath);
    }

    const files = fs
        .readdirSync(migrationsPath)
        .filter(file => file.endsWith(".sql"))
        .sort();

    for (const file of files) {
        const id = Number(file.split("_")[0]);

        if (!Number.isInteger(id)) {
            console.error(`Invalid migration filename: ${file}`);
            continue;
        }

        const alreadyApplied = db.prepare(`
            SELECT Id
            FROM Migrations
            WHERE Id = ?
        `).get(id);

        if (alreadyApplied) {
            continue;
        }

        const sql = fs.readFileSync(
            path.join(migrationsPath, file),
            "utf8"
        );

        console.log(`Running migration: ${file}`);

        const migrate = db.transaction(() => {
            db.exec(sql);

            db.prepare(`
                INSERT INTO Migrations (Id, Name, AppliedAt)
                VALUES (?, ?, ?)
            `).run(
                id,
                file,
                new Date().toISOString()
            );
        });

        try {
            migrate();
            console.log(`Migration completed: ${file}`);
        } catch (error) {
            console.error(`Migration failed: ${file}`);
            throw error;
        }
    }
}

runMigrations();

db.prepare(`
    UPDATE Players
    SET TeamId = CASE
        WHEN Team = 'None' THEN 0
        ELSE (
            SELECT Id
            FROM Teams
            WHERE Teams.Name = Players.Team
            LIMIT 1
        )
    END
    WHERE TeamId IS NULL
`).run();

module.exports = db;