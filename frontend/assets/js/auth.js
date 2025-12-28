// Authentication module - Pure API calls only

const API_BASE_URL = 'http://localhost:3000';
let authToken = null;

// Store token in memory
function setAuthToken(token) {
    authToken = token;
}

// Get current auth token
function getAuthToken() {
    return authToken;
}

// Check if user is authenticated
function isAuthenticated() {
    return authToken !== null;
}

// Register new user
async function registerUser(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        if (data.token) {
            setAuthToken(data.token);
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Login user
async function loginUser(credentials) {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        if (data.token) {
            setAuthToken(data.token);
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Logout user
async function logoutUser() {
    try {
        if (authToken) {
            await fetch(`${API_BASE_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
        }
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Always clear token
        authToken = null;
    }
}

// Fetch with auth headers
async function fetchWithAuth(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (response.status === 401) {
        // Token expired or invalid
        authToken = null;
        throw new Error('Authentication required');
    }

    return response;
}

// Export functions
window.Auth = {
    registerUser,
    loginUser,
    logoutUser,
    isAuthenticated,
    getAuthToken,
    fetchWithAuth,
    setAuthToken
};