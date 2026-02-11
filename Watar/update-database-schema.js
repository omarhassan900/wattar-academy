const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('wattar.db');

console.log('Updating database schema to include biographical info and instruments...');

db.serialize(() => {
    // Add new columns to students table
    db.run(`ALTER TABLE students ADD COLUMN age_group TEXT CHECK(age_group IN ('kids', 'teenagers', 'adults')) DEFAULT 'kids'`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
            console.error('Error adding age_group column:', err.message);
        } else {
            console.log('✓ Added age_group column');
        }
    });

    db.run(`ALTER TABLE students ADD COLUMN date_of_birth DATE`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
            console.error('Error adding date_of_birth column:', err.message);
        } else {
            console.log('✓ Added date_of_birth column');
        }
    });

    db.run(`ALTER TABLE students ADD COLUMN instrument TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
            console.error('Error adding instrument column:', err.message);
        } else {
            console.log('✓ Added instrument column');
        }
    });

    db.run(`ALTER TABLE students ADD COLUMN parent_name TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
            console.error('Error adding parent_name column:', err.message);
        } else {
            console.log('✓ Added parent_name column');
        }
    });

    db.run(`ALTER TABLE students ADD COLUMN emergency_contact TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
            console.error('Error adding emergency_contact column:', err.message);
        } else {
            console.log('✓ Added emergency_contact column');
        }
    });

    db.run(`ALTER TABLE students ADD COLUMN address TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
            console.error('Error adding address column:', err.message);
        } else {
            console.log('✓ Added address column');
        }
    });

    db.run(`ALTER TABLE students ADD COLUMN medical_notes TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
            console.error('Error adding medical_notes column:', err.message);
        } else {
            console.log('✓ Added medical_notes column');
        }
    });

    // Create instruments table for reference
    db.run(`CREATE TABLE IF NOT EXISTS instruments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        category TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating instruments table:', err.message);
        } else {
            console.log('✓ Created instruments table');
        }
    });

    // Insert common instruments
    const instruments = [
        { name: 'Piano', category: 'Keyboard' },
        { name: 'Guitar', category: 'String' },
        { name: 'Violin', category: 'String' },
        { name: 'Drums', category: 'Percussion' },
        { name: 'Flute', category: 'Woodwind' },
        { name: 'Saxophone', category: 'Woodwind' },
        { name: 'Trumpet', category: 'Brass' },
        { name: 'Cello', category: 'String' },
        { name: 'Clarinet', category: 'Woodwind' },
        { name: 'Voice/Singing', category: 'Vocal' },
        { name: 'Oud', category: 'String' },
        { name: 'Qanun', category: 'String' },
        { name: 'Ney', category: 'Woodwind' },
        { name: 'Tabla', category: 'Percussion' }
    ];

    const stmt = db.prepare("INSERT OR IGNORE INTO instruments (name, category) VALUES (?, ?)");
    instruments.forEach(instrument => {
        stmt.run(instrument.name, instrument.category);
    });
    stmt.finalize();
    console.log('✓ Added common instruments to database');

    // Verify the changes
    db.get("PRAGMA table_info(students)", (err, result) => {
        if (err) {
            console.error('Error checking table structure:', err);
        } else {
            console.log('\n✓ Database schema updated successfully!');
            console.log('New fields added to students table:');
            console.log('- age_group (kids/teenagers/adults)');
            console.log('- date_of_birth');
            console.log('- instrument');
            console.log('- parent_name');
            console.log('- emergency_contact');
            console.log('- address');
            console.log('- medical_notes');
        }
        db.close();
    });
});