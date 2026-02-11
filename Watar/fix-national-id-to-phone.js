const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('wattar.db');

console.log('Updating national_id values to phone numbers...');

// Move national_id values to phone field where phone is empty
db.serialize(() => {
    // First, let's see what we have
    db.all("SELECT id, name, national_id, phone FROM students WHERE national_id IS NOT NULL LIMIT 10", (err, samples) => {
        if (err) {
            console.error('Error fetching samples:', err);
            return;
        }
        
        console.log('Sample data before update:');
        samples.forEach(student => {
            console.log(`${student.name}: National ID: ${student.national_id}, Phone: ${student.phone || 'NULL'}`);
        });
        
        // Update: Move national_id to phone where phone is empty, then clear national_id
        db.run(`
            UPDATE students 
            SET phone = national_id, 
                national_id = NULL 
            WHERE phone IS NULL OR phone = '' OR phone = 'N/A'
        `, function(err) {
            if (err) {
                console.error('Error updating records:', err);
                return;
            }
            
            console.log(`\n✓ Updated ${this.changes} student records`);
            console.log('✓ Moved national_id values to phone field');
            console.log('✓ Cleared national_id field');
            
            // Show sample after update
            db.all("SELECT id, name, national_id, phone FROM students WHERE phone IS NOT NULL LIMIT 10", (err, updatedSamples) => {
                if (err) {
                    console.error('Error fetching updated samples:', err);
                    return;
                }
                
                console.log('\nSample data after update:');
                updatedSamples.forEach(student => {
                    console.log(`${student.name}: National ID: ${student.national_id || 'NULL'}, Phone: ${student.phone}`);
                });
                
                console.log('\n🎉 Data migration completed successfully!');
                console.log('Now students will show phone numbers instead of national IDs.');
                
                db.close();
            });
        });
    });
});