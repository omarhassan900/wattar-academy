const { requireAuth, requireRole } = require('../middleware/auth');

module.exports = (app, db) => {
    // Pre-Schedule Management Routes (Operations Manager, Reception, Trainer)
    app.get('/pre-schedule', requireAuth, requireRole(['operations_manager', 'manager', 'reception', 'trainer']), (req, res) => {
        const user = req.session.user;
        
        // Get all active students
        db.all(`
            SELECT id, name, current_level
            FROM students
            WHERE status = 'active'
            ORDER BY name
        `, (err, students) => {
            if (err) {
                console.error('Error fetching students:', err);
            }
            
            // Get all trainers for dropdown (from users table)
            db.all(`
                SELECT id, full_name as name
                FROM users
                WHERE role = 'trainer' AND status = 'active'
                ORDER BY full_name
            `, (err, trainers) => {
                if (err) {
                    console.error('Error fetching trainers:', err);
                }
                
                console.log('Trainers found:', trainers); // Debug log
                
                res.render('pre-schedule', {
                    user,
                    students: students || [],
                    trainers: trainers || [],
                    isReadOnly: user.role === 'reception' || user.role === 'trainer'
                }, (err, html) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Render error');
                    }
                    
                    res.render('layout', {
                        body: html,
                        user: user,
                        activemenu: 'pre-schedule'
                    });
                });
            });
        });
    });

    // API endpoint to get all schedule templates
    app.get('/pre-schedule/list', requireAuth, requireRole(['operations_manager', 'manager', 'reception', 'trainer']), (req, res) => {
        const user = req.session.user;
        
        // Build query based on role
        let query = `
            SELECT 
                st.*,
                s.name as student_name,
                s.current_level as student_level,
                u.full_name as trainer_name
            FROM schedule_templates st
            JOIN students s ON st.student_id = s.id
            LEFT JOIN users u ON st.trainer_id = u.id AND u.role = 'trainer'
            WHERE st.is_active = 1 AND s.status = 'active'
        `;
        
        let params = [];
        
        // If trainer, only show their assigned students
        if (user.role === 'trainer') {
            query += ` AND st.trainer_id = ?`;
            params.push(user.id);
        }
        
        query += ` ORDER BY st.day_of_week, st.time_slot`;
        
        db.all(query, params, (err, schedules) => {
            if (err) {
                console.error('Error fetching schedules:', err);
                return res.json({ success: false, error: 'Database error' });
            }
            
            res.json({ success: true, schedules });
        });
    });

    // API endpoint to add schedule template
    app.post('/pre-schedule/add', requireAuth, requireRole(['operations_manager', 'manager']), (req, res) => {
        const { day_of_week, student_id, time_slot, trainer_id, notes } = req.body;
        
        if (!day_of_week || !student_id || !time_slot) {
            return res.json({ success: false, error: 'Missing required fields (day, student, time)' });
        }
        
        db.run(`
            INSERT INTO schedule_templates (day_of_week, time_slot, student_id, trainer_id, notes, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `, [day_of_week, time_slot, student_id, trainer_id || null, notes], function(err) {
            if (err) {
                console.error('Error adding schedule:', err);
                return res.json({ success: false, error: 'Database error' });
            }
            
            res.json({ success: true, message: 'Schedule added successfully', id: this.lastID });
        });
    });

    // API endpoint to update schedule template
    app.post('/pre-schedule/update', requireAuth, requireRole(['operations_manager', 'manager']), (req, res) => {
        const { id, day_of_week, student_id, time_slot, trainer_id, notes } = req.body;
        
        if (!id || !day_of_week || !student_id || !time_slot) {
            return res.json({ success: false, error: 'Missing required fields (day, student, time)' });
        }
        
        db.run(`
            UPDATE schedule_templates 
            SET day_of_week = ?, time_slot = ?, student_id = ?, trainer_id = ?, notes = ?, updated_at = datetime('now')
            WHERE id = ?
        `, [day_of_week, time_slot, student_id, trainer_id || null, notes, id], function(err) {
            if (err) {
                console.error('Error updating schedule:', err);
                return res.json({ success: false, error: 'Database error' });
            }
            
            res.json({ success: true, message: 'Schedule updated successfully' });
        });
    });

    // API endpoint to delete schedule template
    app.post('/pre-schedule/delete', requireAuth, requireRole(['operations_manager', 'manager']), (req, res) => {
        const { id } = req.body;
        
        if (!id) {
            return res.json({ success: false, error: 'Missing schedule ID' });
        }
        
        // Soft delete by setting is_active to 0
        db.run(`
            UPDATE schedule_templates 
            SET is_active = 0, updated_at = datetime('now')
            WHERE id = ?
        `, [id], function(err) {
            if (err) {
                console.error('Error deleting schedule:', err);
                return res.json({ success: false, error: 'Database error' });
            }
            
            res.json({ success: true, message: 'Schedule deleted successfully' });
        });
    });

    // API endpoint to get active students NOT in the weekly schedule
    app.get('/pre-schedule/unscheduled', requireAuth, requireRole(['operations_manager', 'manager', 'reception', 'trainer']), (req, res) => {
        db.all(`
            SELECT s.id, s.name, s.current_level, s.phone, s.instrument
            FROM students s
            WHERE s.status = 'active'
              AND s.id NOT IN (
                  SELECT DISTINCT st.student_id 
                  FROM schedule_templates st 
                  WHERE st.is_active = 1
              )
            ORDER BY s.name
        `, (err, students) => {
            if (err) {
                console.error('Error fetching unscheduled students:', err);
                return res.json({ success: false, error: 'Database error' });
            }
            res.json({ success: true, students: students || [] });
        });
    });
};
