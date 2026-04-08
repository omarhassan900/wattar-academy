const { requireAuth, requireRole } = require('../middleware/auth');
const bcrypt = require('bcrypt');

module.exports = (app, db) => {
    // User Management Routes
    app.get('/users', requireAuth, requireRole(['manager','reception']), (req, res) => {
        const user = req.session.user;
        
        db.all('SELECT * FROM users ORDER BY created_at DESC', (err, users) => {
            if (err) {
                console.error('Error fetching users:', err);
                return res.status(500).send('Database error');
            }
            
            res.render('users', { user, users }, (err, html) => {
                if (err) {
                    console.error('Error rendering users view:', err);
                    return res.status(500).send('Render error');
                }
                res.render('layout', { body: html, user: user });
            });
        });
    });

    // Add User
    app.post('/users', requireAuth, requireRole(['manager','reception']), (req, res) => {
        const { username, password, full_name, email, role, status } = req.body;
        
        // Check if username already exists
        db.get('SELECT id FROM users WHERE username = ?', [username], (err, existingUser) => {
            if (err) {
                console.error('Error checking username:', err);
                return res.status(500).send('Database error');
            }
            
            if (existingUser) {
                return res.status(400).send('Username already exists');
            }
            
            // Hash password
            const bcrypt = require('bcrypt');
            const password_hash = bcrypt.hashSync(password, 10);
            
            db.run(`
                INSERT INTO users (username, password_hash, full_name, email, role, status, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
            `, [username, password_hash, full_name, email, role, status], function(err) {
                if (err) {
                    console.error('Error adding user:', err);
                    return res.status(500).send('Database error');
                }
                const newUserId = this.lastID;
                // Auto-create trainers entry for trainer role
                if (role === 'trainer') {
                    db.run('INSERT INTO trainers (user_id, status) VALUES (?, ?)', [newUserId, status || 'active'], (err) => {
                        if (err) console.error('Error creating trainer entry:', err);
                        res.redirect('/users');
                    });
                } else {
                    res.redirect('/users');
                }
            });
        });
    });

    // Edit User
    app.post('/users/:id/edit', requireAuth, requireRole(['manager','reception']), (req, res) => {
        const { id } = req.params;
        const { password, full_name, email, role, status } = req.body;
        
        // If password is provided, hash it
        if (password && password.trim() !== '') {
            const bcrypt = require('bcrypt');
            const password_hash = bcrypt.hashSync(password, 10);
            
            db.run(`
                UPDATE users
                SET password_hash = ?, full_name = ?, email = ?, role = ?, status = ?, updated_at = datetime('now')
                WHERE id = ?
            `, [password_hash, full_name, email, role, status, id], function(err) {
                if (err) {
                    console.error('Error updating user:', err);
                    return res.status(500).send('Database error');
                }
                res.redirect('/users');
            });
        } else {
            // Update without changing password
            db.run(`
                UPDATE users
                SET full_name = ?, email = ?, role = ?, status = ?, updated_at = datetime('now')
                WHERE id = ?
            `, [full_name, email, role, status, id], function(err) {
                if (err) {
                    console.error('Error updating user:', err);
                    return res.status(500).send('Database error');
                }
                res.redirect('/users');
            });
        }
    });

    // Delete User
    app.post('/users/:id/delete', requireAuth, requireRole(['manager','reception']), (req, res) => {
        const { id } = req.params;
        
        // Prevent deleting admin user
        if (id === '1') {
            return res.status(403).send('Cannot delete admin user');
        }
        
        db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
            if (err) {
                console.error('Error deleting user:', err);
                return res.status(500).send('Database error');
            }
            res.redirect('/users');
        });
    });
};
