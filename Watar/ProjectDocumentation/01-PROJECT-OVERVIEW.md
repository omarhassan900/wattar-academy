# Wattar Academy Management System - Project Overview

## What Is This?

A full-featured music academy management system built for **Wattar Academy**. It handles the entire lifecycle of a music student — from initial lead contact, through enrollment, scheduling, attendance tracking, evaluations, and financial management.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js + Express.js |
| Database | SQLite (file: `wattar.db`) |
| Template Engine | EJS (Embedded JavaScript) |
| Frontend | Bootstrap 5 + Font Awesome |
| Auth | express-session + bcrypt |
| Deployment | Docker + docker-compose on AWS EC2 |

## Dependencies (package.json)

| Package | Purpose |
|---------|---------|
| `express` | Web framework |
| `sqlite3` | Database driver |
| `ejs` | Server-side HTML templates |
| `bcrypt` | Password hashing |
| `express-session` | Session-based authentication |
| `body-parser` | Parse POST request bodies |
| `moment` | Date formatting and manipulation |
| `xlsx` | Excel file import/export |
| `csv-parser` | CSV file parsing |
| `nodemon` (dev) | Auto-restart server on file changes |

## Project Structure

```
wattar-academy/
├── server.js                  # THE main file — all routes, DB schema, middleware
├── package.json               # Dependencies and scripts
├── wattar.db                  # SQLite database file (auto-created)
├── Dockerfile                 # Docker image definition
├── docker-compose.yml         # Docker service configuration
├── .env / .env.example        # Environment variables
│
├── views/                     # EJS templates (frontend)
│   ├── layout.ejs             # Main layout with sidebar navigation
│   ├── login.ejs              # Login page
│   ├── dashboard.ejs          # Manager dashboard with charts
│   ├── students.ejs           # Student management
│   ├── classes.ejs            # Class management
│   ├── attendance.ejs         # Session attendance tracking
│   ├── attendance-summary.ejs # Attendance summary by level
│   ├── trainer-attendance.ejs # Trainer-specific attendance view
│   ├── pre-schedule.ejs       # Weekly schedule template
│   ├── session-confirmations.ejs # Session confirmation workflow
│   ├── cash.ejs               # Cash/financial management
│   ├── leads.ejs              # Sales pipeline
│   ├── band.ejs               # Band member management
│   ├── evaluations.ejs        # Student evaluations
│   ├── public-feedback.ejs    # Public feedback form (no auth)
│   ├── reports.ejs            # Attendance reports
│   ├── users.ejs              # User management
│   └── admin-db.ejs           # Database admin (raw SQL)
│
├── public/js/                 # Client-side JavaScript
│   └── students.js            # Student page scripts
│
└── [various utility scripts]  # Migration, import, and update scripts
```

## How It All Connects

```
Browser → Express Routes (server.js) → SQLite (wattar.db)
                ↓
         EJS Templates (views/*.ejs)
                ↓
         HTML + Bootstrap → Browser
```

Everything lives in `server.js` — there's no separate router files, no models folder, no controllers. It's a monolithic single-file backend. All routes, all database schema creation, all middleware — one file.

## Running the App

```bash
# Development
npm run dev          # Uses nodemon, auto-restarts on changes

# Production
npm start            # node server.js

# Docker
docker-compose up -d # Runs on port 3000
```

## Default Login

- Username: `admin`
- Password: `admin123`
- Role: `manager` (full access)

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `3000` | Server port |
| `SESSION_SECRET` | hardcoded fallback | Session encryption key |
| `DB_PATH` | `wattar.db` | SQLite database path |
