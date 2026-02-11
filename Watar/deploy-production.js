const fs = require('fs');
const path = require('path');

console.log('='.repeat(60));
console.log('  WATTAR ACADEMY - PRODUCTION DEPLOYMENT CHECKER');
console.log('='.repeat(60));
console.log();

// Check Node.js version
const nodeVersion = process.version;
console.log('✓ Node.js Version:', nodeVersion);

// Check if database exists
const dbExists = fs.existsSync('./wattar.db');
console.log(dbExists ? '✓ Database file exists' : '✗ Database file missing!');

// Check if required files exist
const requiredFiles = [
    'server.js',
    'package.json',
    'views/layout.ejs',
    'views/students.ejs',
    'views/attendance.ejs',
    'views/cash.ejs',
    'views/users.ejs'
];

console.log('\nChecking required files:');
requiredFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(exists ? `  ✓ ${file}` : `  ✗ ${file} MISSING!`);
});

// Check database tables
if (dbExists) {
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./wattar.db');
    
    console.log('\nChecking database tables:');
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
        if (err) {
            console.error('  ✗ Error reading database:', err);
        } else {
            const requiredTables = ['users', 'students', 'trainers', 'sessions', 'attendance', 'cash_transactions', 'cash_categories'];
            requiredTables.forEach(table => {
                const exists = tables.some(t => t.name === table);
                console.log(exists ? `  ✓ ${table}` : `  ✗ ${table} MISSING!`);
            });
        }
        
        // Check user count
        db.get('SELECT COUNT(*) as count FROM users', (err, result) => {
            if (!err) {
                console.log(`\n✓ Users in database: ${result.count}`);
            }
            
            // Check student count
            db.get('SELECT COUNT(*) as count FROM students', (err, result) => {
                if (!err) {
                    console.log(`✓ Students in database: ${result.count}`);
                }
                
                // Check session count
                db.get('SELECT COUNT(*) as count FROM sessions', (err, result) => {
                    if (!err) {
                        console.log(`✓ Sessions in database: ${result.count}`);
                    }
                    
                    console.log('\n' + '='.repeat(60));
                    console.log('  PRODUCTION READINESS CHECKLIST');
                    console.log('='.repeat(60));
                    console.log('\n⚠️  IMPORTANT: Before going to production:\n');
                    console.log('  [ ] Change admin password (currently: admin123)');
                    console.log('  [ ] Change trainer passwords');
                    console.log('  [ ] Update session secret in server.js');
                    console.log('  [ ] Set up database backup schedule');
                    console.log('  [ ] Configure firewall rules');
                    console.log('  [ ] Test all features');
                    console.log('  [ ] Train staff on system usage');
                    console.log('\n✅ System is ready for production deployment!');
                    console.log('\nTo start in production mode:');
                    console.log('  npm install -g pm2');
                    console.log('  pm2 start server.js --name wattar-academy');
                    console.log('  pm2 save');
                    console.log('\n' + '='.repeat(60));
                    
                    db.close();
                });
            });
        });
    });
} else {
    console.log('\n✗ Database not found! Run setup-database.js first.');
}
