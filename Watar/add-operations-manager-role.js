const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const db = new sqlite3.Database('wattar.db');

console.log('Adding Operations Manager role and session confirmations table...\n');

db.serialize(() => {
    // Step 1: Create a new users table with the updated role constraint
    console.log('Step 1: Creating new users table with operations_manager role...');
    db.run(`
        CREATE TABLE IF NOT EXISTS users_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(50) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(100) NOT NULL,
            email VARCHAR(100),
            role TEXT CHECK(role IN ('manager', 'reception', 'trainer', 'operations_manager')) NOT NULL,
            status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating new users table:', err);
            return;
        }
        console.log('✓ New users table created');
        
        // Step 2: Copy data from old table to new table
        console.log('\nStep 2: Copying existing users...');
        db.run(`
            INSERT INTO users_new (id, username, password_hash, full_name, email, role, status, created_at, updated_at)
            SELECT id, username, password_hash, full_name, email, role, status, created_at, updated_at
            FROM users
        `, (err) => {
            if (err) {
                console.error('Error copying users:', err);
                return;
            }
            console.log('✓ Existing users copied');
            
            // Step 3: Drop old table and rename new table
            console.log('\nStep 3: Replacing old users table...');
            db.run('DROP TABLE users', (err) => {
                if (err) {
                    console.error('Error dropping old users table:', err);
                    return;
                }
                
                db.run('ALTER TABLE users_new RENAME TO users', (err) => {
                    if (err) {
                        console.error('Error renaming table:', err);
                        return;
                    }
                    console.log('✓ Users table updated successfully');
                    
                    // Step 4: Create session_confirmations table
                    console.log('\nStep 4: Creating session_confirmations table...');
                    db.run(`
                        CREATE TABLE IF NOT EXISTS session_confirmations (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            student_id INTEGER NOT NULL,
                            session_id INTEGER NOT NULL,
                            confirmation_status TEXT CHECK(confirmation_status IN ('confirmed', 'not_confirmed', 'pending')) DEFAULT 'pending',
                            confirmation_notes TEXT,
                            confirmed_by INTEGER,
                            confirmed_at DATETIME,
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (student_id) REFERENCES students(id),
                            FOREIGN KEY (session_id) REFERENCES sessions(id),
                            FOREIGN KEY (confirmed_by) REFERENCES users(id),
                            UNIQUE(student_id, session_id)
                        )
                    `, (err) => {
                        if (err) {
                            console.error('Error creating session_confirmations table:', err);
                            return;
                        }
                        console.log('✓ session_confirmations table created');
                        
                        // Step 5: Create a sample operations manager user
                        console.log('\nStep 5: Creating sample operations manager user...');
                        const password = bcrypt.hashSync('operations123', 10);
                        db.run(`
                            INSERT OR IGNORE INTO users (username, password_hash, full_name, role, status)
                            VALUES ('operations', ?, 'Operations Manager', 'operations_manager', 'active')
                        `, [password], (err) => {
                            if (err) {
                                console.error('Error creating operations manager user:', err);
                            } else {
                                console.log('✓ Sample operations manager user created');
                                console.log('\n📋 Login credentials:');
                                console.log('   Username: operations');
                                console.log('   Password: operations123');
                            }
                            
                            console.log('\n✅ Migration completed successfully!');
                            console.log('\n📝 Summary:');
                            console.log('   - Added "operations_manager" role to users table');
                            console.log('   - Created session_confirmations table');
                            console.log('   - Created sample operations manager user');
                            console.log('\n🔐 Operations Manager Permissions:');
                            console.log('   ✓ View students (read-only)');
                            console.log('   ✓ View attendance page (read-only)');
                            console.log('   ✓ Access session confirmations page');
                            console.log('   ✓ Call students to confirm sessions');
                            console.log('   ✓ Mark students as confirmed/not confirmed');
                            console.log('   ✓ Add confirmation notes');
                            console.log('   ✗ Cannot edit students');
                            console.log('   ✗ Cannot mark attendance');
                            console.log('   ✗ Cannot access dashboard');
                            console.log('   ✗ Cannot manage cash/payments');
                            
                            db.close();
                        });
                    });
                });
            });
        });
    });
});
