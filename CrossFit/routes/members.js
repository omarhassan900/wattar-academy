const { requireAuth } = require('../middleware/auth');
const moment = require('moment');

module.exports = (app, db) => {
    // List members
    app.get('/members', requireAuth, (req, res) => {
        const { search, status, class_type } = req.query;
        let query = `SELECT m.*, c.full_name as coach_name FROM members m LEFT JOIN coaches c ON m.coach_id = c.id WHERE 1=1`;
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
            db.all(`SELECT * FROM coaches WHERE status = 'active'`, (err, coaches) => {
                res.render('members', { user: req.session.user, members: members || [], coaches: coaches || [], filters: req.query }, (err, html) => {
                    if (err) { console.error(err); return res.status(500).send('Render error'); }
                    res.render('layout', { body: html, user: req.session.user, currentUrl: req.originalUrl });
                });
            });
        });
    });

    // Add member
    app.post('/members', requireAuth, (req, res) => {
        const { full_name, phone, email, gender, date_of_birth, emergency_contact, emergency_phone, address, membership_type, skill_level, health_notes, coach_id } = req.body;
        const membership_start = moment().format('YYYY-MM-DD');
        let membership_end = null;

        if (membership_type === 'monthly') membership_end = moment().add(1, 'month').format('YYYY-MM-DD');
        else if (membership_type === 'quarterly') membership_end = moment().add(3, 'months').format('YYYY-MM-DD');
        else if (membership_type === 'semi_annual') membership_end = moment().add(6, 'months').format('YYYY-MM-DD');
        else if (membership_type === 'annual') membership_end = moment().add(1, 'year').format('YYYY-MM-DD');

        db.run(`INSERT INTO members (full_name, phone, email, gender, date_of_birth, emergency_contact, emergency_phone, address, membership_type, membership_start, membership_end, skill_level, health_notes, coach_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [full_name, phone, email, gender || 'male', date_of_birth, emergency_contact, emergency_phone, address, membership_type, membership_start, membership_end, skill_level, health_notes, coach_id || null],
            (err) => {
                if (err) console.error(err);
                res.redirect('/members');
            });
    });

    // Edit member
    app.post('/members/:id/edit', requireAuth, (req, res) => {
        const { full_name, phone, email, gender, date_of_birth, emergency_contact, emergency_phone, address, membership_type, membership_start, membership_end, skill_level, health_notes, status, coach_id } = req.body;
        db.run(`UPDATE members SET full_name=?, phone=?, email=?, gender=?, date_of_birth=?, emergency_contact=?, emergency_phone=?, address=?, membership_type=?, membership_start=?, membership_end=?, skill_level=?, health_notes=?, status=?, coach_id=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
            [full_name, phone, email, gender, date_of_birth, emergency_contact, emergency_phone, address, membership_type, membership_start, membership_end, skill_level, health_notes, status, coach_id || null, req.params.id],
            (err) => {
                if (err) console.error(err);
                res.redirect('/members');
            });
    });

    // Freeze / Unfreeze
    app.post('/members/:id/freeze', requireAuth, (req, res) => {
        db.run(`UPDATE members SET status = 'frozen', updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [req.params.id], () => res.redirect('/members'));
    });

    app.post('/members/:id/activate', requireAuth, (req, res) => {
        db.run(`UPDATE members SET status = 'active', updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [req.params.id], () => res.redirect('/members'));
    });
};
