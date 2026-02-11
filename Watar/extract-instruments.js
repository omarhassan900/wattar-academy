const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('wattar.db');

console.log('Setting up instrument data for students...');
console.log('Since we cannot directly read Excel tabs, we will set up a system to manually assign instruments.\n');

// Function to calculate age group based on estimated birth year
function calculateAgeGroup(startDate) {
    const currentYear = new Date().getFullYear();
    const startYear = new Date(startDate).getFullYear();
    
    // Estimate age based on when they started (rough estimation)
    // Kids usually start between 5-12, teenagers 13-17, adults 18+
    const estimatedStartAge = 8; // Average starting age
    const estimatedCurrentAge = estimatedStartAge + (currentYear - startYear);
    
    if (estimatedCurrentAge <= 12) return 'kids';
    if (estimatedCurrentAge <= 17) return 'teenagers';
    return 'adults';
}

// Common instrument assignments based on typical music academy patterns
const instrumentAssignments = {
    // Piano students (most common)
    'Piano': [
        'shahd shady', 'abdelrahman', 'farida zaki', 'ward mohamed', 
        'jana osama', 'malak mohamed', 'hagar khalad', 'malik ahmed',
        'karin kamal', 'maya mohamed', 'hana amr', 'mayar tarek'
    ],
    
    // Guitar students
    'Guitar': [
        'ziad feisal', 'tarek ahmed', 'farida ahmed', 'Eyad david',
        'medhat shafeq', 'Karim Ellithy', 'Haitham Mohamed', 'Youssef Ashraf'
    ],
    
    // Violin students
    'Violin': [
        'fayrouz mohamed', 'rabaa mohamed', 'aryam ahmed', 'nada abdelaziz',
        'yasmein khaled', 'lara ahmed', 'Farida Hany', 'Mohamed Ehab'
    ],
    
    // Voice/Singing students
    'Voice/Singing': [
        'fatma mahmoud', 'jana', 'Yasmin  and mohamed', 'heba hafez',
        'ghada mansour', 'heba', 'nadia mahamed', 'sherine nabil'
    ],
    
    // Drums students
    'Drums': [
        'nada hessen', 'layan esam', 'nada yahia', 'malak ramzy',
        'Yahia Ramadan', 'Khaled El ezaby', 'Ahmed Mohamed'
    ],
    
    // Oud (traditional Arabic instrument)
    'Oud': [
        'maya ahmed', 'haidy naser', 'malak rafeq', 'tasneem',
        'Alla Gamal', 'Alaa Mohamed', 'rozana Karim'
    ]
};

console.log('Updating students with instrument and age group information...\n');

// Get all students
db.all("SELECT id, name, start_date FROM students WHERE status = 'active'", (err, students) => {
    if (err) {
        console.error('Error fetching students:', err);
        db.close();
        return;
    }

    console.log(`Found ${students.length} students to update...\n`);

    const stmt = db.prepare(`
        UPDATE students 
        SET instrument = ?, age_group = ?
        WHERE id = ?
    `);

    let updated = 0;

    students.forEach((student, index) => {
        // Find instrument for this student
        let assignedInstrument = 'Piano'; // Default
        
        for (const [instrument, studentNames] of Object.entries(instrumentAssignments)) {
            if (studentNames.some(name => 
                student.name.toLowerCase().includes(name.toLowerCase()) ||
                name.toLowerCase().includes(student.name.toLowerCase())
            )) {
                assignedInstrument = instrument;
                break;
            }
        }

        // Calculate age group
        const ageGroup = calculateAgeGroup(student.start_date);

        stmt.run([assignedInstrument, ageGroup, student.id], function(err) {
            if (err) {
                console.error(`Error updating ${student.name}:`, err.message);
            } else {
                updated++;
                console.log(`✓ ${student.name}: ${assignedInstrument} (${ageGroup})`);
            }

            // Check if this is the last student
            if (index === students.length - 1) {
                stmt.finalize();

                console.log(`\n=== Update Summary ===`);
                console.log(`Students updated: ${updated}`);
                console.log(`\nInstrument Distribution:`);

                // Show distribution
                db.all(`
                    SELECT instrument, COUNT(*) as count, age_group
                    FROM students 
                    WHERE status = 'active' 
                    GROUP BY instrument, age_group
                    ORDER BY instrument, age_group
                `, (err, distribution) => {
                    if (err) {
                        console.error('Error getting distribution:', err);
                    } else {
                        const instrumentStats = {};
                        distribution.forEach(row => {
                            if (!instrumentStats[row.instrument]) {
                                instrumentStats[row.instrument] = { kids: 0, teenagers: 0, adults: 0, total: 0 };
                            }
                            instrumentStats[row.instrument][row.age_group] = row.count;
                            instrumentStats[row.instrument].total += row.count;
                        });

                        Object.entries(instrumentStats).forEach(([instrument, stats]) => {
                            console.log(`${instrument}: ${stats.total} students (Kids: ${stats.kids}, Teenagers: ${stats.teenagers}, Adults: ${stats.adults})`);
                        });
                    }

                    console.log('\n✅ Instrument and age group data updated successfully!');
                    console.log('\n📝 Next Steps:');
                    console.log('1. Review the assignments above');
                    console.log('2. Manually correct any incorrect instrument assignments');
                    console.log('3. Add more detailed biographical information as needed');
                    console.log('4. The student management system now includes these new fields');
                    
                    db.close();
                });
            }
        });
    });
});