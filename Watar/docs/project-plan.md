# Wattar Academy Management System - Project Plan

## Project Overview
**Academy:** Wattar Music Academy  
**Current Capacity:** 96 students  
**Levels:** 6 levels  
**Users:** ~5 users (Manager, Reception, 3 Trainers)  

## Current Pain Points
- Using Google Sheets for attendance, cash flow, and trainer salaries
- Data is not readable except by employees
- Very hard to extract statistics or create dashboards
- Simple but inefficient system

## Phase 1: Core Foundation (Immediate Impact)
**Timeline:** 2-3 weeks  
**Users:** Manager + Reception Girl + Trainers

### Priority Features:
1. **User Management & Roles**
   - Manager: Full access to everything
   - Reception: Student management, attendance, payments
   - Trainers: Their classes only, attendance marking, student progress

2. **Student Management**
   - Add/edit student profiles
   - Assign students to trainers/classes
   - Track enrollment dates and levels

3. **Class & Schedule Management**
   - Create classes with assigned trainers
   - Schedule management
   - Student-class assignments

4. **Attendance Tracking**
   - Trainers can mark attendance for their own classes
   - Daily attendance marking per class
   - Quick bulk actions
   - Attendance history view

5. **Basic Reporting**
   - Attendance statistics (filtered by trainer for trainers)
   - Class performance reports
   - Export functionality

## Phase 2: Enhanced Features (3-4 weeks later)
1. **Student Progress Tracking**
   - Trainers can add progress notes
   - Level advancement tracking
   - Performance assessments

2. **Financial Management**
   - Payment tracking
   - Cash flow management
   - Trainer salary calculations based on classes/attendance

## Phase 3: Advanced Features (2-3 months later)
1. **Parent Portal**
2. **Advanced reporting and analytics**
3. **Mobile-friendly interface**

## Technology Stack
- **Web Application** (accessible from any device)
- **Local hosting** initially (runs on your computer/local server)
- **SQLite database** (simple, no setup required)
- **Export functionality** to Excel/CSV (maintains compatibility with current workflow)

## AWS Deployment Plan
### Free Resources Available:
- **EC2 t2.micro instance** (750 hours/month - basically 24/7 for a year)
- **RDS MySQL/PostgreSQL** (20GB storage, 750 hours/month)
- **S3 storage** (5GB for file uploads/backups)

### Estimated Monthly Costs After Free Tier:
- **EC2 t2.micro:** ~$8-10/month
- **RDS db.t3.micro:** ~$15-20/month
- **Total:** ~$25-30/month

### Deployment Strategy:
1. **Start Local** (Phase 1) - Build and test everything locally
2. **Deploy to AWS** (Phase 1 completion) - Move to cloud when ready
3. **Scale as needed** - Upgrade resources if you grow

## Data Migration Strategy
- Import existing student data from CSV
- Keep historical attendance data where possible
- Start fresh with clean structure for new records

## Immediate Benefits
1. **Reception girl can easily mark attendance** (biggest pain point solved)
2. **Instant statistics** - no more manual calculations
3. **Professional reports** you can share with stakeholders
4. **Data backup** - no more risk of losing spreadsheet data
5. **Trainers become active users from Day 1**