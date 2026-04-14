const { requireAuth, requireRole } = require('../middleware/auth');

module.exports = (app, db) => {
    app.get('/dashboard', requireAuth, requireRole(['manager','reception','operations_manager']), (req, res) => {
        const user = req.session.user;
        const selectedYear = parseInt(req.query.year) || new Date().getFullYear();
        
        const queries = {
            basicStats: `
                SELECT 
                    (SELECT COUNT(*) FROM students WHERE status = 'active') as total_students,
                    (SELECT COUNT(*) FROM students WHERE status = 'inactive') as inactive_students,
                    (SELECT COUNT(*) FROM students WHERE status = 'freez') as freez_students,
                    (SELECT COUNT(*) FROM classes WHERE status = 'active') as total_classes,
                    (SELECT COUNT(*) FROM trainers WHERE status = 'active') as total_trainers,
                    (SELECT COUNT(*) FROM attendance WHERE date = date('now')) as today_attendance
            `,
            studentsByMonth: `
                SELECT current_level, COUNT(*) as count 
                FROM students WHERE status = 'active'
                GROUP BY current_level ORDER BY current_level
            `,
            studentsByInstrument: `
                SELECT 
                    UPPER(SUBSTR(instrument,1,1)) || LOWER(SUBSTR(instrument,2)) as instrument, 
                    SUM(cnt) as count 
                FROM (
                    SELECT LOWER(TRIM(instrument)) as inst_lower, TRIM(instrument) as instrument, COUNT(*) as cnt
                    FROM students 
                    WHERE status = 'active' AND instrument IS NOT NULL AND instrument != ''
                    GROUP BY LOWER(TRIM(instrument))
                )
                GROUP BY inst_lower ORDER BY count DESC LIMIT 5
            `,
            recentAttendance: `
                SELECT 
                    d.date,
                    COUNT(DISTINCT CASE WHEN a.status IN ('present', 'attended') THEN a.student_id END) as students_present,
                    COUNT(DISTINCT CASE WHEN a.status = 'absent' THEN a.student_id END) as students_absent,
                    (SELECT COUNT(*) FROM confirmation_log cl WHERE cl.confirmation_date = d.date) as students_confirmed
                FROM (
                    SELECT DISTINCT DATE(date) as date FROM attendance
                    UNION
                    SELECT DISTINCT confirmation_date as date FROM confirmation_log
                ) d
                LEFT JOIN attendance a ON DATE(a.date) = d.date
                GROUP BY d.date
                ORDER BY d.date DESC
                LIMIT 7
            `,
            attendanceRate: `
                SELECT 
                    COUNT(CASE WHEN a.status IN ('present', 'attended') THEN 1 END) as present_count,
                    COUNT(*) as total_records
                FROM attendance a JOIN sessions s ON a.session_id = s.id
                WHERE s.session_date >= date('now', '-30 days')
            `,
            getalltransactions: `SELECT 
                COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
                COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense
            FROM cash_transactions`,
            recentTransactions: `SELECT ct.*, cc.name as category_name, cc.type as category_type
                FROM cash_transactions ct LEFT JOIN cash_categories cc ON ct.category_code = cc.code
                ORDER BY ct.transaction_date DESC, ct.created_at DESC LIMIT 50`,
            getallcategories: `SELECT * FROM cash_categories WHERE is_active = 1 ORDER BY type, name`,
            monthlyFinance: `
                SELECT 
                    strftime('%m', transaction_date) as month,
                    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
                    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense
                FROM cash_transactions
                WHERE strftime('%Y', transaction_date) = '${selectedYear}'
                GROUP BY month ORDER BY month
            `,
            availableYears: `SELECT DISTINCT strftime('%Y', transaction_date) as year FROM cash_transactions ORDER BY year DESC`,
            monthlyRevenue: `
                SELECT 
                    strftime('%m', transaction_date) as month,
                    SUM(CASE WHEN type = 'income' AND category_code != 'MGR_CASH' THEN amount ELSE 0 END) as real_income,
                    SUM(CASE WHEN type = 'expense' AND category_code != 'CA' THEN amount ELSE 0 END) as real_expense
                FROM cash_transactions
                WHERE strftime('%Y', transaction_date) = '${selectedYear}'
                GROUP BY month ORDER BY month
            `,
            monthlyExpenseByCategory: `
                SELECT strftime('%m', ct.transaction_date) as month, ct.category_code, cc.name as category_name, SUM(ct.amount) as total
                FROM cash_transactions ct LEFT JOIN cash_categories cc ON ct.category_code = cc.code
                WHERE ct.type = 'expense' AND ct.category_code != 'CA' AND strftime('%Y', ct.transaction_date) = '${selectedYear}'
                GROUP BY month, ct.category_code ORDER BY month, ct.category_code
            `,
            monthlyIncomeByCategory: `
                SELECT strftime('%m', ct.transaction_date) as month, ct.category_code, cc.name as category_name, SUM(ct.amount) as total
                FROM cash_transactions ct LEFT JOIN cash_categories cc ON ct.category_code = cc.code
                WHERE ct.type = 'income' AND ct.category_code != 'MGR_CASH' AND strftime('%Y', ct.transaction_date) = '${selectedYear}'
                GROUP BY month, ct.category_code ORDER BY month, ct.category_code
            `,
        };
        
        db.all(queries.basicStats, (err, basicStats) => {
            if (err) { console.error('Error fetching basic stats:', err); return res.status(500).send('Database error'); }
            db.all(queries.studentsByMonth, (err, studentsByMonth) => {
                if (err) console.error('Error fetching students by month:', err);
                db.all(queries.studentsByInstrument, (err, studentsByInstrument) => {
                    if (err) console.error('Error fetching students by instrument:', err);
                    db.all(queries.recentAttendance, (err, recentAttendance) => {
                        if (err) console.error('Error fetching recent attendance:', err);
                        db.all(queries.attendanceRate, (err, attendanceRate) => {
                            if (err) console.error('Error fetching attendance rate:', err);
                            let attendancePercentage = 0;
                            if (attendanceRate && attendanceRate[0] && attendanceRate[0].total_records > 0) {
                                attendancePercentage = Math.round((attendanceRate[0].present_count / attendanceRate[0].total_records) * 100);
                            }
                            db.get(queries.getalltransactions, (err, totalsRow) => {
                                if (err) { console.error('Error fetching totals:', err); return res.status(500).send('Database error'); }
                                const totalIncome = totalsRow ? totalsRow.total_income : 0;
                                const totalExpense = totalsRow ? totalsRow.total_expense : 0;
                                const balance = totalIncome - totalExpense;
                                db.all(queries.recentTransactions, (err, transactions) => {
                                    if (err) { console.error('Error fetching recent transactions:', err); transactions = []; }
                                    db.all(queries.getallcategories, (err, categories) => {
                                        if (err) { console.error('Error fetching categories:', err); return res.status(500).send('Database error'); }
                                        db.all(queries.monthlyFinance, (err, monthlyFinance) => {
                                            if (err) { console.error('Error fetching monthly finance:', err); return res.status(500).send('Database error'); }
                                            db.all(queries.availableYears, (err, yearRows) => {
                                                const availableYears = yearRows ? yearRows.map(r => r.year) : [new Date().getFullYear().toString()];
                                                db.all(queries.monthlyRevenue, (err, monthlyRevenue) => {
                                                    if (err) console.error('Error fetching monthly revenue:', err);
                                                    db.all(queries.monthlyExpenseByCategory, (err, expByCat) => {
                                                        if (err) console.error('Error fetching expense by category:', err);
                                                        db.all(queries.monthlyIncomeByCategory, (err, incByCat) => {
                                                            if (err) console.error('Error fetching income by category:', err);
                                                            const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                                                            const incomeData = Array(12).fill(0);
                                                            const expenseData = Array(12).fill(0);
                                                            const revenueData = Array(12).fill(0);
                                                            monthlyFinance.forEach(row => { const i = parseInt(row.month) - 1; incomeData[i] = row.total_income || 0; expenseData[i] = row.total_expense || 0; });
                                                            (monthlyRevenue || []).forEach(row => { const i = parseInt(row.month) - 1; revenueData[i] = (row.real_income || 0) - (row.real_expense || 0); });
                                                            const catColors = { 'T': '#e74c3c', 'S': '#3498db', 'CA': '#f39c12', 'C': '#2ecc71', 'AR': '#9b59b6', 'B': '#1abc9c', 'E': '#e67e22', 'R': '#34495e', 'ST': '#e91e63', 'SI': '#00bcd4', 'BA': '#ff5722', 'D': '#795548' };
                                                            const catMap = {};
                                                            (expByCat || []).forEach(row => { const name = row.category_name || row.category_code; if (!catMap[name]) catMap[name] = { code: row.category_code, data: Array(12).fill(0) }; catMap[name].data[parseInt(row.month) - 1] = row.total; });
                                                            const expenseByCategoryData = { labels: monthLabels, datasets: Object.entries(catMap).map(([name, val]) => ({ label: name, data: val.data, backgroundColor: catColors[val.code] || '#' + Math.floor(Math.random()*16777215).toString(16) })) };
                                                            const incColors = { 'P': '#3498db', 'V': '#9b59b6', 'G': '#e74c3c', 'VO': '#f39c12', 'O': '#e67e22', 'D': '#795548', 'DR': '#607d8b', 'SI': '#00bcd4', 'A': '#ff9800', 'BA': '#4caf50', 'MGR_CASH': '#ffc107' };
                                                            const incCatMap = {};
                                                            (incByCat || []).forEach(row => { const name = row.category_name || row.category_code; if (!incCatMap[name]) incCatMap[name] = { code: row.category_code, data: Array(12).fill(0) }; incCatMap[name].data[parseInt(row.month) - 1] = row.total; });
                                                            const incomeByCategoryData = { labels: monthLabels, datasets: Object.entries(incCatMap).map(([name, val]) => ({ label: name, data: val.data, backgroundColor: incColors[val.code] || '#' + Math.floor(Math.random()*16777215).toString(16) })) };
                                                            const financeChartData = { labels: monthLabels, income: incomeData, expenses: expenseData };
                                                            const revenueChartData = { labels: monthLabels, revenue: revenueData };
                                                            console.log(studentsByMonth);
                                                            
                                                            // Session progress: how many students are at each session (1-4) in their current level
                                                            // A session is "done" if it has ANY attendance record (present OR absent)
                                                            db.all(`
                                                                SELECT 
                                                                    COALESCE(last_session, 0) as last_session,
                                                                    COUNT(*) as student_count
                                                                FROM (
                                                                    SELECT s.id,
                                                                        (SELECT MAX(sess.session_number) 
                                                                         FROM attendance a 
                                                                         JOIN sessions sess ON a.session_id = sess.id 
                                                                         WHERE a.student_id = s.id AND sess.level = s.current_level) as last_session
                                                                    FROM students s
                                                                    WHERE s.status = 'active'
                                                                )
                                                                GROUP BY last_session
                                                                ORDER BY last_session
                                                            `, (err, sessionProgress) => {
                                                            if (err) { console.error('Error fetching session progress:', err); sessionProgress = []; }
                                                            
                                                            // Build array for sessions 0-4
                                                            const progressData = [0, 0, 0, 0, 0];
                                                            (sessionProgress || []).forEach(row => {
                                                                const idx = Math.min(row.last_session, 4);
                                                                progressData[idx] = row.student_count;
                                                            });
                                                            
                                                            res.render('dashboard', {
                                                                user, transactions, categories, totalIncome, totalExpense, balance,
                                                                financeChartData, revenueChartData, expenseByCategoryData, incomeByCategoryData,
                                                                selectedYear, availableYears,
                                                                stats: basicStats[0] || { total_students: 0, inactive_students: 0, freez_students: 0, total_classes: 0, total_trainers: 0, today_attendance: 0 },
                                                                studentsByMonth: studentsByMonth || [], studentsByInstrument: studentsByInstrument || [],
                                                                recentAttendance: recentAttendance || [], attendancePercentage,
                                                                sessionProgress: progressData
                                                            }, (err, html) => {
                                                                if (err) { console.error(err); return res.status(500).send('Render error'); }
                                                                res.render('layout', { body: html, user: user, activemenu: 'dashboard' });
                                                            });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};
