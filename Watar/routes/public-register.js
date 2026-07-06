module.exports = (app, db) => {
    // Serve the public registration form
    app.get('/register', (req, res) => {
        res.render('public-register');
    });

    // Handle registration submission
    app.post('/api/public-register', (req, res) => {
        const { name, phone, parent_phone, email, date_of_birth, instrument, address, terms_accepted } = req.body;

        // Validation
        if (!name || !phone || !instrument) {
            return res.status(400).json({ error: 'الاسم ورقم الهاتف والآلة الموسيقية مطلوبين' });
        }

        if (!/^01[0-9]{9}$/.test(phone)) {
            return res.status(400).json({ error: 'رقم الهاتف غير صحيح' });
        }

        if (!terms_accepted) {
            return res.status(400).json({ error: 'يجب الموافقة على الشروط والأحكام' });
        }

        // Check if phone already exists
        db.get('SELECT id FROM students WHERE phone = ?', [phone], (err, existing) => {
            if (err) {
                console.error('Registration check error:', err);
                return res.status(500).json({ error: 'حدث خطأ في النظام' });
            }

            if (existing) {
                return res.status(409).json({ error: 'رقم الهاتف مسجل بالفعل. تواصل مع الأكاديمية للمساعدة.' });
            }

            // Insert new student
            const sql = `INSERT INTO students (name, phone, parent_phone, email, date_of_birth, instrument, address, current_level, status, start_date, created_at)
                         VALUES (?, ?, ?, ?, ?, ?, ?, 'Month 1', 'New', date('now'), datetime('now'))`;

            db.run(sql, [name, phone, parent_phone || null, email || null, date_of_birth || null, instrument, address || null], function(err) {
                if (err) {
                    console.error('Registration insert error:', err);
                    if (err.message.includes('UNIQUE')) {
                        return res.status(409).json({ error: 'هذا الطالب مسجل بالفعل' });
                    }
                    return res.status(500).json({ error: 'حدث خطأ أثناء التسجيل' });
                }

                console.log(`New student registered via public form: ${name} (ID: ${this.lastID})`);
                res.json({ success: true, message: 'تم التسجيل بنجاح' });
            });
        });
    });
};
