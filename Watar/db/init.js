const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('wattar.db');

// Migration: Sync trainer users into trainers table (runs after tables are created)
// Migration: Remove duplicate trainers (keep the one with lowest id)

// Migration: Replace 'graduated' with 'freez' in students status constraint
db.get("SELECT sql FROM sqlite_master WHERE type='table' AND name='students'", (err, row) => {
    if (row && row.sql && row.sql.includes("'graduated'")) {
        console.log('Migrating students table: replacing graduated with freez...');
        db.serialize(() => {
            db.run("UPDATE students SET status = 'active' WHERE status = 'graduated'");
            db.run("ALTER TABLE students RENAME TO students_old");
            db.run(`CREATE TABLE students (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(100) NOT NULL,
                national_id VARCHAR(20),
                phone VARCHAR(20),
                parent_phone VARCHAR(20),
                email VARCHAR(100),
                start_date DATE NOT NULL,
                current_level TEXT,
                status TEXT CHECK(status IN ('active', 'inactive', 'freez')) DEFAULT 'active',
                notes TEXT,
                instrument VARCHAR(100),
                address TEXT,
                date_of_birth DATE,
                emergency_contact VARCHAR(100),
                emergency_phone VARCHAR(20),
                trainer_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);
            db.run("INSERT INTO students SELECT * FROM students_old");
            db.run("DROP TABLE students_old");
            console.log('✓ Students table migrated: graduated replaced with freez');
        });
    }
});

// Migration: Add 'sales' to users role constraint (SQLite requires table recreation)
db.get("SELECT sql FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
    if (row && row.sql && !row.sql.includes("'sales'")) {
        console.log('Migrating users table to add sales role...');
        db.serialize(() => {
            db.run(`ALTER TABLE users RENAME TO users_old`);
            db.run(`CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                full_name VARCHAR(100) NOT NULL,
                email VARCHAR(100),
                role TEXT CHECK(role IN ('manager', 'reception', 'trainer', 'operations_manager', 'sales')) NOT NULL,
                status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);
            db.run(`INSERT INTO users SELECT * FROM users_old`);
            db.run(`DROP TABLE users_old`);
            console.log('✓ Users table migrated with sales role');
        });
    }
});

// Ensure student_level_notes table exists
db.run(`CREATE TABLE IF NOT EXISTS student_level_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    level TEXT NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    UNIQUE(student_id, level)
)`, (err) => {
    if (err) console.error('Error creating student_level_notes table:', err);
    else console.log('✓ student_level_notes table ready');
});

// Ensure session_confirmations table exists
db.run(`CREATE TABLE IF NOT EXISTS session_confirmations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    session_id INTEGER NOT NULL,
    confirmation_status TEXT CHECK(confirmation_status IN ('confirmed', 'not_confirmed', 'pending')) DEFAULT 'pending',
    confirmation_notes TEXT,
    confirmed_by INTEGER,
    confirmed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (session_id) REFERENCES sessions(id),
    FOREIGN KEY (confirmed_by) REFERENCES users(id),
    UNIQUE(student_id, session_id)
)`, (err) => {
    if (err) console.error('Error creating session_confirmations table:', err);
    else console.log('✓ session_confirmations table ready');
});

// Confirmation log - permanent record for dashboard reporting
db.run(`CREATE TABLE IF NOT EXISTS confirmation_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    confirmation_date DATE NOT NULL,
    confirmed_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
)`, (err) => {
    if (err) console.error('Error creating confirmation_log table:', err);
    else console.log('✓ confirmation_log table ready');
});

// Ensure sessions exist for all 48 months (4 sessions per month)
db.get(`SELECT COUNT(DISTINCT level) as levelCount FROM sessions`, (err, row) => {
    if (!err && row && row.levelCount < 48) {
        const stmt = db.prepare(`INSERT OR IGNORE INTO sessions (level, session_number, session_name, description) VALUES (?, ?, ?, ?)`);
        for (let m = 1; m <= 48; m++) {
            const level = `Month ${m}`;
            for (let s = 1; s <= 4; s++) {
                stmt.run(level, s, `${level} - Session ${s}`, `Session ${s} for ${level} students`);
            }
        }
        stmt.finalize();
        console.log('✓ Sessions created for all 48 months');
    }
});

// Add database indexes for performance
db.run(`CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id)`);
db.run(`CREATE INDEX IF NOT EXISTS idx_attendance_session ON attendance(session_id)`);
db.run(`CREATE INDEX IF NOT EXISTS idx_sessions_level ON sessions(level)`);
db.run(`CREATE INDEX IF NOT EXISTS idx_students_level ON students(current_level)`);
db.run(`CREATE INDEX IF NOT EXISTS idx_students_status ON students(status)`);
db.run(`CREATE INDEX IF NOT EXISTS idx_cash_date ON cash_transactions(transaction_date)`);
db.run(`CREATE INDEX IF NOT EXISTS idx_cash_type ON cash_transactions(type)`);
db.run(`CREATE INDEX IF NOT EXISTS idx_cash_category ON cash_transactions(category_code)`);

// Leads table for sales pipeline
db.run(`CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    parent_phone VARCHAR(20),
    email VARCHAR(100),
    age INTEGER,
    instrument VARCHAR(50),
    source VARCHAR(50),
    status VARCHAR(20) DEFAULT 'new',
    assigned_to INTEGER,
    notes TEXT,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
)`, (err) => {
    if (err) console.error('Error creating leads table:', err);
    else {
        console.log('✓ leads table ready');
        db.run(`ALTER TABLE leads ADD COLUMN trial_date DATE`, () => {});
        db.run(`ALTER TABLE leads ADD COLUMN trial_time TIME`, () => {});
        db.run(`ALTER TABLE leads ADD COLUMN trial_trainer_id INTEGER`, () => {});
        db.run(`ALTER TABLE leads ADD COLUMN trial_notes TEXT`, () => {});
    }
});

// Lead calls log
db.run(`CREATE TABLE IF NOT EXISTS lead_calls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER NOT NULL,
    called_by INTEGER NOT NULL,
    call_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    outcome VARCHAR(30) NOT NULL,
    notes TEXT,
    FOREIGN KEY (lead_id) REFERENCES leads(id),
    FOREIGN KEY (called_by) REFERENCES users(id)
)`, (err) => {
    if (err) console.error('Error creating lead_calls table:', err);
    else console.log('✓ lead_calls table ready');
});

// Band members table
db.run(`CREATE TABLE IF NOT EXISTS band_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    instrument_role VARCHAR(50),
    current_cycle INTEGER DEFAULT 1,
    joined_at DATE DEFAULT (date('now')),
    is_active INTEGER DEFAULT 1,
    FOREIGN KEY (student_id) REFERENCES students(id),
    UNIQUE(student_id)
)`, (err) => {
    if (err) console.error('Error creating band_members table:', err);
    else {
        console.log('✓ band_members table ready');
        db.run(`ALTER TABLE band_members ADD COLUMN current_cycle INTEGER DEFAULT 1`, () => {});
    }
});

// Band rehearsal attendance
db.run(`CREATE TABLE IF NOT EXISTS band_attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    cycle INTEGER DEFAULT 1,
    rehearsal_number INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'absent',
    attendance_date DATE,
    notes TEXT,
    marked_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (marked_by) REFERENCES users(id),
    UNIQUE(student_id, cycle, rehearsal_number)
)`, (err) => {
    if (err) console.error('Error creating band_attendance table:', err);
    else console.log('✓ band_attendance table ready');
});

// Student evaluations table
db.run(`CREATE TABLE IF NOT EXISTS student_evaluations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    level TEXT NOT NULL,
    trainer_id INTEGER NOT NULL,
    attitude_rating INTEGER,
    commitment_rating INTEGER,
    development_rating INTEGER,
    notes TEXT,
    evaluated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (trainer_id) REFERENCES users(id),
    UNIQUE(student_id, level)
)`, (err) => {
    if (err) console.error('Error creating student_evaluations table:', err);
    else console.log('✓ student_evaluations table ready');
});

// Student feedback table
db.run(`CREATE TABLE IF NOT EXISTS student_feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    level TEXT NOT NULL,
    trainer_rating INTEGER,
    development_rating INTEGER,
    experience_rating INTEGER,
    notes TEXT,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    UNIQUE(student_id, level)
)`, (err) => {
    if (err) console.error('Error creating student_feedback table:', err);
    else {
        console.log('✓ student_feedback table ready');
        db.run('ALTER TABLE student_feedback ADD COLUMN token VARCHAR(32)', () => {});
        db.get('SELECT COUNT(*) as c FROM student_feedback', (err, row) => {
            if (!err && row && row.c === 0) {
                db.all('SELECT * FROM student_level_notes WHERE notes IS NOT NULL AND notes != ""', (err, notes) => {
                    if (!err && notes && notes.length > 0) {
                        const stmt = db.prepare('INSERT OR IGNORE INTO student_feedback (student_id, level, notes) VALUES (?, ?, ?)');
                        notes.forEach(n => stmt.run(n.student_id, n.level, n.notes));
                        stmt.finalize(() => console.log(`✓ Migrated ${notes.length} level notes to student_feedback`));
                    }
                });
            }
        });
    }
});

// Initialize core database tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        role TEXT CHECK(role IN ('manager', 'reception', 'trainer', 'operations_manager', 'sales')) NOT NULL,
        status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        national_id VARCHAR(20),
        phone VARCHAR(20),
        parent_phone VARCHAR(20),
        email VARCHAR(100),
        start_date DATE NOT NULL,
        current_level TEXT,
        status TEXT CHECK(status IN ('active', 'inactive', 'freez')) DEFAULT 'active',
        notes TEXT,
        instrument VARCHAR(100),
        address TEXT,
        date_of_birth DATE,
        emergency_contact VARCHAR(100),
        emergency_phone VARCHAR(20),
        trainer_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    const studentColumns = [
        'instrument VARCHAR(100)', 'address TEXT', 'date_of_birth DATE',
        'emergency_contact VARCHAR(100)', 'emergency_phone VARCHAR(20)', 'trainer_id INTEGER'
    ];
    studentColumns.forEach(col => {
        db.run(`ALTER TABLE students ADD COLUMN ${col}`, () => {});
    });

    db.run(`CREATE TABLE IF NOT EXISTS trainers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        specialization VARCHAR(100),
        hourly_rate DECIMAL(10,2),
        hire_date DATE,
        status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        level TEXT CHECK(level IN ('Level One', 'Level Two', 'Level Three', 'Level Four', 'Level Five', 'Level Six')) NOT NULL,
        trainer_id INTEGER,
        schedule_day TEXT CHECK(schedule_day IN ('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
        schedule_time TIME,
        duration_minutes INTEGER DEFAULT 60,
        max_students INTEGER DEFAULT 10,
        status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (trainer_id) REFERENCES trainers(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS student_classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        class_id INTEGER,
        enrollment_date DATE NOT NULL,
        status TEXT CHECK(status IN ('active', 'completed', 'dropped')) DEFAULT 'active',
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (class_id) REFERENCES classes(id),
        UNIQUE(student_id, class_id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        class_id INTEGER,
        date DATE NOT NULL,
        status TEXT CHECK(status IN ('present', 'absent', 'late', 'excused')) DEFAULT 'present',
        notes TEXT,
        marked_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (class_id) REFERENCES classes(id),
        FOREIGN KEY (marked_by) REFERENCES users(id),
        UNIQUE(student_id, class_id, date)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        amount DECIMAL(10,2) NOT NULL,
        payment_date DATE NOT NULL,
        payment_type TEXT CHECK(payment_type IN ('monthly_fee', 'registration', 'materials', 'other')) DEFAULT 'monthly_fee',
        payment_method TEXT CHECK(payment_method IN ('cash', 'card', 'bank_transfer', 'other')) DEFAULT 'cash',
        notes TEXT,
        received_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (received_by) REFERENCES users(id)
    )`);

    const adminPassword = bcrypt.hashSync('admin123', 10);
    db.run(`INSERT OR IGNORE INTO users (username, password_hash, full_name, role) 
            VALUES ('admin', ?, 'System Administrator', 'manager')`, [adminPassword]);
});

// After all tables are created, sync trainers and remove duplicates
setTimeout(() => {
    // Remove duplicate trainers (keep lowest id per user_id)
    db.all(`SELECT user_id, MIN(id) as keep_id FROM trainers WHERE user_id IS NOT NULL GROUP BY user_id HAVING COUNT(*) > 1`, (err, dupes) => {
        if (!err && dupes && dupes.length > 0) {
            dupes.forEach(d => {
                db.run('DELETE FROM trainers WHERE user_id = ? AND id != ?', [d.user_id, d.keep_id]);
            });
            console.log(`✓ Removed ${dupes.length} duplicate trainer(s)`);
        }
    });
    // Sync any trainer users missing from trainers table
    db.all("SELECT u.id FROM users u WHERE u.role = 'trainer' AND u.id NOT IN (SELECT user_id FROM trainers WHERE user_id IS NOT NULL)", (err, rows) => {
        if (!err && rows && rows.length > 0) {
            const stmt = db.prepare('INSERT OR IGNORE INTO trainers (user_id, status) VALUES (?, ?)');
            rows.forEach(r => stmt.run(r.id, 'active'));
            stmt.finalize(() => console.log(`✓ Synced ${rows.length} trainer(s) into trainers table`));
        }
    });
}, 2000);

module.exports = db;
