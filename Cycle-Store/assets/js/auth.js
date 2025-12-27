// Authentication JavaScript for Cycle Store Demo

// Function to check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// Function to get current user
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// Function to register a new user
function registerUser(name, email, password) {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(user => user.email === email);
    
    if (existingUser) {
        return {
            success: false,
            message: 'User with this email already exists'
        };
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password, // In a real app, this would be hashed
        createdAt: new Date().toISOString()
    };
    
    // Save user
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return {
        success: true,
        message: 'User registered successfully',
        user: newUser
    };
}

// Function to login user
function loginUser(email, password) {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check for demo account
    if (email === 'demo@cyclestore.com' && password === 'demo123') {
        // Create demo user if it doesn't exist
        let demoUser = users.find(user => user.email === 'demo@cyclestore.com');
        
        if (!demoUser) {
            demoUser = {
                id: 1,
                name: 'Demo User',
                email: 'demo@cyclestore.com',
                password: 'demo123',
                createdAt: new Date().toISOString()
            };
            users.push(demoUser);
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        // Set as current user
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
        return {
            success: true,
            message: 'Login successful'
        };
    }
    
    // Check for regular user
    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
        // Set as current user
        localStorage.setItem('currentUser', JSON.stringify(user));
        return {
            success: true,
            message: 'Login successful'
        };
    } else {
        return {
            success: false,
            message: 'Invalid email or password'
        };
    }
}

// Function to logout user
function logoutUser() {
    localStorage.removeItem('currentUser');
}

// Function to check if user is logged in on page load
function checkAuthStatus() {
    const currentUser = getCurrentUser();
    const currentPage = window.location.pathname;
    
    // Redirect to home if user is logged in and tries to access login/register pages
    if (currentUser && (currentPage.includes('login.html') || currentPage.includes('register.html'))) {
        window.location.href = './index.html';
    }
    
    // Redirect to login if user is not logged in and tries to access protected pages
    if (!currentUser && currentPage.includes('profile.html')) {
        window.location.href = './login.html';
    }
}

// Initialize auth check on page load
document.addEventListener('DOMContentLoaded', checkAuthStatus);