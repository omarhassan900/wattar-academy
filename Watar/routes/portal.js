const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Profile pic upload config
const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/profiles'),
    filename: (req, file, cb) => {
        const uniqueName = 'profile-' + req.session.student.id + '-' + Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});
const profileUpload = multer({
    storage: profileStorage,
    limits: { fileSize: 3 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, allowed.includes(ext));
    }
});

// Rank system
const RANKS = [
    { name: 'Beginner', minXP: 0, icon: '🎵', color: '#9e9e9e' },
    { name: 'Learner', minXP: 50, icon: '🎶', color: '#4caf50' },
    { name: 'Player', minXP: 150, icon: '🎸', color: '#2196f3' },
    { name: 'Performer', minXP: 300, icon: '🎹', color: '#9c27b0' },
    { name: 'Artist', minXP: 500, icon: '🌟', color: '#ff9800' },
    { name: 'Maestro', minXP: 800, icon: '👑', color: '#f44336' },
];

function calculateRank(xp) {
    let rank = RANKS[0];
    for (const r of RANKS) {
        if (xp >= r.minXP) rank = r;
    }
    return rank;
}

function calculateXP(db, studentId, callback) {
    let totalXP = 0;
    // XP from attendance (present = 10, late = 5)
    db.get(`SELECT COUNT(*) as present FROM attendance WHERE student_id = ? AND status = 'present'`, [studentId], (err, r) => {
        totalXP += (r ? r.present : 0) * 10;
        db.get(`SELECT COUNT(*) as late FROM attendance WHERE student_id = ? AND status = 'late'`, [studentId], (err, r) => {
            totalXP += (r ? r.late : 0) * 5;
            // XP from assignments (20 each)
            db.get(`SELECT COUNT(*) as cnt FROM assignments WHERE student_id = ?`, [studentId], (err, r) => {
                totalXP += (r ? r.cnt : 0) * 20;
                // XP from evaluations (avg score * 10)
                db.get(`SELECT AVG(attitude_rating + commitment_rating + development_rating) as avg_score FROM student_evaluations WHERE student_id = ?`, [studentId], (err, r) => {
                    totalXP += Math.round((r && r.avg_score ? r.avg_score : 0) * 10);
                    // XP from level progression (50 per month level)
                    db.get(`SELECT current_level FROM students WHERE id = ?`, [studentId], (err, r) => {
                        if (r && r.current_level) {
                            const monthNum = parseInt(r.current_level.replace('Month ', ''));
                            if (!isNaN(monthNum)) totalXP += monthNum * 50;
                        }
                        // Update XP in DB
                        const rank = calculateRank(totalXP);
                        db.run(`UPDATE student_accounts SET xp = ?, rank = ? WHERE student_id = ?`, [totalXP, rank.name, studentId]);
                        callback(totalXP, rank);
                    });
                });
            });
        });
    });
}

module.exports = (app, db) => {

    // Middleware: require student login
    function requireStudent(req, res, next) {
        if (req.session.student) return next();
        res.redirect('/portal/login');
    }

    // Student Login Page
    app.get('/portal/login', (req, res) => {
        if (req.session.student) return res.redirect('/portal');
        res.render('portal-login', { error: null });
    });

    // Student Login POST
    app.post('/portal/login', (req, res) => {
        const { username, password } = req.body;
        db.get(`SELECT sa.*, s.name, s.current_level, s.instrument, s.phone
                FROM student_accounts sa
                JOIN students s ON sa.student_id = s.id
                WHERE sa.username = ? AND s.status = 'active'`, [username], (err, account) => {
            if (err || !account) return res.render('portal-login', { error: 'Invalid username or password' });

            if (!bcrypt.compareSync(password, account.password_hash)) {
                return res.render('portal-login', { error: 'Invalid username or password' });
            }

            req.session.student = {
                id: account.student_id,
                account_id: account.id,
                name: account.name,
                current_level: account.current_level,
                instrument: account.instrument,
                phone: account.phone
            };

            db.run('UPDATE student_accounts SET last_login = datetime("now") WHERE id = ?', [account.id]);
            res.redirect('/portal');
        });
    });

    // Student Logout
    app.get('/portal/logout', (req, res) => {
        delete req.session.student;
        res.redirect('/portal/login');
    });

    // Settings page
    app.get('/portal/settings', requireStudent, (req, res) => {
        db.get(`SELECT profile_pic, bio, display_name, rank, xp FROM student_accounts WHERE student_id = ?`, [req.session.student.id], (err, profile) => {
            res.render('portal-settings', { student: req.session.student, profile: profile || {} });
        });
    });

    // Update profile (display name, bio)
    app.post('/portal/update-profile', requireStudent, (req, res) => {
        const { display_name, bio } = req.body;
        const studentId = req.session.student.id;
        db.run(`UPDATE student_accounts SET display_name = ?, bio = ? WHERE student_id = ?`,
            [display_name || null, bio || null, studentId], (err) => {
                if (err) return res.json({ success: false, error: 'Database error' });
                if (display_name) req.session.student.display_name = display_name;
                res.json({ success: true });
            });
    });

    // Upload profile picture
    app.post('/portal/upload-pic', requireStudent, profileUpload.single('profile_pic'), (req, res) => {
        if (!req.file) return res.json({ success: false, error: 'No file uploaded or invalid format' });
        const picPath = '/uploads/profiles/' + req.file.filename;
        db.run(`UPDATE student_accounts SET profile_pic = ? WHERE student_id = ?`,
            [picPath, req.session.student.id], (err) => {
                if (err) return res.json({ success: false, error: 'Database error' });
                res.json({ success: true, path: picPath });
            });
    });

    // Change password
    app.post('/portal/change-password', requireStudent, (req, res) => {
        const { current_password, new_password } = req.body;
        const studentId = req.session.student.account_id;

        if (!current_password || !new_password) return res.json({ success: false, error: 'Both fields are required' });
        if (new_password.length < 6) return res.json({ success: false, error: 'New password must be at least 6 characters' });

        db.get('SELECT password_hash FROM student_accounts WHERE id = ?', [studentId], (err, account) => {
            if (err || !account) return res.json({ success: false, error: 'Account not found' });
            if (!bcrypt.compareSync(current_password, account.password_hash)) {
                return res.json({ success: false, error: 'Current password is incorrect' });
            }
            const newHash = bcrypt.hashSync(new_password, 10);
            db.run('UPDATE student_accounts SET password_hash = ? WHERE id = ?', [newHash, studentId], (err) => {
                if (err) return res.json({ success: false, error: 'Database error' });
                res.json({ success: true });
            });
        });
    });

    // Student Dashboard
    app.get('/portal', requireStudent, (req, res) => {
        const student = req.session.student;
        const studentId = student.id;

        // Get profile data
        db.get(`SELECT profile_pic, bio, rank, xp, display_name FROM student_accounts WHERE student_id = ?`, [studentId], (err, profile) => {
            if (err || !profile) profile = {};

            // Calculate XP and rank
            calculateXP(db, studentId, (xp, rank) => {

            // Get attendance for ALL levels (history)
            db.all(`SELECT s.level, s.session_number, s.session_date, a.status, a.date, a.notes
                    FROM attendance a
                    JOIN sessions s ON a.session_id = s.id
                    WHERE a.student_id = ?
                    ORDER BY CAST(REPLACE(s.level, 'Month ', '') AS INTEGER), s.session_number`, [studentId], (err, attendance) => {
                if (err) attendance = [];

                // Get schedule
                db.all(`SELECT st.day_of_week, st.time_slot, u.full_name as trainer_name
                        FROM schedule_templates st
                        LEFT JOIN users u ON st.trainer_id = u.id
                        WHERE st.student_id = ? AND st.is_active = 1
                        ORDER BY CASE st.day_of_week
                            WHEN 'Sunday' THEN 1 WHEN 'Monday' THEN 2 WHEN 'Tuesday' THEN 3
                            WHEN 'Wednesday' THEN 4 WHEN 'Thursday' THEN 5 WHEN 'Friday' THEN 6
                            WHEN 'Saturday' THEN 7 END`, [studentId], (err, schedule) => {
                    if (err) schedule = [];

                    // Get evaluations
                    db.all(`SELECT se.level, se.attitude_rating, se.commitment_rating, se.development_rating, se.notes, se.evaluated_at, u.full_name as trainer_name
                            FROM student_evaluations se
                            LEFT JOIN users u ON se.trainer_id = u.id
                            WHERE se.student_id = ?
                            ORDER BY se.evaluated_at DESC`, [studentId], (err, evaluations) => {
                        if (err) evaluations = [];

                        // Get feedback
                        db.all(`SELECT level, trainer_rating, development_rating, experience_rating, notes, created_at
                                FROM student_feedback
                                WHERE student_id = ? AND trainer_rating IS NOT NULL
                                ORDER BY created_at DESC`, [studentId], (err, feedback) => {
                            if (err) feedback = [];

                            // Get assignments
                            db.all(`SELECT * FROM assignments WHERE student_id = ? ORDER BY CAST(REPLACE(level, 'Month ', '') AS INTEGER) DESC, session_number DESC`, [studentId], (err, assignments) => {
                                if (err) assignments = [];

                                res.render('portal-dashboard', {
                                    student,
                                    profile: profile || {},
                                    rank,
                                    xp,
                                    ranks: RANKS,
                                    attendance: attendance || [],
                                    schedule: schedule || [],
                                    evaluations: evaluations || [],
                                    feedback: feedback || [],
                                    assignments: assignments || []
                                });
                            });
                        });
                    });
                });
            });
            }); // end calculateXP
        });
    });

    // Admin: Generate student accounts
    app.post('/admin/generate-student-accounts', (req, res) => {
        if (!req.session.user || req.session.user.role !== 'manager') {
            return res.json({ success: false, error: 'Unauthorized' });
        }

        const defaultPassword = bcrypt.hashSync('wattar123', 10);

        db.all("SELECT id, phone, name FROM students WHERE status = 'active' AND phone IS NOT NULL AND phone != ''", (err, students) => {
            if (err) return res.json({ success: false, error: 'Database error' });

            let created = 0;
            let skipped = 0;
            const results = [];

            if (!students || students.length === 0) {
                return res.json({ success: true, created: 0, skipped: 0, message: 'No active students with phone numbers' });
            }

            let processed = 0;
            students.forEach(s => {
                const username = s.phone.trim();
                db.run(`INSERT OR IGNORE INTO student_accounts (student_id, username, password_hash) VALUES (?, ?, ?)`,
                    [s.id, username, defaultPassword], function(err) {
                        processed++;
                        if (!err && this.changes > 0) {
                            created++;
                            results.push({ name: s.name, username });
                        } else {
                            skipped++;
                        }
                        if (processed === students.length) {
                            res.json({ success: true, created, skipped, results });
                        }
                    }
                );
            });
        });
    });
};
