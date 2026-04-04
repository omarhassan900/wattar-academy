# Views Reference

All views are EJS templates in the `views/` folder. Each view is rendered inside `layout.ejs` using the pattern:

```javascript
res.render('viewname', { data }, (err, html) => {
    res.render('layout', { body: html, user, activemenu: 'menukey' });
});
```

## View Files

| File | Route | Description |
|------|-------|-------------|
| `layout.ejs` | — | Main layout wrapper (sidebar + content area) |
| `login.ejs` | `/login` | Standalone login page (no layout) |
| `dashboard.ejs` | `/dashboard` | Manager dashboard with stats cards and charts |
| `students.ejs` | `/students` | Student list with add/edit modals, filters |
| `classes.ejs` | `/classes` | Class list with add modal |
| `attendance.ejs` | `/attendance` | Session-based attendance grid with level selector |
| `attendance-summary.ejs` | `/attendance/summary` | Summary table of attendance by level |
| `trainer-attendance.ejs` | — | Trainer-specific attendance view |
| `pre-schedule.ejs` | `/pre-schedule` | Weekly calendar grid with add/edit modals + unscheduled list |
| `session-confirmations.ejs` | `/session-confirmations` | Confirmation workflow with student list |
| `cash.ejs` | `/cash` | Transaction list with add/edit, monthly summary |
| `leads.ejs` | `/leads` | Sales pipeline with call logging, trial scheduling |
| `band.ejs` | `/band` | Band members with rehearsal attendance grid |
| `evaluations.ejs` | `/evaluations` | Evaluation form with history |
| `public-feedback.ejs` | `/feedback/:token` | Public feedback form (no auth, standalone) |
| `reports.ejs` | `/reports` | Attendance reports with filters |
| `users.ejs` | `/users` | User management with add/edit modals |
| `admin-db.ejs` | `/admin/db` | Raw SQL query interface |

## Common Data Passed to Views

Most views receive:
- `user` — Current logged-in user object `{ id, username, full_name, role }`
- `activemenu` — String to highlight the active sidebar item

Additional data varies by view (students list, trainers list, etc.)

## Frontend Libraries (loaded in layout.ejs)

- Bootstrap 5.1.3 (CSS + JS bundle)
- Font Awesome 6.0.0 (icons)
- Custom CSS inline in layout.ejs and individual views
- No build step — all loaded from CDN
