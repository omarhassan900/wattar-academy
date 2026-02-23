# Database Structure - Sessions & Attendance Explained

## 📊 Database Tables Overview

Your Wattar Academy system has two main tables for tracking attendance:

### 1. `sessions` Table (Template/Master Data)
This table defines the SESSION TEMPLATES for each level/month.

**Structure:**
```sql
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY,
    level TEXT,                    -- e.g., "Month 1", "Month 2", etc.
    session_number INTEGER,        -- 1, 2, 3, or 4
    session_date DATE,             -- (NOT USED ANYMORE - kept for compatibility)
    session_name TEXT,             -- e.g., "Level One - Session 1"
    description TEXT,
    status TEXT,
    created_at DATETIME
);
```

**Example Data:**
| id | level   | session_number | session_name          |
|----|---------|----------------|-----------------------|
| 1  | Month 1 | 1              | Level One - Session 1 |
| 2  | Month 1 | 2              | Level One - Session 2 |
| 3  | Month 1 | 3              | Level One - Session 3 |
| 4  | Month 1 | 4              | Level One - Session 4 |
| 5  | Month 2 | 1              | Level Two - Session 1 |
| 6  | Month 2 | 2              | Level Two - Session 2 |
| ... | ... | ... | ... |

**Key Points:**
- ✅ One record per level + session_number combination
- ✅ SHARED by ALL students in that level
- ✅ Acts as a "template" or "definition"
- ❌ Does NOT store individual student attendance
- ❌ `session_date` column is NO LONGER USED (after the fix)

---

### 2. `attendance` Table (Individual Student Records)
This table stores ACTUAL attendance for each student for each session.

**Structure:**
```sql
CREATE TABLE attendance (
    id INTEGER PRIMARY KEY,
    student_id INTEGER,            -- Which student
    session_id INTEGER,            -- Which session (references sessions.id)
    status TEXT,                   -- 'present', 'absent', 'late', 'excused'
    date DATE,                     -- When this student attended (UNIQUE per student!)
    notes TEXT,
    marked_by INTEGER,             -- Which user marked it
    created_at DATETIME
);
```

**Example Data:**
| id  | student_id | session_id | status  | date       | notes |
|-----|------------|------------|---------|------------|-------|
| 1   | 11         | 1          | present | 2026-02-22 | null  |
| 2   | 11         | 2          | absent  | 2026-02-05 | null  |
| 3   | 76         | 1          | present | 2026-02-23 | null  |
| 4   | 76         | 2          | present | 2026-02-23 | null  |

**Key Points:**
- ✅ One record per student + session combination
- ✅ Each student has their OWN date for each session
- ✅ Stores the actual attendance status
- ✅ This is where the date is NOW stored (after the fix)

---

## 🔗 How They Work Together

### Relationship:
```
sessions (1) ←→ (Many) attendance
```

One session template can have many attendance records (one per student).

### Example Flow:

**1. System Setup (sessions table):**
```
Month 1 has 4 sessions defined:
- Session 1 (id: 1)
- Session 2 (id: 2)
- Session 3 (id: 3)
- Session 4 (id: 4)
```

**2. Students Enroll:**
```
- Farida (id: 11) is in Month 1
- Sara (id: 76) is in Month 1
```

**3. Attendance Marking (attendance table):**
```
When Farida attends Session 1 on Feb 22:
→ INSERT INTO attendance (student_id: 11, session_id: 1, status: 'present', date: '2026-02-22')

When Sara attends Session 1 on Feb 23:
→ INSERT INTO attendance (student_id: 76, session_id: 1, status: 'present', date: '2026-02-23')
```

**Result:**
- Both students attended Session 1
- But each has their OWN date!
- Farida: 22/02
- Sara: 23/02

---

## 🎯 The Bug That Was Fixed

### Before the Fix:
The system was storing dates in the `sessions` table:
```
sessions.session_date = '2026-02-23'
```

**Problem:** All students in Month 1 shared the SAME session record, so when you updated Session 1's date, it changed for EVERYONE!

### After the Fix:
The system now stores dates in the `attendance` table:
```
attendance.date = '2026-02-22' (for Farida)
attendance.date = '2026-02-23' (for Sara)
```

**Solution:** Each student has their OWN attendance record with their OWN date!

---

## 📝 How to View the Data

### View Sessions (Templates):
```sql
SELECT * FROM sessions WHERE level = 'Month 1' ORDER BY session_number;
```

### View Attendance for a Student:
```sql
SELECT 
    s.name as student_name,
    sess.session_number,
    a.status,
    a.date,
    sess.level
FROM attendance a
JOIN students s ON a.student_id = s.id
JOIN sessions sess ON a.session_id = sess.id
WHERE s.id = 11
ORDER BY sess.session_number;
```

### View All Attendance for a Session:
```sql
SELECT 
    s.name as student_name,
    a.status,
    a.date
FROM attendance a
JOIN students s ON a.student_id = s.id
WHERE a.session_id = 1
ORDER BY s.name;
```

---

## 🔍 Quick Reference

| What | Where | Purpose |
|------|-------|---------|
| Session definitions | `sessions` table | Templates for each level |
| Student attendance | `attendance` table | Individual records per student |
| Attendance dates | `attendance.date` | Each student's own date |
| Session dates | `sessions.session_date` | ❌ NOT USED (legacy) |

---

## 💡 Why This Design?

**Advantages:**
1. ✅ Each student can attend on different dates
2. ✅ No conflicts between students
3. ✅ Easy to track individual attendance history
4. ✅ Flexible - students can make up missed sessions

**Example Use Case:**
- Session 1 is scheduled for Monday
- Farida attends on Monday (22/02)
- Sara is sick, attends makeup session on Tuesday (23/02)
- Both marked as attended, but with different dates!

---

## 🎓 Summary

Think of it like this:

**sessions table** = Course syllabus (what sessions exist)
- "Month 1 has 4 sessions"

**attendance table** = Student grade book (who attended when)
- "Farida attended Session 1 on 22/02"
- "Sara attended Session 1 on 23/02"

Each student gets their own row in the attendance table, with their own date!

---

**Created:** February 23, 2026  
**Status:** ✅ Working correctly after bug fix
