const { requireAuth, requireRole } = require('../middleware/auth');

module.exports = (app, db) => {
    // PT page
    app.get('/pt', requireAuth, requireRole(['admin', 'manager']), (req, res) => {
        // Get members with PT packages (those with pt_sessions_remaining or have PT sessions)
        db.all(`SELECT m.id, m.full_name, m.phone, m.pt_sessions_remaining,
            (SELECT COUNT(*) FROM pt_sessions ps WHERE ps.member_id = m.id AND ps.status = 'completed') as completed_sessions,
            (SELECT COUNT(*) FROM pt_sessions ps WHERE ps.member_id = m.id) as total_sessions,
            c.full_name as coach_name, m.coach_id
            FROM members m
            LEFT JOIN coaches c ON m.coach_id = c.id
            WHERE m.pt_sessions_remaining > 0 OR m.id IN (SELECT DISTINCT member_id FROM pt_sessions)
            ORDER BY m.full_name`, (err, ptMembers) => {
            if (err) console.error('PT members error:', err);

            // Get all PT sessions
            db.all(`SELECT ps.*, m.full_name as member_name, c.full_name as coach_name
                FROM pt_sessions ps
                LEFT JOIN members m ON ps.member_id = m.id
                LEFT JOIN coaches c ON ps.coach_id = c.id
                ORDER BY ps.date DESC`, (err2, sessions) => {
                if (err2) console.error('PT sessions error:', err2);

                // Get coaches
                db.all(`SELECT * FROM coaches WHERE status = 'active' ORDER BY full_name`, (err3, coaches) => {

                    // Get all active members for adding PT package
                    db.all(`SELECT id, full_name FROM members WHERE status = 'active' ORDER BY full_name`, (err4, allMembers) => {

                        // Coach stats
                        db.all(`SELECT c.id, c.full_name, 
                            COUNT(ps.id) as total_sessions,
                            SUM(CASE WHEN ps.status = 'completed' THEN 1 ELSE 0 END) as completed,
                            (SELECT COALESCE(SUM(m.pt_sessions_remaining), 0) FROM members m WHERE m.coach_id = c.id AND m.pt_sessions_remaining > 0) as remaining
                            FROM coaches c LEFT JOIN pt_sessions ps ON c.id = ps.coach_id
                            WHERE c.status = 'active' GROUP BY c.id ORDER BY total_sessions DESC`, (err5, coachStats) => {

                            res.render('pt', {
                                user: req.session.user,
                                ptMembers: ptMembers || [],
                                sessions: sessions || [],
                                coaches: coaches || [],
                                allMembers: allMembers || [],
                                coachStats: coachStats || []
                            }, (err6, html) => {
                                if (err6) { console.error('PT render error:', err6); return res.status(500).send('Render error'); }
                                res.render('layout', { body: html, user: req.session.user, currentUrl: req.originalUrl });
                            });
                        });
                    });
                });
            });
        });
    });

    // Add PT package (set sessions for a member)
    app.post('/pt/add-package', requireAuth, requireRole(['admin', 'manager']), (req, res) => {
        const { member_id, sessions_count, coach_id } = req.body;
        db.run(`UPDATE members SET pt_sessions_remaining = pt_sessions_remaining + ?, coach_id = COALESCE(?, coach_id) WHERE id = ?`,
            [parseInt(sessions_count) || 0, coach_id || null, member_id],
            (err) => {
                if (err) console.error('PT package error:', err);
                res.redirect('/pt');
            });
    });

    // Log a PT session (record attendance and deduct)
    app.post('/pt/log-session', requireAuth, requireRole(['admin', 'manager']), (req, res) => {
        const { member_id, coach_id, date, notes } = req.body;

        db.run(`INSERT INTO pt_sessions (member_id, coach_id, date, status, notes) VALUES (?, ?, ?, 'completed', ?)`,
            [member_id, coach_id, date, notes || null], (err) => {
                if (err) { console.error('PT log error:', err); return res.redirect('/pt'); }

                // Deduct from remaining
                db.run(`UPDATE members SET pt_sessions_remaining = MAX(0, pt_sessions_remaining - 1) WHERE id = ?`, [member_id], (err) => {
                    if (err) console.error('PT deduct error:', err);
                    res.redirect('/pt');
                });
            });
    });

    // Delete PT session (add back to remaining)
    app.post('/pt/:id/delete', requireAuth, requireRole(['admin', 'manager']), (req, res) => {
        db.get(`SELECT member_id, status FROM pt_sessions WHERE id = ?`, [req.params.id], (err, session) => {
            if (!session) return res.redirect('/pt');
            
            db.run(`DELETE FROM pt_sessions WHERE id = ?`, [req.params.id], (err) => {
                // If it was completed, give back the session
                if (session.status === 'completed') {
                    db.run(`UPDATE members SET pt_sessions_remaining = pt_sessions_remaining + 1 WHERE id = ?`, [session.member_id]);
                }
                res.redirect('/pt');
            });
        });
    });
};
