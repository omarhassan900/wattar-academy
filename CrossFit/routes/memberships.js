const { requireAuth, requireRole } = require('../middleware/auth');
const moment = require('moment');

module.exports = (app, db) => {
    app.get('/memberships', requireAuth, (req, res) => {
        const today = moment().format('YYYY-MM-DD');
        const filter = req.query.filter || 'all';

        let query = `SELECT m.*, c.full_name as coach_name FROM members m LEFT JOIN coaches c ON m.coach_id = c.id WHERE 1=1`;
        if (filter === 'expiring') query += ` AND m.membership_end <= date('now', '+7 days') AND m.status = 'active'`;
        else if (filter === 'expired') query += ` AND m.membership_end < '${today}' AND m.status = 'active'`;
        else if (filter === 'frozen') query += ` AND m.status = 'frozen'`;
        else if (filter === 'active') query += ` AND m.status = 'active'`;
        query += ` ORDER BY m.membership_end ASC`;

        db.all(query, (err, members) => {
            res.render('memberships', { user: req.session.user, members: members || [], filter, today }, (err, html) => {
                if (err) { console.error(err); return res.status(500).send('Render error'); }
                res.render('layout', { body: html, user: req.session.user, currentUrl: req.originalUrl });
            });
        });
    });

    // Renew membership
    app.post('/memberships/:id/renew', requireAuth, (req, res) => {
        const { membership_type, start_date } = req.body;
        let end_date;
        const start = moment(start_date);

        if (membership_type === 'monthly') end_date = start.add(1, 'month').format('YYYY-MM-DD');
        else if (membership_type === 'quarterly') end_date = start.add(3, 'months').format('YYYY-MM-DD');
        else if (membership_type === 'semi_annual') end_date = start.add(6, 'months').format('YYYY-MM-DD');
        else if (membership_type === 'annual') end_date = start.add(1, 'year').format('YYYY-MM-DD');

        db.run(`UPDATE members SET membership_type = ?, membership_start = ?, membership_end = ?, status = 'active', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [membership_type, req.body.start_date, end_date, req.params.id],
            (err) => { if (err) console.error(err); res.redirect('/memberships'); });
    });
};
