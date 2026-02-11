const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./wattar.db');

db.get('SELECT COUNT(*) as count FROM students WHERE status = "active"', (err, row) => {
    console.log('Active students:', row ? row.count : 0);
    
    db.get('SELECT COUNT(*) as count FROM sessions', (err, row) => {
        console.log('Total sessions:', row ? row.count : 0);
        
        db.get('SELECT COUNT(*) as count FROM attendance', (err, row) => {
            console.log('Total attendance records:', row ? row.count : 0);
            db.close();
        });
    });
});
