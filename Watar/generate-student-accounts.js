const db = require('./db/init');
const bcrypt = require('bcrypt');

setTimeout(() => {
    const pw = bcrypt.hashSync('wattar123', 10);
    db.all("SELECT id, phone, name FROM students WHERE status = 'active' AND phone IS NOT NULL AND phone != ''", [], (err, students) => {
        if (err) { console.error(err); process.exit(1); }
        let created = 0;
        let processed = 0;
        console.log(`Found ${students.length} active students with phone numbers`);
        
        students.forEach(s => {
            db.run('INSERT OR IGNORE INTO student_accounts (student_id, username, password_hash) VALUES (?, ?, ?)',
                [s.id, s.phone.trim(), pw], function(err) {
                    processed++;
                    if (!err && this.changes > 0) {
                        created++;
                        console.log(`Created: ${s.name} -> ${s.phone.trim()}`);
                    }
                    if (processed === students.length) {
                        console.log(`\nDone! Created ${created} accounts. Password: wattar123`);
                        process.exit(0);
                    }
                }
            );
        });
    });
}, 3000);
