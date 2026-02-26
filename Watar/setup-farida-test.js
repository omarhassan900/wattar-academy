const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('wattar.db');

console.log('Setting up test data for Farida Ramadan...\n');

// Find Farida
db.get("SELECT id, name, current_level FROM students WHERE name LIKE '%Farida%'", (err, student) => {
    if (!student) {
        console.log('Student not found');
        db.close();
        return;
    }
    
    console.log(`Student: ${student.name} (ID: ${student.id}, Level: ${student.current_level})\n`);
    
    // Get sessions for her level
    db.all("SELECT id, session_number FROM sessions WHERE level = ? ORDER BY session_number", [student.current_level], (err, sessions) => {
        if (!sessions || sessions.length === 0) {
            console.log('No sessions found for this level');
            db.close();
            return;
        }
        
        console.log(`Found ${sessions.length} sessions for ${student.current_level}\n`);
        
        // Clear existing attendance for this student
        db.run("DELETE FROM attendance WHERE student_id = ?", [student.id], (err) => {
            if (err) {
                console.error('Error clearing attendance:', err);
                db.close();
                return;
            }
            
            // Insert test attendance with different dates
            const stmt = db.prepare(`
                INSERT INTO attendance (student_id, session_id, status, date, marked_by, created_at)
                VALUES (?, ?, ?, ?, 1, datetime('now'))
            `);
            
            // Session 1: 22/02
            stmt.run(student.id, sessions[0].id, 'present', '2026-02-22');
            console.log(`✓ Session 1: Set to 22/02 (attended)`);
            
            // Session 2: 05/02  
            if (sessions[1]) {
                stmt.run(student.id, sessions[1].id, 'absent', '2026-02-05');
                console.log(`✓ Session 2: Set to 05/02 (absent)`);
            }
            
            // Session 3: Not marked yet
            console.log(`✓ Session 3: Not marked`);
            
            // Session 4: Not marked yet
            console.log(`✓ Session 4: Not marked`);
            
            stmt.finalize((err) => {
                if (err) {
                    console.error('Error:', err);
                } else {
                    console.log('\n✅ Test data ready!');
                    console.log('\nNow:');
                    console.log('1. Refresh the attendance page (Ctrl+F5)');
                    console.log('2. You should see:');
                    console.log('   - Session 1: ✓ with date 22/02');
                    console.log('   - Session 2: ✗ with date 05/02');
                    console.log('   - Session 3: empty');
                    console.log('   - Session 4: empty');
                    console.log('3. Mark Session 3 as attended');
                    console.log('4. Click "Save All Attendance"');
                    console.log('5. Session 1 should STILL show 22/02 (NOT change to 23/02)');
                    console.log('6. Session 2 should STILL show 05/02');
                    console.log('7. Session 3 should show 23/02');
                }
                db.close();
            });
        });
    });
});
