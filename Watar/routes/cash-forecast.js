const { requireAuth, requireRole } = require('../middleware/auth');

module.exports = (app, db) => {
    app.get('/cash-forecast', requireAuth, requireRole(['manager']), (req, res) => {
        const user = req.session.user;

        // Get all active students with their schedule type, session 1 date, sessions completed, and paid status
        db.all(`
            SELECT 
                s.id, s.name, s.current_level, s.instrument,
                u.full_name as trainer_name,
                (SELECT CASE WHEN (SELECT COUNT(*) FROM schedule_templates st2 
                    WHERE st2.day_of_week = st.day_of_week 
                    AND st2.time_slot = st.time_slot 
                    AND st2.trainer_id = st.trainer_id 
                    AND st2.is_active = 1) > 1 
                THEN 'Group' ELSE 'Private' END 
                FROM schedule_templates st WHERE st.student_id = s.id AND st.is_active = 1 LIMIT 1) as session_type,
                (SELECT MIN(a.date) FROM attendance a 
                    JOIN sessions sess ON a.session_id = sess.id 
                    WHERE a.student_id = s.id AND sess.level = s.current_level) as first_session_date,
                (SELECT MAX(sess.session_number) FROM attendance a 
                    JOIN sessions sess ON a.session_id = sess.id 
                    WHERE a.student_id = s.id AND sess.level = s.current_level) as last_session,
                (SELECT slp.paid FROM student_level_payments slp 
                    WHERE slp.student_id = s.id AND slp.level = s.current_level) as paid
            FROM students s
            LEFT JOIN trainers t ON s.trainer_id = t.id
            LEFT JOIN users u ON t.user_id = u.id
            WHERE s.status = 'active'
            ORDER BY first_session_date ASC
        `, (err, students) => {
            if (err) {
                console.error('Error fetching forecast data:', err);
                return res.status(500).send('Database error');
            }

            // Calculate forecast data
            const today = new Date();
            const forecastData = (students || []).map(s => {
                const fee = s.session_type === 'Group' ? 600 : 1200;
                const sessionsCompleted = s.last_session || 0;
                let startDate = s.first_session_date ? new Date(s.first_session_date) : null;
                let expectedEndDate = null;
                let progress = 0;
                let daysRemaining = null;

                if (startDate) {
                    expectedEndDate = new Date(startDate);
                    expectedEndDate.setDate(expectedEndDate.getDate() + 28); // 4 weeks
                    const totalDays = 28;
                    const elapsed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
                    progress = Math.min(Math.round((elapsed / totalDays) * 100), 100);
                    daysRemaining = Math.floor((expectedEndDate - today) / (1000 * 60 * 60 * 24));
                }

                return {
                    ...s,
                    fee,
                    sessions_completed: sessionsCompleted,
                    expected_end_date: expectedEndDate ? expectedEndDate.toISOString().split('T')[0] : null,
                    progress,
                    days_remaining: daysRemaining
                };
            });

            // Summary stats
            const privateCount = forecastData.filter(s => s.session_type === 'Private').length;
            const groupCount = forecastData.filter(s => s.session_type === 'Group').length;
            const expectedIncome = (privateCount * 1200) + (groupCount * 600);
            const paidCount = forecastData.filter(s => s.paid).length;
            const unpaidCount = forecastData.length - paidCount;

            res.render('cash-forecast', {
                user,
                students: forecastData,
                privateCount, groupCount, expectedIncome, paidCount, unpaidCount
            }, (err, html) => {
                if (err) { console.error(err); return res.status(500).send('Render error'); }
                res.render('layout', { body: html, user, activemenu: 'cash-forecast' });
            });
        });
    });
};
