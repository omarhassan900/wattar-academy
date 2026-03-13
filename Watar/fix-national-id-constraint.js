const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./wattar.db');

console.log('Fixing national_id constraint issue...\n');

db.serialize(() => {
    // Step 1: Update all empty national_id values to NULL
    db.run(`UPDATE students SET national_id = NULL WHERE national_id = '' OR national_id IS NULL OR TRIM(national_id) = ''`, function(err) {
        if (err) {
            console.error('Error updating empty national_ids:', err);
        } else {
            console.log(`✓ Updated ${this.changes} empty national_id values to NULL`);
        }
        
        // Step 2: Check for actual duplicates (non-empty)
        db.all(`
            SELECT national_id, COUNT(*) as count 
            FROM students 
            WHERE national_id IS NOT NULL 
            GROUP BY national_id 
            HAVING count > 1
        `, (err, duplicates) => {
            if (err) {
                console.error('Error checking duplicates:', err);
            } else if (duplicates.length > 0) {
                console.log('\n⚠️  Found duplicate national IDs:');
                duplicates.forEach(dup => {
                    console.log(`  - ${dup.national_id}: ${dup.count} students`);
                });
                console.log('\nYou need to manually fix these duplicates before proceeding.');
            } else {
                console.log('✓ No duplicate national_ids found');
            }
            
            // Step 3: Recreate the table without UNIQUE constraint on national_id
            console.log('\n📝 Recreating students table without UNIQUE constraint...');
            
            db.run(`BEGIN TRANSACTION`, (err) => {
                if (err) {
                    console.error('Error starting transaction:', err);
                    return;
                }
                
                // Create new table without UNIQUE constraint
                db.run(`
                    CREATE TABLE students_new (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name VARCHAR(100) NOT NULL,
                        national_id VARCHAR(20),
                        phone VARCHAR(20),
                        parent_phone VARCHAR(20),
                        email VARCHAR(100),
                        start_date DATE NOT NULL,
                        current_level TEXT CHECK(current_level IN ('Level One', 'Level Two', 'Level Three', 'Level Four', 'Level Five', 'Level Six')) DEFAULT 'Level One',
                        status TEXT CHECK(status IN ('active', 'inactive', 'graduated')) DEFAULT 'active',
                        notes TEXT,
                        instrument VARCHAR(100),
                        address TEXT,
                        date_of_birth DATE,
                        emergency_contact VARCHAR(100),
                        emergency_phone VARCHAR(20),
                        trainer_id INTEGER,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                `, (err) => {
                    if (err) {
                        console.error('Error creating new table:', err);
                        db.run('ROLLBACK');
                        return;
                    }
                    
                    // Copy data from old table to new table
                    db.run(`
                        INSERT INTO students_new 
                        SELECT * FROM students
                    `, (err) => {
                        if (err) {
                            console.error('Error copying data:', err);
                            db.run('ROLLBACK');
                            return;
                        }
                        
                        // Drop old table
                        db.run(`DROP TABLE students`, (err) => {
                            if (err) {
                                console.error('Error dropping old table:', err);
                                db.run('ROLLBACK');
                                return;
                            }
                            
                            // Rename new table to students
                            db.run(`ALTER TABLE students_new RENAME TO students`, (err) => {
                                if (err) {
                                    console.error('Error renaming table:', err);
                                    db.run('ROLLBACK');
                                    return;
                                }
                                
                                // Commit transaction
                                db.run(`COMMIT`, (err) => {
                                    if (err) {
                                        console.error('Error committing:', err);
                                        return;
                                    }
                                    
                                    console.log('✓ Successfully recreated students table without UNIQUE constraint');
                                    console.log('✓ All data preserved');
                                    console.log('\n✅ Migration complete! You can now add students without national_id.');
                                    
                                    db.close();
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
