const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'crossfit.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Migration: Rebuild users table to add 'sales' role
    db.get("SELECT sql FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
        if (row && row.sql && !row.sql.includes("'sales'")) {
            db.run(`ALTER TABLE users RENAME TO users_old`, (err) => {
                if (err) return;
                db.run(`CREATE TABLE users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    full_name VARCHAR(100) NOT NULL,
                    email VARCHAR(100),
                    role TEXT CHECK(role IN ('admin', 'reception', 'coach', 'manager', 'sales')) NOT NULL,
                    status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )`, () => {
                    db.run(`INSERT INTO users SELECT * FROM users_old`, () => {
                        db.run(`DROP TABLE users_old`);
                        console.log('✓ Users table migrated (added sales role)');
                    });
                });
            });
        }
    });

    // Users table (staff accounts)
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        role TEXT CHECK(role IN ('admin', 'reception', 'coach', 'manager', 'sales')) NOT NULL,
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
        membership_type TEXT CHECK(membership_type IN ('1_month', '3_months', '6_months', '1_year')) DEFAULT '1_month',
        membership_start DATE,
        membership_end DATE,
        classes_remaining INTEGER DEFAULT 0,
        preferred_classes TEXT,
        skill_level TEXT CHECK(skill_level IN ('beginner', 'intermediate', 'advanced', 'competition')) DEFAULT 'beginner',
        health_notes TEXT,
        status TEXT CHECK(status IN ('active', 'inactive', 'frozen', 'expired')) DEFAULT 'active',
        coach_id INTEGER,
        sales_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (coach_id) REFERENCES coaches(id),
        FOREIGN KEY (sales_by) REFERENCES users(id)
    )`);

    // Add sales_by column if not exists (migration for existing DBs)
    db.run(`ALTER TABLE members ADD COLUMN sales_by INTEGER REFERENCES users(id)`, (err) => {
        // Ignore error if column already exists
    });

    // Add freeze tracking columns
    db.run(`ALTER TABLE members ADD COLUMN freeze_days INTEGER DEFAULT 0`, (err) => {});
    db.run(`ALTER TABLE members ADD COLUMN freeze_start DATE`, (err) => {});
    
    // Add PT sessions remaining
    db.run(`ALTER TABLE members ADD COLUMN pt_sessions_remaining INTEGER DEFAULT 0`, (err) => {});

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

    // Add class_type column if not exists (migration for existing DBs)
    db.run(`ALTER TABLE members ADD COLUMN class_type TEXT DEFAULT 'crossfit'`, (err) => {
        // Ignore error if column already exists
    });

    // Leads (IV Data) table
    db.run(`CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL UNIQUE,
        email VARCHAR(100),
        gender TEXT CHECK(gender IN ('male', 'female')) DEFAULT 'male',
        notes TEXT,
        source TEXT,
        status TEXT CHECK(status IN ('new', 'contacted', 'interested', 'callback', 'converted', 'lost')) DEFAULT 'new',
        sales_by INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sales_by) REFERENCES users(id)
    )`);

    // Lead call logs table
    db.run(`CREATE TABLE IF NOT EXISTS lead_calls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lead_id INTEGER NOT NULL,
        called_by INTEGER NOT NULL,
        outcome TEXT CHECK(outcome IN ('no_answer', 'callback', 'interested', 'not_interested', 'converted')) NOT NULL,
        notes TEXT,
        callback_time DATE,
        call_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lead_id) REFERENCES leads(id),
        FOREIGN KEY (called_by) REFERENCES users(id)
    )`);
    // Invitations & Orientations table
    db.run(`CREATE TABLE IF NOT EXISTS invitations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL UNIQUE,
        email VARCHAR(100),
        gender TEXT CHECK(gender IN ('male', 'female')) DEFAULT 'male',
        notes TEXT,
        source TEXT,
        status TEXT CHECK(status IN ('new', 'contacted', 'confirmed', 'attended', 'no_show', 'converted')) DEFAULT 'new',
        scheduled_date DATE,
        sales_by INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sales_by) REFERENCES users(id)
    )`);

    // Cash transactions table
    db.run(`CREATE TABLE IF NOT EXISTS cash_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_date DATE NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
        amount DECIMAL(10, 2) NOT NULL,
        category_code TEXT NOT NULL,
        description TEXT,
        payment_method TEXT,
        reference_number TEXT,
        member_id INTEGER,
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id),
        FOREIGN KEY (member_id) REFERENCES members(id)
    )`);

    // Cash categories table
    db.run(`CREATE TABLE IF NOT EXISTS cash_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
        is_active INTEGER DEFAULT 1
    )`);

    // Seed default cash categories
    db.get(`SELECT COUNT(*) as count FROM cash_categories`, (err, row) => {
        if (!err && row && row.count === 0) {
            const stmt = db.prepare('INSERT OR IGNORE INTO cash_categories (code, name, type) VALUES (?, ?, ?)');
            // Income categories
            stmt.run('CF', 'CrossFit', 'income');
            stmt.run('BOX', 'Boxing', 'income');
            stmt.run('KB', 'Kick Boxing', 'income');
            stmt.run('PT', 'Personal Training', 'income');
            // Expense categories
            stmt.run('RENT', 'Rent', 'expense');
            stmt.run('SAL', 'Salaries', 'expense');
            stmt.run('EQUIP', 'Equipment', 'expense');
            stmt.run('MAINT', 'Maintenance & Repairs', 'expense');
            stmt.run('UTIL', 'Utilities', 'expense');
            stmt.run('CLEAN', 'Cleaning', 'expense');
            stmt.run('MARK', 'Marketing', 'expense');
            stmt.run('SUPPLY', 'Supplies', 'expense');
            stmt.run('OTHER_EX', 'Other Expense', 'expense');
            stmt.finalize();
            console.log('✓ Default cash categories seeded');
        }
    });

    db.run(`CREATE INDEX IF NOT EXISTS idx_members_phone ON members(phone)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_members_status ON members(status)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_attendance_member ON attendance(member_id)`);
    db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_unique ON attendance(member_id, class_id, date)`, (err) => {
        // Ignore if duplicates exist
    });
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
