const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('wattar.db');

console.log('Testing trainer query...\n');

// Test the exact query used in server.js
db.all(`
    SELECT id, full_name as name
    FROM users
    WHERE role = 'trainer' AND status = 'active'
    ORDER BY full_name
`, (err, trainers) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('Query result:');
        console.log(JSON.stringify(trainers, null, 2));
        console.log(`\nTotal trainers found: ${trainers.length}`);
    }
    
    // Also check all users
    db.all(`SELECT username, full_name, role, status FROM users`, (err, users) => {
        if (err) {
            console.error('Error:', err);
        } else {
            console.log('\n=== All Users ===');
            users.forEach(u => {
                console.log(`${u.username} - ${u.full_name} - ${u.role} - ${u.status}`);
            });
        }
        db.close();
    });
});
