const XLSX = require('xlsx');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('wattar.db');

const wb = XLSX.readFile('final cahs.xlsx');
const ws = wb.Sheets['Cash statment '];
const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

// Excel serial to YYYY-MM-DD
function serialToDate(serial) {
    if (typeof serial !== 'number' || serial < 1) return null;
    const utc_days = Math.floor(serial - 25569);
    const d = new Date(utc_days * 86400 * 1000);
    return d.toISOString().split('T')[0];
}

// March 25 2026 = serial 46107 (we want >= 46107)
const CUTOFF = 46107;
let curDate = 0;
let transactions = [];

for (let i = 1; i < data.length; i++) {
    const r = data[i];
    if (r[14]) {
        if (typeof r[14] === 'number') {
            curDate = r[14];
        } else if (typeof r[14] === 'string') {
            // Try to parse string dates like "25/3/2026"
            curDate = r[14];
        }
    }
    if (!curDate || curDate < CUTOFF) continue;

    // Skip totals row
    if (r[4] > 100000) continue;

    // Income entry
    if (r[7] && typeof r[7] === 'number' && r[7] < 100000) {
        const dateStr = typeof curDate === 'number' ? serialToDate(curDate) : null;
        if (!dateStr) continue;
        transactions.push({
            type: 'income',
            amount: r[7],
            description: (r[8] || '').trim(),
            category_code: (r[10] || '').trim(),
            date: dateStr
        });
    }

    // Expense entry
    if (r[4] && typeof r[4] === 'number' && r[4] < 100000) {
        const dateStr = typeof curDate === 'number' ? serialToDate(curDate) : null;
        if (!dateStr) continue;
        transactions.push({
            type: 'expense',
            amount: r[4],
            description: (r[5] || '').trim(),
            category_code: (r[6] || '').trim(),
            date: dateStr
        });
    }
}

console.log(`Found ${transactions.length} transactions to import (after March 25)`);
console.log('\nPreview:');
transactions.forEach((t, i) => {
    console.log(`${i + 1}. [${t.date}] ${t.type} ${t.amount} - ${t.description} (${t.category_code})`);
});

console.log('\nImporting...');
const stmt = db.prepare(`
    INSERT INTO cash_transactions (type, amount, description, category_code, transaction_date, payment_method, created_by, created_at)
    VALUES (?, ?, ?, ?, ?, 'cash', 1, datetime('now'))
`);

let count = 0;
transactions.forEach(t => {
    stmt.run(t.type, t.amount, t.description, t.category_code, t.date, function(err) {
        if (err) console.error('Error:', err.message, t);
        else count++;
    });
});

stmt.finalize(() => {
    console.log(`\nDone! Imported ${count} transactions.`);
    db.close();
});
