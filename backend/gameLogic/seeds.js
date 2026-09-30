const db = require("../db/database");


function getTeamsByPoints() {
    return db
        .prepare(`
            SELECT Id, Name, Points
            FROM Teams
            ORDER BY Points DESC
        `)
        .all();
}

function getTopTeams(count) {
    return db
        .prepare(`
            SELECT Id, Name, Points
            FROM Teams
            ORDER BY Points DESC
            LIMIT ?
        `)
        .all(count);
}

function getBottomTeams(count) {
    return db
        .prepare(`
            SELECT Id, Name, Points
            FROM Teams
            ORDER BY Points ASC
            LIMIT ?
        `)
        .all(count);
}

// Seed for every teams
function getTeamSeeds() {
    const teams = getTeamsByPoints();

    return teams.map((team, index) => ({
        ...team,
        Seed: index + 1
    }));
}

// Best 8
function getTop8() {
    return getTopTeams(8);
}

// Best 16
function getTop16() {
    return getTopTeams(16);
}

// Best 32
function getTop32() {
    return getTopTeams(32);
}

// Worst 8
function getBottom8() {
    return getBottomTeams(8);
}

function isTeamInTop(teamId, count) {
    const teams = db
        .prepare(`
            SELECT Id
            FROM Teams
            ORDER BY Points DESC
            LIMIT ?
        `)
        .all(count);

    return teams.some(team => team.Id === Number(teamId));
}


module.exports = {
    getTeamsByPoints,
    getTopTeams,
    getBottomTeams,
    getTeamSeeds,
    getTop8,
    getTop16,
    getTop32,
    getBottom8,
    isTeamInTop
};