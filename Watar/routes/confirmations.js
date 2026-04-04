const { requireAuth, requireRole } = require('../middleware/auth');
const moment = require('moment');

module.exports = (app, db) => {
    // Session Confirmations Routes (Operations Manager)
    app.get('/session-confirmations', requireAuth, requireRole(['operations_manager', 'manager']), (req, res) => {
        const user = req.session.user;
        
        // Get all active students with their session progress and trainer info
        const query = `
            SELECT 
                s.id as student_id,
                s.name as student_name,
                s.phone,
                s.parent_phone,
                s.current_level,
                s.trainer_id,
                u.full_name as trainer_name,
                (SELECT COUNT(DISTINCT session_id) 
                 FROM attendance 
                 WHERE student_id = s.id AND status IN ('present', 'attended')) as completed_sessions,
                (SELECT MAX(a.date) 
                 FROM attendance a 
                 WHERE a.student_id = s.id) as last_attendance_date
            FROM students s
            LEFT JOIN trainers t ON s.trainer_id = t.id
            LEFT JOIN users u ON t.user_id = u.id
            WHERE s.status = 'active'
            ORDER BY u.full_name, s.current_level, s.name
        `;
        
        db.all(query, [], (err, students) => {
            if (err) {
                console.error('Error fetching students:', err);
                return res.status(500).send('Database error');
            }
            
            // Get all trainers for filter
            db.all(`
                SELECT t.id, u.full_name as name
                FROM trainers t
                JOIN users u ON t.user_id = u.id
                WHERE t.status = 'active'
                ORDER BY u.full_name
            `, (err, trainers) => {
                if (err) {
                    console.error('Error fetching trainers:', err);
                }
                
                // Group students by trainer
                const studentsByTrainer = {};
                students.forEach(student => {
                    const trainerKey = student.trainer_name || 'No Trainer';
                    if (!studentsByTrainer[trainerKey]) {
                        studentsByTrainer[trainerKey] = [];
                    }
                    
                    // Determine next session number (1-4)
                    const nextSession = Math.min((student.completed_sessions || 0) + 1, 4);
                    student.next_session = nextSession;
                    student.progress = `${student.completed_sessions || 0}/4`;
                    
                    studentsByTrainer[trainerKey].push(student);
                });
                
                // Get unique levels for filter
                const levels = [...new Set(students.map(s => s.current_level))].sort();
                
                res.render('session-confirmations', {
                    user,
                    studentsByTrainer,
                    trainers: trainers || [],
                    levels,
                    moment
                }, (err, html) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Render error');
                    }
                    
                    res.render('layout', {
                        body: html,
                        user: user,
                        activemenu: 'session-confirmations'
                    });
                });
            });
        });
    });

    // API endpoint to update confirmation status
    app.post('/session-confirmations/update', requireAuth, requireRole(['operations_manager', 'manager']), (req, res) => {
        const { student_id, next_session, level, confirmation_status, confirmation_notes, session_date, session_time } = req.body;
        const user = req.session.user;
        
        if (!student_id || !next_session || !confirmation_status) {
            return res.json({ success: false, error: 'Missing required fields' });
        }
        
        // If confirming, require date and time
        if (confirmation_status === 'confirmed' && (!session_date || !session_time)) {
            return res.json({ success: false, error: 'Session date and time are required when confirming' });
        }
        
        // Start transaction
        db.serialize(() => {
            // If confirming, update the session date in the sessions table
            if (confirmation_status === 'confirmed' && session_date && level) {
                db.run(`
                    UPDATE sessions 
                    SET session_date = ?, status = 'scheduled'
                    WHERE level = ? AND session_number = ?
                `, [session_date, level, next_session], (err) => {
                    if (err) {
                        console.error('Error updating session date:', err);
                    }
                });
            }
            
            // Store confirmation with session date and time
            const fullNotes = session_date && session_time 
                ? `Scheduled: ${session_date} at ${session_time}${confirmation_notes ? ' - ' + confirmation_notes : ''}`
                : confirmation_notes;
            
            db.run(`
                INSERT INTO session_confirmations (student_id, session_id, confirmation_status, confirmation_notes, confirmed_by, confirmed_at, updated_at)
                VALUES (?, 0, ?, ?, ?, datetime('now'), datetime('now'))
                ON CONFLICT(student_id, session_id)
                DO UPDATE SET 
                    confirmation_status = ?,
                    confirmation_notes = ?,
                    confirmed_by = ?,
                    confirmed_at = datetime('now'),
                    updated_at = datetime('now')
            `, [student_id, confirmation_status, fullNotes, user.id, confirmation_status, fullNotes, user.id], function(err) {
                if (err) {
                    console.error('Error updating confirmation:', err);
                    return res.json({ success: false, error: 'Database error' });
                }
                
                // Log confirmed students permanently for dashboard reporting
                if (confirmation_status === 'confirmed') {
                    db.run(`INSERT INTO confirmation_log (student_id, confirmation_date, confirmed_by) VALUES (?, ?, ?)`,
                        [student_id, session_date || new Date().toISOString().split('T')[0], user.id]);
                }
                
                res.json({ 
                    success: true, 
                    message: 'Confirmation updated successfully',
                    session_date,
                    session_time,
                    full_notes: fullNotes
                });
            });
        });
    });

    // API endpoint to get all confirmations
    app.get('/session-confirmations/list', requireAuth, requireRole(['operations_manager', 'manager']), (req, res) => {
        db.all(`
            SELECT 
                sc.student_id,
                sc.confirmation_status,
                sc.confirmation_notes,
                sc.confirmed_at,
                u.full_name as confirmed_by_name
            FROM session_confirmations sc
            LEFT JOIN users u ON sc.confirmed_by = u.id
            WHERE sc.session_id = 0
        `, [], (err, confirmations) => {
            if (err) {
                console.error('Error fetching confirmations:', err);
                return res.json({ success: false, error: 'Database error' });
            }
            
            res.json({ success: true, confirmations });
        });
    });
};
