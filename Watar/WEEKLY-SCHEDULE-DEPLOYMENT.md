# Weekly Schedule Feature - Deployment Guide

## 📋 Overview
This feature adds a visual weekly calendar for operations managers to maintain a schedule template showing which students typically attend on which days/times. This helps when confirming sessions with students.

---

## ✅ What Was Built

### 1. Database Changes
**New Table: `schedule_templates`**
```sql
CREATE TABLE schedule_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day_of_week TEXT CHECK(day_of_week IN ('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')) NOT NULL,
    time_slot TEXT NOT NULL,
    student_id INTEGER NOT NULL,
    trainer_id INTEGER,
    notes TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (trainer_id) REFERENCES users(id)
)
```

**Important Notes:**
- `student_id` is MANDATORY - each schedule entry is for a specific student
- `trainer_id` references `users` table directly (not `trainers` table)
- `time_slot` is MANDATORY - format: "HH:MM" (e.g., "14:30")
- `is_active` = 1 means active, 0 means soft-deleted

### 2. New Files Created
- `views/pre-schedule.ejs` - Calendar view page
- `create-schedule-templates-table.js` - Database migration script
- `PRE-SCHEDULE-FEATURE.md` - Feature documentation
- `WEEKLY-SCHEDULE-DEPLOYMENT.md` - This deployment guide

### 3. Modified Files
- `server.js` - Added 5 new routes:
  - `GET /pre-schedule` - Main calendar page
  - `GET /pre-schedule/list` - Get all schedules (API)
  - `POST /pre-schedule/add` - Add student to schedule (API)
  - `POST /pre-schedule/update` - Update schedule entry (API)
  - `POST /pre-schedule/delete` - Remove from schedule (API)

- `views/layout.ejs` - Added "Weekly Schedule" menu item for operations_manager and manager roles

### 4. Features
✅ Calendar grid view (7 days × time slots)
✅ Add students to specific day/time slots
✅ Edit existing schedule entries
✅ Delete schedule entries (soft delete)
✅ Assign trainers (optional)
✅ Add notes (optional)
✅ Student name and level displayed on calendar
✅ Trainer name displayed if assigned
✅ Click any schedule block to edit

---

## 🚀 Deployment Steps

### ⚠️ CRITICAL: Backup Database First!

**Before deploying to AWS, BACKUP YOUR DATABASE:**

```bash
# SSH into AWS instance
ssh -i your-key.pem ubuntu@your-aws-ip

# Backup the database
docker cp wattar-academy:/app/wattar.db ./wattar-backup-$(date +%Y%m%d-%H%M%S).db

# Download backup to your local machine (from your local terminal)
scp -i your-key.pem ubuntu@your-aws-ip:~/wattar-backup-*.db ./
```

### Step 1: Deploy Code Changes

**Option A: Using Git (Recommended)**

```bash
# On your local machine, commit and push changes
git add server.js views/layout.ejs views/pre-schedule.ejs create-schedule-templates-table.js
git commit -m "Add weekly schedule feature for operations manager"
git push origin main

# SSH into AWS instance
ssh -i your-key.pem ubuntu@your-aws-ip

# Navigate to project directory
cd wattar-academy

# Pull latest code
git pull origin main

# Restart container to load new code
docker-compose restart
```

**Option B: Manual File Upload (If not using Git)**

Upload these 4 files to AWS:
1. `server.js` → `/home/ubuntu/wattar-academy/server.js`
2. `views/layout.ejs` → `/home/ubuntu/wattar-academy/views/layout.ejs`
3. `views/pre-schedule.ejs` → `/home/ubuntu/wattar-academy/views/pre-schedule.ejs` (NEW FILE)
4. `create-schedule-templates-table.js` → `/home/ubuntu/wattar-academy/create-schedule-templates-table.js` (NEW FILE)

```bash
# From your local machine
scp -i your-key.pem server.js ubuntu@your-aws-ip:~/wattar-academy/
scp -i your-key.pem views/layout.ejs ubuntu@your-aws-ip:~/wattar-academy/views/
scp -i your-key.pem views/pre-schedule.ejs ubuntu@your-aws-ip:~/wattar-academy/views/
scp -i your-key.pem create-schedule-templates-table.js ubuntu@your-aws-ip:~/wattar-academy/

# SSH into AWS and restart
ssh -i your-key.pem ubuntu@your-aws-ip
cd wattar-academy
docker-compose restart
```

### Step 2: Run Database Migration

**⚠️ IMPORTANT: This creates a NEW table - it does NOT modify existing data**

```bash
# Run the migration script inside the container
docker exec wattar-academy node create-schedule-templates-table.js
```

**Expected Output:**
```
Creating schedule_templates table...
✓ Created schedule_templates table
✓ Schedule templates table ready (no example data - add students manually)

✅ Schedule templates table created successfully!
Operations manager can now add students to the weekly schedule.
```

### Step 3: Verify Deployment

1. **Check the application is running:**
```bash
docker-compose ps
# Should show wattar-academy as "Up"
```

2. **Check logs for errors:**
```bash
docker-compose logs -f wattar-academy
# Press Ctrl+C to exit
```

3. **Test in browser:**
   - Go to `http://your-aws-ip:3000`
   - Login as operations_manager (username: operations, password: operations123)
   - You should see "Weekly Schedule" in the sidebar
   - Click it to open the calendar view

4. **Verify database table:**
```bash
docker exec wattar-academy node -e "const db = require('sqlite3').verbose().Database('wattar.db'); db.all('SELECT name FROM sqlite_master WHERE type=\"table\" AND name=\"schedule_templates\"', (e,r) => {console.log(r); process.exit()});"
```

Should output: `[ { name: 'schedule_templates' } ]`

---

## 🧪 Testing Checklist

After deployment, test these scenarios:

### Test 1: Add Student to Schedule
- [ ] Login as operations_manager
- [ ] Click "Weekly Schedule" in sidebar
- [ ] Click "Add Student to Schedule" button
- [ ] Select day (e.g., Sunday)
- [ ] Select student from dropdown
- [ ] Enter time (e.g., 14:00)
- [ ] Optionally select trainer
- [ ] Optionally add notes
- [ ] Click "Add to Schedule"
- [ ] Verify student appears in calendar at correct day/time

### Test 2: Edit Schedule Entry
- [ ] Click on a student block in the calendar
- [ ] Edit modal should open with current values
- [ ] Change day, time, or trainer
- [ ] Click "Update"
- [ ] Verify changes appear in calendar

### Test 3: Delete Schedule Entry
- [ ] Click on a student block
- [ ] Click "Delete" button
- [ ] Confirm deletion
- [ ] Verify student removed from calendar

### Test 4: Trainer Display
- [ ] Add a student with a trainer assigned
- [ ] Verify trainer name appears below student name in calendar block
- [ ] Format should be: 👤 Trainer Name

### Test 5: Reception Access (Read-Only)
- [ ] Login as reception user
- [ ] Verify "Weekly Schedule" appears in menu
- [ ] Open weekly schedule
- [ ] Verify "Add Student" button is hidden
- [ ] Click on student block
- [ ] Verify alert shows "View Only" message
- [ ] ✅ Reception can view but not edit

### Test 6: Trainer Access (Filtered View)
- [ ] Login as trainer user
- [ ] Verify "Weekly Schedule" appears in menu
- [ ] Open weekly schedule
- [ ] Verify only students assigned to this trainer appear
- [ ] Verify "Add Student" button is hidden
- [ ] Click on student block
- [ ] Verify alert shows "View Only" message
- [ ] ✅ Trainer sees only their students (read-only)

---

## 🔧 Troubleshooting

### Issue: "Weekly Schedule" menu item not showing
**Solution:**
- Clear browser cache (Ctrl+Shift+R)
- Verify you're logged in as operations_manager or manager
- Check `docker-compose logs` for errors

### Issue: No trainers in dropdown
**Cause:** No users with role='trainer' exist
**Solution:**
1. Go to User Management page
2. Create users with "Trainer" role
3. Refresh the Weekly Schedule page

**Verify trainers exist:**
```bash
docker exec wattar-academy node -e "const db = require('sqlite3').verbose().Database('wattar.db'); db.all('SELECT id, full_name, role FROM users WHERE role=\"trainer\"', (e,r) => {console.log(r); process.exit()});"
```

### Issue: No students in dropdown
**Cause:** No active students exist
**Solution:**
1. Go to Students page
2. Add students or activate existing ones
3. Refresh the Weekly Schedule page

### Issue: Database error when adding schedule
**Check logs:**
```bash
docker-compose logs wattar-academy | grep -i error
```

**Common causes:**
- Migration script not run
- Database permissions issue
- Invalid student_id or trainer_id

### Issue: Changes not appearing after restart
**Solution:**
```bash
# Full restart
docker-compose down
docker-compose up -d

# Check if container is running
docker-compose ps

# Check logs
docker-compose logs -f wattar-academy
```

---

## 📊 Database Verification Queries

**Check if table exists:**
```bash
docker exec wattar-academy node -e "const db = require('sqlite3').verbose().Database('wattar.db'); db.all('SELECT name FROM sqlite_master WHERE type=\"table\" AND name=\"schedule_templates\"', (e,r) => {console.log(r); process.exit()});"
```

**Count schedule entries:**
```bash
docker exec wattar-academy node -e "const db = require('sqlite3').verbose().Database('wattar.db'); db.all('SELECT COUNT(*) as count FROM schedule_templates WHERE is_active=1', (e,r) => {console.log('Active schedules:', r[0].count); process.exit()});"
```

**View all schedules:**
```bash
docker exec wattar-academy node -e "const db = require('sqlite3').verbose().Database('wattar.db'); db.all('SELECT st.*, s.name as student_name FROM schedule_templates st JOIN students s ON st.student_id=s.id WHERE st.is_active=1', (e,r) => {console.log(JSON.stringify(r, null, 2)); process.exit()});"
```

---

## 🔄 Rollback Plan (If Needed)

If something goes wrong, you can rollback:

### Step 1: Restore Database Backup
```bash
# Stop container
docker-compose down

# Restore backup
cp wattar-backup-YYYYMMDD-HHMMSS.db wattar.db

# Start container
docker-compose up -d
```

### Step 2: Revert Code Changes
```bash
# If using git
git checkout HEAD~1 server.js views/layout.ejs
rm views/pre-schedule.ejs

# Restart
docker-compose restart
```

### Step 3: Remove Table (Optional)
```bash
docker exec wattar-academy node -e "const db = require('sqlite3').verbose().Database('wattar.db'); db.run('DROP TABLE IF EXISTS schedule_templates', (e) => {console.log(e ? 'Error' : 'Table dropped'); process.exit()});"
```

---

## 📝 Post-Deployment Tasks

### 1. Train Operations Manager
Show them how to:
- Add students to the weekly schedule
- Edit schedule entries
- Use the calendar as a reference when confirming sessions

### 2. Populate Initial Schedule
- Operations manager should add all active students to their typical time slots
- This becomes the reference template for session confirmations

### 3. Monitor Usage
- Check logs for any errors
- Ask operations manager for feedback
- Monitor database size (schedule_templates table)

---

## 📈 Success Metrics

After 1 week, verify:
- [ ] Operations manager is using the weekly schedule regularly
- [ ] Schedule entries are being maintained (added/updated)
- [ ] No database errors in logs
- [ ] Session confirmations are easier/faster
- [ ] Fewer scheduling conflicts

---

## 🔐 Security Notes

- Only operations_manager and manager roles can access this feature
- All routes are protected with `requireAuth` and `requireRole` middleware
- Soft delete pattern used (is_active flag) - data is never permanently deleted
- No sensitive data stored in schedule_templates table

---

## 📞 Support

If issues occur during deployment:

1. **Check logs first:**
   ```bash
   docker-compose logs -f wattar-academy
   ```

2. **Verify database:**
   - Use verification queries above
   - Check table structure

3. **Test locally first:**
   - Deploy to local Docker environment
   - Test all features
   - Then deploy to AWS

4. **Backup is your friend:**
   - Always backup before deployment
   - Keep multiple backups
   - Test restore process

---

## ✅ Deployment Checklist

**Pre-Deployment:**
- [ ] Backup AWS database
- [ ] Download backup to local machine
- [ ] Test locally in Docker
- [ ] Review all code changes
- [ ] Read this deployment guide completely

**Deployment:**
- [ ] Upload/pull code changes to AWS
- [ ] Restart container
- [ ] Run migration script
- [ ] Verify table created
- [ ] Check logs for errors

**Post-Deployment:**
- [ ] Test all features (use testing checklist above)
- [ ] Login as operations_manager and verify access
- [ ] Add test schedule entry
- [ ] Edit test entry
- [ ] Delete test entry
- [ ] Verify trainer names display correctly
- [ ] Train operations manager on new feature

**If Issues:**
- [ ] Check troubleshooting section
- [ ] Review logs
- [ ] Rollback if necessary
- [ ] Restore database backup

---

## 📄 Files Changed Summary

### Core Feature Files (MUST DEPLOY):
1. ✅ `views/pre-schedule.ejs` - Calendar view UI (NEW)
2. ✅ `create-schedule-templates-table.js` - Migration script (NEW)
3. ✅ `server.js` - Added 5 routes for pre-schedule management (MODIFIED)
4. ✅ `views/layout.ejs` - Added "Weekly Schedule" menu item (MODIFIED)

### Previously Deployed (Already on AWS):
- `views/session-confirmations.ejs` - Operations manager confirmation page (from previous feature)
- `views/attendance.ejs` - Reception attendance page with confirmation display (from previous feature)
- `views/users.ejs` - User management with operations_manager role (from previous feature)
- `add-operations-manager-role.js` - Migration for operations_manager role (already run)

### Documentation Files (Optional - for reference):
- `WEEKLY-SCHEDULE-DEPLOYMENT.md` - This deployment guide
- `PRE-SCHEDULE-FEATURE.md` - Feature documentation
- `DEPLOY-PRE-SCHEDULE.md` - Quick deployment notes
- `CONFIRMATION-WORKFLOW-COMPLETE.md` - Session confirmation workflow docs
- `OPERATIONS-MANAGER-FEATURE.md` - Operations manager feature docs
- `SESSION-CONFIRMATIONS-UPDATE.md` - Session confirmations update notes
- `STUDENT-NOTES-FEATURE.md` - Student notes feature docs
- `PRE-SCHEDULE-PROPOSAL.md` - Initial proposal document

### Testing/Debug Scripts (DO NOT DEPLOY):
- `check-trainers.js` - Local testing script
- `check-trainers-local.js` - Local testing script
- `test-trainer-query.js` - Local testing script
- `check-students-table.js` - Local testing script
- `check-attendance-data.js` - Local testing script
- `test-dates.js` - Local testing script
- `setup-farida-test.js` - Local testing script
- `set-test-date.js` - Local testing script
- `clear-session-dates.js` - Local testing script
- `fix-attendance-date-bug.js` - Already run migration
- `temp-button-section.txt` - Temporary file
- `views/session-confirmations-fix.txt` - Temporary file
- `views/session-confirmations.ejs.backup` - Backup file

### Database Changes:
1. New table: `schedule_templates` (created by migration script)
2. No changes to existing tables
3. No data migration needed
4. Database file (`wattar.db`) will be modified by migration - BACKUP FIRST!

---

**Deployment Date:** _____________

**Deployed By:** _____________

**Backup Location:** _____________

**Status:** ⬜ Success  ⬜ Failed  ⬜ Rolled Back

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________

---

**Version:** 1.0  
**Last Updated:** February 26, 2026  
**Feature:** Weekly Schedule Template for Operations Manager
