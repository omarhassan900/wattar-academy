const bcrypt = require('bcrypt');

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

    // Student Dashboard
    app.get('/portal', requireStudent, (req, res) => {
        const student = req.session.student;
        const studentId = student.id;

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

                        res.render('portal-dashboard', {
                            student,
                            attendance: attendance || [],
                            schedule: schedule || [],
                            evaluations: evaluations || [],
                            feedback: feedback || []
                        });
                    });
                });
            });
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
