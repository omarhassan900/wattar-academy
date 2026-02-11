# Wattar Academy Management System

A comprehensive web-based management system for Wattar Music Academy to handle student enrollment, attendance tracking, financial management, and trainer coordination.

## Project Overview

**Current Situation:**
- 96+ students across 6 levels
- Currently using Google Sheets (difficult to manage and analyze)
- 5 users: Manager, Reception staff, and 3 Trainers

**Solution:**
Modern web application with role-based access, real-time reporting, and mobile-friendly interface.

## Features

### Phase 1 (Core Foundation)
- ✅ User management with role-based access
- ✅ Student enrollment and profile management
- ✅ Class scheduling and assignments
- ✅ Attendance tracking (trainer-specific)
- ✅ Basic reporting and statistics
- ✅ Data export functionality

### Phase 2 (Enhanced Features)
- 🔄 Student progress tracking
- 🔄 Financial management (payments, cash flow)
- 🔄 Trainer salary calculations
- 🔄 Advanced reporting

### Phase 3 (Advanced Features)
- ⏳ Parent portal
- ⏳ Mobile app
- ⏳ Advanced analytics
- ⏳ Automated notifications

## User Roles

### Manager
- Full system access
- Academy-wide statistics and reports
- Financial oversight
- User management

### Reception Staff
- Student enrollment and management
- Payment processing
- General attendance oversight
- Customer service

### Trainers
- Class-specific attendance marking
- Student progress tracking
- Personal teaching statistics
- Mobile-friendly interface

## Technology Stack

- **Backend:** Node.js with Express
- **Database:** SQLite (local) → PostgreSQL (production)
- **Frontend:** EJS templates with Bootstrap
- **Hosting:** AWS Free Tier
- **Authentication:** Session-based with role management

## Installation & Setup

### Local Development
```bash
# Clone the repository
git clone [repository-url]
cd wattar-academy-management

# Install dependencies
npm install

# Initialize database
node migrate-data.js

# Start development server
npm run dev
```

### Production Deployment (AWS)
- EC2 t2.micro instance (Free Tier)
- RDS PostgreSQL (Free Tier)
- Route 53 for domain management

## Project Structure

```
wattar-academy-management/
├── docs/                   # Project documentation
│   ├── project-plan.md
│   ├── user-stories.md
│   ├── database-design.md
│   └── current-data-analysis.md
├── views/                  # EJS templates
│   ├── layout.ejs
│   ├── dashboard.ejs
│   ├── students.ejs
│   ├── attendance.ejs
│   └── reports.ejs
├── public/                 # Static assets
├── server.js              # Main application server
├── migrate-data.js        # Data migration script
└── package.json
```

## Documentation

- [Project Plan](docs/project-plan.md) - Overall project roadmap and phases
- [User Stories](docs/user-stories.md) - Detailed requirements by user role
- [Database Design](docs/database-design.md) - Complete database schema
- [Current Data Analysis](docs/current-data-analysis.md) - Analysis of existing Google Sheets data

## Getting Started

1. **Review Documentation:** Start with the project plan and user stories
2. **Set Up Local Environment:** Follow installation instructions
3. **Import Existing Data:** Use the migration script for current student data
4. **Test User Roles:** Create test accounts for each role
5. **Deploy to AWS:** When ready for production use

## Support & Maintenance

- **Data Backup:** Automated daily backups
- **Updates:** Regular feature updates based on user feedback
- **Support:** Direct support for academy staff
- **Training:** User training sessions for all roles

## Cost Estimation

### Development Phase
- **Free** (using AWS Free Tier)

### Production Phase (after 12 months)
- **Monthly Cost:** ~$25-30/month
- **Annual Cost:** ~$300-360/year
- **Cost per User:** ~$5-6/month per user

## Contact

For questions, support, or feature requests, contact the development team.

---

**Status:** In Development - Phase 1  
**Last Updated:** January 2026