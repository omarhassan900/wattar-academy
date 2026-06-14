const { requireAuth, requireRole } = require('../middleware/auth');

module.exports = (app, db) => {

    // Assignments page
    app.get('/assignments', requireAuth, requireRole(['trainer', 'manager']), (req, res) => {
        const user = req.session.user;
        let studentsQuery = user.role === 'trainer'
            ? `SELECT s.id, s.name, s.current_level, s.instrument FROM students s JOIN trainers t ON s.trainer_id = t.id WHERE t.user_id = ? AND s.status = 'active' ORDER BY s.name`
            : `SELECT id, name, current_level, instrument FROM students WHERE status = 'active' ORDER BY name`;
        const params = user.role === 'trainer' ? [user.id] : [];

        db.all(studentsQuery, params, (err, students) => {
            if (err) students = [];
            db.all(`SELECT a.*, s.name as student_name, s.instrument FROM assignments a JOIN students s ON a.student_id = s.id ORDER BY a.created_at DESC LIMIT 50`, (err, assignments) => {
                if (err) assignments = [];
                db.all(`SELECT * FROM assignment_templates ORDER BY created_at DESC`, (err, templates) => {
                    if (err) templates = [];
                    res.render('assignments', { user, students: students||[], assignments: assignments||[], templates: templates||[] }, (err, html) => {
                        if (err) { console.error(err); return res.status(500).send('Render error'); }
                        res.render('layout', { body: html, user });
                    });
                });
            });
        });
    });

    // Save as template
    app.post('/assignments/template', requireAuth, requireRole(['trainer', 'manager']), (req, res) => {
        const { title, instrument, notes_sequence, instructions, youtube_url, bpm } = req.body;
        if (!title) return res.json({ success: false, error: 'Title required' });
        db.run(`INSERT INTO assignment_templates (title, instrument, notes_sequence, instructions, youtube_url, bpm, created_by) VALUES (?,?,?,?,?,?,?)`,
            [title, instrument||null, notes_sequence||null, instructions||null, youtube_url||null, bpm||null, req.session.user.id],
            function(err) {
                if (err) return res.json({ success: false, error: 'DB error' });
                res.json({ success: true, id: this.lastID });
            });
    });

    // Update template
    app.post('/assignments/template/:id/update', requireAuth, requireRole(['trainer', 'manager']), (req, res) => {
        const { title, instrument, notes_sequence, instructions, youtube_url, bpm } = req.body;
        db.run(`UPDATE assignment_templates SET title=?, instrument=?, notes_sequence=?, instructions=?, youtube_url=?, bpm=? WHERE id=?`,
            [title, instrument||null, notes_sequence||null, instructions||null, youtube_url||null, bpm||null, req.params.id],
            function(err) {
                if (err) return res.json({ success: false, error: 'DB error' });
                res.json({ success: true });
            });
    });

    // Delete template
    app.post('/assignments/template/:id/delete', requireAuth, requireRole(['trainer', 'manager']), (req, res) => {
        db.run('DELETE FROM assignment_templates WHERE id = ?', [req.params.id], function(err) {
            if (err) return res.json({ success: false, error: 'DB error' });
            res.json({ success: true });
        });
    });

    // Assign to student (from template or new)
    app.post('/assignments/add', requireAuth, requireRole(['trainer', 'manager']), (req, res) => {
        const { student_id, level, session_number, title, notes_sequence, instructions, youtube_url, bpm, template_id, instrument } = req.body;
        if (!student_id || !level || !session_number || !title) return res.json({ success: false, error: 'Missing fields' });
        db.run(`INSERT INTO assignments (student_id, level, session_number, title, notes_sequence, instructions, youtube_url, bpm, template_id, instrument, assigned_by) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
            [student_id, level, session_number, title, notes_sequence||null, instructions||null, youtube_url||null, bpm||null, template_id||null, instrument||null, req.session.user.id],
            function(err) {
                if (err) return res.json({ success: false, error: 'DB error' });
                res.json({ success: true, id: this.lastID });
            });
    });

    // Edit assignment
    app.post('/assignments/:id/update', requireAuth, requireRole(['trainer', 'manager']), (req, res) => {
        const { title, notes_sequence, instructions, youtube_url, bpm } = req.body;
        db.run(`UPDATE assignments SET title=?, notes_sequence=?, instructions=?, youtube_url=?, bpm=? WHERE id=?`,
            [title, notes_sequence||null, instructions||null, youtube_url||null, bpm||null, req.params.id],
            function(err) {
                if (err) return res.json({ success: false, error: 'DB error' });
                res.json({ success: true });
            });
    });

    // Delete assignment
    app.post('/assignments/:id/delete', requireAuth, requireRole(['trainer', 'manager']), (req, res) => {
        db.run('DELETE FROM assignments WHERE id = ?', [req.params.id], function(err) {
            if (err) return res.json({ success: false, error: 'DB error' });
            res.json({ success: true });
        });
    });

    // Get template data (for loading into builder)
    app.get('/assignments/template/:id', requireAuth, (req, res) => {
        db.get('SELECT * FROM assignment_templates WHERE id = ?', [req.params.id], (err, template) => {
            if (err || !template) return res.json({ success: false });
            res.json({ success: true, template });
        });
    });
};
