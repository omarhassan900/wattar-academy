const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./wattar.db');

console.log('Setting up trainers...\n');

// First, check if trainer_id column exists in students table
db.run(`ALTER TABLE students ADD COLUMN trainer_id INTEGER`, (err) => {
    if (err && !err.message.includes('duplicate column')) {
        console.log('trainer_id column:', err.message);
    } else {
        console.log('✅ trainer_id column added to students table');
    }
    
    // Insert the three trainers
    const trainers = [
        { name: 'Fady', specialization: 'Piano, Vocal', status: 'active' },
        { name: 'Tema', specialization: 'Guitar', status: 'active' },
        { name: 'Romario', specialization: 'Violin', status: 'active' }
    ];
    
    const stmt = db.prepare(`
        INSERT OR IGNORE INTO trainers (user_id, specialization, status, hire_date)
        SELECT u.id, ?, ?, date('now')
        FROM users u
        WHERE u.username = ?
    `);
    
    // First, create user accounts for trainers if they don't exist
    const userStmt = db.prepare(`
        INSERT OR IGNORE INTO users (username, password_hash, full_name, role, status)
        VALUES (?, ?, ?, 'trainer', 'active')
    `);
    
    trainers.forEach(trainer => {
        const username = trainer.name.toLowerCase();
        const password = username + '123'; // Simple password: fady123, tema123, romario123
        
        userStmt.run(username, password, trainer.name, (err) => {
            if (err) {
                console.log(`Error creating user ${trainer.name}:`, err.message);
            } else {
                console.log(`✅ User created: ${trainer.name} (username: ${username}, password: ${password})`);
            }
        });
    });
    
    userStmt.finalize(() => {
        // Now create trainer records
        trainers.forEach(trainer => {
            const username = trainer.name.toLowerCase();
            stmt.run(trainer.specialization, trainer.status, username, (err) => {
                if (err) {
                    console.log(`Error creating trainer ${trainer.name}:`, err.message);
                } else {
                    console.log(`✅ Trainer added: ${trainer.name} - ${trainer.specialization}`);
                }
            });
        });
        
        stmt.finalize(() => {
            console.log('\n✅ Trainers setup complete!');
            console.log('\nTrainer Login Credentials:');
            console.log('- Fady: username=fady, password=fady123');
            console.log('- Tema: username=tema, password=tema123');
            console.log('- Romario: username=romario, password=romario123');
            db.close();
        });
    });
});
