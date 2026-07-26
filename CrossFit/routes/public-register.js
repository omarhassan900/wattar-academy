module.exports = (app, db) => {
    app.get('/register', (req, res) => {
        res.render('public-register');
    });

    app.post('/api/register', (req, res) => {
        const { full_name, phone, email, gender, date_of_birth, preferred_classes, health_notes } = req.body;

        if (!full_name || !phone) {
            return res.status(400).json({ error: 'Name and phone are required' });
        }

        // Check if phone already exists
        db.get(`SELECT id FROM members WHERE phone = ?`, [phone], (err, existing) => {
            if (existing) return res.status(409).json({ error: 'Phone number already registered' });

            db.run(`INSERT INTO members (full_name, phone, email, gender, date_of_birth, preferred_classes, health_notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'inactive')`,
                [full_name, phone, email, gender || 'male', date_of_birth, preferred_classes, health_notes],
                function (err) {
                    if (err) return res.status(500).json({ error: 'Registration failed' });
                    res.json({ success: true, message: 'Registration successful! Visit the gym to activate your membership.' });
                });
        });
    });
};
