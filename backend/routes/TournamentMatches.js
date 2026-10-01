const express = require('express');
const db = require('../db/database');
const { updateTeamSeeds } = require('../gameLogic/seeds');

const router = express.Router();

router.get("/", (req, res) => {
    const matches = db.prepare("SELECT * FROM TournamentMatches").all();

    res.json(matches);
});

// Create the first round as one atomic operation. This makes initialization
// safe when the client requests it more than once (for example in StrictMode).
router.post("/initialize", (req, res) => {
    const { tournamentId, teamIds } = req.body;

    if (tournamentId == null || !Array.isArray(teamIds) || teamIds.length < 2) {
        return res.status(400).json({ error: "Tournament ID and at least two team IDs are required" });
    }

    const normalizedTeamIds = teamIds.map(Number);
    if (normalizedTeamIds.some((id) => !Number.isInteger(id) || id <= 0)
        || new Set(normalizedTeamIds).size !== normalizedTeamIds.length) {
        return res.status(400).json({ error: "Team IDs must be valid and unique" });
    }

    try {
        const initialize = db.transaction(() => {
            const existingRound = db
                .prepare("SELECT COUNT(*) AS count FROM TournamentMatches WHERE tournamentId = ? AND round = 0")
                .get(tournamentId);

            if (existingRound.count > 0) {
                return { created: false };
            }

            const insertMatch = db.prepare(`
                INSERT INTO TournamentMatches
                    (tournamentId, round, matchNumber, team1Id, team2Id, score1, score2, winnerId, status)
                VALUES (?, 0, ?, ?, ?, 0, 0, 0, 'ongoing')
            `);

            for (let index = 0; index + 1 < normalizedTeamIds.length; index += 2) {
                insertMatch.run(
                    tournamentId,
                    index / 2 + 1,
                    normalizedTeamIds[index],
                    normalizedTeamIds[index + 1],
                );
            }

            return { created: true };
        });

        const result = initialize();
        res.status(result.created ? 201 : 200).json(result);
    } catch (error) {
        console.error("SQL error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Save a tournament match result and place its winner into the next round.
router.put("/:id/result", (req, res) => {
    const matchId = Number(req.params.id);
    const { score1, score2, winnerId } = req.body;
    const normalizedWinnerId = Number(winnerId);
    const normalizedScore1 = Number(score1);
    const normalizedScore2 = Number(score2);

    if (!Number.isInteger(matchId) || matchId <= 0
        || !Number.isInteger(normalizedScore1) || normalizedScore1 < 0
        || !Number.isInteger(normalizedScore2) || normalizedScore2 < 0
        || !Number.isInteger(normalizedWinnerId) || normalizedWinnerId <= 0) {
        return res.status(400).json({ error: "A valid match result is required" });
    }

    try {
        const saveResult = db.transaction(() => {
            const currentMatch = db
                .prepare("SELECT * FROM TournamentMatches WHERE id = ?")
                .get(matchId);

            if (!currentMatch) return { notFound: true };
            if (![currentMatch.team1Id, currentMatch.team2Id].includes(normalizedWinnerId)) {
                return { invalidWinner: true };
            }

            const wasCompleted = currentMatch.status === "completed";
            db.prepare(`
                UPDATE TournamentMatches
                SET score1 = ?, score2 = ?, winnerId = ?, status = 'completed'
                WHERE id = ?
            `).run(normalizedScore1, normalizedScore2, normalizedWinnerId, matchId);

            if (!wasCompleted) {
                const loserId = Number(currentMatch.team1Id) === normalizedWinnerId
                    ? currentMatch.team2Id
                    : currentMatch.team1Id;
                db.prepare("UPDATE Teams SET Points = COALESCE(Points, 0) + 30 WHERE Id = ?")
                    .run(normalizedWinnerId);
                db.prepare("UPDATE Teams SET Points = COALESCE(Points, 0) - 10 WHERE Id = ?")
                    .run(loserId);
            }

            if (currentMatch.round == null) {
                return { saved: true, nextMatchId: null };
            }

            const roundMatches = db.prepare(`
                SELECT id, matchNumber FROM TournamentMatches
                WHERE tournamentId = ? AND round = ?
                ORDER BY id ASC
            `).all(currentMatch.tournamentId, currentMatch.round);
            const currentIndex = roundMatches.findIndex((match) => match.id === matchId);
            if (currentIndex < 0) {
                return { saved: true, nextMatchId: null };
            }

            if (roundMatches.length === 1) {
                const champion = db.prepare("SELECT Name FROM Teams WHERE Id = ?")
                    .get(normalizedWinnerId);

                const aiTeams = db.prepare("SELECT Id, Name FROM Teams WHERE Id != 1").all();
                const freeAgents = db.prepare(`
                    SELECT id, Name, Role FROM Players
                    WHERE TeamId = 0
                    ORDER BY RANDOM()
                `).all();
                const transfers = [];
                const getOutgoingPlayer = db.prepare(`
                    SELECT id, Name, Role FROM Players
                    WHERE TeamId = ?
                    ORDER BY RANDOM()
                    LIMIT 1
                `);
                const signFreeAgent = db.prepare(`
                    UPDATE Players
                    SET TeamId = ?, Team = (SELECT Name FROM Teams WHERE Id = ?)
                    WHERE id = ?
                `);
                const releasePlayer = db.prepare(
                    "UPDATE Players SET TeamId = 0, Team = 'None' WHERE id = ?",
                );

                for (const team of aiTeams) {
                    if (Math.random() >= 0.07 || freeAgents.length === 0) continue;

                    const outgoingPlayer = getOutgoingPlayer.get(team.Id);
                    if (!outgoingPlayer) continue;

                    const outgoingRole = outgoingPlayer.Role?.trim().toLowerCase();
                    if (!outgoingRole) continue;

                    const matchingFreeAgentIndexes = freeAgents
                        .map((player, index) => ({ player, index }))
                        .filter(({ player }) => player.Role?.trim().toLowerCase() === outgoingRole)
                        .map(({ index }) => index);
                    if (matchingFreeAgentIndexes.length === 0) continue;

                    const roleCandidateIndex = Math.floor(Math.random() * matchingFreeAgentIndexes.length);
                    const incomingIndex = matchingFreeAgentIndexes[roleCandidateIndex];
                    const [incomingPlayer] = freeAgents.splice(incomingIndex, 1);
                    signFreeAgent.run(team.Id, team.Id, incomingPlayer.id);
                    releasePlayer.run(outgoingPlayer.id);
                    transfers.push({
                        teamName: team.Name,
                        signedPlayer: incomingPlayer.Name,
                        releasedPlayer: outgoingPlayer.Name,
                    });
                }

                updateTeamSeeds();

                const nextEvent = db.prepare(`
                    SELECT id FROM Events WHERE id > ? ORDER BY id ASC LIMIT 1
                `).get(currentMatch.tournamentId)
                    ?? db.prepare("SELECT id FROM Events ORDER BY id ASC LIMIT 1").get();
                const nextEventId = nextEvent?.id ?? Number(currentMatch.tournamentId) + 1;

                db.prepare("UPDATE User SET CurrentEvent = ? WHERE id = 0")
                    .run(nextEventId);
                db.prepare("DELETE FROM TournamentMatches").run();

                return {
                    saved: true,
                    tournamentFinished: true,
                    nextEventId,
                    winnerName: champion?.Name ?? "Unknown team",
                    transfers,
                    seedsUpdated: true,
                    nextMatchId: null,
                };
            }

            const currentNumber = Number(currentMatch.matchNumber) || currentIndex + 1;
            const nextMatchNumber = Math.ceil(currentNumber / 2);
            const nextRound = Number(currentMatch.round) + 1;
            let nextMatch = db.prepare(`
                SELECT * FROM TournamentMatches
                WHERE tournamentId = ? AND round = ? AND matchNumber = ?
            `).get(currentMatch.tournamentId, nextRound, nextMatchNumber);

            if (!nextMatch) {
                const insertNextMatch = db.prepare(`
                    INSERT INTO TournamentMatches
                        (tournamentId, round, matchNumber, team1Id, team2Id, score1, score2, winnerId, status)
                    VALUES (?, ?, ?, NULL, NULL, 0, 0, 0, 'ongoing')
                `).run(currentMatch.tournamentId, nextRound, nextMatchNumber);
                nextMatch = { id: insertNextMatch.lastInsertRowid };
            }

            const winnerColumn = currentNumber % 2 === 1 ? "team1Id" : "team2Id";
            const currentWinner = db.prepare(`
                SELECT ${winnerColumn} AS teamId FROM TournamentMatches WHERE id = ?
            `).get(nextMatch.id)?.teamId;

            if (currentWinner == null || Number(currentWinner) === normalizedWinnerId) {
                db.prepare(`UPDATE TournamentMatches SET ${winnerColumn} = ? WHERE id = ?`)
                    .run(normalizedWinnerId, nextMatch.id);
            }

            return { saved: true, nextMatchId: nextMatch.id };
        });

        const result = saveResult();
        if (result.notFound) return res.status(404).json({ error: "Tournament match not found" });
        if (result.invalidWinner) return res.status(400).json({ error: "Winner must be one of the teams in this match" });
        return res.json(result);
    } catch (error) {
        console.error("SQL error:", error);
        return res.status(500).json({ error: error.message });
    }
});

router.post("/add", (req, res) => {
    const {
        tournamentId,
        round,
        team1Id,
        team2Id,
        score1,
        score2,
        winnerId,
        status
    } = req.body;

    try {
        const result = db
            .prepare(`
                INSERT INTO TournamentMatches
                (
                    tournamentId,
                    round,
                    team1Id,
                    team2Id,
                    score1,
                    score2,
                    winnerId,
                    status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `)
            .run(
                tournamentId,
                round,
                team1Id,
                team2Id,
                score1,
                score2,
                winnerId,
                status
            );

        res.status(201).json({
            message: "Match added successfully",
            matchId: result.lastInsertRowid
        });

    } catch (error) {
        console.error("SQL error:", error);

        res.status(500).json({
            error: error.message
        });
    }
});

module.exports = router;
