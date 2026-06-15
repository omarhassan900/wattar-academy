const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('wattar.db');

// Calculate and sync XP for all students based on existing attendance data
// Rules:
// - present = +10 XP
// - late = +5 XP
// - level progression = +50 XP per month level
// - assignments = +20 XP each

console.log('=== Syncing XP from production data ===\n');

db.all(`SELECT sa.student_id, sa.xp as current_xp, s.current_level, s.name
        FROM student_accounts sa
        JOIN students s ON sa.student_id = s.id`, (err, accounts) => {
    if (err) { console.error(err); db.close(); return; }
    if (!accounts || accounts.length === 0) { console.log('No student accounts found.'); db.close(); return; }

    let processed = 0;
    const total = accounts.length;

    accounts.forEach(acc => {
        let xp = 0;

        // XP from attendance
        db.get(`SELECT 
                    SUM(CASE WHEN status = 'present' THEN 10 ELSE 0 END) as present_xp,
                    SUM(CASE WHEN status = 'late' THEN 5 ELSE 0 END) as late_xp
                FROM attendance WHERE student_id = ?`, [acc.student_id], (err, att) => {
            xp += (att && att.present_xp) ? att.present_xp : 0;
            xp += (att && att.late_xp) ? att.late_xp : 0;

            // XP from assignments (20 each)
            db.get(`SELECT COUNT(*) as cnt FROM assignments WHERE student_id = ?`, [acc.student_id], (err, asn) => {
                xp += (asn ? asn.cnt : 0) * 20;

                // XP from level progression (50 per month)
                if (acc.current_level) {
                    const monthNum = parseInt(acc.current_level.replace('Month ', ''));
                    if (!isNaN(monthNum)) xp += monthNum * 50;
                }

                // Determine rank
                const RANKS = [
                    { name: 'Beginner', minXP: 0 },
                    { name: 'Learner', minXP: 50 },
                    { name: 'Player', minXP: 150 },
                    { name: 'Performer', minXP: 300 },
                    { name: 'Artist', minXP: 500 },
                    { name: 'Maestro', minXP: 800 },
                ];
                let rank = 'Beginner';
                for (const r of RANKS) { if (xp >= r.minXP) rank = r.name; }

                // Update
                db.run(`UPDATE student_accounts SET xp = ?, rank = ? WHERE student_id = ?`,
                    [xp, rank, acc.student_id], (err) => {
                    if (!err) {
                        console.log(`  ${acc.name}: ${acc.current_xp || 0} → ${xp} XP (${rank})`);
                    }
                    processed++;
                    if (processed === total) {
                        console.log(`\n✓ Done. Updated ${total} students.`);
                        db.close();
                    }
                });
            });
        });
    });
});
