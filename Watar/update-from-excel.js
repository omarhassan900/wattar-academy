const xlsx = require('xlsx');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./wattar.db');

// Read Excel file
const workbook = xlsx.readFile('Contact Information (Responses) (1).xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);

// Convert Excel serial date to YYYY-MM-DD
function excelDateToISO(serial) {
    if (!serial) return null;
    if (typeof serial === 'string') return serial; // already a date string
    const utcDays = Math.floor(serial - 25569);
    const date = new Date(utcDays * 86400 * 1000);
    return date.toISOString().split('T')[0];
}

console.log(`Found ${data.length} records in Excel\n`);

let matched = 0;
let notFound = 0;
let updated = 0;

function processRow(index) {
    if (index >= data.length) {
        console.log(`\n--- Summary ---`);
        console.log(`Total Excel records: ${data.length}`);
        console.log(`Matched: ${matched}`);
        console.log(`Updated: ${updated}`);
        console.log(`Not found: ${notFound}`);
        db.close();
        return;
    }

    const row = data[index];
    const phone = row['Phone number'] ? String(row['Phone number']).trim() : null;
    const name = row['Full Name'] ? String(row['Full Name']).trim() : null;
    const address = row['Address'] ? String(row['Address']).trim() : null;
    const dob = excelDateToISO(row['Date of birth']);
    const emergencyContact = row['Emergency Contact'] ? String(row['Emergency Contact']).trim() : null;
    const parentPhone = row['Parent Phone'] ? String(row['Parent Phone']).trim() : null;

    if (!phone) {
        console.log(`Skipping row ${index + 1}: no phone number`);
        processRow(index + 1);
        return;
    }

    // Match by phone number
    db.get(`SELECT id, name, phone, address, date_of_birth FROM students WHERE phone = ?`, [phone], (err, student) => {
        if (err) {
            console.error(`Error looking up ${phone}:`, err);
            processRow(index + 1);
            return;
        }

        if (!student) {
            console.log(`✗ Not found: ${name} (${phone})`);
            notFound++;
            processRow(index + 1);
            return;
        }

        matched++;

        // Build update query
        const updates = [];
        const params = [];

        if (address && !student.address) {
            updates.push('address = ?');
            params.push(address);
        }
        if (dob && !student.date_of_birth) {
            updates.push('date_of_birth = ?');
            params.push(dob);
        }
        if (emergencyContact) {
            updates.push('emergency_contact = ?');
            params.push(emergencyContact);
        }
        if (parentPhone) {
            updates.push('parent_phone = ?');
            params.push(parentPhone);
        }

        if (updates.length === 0) {
            console.log(`- ${student.name}: already has data, skipping`);
            processRow(index + 1);
            return;
        }

        params.push(student.id);
        const sql = `UPDATE students SET ${updates.join(', ')} WHERE id = ?`;

        db.run(sql, params, function(err) {
            if (err) {
                console.error(`Error updating ${student.name}:`, err);
            } else {
                updated++;
                console.log(`✓ Updated ${student.name}: ${updates.map(u => u.split(' =')[0]).join(', ')}`);
            }
            processRow(index + 1);
        });
    });
}

processRow(0);
