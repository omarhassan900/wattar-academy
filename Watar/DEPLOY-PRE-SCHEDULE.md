# Deploy Pre-Schedule Feature

## Quick Deployment Guide

### Local Deployment

1. **Create the database table:**
```bash
node create-schedule-templates-table.js
```

2. **Restart the application:**
```bash
npm start
```

3. **Access the feature:**
- Login as operations_manager or manager
- Click "Weekly Schedule" in the sidebar
- Add students to their typical weekly time slots

### AWS Deployment

1. **Copy the migration script to the container:**
```bash
docker cp create-schedule-templates-table.js wattar-academy:/app/
```

2. **Run the migration inside the container:**
```bash
docker exec wattar-academy node create-schedule-templates-table.js
```

3. **Restart the container:**
```bash
docker restart wattar-academy
```

4. **Verify:**
- Open your browser to your AWS instance
- Login as operations_manager
- You should see "Weekly Schedule" in the menu

## What Changed

### Database:
- New table: `schedule_templates`
- Stores: student_id, day_of_week, time_slot, trainer_id, notes

### Files Modified:
- `server.js` - Added 5 new routes for pre-schedule management
- `views/layout.ejs` - Added "Weekly Schedule" menu item
- `views/pre-schedule.ejs` - New calendar view page
- `create-schedule-templates-table.js` - Database migration script

### Features:
- ✅ Calendar view showing weekly schedule
- ✅ Add students to specific day/time slots
- ✅ Edit existing schedule entries
- ✅ Delete schedule entries
- ✅ Assign trainers (optional)
- ✅ Add notes (optional)
- ✅ Student and time are mandatory

## Usage

1. **Add a student to the schedule:**
   - Click "Add Student to Schedule"
   - Select day (required)
   - Select student (required)
   - Enter time (required)
   - Optionally select trainer
   - Optionally add notes
   - Click "Add to Schedule"

2. **Edit a schedule entry:**
   - Click on any student block in the calendar
   - Modify the details
   - Click "Update"

3. **Delete a schedule entry:**
   - Click on the student block
   - Click "Delete" button
   - Confirm deletion

## Troubleshooting

### Error: "Database error"
- Make sure you ran the migration script
- Check that the table was created: `docker exec wattar-academy sqlite3 wattar.db "SELECT * FROM schedule_templates;"`

### Students not showing in dropdown
- Verify students exist: `docker exec wattar-academy sqlite3 wattar.db "SELECT COUNT(*) FROM students WHERE status='active';"`
- Check server logs for errors

### Calendar not displaying
- Check browser console for JavaScript errors
- Verify the page loaded correctly
- Try refreshing the page

## Next Steps

After deployment, the operations manager should:
1. Add all active students to their typical weekly time slots
2. Assign trainers where known
3. Add any special notes (e.g., "Bring guitar", "Advanced group")
4. Use this calendar as a reference when confirming sessions with students

---

**Status**: Ready to Deploy
**Date**: February 2026
