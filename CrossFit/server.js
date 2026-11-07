const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
const db = require('./db/init');

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'unbound-gym-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Make user and current URL available in all templates
app.use((req, res, next) => {
    res.locals.currentUrl = req.originalUrl;
    res.locals.user = req.session.user || null;
    next();
});

// Register routes
require('./routes/auth')(app, db);
require('./routes/dashboard')(app, db);
require('./routes/members')(app, db);
require('./routes/classes')(app, db);
require('./routes/attendance')(app, db);
require('./routes/coaches')(app, db);
require('./routes/memberships')(app, db);
require('./routes/schedule')(app, db);
require('./routes/wods')(app, db);
require('./routes/payments')(app, db);
require('./routes/public-register')(app, db);
require('./routes/users')(app, db);
require('./routes/leads')(app, db);
require('./routes/invitations')(app, db);
require('./routes/cash')(app, db);
require('./routes/pt')(app, db);

// Auto-expire memberships that have passed their end date
function expireMemberships() {
    db.run("UPDATE members SET status = 'expired' WHERE status = 'active' AND membership_end IS NOT NULL AND membership_end < date('now')", function(err) {
        if (!err && this.changes > 0) console.log('Auto-expired', this.changes, 'membership(s)');
    });
}
expireMemberships(); // Run on startup
setInterval(expireMemberships, 60 * 60 * 1000); // Run every hour

// Start server
app.listen(PORT, () => {
    console.log(`Unbound Gym Management System running on http://localhost:${PORT}`);
    console.log('Default login: admin / admin123');
});
