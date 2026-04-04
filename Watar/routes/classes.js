const { requireAuth, requireRole } = require('../middleware/auth');

module.exports = (app, db) => {
    // Classes Routes
    app.get('/classes', requireAuth, (req, res) => {
        const user = req.session.user;
        let query = `
            SELECT c.*, u.full_name as trainer_name,
                   COUNT(sc.student_id) as student_count
            FROM classes c
            LEFT JOIN trainers t ON c.trainer_id = t.id
            LEFT JOIN users u ON t.user_id = u.id
            LEFT JOIN student_classes sc ON c.id = sc.class_id AND sc.status = 'active'
            WHERE c.status = 'active'
            GROUP BY c.id
            ORDER BY c.name
        `;
        let params = [];
        
        // If trainer, only show their classes
        if (user.role === 'trainer') {
            query = `
                SELECT c.*, u.full_name as trainer_name,
                       COUNT(sc.student_id) as student_count
                FROM classes c
                LEFT JOIN trainers t ON c.trainer_id = t.id
                LEFT JOIN users u ON t.user_id = u.id
                LEFT JOIN student_classes sc ON c.id = sc.class_id AND sc.status = 'active'
                WHERE c.status = 'active' AND u.id = ?
                GROUP BY c.id
                ORDER BY c.name
            `;
            params = [user.id];
        }
        
        db.all(query, params, (err, classes) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }
            
            // Get trainers for dropdown (manager/reception only)
            if (user.role !== 'trainer') {
                db.all(`
                    SELECT t.id, u.full_name 
                    FROM trainers t 
                    JOIN users u ON t.user_id = u.id 
                    WHERE t.status = 'active'
                `, (err, trainers) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Database error');
                    }
                    res.render('classes', { classes, trainers, user });
                });
            } else {
                res.render('classes', { classes, trainers: [], user });
            }
        });
    });

    app.post('/classes', requireAuth, requireRole(['manager']), (req, res) => {
        const { name, level, trainer_id, schedule_day, schedule_time, duration_minutes, max_students } = req.body;
        
        db.run(`
            INSERT INTO classes (name, level, trainer_id, schedule_day, schedule_time, duration_minutes, max_students)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [name, level, trainer_id, schedule_day, schedule_time, duration_minutes, max_students], function(err) {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }
            res.redirect('/classes');
        });
    });
};
