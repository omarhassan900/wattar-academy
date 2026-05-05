const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = 3000;

// Initialize database (creates tables, runs migrations)
const db = require('./db/init');

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Serve public website at /site (for local testing and production)
app.use('/site', express.static('wattar-website'));

// Session middleware
app.use(session({
    secret: 'wattar-academy-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Make current URL available in all templates
app.use((req, res, next) => {
    res.locals.currentUrl = req.originalUrl;
    next();
});

// Register all routes
require('./routes/auth')(app, db);
require('./routes/dashboard')(app, db);
require('./routes/students')(app, db);
require('./routes/classes')(app, db);
require('./routes/attendance')(app, db);
require('./routes/cash')(app, db);
require('./routes/cash-forecast')(app, db);
require('./routes/schedule')(app, db);
require('./routes/confirmations')(app, db);
require('./routes/leads')(app, db);
require('./routes/band')(app, db);
require('./routes/evaluations')(app, db);
require('./routes/feedback')(app, db);
require('./routes/users')(app, db);
require('./routes/admin')(app, db);
require('./routes/meta-webhook')(app, db);

// Start server
app.listen(PORT, () => {
    console.log(`Wattar Academy Management System running on http://localhost:${PORT}`);
    console.log('Default login: username=admin, password=admin123');
});
