const { requireAuth, requireRole } = require('../middleware/auth');

module.exports = (app, db) => {
    // Verify access to cash page (manager/admin only)
    app.post('/cash/verify-access', requireAuth, (req, res) => {
        const { username, password } = req.body;
        const bcrypt = require('bcrypt');
        if (!username || !password) return res.json({ success: false, error: 'Credentials required' });

        db.get('SELECT id, password_hash, role FROM users WHERE username = ?', [username], (err, user) => {
            if (err || !user) return res.json({ success: false, error: 'User not found' });
            if (!['admin', 'manager', 'reception'].includes(user.role)) return res.json({ success: false, error: 'Only manager/admin/reception can access' });

            bcrypt.compare(password, user.password_hash, (err, match) => {
                if (!match) return res.json({ success: false, error: 'Incorrect password' });
                // Generate a one-time token stored in session
                const token = Date.now().toString(36) + Math.random().toString(36).substr(2);
                req.session.cashToken = token;
                res.json({ success: true, token: token });
            });
        });
    });

    // Cash Management page
    app.get('/cash', requireAuth, requireRole(['admin', 'manager', 'reception']), (req, res) => {
        const user = req.session.user;
        // Check token from query param matches session
        const unlocked = req.query.t && req.session.cashToken === req.query.t;

        db.get(`SELECT 
            COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
            COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense,
            COUNT(*) as total_count
        FROM cash_transactions`, (err, totals) => {
            if (err) { console.error('Cash totals error:', err); return res.status(500).send('Database error'); }

            const totalIncome = totals.total_income;
            const totalExpense = totals.total_expense;
            const balance = totalIncome - totalExpense;

            db.all(`SELECT ct.*, cc.name as category_name, cc.type as category_type, m.full_name as member_name
                FROM cash_transactions ct
                LEFT JOIN cash_categories cc ON ct.category_code = cc.code
                LEFT JOIN members m ON ct.member_id = m.id
                ORDER BY ct.transaction_date DESC, ct.created_at DESC
                LIMIT 200`, (err, transactions) => {
                if (err) { console.error('Cash transactions error:', err); return res.status(500).send('Database error'); }

                db.all('SELECT * FROM cash_categories WHERE is_active = 1 ORDER BY type, name', (err, categories) => {
                    if (err) { console.error('Cash categories error:', err); return res.status(500).send('Database error'); }

                    db.all("SELECT id, full_name FROM members WHERE status = 'active' ORDER BY full_name", (err, members) => {
                        if (err) members = [];

                        res.render('cash', {
                            user, transactions: transactions || [], categories: categories || [],
                            members: members || [], totalIncome, totalExpense, balance, unlocked
                        }, (err2, html) => {
                            if (err2) { console.error('Cash render error:', err2); return res.status(500).send('Render error'); }
                            res.render('layout', { body: html, user, currentUrl: req.originalUrl });
                        });
                    });
                });
            });
        });
    });

    // Add transaction
    app.post('/cash', requireAuth, requireRole(['admin', 'manager', 'reception']), (req, res) => {
        const { transaction_date, type, amount, category_code, description, payment_method, reference_number, member_id } = req.body;
        db.run(`INSERT INTO cash_transactions (transaction_date, type, amount, category_code, description, payment_method, reference_number, member_id, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [transaction_date, type, amount, category_code, description, payment_method, reference_number, member_id || null, req.session.user.id],
            (err) => { if (err) console.error('Cash insert error:', err); res.redirect('/cash?t=' + (req.session.cashToken || '')); });
    });

    // Edit transaction
    app.post('/cash/:id/edit', requireAuth, requireRole(['admin', 'manager', 'reception']), (req, res) => {
        const { transaction_date, type, amount, category_code, description, payment_method, reference_number } = req.body;
        db.run(`UPDATE cash_transactions SET transaction_date=?, type=?, amount=?, category_code=?, description=?, payment_method=?, reference_number=? WHERE id=?`,
            [transaction_date, type, amount, category_code, description, payment_method, reference_number, req.params.id],
            (err) => { if (err) console.error('Cash update error:', err); res.redirect('/cash?t=' + (req.session.cashToken || '')); });
    });

    // Delete transaction
    app.post('/cash/:id/delete', requireAuth, requireRole(['admin', 'manager', 'reception']), (req, res) => {
        db.run('DELETE FROM cash_transactions WHERE id = ?', [req.params.id],
            (err) => { if (err) console.error('Cash delete error:', err); res.redirect('/cash?t=' + (req.session.cashToken || '')); });
    });
};
