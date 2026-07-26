const { requireAuth } = require('../middleware/auth');

module.exports = (app, db) => {
    app.get('/schedule', requireAuth, (req, res) => {
        const coachFilter = req.session.user.role === 'coach'
            ? `AND co.user_id = ${req.session.user.id}`
            : '';

        db.all(`SELECT c.*, ct.name as class_type_name, ct.color, co.full_name as coach_name
                FROM classes c
                LEFT JOIN class_types ct ON c.class_type_id = ct.id
                LEFT JOIN coaches co ON c.coach_id = co.id
                WHERE c.status = 'active' ${coachFilter}
                ORDER BY CASE c.day_of_week
                    WHEN 'sunday' THEN 0 WHEN 'monday' THEN 1 WHEN 'tuesday' THEN 2
                    WHEN 'wednesday' THEN 3 WHEN 'thursday' THEN 4 WHEN 'friday' THEN 5
                    WHEN 'saturday' THEN 6 END, c.start_time`,
            (err, classes) => {
                res.render('schedule', { user: req.session.user, classes: classes || [] }, (err, html) => {
                    if (err) { console.error(err); return res.status(500).send('Render error'); }
                    res.render('layout', { body: html, user: req.session.user, currentUrl: req.originalUrl });
                });
            });
    });
};
