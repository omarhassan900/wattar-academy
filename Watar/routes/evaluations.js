const { requireAuth, requireRole } = require('../middleware/auth');
const moment = require('moment');

module.exports = (app, db) => {
    // ==================== STUDENT EVALUATIONS ROUTES ====================

    // Evaluations page (trainer sees their students, manager sees all)
    app.get('/evaluations', requireAuth, requireRole(['trainer', 'manager', 'operations_manager', 'reception']), (req, res) => {
        const user = req.session.user;
        
        // Get trainer_id from trainers table for this user
        let trainerCondition = '';
        let params = [];
        
        if (user.role === 'trainer') {
            trainerCondition = 'AND s.trainer_id IN (SELECT id FROM trainers WHERE user_id = ?)';
            params.push(user.id);
        }
        
        // Get students whose 4th session is attended in their current level
        db.all(`
            SELECT s.id, s.name, s.current_level, s.instrument, s.phone,
                s.trainer_id,
                (SELECT u.full_name FROM trainers t JOIN users u ON t.user_id = u.id WHERE t.id = s.trainer_id) as trainer_name,
                (SELECT COUNT(DISTINCT a.session_id) FROM attendance a 
                 JOIN sessions sess ON a.session_id = sess.id 
                 WHERE a.student_id = s.id AND sess.level = s.current_level 
                 AND a.status IN ('present', 'attended')) as completed_sessions,
                (SELECT 1 FROM attendance a 
                 JOIN sessions sess ON a.session_id = sess.id 
                 WHERE a.student_id = s.id AND sess.level = s.current_level 
                 AND sess.session_number = 4 AND a.status IN ('present', 'attended')
                 LIMIT 1) as session4_attended,
                se.id as eval_id, se.attitude_rating, se.commitment_rating, se.development_rating, se.notes as eval_notes, se.evaluated_at
            FROM students s
            LEFT JOIN student_evaluations se ON se.student_id = s.id AND se.level = s.current_level
            WHERE s.status = 'active' ${trainerCondition}
            ORDER BY s.current_level, s.name
        `, params, (err, students) => {
            if (err) {
                console.error('Error fetching students for evaluation:', err);
                return res.status(500).send('Database error');
            }
            
            // Get session dates for each student
            const studentIds = (students || []).map(s => s.id);
            if (studentIds.length === 0) {
                return renderEvalPage(res, user, [], {});
            }
            
            db.all(`
                SELECT a.student_id, sess.session_number, a.date as session_date, a.status
                FROM attendance a
                JOIN sessions sess ON a.session_id = sess.id
                JOIN students s ON a.student_id = s.id AND sess.level = s.current_level
                WHERE a.student_id IN (${studentIds.join(',')})
                AND a.status IN ('present', 'attended')
                ORDER BY a.student_id, sess.session_number
            `, (err, sessionDates) => {
                if (err) sessionDates = [];
                
                // Group session dates by student
                const sessionMap = {};
                (sessionDates || []).forEach(sd => {
                    if (!sessionMap[sd.student_id]) sessionMap[sd.student_id] = [];
                    sessionMap[sd.student_id].push(sd);
                });
                
                renderEvalPage(res, user, students || [], sessionMap);
            });
        });
    });

    function renderEvalPage(res, user, students, sessionMap) {
        // Split into pending (session 4 attended, no eval) and evaluated
        const pending = students.filter(s => s.session4_attended && !s.eval_id);
        const evaluated = students.filter(s => s.eval_id);
        
        // Attach session dates
        [...pending, ...evaluated].forEach(s => {
            s.sessionDates = sessionMap[s.id] || [];
        });
        
        res.render('evaluations', { user, pending, evaluated, moment }, (err, html) => {
            if (err) { console.error(err); return res.status(500).send('Render error'); }
            res.render('layout', { body: html, user, activemenu: 'evaluations' });
        });
    }

    // Save evaluation
    app.post('/evaluations/save', requireAuth, requireRole(['trainer', 'manager']), (req, res) => {
        const { student_id, level, attitude_rating, commitment_rating, development_rating, notes } = req.body;
        const user = req.session.user;
        
        if (!student_id || !level) return res.json({ success: false, error: 'Missing required fields' });
        
        db.run(`
            INSERT OR REPLACE INTO student_evaluations (student_id, level, trainer_id, attitude_rating, commitment_rating, development_rating, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [student_id, level, user.id, attitude_rating || null, commitment_rating || null, development_rating || null, notes || null], function(err) {
            if (err) return res.json({ success: false, error: 'Database error' });
            res.json({ success: true });
        });
    });

    // Get evaluation history for a student
    app.get('/evaluations/history/:studentId', requireAuth, requireRole(['trainer', 'manager', 'operations_manager']), (req, res) => {
        db.all(`
            SELECT se.*, u.full_name as trainer_name
            FROM student_evaluations se
            LEFT JOIN users u ON se.trainer_id = u.id
            WHERE se.student_id = ?
            ORDER BY se.evaluated_at DESC
        `, [req.params.studentId], (err, evals) => {
            if (err) return res.json({ success: false, error: 'Database error' });
            res.json({ success: true, evaluations: evals || [] });
        });
    });
};
