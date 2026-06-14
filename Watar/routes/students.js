const { requireAuth, requireRole } = require('../middleware/auth');

module.exports = (app, db) => {
    // Student Routes
    app.get('/students', requireAuth, (req, res) => {
        const user = req.session.user;
        let query = `
            SELECT s.*, u.full_name as trainer_name,
                (SELECT CASE WHEN (SELECT COUNT(*) FROM schedule_templates st2 
                    WHERE st2.day_of_week = st.day_of_week 
                    AND st2.time_slot = st.time_slot 
                    AND st2.trainer_id = st.trainer_id 
                    AND st2.is_active = 1) > 1 
                THEN 'Group' ELSE 'Private' END 
                FROM schedule_templates st WHERE st.student_id = s.id AND st.is_active = 1 LIMIT 1) as session_type
            FROM students s
            LEFT JOIN trainers t ON s.trainer_id = t.id
            LEFT JOIN users u ON t.user_id = u.id
            ORDER BY s.name
        `;
        let params = [];
        
        // If trainer, only show their students
        if (user.role === 'trainer') {
            query = `
                SELECT s.*, u.full_name as trainer_name,
                    (SELECT CASE WHEN (SELECT COUNT(*) FROM schedule_templates st2 
                        WHERE st2.day_of_week = st.day_of_week 
                        AND st2.time_slot = st.time_slot 
                        AND st2.trainer_id = st.trainer_id 
                        AND st2.is_active = 1) > 1 
                    THEN 'Group' ELSE 'Private' END 
                    FROM schedule_templates st WHERE st.student_id = s.id AND st.is_active = 1 LIMIT 1) as session_type
                FROM students s
                LEFT JOIN trainers t ON s.trainer_id = t.id
                LEFT JOIN users u ON t.user_id = u.id
                WHERE s.trainer_id = (SELECT id FROM trainers WHERE user_id = ?)
                ORDER BY s.name
            `;
            params = [user.id];
        }
        
        db.all(query, params, (err, students) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }
            
            // Get unique instruments
            const instrumentsSet = new Set();
            students.forEach(student => {
                if (student.instrument) {
                    instrumentsSet.add(student.instrument);
                }
            });
            const instruments = Array.from(instrumentsSet).sort();
            
            // Get all trainers for the dropdown
            db.all(`
                SELECT t.id, u.full_name as name, t.specialization
                FROM trainers t
                JOIN users u ON t.user_id = u.id
                WHERE t.status = 'active'
                ORDER BY u.full_name
            `, (err, trainers) => {
                if (err) {
                    console.error('Error fetching trainers:', err);
                }
                
                // Render students view as a string
                res.render('students', {
                    user,
                    students,
                    instruments,
                    trainers: trainers || []
                }, (err, html) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Render error');
                    }
                    
                    // Wrap in layout
                    res.render('layout', {
                        body: html,
                        user: user,
                        activemenu: 'students' 
                    });
                });
            });
        });
    });

    app.post('/students', requireAuth, requireRole(['manager', 'reception']), (req, res) => {
        const { name, national_id, phone, parent_phone, email, start_date, current_level, instrument, address, date_of_birth, emergency_contact, emergency_phone, trainer_id } = req.body;
        
        // Convert empty national_id to NULL so UNIQUE constraint allows multiple empty values
        const finalNationalId = (national_id && national_id.trim() !== '') ? national_id.trim() : null;
        
        db.run(`
            INSERT INTO students (name, national_id, phone, parent_phone, email, start_date, current_level, instrument, address, date_of_birth, emergency_contact, emergency_phone, trainer_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [name, finalNationalId, phone, parent_phone, email, start_date, current_level, instrument, address, date_of_birth, emergency_contact, emergency_phone, trainer_id], function(err) {
            if (err) {
                console.error(err);
                if (err.code === 'SQLITE_CONSTRAINT' && err.message.includes('national_id')) {
                    return res.status(400).send('A student with this National ID / Phone already exists. Please use a different one.');
                }
                return res.status(500).send('Database error');
            }
            
            // Auto-create portal account if phone exists
            if (phone && phone.trim()) {
                const bcrypt = require('bcrypt');
                const pw = bcrypt.hashSync('wattar123', 10);
                db.run('INSERT OR IGNORE INTO student_accounts (student_id, username, password_hash) VALUES (?, ?, ?)',
                    [this.lastID, phone.trim(), pw]);
            }
            
            res.redirect('/students');
        });
    });

    // Edit Student Route
    app.post('/students/:id/edit', requireAuth, requireRole(['manager', 'reception']), (req, res) => {
        const { id } = req.params;
        const { name, national_id, phone, parent_phone, email, start_date, current_level, instrument, status, address, date_of_birth, emergency_contact, emergency_phone, trainer_id } = req.body;
        
        console.log('Edit student - trainer_id received:', trainer_id);
        console.log('Edit student - full body:', req.body);
        
        // Check if national_id is being changed and if it already exists for another student
        if (national_id && national_id.trim() !== '') {
            db.get('SELECT id FROM students WHERE national_id = ? AND id != ?', [national_id, id], (err, existingStudent) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Database error');
                }
                
                if (existingStudent) {
                    return res.status(400).send('National ID already exists for another student');
                }
                
                // Proceed with update
                updateStudent();
            });
        } else {
            // If national_id is empty, set it to NULL
            updateStudent();
        }
        
        function updateStudent() {
            // Set national_id to NULL if empty
            const finalNationalId = (national_id && national_id.trim() !== '') ? national_id : null;
            
            db.run(`
                UPDATE students 
                SET name = ?, national_id = ?, phone = ?, parent_phone = ?, email = ?, 
                    start_date = ?, current_level = ?, instrument = ?, status = ?,
                    address = ?, date_of_birth = ?, emergency_contact = ?, emergency_phone = ?, trainer_id = ?
                WHERE id = ?
            `, [name, finalNationalId, phone, parent_phone, email, start_date, current_level, instrument, status, address, date_of_birth, emergency_contact, emergency_phone, trainer_id, id], function(err) {
                if (err) {
                    console.error('Error updating student:', err);
                    return res.status(500).send('Database error: ' + err.message);
                }
                res.redirect('/students');
            });
        }
    });

    // Get single student (API endpoint)
    app.get('/students/:id', requireAuth, (req, res) => {
        const studentId = req.params.id;
        const user = req.session.user;
        
        let query = "SELECT * FROM students WHERE id = ? AND status = 'active'";
        let params = [studentId];
        
        // If trainer, only allow access to their students
        if (user.role === 'trainer') {
            query = `
                SELECT DISTINCT s.* FROM students s
                JOIN student_classes sc ON s.id = sc.student_id
                JOIN classes c ON sc.class_id = c.id
                JOIN trainers t ON c.trainer_id = t.id
                WHERE s.id = ? AND t.user_id = ? AND s.status = 'active'
            `;
            params = [studentId, user.id];
        }
        
        db.get(query, params, (err, student) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (!student) {
                return res.status(404).json({ error: 'Student not found' });
            }
            
            res.json(student);
        });
    });

    // Update student
    app.post('/students/:id', requireAuth, requireRole(['manager', 'reception']), (req, res) => {
        const studentId = req.params.id;
        const {
            name, national_id, date_of_birth, age_group, instrument, current_level,
            start_date, phone, parent_phone, email, parent_name, emergency_contact,
            address, medical_notes
        } = req.body;
        
        db.run(`
            UPDATE students SET 
                name = ?, national_id = ?, date_of_birth = ?, age_group = ?, 
                instrument = ?, current_level = ?, start_date = ?, phone = ?, 
                parent_phone = ?, email = ?, parent_name = ?, emergency_contact = ?,
                address = ?, medical_notes = ?, updated_at = datetime('now')
            WHERE id = ?
        `, [
            name, national_id, date_of_birth, age_group, instrument, current_level,
            start_date, phone, parent_phone, email, parent_name, emergency_contact,
            address, medical_notes, studentId
        ], function(err) {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }
            res.redirect('/students');
        });
    });
};
