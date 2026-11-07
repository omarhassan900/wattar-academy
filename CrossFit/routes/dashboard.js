const { requireAuth, requireRole } = require('../middleware/auth');
const moment = require('moment');

module.exports = (app, db) => {
    // Verify access to dashboard
    app.post('/dashboard/verify-access', requireAuth, (req, res) => {
        const { username, password } = req.body;
        const bcrypt = require('bcrypt');
        if (!username || !password) return res.json({ success: false, error: 'Credentials required' });

        db.get('SELECT id, password_hash, role FROM users WHERE username = ?', [username], (err, user) => {
            if (err || !user) return res.json({ success: false, error: 'User not found' });
            if (!['admin', 'manager'].includes(user.role)) return res.json({ success: false, error: 'Only manager/admin can access' });

            bcrypt.compare(password, user.password_hash, (err, match) => {
                if (!match) return res.json({ success: false, error: 'Incorrect password' });
                req.session.dashUnlocked = true;
                const token = Date.now().toString(36) + Math.random().toString(36).substr(2);
                req.session.dashToken = token;
                res.json({ success: true, token: token });
            });
        });
    });

    app.get('/dashboard', requireAuth, requireRole(['admin', 'manager']), (req, res) => {
        const today = moment().format('YYYY-MM-DD');
        const stats = {};
        const unlocked = req.query.t && req.session.dashToken === req.query.t;

        const queries = [
            { key: 'activeMembers', sql: `SELECT COUNT(*) as val FROM members WHERE status = 'active'` },
            { key: 'totalMembers', sql: `SELECT COUNT(*) as val FROM members` },
            { key: 'frozenMembers', sql: `SELECT COUNT(*) as val FROM members WHERE status = 'frozen'` },
            { key: 'todayCheckins', sql: `SELECT COUNT(*) as val FROM attendance WHERE date = '${today}'` },
            { key: 'expiringMemberships', sql: `SELECT COUNT(*) as val FROM members WHERE membership_end <= date('now', '+7 days') AND membership_end >= date('now') AND status = 'active'` },
            { key: 'monthlyIncome', sql: `SELECT COALESCE(SUM(amount), 0) as val FROM cash_transactions WHERE type = 'income' AND strftime('%Y-%m', transaction_date) = strftime('%Y-%m', 'now')` },
            { key: 'monthlyExpense', sql: `SELECT COALESCE(SUM(amount), 0) as val FROM cash_transactions WHERE type = 'expense' AND strftime('%Y-%m', transaction_date) = strftime('%Y-%m', 'now')` },
            { key: 'cashBalance', sql: `SELECT COALESCE(SUM(CASE WHEN type='income' THEN amount ELSE -amount END), 0) as val FROM cash_transactions` },
        ];

        let completed = 0;
        const total = queries.length;

        queries.forEach(q => {
            db.get(q.sql, (err, row) => {
                stats[q.key] = row ? row.val : 0;
                completed++;
                if (completed === total) fetchArrayData();
            });
        });

        function fetchArrayData() {
            // Leads stats
            db.get(`SELECT COUNT(*) as total, 
                COALESCE(SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END),0) as new_leads,
                COALESCE(SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END),0) as converted,
                COALESCE(SUM(CASE WHEN status = 'lost' THEN 1 ELSE 0 END),0) as lost
                FROM leads`, (err, row) => {
                stats.totalLeads = row ? row.total : 0;
                stats.newLeads = row ? row.new_leads : 0;
                stats.convertedLeads = row ? row.converted : 0;
                stats.lostLeads = row ? row.lost : 0;

            // Members by class type
            db.all(`SELECT COALESCE(class_type, 'crossfit') as class_type, COUNT(*) as count FROM members WHERE status = 'active' GROUP BY class_type ORDER BY count DESC`, (err, rows) => {
                stats.membersByClass = rows || [];

            // Sales agent performance
            db.all(`SELECT u.full_name, COUNT(l.id) as lead_count, COALESCE(SUM(CASE WHEN l.status = 'converted' THEN 1 ELSE 0 END),0) as converted FROM leads l JOIN users u ON l.sales_by = u.id GROUP BY l.sales_by ORDER BY lead_count DESC`, (err, rows) => {
                stats.salesPerformance = rows || [];

            // Expiring list grouped by sales
            db.all(`SELECT m.full_name, m.membership_end, m.class_type, COALESCE(u.full_name, 'Unassigned') as sales_name FROM members m LEFT JOIN users u ON m.sales_by = u.id WHERE m.status = 'active' AND m.membership_end <= date('now', '+7 days') AND m.membership_end >= date('now') ORDER BY u.full_name, m.membership_end`, (err, rows) => {
                stats.expiringList = rows || [];

            // Monthly income vs expense trend (all 12 months of current year)
            db.all(`SELECT strftime('%Y-%m', transaction_date) as month,
                COALESCE(SUM(CASE WHEN type='income' THEN amount ELSE 0 END),0) as income,
                COALESCE(SUM(CASE WHEN type='expense' THEN amount ELSE 0 END),0) as expense
                FROM cash_transactions WHERE strftime('%Y', transaction_date) = strftime('%Y', 'now')
                GROUP BY month ORDER BY month`, (err, rows) => {
                // Fill all 12 months
                var year = moment().format('YYYY');
                var allMonths = [];
                for (var i = 1; i <= 12; i++) {
                    var m = year + '-' + (i < 10 ? '0' + i : i);
                    var found = (rows || []).find(function(r) { return r.month === m; });
                    allMonths.push({ month: m, income: found ? found.income : 0, expense: found ? found.expense : 0 });
                }
                stats.monthlyTrend = allMonths;

            // Income by category per month (stacked bar - current year)
            db.all(`SELECT strftime('%Y-%m', ct.transaction_date) as month, cc.name as category, SUM(ct.amount) as total
                FROM cash_transactions ct LEFT JOIN cash_categories cc ON ct.category_code = cc.code
                WHERE ct.type = 'income' AND strftime('%Y', ct.transaction_date) = strftime('%Y', 'now')
                GROUP BY month, ct.category_code ORDER BY month`, (err, rows) => {
                stats.incomeByCatMonthly = rows || [];

            // Expense by category per month (stacked bar - current year)
            db.all(`SELECT strftime('%Y-%m', ct.transaction_date) as month, cc.name as category, SUM(ct.amount) as total
                FROM cash_transactions ct LEFT JOIN cash_categories cc ON ct.category_code = cc.code
                WHERE ct.type = 'expense' AND strftime('%Y', ct.transaction_date) = strftime('%Y', 'now')
                GROUP BY month, ct.category_code ORDER BY month`, (err, rows) => {
                stats.expenseByCatMonthly = rows || [];

            // Monthly net profit bar (current year)
            db.all(`SELECT strftime('%Y-%m', transaction_date) as month,
                COALESCE(SUM(CASE WHEN type='income' THEN amount ELSE -amount END),0) as net
                FROM cash_transactions WHERE strftime('%Y', transaction_date) = strftime('%Y', 'now')
                GROUP BY month ORDER BY month`, (err, rows) => {
                // Fill all 12 months
                var year = moment().format('YYYY');
                var allNet = [];
                for (var i = 1; i <= 12; i++) {
                    var m = year + '-' + (i < 10 ? '0' + i : i);
                    var found = (rows || []).find(function(r) { return r.month === m; });
                    allNet.push({ month: m, net: found ? found.net : 0 });
                }
                stats.monthlyNetProfit = allNet;

                res.render('dashboard', { user: req.session.user, stats, moment, unlocked: unlocked }, (err2, html) => {
                    if (err2) { console.error('Dashboard render error:', err2.message); return res.status(500).send('Render error: ' + err2.message); }
                    res.render('layout', { body: html, user: req.session.user, currentUrl: req.originalUrl });
                });
            }); }); }); }); }); }); }); });
        }
    });
};
