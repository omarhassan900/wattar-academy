const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('wattar.db');

console.log('Fixing attendance date bug - ensuring date column exists in attendance table...');

db.serialize(() => {
    // Check if date column exists in attendance table
    db.all("PRAGMA table_info(attendance)", (err, columns) => {
        if (err) {
            console.error('Error checking attendance table:', err);
            db.close();
            return;
        }
        
        const hasDateColumn = columns.some(col => col.name === 'date');
        
        if (!hasDateColumn) {
            console.log('Adding date column to attendance table...');
            db.run(`ALTER TABLE attendance ADD COLUMN date DATE`, (err) => {
                if (err) {
                    console.error('Error adding date column:', err.message);
                } else {
                    console.log('✓ Added date column to attendance table');
                }
                
                // Migrate existing data: copy session_date from sessions to attendance.date
                console.log('Migrating existing session dates to attendance records...');
                db.run(`
                    UPDATE attendance 
                    SET date = (
                        SELECT session_date 
                        FROM sessions 
                        WHERE sessions.id = attendance.session_id
                    )
                    WHERE date IS NULL AND session_id IS NOT NULL
                `, (err) => {
                    if (err) {
                        console.error('Error migrating dates:', err.message);
                    } else {
                        console.log('✓ Migrated existing session dates to attendance records');
                    }
                    
                    console.log('\n✅ Fix completed successfully!');
                    console.log('\nWhat was fixed:');
                    console.log('- Added date column to attendance table');
                    console.log('- Dates are now stored per student/session (not shared across all students)');
                    console.log('- Each student can have different dates for the same session number');
                    console.log('\nYou can now restart your application.');
                    
                    db.close();
                });
            });
        } else {
            console.log('✓ Date column already exists in attendance table');
            
            // Still migrate any NULL dates
            console.log('Checking for any NULL dates to migrate...');
            db.run(`
                UPDATE attendance 
                SET date = (
                    SELECT session_date 
                    FROM sessions 
                    WHERE sessions.id = attendance.session_id
                )
                WHERE date IS NULL AND session_id IS NOT NULL
            `, (err) => {
                if (err) {
                    console.error('Error migrating dates:', err.message);
                } else {
                    console.log('✓ Migrated any NULL dates');
                }
                
                console.log('\n✅ Fix completed successfully!');
                db.close();
            });
        }
    });
});
