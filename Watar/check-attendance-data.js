const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('wattar.db');

console.log('Checking attendance data for Sara milad...\n');

// Find Sara's student ID
db.get("SELECT id, name FROM students WHERE name LIKE '%Sara%'", (err, student) => {
    if (err) {
        console.error('Error:', err);
        db.close();
        return;
    }
    
    if (!student) {
        console.log('Student not found');
        db.close();
        return;
    }
    
    console.log(`Student: ${student.name} (ID: ${student.id})\n`);
    
    // Get attendance records
    db.all(`
        SELECT 
            a.id,
            a.student_id,
            a.session_id,
            a.status,
            a.date,
            s.session_number,
            s.level,
            s.session_date
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
        
        console.log('Attendance Records:');
        console.log('===================');
        records.forEach(r => {
            console.log(`Session ${r.session_number}: Status=${r.status}, Date in attendance=${r.date}, Date in sessions=${r.session_date}`);
        });
        
        console.log('\n');
        console.log('Sessions table (Month 4):');
        console.log('========================');
        db.all("SELECT id, session_number, session_date FROM sessions WHERE level = 'Month 4' ORDER BY session_number", (err, sessions) => {
            if (err) {
                console.error('Error:', err);
            } else {
                sessions.forEach(s => {
                    console.log(`Session ${s.session_number} (ID: ${s.id}): session_date=${s.session_date}`);
                });
            }
            db.close();
        });
    });
});
