const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('wattar.db');

console.log('Updating attendance system for session-based tracking...');

db.serialize(() => {
    // Create sessions table
    db.run(`CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        level TEXT NOT NULL,
        session_number INTEGER NOT NULL CHECK(session_number BETWEEN 1 AND 4),
        session_date DATE,
        session_name TEXT,
        description TEXT,
        status TEXT CHECK(status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(level, session_number)
    )`, (err) => {
        if (err) {
            console.error('Error creating sessions table:', err.message);
        } else {
            console.log('✓ Created sessions table');
        }
    });

    // Update attendance table to include session reference
    db.run(`ALTER TABLE attendance ADD COLUMN session_id INTEGER`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
            console.error('Error adding session_id column:', err.message);
        } else {
            console.log('✓ Added session_id column to attendance table');
        }
    });

    // Create default sessions for each level
    const levels = ['Level One', 'Level Two', 'Level Three', 'Level Four', 'Level Five', 'Level Six'];
    const sessionStmt = db.prepare(`
        INSERT OR IGNORE INTO sessions (level, session_number, session_name, description)
        VALUES (?, ?, ?, ?)
    `);

    levels.forEach(level => {
        for (let i = 1; i <= 4; i++) {
            sessionStmt.run([
                level,
                i,
                `${level} - Session ${i}`,
                `Session ${i} for ${level} students`
            ]);
        }
    });

    sessionStmt.finalize();
    console.log('✓ Created default sessions (4 sessions per level)');

    // Verify the setup
    setTimeout(() => {
        db.all("SELECT level, COUNT(*) as session_count FROM sessions GROUP BY level", (err, results) => {
            if (err) {
                console.error('Error verifying sessions:', err);
            } else {
                console.log('\n=== Session Setup Verification ===');
                results.forEach(result => {
                    console.log(`${result.level}: ${result.session_count} sessions`);
                });
                
                console.log('\n✅ Attendance system updated successfully!');
                console.log('Each level now has 4 sessions that can be tracked individually.');
                console.log('Session dates are flexible and can be set when marking attendance.');
                
                db.close();
            }
        });
    }, 1000);
});