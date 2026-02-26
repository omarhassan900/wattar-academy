const sqlite3 = require('sqlite3').verbose();

// Use the local database file
const db = new sqlite3.Database('./wattar.db');

console.log('Checking trainers in local database...\n');

// Check all users
db.all(`SELECT id, username, full_name, role, status FROM users`, (err, users) => {
    if (err) {
        console.error('Error:', err);
        db.close();
        return;
    }
    
    console.log('=== All Users ===');
    users.forEach(u => {
        console.log(`ID: ${u.id}, Username: ${u.username}, Name: ${u.full_name}, Role: "${u.role}", Status: "${u.status}"`);
    });
    
    // Check trainers specifically
    db.all(`
        SELECT id, full_name as name
        FROM users
        WHERE role = 'trainer' AND status = 'active'
        ORDER BY full_name
    `, (err, trainers) => {
        if (err) {
            console.error('Error:', err);
        } else {
            console.log('\n=== Trainers Query Result ===');
            if (trainers.length === 0) {
                console.log('No trainers found with role="trainer" AND status="active"');
                
                // Try without status filter
                db.all(`SELECT id, full_name, role, status FROM users WHERE role = 'trainer'`, (err, allTrainers) => {
                    if (err) {
                        console.error('Error:', err);
                    } else {
                        console.log('\n=== All users with role="trainer" (any status) ===');
                        if (allTrainers.length === 0) {
                            console.log('No users found with role="trainer"');
                            console.log('\nPossible issues:');
                            console.log('1. Role field might have different value (check capitalization)');
                            console.log('2. Trainers might be stored differently');
                        } else {
                            allTrainers.forEach(t => {
                                console.log(`ID: ${t.id}, Name: ${t.full_name}, Role: "${t.role}", Status: "${t.status}"`);
                            });
                        }
                    }
                    db.close();
                });
            } else {
                console.log(`Found ${trainers.length} active trainers:`);
                trainers.forEach(t => {
                    console.log(`- ID: ${t.id}, Name: ${t.name}`);
                });
                db.close();
            }
        }
    });
});
