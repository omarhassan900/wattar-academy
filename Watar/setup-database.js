const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

console.log('Setting up Wattar Academy Database...');

const db = new sqlite3.Database('wattar.db');

db.serialize(() => {
    console.log('Creating database tables...');
    
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        role TEXT CHECK(role IN ('manager', 'reception', 'trainer')) NOT NULL,
        status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Students table
    db.run(`CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        national_id VARCHAR(20) UNIQUE,
        phone VARCHAR(20),
        parent_phone VARCHAR(20),
        email VARCHAR(100),
        start_date DATE NOT NULL,
        current_level TEXT CHECK(current_level IN ('Level One', 'Level Two', 'Level Three', 'Level Four', 'Level Five', 'Level Six')) DEFAULT 'Level One',
        status TEXT CHECK(status IN ('active', 'inactive', 'graduated')) DEFAULT 'active',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Trainers table
    db.run(`CREATE TABLE IF NOT EXISTS trainers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        specialization VARCHAR(100),
        hourly_rate DECIMAL(10,2),
        hire_date DATE,
        status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    // Classes table
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

    // Student_Classes table (Many-to-Many)
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

    // Attendance table
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

    // Payments table
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

    console.log('Creating sample users...');
    
    // Create sample users
    const adminPassword = bcrypt.hashSync('admin123', 10);
    const receptionPassword = bcrypt.hashSync('reception123', 10);
    const trainerPassword = bcrypt.hashSync('trainer123', 10);
    
    db.run(`INSERT OR IGNORE INTO users (username, password_hash, full_name, role) 
            VALUES ('admin', ?, 'System Administrator', 'manager')`, [adminPassword]);
    
    db.run(`INSERT OR IGNORE INTO users (username, password_hash, full_name, role) 
            VALUES ('reception', ?, 'Reception Staff', 'reception')`, [receptionPassword]);
    
    db.run(`INSERT OR IGNORE INTO users (username, password_hash, full_name, role) 
            VALUES ('trainer1', ?, 'Ahmed Mohamed', 'trainer')`, [trainerPassword]);
    
    db.run(`INSERT OR IGNORE INTO users (username, password_hash, full_name, role) 
            VALUES ('trainer2', ?, 'Sara Ali', 'trainer')`, [trainerPassword]);

    console.log('Creating sample trainers...');
    
    // Create trainer records
    db.run(`INSERT OR IGNORE INTO trainers (user_id, specialization, hourly_rate, hire_date) 
            SELECT id, 'Piano & Music Theory', 50.00, '2023-01-01' FROM users WHERE username = 'trainer1'`);
    
    db.run(`INSERT OR IGNORE INTO trainers (user_id, specialization, hourly_rate, hire_date) 
            SELECT id, 'Vocal & Performance', 45.00, '2023-02-01' FROM users WHERE username = 'trainer2'`);

    console.log('Creating sample classes...');
    
    // Create sample classes
    db.run(`INSERT OR IGNORE INTO classes (name, level, trainer_id, schedule_day, schedule_time, max_students) 
            VALUES ('Beginner Piano A', 'Level One', 1, 'Sunday', '10:00', 8)`);
    
    db.run(`INSERT OR IGNORE INTO classes (name, level, trainer_id, schedule_day, schedule_time, max_students) 
            VALUES ('Beginner Piano B', 'Level One', 1, 'Tuesday', '16:00', 8)`);
    
    db.run(`INSERT OR IGNORE INTO classes (name, level, trainer_id, schedule_day, schedule_time, max_students) 
            VALUES ('Intermediate Piano', 'Level Two', 1, 'Thursday', '18:00', 6)`);
    
    db.run(`INSERT OR IGNORE INTO classes (name, level, trainer_id, schedule_day, schedule_time, max_students) 
            VALUES ('Vocal Training A', 'Level One', 2, 'Monday', '17:00', 10)`);
    
    db.run(`INSERT OR IGNORE INTO classes (name, level, trainer_id, schedule_day, schedule_time, max_students) 
            VALUES ('Advanced Vocal', 'Level Three', 2, 'Wednesday', '19:00', 6)`);

    console.log('Creating sample students...');
    
    // Create sample students (first 20 from your data)
    const sampleStudents = [
        { name: 'Shahd Shady', national_id: '1211144569', start_date: '2022-07-06', level: 'Level One' },
        { name: 'Abdelrahman Mohamed', national_id: '1289606188', start_date: '2023-07-06', level: 'Level One' },
        { name: 'Farida Zaki', national_id: '1020534631', start_date: '2023-02-07', level: 'Level Two' },
        { name: 'Ziad Feisal', national_id: '1063797923', start_date: '2023-03-18', level: 'Level Three' },
        { name: 'Ward Mohamed', national_id: '1014482799', start_date: '2023-07-15', level: 'Level One' },
        { name: 'Fayrouz Mohamed', national_id: '1281731363', start_date: '2023-08-12', level: 'Level One' },
        { name: 'Rabaa Mohamed', national_id: '1091536741', start_date: '2023-09-21', level: 'Level Four' },
        { name: 'Fatma Mahmoud', national_id: '1122299256', start_date: '2023-09-21', level: 'Level Two' },
        { name: 'Tarek Ahmed', national_id: '1152849540', start_date: '2023-09-30', level: 'Level One' },
        { name: 'Farida Ahmed', national_id: '1101587032', start_date: '2023-02-07', level: 'Level Five' },
        { name: 'Aryam Ahmed', national_id: '1093734464', start_date: '2022-06-07', level: 'Level Three' },
        { name: 'Nada Abdelaziz', national_id: '1095149676', start_date: '2022-06-01', level: 'Level Four' },
        { name: 'Yasmein Khaled', national_id: '1093975551', start_date: '2022-06-02', level: 'Level Four' },
        { name: 'Jana Osama', national_id: '1117316816', start_date: '2022-02-08', level: 'Level Two' },
        { name: 'Malak Mohamed', national_id: '1067551001', start_date: '2022-01-01', level: 'Level Five' },
        { name: 'Hagar Khalad', national_id: '1128581375', start_date: '2024-01-14', level: 'Level Three' },
        { name: 'Malik Ahmed', national_id: '1001523736', start_date: '2024-01-20', level: 'Level Two' },
        { name: 'Karin Kamal', national_id: '1151903424', start_date: '2024-01-28', level: 'Level One' },
        { name: 'Maya Mohamed', national_id: '1151903425', start_date: '2024-01-28', level: 'Level One' },
        { name: 'Hana Amr', national_id: '1094616691', start_date: '2024-02-10', level: 'Level Three' }
    ];

    const stmt = db.prepare(`INSERT OR IGNORE INTO students (name, national_id, start_date, current_level) VALUES (?, ?, ?, ?)`);
    sampleStudents.forEach(student => {
        stmt.run(student.name, student.national_id, student.start_date, student.level);
    });
    stmt.finalize();

    console.log('Assigning students to classes...');
    
    // Assign some students to classes
    db.run(`INSERT OR IGNORE INTO student_classes (student_id, class_id, enrollment_date) 
            SELECT s.id, 1, s.start_date FROM students s WHERE s.current_level = 'Level One' LIMIT 6`);
    
    db.run(`INSERT OR IGNORE INTO student_classes (student_id, class_id, enrollment_date) 
            SELECT s.id, 2, s.start_date FROM students s WHERE s.current_level = 'Level One' AND s.id NOT IN (SELECT student_id FROM student_classes WHERE class_id = 1) LIMIT 4`);
    
    db.run(`INSERT OR IGNORE INTO student_classes (student_id, class_id, enrollment_date) 
            SELECT s.id, 3, s.start_date FROM students s WHERE s.current_level = 'Level Two' LIMIT 5`);
    
    db.run(`INSERT OR IGNORE INTO student_classes (student_id, class_id, enrollment_date) 
            SELECT s.id, 4, s.start_date FROM students s WHERE s.current_level IN ('Level One', 'Level Two') LIMIT 8`);
    
    db.run(`INSERT OR IGNORE INTO student_classes (student_id, class_id, enrollment_date) 
            SELECT s.id, 5, s.start_date FROM students s WHERE s.current_level IN ('Level Three', 'Level Four', 'Level Five') LIMIT 4`);

    console.log('Database setup completed successfully!');
    console.log('');
    console.log('Sample accounts created:');
    console.log('Manager: username=admin, password=admin123');
    console.log('Reception: username=reception, password=reception123');
    console.log('Trainer 1: username=trainer1, password=trainer123');
    console.log('Trainer 2: username=trainer2, password=trainer123');
    console.log('');
    console.log('You can now start the application with: npm start');
});

db.close();