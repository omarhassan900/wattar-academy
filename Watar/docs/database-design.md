# Database Design - Wattar Academy Management System

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    role ENUM('manager', 'reception', 'trainer') NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Students Table
```sql
CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    national_id VARCHAR(20) UNIQUE,
    phone VARCHAR(20),
    parent_phone VARCHAR(20),
    email VARCHAR(100),
    start_date DATE NOT NULL,
    current_level ENUM('Level One', 'Level Two', 'Level Three', 'Level Four', 'Level Five', 'Level Six') DEFAULT 'Level One',
    status ENUM('active', 'inactive', 'graduated') DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Trainers Table
```sql
CREATE TABLE trainers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    specialization VARCHAR(100),
    hourly_rate DECIMAL(10,2),
    hire_date DATE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Classes Table
```sql
CREATE TABLE classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    level ENUM('Level One', 'Level Two', 'Level Three', 'Level Four', 'Level Five', 'Level Six') NOT NULL,
    trainer_id INTEGER,
    schedule_day ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
    schedule_time TIME,
    duration_minutes INTEGER DEFAULT 60,
    max_students INTEGER DEFAULT 10,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trainer_id) REFERENCES trainers(id)
);
```

### Student_Classes Table (Many-to-Many)
```sql
CREATE TABLE student_classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    class_id INTEGER,
    enrollment_date DATE NOT NULL,
    status ENUM('active', 'completed', 'dropped') DEFAULT 'active',
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    UNIQUE(student_id, class_id)
);
```

### Attendance Table
```sql
CREATE TABLE attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    class_id INTEGER,
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'late', 'excused') DEFAULT 'present',
    notes TEXT,
    marked_by INTEGER, -- user_id who marked attendance
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (marked_by) REFERENCES users(id),
    UNIQUE(student_id, class_id, date)
);
```

### Payments Table
```sql
CREATE TABLE payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_type ENUM('monthly_fee', 'registration', 'materials', 'other') DEFAULT 'monthly_fee',
    payment_method ENUM('cash', 'card', 'bank_transfer', 'other') DEFAULT 'cash',
    notes TEXT,
    received_by INTEGER, -- user_id who received payment
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (received_by) REFERENCES users(id)
);
```

### Student_Progress Table
```sql
CREATE TABLE student_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    class_id INTEGER,
    progress_date DATE NOT NULL,
    level_before VARCHAR(20),
    level_after VARCHAR(20),
    notes TEXT,
    skills_assessment TEXT,
    trainer_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (trainer_id) REFERENCES trainers(id)
);
```

### Expenses Table (for cash flow management)
```sql
CREATE TABLE expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    expense_date DATE NOT NULL,
    category ENUM('rent', 'utilities', 'equipment', 'salaries', 'marketing', 'other') NOT NULL,
    notes TEXT,
    recorded_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recorded_by) REFERENCES users(id)
);
```

### Trainer_Payments Table
```sql
CREATE TABLE trainer_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trainer_id INTEGER,
    payment_period_start DATE NOT NULL,
    payment_period_end DATE NOT NULL,
    base_amount DECIMAL(10,2),
    bonus_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_date DATE,
    status ENUM('pending', 'paid') DEFAULT 'pending',
    notes TEXT,
    processed_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trainer_id) REFERENCES trainers(id),
    FOREIGN KEY (processed_by) REFERENCES users(id)
);
```

## Indexes for Performance
```sql
-- Attendance queries
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_class ON attendance(class_id);

-- Student queries
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_level ON students(current_level);

-- Payment queries
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_payments_student ON payments(student_id);

-- Class assignments
CREATE INDEX idx_student_classes_student ON student_classes(student_id);
CREATE INDEX idx_student_classes_class ON student_classes(class_id);
```

## Data Relationships

### Key Relationships
1. **Users → Trainers** (One-to-One)
2. **Trainers → Classes** (One-to-Many)
3. **Students → Classes** (Many-to-Many via student_classes)
4. **Students → Attendance** (One-to-Many)
5. **Students → Payments** (One-to-Many)
6. **Students → Progress** (One-to-Many)

### Business Rules
1. A student can be enrolled in multiple classes
2. A class can have multiple students (up to max_students)
3. Attendance is tracked per student per class per date
4. Payments are linked to students, not specific classes
5. Progress notes are class-specific
6. Only trainers can mark attendance for their assigned classes
7. Only managers and reception can record payments