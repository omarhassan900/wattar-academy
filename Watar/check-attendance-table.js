const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./wattar.db');

console.log('Checking attendance table structure...\n');

db.all("PRAGMA table_info(attendance)", (err, columns) => {
    if (err) {
        console.error('Error:', err);
        db.close();
        return;
    }
    
    console.log('Attendance table columns:');
    columns.forEach(col => {
        console.log(`  - ${col.name} (${col.type})`);
    });
    
    // Check if session_id column exists
    const hasSessionId = columns.some(col => col.name === 'session_id');
    
    if (!hasSessionId) {
        console.log('\n⚠️  WARNING: session_id column does NOT exist!');
        console.log('The attendance table needs to be updated to include session_id column.');
    } else {
        console.log('\n✅ session_id column exists');
    }
    
    db.close();
});
