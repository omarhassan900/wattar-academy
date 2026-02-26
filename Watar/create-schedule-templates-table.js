const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('wattar.db');

console.log('Creating schedule_templates table...');

db.serialize(() => {
    // Create schedule_templates table
    db.run(`CREATE TABLE IF NOT EXISTS schedule_templates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        day_of_week TEXT CHECK(day_of_week IN ('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')) NOT NULL,
        time_slot TEXT NOT NULL,
        student_id INTEGER NOT NULL,
        trainer_id INTEGER,
        notes TEXT,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (trainer_id) REFERENCES trainers(id)
    )`, (err) => {
        if (err) {
            console.error('Error creating schedule_templates table:', err.message);
        } else {
            console.log('✓ Created schedule_templates table');
        }
    });

    console.log('✓ Schedule templates table ready (no example data - add students manually)');

    // Verify
    setTimeout(() => {
        db.all("SELECT COUNT(*) as count FROM schedule_templates", (err, results) => {
            if (err) {
                console.error('Error verifying schedule templates:', err);
            } else {
                console.log('\n✅ Schedule templates table created successfully!');
                console.log('Operations manager can now add students to the weekly schedule.');
                
                db.close();
            }
        });
    }, 1000);
});
