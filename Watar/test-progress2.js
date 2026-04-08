const db = new (require('sqlite3').verbose()).Database('wattar.db');

// Check Alla Gamal's attendance
db.all(`
    SELECT s.name, s.current_level, sess.session_number, sess.level as session_level, a.status, a.date
    FROM students s
    JOIN attendance a ON a.student_id = s.id
    JOIN sessions sess ON a.session_id = sess.id
    WHERE s.name LIKE '%Alla%' OR s.name LIKE '%heba%' OR s.name LIKE '%Haitham%'
    ORDER BY s.name, sess.level, sess.session_number
`, (err, rows) => {
    if (err) { console.error(err); process.exit(1); }
    console.log('Attendance records for flagged students:');
    rows.forEach(r => {
        console.log(`  ${r.name} | Level: ${r.current_level} | Session ${r.session_number} (${r.session_level}) | Status: ${r.status} | Date: ${r.date}`);
    });
    
    // Also check distinct statuses in the DB
    db.all(`SELECT DISTINCT status FROM attendance`, (err, statuses) => {
        console.log('\nAll attendance statuses in DB:', statuses.map(s => s.status));
        db.close();
    });
});
