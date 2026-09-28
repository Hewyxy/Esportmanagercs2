const Database = require('better-sqlite3');
const path = require('path');

// Resolve the database next to this module so the server uses the same file
// regardless of the directory from which `node server.js` was started.
const db = new Database(path.join(__dirname, '..', 'database.db'));

module.exports = db;
