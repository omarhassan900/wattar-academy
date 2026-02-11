const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./wattar.db');

console.log('Adding biography fields to students table...');

// Add new columns to students table
const alterations = [
    "ALTER TABLE students ADD COLUMN address TEXT",
    "ALTER TABLE students ADD COLUMN date_of_birth DATE",
    "ALTER TABLE students ADD COLUMN emergency_contact VARCHAR(100)",
    "ALTER TABLE students ADD COLUMN emergency_phone VARCHAR(20)",
    "ALTER TABLE students ADD COLUMN instrument VARCHAR(50)"
];

let completed = 0;

alterations.forEach((sql, index) => {
    db.run(sql, (err) => {
        if (err) {
            // Column might already exist, that's okay
            console.log(`Column ${index + 1}: Already exists or error - ${err.message}`);
        } else {
            console.log(`Column ${index + 1}: Added successfully`);
        }
        
        completed++;
        if (completed === alterations.length) {
            console.log('\n✅ Biography fields migration completed!');
            db.close();
        }
    });
});
