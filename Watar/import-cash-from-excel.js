const xlsx = require('xlsx');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = process.argv[2] || 'wattar.db';
const EXCEL_PATH = 'Attendance .xlsx';
const CUTOFF_DATE = '2026-03-10'; // Don't import on or after this date

console.log(`Importing cash transactions from "${EXCEL_PATH}" into "${DB_PATH}"...`);
console.log(`Only importing transactions BEFORE ${CUTOFF_DATE}`);

const db = new sqlite3.Database(DB_PATH);
const wb = xlsx.readFile(EXCEL_PATH);
const ws = wb.Sheets['Cash statment '];
const rows = xlsx.utils.sheet_to_json(ws, { header: 1 });

function excelDateToStr(serial) {
    if (!serial || typeof serial !== 'number') return null;
    const epoch = new Date(1899, 11, 30);
    const d = new Date(epoch.getTime() + serial * 86400000);
    return d.toISOString().split('T')[0];
}

// Category code mapping
function mapCode(code, type) {
    code = code.toString().trim();
    
    if (type === 'income') {
        if (code === 'CA') return 'MGR_CASH';  // Manager Cash income
        if (code === 'B') return 'BA';           // Typo -> Band
    }
    
    if (type === 'expense') {
        // Instrument codes used as expense = Manager Cash
        const instrumentCodes = ['BA', 'SI', 'D', 'G', 'P', 'V', 'VO'];
        if (instrumentCodes.includes(code)) return 'CA';
    }
    
    return code;
}

// Skip junk codes
const SKIP_CODES = ['1370284'];

let currentDate = null;
const transactions = [];
let skippedDate = 0;
let skippedJunk = 0;

for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r || r.length === 0) continue;
    if (r[14]) currentDate = excelDateToStr(r[14]);
    if (!currentDate) continue;
    if (currentDate >= CUTOFF_DATE) { skippedDate++; continue; }

    // Expense (col 4=amount, 5=desc, 6=code)
    if (r[4] && typeof r[4] === 'number' && r[4] > 0) {
        const rawCode = (r[6] || '').toString().trim();
        const desc = (r[5] || '').toString().trim();
        if (!rawCode || !desc || desc.startsWith('....') || SKIP_CODES.includes(rawCode)) {
            if (SKIP_CODES.includes(rawCode)) skippedJunk++;
            continue;
        }
        const code = mapCode(rawCode, 'expense');
        transactions.push([currentDate, 'expense', r[4], code, desc, (r[12] || '').toString().trim() || null]);
    }

    // Income (col 7=amount, 8=desc, 10=code)
    if (r[7] && typeof r[7] === 'number' && r[7] > 0) {
        const rawCode = (r[10] || '').toString().trim();
        const desc = (r[8] || '').toString().trim();
        if (!rawCode || !desc || desc.startsWith('....') || SKIP_CODES.includes(rawCode)) {
            if (SKIP_CODES.includes(rawCode)) skippedJunk++;
            continue;
        }
        const code = mapCode(rawCode, 'income');
        transactions.push([currentDate, 'income', r[7], code, desc, (r[12] || '').toString().trim() || null]);
    }
}

console.log(`\nFound ${transactions.length} transactions to import.`);
console.log(`Skipped: ${skippedDate} (after cutoff), ${skippedJunk} (junk codes)`);
if (transactions.length > 0) {
    console.log(`Date range: ${transactions[0][0]} to ${transactions[transactions.length-1][0]}`);
}

console.log('\nSample:');
transactions.slice(0, 5).forEach((t, i) => console.log(`  ${i+1}. ${t.join(' | ')}`));

const codes = [...new Set(transactions.map(t => t[3]))];
console.log('\nFinal category codes:', codes.join(', '));

// Insert with transaction for speed
db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    const stmt = db.prepare('INSERT INTO cash_transactions (transaction_date, type, amount, category_code, description, reference_number, created_by) VALUES (?, ?, ?, ?, ?, ?, 1)');
    
    transactions.forEach(t => stmt.run(t[0], t[1], t[2], t[3], t[4], t[5]));

    stmt.finalize();
    db.run('COMMIT', () => {
        console.log(`\n✅ Inserted ${transactions.length} transactions.`);
        
        db.all('SELECT type, category_code, COUNT(*) as count, ROUND(SUM(amount),2) as total FROM cash_transactions GROUP BY type, category_code ORDER BY type, category_code', (err, summary) => {
            if (!err && summary) {
                console.log('\nSummary by category:');
                summary.forEach(s => console.log(`  ${s.type} | ${s.category_code} | ${s.count} txns | ${s.total}`));
            }
            db.get('SELECT COUNT(*) as c FROM cash_transactions', (e, r) => {
                console.log('\nTotal transactions in DB:', r.c);
                db.close(() => process.exit(0));
            });
        });
    });
});
