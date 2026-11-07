const { requireAuth, requireRole } = require('../middleware/auth');
const moment = require('moment');

module.exports = (app, db) => {
    // Attendance page (check-in)
    app.get('/attendance', requireAuth, requireRole(['admin', 'manager', 'reception', 'sales']), (req, res) => {
        db.all(`SELECT m.*, c.full_name as coach_name, u.full_name as sales_name 
                FROM members m 
                LEFT JOIN coaches c ON m.coach_id = c.id 
                LEFT JOIN users u ON m.sales_by = u.id 
                ORDER BY m.full_name`, [], (err, allMembers) => {
            if (err) console.error('Attendance members query error:', err);

            // Get today's check-ins
            const today = moment().format('YYYY-MM-DD');
            db.all(`SELECT a.*, m.full_name as member_name FROM attendance a LEFT JOIN members m ON a.member_id = m.id WHERE a.date = ? ORDER BY a.check_in_time DESC`, [today], (err2, todayCheckins) => {

                res.render('attendance', {
                    user: req.session.user,
                    members: allMembers || [],
                    todayCheckins: todayCheckins || [],
                    today
                }, (err3, html) => {
                    if (err3) { console.error('Attendance render error:', err3); return res.status(500).send('Render error'); }
                    res.render('layout', { body: html, user: req.session.user, currentUrl: req.originalUrl });
                });
            });
        });
    });

    // Check-in a member (AJAX)
    app.post('/attendance/checkin', requireAuth, requireRole(['admin', 'manager', 'reception', 'sales']), (req, res) => {
        const { member_id } = req.body;
        const today = moment().format('YYYY-MM-DD');
        const check_in_time = moment().format('HH:mm');

        if (!member_id) return res.json({ success: false, error: 'Member ID required' });

        // Get member info
        db.get(`SELECT * FROM members WHERE id = ?`, [member_id], (err, member) => {
            if (err || !member) return res.json({ success: false, error: 'Member not found' });

            // Check if active
            if (member.status !== 'active') return res.json({ success: false, error: 'Member is not active (status: ' + member.status + ')', status: 'inactive' });

            // Check if membership expired
            if (member.membership_end) {
                const endDate = moment(member.membership_end);
                if (endDate.isBefore(moment(), 'day')) {
                    return res.json({ success: false, error: 'Membership expired on ' + member.membership_end, status: 'expired' });
                }
            }

            // Check if already checked in today
            db.get(`SELECT id FROM attendance WHERE member_id = ? AND date = ?`, [member_id, today], (err, existing) => {
                if (existing) return res.json({ success: false, error: 'Already checked in today', status: 'duplicate' });

                // Log attendance
                db.run(`INSERT INTO attendance (member_id, class_id, date, status, check_in_time, recorded_by) VALUES (?, 1, ?, 'present', ?, ?)`,
                    [member_id, today, check_in_time, req.session.user.id], (err) => {
                        if (err) return res.json({ success: false, error: 'Database error' });

                        // Check membership expiring soon
                        let warning = null;
                        if (member.membership_end) {
                            const daysLeft = moment(member.membership_end).diff(moment(), 'days');
                            if (daysLeft <= 7) warning = 'Membership expires in ' + daysLeft + ' days!';
                        }

                        // If member has PT sessions, deduct one
                        if (member.pt_sessions_remaining > 0) {
                            db.run(`UPDATE members SET pt_sessions_remaining = pt_sessions_remaining - 1 WHERE id = ?`, [member_id]);
                            // Log PT session
                            db.run(`INSERT INTO pt_sessions (member_id, coach_id, date, status, notes) VALUES (?, ?, ?, 'completed', 'Auto-logged from attendance')`,
                                [member_id, member.coach_id, today]);
                        }

                        res.json({ success: true, member_name: member.full_name, check_in_time, warning, pt_deducted: member.pt_sessions_remaining > 0 });
                    });
            });
        });
    });

    // Attendance History page
    app.get('/attendance-history', requireAuth, requireRole(['admin', 'manager', 'reception']), (req, res) => {
        const { date_from, date_to, member_search } = req.query;
        let query = `SELECT a.*, m.full_name as member_name, m.class_type, m.phone
            FROM attendance a
            LEFT JOIN members m ON a.member_id = m.id WHERE 1=1`;
        const params = [];

        if (date_from) { query += ` AND a.date >= ?`; params.push(date_from); }
        if (date_to) { query += ` AND a.date <= ?`; params.push(date_to); }
        if (member_search) { query += ` AND (m.full_name LIKE ? OR m.phone LIKE ?)`; params.push('%' + member_search + '%', '%' + member_search + '%'); }

        query += ` ORDER BY a.date DESC, a.check_in_time DESC LIMIT 500`;

        db.all(query, params, (err, records) => {
            if (err) console.error('History query error:', err);

            res.render('attendance-history', {
                user: req.session.user,
                records: records || [],
                filters: req.query
            }, (err2, html) => {
                if (err2) { console.error('History render error:', err2); return res.status(500).send('Render error'); }
                res.render('layout', { body: html, user: req.session.user, currentUrl: req.originalUrl });
            });
        });
    });
};
