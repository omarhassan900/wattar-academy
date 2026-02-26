# Operations Manager Role - Session Confirmations Feature

## Overview
The Operations Manager role has been added to help manage session confirmations. This role is responsible for calling students the day before their sessions to confirm attendance, then informing the reception team about confirmed sessions.

## Workflow

### 1. Operations Manager Responsibilities
- **Call Students**: Contact students 1 day before their scheduled session
- **Confirm Attendance**: Ask if the student will attend the session
- **Record Status**: Mark each student as "Confirmed" or "Not Confirmed"
- **Add Notes**: Document any important information from the call
- **Inform Reception**: Reception team can see confirmation status when marking attendance

### 2. Reception Team
- Reception can see which students have been confirmed
- Reception marks actual attendance during/after the session
- Confirmation status helps reception prepare for the session

## Features

### Session Confirmations Page
- **Upcoming Sessions View**: Shows all sessions for the next 7 days
- **Grouped by Date**: Sessions organized by date for easy planning
- **Student Information**: 
  - Student name and level
  - Phone numbers (student and parent)
  - Current confirmation status
- **Quick Actions**:
  - ✓ Mark as Confirmed
  - ✗ Mark as Not Confirmed
  - 📝 Add/Edit Notes
- **Status Tracking**:
  - Confirmed (green badge)
  - Not Confirmed (red badge)
  - Pending (gray badge)
- **Call Links**: Click phone numbers to call directly (on mobile devices)

### Permissions

#### Operations Manager Can:
- ✓ View all students (read-only)
- ✓ View attendance page (read-only, cannot mark attendance)
- ✓ Access session confirmations page
- ✓ Mark students as confirmed/not confirmed
- ✓ Add confirmation notes
- ✓ See upcoming sessions (next 7 days)

#### Operations Manager Cannot:
- ✗ Edit student information
- ✗ Mark attendance
- ✗ Access dashboard
- ✗ Manage cash/payments
- ✗ Manage users
- ✗ Edit classes

## Database Changes

### New Table: `session_confirmations`
```sql
CREATE TABLE session_confirmations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    session_id INTEGER NOT NULL,
    confirmation_status TEXT CHECK(confirmation_status IN ('confirmed', 'not_confirmed', 'pending')) DEFAULT 'pending',
    confirmation_notes TEXT,
    confirmed_by INTEGER,
    confirmed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (session_id) REFERENCES sessions(id),
    FOREIGN KEY (confirmed_by) REFERENCES users(id),
    UNIQUE(student_id, session_id)
)
```

### Updated Table: `users`
- Added new role: `'operations_manager'`
- Role constraint updated: `CHECK(role IN ('manager', 'reception', 'trainer', 'operations_manager'))`

## Installation

### Local Development
1. Run the migration script:
   ```bash
   node add-operations-manager-role.js
   ```

2. Restart the application:
   ```bash
   npm start
   ```

3. Login with the sample operations manager account:
   - Username: `operations`
   - Password: `operations123`

### Docker Deployment
1. Copy the migration script to the container:
   ```bash
   docker cp add-operations-manager-role.js wattar-academy:/app/
   ```

2. Run the migration inside the container:
   ```bash
   docker exec wattar-academy node add-operations-manager-role.js
   ```

3. Restart the container:
   ```bash
   docker-compose restart
   ```

### AWS EC2 Deployment
1. SSH into your EC2 instance
2. Navigate to the project directory:
   ```bash
   cd ~/wattar-academy/Watar
   ```

3. Pull the latest changes:
   ```bash
   git pull origin main
   ```

4. Run migration inside Docker:
   ```bash
   sudo docker-compose exec wattar-academy node add-operations-manager-role.js
   ```

5. Restart the container:
   ```bash
   sudo docker-compose restart
   ```

## Usage Guide

### For Operations Manager

1. **Login** with your operations manager credentials

2. **Navigate to Session Confirmations**
   - Click "Session Confirmations" in the sidebar
   - You'll see all upcoming sessions for the next 7 days

3. **Review Tomorrow's Sessions**
   - Sessions are grouped by date
   - Focus on "Tomorrow" section for calling students

4. **Call Students**
   - Click the phone number to call (on mobile)
   - Or manually dial the student/parent phone number

5. **Mark Confirmation Status**
   - After calling, click:
     - ✓ (green button) if student confirmed
     - ✗ (red button) if student cannot attend
   - Add notes if needed (click 📝 button)

6. **Add Notes** (optional)
   - Click the note icon (📝)
   - Add any important information:
     - "Student will be 15 minutes late"
     - "Parent requested to reschedule"
     - "Student confirmed, very excited"
   - Click "Save Note"

7. **Track Progress**
   - See confirmation counts at the top of each session
   - Green badge = Confirmed
   - Red badge = Not Confirmed
   - Gray badge = Pending (not called yet)

### For Reception Team

1. **View Confirmation Status**
   - When marking attendance, reception can see which students were confirmed
   - This helps prepare for the session

2. **Mark Actual Attendance**
   - Reception marks who actually attended
   - Confirmation status is separate from attendance status

## Sample Operations Manager Account

A sample account is created during migration:
- **Username**: `operations`
- **Password**: `operations123`

**Important**: Change this password after first login for security!

## Creating Additional Operations Manager Users

### Via User Management (Manager Only) ✅
1. Login as manager
2. Go to "User Management"
3. Click "Add New User"
4. Fill in details:
   - Username: (choose username)
   - Password: (set password)
   - Full Name: (employee name)
   - Role: Select "Operations Manager - Session confirmations"
5. Click "Add User"

The Operations Manager role is now available in the dropdown with a clear description of its purpose.

### Via Database (Advanced)
```javascript
const bcrypt = require('bcrypt');
const password = bcrypt.hashSync('your-password', 10);

db.run(`
    INSERT INTO users (username, password_hash, full_name, role, status)
    VALUES ('username', ?, 'Full Name', 'operations_manager', 'active')
`, [password]);
```

## Benefits

1. **Better Communication**: Students are contacted before sessions
2. **Improved Attendance**: Confirmed students are more likely to attend
3. **Better Planning**: Reception knows how many students to expect
4. **Reduced No-Shows**: Early confirmation reduces last-minute cancellations
5. **Clear Workflow**: Separation of confirmation (operations) and attendance (reception)
6. **Audit Trail**: Track who confirmed, when, and any notes

## Troubleshooting

### Operations Manager Cannot Login
- Verify the user exists: Check User Management page
- Verify role is set to 'operations_manager'
- Try resetting the password

### Session Confirmations Page is Empty
- Check if there are active students
- Check if sessions are scheduled for the next 7 days
- Verify sessions table has data

### Cannot Mark Confirmation Status
- Check browser console for errors
- Verify you're logged in as operations_manager or manager
- Try refreshing the page

### Phone Numbers Not Showing
- Verify students have phone numbers in their profile
- Check both "phone" and "parent_phone" fields

## Future Enhancements (Optional)

- SMS integration for automated reminders
- Email notifications to reception about confirmations
- Confirmation statistics and reports
- Bulk confirmation actions
- Filter by level/instrument
- Export confirmation report
- Integration with calendar apps

## Technical Details

### API Endpoints

#### GET /session-confirmations
- **Access**: operations_manager, manager
- **Returns**: Upcoming sessions with confirmation status
- **Query**: Next 7 days of sessions

#### POST /session-confirmations/update
- **Access**: operations_manager, manager
- **Body**: 
  ```json
  {
    "student_id": 123,
    "session_id": 456,
    "confirmation_status": "confirmed",
    "confirmation_notes": "Student confirmed"
  }
  ```
- **Returns**: Success/error message

### Files Modified
- `server.js`: Added routes and role checks
- `views/layout.ejs`: Added menu item for operations_manager
- `views/session-confirmations.ejs`: New page for confirmations
- Database: Added session_confirmations table, updated users table

### Files Created
- `add-operations-manager-role.js`: Migration script
- `OPERATIONS-MANAGER-FEATURE.md`: This documentation

## Support

For issues or questions:
1. Check this documentation
2. Review the troubleshooting section
3. Contact the system administrator
4. Check application logs for errors

---

**Last Updated**: February 2026
**Version**: 1.0
