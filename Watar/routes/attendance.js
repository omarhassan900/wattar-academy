const { requireAuth, requireRole } = require('../middleware/auth');

module.exports = (app, db) => {
    // Attendance Routes
    app.get('/attendance', requireAuth, (req, res) => {
        const user = req.session.user;
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;
        
        // Get search and filter parameters
        const searchTerm = req.query.search || '';
        const monthFilter = req.query.month || '';
        const instrumentFilter = req.query.instrument || '';
        const statusFilter = req.query.status || '';
        const dateFilter = req.query.date || '';
        
        // Build WHERE clause based on filters
        let whereConditions = ["s.status = 'active'"];
        let queryParams = [];
        
        if (searchTerm) {
            whereConditions.push("(s.name LIKE ? OR s.phone LIKE ?)");
            queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`);
        }
        if (monthFilter) {
            whereConditions.push("s.current_level = ?");
            queryParams.push(monthFilter);
        }
        if (instrumentFilter) {
            whereConditions.push("s.instrument = ?");
            queryParams.push(instrumentFilter);
        }
        if (statusFilter) {
            whereConditions.push("s.status = ?");
            queryParams.push(statusFilter);
        }
        if (dateFilter) {
            whereConditions.push("s.id IN (SELECT DISTINCT student_id FROM attendance WHERE date = ?)");
            queryParams.push(dateFilter);
        }
        
        const whereClause = whereConditions.join(' AND ');
        
        // Get total count with filters
        const countQuery = `SELECT COUNT(*) as total FROM students s WHERE ${whereClause}`;
        
        db.get(countQuery, queryParams, (err, countResult) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }
            
            const totalStudents = countResult.total;
            const totalPages = Math.ceil(totalStudents / limit);
            
            // Get paginated students with filters - confirmed students first
            const studentsQuery = `
                SELECT 
                    s.id, s.name, s.phone, s.current_level, s.instrument, s.status,
                    CASE 
                        WHEN sc.confirmation_status = 'confirmed' THEN 1
                        WHEN sc.confirmation_status = 'not_confirmed' THEN 2
                        ELSE 3
                    END as confirm_order
                FROM students s
                LEFT JOIN session_confirmations sc ON s.id = sc.student_id AND sc.session_id = 0
                WHERE ${whereClause}
                ORDER BY confirm_order, s.name
                LIMIT ? OFFSET ?
            `;
            
            const paginatedParams = [...queryParams, limit, offset];
            
            db.all(studentsQuery, paginatedParams, (err, students) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Database error');
                }
                
                if (students.length === 0) {
                    db.all('SELECT DISTINCT instrument FROM students WHERE instrument IS NOT NULL AND instrument != "" ORDER BY instrument', (err, instRows) => {
                        const instruments = instRows ? instRows.map(r => r.instrument) : [];
                        db.all(`SELECT DISTINCT current_level FROM students WHERE current_level IS NOT NULL ORDER BY CAST(REPLACE(current_level, 'Month ', '') AS INTEGER)`, (err, lvlRows) => {
                            const activeLevels = lvlRows ? lvlRows.map(r => r.current_level) : [];
                            return res.render('attendance', {
                                user,
                                students: [],
                                instruments: instruments,
                                activeLevels,
                                currentPage: page,
                                totalPages: totalPages,
                                totalStudents: totalStudents,
                                searchTerm: searchTerm,
                                monthFilter: monthFilter,
                                instrumentFilter: instrumentFilter,
                                statusFilter: statusFilter,
                                dateFilter: dateFilter
                            }, (err, html) => {
                                if (err) {
                                    console.error(err);
                                    return res.status(500).send('Render error');
                                }
                                res.render('layout', { body: html, user: user });
                            });
                        });
                    });
                    return;
                }
                
                // Get sessions for these students' levels
                const levels = [...new Set(students.map(s => s.current_level))];
                const placeholders = levels.map(() => '?').join(',');
                
                const sessionsQuery = `
                    SELECT id, session_number, session_date, level
                    FROM sessions
                    WHERE level IN (${placeholders})
                    ORDER BY session_number
                `;
                
                db.all(sessionsQuery, levels, (err, sessions) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Database error');
                    }
                    
                    // Get attendance for these students and their level sessions only
                    const studentIds = students.map(s => s.id);
                    const studentPlaceholders = studentIds.map(() => '?').join(',');
                    const sessionIds = sessions.map(s => s.id);
                    const sessionPlaceholders = sessionIds.map(() => '?').join(',');
                    
                    const attendanceQuery = `
                        SELECT student_id, session_id, status, date, notes
                        FROM attendance
                        WHERE student_id IN (${studentPlaceholders})
                        AND session_id IN (${sessionPlaceholders})
                    `;
                    
                    db.all(attendanceQuery, [...studentIds, ...sessionIds], (err, attendanceRecords) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send('Database error');
                        }
                        
                        // Get level notes for these students
                        const levelNotesQuery = `
                            SELECT student_id, level, notes
                            FROM student_level_notes
                            WHERE student_id IN (${studentPlaceholders})
                        `;
                        
                        db.all(levelNotesQuery, studentIds, (err, levelNotesRecords) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).send('Database error');
                            }
                            
                            // Get session confirmations for these students
                            const confirmationsQuery = `
                                SELECT student_id, confirmation_status, confirmation_notes, confirmed_at
                                FROM session_confirmations
                                WHERE student_id IN (${studentPlaceholders}) AND session_id = 0
                            `;
                            
                            db.all(confirmationsQuery, studentIds, (err, confirmationRecords) => {
                                if (err) {
                                    console.error(err);
                                    // Continue without confirmations if there's an error
                                    confirmationRecords = [];
                                }
                                
                                // Build confirmation map
                                const confirmationMap = {};
                                confirmationRecords.forEach(record => {
                                    confirmationMap[record.student_id] = {
                                        status: record.confirmation_status,
                                        notes: record.confirmation_notes,
                                        confirmed_at: record.confirmed_at
                                    };
                                });
                            
                            // Build maps
                            const attendanceMap = {};
                            attendanceRecords.forEach(record => {
                                const key = `${record.student_id}_${record.session_id}`;
                                attendanceMap[key] = {
                                    status: record.status,
                                    date: record.date,
                                    notes: record.notes
                                };
                            });
                            
                            // Build level notes map
                            const levelNotesMap = {};
                            levelNotesRecords.forEach(record => {
                                const key = `${record.student_id}_${record.level}`;
                                levelNotesMap[key] = record.notes;
                            });
                            
                            const sessionsByLevel = {};
                            sessions.forEach(session => {
                                if (!sessionsByLevel[session.level]) {
                                    sessionsByLevel[session.level] = [];
                                }
                                sessionsByLevel[session.level].push(session);
                            });
                            
                            // Build student data
                            const studentsWithData = students.map(student => {
                                const studentSessions = (sessionsByLevel[student.current_level] || []).map(session => {
                                    const key = `${student.id}_${session.id}`;
                                    const attendance = attendanceMap[key] || {};
                                    return {
                                        session_id: session.id,
                                        session_number: session.session_number,
                                        session_date: attendance.date || null, // Use date from attendance, not sessions
                                        attendance_status: attendance.status,
                                        notes: attendance.notes
                                    };
                                });
                                
                                // Get notes for this student's current level
                                const levelNotesKey = `${student.id}_${student.current_level}`;
                                const levelNotes = levelNotesMap[levelNotesKey] || '';
                                
                                // Get confirmation status for this student
                                const confirmation = confirmationMap[student.id] || null;
                                
                                return {
                                    ...student,
                                    sessions: studentSessions,
                                    notes: levelNotes,  // Notes for current level
                                    confirmation: confirmation  // Confirmation status from operations manager
                                };
                            });
                            
                            // Sorting already done in SQL query (confirmed first)
                            
                            // Get all instruments and active levels for filter
                            db.all('SELECT DISTINCT instrument FROM students WHERE instrument IS NOT NULL AND instrument != "" ORDER BY instrument', (err, instRows) => {
                                const instruments = instRows ? instRows.map(r => r.instrument) : [];
                                
                                db.all(`SELECT DISTINCT current_level FROM students WHERE current_level IS NOT NULL ORDER BY CAST(REPLACE(current_level, 'Month ', '') AS INTEGER)`, (err, levelRows) => {
                                const activeLevels = levelRows ? levelRows.map(r => r.current_level) : [];
                                
                                res.render('attendance', {
                                    user,
                                    students: studentsWithData,
                                    instruments,
                                    activeLevels,
                                    currentPage: page,
                                    totalPages: totalPages,
                                    totalStudents: totalStudents,
                                    searchTerm: searchTerm,
                                    monthFilter: monthFilter,
                                    instrumentFilter: instrumentFilter,
                                    statusFilter: statusFilter,
                                    dateFilter: dateFilter
                                }, (err, html) => {
                                    if (err) {
                                        console.error(err);
                                        return res.status(500).send('Render error');
                                    }
                                    res.render('layout', { body: html, user: user });
                                });
                                });
                            });
                            }); // Close confirmations callback
                        });
                    });
                });
            });
        });
    });

    // API endpoint for saving all attendance
    app.post('/attendance/save-all', requireAuth, (req, res) => {
        const { attendance, student_notes } = req.body;
        const user = req.session.user;
        
        if ((!attendance || attendance.length === 0) && (!student_notes || Object.keys(student_notes).length === 0)) {
            return res.json({ success: false, error: 'No attendance or notes data provided' });
        }
        
        console.log('Saving attendance:', attendance);
        console.log('Saving student notes:', student_notes);
        
        const today = new Date().toISOString().split('T')[0];
        
        let attendanceProcessed = 0;
        let notesProcessed = 0;
        let errors = 0;
        const totalAttendance = attendance ? attendance.length : 0;
        const totalNotes = student_notes ? Object.keys(student_notes).length : 0;
        const totalOperations = totalAttendance + totalNotes;
        
        // Process attendance records
        if (attendance && attendance.length > 0) {
            attendance.forEach((record) => {
                // Check if attendance already exists for this student/session
                db.get(
                    'SELECT id, date FROM attendance WHERE student_id = ? AND session_id = ?',
                    [record.student_id, record.session_id],
                    (err, existing) => {
                        if (err) {
                            console.error('Error checking existing attendance:', err);
                            errors++;
                            attendanceProcessed++;
                            checkComplete();
                        } else if (existing) {
                            // Update existing record - KEEP the original date!
                            const dbStatus = record.status === 'attended' ? 'present' : 'absent';
                            db.run(
                                'UPDATE attendance SET status = ?, marked_by = ? WHERE id = ?',
                                [dbStatus, user.id, existing.id],
                                (err) => {
                                    if (err) {
                                        console.error('Error updating attendance:', err);
                                        errors++;
                                    }
                                    attendanceProcessed++;
                                    checkComplete();
                                }
                            );
                        } else {
                            // Insert new record with today's date
                            const dbStatus = record.status === 'attended' ? 'present' : 'absent';
                            db.run(
                                'INSERT INTO attendance (student_id, session_id, status, date, marked_by, created_at) VALUES (?, ?, ?, ?, ?, datetime("now"))',
                                [record.student_id, record.session_id, dbStatus, today, user.id],
                                (err) => {
                                    if (err) {
                                        console.error('Error inserting attendance:', err);
                                        errors++;
                                    } else if (dbStatus === 'present') {
                                        // Only clear confirmation when student is marked as present/attended
                                        db.run(
                                            'DELETE FROM session_confirmations WHERE student_id = ? AND session_id = 0',
                                            [record.student_id]
                                        );
                                    }
                                    attendanceProcessed++;
                                    checkComplete();
                                }
                            );
                        }
                    }
                );
            });
        }
        
        // Process student notes
        if (student_notes && Object.keys(student_notes).length > 0) {
            for (const studentId in student_notes) {
                const notes = student_notes[studentId];
                
                // Get student's current level
                db.get('SELECT current_level FROM students WHERE id = ?', [studentId], (err, student) => {
                    if (err) {
                        console.error('Error getting student level:', err);
                        errors++;
                        notesProcessed++;
                        checkComplete();
                    } else if (student) {
                        // Save notes for this student's current level
                        db.run(
                            `INSERT INTO student_level_notes (student_id, level, notes, updated_at) 
                             VALUES (?, ?, ?, datetime("now"))
                             ON CONFLICT(student_id, level) 
                             DO UPDATE SET notes = ?, updated_at = datetime("now")`,
                            [studentId, student.current_level, notes, notes],
                            (err) => {
                                if (err) {
                                    console.error('Error updating student level notes:', err);
                                    errors++;
                                } else {
                                    console.log(`Updated notes for student ${studentId}, level ${student.current_level}`);
                                }
                                notesProcessed++;
                                checkComplete();
                            }
                        );
                    } else {
                        console.error('Student not found:', studentId);
                        errors++;
                        notesProcessed++;
                        checkComplete();
                    }
                });
            }
        }
        
        function checkComplete() {
            const totalProcessed = attendanceProcessed + notesProcessed;
            if (totalProcessed === totalOperations) {
                if (errors > 0) {
                    res.json({ success: false, error: `${errors} errors occurred` });
                } else {
                    res.json({ success: true, message: 'Attendance and notes saved successfully' });
                }
            }
        }
        
        // If no operations to process, return immediately
        if (totalOperations === 0) {
            res.json({ success: false, error: 'No data to save' });
        }
    });

    // API endpoint for clearing attendance
    app.post('/attendance/clear', requireAuth, (req, res) => {
        const { student_id, session_id } = req.body;
        
        if (!student_id || !session_id) {
            return res.json({ success: false, error: 'Missing student_id or session_id' });
        }
        
        // Delete the attendance record
        db.run('DELETE FROM attendance WHERE student_id = ? AND session_id = ?', [student_id, session_id], (err) => {
            if (err) {
                console.error('Error clearing attendance:', err);
                return res.json({ success: false, error: 'Database error' });
            }
            
            res.json({ success: true, message: 'Attendance cleared successfully' });
        });
    });

    // Export attendance to CSV
    app.get('/attendance/export-csv', requireAuth, (req, res) => {
        // Get all active students
        const studentsQuery = `
            SELECT 
                s.id,
                s.name as student_name,
                s.phone,
                s.current_level,
                s.instrument,
                s.status as student_status
            FROM students s
            WHERE s.status = 'active'
            ORDER BY s.name
        `;
        
        db.all(studentsQuery, (err, students) => {
            if (err) {
                console.error('Error fetching students:', err);
                return res.status(500).send('Database error');
            }
            
            // Get all sessions
            const sessionsQuery = `
                SELECT id, session_number, session_date, level
                FROM sessions
                ORDER BY level, session_number
            `;
            
            db.all(sessionsQuery, (err, sessions) => {
                if (err) {
                    console.error('Error fetching sessions:', err);
                    return res.status(500).send('Database error');
                }
                
                // Get all attendance records
                const attendanceQuery = `
                    SELECT student_id, session_id, status, notes, created_at
                    FROM attendance
                `;
                
                db.all(attendanceQuery, (err, attendanceRecords) => {
                    if (err) {
                        console.error('Error fetching attendance:', err);
                        return res.status(500).send('Database error');
                    }
                    
                    // Build attendance map for quick lookup
                    const attendanceMap = {};
                    attendanceRecords.forEach(record => {
                        const key = `${record.student_id}_${record.session_id}`;
                        attendanceMap[key] = {
                            status: record.status,
                            notes: record.notes,
                            created_at: record.created_at
                        };
                    });
                    
                    // Build sessions map by level
                    const sessionsByLevel = {};
                    sessions.forEach(session => {
                        if (!sessionsByLevel[session.level]) {
                            sessionsByLevel[session.level] = [];
                        }
                        sessionsByLevel[session.level].push(session);
                    });
                    
                    // Create CSV header with session columns
                    let csv = 'Student Name,Phone,Level,Instrument,Status,Session 1,Session 2,Session 3,Session 4,Session 1 Date,Session 2 Date,Session 3 Date,Session 4 Date\n';
                    
                    // For each student, create ONE row with all sessions as columns
                    students.forEach(student => {
                        const studentSessions = sessionsByLevel[student.current_level] || [];
                        
                        // Prepare session data for all 4 sessions
                        const sessionData = [];
                        const sessionDates = [];
                        
                        for (let sessionNum = 1; sessionNum <= 4; sessionNum++) {
                            const session = studentSessions.find(s => s.session_number === sessionNum);
                            
                            if (session) {
                                const key = `${student.id}_${session.id}`;
                                const attendance = attendanceMap[key];
                                
                                // Session attendance value (TRUE/FALSE or empty)
                                let hasAttendance = false;
                                if (attendance) {
                                    if (attendance.status === 'present' || attendance.status === 'attended') {
                                        sessionData.push('TRUE');
                                        hasAttendance = true;
                                    } else if (attendance.status === 'absent') {
                                        sessionData.push('FALSE');
                                        hasAttendance = true;
                                    } else {
                                        sessionData.push('');
                                    }
                                } else {
                                    sessionData.push(''); // Not marked
                                }
                                
                                // Session date - ONLY show if attendance is marked
                                if (hasAttendance && session.session_date) {
                                    const sessionDate = new Date(session.session_date).toLocaleDateString('en-GB');
                                    sessionDates.push(sessionDate);
                                } else {
                                    sessionDates.push(''); // No date if not marked
                                }
                            } else {
                                sessionData.push(''); // Session doesn't exist
                                sessionDates.push('');
                            }
                        }
                        
                        // Build the CSV row
                        csv += `"${student.student_name}","${student.phone || ''}","${student.current_level}","${student.instrument || ''}","${student.student_status}",${sessionData[0]},${sessionData[1]},${sessionData[2]},${sessionData[3]},"${sessionDates[0]}","${sessionDates[1]}","${sessionDates[2]}","${sessionDates[3]}"\n`;
                    });
                    
                    // Set headers for file download
                    const filename = `attendance_export_${new Date().toISOString().split('T')[0]}.csv`;
                    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
                    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
                    res.send('\uFEFF' + csv); // Add BOM for Excel compatibility
                });
            });
        });
    });

    // API endpoint for saving individual session attendance
    app.post('/attendance/session-save', requireAuth, (req, res) => {
        const { session_number, attendance, session_dates } = req.body;
        const user = req.session.user;
        
        // Update session dates if provided
        if (session_dates) {
            const dateStmt = db.prepare("UPDATE sessions SET session_date = ? WHERE id = ?");
            for (const sessionId in session_dates) {
                if (session_dates[sessionId]) {
                    dateStmt.run(session_dates[sessionId], sessionId);
                }
            }
            dateStmt.finalize();
        }
        
        // Get all session IDs for this session number
        db.all("SELECT id FROM sessions WHERE session_number = ?", [session_number], (err, sessions) => {
            if (err) {
                console.error(err);
                return res.json({ success: false, error: 'Database error' });
            }
            
            const sessionIds = sessions.map(s => s.id);
            
            // Delete existing attendance for these sessions
            const placeholders = sessionIds.map(() => '?').join(',');
            db.run(`DELETE FROM attendance WHERE session_id IN (${placeholders})`, sessionIds, (err) => {
                if (err) {
                    console.error(err);
                    return res.json({ success: false, error: 'Database error' });
                }
                
                // Insert new attendance records
                const stmt = db.prepare(`
                    INSERT INTO attendance (student_id, session_id, status, marked_by, created_at) 
                    VALUES (?, ?, ?, ?, datetime('now'))
                `);
                
                attendance.forEach(record => {
                    stmt.run(record.student_id, record.session_id, record.status, user.id);
                });
                
                stmt.finalize((err) => {
                    if (err) {
                        console.error(err);
                        return res.json({ success: false, error: 'Database error' });
                    }
                    
                    res.json({ success: true, message: `Session ${session_number} saved successfully` });
                });
            });
        });
    });

    app.post('/attendance/all', requireAuth, (req, res) => {
        const { attendance, session_dates, student_notes } = req.body;
        const user = req.session.user;
        
        // Update session dates first
        if (session_dates) {
            const dateStmt = db.prepare("UPDATE sessions SET session_date = ? WHERE id = ?");
            for (const sessionId in session_dates) {
                if (session_dates[sessionId]) {
                    dateStmt.run(session_dates[sessionId], sessionId);
                }
            }
            dateStmt.finalize();
        }
        
        // Clear existing attendance for all sessions
        db.run("DELETE FROM attendance", (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }
            
            // Insert new attendance records
            const stmt = db.prepare(`
                INSERT INTO attendance (student_id, session_id, status, notes, marked_by, created_at) 
                VALUES (?, ?, ?, ?, ?, datetime('now'))
            `);
            
            // Process attendance data
            for (const studentId in attendance) {
                const studentAttendance = attendance[studentId];
                const studentNote = student_notes && student_notes[studentId] ? student_notes[studentId] : null;
                
                for (const sessionId in studentAttendance) {
                    const status = studentAttendance[sessionId];
                    stmt.run(studentId, sessionId, status, studentNote, user.id);
                }
            }
            
            stmt.finalize((err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Database error');
                }
                
                res.redirect('/attendance');
            });
        });
    });

    // API endpoint for updating student month
    app.post('/api/update-student-month', requireAuth, (req, res) => {
        const { student_id, month } = req.body;
        
        // Update student's month
        db.run("UPDATE students SET current_level = ? WHERE id = ?", [month, student_id], (err) => {
            if (err) {
                console.error('Error updating student month:', err);
                return res.json({ success: false, error: 'Database error' });
            }
            
            // Get the new sessions for this month
            db.all(`
                SELECT sess.id as session_id, sess.session_number, sess.session_date,
                       a.status as attendance_status
                FROM sessions sess
                LEFT JOIN attendance a ON a.session_id = sess.id AND a.student_id = ?
                WHERE sess.level = ?
                ORDER BY sess.session_number
            `, [student_id, month], (err, sessions) => {
                if (err) {
                    console.error('Error fetching sessions:', err);
                    return res.json({ success: false, error: 'Database error' });
                }
                
                res.json({ success: true, sessions: sessions });
            });
        });
    });

    // API endpoint for updating session dates
    app.post('/api/session-date', requireAuth, (req, res) => {
        const { session_id, session_date } = req.body;
        
        db.run("UPDATE sessions SET session_date = ? WHERE id = ?", [session_date, session_id], (err) => {
            if (err) {
                console.error('Error updating session date:', err);
                return res.json({ success: false, error: 'Database error' });
            }
            
            res.json({ success: true });
        });
    });

    app.post('/attendance/session', requireAuth, (req, res) => {
        const { session_id, session_date, attendance, notes } = req.body;
        const user = req.session.user;
        
        // Update session date if provided
        if (session_date) {
            db.run("UPDATE sessions SET session_date = ? WHERE id = ?", [session_date, session_id], (err) => {
                if (err) {
                    console.error('Error updating session date:', err);
                }
            });
        }
        
        // Clear existing attendance for this session
        db.run("DELETE FROM attendance WHERE session_id = ?", [session_id], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }
            
            // Insert new attendance records
            const stmt = db.prepare(`
                INSERT INTO attendance (student_id, session_id, status, notes, marked_by, created_at) 
                VALUES (?, ?, ?, ?, ?, datetime('now'))
            `);
            
            for (const studentId in attendance) {
                const status = attendance[studentId];
                const studentNotes = notes && notes[studentId] ? notes[studentId] : null;
                stmt.run(studentId, session_id, status, studentNotes, user.id);
            }
            
            stmt.finalize((err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Database error');
                }
                
                // Get session details for redirect
                db.get("SELECT level FROM sessions WHERE id = ?", [session_id], (err, session) => {
                    if (err) {
                        console.error(err);
                        return res.redirect('/attendance');
                    }
                    
                    res.redirect(`/attendance?level=${encodeURIComponent(session.level)}&session=${session_id}`);
                });
            });
        });
    });

    // API endpoint to get sessions for a level
    app.get('/api/sessions', requireAuth, (req, res) => {
        const level = req.query.level;
        
        if (!level) {
            return res.json([]);
        }
        
        db.all("SELECT * FROM sessions WHERE level = ? ORDER BY session_number", [level], (err, sessions) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            res.json(sessions);
        });
    });

    // Session Attendance Summary Route
    app.get('/attendance/summary', requireAuth, (req, res) => {
        const user = req.session.user;
        const selectedLevel = req.query.level;
        
        // Get all levels and their session progress
        let query = `
            SELECT 
                s.level,
                s.session_number,
                s.session_date,
                s.id as session_id,
                COUNT(st.id) as total_students,
                COUNT(a.id) as students_with_attendance,
                COUNT(CASE WHEN a.status = 'attended' THEN 1 END) as attended_count,
                COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as absent_count
            FROM sessions s
            LEFT JOIN students st ON st.current_level = s.level AND st.status = 'active'
            LEFT JOIN attendance a ON a.session_id = s.id
            WHERE 1=1
        `;
        let params = [];
        
        if (selectedLevel) {
            query += " AND s.level = ?";
            params.push(selectedLevel);
        }
        
        query += `
            GROUP BY s.id, s.level, s.session_number
            ORDER BY s.level, s.session_number
        `;
        
        db.all(query, params, (err, sessionData) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }
            
            // Group by level
            const levelSummary = {};
            sessionData.forEach(session => {
                if (!levelSummary[session.level]) {
                    levelSummary[session.level] = {
                        level: session.level,
                        sessions: [],
                        totalStudents: session.total_students,
                        completedSessions: 0,
                        totalAttendance: 0,
                        totalPossibleAttendance: 0
                    };
                }
                
                levelSummary[session.level].sessions.push({
                    sessionNumber: session.session_number,
                    sessionId: session.session_id,
                    sessionDate: session.session_date,
                    attendedCount: session.attended_count,
                    absentCount: session.absent_count,
                    totalStudents: session.total_students,
                    hasAttendance: session.students_with_attendance > 0,
                    attendanceRate: session.total_students > 0 ? 
                        Math.round((session.attended_count / session.total_students) * 100) : 0
                });
                
                if (session.students_with_attendance > 0) {
                    levelSummary[session.level].completedSessions++;
                    levelSummary[session.level].totalAttendance += session.attended_count;
                    levelSummary[session.level].totalPossibleAttendance += session.total_students;
                }
            });
            
            // Calculate overall attendance rates
            Object.keys(levelSummary).forEach(level => {
                const summary = levelSummary[level];
                summary.overallAttendanceRate = summary.totalPossibleAttendance > 0 ?
                    Math.round((summary.totalAttendance / summary.totalPossibleAttendance) * 100) : 0;
            });
            
            res.render('attendance-summary', {
                user,
                selectedLevel,
                levelSummary: Object.values(levelSummary),
                levels: Array.from({length: 48}, (_, i) => `Month ${i + 1}`)
            }, (err, html) => {
                if (err) {
                    console.error('Error rendering attendance summary:', err);
                    return res.status(500).send('Render error');
                }
                res.render('layout', { body: html, user: user });
            });
        });
    });
};
