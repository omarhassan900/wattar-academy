const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('wattar.db');

console.log('Creating student_level_notes table...\n');

db.serialize(() => {
    // Create table for notes per student per level
    db.run(`
        CREATE TABLE IF NOT EXISTS student_level_notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            level TEXT NOT NULL,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(id),
            UNIQUE(student_id, level)
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('✅ Created student_level_notes table');
            console.log('\nTable structure:');
            console.log('- id: Primary key');
            console.log('- student_id: Which student');
            console.log('- level: Which level/month (e.g., "Month 1", "Month 2")');
            console.log('- notes: Feedback for this specific level');
            console.log('- created_at: When first created');
            console.log('- updated_at: When last modified');
            console.log('\nUnique constraint: (student_id, level)');
            console.log('This ensures one note per student per level.');
        }
        
        // Migrate existing notes from students table
        console.log('\n\nMigrating existing notes from students table...');
        db.all(`
            SELECT id, current_level, notes 
            FROM students 
            WHERE notes IS NOT NULL AND notes != ''
        `, (err, students) => {
            if (err) {
                console.error('Error reading students:', err);
                db.close();
                return;
            }
            
            if (students.length === 0) {
                console.log('No existing notes to migrate.');
                db.close();
                return;
            }
            
            console.log(`Found ${students.length} students with notes to migrate.`);
            
            const stmt = db.prepare(`
                INSERT OR REPLACE INTO student_level_notes (student_id, level, notes, created_at, updated_at)
                VALUES (?, ?, ?, datetime('now'), datetime('now'))
            `);
            
            students.forEach(student => {
                stmt.run(student.id, student.current_level, student.notes, (err) => {
                    if (err) {
                        console.error(`Error migrating student ${student.id}:`, err);
                    } else {
                        console.log(`✓ Migrated notes for student ${student.id} (${student.current_level})`);
                    }
                });
            });
            
            stmt.finalize((err) => {
                if (err) {
                    console.error('Error finalizing:', err);
                } else {
                    console.log('\n✅ Migration complete!');
                    console.log('\nNow notes are stored per level:');
                    console.log('- Student can have different notes for Month 1, Month 2, etc.');
                    console.log('- When student changes level, old notes are preserved');
                    console.log('- Each level has its own feedback history');
                }
                db.close();
            });
        });
    });
});
