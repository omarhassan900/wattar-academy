const { requireAuth, requireRole } = require('../middleware/auth');

module.exports = (app, db) => {
    app.get('/payments', requireAuth, (req, res) => {
        const { member_id, month } = req.query;
        let query = `SELECT p.*, m.full_name as member_name FROM payments p JOIN members m ON p.member_id = m.id WHERE 1=1`;
        const params = [];

        if (member_id) { query += ` AND p.member_id = ?`; params.push(member_id); }
        if (month) { query += ` AND strftime('%Y-%m', p.created_at) = ?`; params.push(month); }
        query += ` ORDER BY p.created_at DESC LIMIT 100`;

        db.all(query, params, (err, payments) => {
            db.all(`SELECT id, full_name FROM members ORDER BY full_name`, (err, members) => {
                res.render('payments', { user: req.session.user, payments: payments || [], members: members || [], filters: req.query }, (err, html) => {
                    if (err) { console.error(err); return res.status(500).send('Render error'); }
                    res.render('layout', { body: html, user: req.session.user, currentUrl: req.originalUrl });
                });
            });
        });
    });

    app.post('/payments', requireAuth, (req, res) => {
        const { member_id, amount, payment_type, payment_method, membership_type, start_date, end_date, notes } = req.body;
        db.run(`INSERT INTO payments (member_id, amount, payment_type, payment_method, membership_type, start_date, end_date, notes, received_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [member_id, amount, payment_type, payment_method, membership_type, start_date, end_date, notes, req.session.user.id],
            (err) => {
                if (err) console.error(err);
                // Update member's membership dates if it's a membership payment
                if (payment_type === 'membership' && start_date && end_date) {
                    db.run(`UPDATE members SET membership_start = ?, membership_end = ?, membership_type = ?, status = 'active', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
                        [start_date, end_date, membership_type, member_id]);
                }
                res.redirect('/payments');
            });
    });
};
