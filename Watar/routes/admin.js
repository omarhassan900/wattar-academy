const { requireAuth, requireRole } = require('../middleware/auth');

module.exports = (app, db) => {
    // Reports Routes
    app.get('/reports', requireAuth, (req, res) => {
        const user = req.session.user;
        
        // Updated query for session-based attendance
        let query = `
            SELECT 
                s.id,
                s.name,
                s.current_level,
                s.start_date,
                s.phone,
                COUNT(DISTINCT sess.id) as total_sessions,
                COUNT(CASE WHEN a.status = 'attended' THEN 1 END) as attended_sessions,
                COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as absent_sessions,
                ROUND(
                    CASE 
                        WHEN COUNT(CASE WHEN a.status IN ('attended', 'absent') THEN 1 END) > 0 
                        THEN (COUNT(CASE WHEN a.status = 'attended' THEN 1 END) * 100.0 / COUNT(CASE WHEN a.status IN ('attended', 'absent') THEN 1 END))
                        ELSE 0 
                    END, 2
                ) as attendance_rate
            FROM students s
            LEFT JOIN sessions sess ON sess.level = s.current_level
            LEFT JOIN attendance a ON s.id = a.student_id AND a.session_id = sess.id
            WHERE s.status = 'active'
            GROUP BY s.id
            ORDER BY attendance_rate DESC, s.name
        `;
        let params = [];
        
        db.all(query, params, (err, stats) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }
            
            // Calculate additional statistics
            const totalStudents = stats.length;
            const totalSessionsMarked = stats.reduce((sum, s) => sum + s.attended_sessions + s.absent_sessions, 0);
            const totalAttended = stats.reduce((sum, s) => sum + s.attended_sessions, 0);
            const avgAttendance = totalStudents > 0 ? Math.round(stats.reduce((sum, s) => sum + s.attendance_rate, 0) / totalStudents) : 0;
            
            // Get level distribution with session progress
            const levelStats = {};
            stats.forEach(s => {
                if (!levelStats[s.current_level]) {
                    levelStats[s.current_level] = {
                        count: 0,
                        totalSessions: 0,
                        attendedSessions: 0,
                        absentSessions: 0
                    };
                }
                levelStats[s.current_level].count++;
                levelStats[s.current_level].totalSessions += (s.attended_sessions + s.absent_sessions);
                levelStats[s.current_level].attendedSessions += s.attended_sessions;
                levelStats[s.current_level].absentSessions += s.absent_sessions;
            });
            
            const reportsContent = `
                <div class="row">
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h1><i class="fas fa-chart-bar text-primary me-2"></i>Session Attendance Reports</h1>
                            <div class="d-flex gap-2">
                                <button class="btn btn-outline-primary" onclick="exportData()">
                                    <i class="fas fa-download me-2"></i>Export CSV
                                </button>
                                <button class="btn btn-outline-success" onclick="printReport()">
                                    <i class="fas fa-print me-2"></i>Print Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Statistics Cards -->
                <div class="row mb-4">
                    <div class="col-md-3 md-2">
                        <div class="card text-center">
                            <div class="card-body">
                                <i class="fas fa-users fa-2x text-primary mb-2"></i>
                                <h3>${totalStudents}</h3>
                                <p class="text-muted mb-0">Active Students</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 md-2">
                        <div class="card text-center">
                            <div class="card-body">
                                <i class="fas fa-calendar-check fa-2x text-success mb-2"></i>
                                <h3>${totalSessionsMarked}</h3>
                                <p class="text-muted mb-0">Sessions Marked</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 md-2">
                        <div class="card text-center">
                            <div class="card-body">
                                <i class="fas fa-check-circle fa-2x text-success mb-2"></i>
                                <h3>${totalAttended}</h3>
                                <p class="text-muted mb-0">Total Attended</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 md-2">
                        <div class="card text-center">
                            <div class="card-body">
                                <i class="fas fa-percentage fa-2x text-info mb-2"></i>
                                <h3>${avgAttendance}%</h3>
                                <p class="text-muted mb-0">Avg Attendance</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Reports Table -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h5 class="mb-0">Student Attendance Statistics</h5>
                                <div class="d-flex gap-2">
                                    <select class="form-select form-select-sm" id="levelFilter" style="width: auto;">
                                        <option value="">All Levels</option>
                                        ${Object.keys(levelStats).map(level => 
                                            `<option value="${level}">${level}</option>`
                                        ).join('')}
                                    </select>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Student</th>
                                                <th>Instrument</th>
                                                <th>Level</th>
                                                <th>Sessions</th>
                                                <th>Attendance Rate</th>
                                                <th>Performance</th>
                                                <th>Start Date</th>
                                            </tr>
                                        </thead>
                                        <tbody id="reportsTableBody">
                                        ${stats.map(student => {
                                            const startDate = new Date(student.start_date);
                                            const today = new Date();
                                            const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
                                            const expectedSessions = Math.max(1, Math.floor(daysSinceStart / 7)); // Assuming weekly sessions
                                            const calculatedRate = Math.min(100, Math.round((student.total_sessions / expectedSessions) * 100));
                                            const attendanceRate = student.attendance_rate || calculatedRate;
                                            
                                            return `
                                            <tr class="report-row" data-instrument="${student.instrument || ''}" data-level="${student.current_level}">
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <i class="fas ${student.age_group === 'kids' ? 'fa-child' : student.age_group === 'teenagers' ? 'fa-user-graduate' : 'fa-user'} fa-lg text-primary me-2"></i>
                                                        <div>
                                                            <strong>${student.name}</strong>
                                                            <br><small class="text-muted">${student.age_group ? student.age_group.charAt(0).toUpperCase() + student.age_group.slice(1) : 'Not Set'}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span class="badge bg-success">
                                                        <i class="fas fa-music me-1"></i>
                                                        ${student.instrument || 'Not Set'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span class="badge bg-primary">${student.current_level}</span>
                                                </td>
                                                <td>
                                                    <div class="text-center">
                                                        <strong>${student.total_sessions}</strong>
                                                        <br><small class="text-muted">${student.present_sessions} present</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="progress" style="height: 25px; min-width: 100px;">
                                                        <div class="progress-bar ${attendanceRate >= 80 ? 'bg-success' : attendanceRate >= 60 ? 'bg-warning' : 'bg-danger'}" 
                                                             style="width: ${Math.min(attendanceRate, 100)}%">
                                                            <strong>${attendanceRate}%</strong>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    ${attendanceRate >= 80 ? 
                                                        '<span class="badge bg-success"><i class="fas fa-star me-1"></i>Excellent</span>' :
                                                        attendanceRate >= 60 ? 
                                                        '<span class="badge bg-warning"><i class="fas fa-thumbs-up me-1"></i>Good</span>' :
                                                        attendanceRate >= 40 ? 
                                                        '<span class="badge bg-info"><i class="fas fa-hand-paper me-1"></i>Fair</span>' :
                                                        '<span class="badge bg-danger"><i class="fas fa-exclamation-triangle me-1"></i>Needs Attention</span>'
                                                    }
                                                </td>
                                                <td>
                                                    <small>${new Date(student.start_date).toLocaleDateString()}</small>
                                                </td>
                                            </tr>
                                            `;
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <script>
            // Filter functionality
            document.getElementById('levelFilter').addEventListener('change', function() {
                filterReports();
            });

            function filterReports() {
                const levelFilter = document.getElementById('levelFilter').value;
                
                document.querySelectorAll('.report-row').forEach(row => {
                    const studentLevel = row.getAttribute('data-level');
                    const levelMatch = !levelFilter || studentLevel === levelFilter;
                    
                    if (levelMatch) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            }

            function exportData() {
                // Simple CSV export for session-based attendance
                const rows = [];
                const headers = ['Student Name', 'Level', 'Phone', 'Sessions Marked', 'Attended', 'Absent', 'Attendance Rate'];
                rows.push(headers.join(','));
                
                document.querySelectorAll('.report-row').forEach(row => {
                    if (row.style.display !== 'none') {
                        const cells = row.querySelectorAll('td');
                        const rowData = [
                            cells[0].textContent.trim().replace(/\\n/g, ' '),
                            cells[1].textContent.trim(),
                            cells[2].textContent.trim(),
                            cells[3].textContent.trim(),
                            cells[4].textContent.trim(),
                            cells[5].textContent.trim(),
                            cells[6].textContent.trim()
                        ];
                        rows.push(rowData.join(','));
                    }
                });
                
                const csvContent = rows.join('\\n');
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'wattar_academy_session_reports.csv';
                a.click();
                window.URL.revokeObjectURL(url);
            }

            function printReport() {
                window.print();
            }
            </script>
        `;
        
            res.render('layout', { 
                body: reportsContent,
                user: user
            });
        });
    });

    // Database Admin Routes (Manager only)
    app.get('/admin/db', requireAuth, requireRole(['manager']), (req, res) => {
        res.render('admin-db', {}, (err, html) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Render error');
            }
            res.render('layout', {
                body: html,
                user: req.session.user,
                activemenu: 'admin-db'
            });
        });
    });

    app.post('/admin/db/query', requireAuth, requireRole(['manager']), (req, res) => {
        const { query } = req.body;
        if (!query || !query.trim()) {
            return res.status(400).json({ error: 'Empty query' });
        }

        const trimmed = query.trim().toUpperCase();
        const isSelect = trimmed.startsWith('SELECT') || trimmed.startsWith('PRAGMA');

        if (isSelect) {
            db.all(query, (err, rows) => {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }
                res.json({ type: 'select', rows: rows || [] });
            });
        } else {
            db.run(query, function(err) {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }
                res.json({ type: 'run', message: `Query executed. Rows affected: ${this.changes}` });
            });
        }
    });
};
