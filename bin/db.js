const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'dbDir/monitor.db');

let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('err',err.message);
    }
    console.log('Connected to the monitor database.');

});
db.run('CREATE TABLE IF NOT EXISTS users(user text,pass text)', (err) => {
    if (err) {
        console.error('err',err.message);
    }
    db.run(`INSERT OR IGNORE INTO users(user, pass) VALUES('dima', '123')`);
});

db.run('CREATE TABLE IF NOT EXISTS logs(user text, folder_path text, message text)');
db.run('CREATE TABLE IF NOT EXISTS events(user text,event_message text)');

/*
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});
 */

module.exports = db;