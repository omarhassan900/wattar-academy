const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('wattar.db');

console.log('Setting up cash management system...');

// Create cash_transactions table
db.run(`
    CREATE TABLE IF NOT EXISTS cash_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_date DATE NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
        amount DECIMAL(10, 2) NOT NULL,
        category_code TEXT NOT NULL,
        description TEXT,
        payment_method TEXT,
        reference_number TEXT,
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
    )
`, (err) => {
    if (err) {
        console.error('Error creating cash_transactions table:', err);
    } else {
        console.log('✓ cash_transactions table created');
    }
});

// Create cash_categories table for predefined categories
db.run(`
    CREATE TABLE IF NOT EXISTS cash_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
        is_active INTEGER DEFAULT 1
    )
`, (err) => {
    if (err) {
        console.error('Error creating cash_categories table:', err);
    } else {
        console.log('✓ cash_categories table created');
        
        // Insert categories based on the provided codes
        const categories = [
            // Expense categories (OUT)
            { code: 'C', name: 'Cleaning', type: 'expense' },
            { code: 'T', name: 'Trainers', type: 'expense' },
            { code: 'R', name: 'Development & Repairing', type: 'expense' },
            { code: 'AR', name: 'Academy Rent', type: 'expense' },
            { code: 'S', name: 'Salaries', type: 'expense' },
            { code: 'CA', name: 'Manager Cash', type: 'expense' },
            { code: 'B', name: 'Buffet', type: 'expense' },
            { code: 'E', name: 'Electricity', type: 'expense' },
            { code: 'ST', name: 'Marketing Commission', type: 'expense' },
            
            // Income categories (IN)
            { code: 'P', name: 'Piano', type: 'income' },
            { code: 'V', name: 'Violin', type: 'income' },
            { code: 'G', name: 'Guitar', type: 'income' },
            { code: 'VO', name: 'Vocal', type: 'income' },
            { code: 'O', name: 'Oud', type: 'income' },
            { code: 'D', name: 'Daraboka', type: 'income' },
            { code: 'DR', name: 'Drums', type: 'income' },
            { code: 'SI', name: 'Instrument Sell', type: 'income' },
            { code: 'A', name: 'Art', type: 'income' },
            { code: 'BA', name: 'Watar Band', type: 'income' }
        ];
        
        const stmt = db.prepare('INSERT OR IGNORE INTO cash_categories (code, name, type) VALUES (?, ?, ?)');
        categories.forEach(cat => {
            stmt.run(cat.code, cat.name, cat.type);
        });
        stmt.finalize(() => {
            console.log('✓ Cash categories inserted');
            db.close();
            console.log('\n✅ Cash management system setup complete!');
        });
    }
});
