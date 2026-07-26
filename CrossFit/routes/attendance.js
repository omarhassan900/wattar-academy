const { requireAuth } = require('../middleware/auth');
const moment = require('moment');

module.exports = (app, db) => {
    app.get('/attendance', requireAuth, (req, res) => {
        const date = req.query.date || moment().format('YYYY-MM-DD');
        const dayName = moment(date).format('dddd').toLowerCase();

        // Get classes for this day
        db.all(`SELECT c.*, ct.name as class_type_name, ct.color, co.full_name as coach_name
                FROM classes c
                LEFT JOIN class_types ct ON c.class_type_id = ct.id
                LEFT JOIN coaches co ON c.coach_id = co.id
                WHERE c.day_of_week = ? AND c.status = 'active'
                ORDER BY c.start_time`,
            [dayName], (err, classes) => {
                // Get attendance records for this date
                db.all(`SELECT a.*, m.full_name as member_name, ct.name as class_type_name
                        FROM attendance a
                        JOIN members m ON a.member_id = m.id
                        JOIN classes c ON a.class_id = c.id
                        LEFT JOIN class_types ct ON c.class_type_id = ct.id
                        WHERE a.date = ?
                        ORDER BY a.created_at DESC`,
                    [date], (err, records) => {
                        db.all(`SELECT id, full_name FROM members WHERE status = 'active' ORDER BY full_name`, (err, members) => {
                            res.render('attendance', {
                                user: req.session.user, date,
                                classes: classes || [], records: records || [], members: members || []
                            }, (err, html) => {
                                if (err) { console.error(err); return res.status(500).send('Render error'); }
                                res.render('layout', { body: html, user: req.session.user, currentUrl: req.originalUrl });
                            });
                        });
                    });
            });
    });

    app.post('/attendance', requireAuth, (req, res) => {
        const { member_id, class_id, date, status } = req.body;
        const check_in_time = moment().format('HH:mm');

        db.run(`INSERT INTO attendance (member_id, class_id, date, status, check_in_time, recorded_by) VALUES (?, ?, ?, ?, ?, ?)`,
            [member_id, class_id, date, status || 'present', check_in_time, req.session.user.id],
            (err) => {
                if (err) console.error(err);
                res.redirect(`/attendance?date=${date}`);
            });
    });

    app.post('/attendance/:id/delete', requireAuth, (req, res) => {
        const date = req.query.date || moment().format('YYYY-MM-DD');
        db.run(`DELETE FROM attendance WHERE id = ?`, [req.params.id], () => res.redirect(`/attendance?date=${date}`));
    });
};
