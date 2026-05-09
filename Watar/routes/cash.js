const { requireAuth, requireRole } = require('../middleware/auth');

module.exports = (app, db) => {
    // Cash Management Routes
    app.get('/cash', requireAuth, requireRole(['manager','reception']), (req, res) => {
        const user = req.session.user;
        const page = parseInt(req.query.page) || 1;
        const limit = 50;
        const offset = (page - 1) * limit;
        
        // Get totals via aggregation (fast)
        db.get(`SELECT 
            COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
            COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense,
            COUNT(*) as total_count
        FROM cash_transactions`, (err, totals) => {
            if (err) {
                console.error('Error fetching totals:', err);
                return res.status(500).send('Database error');
            }
            
            const totalIncome = totals.total_income;
            const totalExpense = totals.total_expense;
            const balance = totalIncome - totalExpense;
            const totalPages = Math.ceil(totals.total_count / limit);
        
        // Get paginated transactions
        db.all(`
            SELECT ct.*, cc.name as category_name, cc.type as category_type, s.name as student_name
            FROM cash_transactions ct
            LEFT JOIN cash_categories cc ON ct.category_code = cc.code
            LEFT JOIN students s ON ct.student_id = s.id
            ORDER BY ct.transaction_date DESC, ct.created_at DESC
            LIMIT ? OFFSET ?
        `, [limit, offset], (err, transactions) => {
            if (err) {
                console.error('Error fetching transactions:', err);
                return res.status(500).send('Database error');
            }
            
            // Get all categories
            db.all('SELECT * FROM cash_categories WHERE is_active = 1 ORDER BY type, name', (err, categories) => {
                if (err) {
                    console.error('Error fetching categories:', err);
                    return res.status(500).send('Database error');
                }
                
                // Get active students for the student dropdown
                db.all("SELECT id, name, current_level FROM students WHERE status = 'active' ORDER BY name", (err, students) => {
                    if (err) students = [];
                    
                    // Render cash view and wrap in layout
                    res.render('cash', {
                        user,
                        transactions,
                        categories,
                        students: students || [],
                        totalIncome,
                        totalExpense,
                        balance,
                        currentPage: page,
                        totalPages: totalPages
                    }, (err, html) => {
                        if (err) {
                            console.error('Error rendering cash view:', err);
                            return res.status(500).send('Render error');
                        }
                        res.render('layout', { body: html, user: user });
                    });
                });
            });
        });
        });
    });

    // Add Cash Transaction
    app.post('/cash', requireAuth, requireRole(['manager','reception']), (req, res) => {
        const { transaction_date, type, amount, category_code, description, payment_method, reference_number, student_id, student_level } = req.body;
        const user = req.session.user;
        
        db.run(`
            INSERT INTO cash_transactions (transaction_date, type, amount, category_code, description, payment_method, reference_number, created_by, student_id, student_level)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [transaction_date, type, amount, category_code, description, payment_method, reference_number, user.id, student_id || null, student_level || null], function(err) {
            if (err) {
                console.error('Error adding transaction:', err);
                return res.status(500).send('Database error');
            }
            res.redirect('/cash');
        });
    });

    // Edit Cash Transaction
    app.post('/cash/:id/edit', requireAuth, requireRole(['manager','reception']), (req, res) => {
        const { id } = req.params;
        const { transaction_date, type, amount, category_code, description, payment_method, reference_number } = req.body;
        
        db.run(`
            UPDATE cash_transactions
            SET transaction_date = ?, type = ?, amount = ?, category_code = ?, description = ?, payment_method = ?, reference_number = ?
            WHERE id = ?
        `, [transaction_date, type, amount, category_code, description, payment_method, reference_number, id], function(err) {
            if (err) {
                console.error('Error updating transaction:', err);
                return res.status(500).send('Database error');
            }
            res.redirect('/cash');
        });
    });

    // Delete Cash Transaction
    app.post('/cash/:id/delete', requireAuth, requireRole(['manager','reception']), (req, res) => {
        const { id } = req.params;
        
        db.run('DELETE FROM cash_transactions WHERE id = ?', [id], function(err) {
            if (err) {
                console.error('Error deleting transaction:', err);
                return res.status(500).send('Database error');
            }
            res.redirect('/cash');
        });
    });
};
