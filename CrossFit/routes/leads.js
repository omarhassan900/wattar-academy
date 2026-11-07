const { requireAuth, requireRole } = require('../middleware/auth');

module.exports = (app, db) => {
    // List leads with call log info + sales users for sub-tabs
    app.get('/leads', requireAuth, requireRole(['admin', 'manager', 'sales']), (req, res) => {
        const { search, status } = req.query;
        let query = `SELECT l.*, u.full_name as sales_name,
            (SELECT COUNT(*) FROM lead_calls lc WHERE lc.lead_id = l.id) as call_count,
            (SELECT lc.call_date FROM lead_calls lc WHERE lc.lead_id = l.id ORDER BY lc.call_date DESC LIMIT 1) as last_call_date,
            (SELECT lc.outcome FROM lead_calls lc WHERE lc.lead_id = l.id ORDER BY lc.call_date DESC LIMIT 1) as last_call_outcome
            FROM leads l LEFT JOIN users u ON l.sales_by = u.id WHERE 1=1`;
        const params = [];

        if (search) {
            query += ` AND (l.full_name LIKE ? OR l.phone LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }
        if (status) {
            query += ` AND l.status = ?`;
            params.push(status);
        }
        query += ` ORDER BY l.created_at DESC`;

        db.all(query, params, (err, leads) => {
            if (err) console.error('Leads query error:', err);

            // Get all sales users for sub-tabs
            db.all(`SELECT id, full_name FROM users WHERE role = 'sales' AND status = 'active' ORDER BY full_name`, (err2, salesUsers) => {
                if (err2) console.error('Sales users query error:', err2);

                res.render('leads', { user: req.session.user, leads: leads || [], salesUsers: salesUsers || [], filters: req.query }, (err3, html) => {
                    if (err3) { console.error('Leads render error:', err3); return res.status(500).send('Render error'); }
                    res.render('layout', { body: html, user: req.session.user, currentUrl: req.originalUrl });
                });
            });
        });
    });

    // Add lead
    app.post('/leads', requireAuth, requireRole(['admin', 'manager', 'sales']), (req, res) => {
        const { full_name, phone, email, gender, notes, source, status, sales_by } = req.body;
        const assignTo = sales_by || req.session.user.id;

        db.get(`SELECT l.*, u.full_name as sales_name FROM leads l LEFT JOIN users u ON l.sales_by = u.id WHERE l.phone = ?`, [phone], (err, existing) => {
            if (existing) {
                return res.redirect('/leads?error=duplicate&phone=' + encodeURIComponent(phone) + '&owner=' + encodeURIComponent(existing.sales_name || 'Unknown'));
            }
            db.run(`INSERT INTO leads (full_name, phone, email, gender, notes, source, status, sales_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [full_name, phone, email, gender || 'male', notes, source, status || 'new', assignTo],
                (err) => {
                    if (err) console.error('Lead insert error:', err);
                    res.redirect('/leads');
                });
        });
    });

    // Verify password for inline edit - accepts any user's credentials
    app.post('/leads/verify-password', requireAuth, requireRole(['admin', 'manager', 'sales']), (req, res) => {
        const { password, username, leadId } = req.body;
        const bcrypt = require('bcrypt');
        if (!password) return res.json({ success: false, error: 'Password required' });

        // If username provided, verify that user; otherwise verify session user
        const query = username 
            ? 'SELECT id, password_hash, role FROM users WHERE username = ?'
            : 'SELECT id, password_hash, role FROM users WHERE id = ?';
        const param = username || req.session.user.id;

        db.get(query, [param], (err, user) => {
            if (err || !user) return res.json({ success: false, error: 'User not found' });
            bcrypt.compare(password, user.password_hash, (err, match) => {
                if (!match) return res.json({ success: false, error: 'Incorrect password' });

                // If sales user, check they own the lead
                if (user.role === 'sales' && leadId) {
                    db.get('SELECT sales_by FROM leads WHERE id = ?', [leadId], (err, lead) => {
                        if (err || !lead) return res.json({ success: false, error: 'Lead not found' });
                        if (lead.sales_by !== user.id) {
                            return res.json({ success: false, error: 'You can only edit your own leads' });
                        }
                        res.json({ success: true, userId: user.id, role: user.role });
                    });
                } else {
                    res.json({ success: true, userId: user.id, role: user.role });
                }
            });
        });
    });

    // Inline edit lead - verifies against provided user credentials
    app.post('/leads/:id/inline-edit', requireAuth, requireRole(['admin', 'manager', 'sales']), (req, res) => {
        const { password, username, field, value } = req.body;
        const bcrypt = require('bcrypt');
        const { id } = req.params;

        if (!password || !field) return res.json({ success: false, error: 'Password and field required' });

        const allowedFields = ['full_name', 'phone', 'email', 'gender', 'source', 'status', 'notes', 'sales_by'];
        if (!allowedFields.includes(field)) return res.json({ success: false, error: 'Field not editable' });

        // Verify the provided user's password
        const query = username 
            ? 'SELECT id, password_hash, role FROM users WHERE username = ?'
            : 'SELECT id, password_hash, role FROM users WHERE id = ?';
        const param = username || req.session.user.id;

        db.get(query, [param], (err, user) => {
            if (err || !user) return res.json({ success: false, error: 'User not found' });

            bcrypt.compare(password, user.password_hash, (err, match) => {
                if (!match) return res.json({ success: false, error: 'Incorrect password' });

                // Manager/Admin can edit any lead
                if (['admin', 'manager'].includes(user.role)) {
                    db.run(`UPDATE leads SET ${field} = ? WHERE id = ?`, [value || null, id], (err) => {
                        if (err) return res.json({ success: false, error: 'Database error' });
                        res.json({ success: true });
                    });
                } else {
                    // Sales can only edit their own leads
                    db.get('SELECT sales_by FROM leads WHERE id = ?', [id], (err, lead) => {
                        if (err || !lead) return res.json({ success: false, error: 'Lead not found' });
                        if (lead.sales_by !== user.id) return res.json({ success: false, error: 'You can only edit your own leads' });
                        db.run(`UPDATE leads SET ${field} = ? WHERE id = ?`, [value || null, id], (err) => {
                            if (err) return res.json({ success: false, error: 'Database error' });
                            res.json({ success: true });
                        });
                    });
                }
            });
        });
    });

    // Log a call
    app.post('/leads/:id/call', requireAuth, requireRole(['admin', 'manager', 'sales']), (req, res) => {
        const { id } = req.params;
        const { outcome, notes, callback_time } = req.body;
        const user = req.session.user;

        if (!outcome) return res.json({ success: false, error: 'Outcome is required' });

        db.run(`INSERT INTO lead_calls (lead_id, called_by, outcome, notes, callback_time) VALUES (?, ?, ?, ?, ?)`,
            [id, user.id, outcome, notes || null, callback_time || null], function(err) {
                if (err) {
                    console.error('Error logging call:', err);
                    return res.json({ success: false, error: 'Database error' });
                }

                // Auto-update lead status based on outcome
                let newStatus = null;
                if (outcome === 'converted') newStatus = 'converted';
                else if (outcome === 'not_interested') newStatus = 'lost';
                else if (outcome === 'interested') newStatus = 'interested';
                else if (outcome === 'callback') newStatus = 'callback';
                else if (outcome === 'no_answer') newStatus = 'contacted';

                if (newStatus) {
                    db.run('UPDATE leads SET status = ? WHERE id = ?', [newStatus, id]);
                }

                res.json({ success: true });
            });
    });

    // Get call history for a lead
    app.get('/leads/:id/calls', requireAuth, requireRole(['admin', 'manager', 'sales']), (req, res) => {
        const { id } = req.params;
        db.all(`SELECT lc.*, u.full_name as caller_name FROM lead_calls lc LEFT JOIN users u ON lc.called_by = u.id WHERE lc.lead_id = ? ORDER BY lc.call_date DESC`,
            [id], (err, calls) => {
                if (err) return res.json({ success: false, error: 'Database error' });
                res.json({ success: true, calls: calls || [] });
            });
    });
};
