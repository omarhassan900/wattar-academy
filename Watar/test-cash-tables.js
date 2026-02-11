const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./wattar.db');

console.log('Checking cash tables...\n');

db.all("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'cash%'", (err, tables) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('Cash tables found:', tables.map(t => t.name));
    }
    
    // Check categories
    db.all('SELECT * FROM cash_categories ORDER BY type, name', (err, categories) => {
        if (err) {
            console.error('Error fetching categories:', err);
        } else {
            console.log('\nCategories:');
            console.log('Income categories:', categories.filter(c => c.type === 'income').map(c => `${c.code} - ${c.name}`));
            console.log('Expense categories:', categories.filter(c => c.type === 'expense').map(c => `${c.code} - ${c.name}`));
        }
        
        // Check transactions count
        db.get('SELECT COUNT(*) as count FROM cash_transactions', (err, result) => {
            if (err) {
                console.error('Error counting transactions:', err);
            } else {
                console.log('\nTotal transactions:', result.count);
            }
            db.close();
        });
    });
});
