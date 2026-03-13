const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./wattar.db');

console.log('Fixing column mapping issue...\n');

db.serialize(() => {
    // First, let's see what the current data looks like
    db.all(`SELECT * FROM students LIMIT 3`, (err, rows) => {
        if (err) {
            console.error('Error reading students:', err);
            return;
        }
        
        console.log('Current data sample:');
        console.log(JSON.stringify(rows, null, 2));
        
        // Check the actual column order
        db.all(`PRAGMA table_info(students)`, (err, columns) => {
            if (err) {
                console.error('Error reading table info:', err);
                return;
            }
            
            console.log('\nCurrent column order:');
            columns.forEach(col => {
                console.log(`${col.cid}: ${col.name} (${col.type})`);
            });
            
            console.log('\n⚠️  The data appears to be scrambled.');
            console.log('Looking at the pattern, it seems:');
            console.log('- instrument column contains timestamps');
            console.log('- address column contains timestamps');
            console.log('- emergency_phone column contains instrument names');
            
            console.log('\nWe need to restore from the most recent backup or manually fix the data.');
            console.log('Do you have any recent database backups?');
            
            db.close();
        });
    });
});
