const bcrypt = require('bcrypt');
const { requireAuth } = require('../middleware/auth');

module.exports = (app, db) => {
    app.get('/login', (req, res) => {
        if (req.session.user) return res.redirect('/');
        res.render('login', { error: null });
    });

    app.post('/login', (req, res) => {
        const { username, password } = req.body;
        db.get("SELECT * FROM users WHERE username = ? AND status = 'active'", [username], (err, user) => {
            if (err) return res.render('login', { error: 'Database error' });
            if (user && bcrypt.compareSync(password, user.password_hash)) {
                req.session.user = {
                    id: user.id,
                    username: user.username,
                    full_name: user.full_name,
                    role: user.role
                };
                res.redirect('/');
            } else {
                res.render('login', { error: 'Invalid username or password' });
            }
        });
    });

    app.get('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/login');
    });

    app.get('/', requireAuth, (req, res) => {
        const role = req.session.user.role;
        if (role === 'reception') return res.redirect('/attendance');
        if (role === 'coach') return res.redirect('/schedule');
        res.redirect('/dashboard');
    });
};
