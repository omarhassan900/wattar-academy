const sqlite3 = require('sqlite3').verbose();
const XLSX = require('xlsx');
const fs = require('fs');

// Configuration - UPDATE THESE FOR AWS
const USE_AWS = process.argv.includes('--aws');
const DB_PATH = 'wattar.db'; // Same database name for both local and AWS

console.log('=== Wattar Academy Student Data Update ===');
console.log(`Mode: ${USE_AWS ? 'AWS PRODUCTION' : 'LOCAL TEST'}`);
console.log(`Database: ${DB_PATH}\n`);

// Read the Excel file
console.log('Reading student data from: Contact Information (Responses).xlsx');
const workbook = XLSX.readFile('Contact Information (Responses).xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log(`Found ${data.length} rows in Excel file\n`);

// Helper function to parse Excel date
function parseExcelDate(excelDate) {
    if (!excelDate) return null;
    if (typeof excelDate === 'string') return excelDate;
    
    // Excel dates are days since 1900-01-01
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Helper function to map instrument to trainer
function getTrainerForInstrument(instrument) {
    if (!instrument) return null;
    const inst = instrument.toLowerCase();
    
    if (inst.includes('piano') || inst.includes('vocal')) return 1; // Fady
    if (inst.includes('guitar')) return 2; // Tema
    if (inst.includes('violin')) return 3; // Romario
    
    return null; // Will need manual assignment
}

// Parse and validate student data
const students = [];
data.forEach((row, index) => {
    const student = {
        name: row['Full Name'] || '',
        phone: row['Phone number'] || '',
        parent_phone: row['Parent Phone'] || row['Emergency Contact'] || '',
        email: row['Email'] || '',
        address: row['Address'] || '',
        date_of_birth: parseExcelDate(row['Date of birth']),
        instrument: row['Instrument'] || '',
        level: 'Month 1', // Default level for new students
        trainer_id: getTrainerForInstrument(row['Instrument']),
        start_date: new Date().toISOString().split('T')[0], // Today's date
        notes: ''
    };
    
    // Clean phone numbers (remove spaces, dashes)
    if (student.phone) {
        student.phone = student.phone.toString().replace(/[\s-]/g, '');
    }
    if (student.parent_phone) {
        student.parent_phone = student.parent_phone.toString().replace(/[\s-]/g, '');
    }
    
    // Only add if we have at least a name and phone
    if (student.name && student.phone) {
        students.push(student);
        console.log(`✓ Row ${index + 1}: ${student.name} - ${student.phone} - ${student.instrument}`);
    } else {
        console.log(`⚠ Row ${index + 1}: Skipped (missing name or phone)`);
    }
});

console.log(`\n=== Validation Complete ===`);
console.log(`Valid students: ${students.length}`);

if (students.length === 0) {
    console.log('No valid students found. Exiting.');
    process.exit(0);
}

// Connect to database
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    }
    console.log('\n✓ Connected to database');
});

// Create backup
function createBackup() {
    return new Promise((resolve, reject) => {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = `backup_students_${timestamp}.json`;
        
        db.all('SELECT * FROM students', (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            
            fs.writeFileSync(backupFile, JSON.stringify(rows, null, 2));
            console.log(`✓ Backup created: ${backupFile}`);
            console.log(`  (${rows.length} students backed up)\n`);
            resolve();
        });
    });
}

// Update or insert students
async function updateStudents() {
    try {
        await createBackup();
        
        console.log('=== Starting Student Updates ===\n');
        
        let updated = 0;
        let inserted = 0;
        let errors = 0;
        
        for (const student of students) {
            try {
                // Check if student exists by phone number
                const existing = await new Promise((resolve, reject) => {
                    db.get(
                        'SELECT id FROM students WHERE phone = ? OR parent_phone = ?',
                        [student.phone, student.phone],
                        (err, row) => {
                            if (err) reject(err);
                            else resolve(row);
                        }
                    );
                });
                
                if (existing) {
                    // Update existing student
                    await new Promise((resolve, reject) => {
                        db.run(`
                            UPDATE students 
                            SET name = ?,
                                phone = ?,
                                parent_phone = ?,
                                email = ?,
                                address = ?,
                                date_of_birth = ?,
                                instrument = ?,
                                current_level = ?,
                                trainer_id = ?,
                                notes = ?,
                                updated_at = datetime('now')
                            WHERE id = ?
                        `, [
                            student.name,
                            student.phone,
                            student.parent_phone,
                            student.email,
                            student.address,
                            student.date_of_birth,
                            student.instrument,
                            student.level,
                            student.trainer_id,
                            student.notes,
                            existing.id
                        ], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    });
                    
                    updated++;
                    console.log(`✓ Updated: ${student.name}`);
                } else {
                    // Insert new student
                    await new Promise((resolve, reject) => {
                        db.run(`
                            INSERT INTO students (
                                name, phone, parent_phone, email, address,
                                date_of_birth, instrument, current_level, trainer_id,
                                start_date, notes, status, created_at
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', datetime('now'))
                        `, [
                            student.name,
                            student.phone,
                            student.parent_phone,
                            student.email,
                            student.address,
                            student.date_of_birth,
                            student.instrument,
                            student.level,
                            student.trainer_id,
                            student.start_date,
                            student.notes
                        ], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    });
                    
                    inserted++;
                    console.log(`✓ Inserted: ${student.name}`);
                }
            } catch (err) {
                errors++;
                console.error(`✗ Error processing ${student.name}:`, err.message);
            }
        }
        
        console.log(`\n=== Update Summary ===`);
        console.log(`Total processed: ${students.length}`);
        console.log(`Updated: ${updated}`);
        console.log(`Inserted: ${inserted}`);
        console.log(`Errors: ${errors}`);
        
        // Final count
        const total = await new Promise((resolve, reject) => {
            db.get("SELECT COUNT(*) as count FROM students WHERE status = 'active'", (err, row) => {
                if (err) reject(err);
                else resolve(row.count);
            });
        });
        
        console.log(`\nTotal active students in database: ${total}`);
        console.log('\n✅ Update completed successfully!');
        
        if (USE_AWS) {
            console.log('\n⚠️  PRODUCTION UPDATE COMPLETE');
            console.log('Please verify the changes on your AWS deployment.');
        } else {
            console.log('\n💡 This was a LOCAL TEST run.');
            console.log('To update AWS production, run: node update-students-aws.js --aws');
        }
        
    } catch (err) {
        console.error('\n❌ Error during update:', err);
    } finally {
        db.close();
    }
}

// Run the update
updateStudents();
