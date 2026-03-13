const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./wattar.db');

console.log('Attempting to recover student data...\n');

db.serialize(() => {
    // Create a backup first
    db.run(`ATTACH DATABASE 'wattar-before-recovery.db' AS backup`, (err) => {
        if (err) {
            console.error('Error attaching backup:', err);
            return;
        }
        
        db.run(`CREATE TABLE backup.students AS SELECT * FROM students`, (err) => {
            if (err) {
                console.error('Error creating backup:', err);
            } else {
                console.log('✓ Backup created: wattar-before-recovery.db');
            }
            
            db.run(`DETACH DATABASE backup`, () => {
                // Now let's analyze and fix the data
                console.log('\nAnalyzing current data structure...');
                
                db.all(`SELECT * FROM students LIMIT 5`, (err, rows) => {
                    if (err) {
                        console.error('Error:', err);
                        return;
                    }
                    
                    console.log('\nSample of corrupted data:');
                    rows.forEach((row, i) => {
                        console.log(`\nStudent ${i + 1}:`);
                        console.log(`  name: ${row.name}`);
                        console.log(`  phone: ${row.phone}`);
                        console.log(`  instrument (corrupted): ${row.instrument}`);
                        console.log(`  emergency_phone (has instrument?): ${row.emergency_phone}`);
                        console.log(`  address (corrupted): ${row.address}`);
                    });
                    
                    // The fix: emergency_phone actually contains the instrument
                    console.log('\n\nAttempting to fix by moving emergency_phone to instrument...');
                    
                    db.run(`
                        UPDATE students 
                        SET instrument = emergency_phone,
                            emergency_phone = NULL,
                            address = NULL,
                            date_of_birth = NULL
                        WHERE emergency_phone IS NOT NULL 
                        AND (instrument LIKE '2026-%' OR instrument LIKE '202%')
                    `, function(err) {
                        if (err) {
                            console.error('Error fixing data:', err);
                        } else {
                            console.log(`✓ Fixed ${this.changes} student records`);
                            
                            // Verify the fix
                            db.all(`SELECT name, phone, instrument, emergency_phone FROM students LIMIT 5`, (err, fixed) => {
                                if (err) {
                                    console.error('Error:', err);
                                } else {
                                    console.log('\nFixed data sample:');
                                    fixed.forEach((row, i) => {
                                        console.log(`${i + 1}. ${row.name} - Instrument: ${row.instrument}`);
                                    });
                                }
                                
                                db.close();
                            });
                        }
                    });
                });
            });
        });
    });
});
