const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('wattar.db');

console.log('Setting Session 1 date to 2026-02-22 for testing...\n');

// Find Sara
db.get("SELECT id FROM students WHERE name LIKE '%Sara%'", (err, student) => {
    if (!student) {
        console.log('Student not found');
        db.close();
        return;
    }
    
    // Find Session 1 for Month 4
    db.get("SELECT id FROM sessions WHERE level = 'Month 4' AND session_number = 1", (err, session) => {
        if (!session) {
            console.log('Session not found');
            db.close();
            return;
        }
        
        // Update the attendance date
        db.run(`
            UPDATE attendance 
            SET date = '2026-02-22' 
            WHERE student_id = ? AND session_id = ?
        `, [student.id, session.id], (err) => {
            if (err) {
                console.error('Error:', err);
            } else {
                console.log('✅ Set Session 1 date to 2026-02-22');
                console.log('\nNow:');
                console.log('1. Refresh the attendance page');
                console.log('2. Session 1 should show 22/02');
                console.log('3. Mark Session 3 as attended and save');
                console.log('4. Session 1 should STILL show 22/02 (not change to 23/02)');
                console.log('5. Session 3 should show 23/02');
            }
            db.close();
        });
    });
});
