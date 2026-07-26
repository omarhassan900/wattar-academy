const { requireAuth } = require('../middleware/auth');
const moment = require('moment');

module.exports = (app, db) => {
    app.get('/wods', requireAuth, (req, res) => {
        const month = req.query.month || moment().format('YYYY-MM');

        db.all(`SELECT w.*, c.full_name as coach_name FROM wods w
                LEFT JOIN coaches c ON w.coach_id = c.id
                WHERE strftime('%Y-%m', w.date) = ?
                ORDER BY w.date DESC`, [month], (err, wods) => {
            db.all(`SELECT * FROM coaches WHERE status = 'active'`, (err, coaches) => {
                res.render('wods', { user: req.session.user, wods: wods || [], coaches: coaches || [], month }, (err, html) => {
                    if (err) { console.error(err); return res.status(500).send('Render error'); }
                    res.render('layout', { body: html, user: req.session.user, currentUrl: req.originalUrl });
                });
            });
        });
    });

    app.post('/wods', requireAuth, (req, res) => {
        const { title, date, class_type, workout_type, description, time_cap_minutes, coach_id } = req.body;
        db.run(`INSERT INTO wods (title, date, class_type, workout_type, description, time_cap_minutes, coach_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [title, date, class_type || 'crossfit', workout_type, description, time_cap_minutes || null, coach_id || null],
            (err) => {
                if (err) console.error(err);
                res.redirect('/wods');
            });
    });

    app.post('/wods/:id/delete', requireAuth, (req, res) => {
        db.run(`DELETE FROM wods WHERE id = ?`, [req.params.id], () => res.redirect('/wods'));
    });
};
