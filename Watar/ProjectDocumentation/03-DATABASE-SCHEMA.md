# Database Schema

All tables are created automatically in `server.js` on startup using `CREATE TABLE IF NOT EXISTS`. The database is SQLite, stored in `wattar.db`.

## Entity Relationship Overview

```
users ──────┬──── trainers (1:1 via user_id)
            │
            ├──── attendance.marked_by
            ├──── payments.received_by
            ├──── cash_transactions.created_by
            ├──── leads.assigned_to / created_by
            └──── session_confirmations.confirmed_by

students ───┬──── student_classes (M:M with classes)
            ├──── attendance
            ├──── payments
            ├──── session_confirmations
            ├──── confirmation_log
            ├──── student_evaluations
            ├──── student_feedback
            ├──── student_level_notes
            ├──── band_members
            ├──── band_attendance
            └──── schedule_templates

classes ────┬──── student_classes
            └──── attendance

sessions ───┬──── attendance
            └──── session_confirmations
```

---

## Core Tables

### users
System users (staff accounts).

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | Auto-increment |
| username | VARCHAR(50) | Unique, required |
| password_hash | VARCHAR(255) | bcrypt hash |
| full_name | VARCHAR(100) | Required |
| email | VARCHAR(100) | Optional |
| role | TEXT | `manager`, `reception`, `trainer`, `operations_manager`, `sales` |
| status | TEXT | `active`, `inactive` |
| created_at | DATETIME | Auto |
| updated_at | DATETIME | Auto |

### students
Music students enrolled in the academy.

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | Auto-increment |
| name | VARCHAR(100) | Required |
| national_id | VARCHAR(20) | Optional, unique-ish |
| phone | VARCHAR(20) | |
| parent_phone | VARCHAR(20) | |
| email | VARCHAR(100) | |
| start_date | DATE | Required |
| current_level | TEXT | e.g., "Month 1" through "Month 48" |
| status | TEXT | `active`, `inactive`, `graduated` |
| notes | TEXT | |
| instrument | VARCHAR(100) | e.g., Guitar, Piano, Violin |
| address | TEXT | |
| date_of_birth | DATE | |
| emergency_contact | VARCHAR(100) | |
| emergency_phone | VARCHAR(20) | |
| trainer_id | INTEGER | FK → trainers |
| created_at | DATETIME | Auto |
| updated_at | DATETIME | Auto |

### trainers
Links a user account to trainer-specific info.

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | Auto-increment |
| user_id | INTEGER | FK → users |
| specialization | VARCHAR(100) | |
| hourly_rate | DECIMAL(10,2) | |
| hire_date | DATE | |
| status | TEXT | `active`, `inactive` |

### classes
Group classes offered by the academy.

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | Auto-increment |
| name | VARCHAR(100) | Required |
| level | TEXT | Level One through Level Six |
| trainer_id | INTEGER | FK → trainers |
| schedule_day | TEXT | Day of week |
| schedule_time | TIME | |
| duration_minutes | INTEGER | Default 60 |
| max_students | INTEGER | Default 10 |
| status | TEXT | `active`, `inactive` |
| created_at | DATETIME | Auto |

### student_classes
Many-to-many: students enrolled in classes.

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| student_id | INTEGER | FK → students |
| class_id | INTEGER | FK → classes |
| enrollment_date | DATE | Required |
| status | TEXT | `active`, `completed`, `dropped` |
| | | UNIQUE(student_id, class_id) |

---

## Attendance & Sessions

### sessions
Defines the 192 possible sessions (48 months × 4 sessions each).

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| level | TEXT | e.g., "Month 1" |
| session_number | INTEGER | 1-4 within each month |
| session_name | TEXT | |
| description | TEXT | |
| session_date | DATE | Actual date when session occurred |

### attendance
Tracks whether a student attended a specific session.

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| student_id | INTEGER | FK → students |
| session_id | INTEGER | FK → sessions |
| date | DATE | |
| status | TEXT | `present`, `absent`, `late`, `excused` |
| notes | TEXT | |
| marked_by | INTEGER | FK → users |
| created_at | DATETIME | Auto |
| | | UNIQUE(student_id, session_id, date) |

### session_confirmations
Operations manager confirms upcoming sessions with students.

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| student_id | INTEGER | FK → students |
| session_id | INTEGER | FK → sessions |
| confirmation_status | TEXT | `confirmed`, `not_confirmed`, `pending` |
| confirmation_notes | TEXT | |
| confirmed_by | INTEGER | FK → users |
| confirmed_at | DATETIME | |
| created_at | DATETIME | Auto |
| updated_at | DATETIME | Auto |
| | | UNIQUE(student_id, session_id) |

### confirmation_log
Permanent record of confirmations (used for dashboard reporting).

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| student_id | INTEGER | FK → students |
| confirmation_date | DATE | |
| confirmed_by | INTEGER | FK → users |
| created_at | DATETIME | Auto |

### student_level_notes
Notes per student per level (month).

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| student_id | INTEGER | FK → students |
| level | TEXT | e.g., "Month 5" |
| notes | TEXT | |
| created_at | DATETIME | Auto |
| updated_at | DATETIME | Auto |
| | | UNIQUE(student_id, level) |

---

## Financial

### payments
Student payments (tuition, registration, etc.).

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| student_id | INTEGER | FK → students |
| amount | DECIMAL(10,2) | Required |
| payment_date | DATE | Required |
| payment_type | TEXT | `monthly_fee`, `registration`, `materials`, `other` |
| payment_method | TEXT | `cash`, `card`, `bank_transfer`, `other` |
| notes | TEXT | |
| received_by | INTEGER | FK → users |
| created_at | DATETIME | Auto |

### cash_transactions
General income/expense tracking.

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| transaction_date | DATE | |
| type | TEXT | `income`, `expense` |
| amount | DECIMAL(10,2) | |
| category_code | TEXT | FK → cash_categories.code |
| description | TEXT | |
| payment_method | TEXT | |
| reference_number | TEXT | |
| created_by | INTEGER | FK → users |
| created_at | DATETIME | Auto |

### cash_categories
Lookup table for transaction categories.

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| code | TEXT | Unique code |
| name | TEXT | Display name |
| type | TEXT | `income`, `expense` |
| is_active | INTEGER | 1 or 0 |

---

## Sales & Leads

### leads
Prospective students in the sales pipeline.

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| name | TEXT | Required |
| phone | TEXT | |
| parent_phone | TEXT | |
| email | TEXT | |
| age | INTEGER | |
| instrument | TEXT | |
| source | TEXT | How they heard about the academy |
| status | TEXT | `new`, `contacted`, `interested`, `callback`, `trial_scheduled`, `enrolled`, `not_interested` |
| assigned_to | INTEGER | FK → users (sales person) |
| notes | TEXT | |
| trial_date | DATE | |
| trial_time | TIME | |
| trial_trainer_id | INTEGER | FK → trainers |
| trial_notes | TEXT | |
| created_by | INTEGER | FK → users |
| created_at | DATETIME | Auto |
| updated_at | DATETIME | Auto |

### lead_calls
Call log for each lead.

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| lead_id | INTEGER | FK → leads |
| called_by | INTEGER | FK → users |
| call_date | DATETIME | Auto (CURRENT_TIMESTAMP) |
| outcome | TEXT | `no_answer`, `interested`, `callback`, `not_interested`, `enrolled` |
| notes | TEXT | |

---

## Band

### band_members
Students who are part of the Wattar Band.

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| student_id | INTEGER | FK → students |
| instrument_role | TEXT | Their role/instrument in the band |
| current_cycle | INTEGER | Default 1 |
| joined_at | DATETIME | Auto |
| is_active | INTEGER | 1 or 0 |

### band_attendance
Rehearsal attendance (4 rehearsals per cycle).

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| student_id | INTEGER | FK → students |
| cycle | INTEGER | |
| rehearsal_number | INTEGER | 1-4 |
| status | TEXT | `present`, `absent`, `late`, `excused` |
| attendance_date | DATE | |
| notes | TEXT | |
| marked_by | INTEGER | FK → users |
| created_at | DATETIME | Auto |

---

## Evaluations & Feedback

### student_evaluations
Trainer evaluations of students (after 4th session).

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| student_id | INTEGER | FK → students |
| level | TEXT | Month level |
| trainer_id | INTEGER | FK → trainers |
| attitude_rating | INTEGER | Rating score |
| commitment_rating | INTEGER | Rating score |
| development_rating | INTEGER | Rating score |
| notes | TEXT | |
| evaluated_at | DATETIME | Auto |

### student_feedback
Feedback from students about their experience.

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| student_id | INTEGER | FK → students |
| level | TEXT | |
| trainer_rating | INTEGER | |
| development_rating | INTEGER | |
| experience_rating | INTEGER | |
| notes | TEXT | |
| token | TEXT | For public feedback links |
| created_by | INTEGER | FK → users |
| created_at | DATETIME | Auto |

---

## Scheduling

### schedule_templates
Weekly recurring schedule (which student goes when).

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| day_of_week | TEXT | Sunday through Saturday |
| time_slot | TEXT | e.g., "14:00" |
| student_id | INTEGER | FK → students |
| trainer_id | INTEGER | FK → users (trainer) |
| notes | TEXT | |
| is_active | INTEGER | 1 or 0 (soft delete) |
| created_at | DATETIME | Auto |
| updated_at | DATETIME | Auto |

---

## Database Indexes

Created for performance on frequently queried columns:

- `attendance` → student_id, session_id
- `sessions` → level
- `students` → current_level, status
- `cash_transactions` → transaction_date, type, category_code
