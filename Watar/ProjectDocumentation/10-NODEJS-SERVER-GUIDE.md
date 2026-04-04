# Node.js & server.js — A Developer's Guide

This guide explains the Node.js/Express patterns used in `server.js`, section by section, so you can confidently read and modify the code even if you've never used Node.js before.

---

## Table of Contents

1. [How Node.js Works (The Basics)](#1-how-nodejs-works)
2. [The Imports (require)](#2-the-imports)
3. [App & Database Setup](#3-app--database-setup)
4. [Database Initialization (CREATE TABLE)](#4-database-initialization)
5. [Middleware — The Request Pipeline](#5-middleware)
6. [Routes — Handling HTTP Requests](#6-routes)
7. [Authentication & Sessions](#7-authentication--sessions)
8. [Database Queries (SQLite)](#8-database-queries)
9. [Rendering Views (EJS)](#9-rendering-views)
10. [Callbacks & Async Patterns](#10-callbacks--async)
11. [The Full File Structure Map](#11-file-structure-map)
12. [Common Patterns You'll See Repeated](#12-common-patterns)
13. [How to Add a New Feature](#13-how-to-add-a-new-feature)

---

## 1. How Node.js Works

Node.js runs JavaScript outside the browser. Instead of running in Chrome or Firefox, it runs on your server (or your laptop). Think of it like this:

```
Traditional Web App:
  Browser (JavaScript) ←→ Server (PHP/Python/Java) ←→ Database

Node.js Web App:
  Browser (JavaScript) ←→ Server (ALSO JavaScript) ←→ Database
```

The key concept: **everything is asynchronous**. When Node.js asks the database for data, it doesn't wait — it says "call me back when you're done" and moves on to handle other requests. That's why you see so many **callback functions** (more on that later).

---

## 2. The Imports

```javascript
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const moment = require('moment');
const path = require('path');
```

`require()` is how Node.js imports libraries (like `import` in Python or `#include` in C).

| Import | What it does |
|--------|-------------|
| `express` | The web framework — handles HTTP requests, routing, responses |
| `sqlite3` | Database driver for SQLite. `.verbose()` enables detailed error messages |
| `bodyParser` | Reads data from POST requests (form submissions, JSON) |
| `session` | Stores user login state between requests (cookies + server memory) |
| `bcrypt` | Hashes passwords securely (never store plain text passwords) |
| `moment` | Date formatting library (e.g., "March 5, 2026" instead of "2026-03-05") |
| `path` | Helps build file paths that work on any OS (Windows, Linux, Mac) |

These packages are installed via `npm install` and listed in `package.json`.

---

## 3. App & Database Setup

```javascript
const app = express();        // Create the web application
const PORT = 3000;            // Which port to listen on
const db = new sqlite3.Database('wattar.db');  // Open/create the database file
```

- `app` is your entire web server. Every route, every middleware, everything attaches to this object.
- `db` is your database connection. You use it everywhere to run SQL queries.
- `wattar.db` is a single file on disk — that's how SQLite works (no separate database server needed).

At the very bottom of the file:
```javascript
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```
This starts the server. Until this line runs, nothing listens for requests.

---

## 4. Database Initialization

When the server starts, it creates all tables if they don't exist:

```javascript
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users ( ... )`);
    db.run(`CREATE TABLE IF NOT EXISTS students ( ... )`);
    // ... more tables
});
```

**`db.serialize()`** — Runs the queries inside it one after another (sequentially). Without this, SQLite might try to run them all at once and fail.

**`CREATE TABLE IF NOT EXISTS`** — Creates the table only if it doesn't already exist. Safe to run every time the server starts.

**Migrations** — When you need to add a column to an existing table:
```javascript
db.run(`ALTER TABLE students ADD COLUMN instrument VARCHAR(100)`, (err) => {
    // Ignore error if column already exists
});
```
This pattern is used throughout — try to add the column, ignore the error if it's already there. It's a simple migration strategy.

---

## 5. Middleware

Middleware is code that runs **before** your route handler. Think of it as a pipeline:

```
Request comes in
    → Middleware 1 (parse the body)
    → Middleware 2 (load the session)
    → Middleware 3 (check authentication)
    → Your route handler (do the actual work)
    → Response goes out
```

### Setting up middleware:

```javascript
// Tell Express to use EJS templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parse form data and JSON from POST requests
app.use(bodyParser.urlencoded({ extended: true }));  // form submissions
app.use(bodyParser.json());                           // JSON API calls

// Serve static files (CSS, JS, images) from the "public" folder
app.use(express.static('public'));

// Enable sessions (login state)
app.use(session({
    secret: 'wattar-academy-secret-key',  // Used to encrypt the cookie
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }  // 24 hours
}));
```

**`app.use()`** means "run this for EVERY request". The order matters — middleware runs in the order you define it.

### Custom middleware:

```javascript
// Make current URL available in all templates (for active menu highlighting)
app.use((req, res, next) => {
    res.locals.currentUrl = req.originalUrl;
    next();  // MUST call next() or the request hangs forever
});
```

**`next()`** is critical. It tells Express "I'm done, pass the request to the next middleware/route." If you forget it, the browser will wait forever.

### Authentication middleware:

```javascript
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();           // User is logged in, continue
    } else {
        res.redirect('/login');  // Not logged in, go to login page
    }
};

const requireRole = (roles) => {
    return (req, res, next) => {
        if (req.session.user && roles.includes(req.session.user.role)) {
            next();       // User has the right role, continue
        } else {
            res.status(403).render('error', { message: 'Access denied' });
        }
    };
};
```

These are **functions that return functions** (a common JavaScript pattern). They're used in routes like this:

```javascript
app.get('/students', requireAuth, requireRole(['manager', 'reception']), (req, res) => {
    // This code only runs if:
    // 1. User is logged in (requireAuth passed)
    // 2. User is a manager or reception (requireRole passed)
});
```

The middleware chain: `requireAuth` → `requireRole` → your handler. If any middleware doesn't call `next()`, the chain stops.

---

## 6. Routes

Routes are the core of the app. They define "when someone visits THIS URL with THIS method, do THIS."

### Basic structure:

```javascript
app.METHOD(PATH, MIDDLEWARE..., HANDLER);
```

### GET route (load a page):

```javascript
app.get('/students', requireAuth, requireRole(['manager', 'reception']), (req, res) => {
    // req = the incoming request (URL, query params, session, etc.)
    // res = the response you send back (HTML, JSON, redirect, etc.)
    
    db.all('SELECT * FROM students', (err, students) => {
        res.render('students', { students, user: req.session.user });
    });
});
```

### POST route (receive form data or API call):

```javascript
app.post('/students', requireAuth, requireRole(['manager', 'reception']), (req, res) => {
    // req.body contains the form data or JSON sent by the browser
    const { name, phone, email } = req.body;
    
    db.run('INSERT INTO students (name, phone, email) VALUES (?, ?, ?)',
        [name, phone, email],
        function(err) {
            if (err) {
                return res.json({ success: false, error: 'Database error' });
            }
            res.json({ success: true, id: this.lastID });
        }
    );
});
```

### Route with URL parameters:

```javascript
app.get('/students/:id', requireAuth, (req, res) => {
    const studentId = req.params.id;  // :id becomes req.params.id
    
    db.get('SELECT * FROM students WHERE id = ?', [studentId], (err, student) => {
        res.json(student);
    });
});
```

`:id` is a placeholder. When someone visits `/students/42`, `req.params.id` equals `"42"`.

### Query parameters:

```javascript
// URL: /cash?page=2&type=income
app.get('/cash', requireAuth, (req, res) => {
    const page = req.query.page || 1;    // "2"
    const type = req.query.type || '';    // "income"
});
```

---

## 7. Authentication & Sessions

### How login works:

```javascript
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // 1. Find user in database
    db.get("SELECT * FROM users WHERE username = ? AND status = 'active'",
        [username], (err, user) => {
        
        // 2. Compare password hash
        if (user && bcrypt.compareSync(password, user.password_hash)) {
            
            // 3. Store user info in session
            req.session.user = {
                id: user.id,
                username: user.username,
                full_name: user.full_name,
                role: user.role
            };
            
            // 4. Redirect to home
            res.redirect('/');
        } else {
            res.render('login', { error: 'Invalid username or password' });
        }
    });
});
```

**Session flow:**
1. User logs in → server creates a session and stores user data in memory
2. Server sends a cookie to the browser (just a random ID, not the actual data)
3. On every subsequent request, browser sends the cookie back
4. Server looks up the session by cookie ID → finds the user data
5. `req.session.user` is available in every route

**Logout** just destroys the session:
```javascript
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});
```

---

## 8. Database Queries

SQLite uses callbacks. There are 3 main methods:

### `db.get()` — Get ONE row

```javascript
db.get('SELECT * FROM students WHERE id = ?', [42], (err, row) => {
    // row = { id: 42, name: 'Ahmed', ... } or undefined if not found
    // err = error object if query failed, null if OK
    if (err) {
        console.error(err);
        return;
    }
    console.log(row.name);  // "Ahmed"
});
```

### `db.all()` — Get ALL matching rows

```javascript
db.all('SELECT * FROM students WHERE status = ?', ['active'], (err, rows) => {
    // rows = [ { id: 1, name: 'Ahmed' }, { id: 2, name: 'Sara' }, ... ]
    // rows = [] if no matches (empty array, not null)
    console.log(rows.length);  // number of results
});
```

### `db.run()` — INSERT, UPDATE, DELETE (no data returned)

```javascript
db.run('INSERT INTO students (name, phone) VALUES (?, ?)',
    ['Ahmed', '0123456789'],
    function(err) {
        // NOTE: must use function() not arrow => to access 'this'
        console.log(this.lastID);   // ID of the inserted row
        console.log(this.changes);  // number of rows affected
    }
);
```

### The `?` placeholder

NEVER put variables directly in SQL strings. Always use `?`:

```javascript
// ❌ DANGEROUS (SQL injection)
db.get(`SELECT * FROM users WHERE username = '${username}'`);

// ✅ SAFE (parameterized query)
db.get('SELECT * FROM users WHERE username = ?', [username]);
```

The `?` gets replaced with the value from the array, but safely escaped.

### `db.serialize()` — Run queries in order

```javascript
db.serialize(() => {
    db.run('CREATE TABLE ...');   // Runs first
    db.run('INSERT INTO ...');    // Runs second (waits for first)
    db.run('CREATE INDEX ...');   // Runs third
});
```

Without `serialize()`, SQLite might run them in any order.

---

## 9. Rendering Views

This app uses a two-step rendering pattern:

```javascript
app.get('/students', requireAuth, (req, res) => {
    db.all('SELECT * FROM students', (err, students) => {
        
        // Step 1: Render the page content (students.ejs)
        res.render('students', {
            students: students,
            user: req.session.user
        }, (err, html) => {
            
            // Step 2: Inject it into the layout (layout.ejs)
            res.render('layout', {
                body: html,                    // The rendered HTML from step 1
                user: req.session.user,
                activemenu: 'students'         // Which sidebar item to highlight
            });
        });
    });
});
```

**Why two steps?** Because `layout.ejs` is the wrapper (sidebar, header, etc.) and each page's content gets injected into it via `<%- body %>`.

**`res.render(template, data)`** — Renders an EJS template with the given data. The data becomes available as variables inside the `.ejs` file.

In the EJS file:
```html
<!-- Output a variable (escaped — safe from XSS) -->
<%= student.name %>

<!-- Output raw HTML (unescaped — use carefully) -->
<%- body %>

<!-- JavaScript logic -->
<% if (user.role === 'manager') { %>
    <button>Delete</button>
<% } %>

<!-- Loop -->
<% students.forEach(student => { %>
    <tr><td><%= student.name %></td></tr>
<% }); %>
```

---

## 10. Callbacks & Async

This is probably the most confusing part if you're new to Node.js.

### The callback pattern:

```javascript
// This does NOT work as you'd expect:
let students;
db.all('SELECT * FROM students', (err, rows) => {
    students = rows;
});
console.log(students);  // undefined! The query hasn't finished yet!
```

**Why?** `db.all()` is asynchronous. It starts the query and immediately moves to the next line. The callback `(err, rows) => { ... }` runs LATER, when the database responds.

**The correct way — do everything inside the callback:**

```javascript
db.all('SELECT * FROM students', (err, rows) => {
    // NOW rows is available
    console.log(rows);  // [ { id: 1, ... }, ... ]
    res.json(rows);     // Send response here, inside the callback
});
```

### Nested callbacks (callback hell):

When you need data from multiple queries:

```javascript
app.get('/pre-schedule', requireAuth, (req, res) => {
    // Query 1: Get students
    db.all('SELECT * FROM students WHERE status = ?', ['active'], (err, students) => {
        
        // Query 2: Get trainers (runs AFTER query 1 finishes)
        db.all('SELECT * FROM users WHERE role = ?', ['trainer'], (err, trainers) => {
            
            // NOW we have both students and trainers
            res.render('pre-schedule', {
                students: students,
                trainers: trainers,
                user: req.session.user
            });
        });
    });
});
```

This nesting is why the code gets deeply indented. It's a known issue with callback-style code. Modern Node.js uses `async/await` to flatten this, but this project uses the callback style throughout.

### Arrow functions vs regular functions:

```javascript
// Arrow function (used most of the time)
(err, rows) => {
    console.log(rows);
}

// Regular function (needed when you need 'this')
function(err) {
    console.log(this.lastID);  // 'this' only works with function(), not =>
}
```

`db.run()` callbacks need `function()` to access `this.lastID` and `this.changes`. Everything else uses arrow functions `=>`.

---

## 11. The File Structure Map

Here's how `server.js` is organized from top to bottom:

```
Line ~1-7       IMPORTS (require statements)
Line ~9-11      APP & DB SETUP (express(), Database())
Line ~13-40     MIGRATION (add 'sales' role to users table)
Line ~42-250    TABLE CREATION (CREATE TABLE IF NOT EXISTS for newer tables)
Line ~252-265   MIDDLEWARE SETUP (view engine, body parser, sessions)
Line ~267-285   AUTH MIDDLEWARE (requireAuth, requireRole functions)
Line ~287-430   DB INIT (db.serialize — core tables + default admin user)
Line ~432-470   AUTH ROUTES (/login, /logout, / home redirect)
Line ~472-700   DASHBOARD ROUTES (/dashboard with stats queries)
Line ~700-1100  STUDENT ROUTES (/students CRUD)
Line ~1100-1400 CLASS ROUTES (/classes)
Line ~1400-2100 ATTENDANCE ROUTES (/attendance, sessions, CSV export)
Line ~2100-2500 CASH ROUTES (/cash transactions)
Line ~2500-2700 SCHEDULE ROUTES (/pre-schedule)
Line ~2700-2900 SESSION CONFIRMATION ROUTES
Line ~2900-3100 LEADS/SALES ROUTES (/leads, calls, trials)
Line ~3100-3300 BAND ROUTES (/band members, attendance, cycles)
Line ~3300-3500 EVALUATION ROUTES (/evaluations)
Line ~3500-3600 FEEDBACK ROUTES (/student-feedback, public /feedback/:token)
Line ~3600-3700 USER MANAGEMENT ROUTES (/users)
Line ~3700-3800 REPORTS & ADMIN ROUTES (/reports, /admin/db)
Line ~3800+     APP.LISTEN (start the server)
```

*(Line numbers are approximate — the file grows as features are added)*

---

## 12. Common Patterns You'll See Repeated

### Pattern 1: Page route with data loading

```javascript
app.get('/PAGE', requireAuth, requireRole([...]), (req, res) => {
    const user = req.session.user;
    
    db.all('SELECT ...', [], (err, data) => {
        if (err) { console.error(err); }
        
        res.render('page-template', { data, user }, (err, html) => {
            if (err) { return res.status(500).send('Render error'); }
            res.render('layout', { body: html, user, activemenu: 'page' });
        });
    });
});
```

### Pattern 2: API endpoint returning JSON

```javascript
app.post('/something/add', requireAuth, requireRole([...]), (req, res) => {
    const { field1, field2 } = req.body;
    
    if (!field1) {
        return res.json({ success: false, error: 'Field1 is required' });
    }
    
    db.run('INSERT INTO table (col1, col2) VALUES (?, ?)',
        [field1, field2],
        function(err) {
            if (err) {
                console.error(err);
                return res.json({ success: false, error: 'Database error' });
            }
            res.json({ success: true, id: this.lastID });
        }
    );
});
```

### Pattern 3: Destructuring request body

```javascript
const { name, phone, email, status } = req.body;
// Same as:
// const name = req.body.name;
// const phone = req.body.phone;
// etc.
```

### Pattern 4: Default values

```javascript
const page = parseInt(req.query.page) || 1;      // If no page param, use 1
const students = data || [];                       // If data is null, use empty array
const trainer = trainer_id || null;                // If empty string, use null
```

### Pattern 5: Early return on error

```javascript
if (!name) {
    return res.json({ success: false, error: 'Name required' });
    // 'return' stops execution here — code below won't run
}
// This only runs if name exists
db.run('INSERT ...');
```

---

## 13. How to Add a New Feature

Here's the step-by-step recipe:

### Step 1: Add the table (if needed)

Add a `CREATE TABLE IF NOT EXISTS` near the top of server.js with the other table creations:

```javascript
db.run(`CREATE TABLE IF NOT EXISTS my_new_table (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);
```

### Step 2: Add the page route (GET)

```javascript
app.get('/my-feature', requireAuth, requireRole(['manager']), (req, res) => {
    const user = req.session.user;
    
    db.all('SELECT * FROM my_new_table', (err, items) => {
        res.render('my-feature', { items: items || [], user }, (err, html) => {
            if (err) return res.status(500).send('Render error');
            res.render('layout', { body: html, user, activemenu: 'my-feature' });
        });
    });
});
```

### Step 3: Add API routes (POST)

```javascript
app.post('/my-feature/add', requireAuth, requireRole(['manager']), (req, res) => {
    const { name } = req.body;
    if (!name) return res.json({ success: false, error: 'Name required' });
    
    db.run('INSERT INTO my_new_table (name) VALUES (?)', [name], function(err) {
        if (err) return res.json({ success: false, error: 'Database error' });
        res.json({ success: true, id: this.lastID });
    });
});
```

### Step 4: Create the view

Create `views/my-feature.ejs`:

```html
<h1>My Feature</h1>

<table class="table">
    <thead>
        <tr><th>Name</th></tr>
    </thead>
    <tbody>
        <% items.forEach(item => { %>
            <tr><td><%= item.name %></td></tr>
        <% }); %>
    </tbody>
</table>
```

### Step 5: Add to sidebar

In `views/layout.ejs`, add a nav link inside the appropriate role check:

```html
<% if (['manager'].includes(user.role)) { %>
<a class="nav-link <%= currentUrl == '/my-feature' ? 'active' : '' %>" href="/my-feature">
    <i class="fas fa-star me-2"></i>My Feature
</a>
<% } %>
```

### Step 6: Test

```bash
npm run dev
# Open http://localhost:3000/my-feature
```

---

## Quick Reference

| Concept | Syntax | Example |
|---------|--------|---------|
| Import a package | `const x = require('x')` | `const express = require('express')` |
| Define a GET route | `app.get(path, handler)` | `app.get('/students', ...)` |
| Define a POST route | `app.post(path, handler)` | `app.post('/students', ...)` |
| Read URL param | `req.params.name` | `/students/:id` → `req.params.id` |
| Read query string | `req.query.name` | `?page=2` → `req.query.page` |
| Read POST body | `req.body.name` | Form field or JSON key |
| Get session user | `req.session.user` | `{ id, username, role, ... }` |
| Send JSON | `res.json(obj)` | `res.json({ success: true })` |
| Render template | `res.render(name, data)` | `res.render('students', { students })` |
| Redirect | `res.redirect(url)` | `res.redirect('/login')` |
| DB: get one row | `db.get(sql, params, cb)` | `db.get('SELECT...', [id], (err, row) => {})` |
| DB: get all rows | `db.all(sql, params, cb)` | `db.all('SELECT...', [], (err, rows) => {})` |
| DB: insert/update | `db.run(sql, params, cb)` | `db.run('INSERT...', [val], function(err) {})` |
