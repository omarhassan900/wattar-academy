const { requireAuth, requireRole } = require('../middleware/auth');
const bcrypt = require('bcrypt');

module.exports = (app, db) => {
    app.get('/coaches', requireAuth, requireRole(['admin', 'manager']), (req, res) => {
        db.all(`SELECT c.*, u.username FROM coaches c LEFT JOIN users u ON c.user_id = u.id ORDER BY c.full_name`, (err, coaches) => {
            res.render('coaches', { user: req.session.user, coaches: coaches || [] }, (err, html) => {
                if (err) { console.error(err); return res.status(500).send('Render error'); }
                res.render('layout', { body: html, user: req.session.user, currentUrl: req.originalUrl });
            });
        });
    });

    app.post('/coaches', requireAuth, requireRole(['admin', 'manager']), (req, res) => {
        const { full_name, phone, email, specialization, bio, create_account, username, password } = req.body;

        const insertCoach = (userId) => {
            db.run(`INSERT INTO coaches (user_id, full_name, phone, email, specialization, bio) VALUES (?, ?, ?, ?, ?, ?)`,
                [userId, full_name, phone, email, specialization, bio],
                (err) => { if (err) console.error(err); res.redirect('/coaches'); });
        };

        if (create_account && username && password) {
            const hash = bcrypt.hashSync(password, 10);
            db.run(`INSERT INTO users (username, password_hash, full_name, role) VALUES (?, ?, ?, 'coach')`,
                [username, hash, full_name],
                function (err) {
                    if (err) { console.error(err); return res.redirect('/coaches'); }
                    insertCoach(this.lastID);
                });
        } else {
            insertCoach(null);
        }
    });

    app.post('/coaches/:id/edit', requireAuth, requireRole(['admin', 'manager']), (req, res) => {
        const { full_name, phone, email, specialization, bio, status } = req.body;
        db.run(`UPDATE coaches SET full_name=?, phone=?, email=?, specialization=?, bio=?, status=? WHERE id=?`,
            [full_name, phone, email, specialization, bio, status, req.params.id],
            (err) => { if (err) console.error(err); res.redirect('/coaches'); });
    });
};
