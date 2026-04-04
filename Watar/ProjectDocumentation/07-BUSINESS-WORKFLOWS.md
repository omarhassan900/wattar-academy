# Business Workflows

## 1. New Student Enrollment (via Sales Pipeline)

```
Lead Created (Sales)
    │
    ▼
Calls & Follow-ups (Sales)
    │ outcome: interested
    ▼
Trial Scheduled (Operations Manager)
    │ assigns date, time, trainer
    ▼
Trial Happens
    │
    ▼
Trial Result (Reception)
    ├── enrolled → Auto-creates Student record
    │                 │
    │                 ▼
    │            Student appears in:
    │            - Students list
    │            - Attendance system
    │            - Available for scheduling
    │
    └── not_interested → Lead closed
```

## 2. Direct Student Enrollment

```
Reception/Manager adds student manually
    │
    ▼
Student record created (status: active)
    │
    ▼
Assigned to trainer + instrument
    │
    ▼
Added to Weekly Schedule (Operations Manager)
    │
    ▼
Ready for attendance tracking
```

## 3. Weekly Session Flow

```
Weekly Schedule exists (template)
    │
    ▼
Operations Manager calls students to confirm
(Session Confirmations page)
    │
    ├── confirmed → Student will attend
    ├── not_confirmed → Student won't come
    └── pending → Not yet contacted
    │
    ▼
Student attends session
    │
    ▼
Reception marks attendance
(Attendance page → select level → mark present/absent/late/excused)
    │
    ▼
After 4 sessions in a month:
    ├── Trainer evaluates student (Evaluations)
    ├── Student can give feedback (Feedback link)
    └── Student advances to next month level
```

## 4. Attendance Tracking Flow

```
Select Level (e.g., "Month 5")
    │
    ▼
See all active students at that level
    │
    ▼
For each student, mark Sessions 1-4:
    - Present ✅
    - Absent ❌
    - Late ⏰
    - Excused 📝
    │
    ▼
Optionally set session dates
    │
    ▼
Add level notes per student
    │
    ▼
After completing 4 sessions → advance to next month
```

## 5. Cash Management Flow

```
Transaction occurs (payment received or expense paid)
    │
    ▼
Reception/Manager adds transaction:
    - Type: income or expense
    - Amount
    - Category (from predefined list)
    - Payment method
    - Description
    │
    ▼
Shows in Cash Management page
    │
    ▼
Manager views monthly reports on Dashboard
    - Total income vs expenses
    - Category breakdowns
    - Monthly trends
```

## 6. Band Management Flow

```
Manager adds active student to band
    │ assigns instrument role
    ▼
Band member appears in current cycle
    │
    ▼
Mark rehearsal attendance (4 rehearsals per cycle)
    │
    ▼
After 4 rehearsals → advance to next cycle
    │
    ▼
History preserved across cycles
```

## 7. Student Level Progression

```
Student starts at "Month 1"
    │
    ▼
Attends 4 sessions per month
    │
    ▼
After completing sessions → Reception advances level
    │ (POST /api/update-student-month)
    ▼
Student moves to "Month 2"
    │
    ▼
... continues through Month 48
    │
    ▼
After Month 48 → Student can be marked "graduated"
```

## 8. Evaluation & Feedback Cycle

```
Student completes 4th session of a month
    │
    ▼
Trainer fills evaluation:
    - Attitude rating
    - Commitment rating
    - Development rating
    - Notes
    │
    ▼
Staff generates feedback link (unique token)
    │
    ▼
Link sent to student/parent
    │
    ▼
Student opens link (no login needed)
    │
    ▼
Student rates:
    - Trainer quality
    - Their own development
    - Overall experience
    - Optional notes
    │
    ▼
Feedback stored and viewable by staff
```
