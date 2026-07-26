const { requireAuth, requireRole } = require('../middleware/auth');
const moment = require('moment');

module.exports = (app, db) => {
    app.get('/dashboard', requireAuth, requireRole(['admin', 'manager']), (req, res) => {
        const today = moment().format('YYYY-MM-DD');

        const stats = {};
        db.get(`SELECT COUNT(*) as total FROM members WHERE status = 'active'`, (err, row) => {
            stats.activeMembers = row ? row.total : 0;

            db.get(`SELECT COUNT(*) as total FROM attendance WHERE date = ?`, [today], (err, row) => {
                stats.todayCheckins = row ? row.total : 0;

                db.get(`SELECT COUNT(*) as total FROM members WHERE membership_end <= ? AND status = 'active'`, [today], (err, row) => {
                    stats.expiringMemberships = row ? row.total : 0;

                    db.get(`SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')`, (err, row) => {
                        stats.monthlyRevenue = row ? row.total : 0;

                        db.all(`SELECT a.date, COUNT(*) as count FROM attendance a WHERE a.date >= date('now', '-7 days') GROUP BY a.date ORDER BY a.date`, (err, chartData) => {
                            stats.weeklyAttendance = chartData || [];

                            db.all(`SELECT m.full_name, m.membership_end FROM members m WHERE m.status = 'active' AND m.membership_end <= date('now', '+7 days') ORDER BY m.membership_end LIMIT 10`, (err, expiring) => {
                                stats.expiringList = expiring || [];

                                res.render('dashboard', { user: req.session.user, stats }, (err, html) => {
                                    if (err) { console.error(err); return res.status(500).send('Render error'); }
                                    res.render('layout', { body: html, user: req.session.user, currentUrl: req.originalUrl });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};
