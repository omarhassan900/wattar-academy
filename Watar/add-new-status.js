const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'wattar.db'));

db.serialize(() => {
    console.log('Adding "New" to students status constraint...');

    // SQLite doesn't support ALTER CHECK, so we recreate the table
    db.run(`ALTER TABLE students RENAME TO students_old`, (err) => {
        if (err) { console.error(err); process.exit(1); }

        db.run(`CREATE TABLE students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            national_id TEXT UNIQUE,
            phone VARCHAR(20),
            parent_phone VARCHAR(20),
            email VARCHAR(100),
            start_date DATE NOT NULL,
            current_level TEXT,
            status TEXT CHECK(status IN ('active', 'inactive', 'freez', 'New')) DEFAULT 'active',
            notes TEXT,
            instrument VARCHAR(100),
            address TEXT,
            date_of_birth DATE,
            emergency_contact TEXT,
            emergency_phone VARCHAR(20),
            trainer_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (trainer_id) REFERENCES trainers(id)
        )`, (err) => {
            if (err) { console.error(err); process.exit(1); }

            db.run(`INSERT INTO students SELECT * FROM students_old`, (err) => {
                if (err) { console.error(err); process.exit(1); }

                db.run(`DROP TABLE students_old`, (err) => {
                    if (err) { console.error(err); process.exit(1); }
                    console.log('✓ Done! "New" status is now allowed.');
                    db.close();
                });
            });
        });
    });
});
