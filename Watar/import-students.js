const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const db = new sqlite3.Database('wattar.db');

// Function to parse date from various formats
function parseDate(dateStr) {
    if (!dateStr || dateStr.trim() === '') return null;
    
    dateStr = dateStr.trim();
    
    let day, month, year;
    
    // Format: 6/7/2022 or 7/2/2023
    if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            day = parseInt(parts[0]);
            month = parseInt(parts[1]);
            year = parseInt(parts[2]);
        }
    }
    // Format: 21-9-23 or 15-7-2023
    else if (dateStr.includes('-')) {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            day = parseInt(parts[0]);
            month = parseInt(parts[1]);
            year = parseInt(parts[2]);
            
            // Handle 2-digit years
            if (year < 100) {
                year = year > 50 ? 1900 + year : 2000 + year;
            }
        }
    }
    
    if (day && month && year && year > 1900 && year < 2030) {
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
    
    return null;
}

// Function to clean student name
function cleanName(name) {
    if (!name) return '';
    return name.replace(/\s+00\s*$/, '')
               .replace(/\s*\?\s*/, '')
               .trim();
}

console.log('Starting student data import from CSV...');
console.log('Reading file: Copy of Attendance  (1).csv\n');

// Read the CSV file as text and parse manually
fs.readFile('Copy of Attendance  (1).csv', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading CSV file:', err);
        console.log('Make sure the file "Copy of Attendance  (1).csv" exists in the current directory.');
        db.close();
        return;
    }
    
    const lines = data.split('\n');
    const students = [];
    
    console.log(`Found ${lines.length} lines in CSV file`);
    
    // Skip the header line (index 0) and process data lines
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Split by comma, but handle quoted fields
        const columns = line.split(',');
        
        if (columns.length < 4) continue;
        
        const studentId = columns[0] ? columns[0].trim() : '';
        const studentName = columns[1] ? cleanName(columns[1]) : '';
        const nationalId = columns[2] ? columns[2].trim() : '';
        const startDate = columns[3] ? parseDate(columns[3]) : null;
        
        // Skip if essential data is missing
        if (!studentName || !startDate) {
            continue;
        }
        
        const student = {
            id: studentId,
            name: studentName,
            national_id: nationalId || null,
            start_date: startDate,
            current_level: 'Level One', // Default level
            status: 'active'
        };
        
        students.push(student);
        console.log(`✓ Found student ${students.length}: ${student.name} (ID: ${student.national_id}, Start: ${student.start_date})`);
    }
    
    console.log(`\n=== Parsing Complete ===`);
    console.log(`Valid students found: ${students.length}`);
    
    if (students.length === 0) {
        console.log('No valid students found to import.');
        db.close();
        return;
    }
    
    console.log('\n=== Starting Database Import ===');
    
    // Import students to database
    const stmt = db.prepare(`
        INSERT OR REPLACE INTO students (name, national_id, start_date, current_level, status, created_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
    `);
    
    let imported = 0;
    let errors = 0;
    
    students.forEach((student, index) => {
        stmt.run([
            student.name,
            student.national_id,
            student.start_date,
            student.current_level,
            student.status
        ], function(err) {
            if (err) {
                console.error(`✗ Error importing ${student.name}:`, err.message);
                errors++;
            } else {
                imported++;
                console.log(`✓ Imported: ${student.name}`);
            }
            
            // Check if this is the last student
            if (index === students.length - 1) {
                stmt.finalize();
                
                console.log(`\n=== Import Summary ===`);
                console.log(`Total students processed: ${students.length}`);
                console.log(`Successfully imported: ${imported}`);
                console.log(`Errors: ${errors}`);
                
                // Verify the import
                db.get("SELECT COUNT(*) as count FROM students WHERE status = 'active'", (err, result) => {
                    if (err) {
                        console.error('Error verifying import:', err);
                    } else {
                        console.log(`\n✓ Total active students in database: ${result.count}`);
                        console.log('\n🎉 Import completed successfully!');
                        console.log('You can now refresh your browser to see the imported students.');
                        console.log('Visit: http://localhost:3000/students');
                    }
                    db.close();
                });
            }
        });
    });
});