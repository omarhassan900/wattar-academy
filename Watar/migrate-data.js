const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const csv = require('csv-parser');

const db = new sqlite3.Database('wattar.db');

// Sample data based on your CSV - you can modify this
const studentsData = [
    { name: 'shahd shady', national_id: '1211144569', start_date: '2022-07-06', level: 'Level One' },
    { name: 'abdelrahman', national_id: '1289606188', start_date: '2023-07-06', level: 'Level One' },
    { name: 'farida zaki', national_id: '1020534631', start_date: '2023-02-07', level: 'Level Two' },
    { name: 'ziad feisal', national_id: '1063797923', start_date: '2023-03-18', level: 'Level Three' },
    { name: 'ward mohamed', national_id: '1014482799', start_date: '2023-07-15', level: 'Level One' },
    { name: 'fayrouz mohamed', national_id: '1281731363', start_date: '2023-08-12', level: 'Level One' },
    { name: 'rabaa mohamed', national_id: '1091536741', start_date: '2023-09-21', level: 'Level Four' },
    { name: 'fatma mahmoud', national_id: '1122299256', start_date: '2023-09-21', level: 'Level Two' },
    { name: 'tarek ahmed', national_id: '1152849540', start_date: '2023-09-30', level: 'Level One' },
    { name: 'farida ahmed', national_id: '1101587032', start_date: '2023-02-07', level: 'Level Five' },
    { name: 'aryam ahmed', national_id: '1093734464', start_date: '2022-06-07', level: 'Level Three' },
    { name: 'nada abdelaziz', national_id: '1095149676', start_date: '2022-06-01', level: 'Level Four' },
    { name: 'yasmein khaled', national_id: '1093975551', start_date: '2022-06-02', level: 'Level Four' },
    { name: 'jana osama', national_id: '1117316816', start_date: '2022-02-08', level: 'Level Two' },
    { name: 'malak mohamed', national_id: '1067551001', start_date: '2022-01-01', level: 'Level Five' },
    { name: 'hagar khalad', national_id: '1128581375', start_date: '2024-01-14', level: 'Level Three' },
    { name: 'malik ahmed', national_id: '1001523736', start_date: '2024-01-20', level: 'Level Two' },
    { name: 'karin kamal', national_id: '1151903424', start_date: '2024-01-28', level: 'Level One' },
    { name: 'maya mohamed', national_id: '1151903424', start_date: '2024-01-28', level: 'Level One' },
    { name: 'hana amr', national_id: '1094616691', start_date: '2024-02-10', level: 'Level Three' }
];

console.log('Starting data migration...');

// Insert students
const stmt = db.prepare("INSERT OR IGNORE INTO students (name, national_id, start_date, level) VALUES (?, ?, ?, ?)");

studentsData.forEach(student => {
    stmt.run(student.name, student.national_id, student.start_date, student.level);
});

stmt.finalize();

console.log(`Migrated ${studentsData.length} students to the database.`);
console.log('Migration completed successfully!');

db.close();