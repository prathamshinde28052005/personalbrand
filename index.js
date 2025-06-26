// Database Simulation
let patientsDB = [];
let appointmentsDB = [];
let remindersDB = [];

// DOM Elements
const pages = {
    'login-page': document.getElementById('login-page'),
    'main-menu': document.getElementById('main-menu'),
    'add-patient': document.getElementById('add-patient'),
    'view-patient': document.getElementById('view-patient'),
    'delete-patient': document.getElementById('delete-patient'),
    'upload-photo': document.getElementById('upload-photo'),
    'ai-assistant': document.getElementById('ai-assistant')
};

// Navigation Functions
function showPage(pageId) {
    Object.values(pages).forEach(page => {
        if (page) {
            page.classList.add('hidden');
        }
    });
    
    if (pages[pageId]) {
        pages[pageId].classList.remove('hidden');
    }
}

// Helper Functions
function showError(message) {
    Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        background: '#1a1a2e',
        color: '#e6f9ff',
        confirmButtonColor: '#6a4c93'
    });
}

function addChatMessage(content, sender) {
    const chatBox = document.getElementById('chat-box');
    if (!chatBox) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', sender);
    
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    contentDiv.textContent = content;
    
    messageDiv.appendChild(contentDiv);
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Initialize the application
function initApp() {
    // Login Button
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const username = document.getElementById('username')?.value;
            const password = document.getElementById('password')?.value;
            
            if (username === 'pratham' && password === '1234') {
                showPage('main-menu');
            } else {
                showError('Invalid username or password!');
            }
        });
    }

    // Logout Button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            showPage('login-page');
        });
    }

    // Menu buttons
    document.querySelectorAll('.three-d-menu-button').forEach(button => {
        button.addEventListener('click', () => {
            const page = button.getAttribute('data-page');
            showPage(page);
        });
    });

    // Back buttons
    document.querySelectorAll('.back-btn').forEach(button => {
        button.addEventListener('click', () => {
            const page = button.getAttribute('data-page');
            showPage(page);
        });
    });

    // Add Patient
    const savePatientBtn = document.getElementById('save-patient-btn');
    if (savePatientBtn) {
        savePatientBtn.addEventListener('click', () => {
            const patient = {
                id: document.getElementById('patient-id')?.value,
                name: document.getElementById('patient-name')?.value,
                doctor: document.getElementById('doctor-name')?.value,
                age: document.getElementById('age')?.value,
                gender: document.getElementById('gender')?.value,
                contact: document.getElementById('contact')?.value,
                medication: document.getElementById('medication')?.value,
                appointmentDate: document.getElementById('appointment-date')?.value,
                treatmentHistory: document.getElementById('treatment-history')?.value,
                photoPath: ''
            };
            
            if (!patient.id || !patient.name) {
                showError('Patient ID and Name are required fields!');
                return;
            }
            
            if (patientsDB.some(p => p.id === patient.id)) {
                showError('Patient ID already exists!');
                return;
            }
            
            patientsDB.push(patient);
            
            Swal.fire({
                title: 'Success',
                text: 'Patient added successfully!',
                icon: 'success',
                background: '#1a1a2e',
                color: '#e6f9ff',
                confirmButtonColor: '#6a4c93'
            }).then(() => {
                showPage('main-menu');
                document.querySelectorAll('#add-patient input, #add-patient textarea').forEach(el => {
                    if (el) el.value = '';
                });
            });
        });
    }

    // View Patient
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const patientId = document.getElementById('search-id')?.value;
            const detailsContainer = document.getElementById('patient-details');
            const photoContainer = document.getElementById('patient-photo');
            
            if (!patientId) {
                showError('Please enter a Patient ID!');
                return;
            }
            
            const patient = patientsDB.find(p => p.id === patientId);
            
            if (!patient) {
                if (detailsContainer) detailsContainer.classList.add('hidden');
                showError('No patient found with that ID!');
                return;
            }
            
            // Fill in details
            const detailIds = [
                'detail-id', 'detail-name', 'detail-doctor', 'detail-age',
                'detail-gender', 'detail-contact', 'detail-medication',
                'detail-date', 'detail-history'
            ];
            
            detailIds.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    const field = id.split('-')[1];
                    element.textContent = patient[field] || '';
                }
            });
            
            // Handle photo
            if (photoContainer) {
                photoContainer.innerHTML = '';
                if (patient.photoPath) {
                    const img = document.createElement('img');
                    img.src = patient.photoPath;
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                    photoContainer.appendChild(img);
                } else {
                    photoContainer.innerHTML = '<div class="photo-placeholder">NO PHOTO AVAILABLE</div>';
                }
            }
            
            if (detailsContainer) detailsContainer.classList.remove('hidden');
        });
    }

    // Delete Patient
    const deleteBtn = document.getElementById('delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            const patientId = document.getElementById('delete-id')?.value;
            
            if (!patientId) {
                showError('Please enter a Patient ID!');
                return;
            }
            
            const patientIndex = patientsDB.findIndex(p => p.id === patientId);
            
            if (patientIndex === -1) {
                showError('No patient found with that ID!');
                return;
            }
            
            Swal.fire({
                title: 'Confirm Deletion',
                text: `Are you sure you want to delete patient ${patientsDB[patientIndex].name}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ff6b6b',
                cancelButtonColor: '#6a4c93',
                background: '#1a1a2e',
                color: '#e6f9ff',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    patientsDB.splice(patientIndex, 1);
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Patient has been deleted.',
                        icon: 'success',
                        background: '#1a1a2e',
                        color: '#e6f9ff',
                        confirmButtonColor: '#6a4c93'
                    }).then(() => {
                        showPage('main-menu');
                        const deleteInput = document.getElementById('delete-id');
                        if (deleteInput) deleteInput.value = '';
                    });
                }
            });
        });
    }

    // Upload Photo
    let selectedPhoto = null;
    const browseBtn = document.getElementById('browse-btn');
    const photoInput = document.getElementById('photo-input');
    
    if (browseBtn && photoInput) {
        browseBtn.addEventListener('click', () => {
            photoInput.click();
        });
        
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                selectedPhoto = event.target.result;
                const preview = document.getElementById('photo-preview');
                if (preview) {
                    preview.innerHTML = '';
                    const img = document.createElement('img');
                    img.src = selectedPhoto;
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                    preview.appendChild(img);
                }
            };
            reader.readAsDataURL(file);
        });
    }

    const uploadBtn = document.getElementById('upload-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            const patientId = document.getElementById('upload-id')?.value;
            
            if (!patientId) {
                showError('Please enter a Patient ID!');
                return;
            }
            
            if (!selectedPhoto) {
                showError('Please select a photo first!');
                return;
            }
            
            const patientIndex = patientsDB.findIndex(p => p.id === patientId);
            
            if (patientIndex === -1) {
                showError('No patient found with that ID!');
                return;
            }
            
            patientsDB[patientIndex].photoPath = selectedPhoto;
            
            Swal.fire({
                title: 'Success',
                text: 'Photo uploaded successfully!',
                icon: 'success',
                background: '#1a1a2e',
                color: '#e6f9ff',
                confirmButtonColor: '#6a4c93'
            }).then(() => {
                showPage('main-menu');
                const uploadInput = document.getElementById('upload-id');
                if (uploadInput) uploadInput.value = '';
                selectedPhoto = null;
                const preview = document.getElementById('photo-preview');
                if (preview) preview.innerHTML = '<div class="preview-placeholder">NO PHOTO SELECTED</div>';
                if (photoInput) photoInput.value = '';
            });
        });
    }

    // AI Assistant
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');
    
    function processChatInput() {
        if (!chatInput) return;
        
        const userInput = chatInput.value.trim();
        if (!userInput) return;
        
        addChatMessage(userInput, 'user');
        chatInput.value = '';
        
        // Process input and generate response
        let response = "I didn't understand. How can I help you?";
        
        if (userInput.toLowerCase().includes('book appointment')) {
            const name = userInput.toLowerCase().includes('for') ? 
                userInput.split('for')[1].trim() : 'Patient';
            appointmentsDB.push({ name, date: 'Tomorrow' });
            response = `Appointment booked for ${name} on Tomorrow.`;
        } 
        else if (userInput.toLowerCase().includes('set reminder')) {
            const words = userInput.split(' ');
            if (words.includes('at')) {
                const index = words.indexOf('at');
                const medicine = words.slice(0, index).join(' ');
                const time = words[index + 1];
                remindersDB.push({ medicine, time });
                response = `Reminder set for ${medicine} at ${time}.`;
            }
        }
        else if (userInput.toLowerCase().includes('show my appointments')) {
            if (appointmentsDB.length > 0) {
                response = "Your Appointments:\n" + appointmentsDB.map(a => `${a.name} - ${a.date}`).join('\n');
            } else {
                response = "No appointments found.";
            }
        }
        else if (userInput.toLowerCase().includes('show my reminders')) {
            if (remindersDB.length > 0) {
                response = "Your Reminders:\n" + remindersDB.map(r => `${r.medicine} at ${r.time}`).join('\n');
            } else {
                response = "No reminders found.";
            }
        }
        else if (userInput.toLowerCase().includes('help')) {
            response = `I can help with:
- Book appointment for [name]
- Set reminder for [medicine] at [time]
- Show my appointments
- Show my reminders`;
        }
        
        setTimeout(() => {
            addChatMessage(response, 'bot');
        }, 500);
    }
    
    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', processChatInput);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                processChatInput();
            }
        });
    }

    const voiceBtn = document.getElementById('voice-btn');
    if (voiceBtn) {
        voiceBtn.addEventListener('click', () => {
            addChatMessage("Voice input is not supported in this demo. Please type your message.", 'bot');
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
