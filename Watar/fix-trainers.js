const db = require('./db/init');

setTimeout(() => {
    // Remove duplicates
    db.run('DELETE FROM trainers WHERE id NOT IN (SELECT MIN(id) FROM trainers GROUP BY user_id)', function(err) {
        if (err) console.error('Error:', err);
        else console.log('Deleted duplicates:', this.changes);

        // Sync missing trainers
        db.all("SELECT u.id, u.full_name FROM users u WHERE u.role = 'trainer' AND u.id NOT IN (SELECT user_id FROM trainers WHERE user_id IS NOT NULL)", (err, rows) => {
            if (rows && rows.length > 0) {
                rows.forEach(r => {
                    db.run('INSERT INTO trainers (user_id, status) VALUES (?, ?)', [r.id, 'active'], function() {
                        console.log('Added trainer:', r.full_name, '-> trainers id:', this.lastID);
                    });
                });
            } else {
                console.log('No missing trainers to sync');
            }

            // Show final state
            setTimeout(() => {
                db.all('SELECT t.id, t.user_id, u.full_name, t.status, t.specialization FROM trainers t JOIN users u ON t.user_id = u.id ORDER BY u.full_name', (err, rows) => {
                    console.log('Final trainers list:', rows);
                    process.exit(0);
                });
            }, 1000);
        });
    });
}, 3000);
