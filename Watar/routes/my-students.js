const { requireAuth, requireRole } = require('../middleware/auth');

module.exports = (app, db) => {

    // My Students page (trainer only)
    app.get('/my-students', requireAuth, requireRole(['trainer']), (req, res) => {
        const userId = req.session.user.id;

        db.all(`SELECT s.id, s.name, s.phone, s.instrument, s.current_level, s.status, s.date_of_birth,
                    sa.profile_pic, sa.last_login,
                    (SELECT COUNT(*) FROM attendance a WHERE a.student_id = s.id AND a.status = 'present') as sessions_attended,
                    (SELECT COUNT(*) FROM assignments asn WHERE asn.student_id = s.id) as assignments_count,
                    (SELECT MAX(a.date) FROM attendance a WHERE a.student_id = s.id) as last_attendance
                FROM students s
                LEFT JOIN student_accounts sa ON sa.student_id = s.id
                WHERE s.trainer_id = (SELECT id FROM trainers WHERE user_id = ?)
                AND s.status = 'active'
                ORDER BY s.name`, [userId], (err, students) => {
            if (err) students = [];
            res.render('my-students', { user: req.session.user, students: students || [] }, (err, html) => {
                if (err) { console.error(err); return res.status(500).send('Render error'); }
                res.render('layout', { body: html, user: req.session.user });
            });
        });
    });

    // Get student detail (for modal)
    app.get('/my-students/:id', requireAuth, requireRole(['trainer']), (req, res) => {
        const userId = req.session.user.id;
        const studentId = req.params.id;

        db.get(`SELECT s.* FROM students s
                WHERE s.id = ? AND s.trainer_id = (SELECT id FROM trainers WHERE user_id = ?)`,
            [studentId, userId], (err, student) => {
            if (err || !student) return res.json({ success: false, error: 'Student not found' });

            // Get attendance summary
            db.all(`SELECT a.status, COUNT(*) as count FROM attendance a WHERE a.student_id = ? GROUP BY a.status`, [studentId], (err, attendance) => {
                // Get assignments
                db.all(`SELECT title, level, session_number, created_at FROM assignments WHERE student_id = ? ORDER BY created_at DESC LIMIT 10`, [studentId], (err, assignments) => {
                    // Get evaluations
                    db.all(`SELECT level, attitude_rating, commitment_rating, development_rating, notes FROM student_evaluations WHERE student_id = ? ORDER BY evaluated_at DESC LIMIT 5`, [studentId], (err, evaluations) => {
                        res.json({
                            success: true,
                            student,
                            attendance: attendance || [],
                            assignments: assignments || [],
                            evaluations: evaluations || []
                        });
                    });
                });
            });
        });
    });
    // Add bonus XP to a student
    app.post('/my-students/:id/add-xp', requireAuth, requireRole(['trainer']), (req, res) => {
        const userId = req.session.user.id;
        const studentId = req.params.id;
        const { amount, reason } = req.body;
        const xpAmount = parseInt(amount);

        if (!xpAmount || xpAmount < 1 || xpAmount > 100) return res.json({ success: false, error: 'XP must be between 1-100' });

        // Verify this student belongs to the trainer
        db.get(`SELECT s.id FROM students s WHERE s.id = ? AND s.trainer_id = (SELECT id FROM trainers WHERE user_id = ?)`,
            [studentId, userId], (err, student) => {
            if (err || !student) return res.json({ success: false, error: 'Student not found' });

            // Add XP
            db.run(`UPDATE student_accounts SET xp = xp + ? WHERE student_id = ?`, [xpAmount, studentId], function(err) {
                if (err) return res.json({ success: false, error: 'Database error' });
                // Get updated XP
                db.get(`SELECT xp FROM student_accounts WHERE student_id = ?`, [studentId], (err, row) => {
                    res.json({ success: true, newXP: row ? row.xp : 0 });
                });
            });
        });
    });
};
