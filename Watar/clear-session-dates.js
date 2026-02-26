const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('wattar.db');

console.log('Clearing all session dates from sessions table...');
console.log('(Dates will now be stored only in attendance table)\n');

db.run("UPDATE sessions SET session_date = NULL", (err) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('✅ Cleared all session dates from sessions table');
        console.log('\nNow dates will be stored per-student in the attendance table.');
        console.log('Please restart your application and test again.');
    }
    db.close();
});
