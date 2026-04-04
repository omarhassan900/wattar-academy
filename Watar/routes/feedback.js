const { requireAuth, requireRole } = require('../middleware/auth');

module.exports = (app, db) => {
    // ==================== STUDENT FEEDBACK (on attendance page) ====================

    // Generate feedback link token
    app.post('/student-feedback/generate-link', requireAuth, requireRole(['manager', 'reception']), (req, res) => {
        const { student_id, level } = req.body;
        if (!student_id || !level) return res.json({ success: false, error: 'Missing fields' });
        
        const crypto = require('crypto');
        const token = crypto.randomBytes(16).toString('hex');
        
        // Check if feedback already exists for this student+level
        db.get('SELECT id, token, trainer_rating FROM student_feedback WHERE student_id = ? AND level = ?', [student_id, level], (err, existing) => {
            if (existing && existing.trainer_rating) {
                return res.json({ success: false, error: 'Feedback already submitted for this level' });
            }
            
            if (existing) {
                // Update existing row with token
                db.run('UPDATE student_feedback SET token = ? WHERE id = ?', [token, existing.id], (err) => {
                    if (err) return res.json({ success: false, error: 'Database error' });
                    res.json({ success: true, token });
                });
            } else {
                // Create new row with token
                db.run('INSERT INTO student_feedback (student_id, level, token) VALUES (?, ?, ?)', [student_id, level, token], function(err) {
                    if (err) return res.json({ success: false, error: 'Database error' });
                    res.json({ success: true, token });
                });
            }
        });
    });

    // Save student feedback (from attendance page by reception)
    app.post('/student-feedback/save', requireAuth, requireRole(['manager', 'reception', 'operations_manager']), (req, res) => {
        const { student_id, level, trainer_rating, development_rating, experience_rating, notes } = req.body;
        const user = req.session.user;
        
        if (!student_id || !level) return res.json({ success: false, error: 'Missing required fields' });
        
        db.run(`
            INSERT OR REPLACE INTO student_feedback (student_id, level, trainer_rating, development_rating, experience_rating, notes, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [student_id, level, trainer_rating || null, development_rating || null, experience_rating || null, notes || null, user.id], function(err) {
            if (err) return res.json({ success: false, error: 'Database error' });
            res.json({ success: true });
        });
    });

    // Get student feedback for attendance page
    app.get('/student-feedback/list', requireAuth, (req, res) => {
        db.all('SELECT * FROM student_feedback', (err, feedback) => {
            if (err) return res.json({ success: false, error: 'Database error' });
            res.json({ success: true, feedback: feedback || [] });
        });
    });

    // Public feedback page (no auth - student fills this)
    app.get('/feedback/:token', (req, res) => {
        const { token } = req.params;
        
        db.get('SELECT sf.*, s.name as student_name FROM student_feedback sf JOIN students s ON sf.student_id = s.id WHERE sf.token = ?', [token], (err, feedback) => {
            if (err || !feedback) return res.status(404).send('Feedback link not found or expired.');
            if (feedback.trainer_rating) return res.send('<html><body style="font-family:sans-serif;text-align:center;padding:50px;"><h2>Thank you!</h2><p>Your feedback has already been submitted.</p></body></html>');
            
            res.render('public-feedback', { feedback, token });
        });
    });

    // Public feedback submit (no auth)
    app.post('/feedback/:token/submit', (req, res) => {
        const { token } = req.params;
        const { trainer_rating, development_rating, experience_rating, notes } = req.body;
        
        db.get('SELECT * FROM student_feedback WHERE token = ?', [token], (err, feedback) => {
            if (err || !feedback) return res.json({ success: false, error: 'Invalid link' });
            if (feedback.trainer_rating) return res.json({ success: false, error: 'Already submitted' });
            
            db.run('UPDATE student_feedback SET trainer_rating=?, development_rating=?, experience_rating=?, notes=? WHERE token=?',
                [trainer_rating || null, development_rating || null, experience_rating || null, notes || null, token], (err) => {
                if (err) return res.json({ success: false, error: 'Database error' });
                res.json({ success: true });
            });
        });
    });
};
