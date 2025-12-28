// Profile Page JavaScript

document.addEventListener('DOMContentLoaded', async () => {
    // This is a protected page - check authentication
    if (!App.utils.requireAuth()) {
        return;
    }
    
    // Setup logout button
    const logoutBtn = document.getElementById('logout-profile-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await Auth.logoutUser();
            window.location.href = '../index.html';
        });
    }
    
    // Load profile data
    await loadProfile();
});

async function loadProfile() {
    const profileInfo = document.getElementById('profile-info');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    
    if (!profileInfo) return;
    
    try {
        const response = await Auth.fetchWithAuth('http://localhost:3000/profile');
        
        if (!response.ok) {
            if (response.status === 401) {
                // Token expired
                Auth.setAuthToken(null);
                App.utils.requireAuth();
                return;
            }
            throw new Error('Failed to fetch profile');
        }
        
        const profile = await response.json();
        
        // Hide loading
        loadingElement.style.display = 'none';
        
        // Display profile
        profileInfo.innerHTML = createProfileHTML(profile);
        
    } catch (error) {
        console.error('Error loading profile:', error);
        loadingElement.style.display = 'none';
        errorElement.style.display = 'block';
        errorElement.textContent = error.message || 'Failed to load profile';
    }
}

function createProfileHTML(profile) {
    const joinDate = profile.createdAt ? new Date(profile.createdAt) : new Date();
    
    return `
        <div class="info-group">
            <div class="info-label">Username</div>
            <div class="info-value">${profile.username || profile.name || 'User'}</div>
        </div>
        
        <div class="info-group">
            <div class="info-label">Email Address</div>
            <div class="info-value">${profile.email || 'Not provided'}</div>
        </div>
        
        <div class="info-group">
            <div class="info-label">Account Created</div>
            <div class="info-value">${formatDate(joinDate)}</div>
        </div>
        
        <div class="info-group">
            <div class="info-label">Member Status</div>
            <div class="info-value">
                <span class="status-active">Active Member</span>
            </div>
        </div>
        
        <div class="info-group">
            <div class="info-label">Account Type</div>
            <div class="info-value">Standard User</div>
        </div>
    `;
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}