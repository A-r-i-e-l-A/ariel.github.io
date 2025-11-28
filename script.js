// Shared User Session Management Functions

// Initialize users array from localStorage or create empty array
function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Get current logged in user
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// Set current logged in user
function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Clear current user (logout)
function clearCurrentUser() {
    localStorage.removeItem('currentUser');
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Register new user
function registerUser(name, email, password) {
    const users = getUsers();
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
        return { success: false, message: 'El email ya está registrado' };
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        isAdmin: name.toLowerCase() === 'admin'
    };
    
    users.push(newUser);
    saveUsers(users);
    
    return { success: true, message: 'Usuario registrado correctamente' };
}

// Login user
function loginUser(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Don't store password in current session
        const sessionUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        };
        setCurrentUser(sessionUser);
        return { success: true, message: 'Inicio de sesión exitoso' };
    }
    
    return { success: false, message: 'Email o contraseña incorrectos' };
}

// ===== FORM SUBMISSIONS MANAGEMENT =====

// Get all form submissions
function getAllFormSubmissions() {
    const submissions = localStorage.getItem('formSubmissions');
    return submissions ? JSON.parse(submissions) : [];
}

// Get submissions by user ID
function getSubmissionsByUser(userId) {
    const allSubmissions = getAllFormSubmissions();
    return allSubmissions.filter(session => session.userId === userId);
}

// Get submissions by user name
function getSubmissionsByUserName(userName) {
    const allSubmissions = getAllFormSubmissions();
    return allSubmissions.filter(session => session.userName === userName);
}

// Get single session by session ID
function getSessionById(sessionId) {
    const allSubmissions = getAllFormSubmissions();
    return allSubmissions.find(session => session.sessionId === sessionId);
}

// Get all sessions grouped by user
function getSessionsGroupedByUser() {
    const allSubmissions = getAllFormSubmissions();
    const grouped = {};
    
    allSubmissions.forEach(session => {
        if (!grouped[session.userName]) {
            grouped[session.userName] = [];
        }
        grouped[session.userName].push(session);
    });
    
    return grouped;
}

// Get summary statistics for all users
function getAllUserStats() {
    const allSubmissions = getAllFormSubmissions();
    const userStats = {};
    
    allSubmissions.forEach(session => {
        if (!userStats[session.userName]) {
            userStats[session.userName] = {
                userName: session.userName,
                totalSessions: 0,
                totalEntries: 0,
                totalErrors: 0,
                totalTime: 0,
                sessions: []
            };
        }
        
        userStats[session.userName].totalSessions++;
        userStats[session.userName].totalEntries += session.totalEntries || session.entries.length;
        userStats[session.userName].totalErrors += session.errors || 0;
        userStats[session.userName].totalTime += session.totalTime || 0;
        userStats[session.userName].sessions.push(session);
    });
    
    return Object.values(userStats);
}