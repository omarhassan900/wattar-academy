const fs = require('fs');

console.log('Fixing student view and edit buttons...');

// Read the current server.js file
let serverContent = fs.readFileSync('server.js', 'utf8');

// Find the students route and add the JavaScript functions
const jsFixCode = `
                    // View student profile
                    function viewStudent(studentId) {
                        fetch('/students/' + studentId)
                            .then(response => response.json())
                            .then(student => {
                                const content = generateStudentProfileHTML(student);
                                document.getElementById('studentProfileContent').innerHTML = content;
                                new bootstrap.Modal(document.getElementById('studentProfileModal')).show();
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                alert('Error loading student profile');
                            });
                    }

                    // Edit student
                    function editStudent(studentId) {
                        fetch('/students/' + studentId)
                            .then(response => response.json())
                            .then(student => {
                                const content = generateEditStudentHTML(student);
                                document.getElementById('editStudentContent').innerHTML = content;
                                new bootstrap.Modal(document.getElementById('editStudentModal')).show();
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                alert('Error loading student data');
                            });
                    }

                    // Generate student profile HTML
                    function generateStudentProfileHTML(student) {
                        return \`
                            <div class="row">
                                <div class="col-md-4 text-center">
                                    <div class="card">
                                        <div class="card-body">
                                            <i class="fas \${student.age_group === 'kids' ? 'fa-child' : student.age_group === 'teenagers' ? 'fa-user-graduate' : 'fa-user'} fa-5x text-primary mb-3"></i>
                                            <h4>\${student.name}</h4>
                                            <p class="text-muted">\${student.instrument || 'No instrument set'}</p>
                                            <span class="badge bg-\${student.age_group === 'kids' ? 'info' : student.age_group === 'teenagers' ? 'warning' : 'secondary'} fs-6">
                                                \${student.age_group ? student.age_group.charAt(0).toUpperCase() + student.age_group.slice(1) : 'Not Set'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-8">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <h6 class="text-primary"><i class="fas fa-user me-2"></i>Personal Information</h6>
                                            <table class="table table-sm">
                                                <tr><td><strong>Full Name:</strong></td><td>\${student.name}</td></tr>
                                                <tr><td><strong>National ID:</strong></td><td>\${student.national_id || 'Not provided'}</td></tr>
                                                <tr><td><strong>Date of Birth:</strong></td><td>\${student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : 'Not provided'}</td></tr>
                                                <tr><td><strong>Age Group:</strong></td><td>\${student.age_group || 'Not set'}</td></tr>
                                            </table>
                                        </div>
                                        <div class="col-md-6">
                                            <h6 class="text-success"><i class="fas fa-music me-2"></i>Musical Information</h6>
                                            <table class="table table-sm">
                                                <tr><td><strong>Instrument:</strong></td><td>\${student.instrument || 'Not set'}</td></tr>
                                                <tr><td><strong>Current Level:</strong></td><td>\${student.current_level}</td></tr>
                                                <tr><td><strong>Start Date:</strong></td><td>\${new Date(student.start_date).toLocaleDateString()}</td></tr>
                                                <tr><td><strong>Status:</strong></td><td><span class="badge bg-success">Active</span></td></tr>
                                            </table>
                                        </div>
                                    </div>
                                    <div class="row mt-3">
                                        <div class="col-md-6">
                                            <h6 class="text-info"><i class="fas fa-phone me-2"></i>Contact Information</h6>
                                            <table class="table table-sm">
                                                <tr><td><strong>Student Phone:</strong></td><td>\${student.phone || 'Not provided'}</td></tr>
                                                <tr><td><strong>Parent Phone:</strong></td><td>\${student.parent_phone || 'Not provided'}</td></tr>
                                                <tr><td><strong>Email:</strong></td><td>\${student.email || 'Not provided'}</td></tr>
                                                <tr><td><strong>Parent Name:</strong></td><td>\${student.parent_name || 'Not provided'}</td></tr>
                                            </table>
                                        </div>
                                        <div class="col-md-6">
                                            <h6 class="text-warning"><i class="fas fa-info-circle me-2"></i>Additional Information</h6>
                                            <table class="table table-sm">
                                                <tr><td><strong>Emergency Contact:</strong></td><td>\${student.emergency_contact || 'Not provided'}</td></tr>
                                                <tr><td><strong>Address:</strong></td><td>\${student.address || 'Not provided'}</td></tr>
                                                <tr><td><strong>Medical Notes:</strong></td><td>\${student.medical_notes || 'None'}</td></tr>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        \`;
                    }

                    // Generate edit student HTML
                    function generateEditStudentHTML(student) {
                        return \`
                            <form action="/students/\${student.id}" method="POST">
                                <input type="hidden" name="_method" value="PUT">
                                <div class="row">
                                    <div class="col-md-6">
                                        <h6 class="text-primary mb-3"><i class="fas fa-user me-2"></i>Basic Information</h6>
                                        <div class="mb-3">
                                            <label class="form-label">Student Name *</label>
                                            <input type="text" class="form-control" name="name" value="\${student.name}" required>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">National ID</label>
                                            <input type="text" class="form-control" name="national_id" value="\${student.national_id || ''}">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Date of Birth</label>
                                            <input type="date" class="form-control" name="date_of_birth" value="\${student.date_of_birth || ''}">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Age Group *</label>
                                            <select class="form-control" name="age_group" required>
                                                <option value="kids" \${student.age_group === 'kids' ? 'selected' : ''}>Kids (5-12 years)</option>
                                                <option value="teenagers" \${student.age_group === 'teenagers' ? 'selected' : ''}>Teenagers (13-17 years)</option>
                                                <option value="adults" \${student.age_group === 'adults' ? 'selected' : ''}>Adults (18+ years)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <h6 class="text-success mb-3"><i class="fas fa-music me-2"></i>Musical Information</h6>
                                        <div class="mb-3">
                                            <label class="form-label">Primary Instrument *</label>
                                            <select class="form-control" name="instrument" required>
                                                <option value="Piano" \${student.instrument === 'Piano' ? 'selected' : ''}>Piano</option>
                                                <option value="Guitar" \${student.instrument === 'Guitar' ? 'selected' : ''}>Guitar</option>
                                                <option value="Violin" \${student.instrument === 'Violin' ? 'selected' : ''}>Violin</option>
                                                <option value="Voice/Singing" \${student.instrument === 'Voice/Singing' ? 'selected' : ''}>Voice/Singing</option>
                                                <option value="Drums" \${student.instrument === 'Drums' ? 'selected' : ''}>Drums</option>
                                                <option value="Oud" \${student.instrument === 'Oud' ? 'selected' : ''}>Oud</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Current Level *</label>
                                            <select class="form-control" name="current_level" required>
                                                <option value="Level One" \${student.current_level === 'Level One' ? 'selected' : ''}>Level One</option>
                                                <option value="Level Two" \${student.current_level === 'Level Two' ? 'selected' : ''}>Level Two</option>
                                                <option value="Level Three" \${student.current_level === 'Level Three' ? 'selected' : ''}>Level Three</option>
                                                <option value="Level Four" \${student.current_level === 'Level Four' ? 'selected' : ''}>Level Four</option>
                                                <option value="Level Five" \${student.current_level === 'Level Five' ? 'selected' : ''}>Level Five</option>
                                                <option value="Level Six" \${student.current_level === 'Level Six' ? 'selected' : ''}>Level Six</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Start Date *</label>
                                            <input type="date" class="form-control" name="start_date" value="\${student.start_date}" required>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <h6 class="text-info mb-3"><i class="fas fa-phone me-2"></i>Contact Information</h6>
                                        <div class="mb-3">
                                            <label class="form-label">Student Phone</label>
                                            <input type="text" class="form-control" name="phone" value="\${student.phone || ''}">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Parent/Guardian Phone</label>
                                            <input type="text" class="form-control" name="parent_phone" value="\${student.parent_phone || ''}">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Email</label>
                                            <input type="email" class="form-control" name="email" value="\${student.email || ''}">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <h6 class="text-warning mb-3"><i class="fas fa-info-circle me-2"></i>Additional Information</h6>
                                        <div class="mb-3">
                                            <label class="form-label">Parent/Guardian Name</label>
                                            <input type="text" class="form-control" name="parent_name" value="\${student.parent_name || ''}">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Emergency Contact</label>
                                            <input type="text" class="form-control" name="emergency_contact" value="\${student.emergency_contact || ''}">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Medical Notes</label>
                                            <textarea class="form-control" name="medical_notes" rows="2">\${student.medical_notes || ''}</textarea>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                    <button type="submit" class="btn btn-primary">
                                        <i class="fas fa-save me-2"></i>Update Student
                                    </button>
                                </div>
                            </form>
                        \`;
                    }
`;

// Add the modals HTML to the students content
const modalsHTML = `
                    <!-- Student Profile Modal -->
                    <div class="modal fade" id="studentProfileModal" tabindex="-1">
                        <div class="modal-dialog modal-xl">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">
                                        <i class="fas fa-user me-2"></i>Student Profile
                                    </h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body" id="studentProfileContent">
                                    <!-- Content will be loaded here -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Edit Student Modal -->
                    <div class="modal fade" id="editStudentModal" tabindex="-1">
                        <div class="modal-dialog modal-xl">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">
                                        <i class="fas fa-edit me-2"></i>Edit Student
                                    </h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body" id="editStudentContent">
                                    <!-- Content will be loaded here -->
                                </div>
                            </div>
                        </div>
                    </div>
`;

// Find where to insert the JavaScript and modals
if (serverContent.includes('function editStudent(studentId)')) {
    console.log('JavaScript functions already exist in server.js');
} else {
    // Find the position to insert the JavaScript (before the closing script tag)
    const scriptPosition = serverContent.indexOf('</script>');
    if (scriptPosition !== -1) {
        serverContent = serverContent.slice(0, scriptPosition) + jsFixCode + serverContent.slice(scriptPosition);
        
        // Also add the modals HTML before the script section
        const modalPosition = serverContent.indexOf('<script>');
        if (modalPosition !== -1) {
            serverContent = serverContent.slice(0, modalPosition) + modalsHTML + serverContent.slice(modalPosition);
        }
        
        // Write the updated content back to server.js
        fs.writeFileSync('server.js', serverContent);
        console.log('✓ Added JavaScript functions and modals to server.js');
    } else {
        console.log('Could not find script section in server.js');
    }
}

console.log('Student buttons should now work properly!');
console.log('Restart the server to apply changes.');