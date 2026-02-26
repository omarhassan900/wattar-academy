# Operations Manager Role - Quick Start Guide

## What is the Operations Manager Role?

The Operations Manager calls students the day before their session to confirm they will attend. This helps:
- Reduce no-shows
- Better planning for reception
- Improved communication with students

## Quick Setup

### Local Development
```bash
# Run migration
node add-operations-manager-role.js

# Restart app
npm start
```

### Docker (Local or AWS)
```bash
# If on AWS, SSH first
ssh ubuntu@your-ec2-ip

# Navigate to project
cd ~/wattar-academy/Watar

# Pull latest code
git pull origin main

# Run migration inside Docker
sudo docker-compose exec wattar-academy node add-operations-manager-role.js

# Restart
sudo docker-compose restart
```

## Default Login
- **Username**: `operations`
- **Password**: `operations123`

⚠️ **Change this password after first login!**

## How to Use

### 1. Login
Login with operations manager credentials

### 2. Go to Session Confirmations
Click "Session Confirmations" in the sidebar

### 3. Call Students
- See all sessions for next 7 days
- Focus on "Tomorrow" section
- Click phone numbers to call (mobile)

### 4. Mark Status
After calling:
- Click ✓ (green) = Confirmed
- Click ✗ (red) = Not Confirmed
- Click 📝 (blue) = Add notes

### 5. Done!
Reception will see confirmation status when marking attendance

## What Operations Manager Can Do
✓ View students (read-only)
✓ View attendance (read-only)
✓ Confirm sessions
✓ Add confirmation notes

## What Operations Manager Cannot Do
✗ Edit students
✗ Mark attendance
✗ Access dashboard
✗ Manage cash/payments

## Need Help?
See full documentation: `OPERATIONS-MANAGER-FEATURE.md`
