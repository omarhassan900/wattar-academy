# Navigation & Sidebar Map

The sidebar is defined in `views/layout.ejs`. It's role-aware — each user only sees menu items they have access to.

## Sidebar Menu (by role)

### Manager (sees everything)
```
🏠 Dashboard              → /dashboard
📞 Session Confirmations   → /session-confirmations
📅 Weekly Schedule         → /pre-schedule
⭐ Students Evaluation     → /evaluations
👥 Students                → /students
🎓 Classes                 → /classes
✅ Attendance              → /attendance
📊 Session Summary         → /attendance/summary
📈 Reports                 → /reports
💰 Cash Management         → /cash
🎧 Leads                   → /leads
🎸 Wattar Band             → /band
⚙️ User Management         → /users
🗄️ Database Admin          → /admin/db
───────────────────
🚪 Logout                  → /logout
```

### Operations Manager
```
📞 Session Confirmations   → /session-confirmations
📅 Weekly Schedule         → /pre-schedule (edit)
⭐ Students Evaluation     → /evaluations
👥 Students                → /students
✅ Attendance (View Only)  → /attendance
🎧 Leads                   → /leads
🎸 Wattar Band             → /band
───────────────────
🚪 Logout
```

### Reception
```
📅 Weekly Schedule         → /pre-schedule (view only)
⭐ Students Evaluation     → /evaluations
👥 Students                → /students
✅ Attendance              → /attendance (edit)
💰 Cash Management         → /cash
🎧 Leads                   → /leads (limited)
🎸 Wattar Band             → /band
───────────────────
🚪 Logout
```

### Trainer
```
📅 Weekly Schedule         → /pre-schedule (view only, own students)
⭐ Students Evaluation     → /evaluations
───────────────────
🚪 Logout
```

### Sales
```
🎧 Leads                   → /leads (own assigned only)
───────────────────
🚪 Logout
```

## Home Page Redirects

When a user visits `/`, they're redirected based on role:

| Role | Redirects to |
|------|-------------|
| manager | `/dashboard` |
| operations_manager | `/session-confirmations` |
| reception | `/attendance` |
| trainer | `/pre-schedule` |
| sales | `/leads` |

## Layout Structure

```
┌──────────────────────────────────────────────┐
│  ┌──────────┐  ┌──────────────────────────┐  │
│  │          │  │                          │  │
│  │ Sidebar  │  │     Main Content         │  │
│  │ (col-2)  │  │     (col-10)             │  │
│  │          │  │                          │  │
│  │ - Logo   │  │  <%- body %>             │  │
│  │ - User   │  │  (injected EJS view)     │  │
│  │ - Menu   │  │                          │  │
│  │ - Logout │  │                          │  │
│  │          │  │                          │  │
│  └──────────┘  └──────────────────────────┘  │
└──────────────────────────────────────────────┘
```

- Desktop: Fixed sidebar (col-lg-2) + main content (col-lg-10)
- Mobile: Offcanvas sidebar (hamburger menu)
- Each page is rendered as `layout.ejs` with the specific view injected as `body`
