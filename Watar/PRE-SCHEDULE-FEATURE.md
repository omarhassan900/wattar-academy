# Pre-Schedule Management Feature - Calendar View

## Overview
A visual weekly calendar system for operations managers to maintain a reference schedule template. This helps when calling students to confirm sessions by showing the typical weekly schedule.

## Key Features

### 1. Calendar View
- **Weekly grid layout** showing all 7 days
- **Time slots** displayed vertically (8:00 AM - 8:00 PM)
- **Visual schedule blocks** showing level, trainer, and notes
- **Color-coded** for easy identification
- **Click to edit** any time slot

### 2. Schedule Management
- **Add time slots**: Day, time, level, trainer (optional), notes
- **Edit time slots**: Click any schedule block to modify
- **Delete time slots**: Remove slots that are no longer needed
- **Flexible**: No rigid capacity limits, just a reference template

### 3. Integration with Confirmations
- Operations manager can reference this schedule when calling students
- Helps suggest appropriate times based on typical schedule
- Not enforced - actual session dates are still flexible

## Database Structure

### Table: `schedule_templates`
```sql
CREATE TABLE schedule_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day_of_week TEXT CHECK(day_of_week IN ('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')) NOT NULL,
    time_slot TEXT NOT NULL,
    level TEXT CHECK(level IN ('Level One', 'Level Two', 'Level Three', 'Level Four', 'Level Five', 'Level Six')) NOT NULL,
    trainer_id INTEGER,
    notes TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trainer_id) REFERENCES trainers(id)
)
```

## User Interface

### Calendar Grid
```
Time    | Sunday | Monday | Tuesday | Wednesday | Thursday | Friday | Saturday
--------|--------|--------|---------|-----------|----------|--------|----------
08:00   |        |        |         |           |          |        |
09:00   |        |        |         |           |          |        |
10:00   | Level 1|        |         |           |          |        |
        | Trainer|        |         |           |          |        |
11:00   |        |        |         |           |          |        |
...
```

### Schedule Block Display
Each time slot shows:
- **Level badge** (e.g., "Level One")
- **Trainer name** (if assigned)
- **Notes** (e.g., "Beginner group", "Advanced students")

### Actions
- **Click schedule block** → Opens edit modal
- **Add Time Slot button** → Opens add modal
- **Edit modal** → Update or delete time slot

## Workflow

### For Operations Manager:

1. **Setup Weekly Schedule**
   - Go to "Weekly Schedule" page
   - Add typical time slots for each level
   - Assign trainers if known
   - Add notes for context

2. **Reference When Confirming**
   - Open "Session Confirmations" page
   - Call student to confirm next session
   - Reference "Weekly Schedule" to suggest appropriate time
   - Confirm with actual date/time (may differ from template)

3. **Update Schedule as Needed**
   - Add new time slots when schedule changes
   - Edit existing slots to update trainer or notes
   - Delete slots that are no longer used

## API Endpoints

### GET `/pre-schedule`
- Renders the weekly schedule calendar page
- Access: operations_manager, manager

### GET `/pre-schedule/list`
- Returns all active schedule templates
- Response: `{ success: true, schedules: [...] }`

### POST `/pre-schedule/add`
- Adds a new time slot to the schedule
- Body: `{ day_of_week, time_slot, level, trainer_id?, notes? }`
- Response: `{ success: true, message, id }`

### POST `/pre-schedule/update`
- Updates an existing time slot
- Body: `{ id, day_of_week, time_slot, level, trainer_id?, notes? }`
- Response: `{ success: true, message }`

### POST `/pre-schedule/delete`
- Soft deletes a time slot (sets is_active = 0)
- Body: `{ id }`
- Response: `{ success: true, message }`

## Installation Steps

### 1. Create Database Table
```bash
# Local
node create-schedule-templates-table.js

# AWS (using Docker)
docker cp create-schedule-templates-table.js wattar-academy:/app/
docker exec wattar-academy node create-schedule-templates-table.js
```

### 2. Restart Application
```bash
# Local
npm start

# AWS
docker restart wattar-academy
```

### 3. Access the Feature
- Login as operations_manager or manager
- Click "Weekly Schedule" in the sidebar
- Start adding your typical weekly schedule

## Benefits

### For Operations Manager:
- **Visual reference** when calling students
- **Easy to maintain** typical schedule
- **Quick lookup** of available time slots
- **Trainer assignments** visible at a glance

### For the Academy:
- **Better scheduling** with consistent time slots
- **Reduced conflicts** by referencing template
- **Improved communication** about typical schedule
- **Flexibility maintained** - template is just a guide

### For Students:
- **Consistent schedule** makes planning easier
- **Know typical times** for their level
- **Better experience** with organized scheduling

## Design Decisions

### Why Calendar View?
- More intuitive than list view
- Easy to see weekly patterns
- Visual identification of busy/free times
- Familiar interface (like Google Calendar)

### Why Template (Not Rigid Schedule)?
- Sessions dates are flexible (as per requirement)
- Template is a reference, not enforcement
- Actual confirmations can differ from template
- Allows for special circumstances

### Why Soft Delete?
- Preserve history of schedule changes
- Can restore if needed
- Audit trail for schedule modifications

## Future Enhancements (Optional)

- **Drag and drop** to move time slots
- **Copy week** to duplicate schedule
- **Print view** for physical reference
- **Student capacity** per time slot (if needed later)
- **Recurring patterns** (e.g., every Monday at 10:00)
- **Color coding** by level or trainer
- **Export to PDF** or calendar format

## Technical Notes

### Frontend
- Bootstrap 5 for responsive grid
- Vanilla JavaScript (no framework needed)
- Modal dialogs for add/edit
- AJAX for all operations (no page reload)

### Backend
- Express.js routes
- SQLite database
- Role-based access control
- Soft delete pattern

### Security
- Only operations_manager and manager can access
- All operations require authentication
- Input validation on all fields
- SQL injection protection (parameterized queries)

---

**Status**: ✅ Ready to Deploy
**Last Updated**: February 2026
**Version**: 1.0
