// Register Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Redirect if already authenticated
    if (Auth.isAuthenticated()) {
        window.location.href = './index.html';
        return;
    }
    
    const registerForm = document.getElementById('register-form');
    const submitBtn = document.getElementById('submit-btn');
    const passwordInput = document.getElementById('password');
    
    // Password strength indicator (optional)
    passwordInput.addEventListener('input', function() {
        const strength = checkPasswordStrength(this.value);
        showPasswordStrength(strength);
    });
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();
        
        // Validation
        let isValid = true;
        
        if (!name) {
            showError('name-error', 'Name is required');
            isValid = false;
        } else {
            hideError('name-error');
        }
        
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
        } else if (password.length < 6) {
            showError('password-error', 'Password must be at least 6 characters');
            isValid = false;
        } else {
            hideError('password-error');
        }
        
        if (!confirmPassword) {
            showError('confirm-password-error', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError('confirm-password-error', 'Passwords do not match');
            isValid = false;
        } else {
            hideError('confirm-password-error');
        }
        
        if (!isValid) return;
        
        // Show loading state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading-btn');
        
        try {
            const result = await Auth.registerUser({ name, email, password });
            
            if (result.success) {
                window.location.href = './index.html';
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            showError('email-error', error.message || 'Registration failed. Please try again.');
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

function checkPasswordStrength(password) {
    if (password.length === 0) return '';
    if (password.length < 6) return 'weak';
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    
    let score = 0;
    if (hasUpperCase) score++;
    if (hasLowerCase) score++;
    if (hasNumbers) score++;
    if (hasSpecialChar) score++;
    if (password.length >= 8) score++;
    
    if (score >= 4) return 'strong';
    if (score >= 3) return 'medium';
    return 'weak';
}

function showPasswordStrength(strength) {
    let strengthElement = document.getElementById('password-strength');
    
    if (!strengthElement) {
        strengthElement = document.createElement('div');
        strengthElement.id = 'password-strength';
        strengthElement.className = 'password-strength';
        document.getElementById('password-error').parentNode.appendChild(strengthElement);
    }
    
    if (!strength) {
        strengthElement.textContent = '';
        return;
    }
    
    const messages = {
        weak: 'Password strength: Weak',
        medium: 'Password strength: Medium',
        strong: 'Password strength: Strong'
    };
    
    strengthElement.textContent = messages[strength];
    strengthElement.className = `password-strength strength-${strength}`;
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