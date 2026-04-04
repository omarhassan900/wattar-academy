# Roles & Access Control

## How Authentication Works

1. User visits any page → `requireAuth` middleware checks `req.session.user`
2. If no session → redirect to `/login`
3. Login form POSTs username/password → bcrypt compares hash → creates session
4. Session stored server-side with 24-hour cookie expiration
5. Each route has `requireRole([...])` middleware that checks the user's role

## The 5 Roles

### 1. Manager (`manager`)
Full access to everything. This is the admin/owner role.

**Can access:**
- Dashboard (analytics, charts, stats)
- Session Confirmations
- Weekly Schedule (edit)
- Student Evaluations
- Students (full CRUD)
- Classes (full CRUD)
- Attendance (full edit)
- Session Summary
- Reports
- Cash Management
- Leads
- Wattar Band
- User Management
- Database Admin (raw SQL queries)

**Home page redirect:** `/dashboard`

---

### 2. Operations Manager (`operations_manager`)
Manages day-to-day operations — scheduling, confirmations, leads.

**Can access:**
- Session Confirmations (primary responsibility)
- Weekly Schedule (edit)
- Student Evaluations
- Students (view/edit)
- Attendance (view only)
- Leads
- Wattar Band

**Home page redirect:** `/session-confirmations`

---

### 3. Reception (`reception`)
Front desk — handles attendance, cash, and student check-ins.

**Can access:**
- Weekly Schedule (view only)
- Student Evaluations
- Students (view/edit)
- Attendance (full edit)
- Cash Management
- Leads (limited — only trial_scheduled, enrolled, not_interested)
- Wattar Band

**Home page redirect:** `/attendance`

---

### 4. Trainer (`trainer`)
Music instructors — see their own students and schedule.

**Can access:**
- Weekly Schedule (view only, filtered to their students)
- Student Evaluations

**Home page redirect:** `/pre-schedule`

---

### 5. Sales (`sales`)
Handles lead generation and follow-up calls.

**Can access:**
- Leads (only their assigned leads)

**Home page redirect:** `/leads`

---

## Access Matrix

| Feature | Manager | Ops Manager | Reception | Trainer | Sales |
|---------|---------|-------------|-----------|---------|-------|
| Dashboard | ✅ | ❌ | ❌ | ❌ | ❌ |
| Session Confirmations | ✅ | ✅ | ❌ | ❌ | ❌ |
| Weekly Schedule | ✅ Edit | ✅ Edit | 👁 View | 👁 View (own) | ❌ |
| Evaluations | ✅ | ✅ | ✅ | ✅ | ❌ |
| Students | ✅ | ✅ | ✅ | ❌ | ❌ |
| Classes | ✅ | ❌ | ❌ | ❌ | ❌ |
| Attendance | ✅ | 👁 View | ✅ | ❌ | ❌ |
| Session Summary | ✅ | ❌ | ❌ | ❌ | ❌ |
| Reports | ✅ | ❌ | ❌ | ❌ | ❌ |
| Cash Management | ✅ | ❌ | ✅ | ❌ | ❌ |
| Leads | ✅ | ✅ | ✅ (limited) | ❌ | ✅ (own) |
| Wattar Band | ✅ | ✅ | ✅ | ❌ | ❌ |
| User Management | ✅ | ❌ | ❌ | ❌ | ❌ |
| Database Admin | ✅ | ❌ | ❌ | ❌ | ❌ |

## Middleware Functions

```javascript
// Check if user is logged in
function requireAuth(req, res, next) {
    if (req.session.user) return next();
    res.redirect('/login');
}

// Check if user has required role
function requireRole(roles) {
    return (req, res, next) => {
        if (roles.includes(req.session.user.role)) return next();
        res.status(403).send('Access denied');
    };
}
```
