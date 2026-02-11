const fs = require('fs');

console.log('Adding student view and edit functionality...');

// Read the current server.js file
let serverContent = fs.readFileSync('server.js', 'utf8');

// Add the new endpoints before the last closing brace
const newEndpoints = `
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

// Find the position to insert the new endpoints (before the last app.listen)
const insertPosition = serverContent.lastIndexOf('app.listen');
if (insertPosition !== -1) {
    serverContent = serverContent.slice(0, insertPosition) + newEndpoints + serverContent.slice(insertPosition);
    
    // Write the updated content back to server.js
    fs.writeFileSync('server.js', serverContent);
    console.log('✓ Added student view and edit endpoints to server.js');
} else {
    console.log('Could not find insertion point in server.js');
}

console.log('Student functionality has been enhanced!');
console.log('Now restart the server to enable view and edit features.');