# 🚀 Weekly Schedule Feature - Final Deployment Checklist

## ⏰ Estimated Time: 15-20 minutes

---

## 📦 Files to Deploy (4 files)

### Required Files:
- [ ] `server.js` (modified - added routes + permissions)
- [ ] `views/layout.ejs` (modified - menu items for all roles)
- [ ] `views/attendance.ejs` (modified - read-only for operations_manager)
- [ ] `views/pre-schedule.ejs` (NEW - calendar with conflict detection)
- [ ] `create-schedule-templates-table.js` (NEW - migration script)

### DO NOT Deploy:
- ❌ Test scripts (check-*.js, test-*.js)
- ❌ Backup files (*.backup)
- ❌ Temporary files (temp-*.txt)
- ❌ Documentation files (optional, keep local)

---

## 🔥 CRITICAL: Backup First!

```bash
# 1. SSH into AWS
ssh -i your-key.pem ubuntu@your-aws-ip

# 2. Backup database
docker cp wattar-academy:/app/wattar.db ./wattar-backup-$(date +%Y%m%d-%H%M%S).db

# 3. Download backup to local machine (from local terminal)
scp -i your-key.pem ubuntu@your-aws-ip:~/wattar-backup-*.db ./backups/

# 4. Verify backup exists
ls -lh wattar-backup-*.db
```

**✅ Backup completed:** _______________

---

## 📤 Deployment Steps

### Option 1: Using Git (Recommended)

```bash
# On local machine
git add server.js views/layout.ejs views/attendance.ejs views/pre-schedule.ejs create-schedule-templates-table.js
git commit -m "Add weekly schedule feature with permissions and conflict detection"
git push origin main

# On AWS
ssh -i your-key.pem ubuntu@your-aws-ip
cd wattar-academy
git pull origin main
docker-compose restart
```

### Option 2: Manual Upload

```bash
# From local machine
scp -i your-key.pem server.js ubuntu@your-aws-ip:~/wattar-academy/
scp -i your-key.pem views/layout.ejs ubuntu@your-aws-ip:~/wattar-academy/views/
scp -i your-key.pem views/attendance.ejs ubuntu@your-aws-ip:~/wattar-academy/views/
scp -i your-key.pem views/pre-schedule.ejs ubuntu@your-aws-ip:~/wattar-academy/views/
scp -i your-key.pem create-schedule-templates-table.js ubuntu@your-aws-ip:~/wattar-academy/

# On AWS
ssh -i your-key.pem ubuntu@your-aws-ip
cd wattar-academy
docker-compose restart
```

**✅ Files uploaded:** _______________

---

## 🗄️ Database Migration

```bash
# On AWS (after files are uploaded and container restarted)
docker exec wattar-academy node create-schedule-templates-table.js
```

**Expected Output:**
```
Creating schedule_templates table...
✓ Created schedule_templates table
✓ Schedule templates table ready

✅ Schedule templates table created successfully!
```

**✅ Migration completed:** _______________

---

## ✅ Verification Steps

### 1. Check Container Status
```bash
docker-compose ps
# Should show: wattar-academy   Up
```
**✅ Container running:** _______________

### 2. Check Logs
```bash
docker-compose logs -f wattar-academy
# Look for errors, press Ctrl+C to exit
```
**✅ No errors in logs:** _______________

### 3. Verify Table Created
```bash
docker exec wattar-academy node -e "const db = require('sqlite3').verbose().Database('wattar.db'); db.all('SELECT name FROM sqlite_master WHERE type=\"table\" AND name=\"schedule_templates\"', (e,r) => {console.log(r); process.exit()});"
```
**Expected:** `[ { name: 'schedule_templates' } ]`

**✅ Table exists:** _______________

### 4. Test in Browser
- [ ] Go to `http://your-aws-ip:3000`
- [ ] Login as operations_manager (username: operations, password: operations123)
- [ ] Verify "Weekly Schedule" appears in sidebar
- [ ] Click "Weekly Schedule"
- [ ] Calendar page loads successfully

**✅ UI accessible:** _______________

---

## 🧪 Feature Testing

### Test 1: Operations Manager (Read-Only Attendance)
- [ ] Login as operations_manager
- [ ] Go to Attendance page
- [ ] Verify "View Only Mode" badge shows
- [ ] Verify cannot mark attendance (buttons disabled)
- [ ] Verify cannot edit notes (textarea readonly)
- [ ] Verify cannot change month (dropdown disabled)
- [ ] ✅ Operations manager can only view

### Test 2: Reception (Full Access)
- [ ] Login as reception
- [ ] Verify menu shows: Weekly Schedule, Students, Attendance, Cash
- [ ] Verify menu DOES NOT show: Classes, Session Summary, Reports, User Management
- [ ] Go to Attendance page
- [ ] Verify can mark attendance
- [ ] ✅ Reception has correct permissions

### Test 3: Weekly Schedule - Operations Manager
- [ ] Login as operations_manager
- [ ] Click "Weekly Schedule"
- [ ] Verify can add students
- [ ] Verify can edit/delete schedules
- [ ] ✅ Full access to schedule management

### Test 4: Weekly Schedule - Reception (Read-Only)
- [ ] Login as reception
- [ ] Click "Weekly Schedule"
- [ ] Verify "Add Student" button is hidden
- [ ] Click on student block
- [ ] Verify shows "View Only" alert
- [ ] ✅ Reception can view but not edit

### Test 5: Weekly Schedule - Trainer (Filtered)
- [ ] Login as trainer
- [ ] Click "Weekly Schedule"
- [ ] Verify only sees students assigned to them
- [ ] Verify "Add Student" button is hidden
- [ ] ✅ Trainer sees only their students

### Test 6: Conflict Detection
- [ ] Login as operations_manager
- [ ] Add student at 12:00 on Friday
- [ ] Try to add another student at 12:15 on Friday (same trainer)
- [ ] Verify conflict alert shows
- [ ] Verify cannot save overlapping time
- [ ] ✅ Conflict detection working

### Test 7: Time Range Display
- [ ] View weekly schedule
- [ ] Verify each student block shows time range (e.g., "12:00 - 12:45")
- [ ] ✅ Time ranges displayed correctly

**✅ All tests passed:** _______________

---

## 🚨 If Something Goes Wrong

### Rollback Steps:

1. **Stop container:**
```bash
docker-compose down
```

2. **Restore database:**
```bash
cp wattar-backup-YYYYMMDD-HHMMSS.db wattar.db
```

3. **Revert code (if using git):**
```bash
git checkout HEAD~1 server.js views/layout.ejs
rm views/pre-schedule.ejs
```

4. **Restart:**
```bash
docker-compose up -d
```

---

## 📞 Common Issues & Solutions

### Issue: "Weekly Schedule" not showing in menu
**Solution:** 
- Clear browser cache (Ctrl+Shift+R)
- Verify logged in as operations_manager or manager
- Check docker logs for errors

### Issue: No trainers in dropdown
**Solution:**
- Go to User Management
- Create users with "Trainer" role
- Refresh page

### Issue: Container won't start
**Solution:**
```bash
docker-compose logs wattar-academy
# Look for syntax errors in server.js
```

### Issue: Database error
**Solution:**
- Verify migration ran successfully
- Check table exists (use verification query above)
- Restore backup if needed

---

## 📝 Post-Deployment

- [ ] Notify operations manager feature is live
- [ ] Show them how to use the calendar
- [ ] Ask them to add students to schedule
- [ ] Monitor logs for 24 hours
- [ ] Collect feedback after 1 week

---

## ✅ Final Checklist

- [ ] Database backed up
- [ ] Files deployed (4 files)
- [ ] Container restarted
- [ ] Migration script run
- [ ] Table verified
- [ ] UI tested
- [ ] All features working
- [ ] No errors in logs
- [ ] Operations manager notified

---

**Deployment Date:** _______________

**Deployed By:** _______________

**Start Time:** _______________

**End Time:** _______________

**Status:** ⬜ Success  ⬜ Failed  ⬜ Rolled Back

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________

---

## 📚 Reference Documents

- Full deployment guide: `WEEKLY-SCHEDULE-DEPLOYMENT.md`
- Feature documentation: `PRE-SCHEDULE-FEATURE.md`
- Troubleshooting: See WEEKLY-SCHEDULE-DEPLOYMENT.md section 🔧

---

**Good luck with the deployment! 🚀**
