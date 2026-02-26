const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('wattar.db');

console.log('Testing date display for Sara milad...\n');

// Find Sara
db.get("SELECT id, name FROM students WHERE name LIKE '%Sara%'", (err, student) => {
    if (!student) {
        console.log('Student not found');
        db.close();
        return;
    }
    
    console.log(`Student: ${student.name} (ID: ${student.id})\n`);
    
    // Get her attendance with dates
    db.all(`
        SELECT 
            a.student_id,
            a.session_id,
            a.status,
            a.date as attendance_date,
            s.session_number,
            s.session_date as sessions_table_date
        FROM attendance a
        JOIN sessions s ON a.session_id = s.id
        WHERE a.student_id = ?
        ORDER BY s.session_number
    `, [student.id], (err, records) => {
        if (err) {
            console.error('Error:', err);
            db.close();
            return;
        }
        
        console.log('Current Data:');
        console.log('=============');
        if (records.length === 0) {
            console.log('No attendance records found');
        } else {
            records.forEach(r => {
                console.log(`Session ${r.session_number}:`);
                console.log(`  - Status: ${r.status}`);
                console.log(`  - Date in ATTENDANCE table: ${r.attendance_date}`);
                console.log(`  - Date in SESSIONS table: ${r.sessions_table_date}`);
                console.log('');
            });
        }
        
        console.log('\nThe UI should display the "Date in ATTENDANCE table" value.');
        console.log('If you changed the SESSIONS table, it won\'t affect the display.');
        db.close();
    });
});
