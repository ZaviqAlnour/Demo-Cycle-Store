// Main JavaScript - Shared functionality across all pages

// Global configuration
const API_BASE_URL = 'http://localhost:3000';
let authToken = null;

// Load header and footer components
async function loadComponents() {
    try {
        // Load header
        const headerResponse = await fetch('./components/header.html');
        const headerHTML = await headerResponse.text();
        const headerElement = document.querySelector('header');
        if (headerElement) {
            headerElement.innerHTML = headerHTML;
            setupHeader();
        }

        // Load footer
        const footerResponse = await fetch('./components/footer.html');
        const footerHTML = await footerResponse.text();
        const footerElement = document.querySelector('footer');
        if (footerElement) {
            footerElement.innerHTML = footerHTML;
            setupFooter();
        }
    } catch (error) {
        console.error('Error loading components:', error);
    }
}

// Setup header functionality
function setupHeader() {
    const authLinks = document.querySelector('.auth-links');
    const userLinks = document.querySelector('.user-links');
    
    if (!authLinks || !userLinks) return;
    
    const isAuth = isAuthenticated();
    
    if (isAuth) {
        authLinks.style.display = 'none';
        userLinks.style.display = 'flex';
        
        // Setup logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await logoutUser();
                window.location.href = './index.html';
            });
        }
    } else {
        authLinks.style.display = 'flex';
        userLinks.style.display = 'none';
    }
}

// Setup footer functionality
function setupFooter() {
    // Ensure footer stays at bottom
    document.body.style.minHeight = '100vh';
    document.body.style.display = 'flex';
    document.body.style.flexDirection = 'column';
    
    const main = document.querySelector('main');
    if (main) {
        main.style.flex = '1';
    }
}

// Auth guard for protected pages
function requireAuth(redirectTo = './login.html') {
    if (!isAuthenticated()) {
        window.location.href = redirectTo;
        return false;
    }
    return true;
}

// Auth guard for auth pages (login/register)
function requireNoAuth(redirectTo = './index.html') {
    if (isAuthenticated()) {
        window.location.href = redirectTo;
        return false;
    }
    return true;
}

// Get URL query parameters
function getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const pairs = queryString.split('&');
    
    for (const pair of pairs) {
        const [key, value] = pair.split('=');
        if (key) {
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
    }
    
    return params;
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
});

// Export for use in other modules
window.App = window.App || {};
window.App.utils = {
    getQueryParams,
    showNotification,
    requireAuth,
    requireNoAuth
};