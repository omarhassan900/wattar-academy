const sqlite3 = require('sqlite3').verbose();
const XLSX = require('xlsx');

const USE_AWS = process.argv.includes('--aws');
const DB_PATH = USE_AWS ? 'wattar_production.db' : 'wattar.db';

console.log('=== Student Data Verification ===');
console.log(`Database: ${DB_PATH}\n`);

const db = new sqlite3.Database(DB_PATH);

// Read Excel file
const workbook = XLSX.readFile('Contact Information (Responses).xlsx');
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const excelData = XLSX.utils.sheet_to_json(worksheet);

console.log(`Excel file has ${excelData.length} students\n`);

// Get database stats
db.all(`
    SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN trainer_id = 1 THEN 1 ELSE 0 END) as fady_students,
        SUM(CASE WHEN trainer_id = 2 THEN 1 ELSE 0 END) as tema_students,
        SUM(CASE WHEN trainer_id = 3 THEN 1 ELSE 0 END) as romario_students,
        SUM(CASE WHEN trainer_id IS NULL THEN 1 ELSE 0 END) as unassigned
    FROM students
`, (err, stats) => {
    if (err) {
        console.error('Error:', err);
        db.close();
        return;
    }
    
    const s = stats[0];
    console.log('=== Database Statistics ===');
    console.log(`Total students: ${s.total}`);
    console.log(`Active students: ${s.active}`);
    console.log(`\nTrainer Distribution:`);
    console.log(`  Fady (Piano/Vocal): ${s.fady_students}`);
    console.log(`  Tema (Guitar): ${s.tema_students}`);
    console.log(`  Romario (Violin): ${s.romario_students}`);
    console.log(`  Unassigned: ${s.unassigned}`);
    
    // Check for students from Excel file
    console.log('\n=== Checking Excel Students in Database ===');
    
    let found = 0;
    let missing = 0;
    const missingList = [];
    
    excelData.forEach((row, index) => {
        const phone = row['Phone number'] ? row['Phone number'].toString().replace(/[\s-]/g, '') : '';
        const name = row['Full Name'] || '';
        
        if (!phone) return;
        
        db.get('SELECT id, name, trainer_id, instrument FROM students WHERE phone = ?', [phone], (err, student) => {
            if (student) {
                found++;
                console.log(`✓ ${name} - Found (Trainer: ${student.trainer_id || 'None'}, Instrument: ${student.instrument || 'None'})`);
            } else {
                missing++;
                missingList.push(name);
                console.log(`✗ ${name} - NOT FOUND`);
            }
            
            // Last iteration
            if (index === excelData.length - 1) {
                setTimeout(() => {
                    console.log('\n=== Verification Summary ===');
                    console.log(`Students from Excel found in DB: ${found}/${excelData.length}`);
                    console.log(`Missing students: ${missing}`);
                    
                    if (missing > 0) {
                        console.log('\n⚠️  Missing students:');
                        missingList.forEach(name => console.log(`  - ${name}`));
                    }
                    
                    // Check for students without trainers
                    db.all('SELECT name, instrument FROM students WHERE trainer_id IS NULL AND status = "active"', (err, unassigned) => {
                        if (unassigned && unassigned.length > 0) {
                            console.log('\n⚠️  Students without assigned trainers:');
                            unassigned.forEach(s => console.log(`  - ${s.name} (${s.instrument || 'No instrument'})`));
                            console.log('\n💡 Tip: Assign trainers manually in the web interface');
                        }
                        
                        console.log('\n=== Verification Complete ===');
                        
                        if (found === excelData.length && s.unassigned === 0) {
                            console.log('✅ All students imported successfully with trainers assigned!');
                        } else if (found === excelData.length) {
                            console.log('✅ All students imported, but some need trainer assignment');
                        } else {
                            console.log('⚠️  Some students may need attention');
                        }
                        
                        db.close();
                    });
                }, 1000);
            }
        });
    });
});
