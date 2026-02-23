# Attendance Date Bug Fix

## 🐛 Problem Description

When updating attendance status for a specific session for one student, the date was being updated for ALL students in the same level/month for that session number.

### Root Cause

The `sessions` table has a UNIQUE constraint on `(level, session_number)`, meaning there's only ONE session record shared by ALL students in the same level. When the system updated the `session_date` in the `sessions` table, it affected all students using that session.

**Example:**
- Student A in "Month 1" marks Session 1 as attended on Feb 20
- Student B in "Month 1" marks Session 1 as attended on Feb 22
- Result: BOTH students show Feb 22 (the last update) ❌

## ✅ Solution

Store the attendance date in the `attendance` table instead of the `sessions` table. This way, each student has their own date for each session.

### Changes Made

1. **Modified `/attendance/save-all` endpoint** (server.js)
   - Now stores date in `attendance.date` column
   - Removed code that updates `sessions.session_date`
   - Each student's attendance record has its own date

2. **Updated attendance query** (server.js)
   - Changed to read date from `attendance.date` instead of `sessions.session_date`
   - Each student now displays their own attendance date

3. **Created migration script** (fix-attendance-date-bug.js)
   - Ensures `date` column exists in `attendance` table
   - Migrates existing session dates to attendance records

## 🚀 How to Apply the Fix

### Step 1: Run the Migration Script

```bash
# On your local machine or EC2 instance
node fix-attendance-date-bug.js
```

This will:
- Add the `date` column to the `attendance` table (if not exists)
- Copy existing session dates to attendance records
- Preserve all existing data

### Step 2: Restart Your Application

**Local (Docker):**
```bash
docker-compose restart
```

**AWS EC2 (Docker):**
```bash
sudo docker-compose restart
```

**AWS EC2 (PM2):**
```bash
pm2 restart wattar-academy
```

### Step 3: Test the Fix

1. Go to the Attendance page
2. Mark Session 1 for Student A with today's date
3. Mark Session 1 for Student B with a different action
4. Verify that each student shows their own date ✅

## 📊 Database Schema Changes

### Before:
```sql
-- attendance table
CREATE TABLE attendance (
    id INTEGER PRIMARY KEY,
    student_id INTEGER,
    session_id INTEGER,
    status TEXT,
    marked_by INTEGER,
    created_at DATETIME
);

-- Date was stored in sessions table (shared by all students)
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY,
    level TEXT,
    session_number INTEGER,
    session_date DATE,  -- ❌ Shared by all students
    ...
);
```

### After:
```sql
-- attendance table
CREATE TABLE attendance (
    id INTEGER PRIMARY KEY,
    student_id INTEGER,
    session_id INTEGER,
    status TEXT,
    date DATE,  -- ✅ Unique per student
    marked_by INTEGER,
    created_at DATETIME
);

-- sessions table (date no longer used)
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY,
    level TEXT,
    session_number INTEGER,
    session_date DATE,  -- No longer updated
    ...
);
```

## 🔍 Technical Details

### Code Changes

**Before (Buggy Code):**
```javascript
// This updated the shared session date
const dateStmt = db.prepare("UPDATE sessions SET session_date = ? WHERE id = ?");
sessionIds.forEach(sessionId => {
    dateStmt.run(today, sessionId);
});
```

**After (Fixed Code):**
```javascript
// Now stores date per student in attendance table
const stmt = db.prepare(`
    INSERT INTO attendance (student_id, session_id, status, date, marked_by, created_at) 
    VALUES (?, ?, ?, ?, ?, datetime('now'))
`);
attendance.forEach(record => {
    stmt.run(record.student_id, record.session_id, dbStatus, today, user.id);
});
```

### Query Changes

**Before:**
```javascript
// Read date from sessions table (shared)
session_date: session.session_date
```

**After:**
```javascript
// Read date from attendance table (per student)
session_date: attendance.date || null
```

## ✅ Benefits

1. **Accurate Dates**: Each student has their own attendance date
2. **No Conflicts**: Updating one student doesn't affect others
3. **Better Tracking**: Can see exactly when each student attended
4. **Data Integrity**: Dates are tied to specific attendance records

## 🧪 Testing Checklist

- [ ] Run migration script successfully
- [ ] Restart application
- [ ] Mark attendance for Student A on Session 1
- [ ] Mark attendance for Student B on Session 1 (different day)
- [ ] Verify Student A shows their date
- [ ] Verify Student B shows their date
- [ ] Verify dates don't overwrite each other
- [ ] Test with multiple sessions (1, 2, 3, 4)
- [ ] Test with different levels/months
- [ ] Export to CSV and verify dates are correct

## 📝 Notes

- Existing attendance data is preserved
- The `sessions.session_date` column is no longer used but kept for backward compatibility
- No data loss during migration
- The fix is backward compatible

## 🆘 Rollback (If Needed)

If you need to rollback:

1. Restore from backup:
```bash
cp wattar_backup.db wattar.db
```

2. Or manually revert the code changes in server.js

## 📞 Support

If you encounter any issues:
1. Check the migration script output for errors
2. Verify the `date` column exists: `sqlite3 wattar.db "PRAGMA table_info(attendance);"`
3. Check application logs: `docker-compose logs` or `pm2 logs wattar-academy`

---

**Fix Applied:** February 23, 2026  
**Status:** ✅ Ready for Production  
**Impact:** Low (backward compatible, no data loss)
