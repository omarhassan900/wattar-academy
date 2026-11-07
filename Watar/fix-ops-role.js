const fs = require('fs');
let c = fs.readFileSync('views/students.ejs', 'utf8');
const old = "user.role === 'manager' || user.role === 'reception'";
const rep = "user.role === 'manager' || user.role === 'reception' || user.role === 'operations_manager'";
c = c.replaceAll(old, rep);
fs.writeFileSync('views/students.ejs', c);
console.log('Done - replaced all occurrences');
