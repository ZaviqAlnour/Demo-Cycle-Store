// Login Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Redirect if already authenticated
    if (Auth.isAuthenticated()) {
        window.location.href = './index.html';
        return;
    }
    
    const loginForm = document.getElementById('login-form');
    const submitBtn = document.getElementById('submit-btn');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        
        // Basic validation
        let isValid = true;
        
        if (!email) {
            showError('email-error', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email-error', 'Please enter a valid email');
            isValid = false;
        } else {
            hideError('email-error');
        }
        
        if (!password) {
            showError('password-error', 'Password is required');
            isValid = false;
        } else {
            hideError('password-error');
        }
        
        if (!isValid) return;
        
        // Show loading state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Signing In...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading-btn');
        
        try {
            const result = await Auth.loginUser({ email, password });
            
            if (result.success) {
                window.location.href = './index.html';
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            showError('password-error', error.message || 'Login failed. Please check your credentials.');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading-btn');
        }
    });
});

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.classList.add('show');
        element.previousElementSibling.classList.add('error');
    }
}

function hideError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('show');
        element.previousElementSibling.classList.remove('error');
    }
}