# Features Guide

## 1. Dashboard (`/dashboard`)
**Roles:** Manager only

The main analytics page showing:
- Total active students, total classes, monthly revenue
- Student distribution by level (chart)
- Student distribution by instrument (chart)
- Attendance rate analytics
- Monthly financial summaries
- Recent confirmations count

---

## 2. Student Management (`/students`)
**Roles:** Manager, Operations Manager, Reception

Full CRUD for student records:
- Add new students with all profile fields
- Edit student info (name, phone, instrument, level, trainer, etc.)
- Filter students by status (active/inactive/graduated)
- Student levels go from "Month 1" to "Month 48" (4 years curriculum)
- Each student can be assigned to a trainer
- Instruments tracked: Guitar, Piano, Violin, Drums, Oud, etc.

**Key fields:** name, national_id, phone, parent_phone, email, instrument, current_level, status, trainer_id

**API Endpoints:**
- `GET /students` — List page
- `POST /students` — Add student
- `GET /students/:id` — Get single student (JSON)
- `POST /students/:id/edit` — Edit student

---

## 3. Attendance System (`/attendance`)
**Roles:** Manager, Reception (edit) | Operations Manager (view only)

The attendance system is session-based, not date-based:
- Each level (month) has 4 sessions
- 48 months × 4 sessions = 192 total sessions per student
- Attendance statuses: present, absent, late, excused
- Sessions can have actual dates assigned
- Level notes can be added per student per month
- CSV export available

**How it works:**
1. Select a level (e.g., "Month 5")
2. See all active students at that level
3. Mark attendance for sessions 1-4
4. Optionally set session dates
5. Add level notes per student

**API Endpoints:**
- `GET /attendance` — Main page with filters
- `POST /attendance/save-all` — Save all attendance records
- `POST /attendance/session` — Save single session
- `POST /attendance/all` — Save attendance + notes
- `GET /attendance/export-csv` — Export to CSV
- `GET /attendance/summary` — Summary by level
- `POST /api/update-student-month` — Advance student to next level
- `POST /api/session-date` — Set session date

---

## 4. Weekly Schedule (`/pre-schedule`)
**Roles:** Manager, Ops Manager (edit) | Reception, Trainer (view only)

A visual weekly calendar showing which students are scheduled for which day/time:
- Calendar grid: 7 days × time slots
- Students assigned to day + time + trainer
- Multiple students can share the same slot
- Color-coded by trainer
- Trainer filter dropdown
- Shows unscheduled active students (collapsible list)

**How it works:**
1. Click "Add Student to Schedule"
2. Select day, student(s), time, trainer
3. Student appears on the calendar
4. Click a slot to edit or delete

**API Endpoints:**
- `GET /pre-schedule` — Main page
- `GET /pre-schedule/list` — Get all schedule entries (JSON)
- `POST /pre-schedule/add` — Add student to schedule
- `POST /pre-schedule/update` — Update entry
- `POST /pre-schedule/delete` — Soft-delete entry
- `GET /pre-schedule/unscheduled` — Active students not in schedule

---

## 5. Session Confirmations (`/session-confirmations`)
**Roles:** Manager, Operations Manager

Before each session, the operations manager calls students to confirm:
- Shows all active students with their upcoming sessions
- Confirmation statuses: confirmed, not_confirmed, pending
- Add confirmation notes
- Logs confirmations permanently for reporting

**API Endpoints:**
- `GET /session-confirmations` — Main page
- `POST /session-confirmations/update` — Update confirmation status
- `GET /session-confirmations/list` — Get all confirmations (JSON)

---

## 6. Cash Management (`/cash`)
**Roles:** Manager, Reception

Track all money in and out:
- Income transactions (tuition, registration, etc.)
- Expense transactions (rent, salaries, supplies, etc.)
- Categories defined in `cash_categories` table
- Monthly financial reports
- Filter by date range, type, category
- Paginated transaction list

**API Endpoints:**
- `GET /cash` — Main page (paginated)
- `POST /cash` — Add transaction
- `POST /cash/:id/edit` — Edit transaction
- `POST /cash/:id/delete` — Delete transaction

---

## 7. Leads / Sales Pipeline (`/leads`)
**Roles:** Sales (own leads), Manager, Ops Manager (all), Reception (limited)

Full CRM for prospective students:
- Lead statuses: new → contacted → interested → callback → trial_scheduled → enrolled / not_interested
- Call logging with outcomes
- Trial scheduling (assign date, time, trainer)
- Auto-convert enrolled leads to students

**Workflow:**
1. Sales person adds a lead
2. Makes calls, logs outcomes
3. If interested → Operations Manager schedules a trial
4. After trial → Reception marks result (enrolled or not)
5. If enrolled → automatically creates a student record

**API Endpoints:**
- `GET /leads` — Main page
- `POST /leads/add` — Add lead
- `POST /leads/:id/update` — Update lead
- `POST /leads/:id/delete` — Delete lead
- `POST /leads/:id/call` — Log a call
- `GET /leads/:id/calls` — Get call history
- `POST /leads/:id/schedule-trial` — Schedule trial
- `POST /leads/:id/trial-result` — Mark trial result (can auto-enroll)

---

## 8. Wattar Band (`/band`)
**Roles:** Manager, Operations Manager, Reception

Manage the academy's band:
- Add active students as band members
- Assign instrument roles
- Track rehearsal attendance (4 rehearsals per cycle)
- Advance to next cycle when complete
- Navigate between cycles

**API Endpoints:**
- `GET /band` — Main page
- `POST /band/add-member` — Add member
- `POST /band/remove-member` — Remove member
- `POST /band/save-attendance` — Save rehearsal attendance
- `POST /band/clear-attendance` — Clear attendance
- `POST /band/next-cycle` — Advance cycle
- `POST /band/prev-cycle` — Go back a cycle

---

## 9. Student Evaluations (`/evaluations`)
**Roles:** Manager, Operations Manager, Reception, Trainer

Trainers evaluate students after completing 4 sessions:
- Three rating categories: Attitude, Commitment, Development
- Notes field for detailed feedback
- Evaluation history per student
- Triggered after 4th session attendance

**API Endpoints:**
- `GET /evaluations` — Main page
- `POST /evaluations/save` — Save evaluation
- `GET /evaluations/history/:studentId` — Get evaluation history

---

## 10. Student Feedback (`/feedback/:token`)
**Roles:** Public (token-based, no auth required)

Collect feedback from students:
- Staff generates a unique feedback link
- Student opens the link (no login needed)
- Rates: trainer, development, experience
- Adds optional notes
- Feedback stored and viewable by staff

**API Endpoints:**
- `POST /student-feedback/generate-link` — Generate token link
- `POST /student-feedback/save` — Save feedback (staff)
- `GET /student-feedback/list` — Get all feedback
- `GET /feedback/:token` — Public feedback form
- `POST /feedback/:token/submit` — Submit public feedback

---

## 11. Classes (`/classes`)
**Roles:** Manager only

Manage group classes:
- Create classes with name, level, trainer, schedule
- Set capacity (max students)
- Assign trainers
- Track enrollment

**API Endpoints:**
- `GET /classes` — Main page
- `POST /classes` — Add class

---

## 12. Reports (`/reports`)
**Roles:** Manager only

Attendance reports and statistics:
- Attendance rates by level
- Student attendance history
- Filterable by date range

---

## 13. User Management (`/users`)
**Roles:** Manager only

Manage system users:
- Add/edit/delete users
- Assign roles
- Set active/inactive status
- Password management

**API Endpoints:**
- `GET /users` — Main page
- `POST /users` — Add user
- `POST /users/:id/edit` — Edit user
- `POST /users/:id/delete` — Delete user

---

## 14. Database Admin (`/admin/db`)
**Roles:** Manager only

Raw SQL query interface:
- Execute SELECT queries against the database
- View results in a table
- Useful for debugging and ad-hoc queries

**API Endpoints:**
- `GET /admin/db` — Main page
- `POST /admin/db/query` — Execute SQL query
