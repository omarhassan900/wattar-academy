const { requireAuth, requireRole } = require('../middleware/auth');

module.exports = (app, db) => {
    // List invitations
    app.get('/invitations', requireAuth, requireRole(['admin', 'manager', 'sales']), (req, res) => {
        const { search, status } = req.query;
        let query = `SELECT i.*, u.full_name as sales_name FROM invitations i LEFT JOIN users u ON i.sales_by = u.id WHERE 1=1`;
        const params = [];

        if (search) {
            query += ` AND (i.full_name LIKE ? OR i.phone LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }
        if (status) {
            query += ` AND i.status = ?`;
            params.push(status);
        }
        query += ` ORDER BY i.created_at DESC`;

        db.all(query, params, (err, invitations) => {
            if (err) console.error('Invitations query error:', err);
            res.render('invitations', { user: req.session.user, invitations: invitations || [], filters: req.query }, (err2, html) => {
                if (err2) { console.error('Invitations render error:', err2); return res.status(500).send('Render error'); }
                res.render('layout', { body: html, user: req.session.user, currentUrl: req.originalUrl });
            });
        });
    });

    // Add invitation
    app.post('/invitations', requireAuth, requireRole(['admin', 'manager', 'sales']), (req, res) => {
        const { full_name, phone, email, gender, notes, source, status, scheduled_date } = req.body;
        const sales_by = req.session.user.id;

        // Check if phone already exists
        db.get(`SELECT i.*, u.full_name as sales_name FROM invitations i LEFT JOIN users u ON i.sales_by = u.id WHERE i.phone = ?`, [phone], (err, existing) => {
            if (existing) {
                return res.redirect('/invitations?error=duplicate&phone=' + encodeURIComponent(phone) + '&owner=' + encodeURIComponent(existing.sales_name || 'Unknown'));
            }
            db.run(`INSERT INTO invitations (full_name, phone, email, gender, notes, source, status, scheduled_date, sales_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [full_name, phone, email, gender || 'male', notes, source, status || 'new', scheduled_date || null, sales_by],
                (err) => {
                    if (err) console.error('Invitation insert error:', err);
                    res.redirect('/invitations');
                });
        });
    });
};
