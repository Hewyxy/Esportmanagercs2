const Database = require('better-sqlite3');

const db = new Database('./database.db', { verbose: console.log });

module.exports = db;