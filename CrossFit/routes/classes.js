const { requireAuth, requireRole } = require('../middleware/auth');

module.exports = (app, db) => {
    app.get('/classes', requireAuth, (req, res) => {
        db.all(`SELECT c.*, ct.name as class_type_name, ct.color, co.full_name as coach_name
                FROM classes c
                LEFT JOIN class_types ct ON c.class_type_id = ct.id
                LEFT JOIN coaches co ON c.coach_id = co.id
                WHERE c.status = 'active'
                ORDER BY CASE c.day_of_week
                    WHEN 'sunday' THEN 0 WHEN 'monday' THEN 1 WHEN 'tuesday' THEN 2
                    WHEN 'wednesday' THEN 3 WHEN 'thursday' THEN 4 WHEN 'friday' THEN 5
                    WHEN 'saturday' THEN 6 END, c.start_time`,
            (err, classes) => {
                db.all(`SELECT * FROM class_types`, (err, classTypes) => {
                    db.all(`SELECT * FROM coaches WHERE status = 'active'`, (err, coaches) => {
                        res.render('classes', { user: req.session.user, classes: classes || [], classTypes: classTypes || [], coaches: coaches || [] }, (err, html) => {
                            if (err) { console.error(err); return res.status(500).send('Render error'); }
                            res.render('layout', { body: html, user: req.session.user, currentUrl: req.originalUrl });
                        });
                    });
                });
            });
    });

    app.post('/classes', requireAuth, requireRole(['admin', 'manager']), (req, res) => {
        const { class_type_id, coach_id, day_of_week, start_time, end_time, max_capacity } = req.body;
        db.run(`INSERT INTO classes (class_type_id, coach_id, day_of_week, start_time, end_time, max_capacity) VALUES (?, ?, ?, ?, ?, ?)`,
            [class_type_id, coach_id || null, day_of_week, start_time, end_time, max_capacity || 20],
            (err) => { if (err) console.error(err); res.redirect('/classes'); });
    });

    app.post('/classes/:id/delete', requireAuth, requireRole(['admin', 'manager']), (req, res) => {
        db.run(`UPDATE classes SET status = 'cancelled' WHERE id = ?`, [req.params.id], () => res.redirect('/classes'));
    });
};
