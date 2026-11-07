const { requireAuth, requireRole } = require('../middleware/auth');
const moment = require('moment');

module.exports = (app, db) => {
    // List members
    app.get('/members', requireAuth, requireRole(['admin', 'manager', 'reception', 'sales']), (req, res) => {
        const { search, status, class_type } = req.query;
        let query = `SELECT m.*, c.full_name as coach_name, u.full_name as sales_name,
                     COALESCE((SELECT SUM(ct.amount) FROM cash_transactions ct WHERE ct.member_id = m.id AND ct.type = 'income'), 0) as total_paid,
                     COALESCE(m.freeze_days, 0) as freeze_days
                     FROM members m 
                     LEFT JOIN coaches c ON m.coach_id = c.id 
                     LEFT JOIN users u ON m.sales_by = u.id 
                     WHERE 1=1`;
        const params = [];

        if (search) {
            query += ` AND (m.full_name LIKE ? OR m.phone LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }
        if (status) {
            query += ` AND m.status = ?`;
            params.push(status);
        }
        query += ` ORDER BY m.created_at DESC`;

        db.all(query, params, (err, members) => {
            if (err) console.error('Members query error:', err);
            db.all(`SELECT * FROM coaches WHERE status = 'active'`, (err2, coaches) => {
                if (err2) console.error('Coaches query error:', err2);
                db.all(`SELECT id, full_name FROM users WHERE status = 'active' AND role = 'sales'`, (err3, users) => {
                    if (err3) console.error('Users query error:', err3);
                    res.render('members', { user: req.session.user, members: members || [], coaches: coaches || [], users: users || [], filters: req.query }, (err4, html) => {
                        if (err4) { console.error('Members render error:', err4); return res.status(500).send('Render error'); }
                        res.render('layout', { body: html, user: req.session.user, currentUrl: req.originalUrl });
                    });
                });
            });
        });
    });

    // Add member
    app.post('/members', requireAuth, (req, res) => {
        const { full_name, phone, email, gender, date_of_birth, emergency_contact, emergency_phone, address, membership_type, skill_level, health_notes, coach_id, sales_by, class_type } = req.body;

        // Check if phone already exists
        db.get(`SELECT id, full_name FROM members WHERE phone = ?`, [phone], (err, existing) => {
            if (existing) {
                return res.redirect('/members?error=duplicate&phone=' + encodeURIComponent(phone) + '&owner=' + encodeURIComponent(existing.full_name));
            }

            const membership_start = moment().format('YYYY-MM-DD');
            let membership_end = null;

            if (membership_type === '1_month') membership_end = moment().add(1, 'month').format('YYYY-MM-DD');
            else if (membership_type === '3_months') membership_end = moment().add(3, 'months').format('YYYY-MM-DD');
            else if (membership_type === '6_months') membership_end = moment().add(6, 'months').format('YYYY-MM-DD');
            else if (membership_type === '1_year') membership_end = moment().add(1, 'year').format('YYYY-MM-DD');

            db.run(`INSERT INTO members (full_name, phone, email, gender, date_of_birth, emergency_contact, emergency_phone, address, membership_type, membership_start, membership_end, skill_level, health_notes, coach_id, sales_by, class_type)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [full_name, phone, email, gender || 'male', date_of_birth, emergency_contact, emergency_phone, address, membership_type, membership_start, membership_end, skill_level, health_notes, coach_id || null, sales_by || null, class_type || 'crossfit'],
                (err) => {
                    if (err) console.error(err);
                    res.redirect('/members');
                });
        });
    });

    // Verify password (for inline edit unlock)
    app.post('/members/verify-password', requireAuth, (req, res) => {
        const { password } = req.body;
        const bcrypt = require('bcrypt');
        if (!password) return res.json({ success: false, error: 'Password required' });

        db.get('SELECT password_hash FROM users WHERE id = ?', [req.session.user.id], (err, user) => {
            if (err || !user) return res.json({ success: false, error: 'User not found' });
            bcrypt.compare(password, user.password_hash, (err, match) => {
                res.json({ success: !!match });
            });
        });
    });

    // Inline edit member (requires password verification)
    app.post('/members/:id/inline-edit', requireAuth, (req, res) => {
        const { password, field, value } = req.body;
        const bcrypt = require('bcrypt');

        if (!password || !field) {
            return res.json({ success: false, error: 'Password and field are required' });
        }

        // Allowed editable fields
        const allowedFields = ['full_name', 'phone', 'email', 'gender', 'membership_type', 'membership_start', 'membership_end', 'class_type', 'skill_level', 'status', 'coach_id', 'sales_by'];
        if (!allowedFields.includes(field)) {
            return res.json({ success: false, error: 'Field not editable' });
        }

        // Value constraints
        const constraints = {
            membership_type: ['1_month', '3_months', '6_months', '1_year'],
            class_type: ['crossfit', 'boxing', 'kick_boxing'],
            skill_level: ['beginner', 'intermediate', 'advanced', 'competition'],
            status: ['active', 'inactive', 'frozen', 'expired'],
            gender: ['male', 'female']
        };
        if (constraints[field] && value && !constraints[field].includes(value)) {
            return res.json({ success: false, error: 'Invalid value for ' + field });
        }

        // Verify password against logged-in user
        db.get('SELECT password_hash FROM users WHERE id = ?', [req.session.user.id], (err, user) => {
            if (err || !user) return res.json({ success: false, error: 'User not found' });

            bcrypt.compare(password, user.password_hash, (err, match) => {
                if (!match) return res.json({ success: false, error: 'Incorrect password' });

                db.run(`UPDATE members SET ${field} = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
                    [value || null, req.params.id], (err) => {
                        if (err) return res.json({ success: false, error: 'Database error' });
                        res.json({ success: true });
                    });
            });
        });
    });

    // Edit member (admin only)
    app.post('/members/:id/edit', requireAuth, requireRole(['admin']), (req, res) => {
        const { full_name, phone, email, gender, date_of_birth, emergency_contact, emergency_phone, address, membership_type, membership_start, membership_end, skill_level, health_notes, status, coach_id, sales_by, class_type } = req.body;
        db.run(`UPDATE members SET full_name=?, phone=?, email=?, gender=?, date_of_birth=?, emergency_contact=?, emergency_phone=?, address=?, membership_type=?, membership_start=?, membership_end=?, skill_level=?, health_notes=?, status=?, coach_id=?, sales_by=?, class_type=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
            [full_name, phone, email, gender, date_of_birth, emergency_contact, emergency_phone, address, membership_type, membership_start, membership_end, skill_level, health_notes, status, coach_id || null, sales_by || null, class_type || 'crossfit', req.params.id],
            (err) => {
                if (err) console.error(err);
                res.redirect('/members');
            });
    });

    // Freeze / Unfreeze (admin/manager)
    app.post('/members/:id/freeze', requireAuth, requireRole(['admin', 'manager']), (req, res) => {
        db.run(`UPDATE members SET status = 'frozen', freeze_start = date('now'), updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [req.params.id], () => res.redirect('/members'));
    });

    app.post('/members/:id/activate', requireAuth, requireRole(['admin', 'manager']), (req, res) => {
        // Calculate freeze days and add them to the total
        db.get('SELECT freeze_start, freeze_days FROM members WHERE id = ?', [req.params.id], (err, member) => {
            let addDays = 0;
            if (member && member.freeze_start) {
                const start = new Date(member.freeze_start);
                const now = new Date();
                addDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
            }
            const totalDays = (member ? member.freeze_days || 0 : 0) + addDays;
            db.run(`UPDATE members SET status = 'active', freeze_start = NULL, freeze_days = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
                [totalDays, req.params.id], () => res.redirect('/members'));
        });
    });
};
