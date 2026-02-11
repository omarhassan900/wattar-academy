const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const moment = require('moment');
const path = require('path');

const app = express();
const PORT = 3000;

// Database setup
const db = new sqlite3.Database('wattar.db');

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Session middleware
app.use(session({
    secret: 'wattar-academy-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));
app.use((req, res, next) => {
    res.locals.currentUrl = req.originalUrl;
    next();
});
// Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

const requireRole = (roles) => {
    return (req, res, next) => {
        if (req.session.user && roles.includes(req.session.user.role)) {
            next();
        } else {
            res.status(403).render('error', { message: 'Access denied' });
        }
    };
};

// Initialize database tables
db.serialize(() => {
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

    // Create default admin user
    const adminPassword = bcrypt.hashSync('admin123', 10);
    db.run(`INSERT OR IGNORE INTO users (username, password_hash, full_name, role) 
            VALUES ('admin', ?, 'System Administrator', 'manager')`, [adminPassword]);
});

// Authentication Routes
app.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('login', { error: null });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    db.get("SELECT * FROM users WHERE username = ? AND status = 'active'", [username], (err, user) => {
        if (err) {
            console.error(err);
            return res.render('login', { error: 'Database error' });
        }
        
        if (user && bcrypt.compareSync(password, user.password_hash)) {
            req.session.user = {
                id: user.id,
                username: user.username,
                full_name: user.full_name,
                role: user.role
            };
            res.redirect('/');
        } else {
            res.render('login', { error: 'Invalid username or password' });
        }
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});
app.get('/', requireAuth, (req, res) => {
    const user = req.session.user;
    if(user.role == 'reception'){
        res.redirect('/attendance');
    } else if(user.role == 'trainer'){
        res.redirect('/attendance');
    }
    else {
     res.redirect('/dashboard');
    }
});

// Dashboard Routes
app.get('/dashboard', requireAuth, requireRole(['manager','reception']), (req, res) => {
    const user = req.session.user;
    
    // Get comprehensive dashboard statistics
    const queries = {
        // Basic counts
        basicStats: `
            SELECT 
                (SELECT COUNT(*) FROM students WHERE status = 'active') as total_students,
                (SELECT COUNT(*) FROM students WHERE status = 'inactive') as inactive_students,
                (SELECT COUNT(*) FROM students WHERE status = 'graduated') as graduated_students,
                (SELECT COUNT(*) FROM classes WHERE status = 'active') as total_classes,
                (SELECT COUNT(*) FROM trainers WHERE status = 'active') as total_trainers,
                (SELECT COUNT(*) FROM attendance WHERE date = date('now')) as today_attendance
        `,
        
        // Students by month/level
        studentsByMonth: `
            SELECT current_level, COUNT(*) as count 
            FROM students 
            WHERE status = 'active'
            GROUP BY current_level 
            ORDER BY current_level
        `,
        
        // Students by instrument
        studentsByInstrument: `
            SELECT instrument, COUNT(*) as count 
            FROM students 
            WHERE status = 'active' AND instrument IS NOT NULL AND instrument != ''
            GROUP BY instrument 
            ORDER BY count DESC
            LIMIT 5
        `,
        
        // Recent attendance (last 7 days)
        recentAttendance: `
            SELECT 
                DATE(s.session_date) as date,
                COUNT(DISTINCT a.student_id) as students_present
            FROM sessions s
            LEFT JOIN attendance a ON s.id = a.session_id AND a.status IN ('present', 'attended')
            WHERE s.session_date >= date('now', '-7 days')
            GROUP BY DATE(s.session_date)
            ORDER BY date DESC
            LIMIT 7
        `,
        
        // Attendance rate (last 30 days)
        attendanceRate: `
            SELECT 
                COUNT(CASE WHEN a.status IN ('present', 'attended') THEN 1 END) as present_count,
                COUNT(*) as total_records
            FROM attendance a
            JOIN sessions s ON a.session_id = s.id
            WHERE s.session_date >= date('now', '-30 days')
        `,
        
        getalltransactions: `SELECT ct.*, cc.name as category_name, cc.type as category_type
        FROM cash_transactions ct
        LEFT JOIN cash_categories cc ON ct.category_code = cc.code
        ORDER BY ct.transaction_date DESC, ct.created_at DESC`,
        
        getallcategories: `SELECT * FROM cash_categories WHERE is_active = 1 ORDER BY type, name`,
        monthlyFinance: `
            SELECT 
                strftime('%m', transaction_date) as month,
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense
            FROM cash_transactions
            WHERE transaction_date >= date('now','start of year')
            GROUP BY month
            ORDER BY month
        `,
        
    };
    
    // Execute all queries
    db.all(queries.basicStats, (err, basicStats) => {
        if (err) {
            console.error('Error fetching basic stats:', err);
            return res.status(500).send('Database error');
        }
        
        db.all(queries.studentsByMonth, (err, studentsByMonth) => {
            if (err) console.error('Error fetching students by month:', err);
            
            db.all(queries.studentsByInstrument, (err, studentsByInstrument) => {
                if (err) console.error('Error fetching students by instrument:', err);
                
                db.all(queries.recentAttendance, (err, recentAttendance) => {
                    if (err) console.error('Error fetching recent attendance:', err);
                    
                    db.all(queries.attendanceRate, (err, attendanceRate) => {
                        if (err) console.error('Error fetching attendance rate:', err);
                        
                        // Calculate attendance percentage
                        let attendancePercentage = 0;
                        if (attendanceRate && attendanceRate[0] && attendanceRate[0].total_records > 0) {
                            attendancePercentage = Math.round((attendanceRate[0].present_count / attendanceRate[0].total_records) * 100);
                        }
                        // Get all transactions
                        db.all(queries.getalltransactions, (err, transactions) => {
                            if (err) {
                                console.error('Error fetching transactions:', err);
                                return res.status(500).send('Database error');
                            }
                            
                            // Get all categories
                            db.all(queries.getallcategories, (err, categories) => {
                                if (err) {
                                    console.error('Error fetching categories:', err);
                                    return res.status(500).send('Database error');
                                }
                                
                                // Calculate totals
                                const totalIncome = transactions
                                    .filter(t => t.type === 'income')
                                    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
                                
                                const totalExpense = transactions
                                    .filter(t => t.type === 'expense')
                                    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
                                
                                const balance = totalIncome - totalExpense;
                        db.all(queries.monthlyFinance, (err, monthlyFinance) => {
                            if (err) {
                                console.error('Error fetching monthly finance:', err);
                                return res.status(500).send('Database error');
                            }

                            // Prepare 12 months structure
                            const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                            
                            const incomeData = Array(12).fill(0);
                            const expenseData = Array(12).fill(0);

                            monthlyFinance.forEach(row => {
                                const index = parseInt(row.month) - 1;
                                incomeData[index] = row.total_income || 0;
                                expenseData[index] = row.total_expense || 0;
                            });

                            const financeChartData = {
                                labels: monthLabels,
                                income: incomeData,
                                expenses: expenseData
                            };
                                console.log(studentsByMonth);
                                // Render dashboard view as a string
                                res.render('dashboard', { 
                                    user, 
                                    transactions,
                                    categories,
                                    totalIncome,
                                    totalExpense,
                                    balance,
                                    financeChartData,
                                    stats: basicStats[0] || { 
                                        total_students: 0, 
                                        inactive_students: 0,
                                        graduated_students: 0,
                                        total_classes: 0, 
                                        total_trainers: 0, 
                                        today_attendance: 0 
                                    },
                                    studentsByMonth: studentsByMonth || [],
                                    studentsByInstrument: studentsByInstrument || [],
                                    recentAttendance: recentAttendance || [],
                                    attendancePercentage: attendancePercentage
                                }, (err, html) => {
                                    if (err) {
                                        console.error(err);
                                        return res.status(500).send('Render error');
                                    }
                                    
                                    // Wrap in layout
                                    res.render('layout', {
                                        body: html,
                                        user: user,
                                        activemenu: 'dashboard' 
                                    });
                                });
                            });
                            });
                        });
                    });
                });
            });
        });
    });
});

// Student Routes
app.get('/students', requireAuth, (req, res) => {
    const user = req.session.user;
    let query = `
        SELECT s.*, u.full_name as trainer_name
        FROM students s
        LEFT JOIN trainers t ON s.trainer_id = t.id
        LEFT JOIN users u ON t.user_id = u.id
        ORDER BY s.name
    `;
    let params = [];
    
    // If trainer, only show their students
    if (user.role === 'trainer') {
        query = `
            SELECT s.*, u.full_name as trainer_name
            FROM students s
            LEFT JOIN trainers t ON s.trainer_id = t.id
            LEFT JOIN users u ON t.user_id = u.id
            WHERE s.trainer_id = (SELECT id FROM trainers WHERE user_id = ?)
            ORDER BY s.name
        `;
        params = [user.id];
    }
    
    db.all(query, params, (err, students) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        
        // Get unique instruments
        const instrumentsSet = new Set();
        students.forEach(student => {
            if (student.instrument) {
                instrumentsSet.add(student.instrument);
            }
        });
        const instruments = Array.from(instrumentsSet).sort();
        
        // Get all trainers for the dropdown
        db.all(`
            SELECT t.id, u.full_name as name, t.specialization
            FROM trainers t
            JOIN users u ON t.user_id = u.id
            WHERE t.status = 'active'
            ORDER BY u.full_name
        `, (err, trainers) => {
            if (err) {
                console.error('Error fetching trainers:', err);
            }
            
            // Render students view as a string
            res.render('students', {
                user,
                students,
                instruments,
                trainers: trainers || []
            }, (err, html) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Render error');
                }
                
                // Wrap in layout
                res.render('layout', {
                    body: html,
                    user: user,
                    activemenu: 'students' 
                });
            });
        });
    });
});

// Keep the old inline rendering as backup (commented out)
/*
app.get('/students-old', requireAuth, (req, res) => {
    const user = req.session.user;
    let query = "SELECT * FROM students WHERE status = 'active' ORDER BY name";
    let params = [];
    
    // If trainer, only show their students
    if (user.role === 'trainer') {
        query = `
            SELECT DISTINCT s.* FROM students s
            JOIN student_classes sc ON s.id = sc.student_id
            JOIN classes c ON sc.class_id = c.id
            JOIN trainers t ON c.trainer_id = t.id
            WHERE t.user_id = ? AND s.status = 'active'
            ORDER BY s.name
        `;
        params = [user.id];
    }
    
    db.all(query, params, (err, students) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        
        // Render students content and pass to layout
        const studentsContent = `
            <div class="row">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h1><i class="fas fa-users text-primary me-2"></i>Students Management</h1>
                        ${(user.role === 'manager' || user.role === 'reception') ? `
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addStudentModal">
                            <i class="fas fa-user-plus me-2"></i>Add New Student
                        </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        res.render('layout', { 
            body: studentsContent,
            user: user
        });
    });
});
*/

app.post('/students', requireAuth, requireRole(['manager', 'reception']), (req, res) => {
    const { name, national_id, phone, parent_phone, email, start_date, current_level, instrument, address, date_of_birth, emergency_contact, emergency_phone, trainer_id } = req.body;
    
    db.run(`
        INSERT INTO students (name, national_id, phone, parent_phone, email, start_date, current_level, instrument, address, date_of_birth, emergency_contact, emergency_phone, trainer_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, national_id, phone, parent_phone, email, start_date, current_level, instrument, address, date_of_birth, emergency_contact, emergency_phone, trainer_id], function(err) {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        res.redirect('/students');
    });
});

// Edit Student Route
app.post('/students/:id/edit', requireAuth, requireRole(['manager', 'reception']), (req, res) => {
    const { id } = req.params;
    const { name, national_id, phone, parent_phone, email, start_date, current_level, instrument, status, address, date_of_birth, emergency_contact, emergency_phone, trainer_id } = req.body;
    
    console.log('Edit student - trainer_id received:', trainer_id);
    console.log('Edit student - full body:', req.body);
    
    // Check if national_id is being changed and if it already exists for another student
    if (national_id && national_id.trim() !== '') {
        db.get('SELECT id FROM students WHERE national_id = ? AND id != ?', [national_id, id], (err, existingStudent) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }
            
            if (existingStudent) {
                return res.status(400).send('National ID already exists for another student');
            }
            
            // Proceed with update
            updateStudent();
        });
    } else {
        // If national_id is empty, set it to NULL
        updateStudent();
    }
    
    function updateStudent() {
        // Set national_id to NULL if empty
        const finalNationalId = (national_id && national_id.trim() !== '') ? national_id : null;
        
        db.run(`
            UPDATE students 
            SET name = ?, national_id = ?, phone = ?, parent_phone = ?, email = ?, 
                start_date = ?, current_level = ?, instrument = ?, status = ?,
                address = ?, date_of_birth = ?, emergency_contact = ?, emergency_phone = ?, trainer_id = ?
            WHERE id = ?
        `, [name, finalNationalId, phone, parent_phone, email, start_date, current_level, instrument, status, address, date_of_birth, emergency_contact, emergency_phone, trainer_id, id], function(err) {
            if (err) {
                console.error('Error updating student:', err);
                return res.status(500).send('Database error: ' + err.message);
            }
            res.redirect('/students');
        });
    }
});

// Classes Routes
app.get('/classes', requireAuth, (req, res) => {
    const user = req.session.user;
    let query = `
        SELECT c.*, u.full_name as trainer_name,
               COUNT(sc.student_id) as student_count
        FROM classes c
        LEFT JOIN trainers t ON c.trainer_id = t.id
        LEFT JOIN users u ON t.user_id = u.id
        LEFT JOIN student_classes sc ON c.id = sc.class_id AND sc.status = 'active'
        WHERE c.status = 'active'
        GROUP BY c.id
        ORDER BY c.name
    `;
    let params = [];
    
    // If trainer, only show their classes
    if (user.role === 'trainer') {
        query = `
            SELECT c.*, u.full_name as trainer_name,
                   COUNT(sc.student_id) as student_count
            FROM classes c
            LEFT JOIN trainers t ON c.trainer_id = t.id
            LEFT JOIN users u ON t.user_id = u.id
            LEFT JOIN student_classes sc ON c.id = sc.class_id AND sc.status = 'active'
            WHERE c.status = 'active' AND u.id = ?
            GROUP BY c.id
            ORDER BY c.name
        `;
        params = [user.id];
    }
    
    db.all(query, params, (err, classes) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        
        // Get trainers for dropdown (manager/reception only)
        if (user.role !== 'trainer') {
            db.all(`
                SELECT t.id, u.full_name 
                FROM trainers t 
                JOIN users u ON t.user_id = u.id 
                WHERE t.status = 'active'
            `, (err, trainers) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Database error');
                }
                res.render('classes', { classes, trainers, user });
            });
        } else {
            res.render('classes', { classes, trainers: [], user });
        }
    });
});

app.post('/classes', requireAuth, requireRole(['manager']), (req, res) => {
    const { name, level, trainer_id, schedule_day, schedule_time, duration_minutes, max_students } = req.body;
    
    db.run(`
        INSERT INTO classes (name, level, trainer_id, schedule_day, schedule_time, duration_minutes, max_students)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [name, level, trainer_id, schedule_day, schedule_time, duration_minutes, max_students], function(err) {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        res.redirect('/classes');
    });
});

// Attendance Routes
app.get('/attendance', requireAuth, (req, res) => {
    const user = req.session.user;
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    
    // Get search and filter parameters
    const searchTerm = req.query.search || '';
    const monthFilter = req.query.month || '';
    const instrumentFilter = req.query.instrument || '';
    const statusFilter = req.query.status || '';
    
    // Build WHERE clause based on filters
    let whereConditions = ["s.status = 'active'"];
    let queryParams = [];
    
    if (searchTerm) {
        whereConditions.push("s.name LIKE ?");
        queryParams.push(`%${searchTerm}%`);
    }
    if (monthFilter) {
        whereConditions.push("s.current_level = ?");
        queryParams.push(monthFilter);
    }
    if (instrumentFilter) {
        whereConditions.push("s.instrument = ?");
        queryParams.push(instrumentFilter);
    }
    if (statusFilter) {
        whereConditions.push("s.status = ?");
        queryParams.push(statusFilter);
    }
    
    const whereClause = whereConditions.join(' AND ');
    
    // Get total count with filters
    const countQuery = `SELECT COUNT(*) as total FROM students s WHERE ${whereClause}`;
    
    db.get(countQuery, queryParams, (err, countResult) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        
        const totalStudents = countResult.total;
        const totalPages = Math.ceil(totalStudents / limit);
        
        // Get paginated students with filters
        const studentsQuery = `
            SELECT 
                s.id, s.name, s.phone, s.current_level, s.instrument, s.status
            FROM students s
            WHERE ${whereClause}
            ORDER BY s.current_level, s.name
            LIMIT ? OFFSET ?
        `;
        
        const paginatedParams = [...queryParams, limit, offset];
        
        db.all(studentsQuery, paginatedParams, (err, students) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }
            
            if (students.length === 0) {
                db.all('SELECT DISTINCT instrument FROM students WHERE instrument IS NOT NULL AND instrument != "" ORDER BY instrument', (err, instRows) => {
                    const instruments = instRows ? instRows.map(r => r.instrument) : [];
                    
                    return res.render('attendance', {
                        user,
                        students: [],
                        instruments: instruments,
                        currentPage: page,
                        totalPages: totalPages,
                        totalStudents: totalStudents,
                        searchTerm: searchTerm,
                        monthFilter: monthFilter,
                        instrumentFilter: instrumentFilter,
                        statusFilter: statusFilter
                    }, (err, html) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send('Render error');
                        }
                        res.render('layout', { body: html, user: user });
                    });
                });
                return;
            }
            
            // Get sessions for these students' levels
            const levels = [...new Set(students.map(s => s.current_level))];
            const placeholders = levels.map(() => '?').join(',');
            
            const sessionsQuery = `
                SELECT id, session_number, session_date, level
                FROM sessions
                WHERE level IN (${placeholders})
                ORDER BY session_number
            `;
            
            db.all(sessionsQuery, levels, (err, sessions) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Database error');
                }
                
                // Get attendance for these students only
                const studentIds = students.map(s => s.id);
                const studentPlaceholders = studentIds.map(() => '?').join(',');
                
                const attendanceQuery = `
                    SELECT student_id, session_id, status, notes
                    FROM attendance
                    WHERE student_id IN (${studentPlaceholders})
                `;
                
                db.all(attendanceQuery, studentIds, (err, attendanceRecords) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Database error');
                    }
                    
                    // Build maps
                    const attendanceMap = {};
                    attendanceRecords.forEach(record => {
                        const key = `${record.student_id}_${record.session_id}`;
                        attendanceMap[key] = {
                            status: record.status,
                            notes: record.notes
                        };
                    });
                    
                    const sessionsByLevel = {};
                    sessions.forEach(session => {
                        if (!sessionsByLevel[session.level]) {
                            sessionsByLevel[session.level] = [];
                        }
                        sessionsByLevel[session.level].push(session);
                    });
                    
                    // Build student data
                    const studentsWithData = students.map(student => {
                        const studentSessions = (sessionsByLevel[student.current_level] || []).map(session => {
                            const key = `${student.id}_${session.id}`;
                            const attendance = attendanceMap[key] || {};
                            return {
                                session_id: session.id,
                                session_number: session.session_number,
                                session_date: session.session_date,
                                attendance_status: attendance.status,
                                notes: attendance.notes
                            };
                        });
                        
                        return {
                            ...student,
                            sessions: studentSessions,
                            general_notes: ''
                        };
                    });
                    
                    // Get all instruments for filter
                    db.all('SELECT DISTINCT instrument FROM students WHERE instrument IS NOT NULL AND instrument != "" ORDER BY instrument', (err, instRows) => {
                        const instruments = instRows ? instRows.map(r => r.instrument) : [];
                        
                        res.render('attendance', {
                            user,
                            students: studentsWithData,
                            instruments,
                            currentPage: page,
                            totalPages: totalPages,
                            totalStudents: totalStudents,
                            searchTerm: searchTerm,
                            monthFilter: monthFilter,
                            instrumentFilter: instrumentFilter,
                            statusFilter: statusFilter
                        }, (err, html) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).send('Render error');
                            }
                            res.render('layout', { body: html, user: user });
                        });
                    });
                });
            });
        });
    });
});

// API endpoint for saving all attendance
app.post('/attendance/save-all', requireAuth, (req, res) => {
    const { attendance } = req.body;
    const user = req.session.user;
    
    if (!attendance || attendance.length === 0) {
        return res.json({ success: false, error: 'No attendance data provided' });
    }
    
    console.log('Saving attendance:', attendance); // Debug log
    
    // Get unique session IDs
    const sessionIds = [...new Set(attendance.map(a => a.session_id))];
    const placeholders = sessionIds.map(() => '?').join(',');
    
    // Delete existing attendance for these sessions
    db.run(`DELETE FROM attendance WHERE session_id IN (${placeholders})`, sessionIds, (err) => {
        if (err) {
            console.error('Error deleting old attendance:', err);
            return res.json({ success: false, error: 'Database error deleting old records' });
        }
        
        // Insert new attendance records
        // Map 'attended' to 'present' for database compatibility
        const stmt = db.prepare(`
            INSERT INTO attendance (student_id, session_id, status, marked_by, created_at) 
            VALUES (?, ?, ?, ?, datetime('now'))
        `);
        
        let errorOccurred = false;
        attendance.forEach(record => {
            const dbStatus = record.status === 'attended' ? 'present' : 'absent';
            stmt.run(record.student_id, record.session_id, dbStatus, user.id, (err) => {
                if (err) {
                    console.error('Error inserting attendance:', err);
                    errorOccurred = true;
                }
            });
        });
        
        stmt.finalize((err) => {
            if (err || errorOccurred) {
                console.error('Error finalizing statement:', err);
                return res.json({ success: false, error: 'Database error saving records' });
            }
            
            // Now update session dates ONLY for sessions that were just marked
            const today = new Date().toISOString().split('T')[0];
            const dateStmt = db.prepare("UPDATE sessions SET session_date = ? WHERE id = ?");
            sessionIds.forEach(sessionId => {
                dateStmt.run(today, sessionId, (err) => {
                    if (err) console.error('Error updating session date:', err);
                });
            });
            dateStmt.finalize((err) => {
                if (err) {
                    console.error('Error finalizing date update:', err);
                }
                res.json({ success: true, message: 'Attendance saved successfully' });
            });
        });
    });
});

// API endpoint for clearing attendance
app.post('/attendance/clear', requireAuth, (req, res) => {
    const { student_id, session_id } = req.body;
    
    if (!student_id || !session_id) {
        return res.json({ success: false, error: 'Missing student_id or session_id' });
    }
    
    // Delete the attendance record
    db.run('DELETE FROM attendance WHERE student_id = ? AND session_id = ?', [student_id, session_id], (err) => {
        if (err) {
            console.error('Error clearing attendance:', err);
            return res.json({ success: false, error: 'Database error' });
        }
        
        res.json({ success: true, message: 'Attendance cleared successfully' });
    });
});

// Export attendance to CSV
app.get('/attendance/export-csv', requireAuth, (req, res) => {
    // Get all active students
    const studentsQuery = `
        SELECT 
            s.id,
            s.name as student_name,
            s.phone,
            s.current_level,
            s.instrument,
            s.status as student_status
        FROM students s
        WHERE s.status = 'active'
        ORDER BY s.current_level, s.name
    `;
    
    db.all(studentsQuery, (err, students) => {
        if (err) {
            console.error('Error fetching students:', err);
            return res.status(500).send('Database error');
        }
        
        // Get all sessions
        const sessionsQuery = `
            SELECT id, session_number, session_date, level
            FROM sessions
            ORDER BY level, session_number
        `;
        
        db.all(sessionsQuery, (err, sessions) => {
            if (err) {
                console.error('Error fetching sessions:', err);
                return res.status(500).send('Database error');
            }
            
            // Get all attendance records
            const attendanceQuery = `
                SELECT student_id, session_id, status, notes, created_at
                FROM attendance
            `;
            
            db.all(attendanceQuery, (err, attendanceRecords) => {
                if (err) {
                    console.error('Error fetching attendance:', err);
                    return res.status(500).send('Database error');
                }
                
                // Build attendance map for quick lookup
                const attendanceMap = {};
                attendanceRecords.forEach(record => {
                    const key = `${record.student_id}_${record.session_id}`;
                    attendanceMap[key] = {
                        status: record.status,
                        notes: record.notes,
                        created_at: record.created_at
                    };
                });
                
                // Build sessions map by level
                const sessionsByLevel = {};
                sessions.forEach(session => {
                    if (!sessionsByLevel[session.level]) {
                        sessionsByLevel[session.level] = [];
                    }
                    sessionsByLevel[session.level].push(session);
                });
                
                // Create CSV header with session columns
                let csv = 'Student Name,Phone,Level,Instrument,Status,Session 1,Session 2,Session 3,Session 4,Session 1 Date,Session 2 Date,Session 3 Date,Session 4 Date\n';
                
                // For each student, create ONE row with all sessions as columns
                students.forEach(student => {
                    const studentSessions = sessionsByLevel[student.current_level] || [];
                    
                    // Prepare session data for all 4 sessions
                    const sessionData = [];
                    const sessionDates = [];
                    
                    for (let sessionNum = 1; sessionNum <= 4; sessionNum++) {
                        const session = studentSessions.find(s => s.session_number === sessionNum);
                        
                        if (session) {
                            const key = `${student.id}_${session.id}`;
                            const attendance = attendanceMap[key];
                            
                            // Session attendance value (TRUE/FALSE or empty)
                            let hasAttendance = false;
                            if (attendance) {
                                if (attendance.status === 'present' || attendance.status === 'attended') {
                                    sessionData.push('TRUE');
                                    hasAttendance = true;
                                } else if (attendance.status === 'absent') {
                                    sessionData.push('FALSE');
                                    hasAttendance = true;
                                } else {
                                    sessionData.push('');
                                }
                            } else {
                                sessionData.push(''); // Not marked
                            }
                            
                            // Session date - ONLY show if attendance is marked
                            if (hasAttendance && session.session_date) {
                                const sessionDate = new Date(session.session_date).toLocaleDateString('en-GB');
                                sessionDates.push(sessionDate);
                            } else {
                                sessionDates.push(''); // No date if not marked
                            }
                        } else {
                            sessionData.push(''); // Session doesn't exist
                            sessionDates.push('');
                        }
                    }
                    
                    // Build the CSV row
                    csv += `"${student.student_name}","${student.phone || ''}","${student.current_level}","${student.instrument || ''}","${student.student_status}",${sessionData[0]},${sessionData[1]},${sessionData[2]},${sessionData[3]},"${sessionDates[0]}","${sessionDates[1]}","${sessionDates[2]}","${sessionDates[3]}"\n`;
                });
                
                // Set headers for file download
                const filename = `attendance_export_${new Date().toISOString().split('T')[0]}.csv`;
                res.setHeader('Content-Type', 'text/csv; charset=utf-8');
                res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
                res.send('\uFEFF' + csv); // Add BOM for Excel compatibility
            });
        });
    });
});

// API endpoint for saving individual session attendance
app.post('/attendance/session-save', requireAuth, (req, res) => {
    const { session_number, attendance, session_dates } = req.body;
    const user = req.session.user;
    
    // Update session dates if provided
    if (session_dates) {
        const dateStmt = db.prepare("UPDATE sessions SET session_date = ? WHERE id = ?");
        for (const sessionId in session_dates) {
            if (session_dates[sessionId]) {
                dateStmt.run(session_dates[sessionId], sessionId);
            }
        }
        dateStmt.finalize();
    }
    
    // Get all session IDs for this session number
    db.all("SELECT id FROM sessions WHERE session_number = ?", [session_number], (err, sessions) => {
        if (err) {
            console.error(err);
            return res.json({ success: false, error: 'Database error' });
        }
        
        const sessionIds = sessions.map(s => s.id);
        
        // Delete existing attendance for these sessions
        const placeholders = sessionIds.map(() => '?').join(',');
        db.run(`DELETE FROM attendance WHERE session_id IN (${placeholders})`, sessionIds, (err) => {
            if (err) {
                console.error(err);
                return res.json({ success: false, error: 'Database error' });
            }
            
            // Insert new attendance records
            const stmt = db.prepare(`
                INSERT INTO attendance (student_id, session_id, status, marked_by, created_at) 
                VALUES (?, ?, ?, ?, datetime('now'))
            `);
            
            attendance.forEach(record => {
                stmt.run(record.student_id, record.session_id, record.status, user.id);
            });
            
            stmt.finalize((err) => {
                if (err) {
                    console.error(err);
                    return res.json({ success: false, error: 'Database error' });
                }
                
                res.json({ success: true, message: `Session ${session_number} saved successfully` });
            });
        });
    });
});

app.post('/attendance/all', requireAuth, (req, res) => {
    const { attendance, session_dates, student_notes } = req.body;
    const user = req.session.user;
    
    // Update session dates first
    if (session_dates) {
        const dateStmt = db.prepare("UPDATE sessions SET session_date = ? WHERE id = ?");
        for (const sessionId in session_dates) {
            if (session_dates[sessionId]) {
                dateStmt.run(session_dates[sessionId], sessionId);
            }
        }
        dateStmt.finalize();
    }
    
    // Clear existing attendance for all sessions
    db.run("DELETE FROM attendance", (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        
        // Insert new attendance records
        const stmt = db.prepare(`
            INSERT INTO attendance (student_id, session_id, status, notes, marked_by, created_at) 
            VALUES (?, ?, ?, ?, ?, datetime('now'))
        `);
        
        // Process attendance data
        for (const studentId in attendance) {
            const studentAttendance = attendance[studentId];
            const studentNote = student_notes && student_notes[studentId] ? student_notes[studentId] : null;
            
            for (const sessionId in studentAttendance) {
                const status = studentAttendance[sessionId];
                stmt.run(studentId, sessionId, status, studentNote, user.id);
            }
        }
        
        stmt.finalize((err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }
            
            res.redirect('/attendance');
        });
    });
});

// API endpoint for updating student month
app.post('/api/update-student-month', requireAuth, (req, res) => {
    const { student_id, month } = req.body;
    
    // Update student's month
    db.run("UPDATE students SET current_level = ? WHERE id = ?", [month, student_id], (err) => {
        if (err) {
            console.error('Error updating student month:', err);
            return res.json({ success: false, error: 'Database error' });
        }
        
        // Get the new sessions for this month
        db.all(`
            SELECT sess.id as session_id, sess.session_number, sess.session_date,
                   a.status as attendance_status
            FROM sessions sess
            LEFT JOIN attendance a ON a.session_id = sess.id AND a.student_id = ?
            WHERE sess.level = ?
            ORDER BY sess.session_number
        `, [student_id, month], (err, sessions) => {
            if (err) {
                console.error('Error fetching sessions:', err);
                return res.json({ success: false, error: 'Database error' });
            }
            
            res.json({ success: true, sessions: sessions });
        });
    });
});

// API endpoint for updating session dates
app.post('/api/session-date', requireAuth, (req, res) => {
    const { session_id, session_date } = req.body;
    
    db.run("UPDATE sessions SET session_date = ? WHERE id = ?", [session_date, session_id], (err) => {
        if (err) {
            console.error('Error updating session date:', err);
            return res.json({ success: false, error: 'Database error' });
        }
        
        res.json({ success: true });
    });
});

app.post('/attendance/session', requireAuth, (req, res) => {
    const { session_id, session_date, attendance, notes } = req.body;
    const user = req.session.user;
    
    // Update session date if provided
    if (session_date) {
        db.run("UPDATE sessions SET session_date = ? WHERE id = ?", [session_date, session_id], (err) => {
            if (err) {
                console.error('Error updating session date:', err);
            }
        });
    }
    
    // Clear existing attendance for this session
    db.run("DELETE FROM attendance WHERE session_id = ?", [session_id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        
        // Insert new attendance records
        const stmt = db.prepare(`
            INSERT INTO attendance (student_id, session_id, status, notes, marked_by, created_at) 
            VALUES (?, ?, ?, ?, ?, datetime('now'))
        `);
        
        for (const studentId in attendance) {
            const status = attendance[studentId];
            const studentNotes = notes && notes[studentId] ? notes[studentId] : null;
            stmt.run(studentId, session_id, status, studentNotes, user.id);
        }
        
        stmt.finalize((err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }
            
            // Get session details for redirect
            db.get("SELECT level FROM sessions WHERE id = ?", [session_id], (err, session) => {
                if (err) {
                    console.error(err);
                    return res.redirect('/attendance');
                }
                
                res.redirect(`/attendance?level=${encodeURIComponent(session.level)}&session=${session_id}`);
            });
        });
    });
});

// API endpoint to get sessions for a level
app.get('/api/sessions', requireAuth, (req, res) => {
    const level = req.query.level;
    
    if (!level) {
        return res.json([]);
    }
    
    db.all("SELECT * FROM sessions WHERE level = ? ORDER BY session_number", [level], (err, sessions) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.json(sessions);
    });
});

// Session Attendance Summary Route
app.get('/attendance/summary', requireAuth, (req, res) => {
    const user = req.session.user;
    const selectedLevel = req.query.level;
    
    // Get all levels and their session progress
    let query = `
        SELECT 
            s.level,
            s.session_number,
            s.session_date,
            s.id as session_id,
            COUNT(st.id) as total_students,
            COUNT(a.id) as students_with_attendance,
            COUNT(CASE WHEN a.status = 'attended' THEN 1 END) as attended_count,
            COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as absent_count
        FROM sessions s
        LEFT JOIN students st ON st.current_level = s.level AND st.status = 'active'
        LEFT JOIN attendance a ON a.session_id = s.id
        WHERE 1=1
    `;
    let params = [];
    
    if (selectedLevel) {
        query += " AND s.level = ?";
        params.push(selectedLevel);
    }
    
    query += `
        GROUP BY s.id, s.level, s.session_number
        ORDER BY s.level, s.session_number
    `;
    
    db.all(query, params, (err, sessionData) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        
        // Group by level
        const levelSummary = {};
        sessionData.forEach(session => {
            if (!levelSummary[session.level]) {
                levelSummary[session.level] = {
                    level: session.level,
                    sessions: [],
                    totalStudents: session.total_students,
                    completedSessions: 0,
                    totalAttendance: 0,
                    totalPossibleAttendance: 0
                };
            }
            
            levelSummary[session.level].sessions.push({
                sessionNumber: session.session_number,
                sessionId: session.session_id,
                sessionDate: session.session_date,
                attendedCount: session.attended_count,
                absentCount: session.absent_count,
                totalStudents: session.total_students,
                hasAttendance: session.students_with_attendance > 0,
                attendanceRate: session.total_students > 0 ? 
                    Math.round((session.attended_count / session.total_students) * 100) : 0
            });
            
            if (session.students_with_attendance > 0) {
                levelSummary[session.level].completedSessions++;
                levelSummary[session.level].totalAttendance += session.attended_count;
                levelSummary[session.level].totalPossibleAttendance += session.total_students;
            }
        });
        
        // Calculate overall attendance rates
        Object.keys(levelSummary).forEach(level => {
            const summary = levelSummary[level];
            summary.overallAttendanceRate = summary.totalPossibleAttendance > 0 ?
                Math.round((summary.totalAttendance / summary.totalPossibleAttendance) * 100) : 0;
        });
        
        res.render('attendance-summary', {
            user,
            selectedLevel,
            levelSummary: Object.values(levelSummary),
            levels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6', 'Month 7', 'Month 8', 'Month 9']
        }, (err, html) => {
            if (err) {
                console.error('Error rendering attendance summary:', err);
                return res.status(500).send('Render error');
            }
            res.render('layout', { body: html, user: user });
        });
    });
});

// Cash Management Routes
app.get('/cash', requireAuth, requireRole(['manager','reception']), (req, res) => {
    const user = req.session.user;
    
    // Get all transactions
    db.all(`
        SELECT ct.*, cc.name as category_name, cc.type as category_type
        FROM cash_transactions ct
        LEFT JOIN cash_categories cc ON ct.category_code = cc.code
        ORDER BY ct.transaction_date DESC, ct.created_at DESC
    `, (err, transactions) => {
        if (err) {
            console.error('Error fetching transactions:', err);
            return res.status(500).send('Database error');
        }
        
        // Get all categories
        db.all('SELECT * FROM cash_categories WHERE is_active = 1 ORDER BY type, name', (err, categories) => {
            if (err) {
                console.error('Error fetching categories:', err);
                return res.status(500).send('Database error');
            }
            
            // Calculate totals
            const totalIncome = transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + parseFloat(t.amount), 0);
            
            const totalExpense = transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + parseFloat(t.amount), 0);
            
            const balance = totalIncome - totalExpense;
            
            // Render cash view and wrap in layout
            res.render('cash', {
                user,
                transactions,
                categories,
                totalIncome,
                totalExpense,
                balance
            }, (err, html) => {
                if (err) {
                    console.error('Error rendering cash view:', err);
                    return res.status(500).send('Render error');
                }
                res.render('layout', { body: html, user: user });
            });
        });
    });
});

// Add Cash Transaction
app.post('/cash', requireAuth, requireRole(['manager','reception']), (req, res) => {
    const { transaction_date, type, amount, category_code, description, payment_method, reference_number } = req.body;
    const user = req.session.user;
    
    db.run(`
        INSERT INTO cash_transactions (transaction_date, type, amount, category_code, description, payment_method, reference_number, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [transaction_date, type, amount, category_code, description, payment_method, reference_number, user.id], function(err) {
        if (err) {
            console.error('Error adding transaction:', err);
            return res.status(500).send('Database error');
        }
        res.redirect('/cash');
    });
});

// Edit Cash Transaction
app.post('/cash/:id/edit', requireAuth, requireRole(['manager','reception']), (req, res) => {
    const { id } = req.params;
    const { transaction_date, type, amount, category_code, description, payment_method, reference_number } = req.body;
    
    db.run(`
        UPDATE cash_transactions
        SET transaction_date = ?, type = ?, amount = ?, category_code = ?, description = ?, payment_method = ?, reference_number = ?
        WHERE id = ?
    `, [transaction_date, type, amount, category_code, description, payment_method, reference_number, id], function(err) {
        if (err) {
            console.error('Error updating transaction:', err);
            return res.status(500).send('Database error');
        }
        res.redirect('/cash');
    });
});

// Delete Cash Transaction
app.post('/cash/:id/delete', requireAuth, requireRole(['manager','reception']), (req, res) => {
    const { id } = req.params;
    
    db.run('DELETE FROM cash_transactions WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('Error deleting transaction:', err);
            return res.status(500).send('Database error');
        }
        res.redirect('/cash');
    });
});

// User Management Routes
app.get('/users', requireAuth, requireRole(['manager','reception']), (req, res) => {
    const user = req.session.user;
    
    db.all('SELECT * FROM users ORDER BY created_at DESC', (err, users) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).send('Database error');
        }
        
        res.render('users', { user, users }, (err, html) => {
            if (err) {
                console.error('Error rendering users view:', err);
                return res.status(500).send('Render error');
            }
            res.render('layout', { body: html, user: user });
        });
    });
});

// Add User
app.post('/users', requireAuth, requireRole(['manager','reception']), (req, res) => {
    const { username, password, full_name, email, role, status } = req.body;
    
    // Check if username already exists
    db.get('SELECT id FROM users WHERE username = ?', [username], (err, existingUser) => {
        if (err) {
            console.error('Error checking username:', err);
            return res.status(500).send('Database error');
        }
        
        if (existingUser) {
            return res.status(400).send('Username already exists');
        }
        
        // Hash password
        const bcrypt = require('bcrypt');
        const password_hash = bcrypt.hashSync(password, 10);
        
        db.run(`
            INSERT INTO users (username, password_hash, full_name, email, role, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `, [username, password_hash, full_name, email, role, status], function(err) {
            if (err) {
                console.error('Error adding user:', err);
                return res.status(500).send('Database error');
            }
            res.redirect('/users');
        });
    });
});

// Edit User
app.post('/users/:id/edit', requireAuth, requireRole(['manager','reception']), (req, res) => {
    const { id } = req.params;
    const { password, full_name, email, role, status } = req.body;
    
    // If password is provided, hash it
    if (password && password.trim() !== '') {
        const bcrypt = require('bcrypt');
        const password_hash = bcrypt.hashSync(password, 10);
        
        db.run(`
            UPDATE users
            SET password_hash = ?, full_name = ?, email = ?, role = ?, status = ?, updated_at = datetime('now')
            WHERE id = ?
        `, [password_hash, full_name, email, role, status, id], function(err) {
            if (err) {
                console.error('Error updating user:', err);
                return res.status(500).send('Database error');
            }
            res.redirect('/users');
        });
    } else {
        // Update without changing password
        db.run(`
            UPDATE users
            SET full_name = ?, email = ?, role = ?, status = ?, updated_at = datetime('now')
            WHERE id = ?
        `, [full_name, email, role, status, id], function(err) {
            if (err) {
                console.error('Error updating user:', err);
                return res.status(500).send('Database error');
            }
            res.redirect('/users');
        });
    }
});

// Delete User
app.post('/users/:id/delete', requireAuth, requireRole(['manager','reception']), (req, res) => {
    const { id } = req.params;
    
    // Prevent deleting admin user
    if (id === '1') {
        return res.status(403).send('Cannot delete admin user');
    }
    
    db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).send('Database error');
        }
        res.redirect('/users');
    });
});

// Reports Routes
app.get('/reports', requireAuth, (req, res) => {
    const user = req.session.user;
    
    // Updated query for session-based attendance
    let query = `
        SELECT 
            s.id,
            s.name,
            s.current_level,
            s.start_date,
            s.phone,
            COUNT(DISTINCT sess.id) as total_sessions,
            COUNT(CASE WHEN a.status = 'attended' THEN 1 END) as attended_sessions,
            COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as absent_sessions,
            ROUND(
                CASE 
                    WHEN COUNT(CASE WHEN a.status IN ('attended', 'absent') THEN 1 END) > 0 
                    THEN (COUNT(CASE WHEN a.status = 'attended' THEN 1 END) * 100.0 / COUNT(CASE WHEN a.status IN ('attended', 'absent') THEN 1 END))
                    ELSE 0 
                END, 2
            ) as attendance_rate
        FROM students s
        LEFT JOIN sessions sess ON sess.level = s.current_level
        LEFT JOIN attendance a ON s.id = a.student_id AND a.session_id = sess.id
        WHERE s.status = 'active'
        GROUP BY s.id
        ORDER BY attendance_rate DESC, s.name
    `;
    let params = [];
    
    db.all(query, params, (err, stats) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        
        // Calculate additional statistics
        const totalStudents = stats.length;
        const totalSessionsMarked = stats.reduce((sum, s) => sum + s.attended_sessions + s.absent_sessions, 0);
        const totalAttended = stats.reduce((sum, s) => sum + s.attended_sessions, 0);
        const avgAttendance = totalStudents > 0 ? Math.round(stats.reduce((sum, s) => sum + s.attendance_rate, 0) / totalStudents) : 0;
        
        // Get level distribution with session progress
        const levelStats = {};
        stats.forEach(s => {
            if (!levelStats[s.current_level]) {
                levelStats[s.current_level] = {
                    count: 0,
                    totalSessions: 0,
                    attendedSessions: 0,
                    absentSessions: 0
                };
            }
            levelStats[s.current_level].count++;
            levelStats[s.current_level].totalSessions += (s.attended_sessions + s.absent_sessions);
            levelStats[s.current_level].attendedSessions += s.attended_sessions;
            levelStats[s.current_level].absentSessions += s.absent_sessions;
        });
        
        const reportsContent = `
            <div class="row">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h1><i class="fas fa-chart-bar text-primary me-2"></i>Session Attendance Reports</h1>
                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-primary" onclick="exportData()">
                                <i class="fas fa-download me-2"></i>Export CSV
                            </button>
                            <button class="btn btn-outline-success" onclick="printReport()">
                                <i class="fas fa-print me-2"></i>Print Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Statistics Cards -->
            <div class="row mb-4">
                <div class="col-md-3 md-2">
                    <div class="card text-center">
                        <div class="card-body">
                            <i class="fas fa-users fa-2x text-primary mb-2"></i>
                            <h3>${totalStudents}</h3>
                            <p class="text-muted mb-0">Active Students</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 md-2">
                    <div class="card text-center">
                        <div class="card-body">
                            <i class="fas fa-calendar-check fa-2x text-success mb-2"></i>
                            <h3>${totalSessionsMarked}</h3>
                            <p class="text-muted mb-0">Sessions Marked</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 md-2">
                    <div class="card text-center">
                        <div class="card-body">
                            <i class="fas fa-check-circle fa-2x text-success mb-2"></i>
                            <h3>${totalAttended}</h3>
                            <p class="text-muted mb-0">Total Attended</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 md-2">
                    <div class="card text-center">
                        <div class="card-body">
                            <i class="fas fa-percentage fa-2x text-info mb-2"></i>
                            <h3>${avgAttendance}%</h3>
                            <p class="text-muted mb-0">Avg Attendance</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Reports Table -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Student Attendance Statistics</h5>
                            <div class="d-flex gap-2">
                                <select class="form-select form-select-sm" id="levelFilter" style="width: auto;">
                                    <option value="">All Levels</option>
                                    ${Object.keys(levelStats).map(level => 
                                        `<option value="${level}">${level}</option>`
                                    ).join('')}
                                </select>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead class="table-light">
                                        <tr>
                                            <th>Student</th>
                                            <th>Instrument</th>
                                            <th>Level</th>
                                            <th>Sessions</th>
                                            <th>Attendance Rate</th>
                                            <th>Performance</th>
                                            <th>Start Date</th>
                                        </tr>
                                    </thead>
                                    <tbody id="reportsTableBody">
                                        ${stats.map(student => {
                                            const startDate = new Date(student.start_date);
                                            const today = new Date();
                                            const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
                                            const expectedSessions = Math.max(1, Math.floor(daysSinceStart / 7)); // Assuming weekly sessions
                                            const calculatedRate = Math.min(100, Math.round((student.total_sessions / expectedSessions) * 100));
                                            const attendanceRate = student.attendance_rate || calculatedRate;
                                            
                                            return `
                                            <tr class="report-row" data-instrument="${student.instrument || ''}" data-level="${student.current_level}">
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <i class="fas ${student.age_group === 'kids' ? 'fa-child' : student.age_group === 'teenagers' ? 'fa-user-graduate' : 'fa-user'} fa-lg text-primary me-2"></i>
                                                        <div>
                                                            <strong>${student.name}</strong>
                                                            <br><small class="text-muted">${student.age_group ? student.age_group.charAt(0).toUpperCase() + student.age_group.slice(1) : 'Not Set'}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span class="badge bg-success">
                                                        <i class="fas fa-music me-1"></i>
                                                        ${student.instrument || 'Not Set'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span class="badge bg-primary">${student.current_level}</span>
                                                </td>
                                                <td>
                                                    <div class="text-center">
                                                        <strong>${student.total_sessions}</strong>
                                                        <br><small class="text-muted">${student.present_sessions} present</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="progress" style="height: 25px; min-width: 100px;">
                                                        <div class="progress-bar ${attendanceRate >= 80 ? 'bg-success' : attendanceRate >= 60 ? 'bg-warning' : 'bg-danger'}" 
                                                             style="width: ${Math.min(attendanceRate, 100)}%">
                                                            <strong>${attendanceRate}%</strong>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    ${attendanceRate >= 80 ? 
                                                        '<span class="badge bg-success"><i class="fas fa-star me-1"></i>Excellent</span>' :
                                                        attendanceRate >= 60 ? 
                                                        '<span class="badge bg-warning"><i class="fas fa-thumbs-up me-1"></i>Good</span>' :
                                                        attendanceRate >= 40 ? 
                                                        '<span class="badge bg-info"><i class="fas fa-hand-paper me-1"></i>Fair</span>' :
                                                        '<span class="badge bg-danger"><i class="fas fa-exclamation-triangle me-1"></i>Needs Attention</span>'
                                                    }
                                                </td>
                                                <td>
                                                    <small>${new Date(student.start_date).toLocaleDateString()}</small>
                                                </td>
                                            </tr>
                                            `;
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <script>
            // Filter functionality
            document.getElementById('levelFilter').addEventListener('change', function() {
                filterReports();
            });

            function filterReports() {
                const levelFilter = document.getElementById('levelFilter').value;
                
                document.querySelectorAll('.report-row').forEach(row => {
                    const studentLevel = row.getAttribute('data-level');
                    const levelMatch = !levelFilter || studentLevel === levelFilter;
                    
                    if (levelMatch) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            }

            function exportData() {
                // Simple CSV export for session-based attendance
                const rows = [];
                const headers = ['Student Name', 'Level', 'Phone', 'Sessions Marked', 'Attended', 'Absent', 'Attendance Rate'];
                rows.push(headers.join(','));
                
                document.querySelectorAll('.report-row').forEach(row => {
                    if (row.style.display !== 'none') {
                        const cells = row.querySelectorAll('td');
                        const rowData = [
                            cells[0].textContent.trim().replace(/\\n/g, ' '),
                            cells[1].textContent.trim(),
                            cells[2].textContent.trim(),
                            cells[3].textContent.trim(),
                            cells[4].textContent.trim(),
                            cells[5].textContent.trim(),
                            cells[6].textContent.trim()
                        ];
                        rows.push(rowData.join(','));
                    }
                });
                
                const csvContent = rows.join('\\n');
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'wattar_academy_session_reports.csv';
                a.click();
                window.URL.revokeObjectURL(url);
            }

            function printReport() {
                window.print();
            }
            </script>
        `;
        
        res.render('layout', { 
            body: reportsContent,
            user: user
        });
    });
});


// Get single student (API endpoint)
app.get('/students/:id', requireAuth, (req, res) => {
    const studentId = req.params.id;
    const user = req.session.user;
    
    let query = "SELECT * FROM students WHERE id = ? AND status = 'active'";
    let params = [studentId];
    
    // If trainer, only allow access to their students
    if (user.role === 'trainer') {
        query = `
            SELECT DISTINCT s.* FROM students s
            JOIN student_classes sc ON s.id = sc.student_id
            JOIN classes c ON sc.class_id = c.id
            JOIN trainers t ON c.trainer_id = t.id
            WHERE s.id = ? AND t.user_id = ? AND s.status = 'active'
        `;
        params = [studentId, user.id];
    }
    
    db.get(query, params, (err, student) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        res.json(student);
    });
});

// Update student
app.post('/students/:id', requireAuth, requireRole(['manager', 'reception']), (req, res) => {
    const studentId = req.params.id;
    const {
        name, national_id, date_of_birth, age_group, instrument, current_level,
        start_date, phone, parent_phone, email, parent_name, emergency_contact,
        address, medical_notes
    } = req.body;
    
    db.run(`
        UPDATE students SET 
            name = ?, national_id = ?, date_of_birth = ?, age_group = ?, 
            instrument = ?, current_level = ?, start_date = ?, phone = ?, 
            parent_phone = ?, email = ?, parent_name = ?, emergency_contact = ?,
            address = ?, medical_notes = ?, updated_at = datetime('now')
        WHERE id = ?
    `, [
        name, national_id, date_of_birth, age_group, instrument, current_level,
        start_date, phone, parent_phone, email, parent_name, emergency_contact,
        address, medical_notes, studentId
    ], function(err) {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        res.redirect('/students');
    });
});

app.listen(PORT, () => {
    console.log(`Wattar Academy Management System running on http://localhost:${PORT}`);
    console.log('Default login: username=admin, password=admin123');
});