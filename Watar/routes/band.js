const { requireAuth, requireRole } = require('../middleware/auth');
const moment = require('moment');

module.exports = (app, db) => {
    // ==================== WATTAR BAND ROUTES ====================

    // Band page
    app.get('/band', requireAuth, requireRole(['manager', 'operations_manager', 'trainer', 'reception']), (req, res) => {
        const user = req.session.user;
        
        // Get band members with student info and their 4 rehearsal attendance
        db.all(`
            SELECT bm.*, s.name as student_name, s.phone, s.instrument as student_instrument, s.current_level,
                s.status as student_status
            FROM band_members bm
            JOIN students s ON bm.student_id = s.id
            WHERE bm.is_active = 1 AND s.status = 'active'
            ORDER BY s.name
        `, (err, members) => {
            if (err) members = [];
            
            // Get attendance for all members (current cycle)
            db.all(`SELECT ba.* FROM band_attendance ba 
                JOIN band_members bm ON ba.student_id = bm.student_id AND ba.cycle = bm.current_cycle
                WHERE ba.student_id IN (${members.map(m => m.student_id).join(',') || 0})`, (err, attendance) => {
                if (err) attendance = [];
                
                // Attach rehearsal data to each member
                members.forEach(m => {
                    m.rehearsals = [];
                    for (let i = 1; i <= 4; i++) {
                        const att = attendance.find(a => a.student_id === m.student_id && a.rehearsal_number === i);
                        m.rehearsals.push({
                            number: i,
                            status: att ? att.status : null,
                            date: att ? att.attendance_date : null
                        });
                    }
                });
                
                // Get all active students for the add dropdown
                db.all(`SELECT id, name, instrument, current_level FROM students WHERE status = 'active' ORDER BY name`, (err, students) => {
                    if (err) students = [];
                    
                    res.render('band', { members, students, user, moment }, (err, html) => {
                        if (err) { console.error(err); return res.status(500).send('Render error'); }
                        res.render('layout', { body: html, user, activemenu: 'band' });
                    });
                });
            });
        });
    });

    // Add member to band
    app.post('/band/add-member', requireAuth, requireRole(['manager', 'operations_manager']), (req, res) => {
        const { student_id, instrument_role } = req.body;
        if (!student_id) return res.json({ success: false, error: 'Student is required' });
        
        db.run(`INSERT OR REPLACE INTO band_members (student_id, instrument_role, is_active, joined_at) VALUES (?, ?, 1, date('now'))`,
            [student_id, instrument_role || null], function(err) {
            if (err) return res.json({ success: false, error: 'Database error: ' + err.message });
            res.json({ success: true });
        });
    });

    // Remove member from band
    app.post('/band/remove-member', requireAuth, requireRole(['manager', 'operations_manager']), (req, res) => {
        const { student_id } = req.body;
        db.run('UPDATE band_members SET is_active = 0 WHERE student_id = ?', [student_id], function(err) {
            if (err) return res.json({ success: false, error: 'Database error' });
            res.json({ success: true });
        });
    });

    // Save band attendance (same pattern as normal attendance)
    app.post('/band/save-attendance', requireAuth, requireRole(['manager', 'operations_manager', 'trainer', 'reception']), (req, res) => {
        const { attendance } = req.body;
        const user = req.session.user;
        if (!attendance || !attendance.length) return res.json({ success: false, error: 'No data' });
        
        const today = new Date().toISOString().split('T')[0];
        
        // Get current cycle for each student
        const studentIds = [...new Set(attendance.map(a => a.student_id))];
        db.all(`SELECT student_id, current_cycle FROM band_members WHERE student_id IN (${studentIds.join(',')})`, (err, members) => {
            const cycleMap = {};
            (members || []).forEach(m => { cycleMap[m.student_id] = m.current_cycle || 1; });
            
            const stmt = db.prepare(`INSERT OR REPLACE INTO band_attendance (student_id, cycle, rehearsal_number, status, attendance_date, marked_by) VALUES (?, ?, ?, ?, ?, ?)`);
            let errors = 0;
            attendance.forEach(r => {
                const cycle = cycleMap[r.student_id] || 1;
                stmt.run(r.student_id, cycle, r.rehearsal_number, r.status, today, user.id, (err) => { if (err) errors++; });
            });
            stmt.finalize(() => {
                if (errors > 0) return res.json({ success: false, error: `${errors} records failed` });
                res.json({ success: true });
            });
        });
    });

    // Clear band attendance for a specific rehearsal
    app.post('/band/clear-attendance', requireAuth, requireRole(['manager', 'operations_manager', 'trainer', 'reception']), (req, res) => {
        const { student_id, rehearsal_number } = req.body;
        db.get('SELECT current_cycle FROM band_members WHERE student_id = ?', [student_id], (err, member) => {
            const cycle = member ? member.current_cycle || 1 : 1;
            db.run('DELETE FROM band_attendance WHERE student_id = ? AND cycle = ? AND rehearsal_number = ?', [student_id, cycle, rehearsal_number], function(err) {
                if (err) return res.json({ success: false, error: 'Database error' });
                res.json({ success: true });
            });
        });
    });

    // Next cycle - advance all band members to next set of 4 rehearsals
    app.post('/band/next-cycle', requireAuth, requireRole(['manager', 'operations_manager']), (req, res) => {
        db.run('UPDATE band_members SET current_cycle = current_cycle + 1 WHERE is_active = 1', function(err) {
            if (err) return res.json({ success: false, error: 'Database error' });
            res.json({ success: true, message: 'Advanced to next cycle' });
        });
    });

    // Previous cycle - go back to view previous rehearsals
    app.post('/band/prev-cycle', requireAuth, requireRole(['manager', 'operations_manager']), (req, res) => {
        db.run('UPDATE band_members SET current_cycle = MAX(current_cycle - 1, 1) WHERE is_active = 1', function(err) {
            if (err) return res.json({ success: false, error: 'Database error' });
            res.json({ success: true });
        });
    });
};
