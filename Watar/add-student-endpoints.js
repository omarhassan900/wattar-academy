const sqlite3 = require('sqlite3').verbose();
const express = require('express');

// This script adds the missing student endpoints to the server
console.log('Adding student view and edit endpoints...');

const endpointsToAdd = `
// Get single student (API endpoint)
app.get('/students/:id', requireAuth, (req, res) => {
    const studentId = req.params.id;
    const user = req.session.user;
    
    let query = "SELECT * FROM students WHERE id = ? AND status = 'active'";
    let params = [studentId];
    
    // If trainer, only allow access to their students
    if (user.role === 'trainer') {
        query = \`
            SELECT DISTINCT s.* FROM students s
            JOIN student_classes sc ON s.id = sc.student_id
            JOIN classes c ON sc.class_id = c.id
            JOIN trainers t ON c.trainer_id = t.id
            WHERE s.id = ? AND t.user_id = ? AND s.status = 'active'
        \`;
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
    
    db.run(\`
        UPDATE students SET 
            name = ?, national_id = ?, date_of_birth = ?, age_group = ?, 
            instrument = ?, current_level = ?, start_date = ?, phone = ?, 
            parent_phone = ?, email = ?, parent_name = ?, emergency_contact = ?,
            address = ?, medical_notes = ?, updated_at = datetime('now')
        WHERE id = ?
    \`, [
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
`;

console.log('Student endpoints code generated. Please add this to your server.js file after the existing student routes.');
console.log('\nEndpoints to add:');
console.log('1. GET /students/:id - View single student profile');
console.log('2. POST /students/:id - Update student information');
console.log('\nThese endpoints will enable the view and edit functionality for student profiles.');

// Also update the POST route for creating students to handle new fields
const updatedCreateStudent = `
app.post('/students', requireAuth, requireRole(['manager', 'reception']), (req, res) => {
    const { 
        name, national_id, date_of_birth, age_group, instrument, current_level,
        start_date, phone, parent_phone, email, parent_name, emergency_contact,
        address, medical_notes
    } = req.body;
    
    db.run(\`
        INSERT INTO students (
            name, national_id, date_of_birth, age_group, instrument, current_level,
            start_date, phone, parent_phone, email, parent_name, emergency_contact,
            address, medical_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    \`, [
        name, national_id, date_of_birth, age_group, instrument, current_level,
        start_date, phone, parent_phone, email, parent_name, emergency_contact,
        address, medical_notes
    ], function(err) {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        res.redirect('/students');
    });
});
`;

console.log('\nAlso update the existing POST /students route to handle the new fields.');
console.log('Replace the existing app.post(\'/students\', ...) with the updated version above.');