const db = require('./db/init');

setTimeout(() => {
    // Fix: CA income entries should be MGR_CASH
    db.run("UPDATE cash_transactions SET category_code = 'MGR_CASH' WHERE type = 'income' AND category_code = 'CA'", function(err) {
        if (err) console.error('Error:', err);
        else console.log('Fixed', this.changes, 'income entries from CA to MGR_CASH');
        process.exit(0);
    });
}, 3000);
