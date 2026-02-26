const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('wattar.db');

console.log('Students table structure:\n');

db.all('PRAGMA table_info(students)', (err, cols) => {
    if (err) {
        console.error('Error:', err);
    } else {
        cols.forEach(c => {
            console.log(`- ${c.name} (${c.type})`);
        });
    }
    db.close();
});
