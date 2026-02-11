console.log('🚀 Starting user management setup script...');

const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('wattar.db');

console.log('✓ Database connection established');
console.log('Setting up user management system...');

// First, let's create some sample users for testing
const sampleUsers = [
    {
        username: 'trainer1',
        password: 'trainer123',
        full_name: 'Ahmed Hassan',
        email: 'ahmed.hassan@wattar.com',
        role: 'trainer',
        specialization: 'Piano & Guitar',
        hourly_rate: 150.00
    },
    {
        username: 'trainer2', 
        password: 'trainer123',
        full_name: 'Fatima Ali',
        email: 'fatima.ali@wattar.com',
        role: 'trainer',
        specialization: 'Violin & Voice',
        hourly_rate: 140.00
    },
    {
        username: 'trainer3',
        password: 'trainer123', 
        full_name: 'Omar Mahmoud',
        email: 'omar.mahmoud@wattar.com',
        role: 'trainer',
        specialization: 'Drums & Percussion',
        hourly_rate: 130.00
    },
    {
        username: 'reception1',
        password: 'reception123',
        full_name: 'Nour Ibrahim',
        email: 'nour.ibrahim@wattar.com',
        role: 'reception'
    }
];

console.log('Creating sample users...');

db.serialize(() => {
    const userStmt = db.prepare(`
        INSERT OR IGNORE INTO users (username, password_hash, full_name, email, role)
        VALUES (?, ?, ?, ?, ?)
    `);
    
    const trainerStmt = db.prepare(`
        INSERT OR IGNORE INTO trainers (user_id, specialization, hourly_rate, hire_date)
        VALUES (?, ?, ?, date('now'))
    `);
    
    let processedUsers = 0;
    
    sampleUsers.forEach((userData) => {
        const hashedPassword = bcrypt.hashSync(userData.password, 10);
        
        userStmt.run([
            userData.username,
            hashedPassword,
            userData.full_name,
            userData.email,
            userData.role
        ], function(err) {
            if (err) {
                console.error(`Error creating user ${userData.username}:`, err.message);
            } else if (this.changes > 0) {
                console.log(`✓ Created user: ${userData.username} (${userData.full_name})`);
                
                // If this is a trainer, create trainer record
                if (userData.role === 'trainer') {
                    trainerStmt.run([
                        this.lastID,
                        userData.specialization,
                        userData.hourly_rate
                    ], (err) => {
                        if (err) {
                            console.error(`Error creating trainer record for ${userData.username}:`, err.message);
                        } else {
                            console.log(`  ✓ Created trainer profile for ${userData.full_name}`);
                        }
                    });
                }
            } else {
                console.log(`- User ${userData.username} already exists`);
            }
            
            processedUsers++;
            
            // Check if this is the last user
            if (processedUsers === sampleUsers.length) {
                userStmt.finalize();
                trainerStmt.finalize();
                
                setTimeout(() => {
                    console.log(`\n=== User Creation Summary ===`);
                    console.log('Sample users created with the following credentials:');
                    console.log('');
                    console.log('TRAINERS:');
                    console.log('- Username: trainer1, Password: trainer123 (Ahmed Hassan - Piano & Guitar)');
                    console.log('- Username: trainer2, Password: trainer123 (Fatima Ali - Violin & Voice)');
                    console.log('- Username: trainer3, Password: trainer123 (Omar Mahmoud - Drums & Percussion)');
                    console.log('');
                    console.log('RECEPTION:');
                    console.log('- Username: reception1, Password: reception123 (Nour Ibrahim)');
                    console.log('');
                    console.log('MANAGER:');
                    console.log('- Username: admin, Password: admin123 (System Administrator)');
                    console.log('');
                    console.log('✅ User management system is ready!');
                    console.log('You can now log in with different roles to test the system.');
                    console.log('');
                    console.log('🔐 Login URLs:');
                    console.log('- Manager Dashboard: http://localhost:3000 (admin/admin123)');
                    console.log('- Trainer Dashboard: http://localhost:3000 (trainer1/trainer123)');
                    console.log('- Reception Dashboard: http://localhost:3000 (reception1/reception123)');
                    
                    db.close();
                }, 1000);
            }
        });
    });
});