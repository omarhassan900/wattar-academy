const { requireAuth, requireRole } = require('../middleware/auth');
const bcrypt = require('bcrypt');

module.exports = (app, db) => {
    // Verify access to users page
    app.post('/users/verify-access', requireAuth, (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) return res.json({ success: false, error: 'Credentials required' });

        db.get('SELECT id, password_hash, role FROM users WHERE username = ?', [username], (err, user) => {
            if (err || !user) return res.json({ success: false, error: 'User not found' });
            if (!['admin', 'manager'].includes(user.role)) return res.json({ success: false, error: 'Only manager/admin can access' });

            bcrypt.compare(password, user.password_hash, (err, match) => {
                if (!match) return res.json({ success: false, error: 'Incorrect password' });
                const token = Date.now().toString(36) + Math.random().toString(36).substr(2);
                req.session.usersToken = token;
                res.json({ success: true, token: token });
            });
        });
    });

    app.get('/users', requireAuth, requireRole(['admin', 'manager']), (req, res) => {
        const unlocked = req.query.t && req.session.usersToken === req.query.t;
        // Manager can't see admin users
        const query = req.session.user.role === 'manager' 
            ? "SELECT * FROM users WHERE role != 'admin' ORDER BY created_at DESC"
            : 'SELECT * FROM users ORDER BY created_at DESC';
        db.all(query, (err, users) => {
            if (err) return res.status(500).send('Database error');
            res.render('users', { user: req.session.user, users: users || [], unlocked: unlocked }, (err, html) => {
                if (err) return res.status(500).send('Render error');
                res.render('layout', { body: html, user: req.session.user, currentUrl: req.originalUrl });
            });
        });
    });

    app.post('/users', requireAuth, requireRole(['admin', 'manager']), (req, res) => {
        const { username, password, full_name, email, role, status } = req.body;

        // Manager cannot create admin users
        if (req.session.user.role === 'manager' && role === 'admin') {
            return res.status(403).send('Managers cannot create admin users');
        }

        db.get('SELECT id FROM users WHERE username = ?', [username], (err, existing) => {
            if (existing) return res.status(400).send('Username already exists');

            const password_hash = bcrypt.hashSync(password, 10);
            db.run(`INSERT INTO users (username, password_hash, full_name, email, role, status) VALUES (?, ?, ?, ?, ?, ?)`,
                [username, password_hash, full_name, email, role, status || 'active'],
                function (err) {
                    if (err) return res.status(500).send('Database error');
                    if (role === 'coach') {
                        db.run('INSERT INTO coaches (user_id, full_name, email, status) VALUES (?, ?, ?, ?)',
                            [this.lastID, full_name, email, status || 'active']);
                    }
                    req.session.usersUnlocked = true; res.redirect('/users?t=' + (req.session.usersToken || ''));
                });
        });
    });

    app.post('/users/:id/edit', requireAuth, requireRole(['admin', 'manager']), (req, res) => {
        const { password, full_name, email, role, status } = req.body;
        const id = req.params.id;

        if (req.session.user.role === 'manager' && role === 'admin') {
            return res.status(403).send('Managers cannot assign admin role');
        }

        if (password && password.trim() !== '') {
            const password_hash = bcrypt.hashSync(password, 10);
            db.run(`UPDATE users SET password_hash=?, full_name=?, email=?, role=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
                [password_hash, full_name, email, role, status, id], () => res.redirect('/users?t=' + (req.session.usersToken || '')));
        } else {
            db.run(`UPDATE users SET full_name=?, email=?, role=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
                [full_name, email, role, status, id], () => res.redirect('/users?t=' + (req.session.usersToken || '')));
        }
    });

    app.post('/users/:id/delete', requireAuth, requireRole(['admin', 'manager']), (req, res) => {
        if (req.params.id === '1') return res.status(403).send('Cannot delete admin user');
        
        // If user is a coach, deactivate their coach record too
        db.get('SELECT role FROM users WHERE id = ?', [req.params.id], (err, user) => {
            if (user && user.role === 'coach') {
                db.run("UPDATE coaches SET status = 'inactive' WHERE user_id = ?", [req.params.id]);
            }
            db.run('DELETE FROM users WHERE id = ?', [req.params.id], () => res.redirect('/users?t=' + (req.session.usersToken || '')));
        });
    });
};
