const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./wattar.db');

console.log('Adding database indexes for performance optimization...');

const indexes = [
    "CREATE INDEX IF NOT EXISTS idx_students_status ON students(status)",
    "CREATE INDEX IF NOT EXISTS idx_students_level ON students(current_level)",
    "CREATE INDEX IF NOT EXISTS idx_students_instrument ON students(instrument)",
    "CREATE INDEX IF NOT EXISTS idx_sessions_level ON sessions(level)",
    "CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id)",
    "CREATE INDEX IF NOT EXISTS idx_attendance_session ON attendance(session_id)",
    "CREATE INDEX IF NOT EXISTS idx_attendance_composite ON attendance(student_id, session_id)"
];

let completed = 0;

indexes.forEach((sql, index) => {
    db.run(sql, (err) => {
        if (err) {
            console.log(`Index ${index + 1}: Error - ${err.message}`);
        } else {
            console.log(`Index ${index + 1}: Created successfully`);
        }
        
        completed++;
        if (completed === indexes.length) {
            console.log('\n✅ Database indexes optimization completed!');
            console.log('This will significantly improve query performance.');
            db.close();
        }
    });
});
