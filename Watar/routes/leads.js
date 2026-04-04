const { requireAuth, requireRole } = require('../middleware/auth');
const moment = require('moment');

module.exports = (app, db) => {
    // ==================== LEADS / SALES ROUTES ====================

    // Leads page
    app.get('/leads', requireAuth, requireRole(['sales', 'manager', 'operations_manager', 'reception']), (req, res) => {
        const user = req.session.user;
        
        let leadsQuery = `
            SELECT l.*, 
                u1.full_name as assigned_to_name,
                u2.full_name as created_by_name,
                u3.full_name as trial_trainer_name,
                (SELECT COUNT(*) FROM lead_calls lc WHERE lc.lead_id = l.id) as call_count,
                (SELECT lc.notes FROM lead_calls lc WHERE lc.lead_id = l.id ORDER BY lc.call_date DESC LIMIT 1) as last_call_notes,
                (SELECT lc.outcome FROM lead_calls lc WHERE lc.lead_id = l.id ORDER BY lc.call_date DESC LIMIT 1) as last_call_outcome,
                (SELECT lc.call_date FROM lead_calls lc WHERE lc.lead_id = l.id ORDER BY lc.call_date DESC LIMIT 1) as last_call_date
            FROM leads l
            LEFT JOIN users u1 ON l.assigned_to = u1.id
            LEFT JOIN users u2 ON l.created_by = u2.id
            LEFT JOIN trainers t ON l.trial_trainer_id = t.id
            LEFT JOIN users u3 ON t.user_id = u3.id
        `;
        
        // Role-based filtering
        const params = [];
        if (user.role === 'sales') {
            leadsQuery += ' WHERE l.assigned_to = ?';
            params.push(user.id);
        } else if (user.role === 'reception') {
            leadsQuery += " WHERE l.status IN ('trial_scheduled', 'enrolled', 'not_interested')";
        }
        
        leadsQuery += ' ORDER BY l.created_at DESC';
        
        db.all(leadsQuery, params, (err, leads) => {
            if (err) {
                console.error('Error fetching leads:', err);
                return res.status(500).send('Database error');
            }
            
            // Get sales users for assignment dropdown
            db.all(`SELECT id, full_name FROM users WHERE role = 'sales' AND status = 'active' ORDER BY full_name`, (err, salesUsers) => {
                if (err) salesUsers = [];
                
                // Get trainers for trial scheduling
                db.all(`SELECT t.id, u.full_name as name FROM trainers t JOIN users u ON t.user_id = u.id WHERE t.status = 'active' ORDER BY u.full_name`, (err, trainers) => {
                    if (err) trainers = [];
                    
                    res.render('leads', {
                        leads: leads || [],
                        salesUsers: salesUsers || [],
                        trainers: trainers || [],
                        user,
                        moment
                    }, (err, html) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send('Render error');
                        }
                        res.render('layout', { body: html, user, activemenu: 'leads' });
                    });
                });
            });
        });
    });

    // Add lead
    app.post('/leads/add', requireAuth, requireRole(['sales', 'manager', 'operations_manager']), (req, res) => {
        const { name, phone, parent_phone, email, age, instrument, source, notes, assigned_to } = req.body;
        const user = req.session.user;
        
        if (!name) return res.json({ success: false, error: 'Name is required' });
        
        db.run(`
            INSERT INTO leads (name, phone, parent_phone, email, age, instrument, source, notes, assigned_to, created_by, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')
        `, [name, phone || null, parent_phone || null, email || null, age || null, instrument || null, source || null, notes || null, assigned_to || user.id, user.id], function(err) {
            if (err) {
                console.error('Error adding lead:', err);
                return res.json({ success: false, error: 'Database error' });
            }
            res.json({ success: true, id: this.lastID });
        });
    });

    // Update lead
    app.post('/leads/:id/update', requireAuth, requireRole(['sales', 'manager', 'operations_manager']), (req, res) => {
        const { id } = req.params;
        const { name, phone, parent_phone, email, age, instrument, source, status, notes, assigned_to } = req.body;
        
        db.run(`
            UPDATE leads SET name=?, phone=?, parent_phone=?, email=?, age=?, instrument=?, source=?, status=?, notes=?, assigned_to=?, updated_at=datetime('now')
            WHERE id=?
        `, [name, phone || null, parent_phone || null, email || null, age || null, instrument || null, source || null, status, notes || null, assigned_to || null, id], function(err) {
            if (err) {
                console.error('Error updating lead:', err);
                return res.json({ success: false, error: 'Database error' });
            }
            res.json({ success: true });
        });
    });

    // Delete lead
    app.post('/leads/:id/delete', requireAuth, requireRole(['manager', 'operations_manager']), (req, res) => {
        const { id } = req.params;
        db.run('DELETE FROM lead_calls WHERE lead_id = ?', [id], (err) => {
            db.run('DELETE FROM leads WHERE id = ?', [id], function(err) {
                if (err) return res.json({ success: false, error: 'Database error' });
                res.json({ success: true });
            });
        });
    });

    // Log a call
    app.post('/leads/:id/call', requireAuth, requireRole(['sales', 'manager', 'operations_manager']), (req, res) => {
        const { id } = req.params;
        const { outcome, notes } = req.body;
        const user = req.session.user;
        
        if (!outcome) return res.json({ success: false, error: 'Outcome is required' });
        
        db.run(`
            INSERT INTO lead_calls (lead_id, called_by, outcome, notes)
            VALUES (?, ?, ?, ?)
        `, [id, user.id, outcome, notes || null], function(err) {
            if (err) {
                console.error('Error logging call:', err);
                return res.json({ success: false, error: 'Database error' });
            }
            
            // Auto-update lead status based on outcome
            let newStatus = null;
            if (outcome === 'enrolled') newStatus = 'enrolled';
            else if (outcome === 'not_interested') newStatus = 'not_interested';
            else if (outcome === 'interested') newStatus = 'interested';
            else if (outcome === 'callback') newStatus = 'callback';
            else if (outcome === 'no_answer') newStatus = 'contacted';
            
            if (newStatus) {
                db.run('UPDATE leads SET status = ?, updated_at = datetime(\'now\') WHERE id = ?', [newStatus, id]);
            }
            
            res.json({ success: true, id: this.lastID });
        });
    });

    // Get call history for a lead
    app.get('/leads/:id/calls', requireAuth, requireRole(['sales', 'manager', 'operations_manager', 'reception']), (req, res) => {
        const { id } = req.params;
        db.all(`
            SELECT lc.*, u.full_name as caller_name
            FROM lead_calls lc
            LEFT JOIN users u ON lc.called_by = u.id
            WHERE lc.lead_id = ?
            ORDER BY lc.call_date DESC
        `, [id], (err, calls) => {
            if (err) return res.json({ success: false, error: 'Database error' });
            res.json({ success: true, calls: calls || [] });
        });
    });

    // Schedule trial (Operations Manager)
    app.post('/leads/:id/schedule-trial', requireAuth, requireRole(['operations_manager', 'manager']), (req, res) => {
        const { id } = req.params;
        const { trial_date, trial_time, trial_trainer_id, trial_notes } = req.body;
        
        if (!trial_date || !trial_time) return res.json({ success: false, error: 'Date and time are required' });
        
        db.run(`
            UPDATE leads SET trial_date=?, trial_time=?, trial_trainer_id=?, trial_notes=?, status='trial_scheduled', updated_at=datetime('now')
            WHERE id=?
        `, [trial_date, trial_time, trial_trainer_id || null, trial_notes || null, id], function(err) {
            if (err) return res.json({ success: false, error: 'Database error' });
            res.json({ success: true });
        });
    });

    // Mark trial result (Reception)
    app.post('/leads/:id/trial-result', requireAuth, requireRole(['reception', 'manager', 'operations_manager']), (req, res) => {
        const { id } = req.params;
        const { result, notes } = req.body;
        
        if (result === 'enrolled') {
            // Convert lead to student
            db.get('SELECT * FROM leads WHERE id = ?', [id], (err, lead) => {
                if (err || !lead) return res.json({ success: false, error: 'Lead not found' });
                
                db.run(`
                    INSERT INTO students (name, phone, parent_phone, email, instrument, current_level, status, start_date, trainer_id, date_of_birth)
                    VALUES (?, ?, ?, ?, ?, 'Month 1', 'active', date('now'), ?, NULL)
                `, [lead.name, lead.phone, lead.parent_phone, lead.email, lead.instrument, lead.trial_trainer_id], function(err) {
                    if (err) {
                        console.error('Error converting lead to student:', err);
                        return res.json({ success: false, error: 'Error creating student' });
                    }
                    
                    const studentId = this.lastID;
                    db.run("UPDATE leads SET status='enrolled', notes=COALESCE(notes,'') || '\n[Enrolled - Student ID: " + studentId + "]', updated_at=datetime('now') WHERE id=?", [id]);
                    res.json({ success: true, studentId });
                });
            });
        } else {
            db.run("UPDATE leads SET status='not_interested', updated_at=datetime('now') WHERE id=?", [id], function(err) {
                if (err) return res.json({ success: false, error: 'Database error' });
                res.json({ success: true });
            });
        }
    });
};
