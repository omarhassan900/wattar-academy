const { requireAuth, requireRole } = require('../middleware/auth');
const bcrypt = require('bcrypt');

module.exports = (app, db) => {
    app.get('/users', requireAuth, requireRole(['admin']), (req, res) => {
        db.all('SELECT * FROM users ORDER BY created_at DESC', (err, users) => {
            if (err) return res.status(500).send('Database error');
            res.render('users', { user: req.session.user, users: users || [] }, (err, html) => {
                if (err) return res.status(500).send('Render error');
                res.render('layout', { body: html, user: req.session.user, currentUrl: req.originalUrl });
            });
        });
    });

    app.post('/users', requireAuth, requireRole(['admin']), (req, res) => {
        const { username, password, full_name, email, role, status } = req.body;

        db.get('SELECT id FROM users WHERE username = ?', [username], (err, existing) => {
            if (existing) return res.status(400).send('Username already exists');

            const password_hash = bcrypt.hashSync(password, 10);
            db.run(`INSERT INTO users (username, password_hash, full_name, email, role, status) VALUES (?, ?, ?, ?, ?, ?)`,
                [username, password_hash, full_name, email, role, status || 'active'],
                function (err) {
                    if (err) return res.status(500).send('Database error');
                    // Auto-create coach entry if role is coach
                    if (role === 'coach') {
                        db.run('INSERT INTO coaches (user_id, full_name, email, status) VALUES (?, ?, ?, ?)',
                            [this.lastID, full_name, email, status || 'active']);
                    }
                    res.redirect('/users');
                });
        });
    });

    app.post('/users/:id/edit', requireAuth, requireRole(['admin']), (req, res) => {
        const { password, full_name, email, role, status } = req.body;
        const id = req.params.id;

        if (password && password.trim() !== '') {
            const password_hash = bcrypt.hashSync(password, 10);
            db.run(`UPDATE users SET password_hash=?, full_name=?, email=?, role=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
                [password_hash, full_name, email, role, status, id], () => res.redirect('/users'));
        } else {
            db.run(`UPDATE users SET full_name=?, email=?, role=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
                [full_name, email, role, status, id], () => res.redirect('/users'));
        }
    });

    app.post('/users/:id/delete', requireAuth, requireRole(['admin']), (req, res) => {
        if (req.params.id === '1') return res.status(403).send('Cannot delete admin user');
        db.run('DELETE FROM users WHERE id = ?', [req.params.id], () => res.redirect('/users'));
    });
};
