# Wattar Academy Management System - Setup Guide

## Prerequisites

### 1. Install Node.js
1. Go to https://nodejs.org/
2. Download the LTS version (recommended)
3. Run the installer and follow the setup wizard
4. Restart your command prompt/PowerShell

### 2. Verify Installation
Open PowerShell and run:
```bash
node --version
npm --version
```

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Database and Create Sample Data
```bash
node setup-database.js
```

### 3. Start the Application
```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

### 4. Access the Application
Open your browser and go to: http://localhost:3000

**Default Login:**
- Username: `admin`
- Password: `admin123`

## Initial Setup Tasks

### 1. Create User Accounts
1. Login as admin
2. Go to User Management
3. Create accounts for:
   - Reception staff
   - Trainers

### 2. Set Up Classes
1. Go to Classes Management
2. Create classes for each level
3. Assign trainers to classes

### 3. Import Student Data
1. Go to Students Management
2. Add students manually or use the bulk import feature

### 4. Start Using the System
1. Trainers can mark attendance for their classes
2. Reception can manage student enrollment and payments
3. Manager can view reports and manage the system

## Troubleshooting

### Common Issues

**1. Port 3000 already in use:**
```bash
# Kill the process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

**2. Database errors:**
- Delete `wattar.db` file and run `node setup-database.js` again

**3. Permission errors:**
- Run PowerShell as Administrator

### Getting Help
- Check the console for error messages
- Ensure all dependencies are installed
- Verify Node.js version is 14 or higher

## Next Steps After Setup

1. **Phase 1 Testing:**
   - Test user authentication
   - Test student management
   - Test attendance marking
   - Test basic reporting

2. **Data Migration:**
   - Import your existing student data
   - Set up class schedules
   - Assign students to classes

3. **User Training:**
   - Train reception staff on student management
   - Train trainers on attendance marking
   - Show managers the reporting features

4. **Go Live:**
   - Start using for daily operations
   - Monitor for any issues
   - Collect feedback for improvements