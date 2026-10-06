CREATE TABLE IF NOT EXISTS"News" (
	"id"	INTEGER,
	"type"	TEXT NOT NULL,
	"team1Logo"	TEXT,
	"team2Logo"	TEXT,
	"playerId"	INTEGER,
	"tournamentName"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);