const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'crossfit.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Users table (staff accounts)
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        role TEXT CHECK(role IN ('admin', 'reception', 'coach', 'manager')) NOT NULL,
        status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Coaches table
    db.run(`CREATE TABLE IF NOT EXISTS coaches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        full_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(100),
        specialization TEXT,
        bio TEXT,
        status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    // Members table
    db.run(`CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(100),
        gender TEXT CHECK(gender IN ('male', 'female')) DEFAULT 'male',
        date_of_birth DATE,
        emergency_contact VARCHAR(100),
        emergency_phone VARCHAR(20),
        address TEXT,
        membership_type TEXT CHECK(membership_type IN ('monthly', 'quarterly', 'semi_annual', 'annual', 'class_pack', 'drop_in')) DEFAULT 'monthly',
        membership_start DATE,
        membership_end DATE,
        classes_remaining INTEGER DEFAULT 0,
        preferred_classes TEXT,
        skill_level TEXT CHECK(skill_level IN ('beginner', 'intermediate', 'advanced', 'competition')) DEFAULT 'beginner',
        health_notes TEXT,
        status TEXT CHECK(status IN ('active', 'inactive', 'frozen', 'expired')) DEFAULT 'active',
        coach_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (coach_id) REFERENCES coaches(id)
    )`);

    // Class types
    db.run(`CREATE TABLE IF NOT EXISTS class_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        duration_minutes INTEGER DEFAULT 60,
        max_capacity INTEGER DEFAULT 20,
        color VARCHAR(7) DEFAULT '#667eea'
    )`);

    // Scheduled classes
    db.run(`CREATE TABLE IF NOT EXISTS classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        class_type_id INTEGER NOT NULL,
        coach_id INTEGER,
        day_of_week TEXT CHECK(day_of_week IN ('sunday','monday','tuesday','wednesday','thursday','friday','saturday')) NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        max_capacity INTEGER DEFAULT 20,
        status TEXT CHECK(status IN ('active', 'cancelled')) DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (class_type_id) REFERENCES class_types(id),
        FOREIGN KEY (coach_id) REFERENCES coaches(id)
    )`);

    // Attendance
    db.run(`CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        member_id INTEGER NOT NULL,
        class_id INTEGER NOT NULL,
        date DATE NOT NULL,
        status TEXT CHECK(status IN ('present', 'absent', 'late', 'no_show')) DEFAULT 'present',
        check_in_time TIME,
        notes TEXT,
        recorded_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (member_id) REFERENCES members(id),
        FOREIGN KEY (class_id) REFERENCES classes(id),
        FOREIGN KEY (recorded_by) REFERENCES users(id)
    )`);

    // WODs (Workout of the Day)
    db.run(`CREATE TABLE IF NOT EXISTS wods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(200) NOT NULL,
        date DATE NOT NULL,
        class_type TEXT DEFAULT 'crossfit',
        workout_type TEXT CHECK(workout_type IN ('amrap', 'emom', 'for_time', 'strength', 'skill', 'custom')) DEFAULT 'custom',
        description TEXT NOT NULL,
        time_cap_minutes INTEGER,
        coach_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (coach_id) REFERENCES coaches(id)
    )`);

    // Memberships / Payments
    db.run(`CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        member_id INTEGER NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        payment_type TEXT CHECK(payment_type IN ('membership', 'personal_training', 'merchandise', 'other')) DEFAULT 'membership',
        payment_method TEXT CHECK(payment_method IN ('cash', 'card', 'transfer', 'instapay')) DEFAULT 'cash',
        membership_type TEXT,
        start_date DATE,
        end_date DATE,
        notes TEXT,
        received_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (member_id) REFERENCES members(id),
        FOREIGN KEY (received_by) REFERENCES users(id)
    )`);

    // Personal Training sessions
    db.run(`CREATE TABLE IF NOT EXISTS pt_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        member_id INTEGER NOT NULL,
        coach_id INTEGER NOT NULL,
        date DATE NOT NULL,
        start_time TIME,
        end_time TIME,
        status TEXT CHECK(status IN ('scheduled', 'completed', 'cancelled', 'no_show')) DEFAULT 'scheduled',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (member_id) REFERENCES members(id),
        FOREIGN KEY (coach_id) REFERENCES coaches(id)
    )`);

    // Member body metrics (progress tracking)
    db.run(`CREATE TABLE IF NOT EXISTS body_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        member_id INTEGER NOT NULL,
        date DATE NOT NULL,
        weight DECIMAL(5,2),
        body_fat_percentage DECIMAL(4,1),
        muscle_mass DECIMAL(5,2),
        notes TEXT,
        recorded_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (member_id) REFERENCES members(id)
    )`);

    // Indexes
    db.run(`CREATE INDEX IF NOT EXISTS idx_members_phone ON members(phone)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_members_status ON members(status)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_attendance_member ON attendance(member_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_payments_member ON payments(member_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_wods_date ON wods(date)`);

    // Seed default class types
    db.get(`SELECT COUNT(*) as count FROM class_types`, (err, row) => {
        if (!err && row && row.count === 0) {
            const stmt = db.prepare(`INSERT INTO class_types (name, description, duration_minutes, max_capacity, color) VALUES (?, ?, ?, ?, ?)`);
            stmt.run('CrossFit', 'High-intensity functional training', 60, 20, '#e74c3c');
            stmt.run('Boxing', 'Boxing techniques and conditioning', 60, 15, '#2c3e50');
            stmt.run('Open Gym', 'Self-directed training', 120, 30, '#27ae60');
            stmt.run('Personal Training', 'One-on-one coaching', 60, 1, '#f39c12');
            stmt.run('Mobility & Recovery', 'Stretching and recovery work', 45, 25, '#9b59b6');
            stmt.run('Endurance', 'Cardio and endurance training', 45, 20, '#3498db');
            stmt.finalize();
            console.log('✓ Default class types seeded');
        }
    });

    // Seed default admin user
    db.get(`SELECT COUNT(*) as count FROM users`, (err, row) => {
        if (!err && row && row.count === 0) {
            const hash = bcrypt.hashSync('admin123', 10);
            db.run(`INSERT INTO users (username, password_hash, full_name, role) VALUES (?, ?, ?, ?)`,
                ['admin', hash, 'Admin', 'admin']);
            console.log('✓ Default admin user created (admin/admin123)');
        }
    });
});

console.log('✓ Unbound Gym database initialized');

module.exports = db;
