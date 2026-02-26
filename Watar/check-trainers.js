const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('wattar.db');

console.log('Checking trainers in database...\n');

// Check users with trainer role
db.all("SELECT * FROM users WHERE role = 'trainer'", (err, trainerUsers) => {
    if (err) {
        console.error('Error fetching trainer users:', err);
        db.close();
        return;
    }
    
    console.log('=== Users with Trainer Role ===');
    if (trainerUsers.length === 0) {
        console.log('No users with trainer role found.');
    } else {
        trainerUsers.forEach(user => {
            console.log(`- ${user.full_name} (username: ${user.username}, status: ${user.status})`);
        });
    }
    
    // Check trainers table
    db.all("SELECT t.*, u.full_name FROM trainers t LEFT JOIN users u ON t.user_id = u.id", (err, trainers) => {
        if (err) {
            console.error('Error fetching trainers:', err);
            db.close();
            return;
        }
        
        console.log('\n=== Trainers Table ===');
        if (trainers.length === 0) {
            console.log('No trainers found in trainers table.');
        } else {
            trainers.forEach(trainer => {
                console.log(`- ${trainer.full_name || 'Unknown'} (ID: ${trainer.id}, user_id: ${trainer.user_id}, status: ${trainer.status})`);
            });
        }
        
        console.log('\n=== Summary ===');
        console.log(`Total trainer users: ${trainerUsers.length}`);
        console.log(`Total trainers in trainers table: ${trainers.length}`);
        
        if (trainerUsers.length === 0) {
            console.log('\n⚠️  You need to create users with trainer role first.');
            console.log('Go to User Management page and create trainer users.');
        } else if (trainers.length === 0) {
            console.log('\n⚠️  You have trainer users but no entries in trainers table.');
            console.log('This might be a data issue. Trainers should be created automatically.');
        }
        
        db.close();
    });
});
