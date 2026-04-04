const bcrypt = require('bcrypt');
const { requireAuth } = require('../middleware/auth');

module.exports = (app, db) => {
    app.get('/login', (req, res) => {
        if (req.session.user) {
            return res.redirect('/');
        }
        res.render('login', { error: null });
    });

    app.post('/login', (req, res) => {
        const { username, password } = req.body;
        
        db.get("SELECT * FROM users WHERE username = ? AND status = 'active'", [username], (err, user) => {
            if (err) {
                console.error(err);
                return res.render('login', { error: 'Database error' });
            }
            
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
        const user = req.session.user;
        if (user.role == 'reception') {
            res.redirect('/attendance');
        } else if (user.role == 'trainer') {
            res.redirect('/pre-schedule');
        } else if (user.role == 'operations_manager') {
            res.redirect('/session-confirmations');
        } else if (user.role == 'sales') {
            res.redirect('/leads');
        } else {
            res.redirect('/dashboard');
        }
    });
};
