// Authentication Module for InvoicePro

// Demo user data (for testing)
const DEMO_USER = {
    id: 'demo',
    name: 'Demo User',
    email: 'demo@example.com',
    company: 'Demo Company',
    isDemo: true
};

// Initialize auth module
document.addEventListener('DOMContentLoaded', () => {
    initAuthPage();
});

function initAuthPage() {
    // Check if already logged in
    const currentUser = getCurrentUser();
    if (currentUser && !currentUser.isDemo) {
        window.location.href = 'dashboard.html';
        return;
    }

    setupTabSwitching();
    setupForms();
}

// Tab switching between Login and Signup
function setupTabSwitching() {
    const tabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show/hide forms
            if (targetTab === 'login') {
                loginForm.classList.add('active');
                signupForm.classList.remove('active');
            } else {
                signupForm.classList.add('active');
                loginForm.classList.remove('active');
            }
        });
    });
}

// Setup form submissions
function setupForms() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Get stored users
    const users = getStoredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        showToast('No account found with this email', 'error');
        return;
    }

    if (user.password !== hashPassword(password)) {
        showToast('Incorrect password', 'error');
        return;
    }

    // Login successful
    loginUser(user, rememberMe);
    showToast('Login successful! Redirecting...', 'success');
    
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

// Handle signup
function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const company = document.getElementById('signupCompany').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Validation
    if (!name || !company || !email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }

    if (!agreeTerms) {
        showToast('Please agree to the terms and conditions', 'error');
        return;
    }

    // Check if email already exists
    const users = getStoredUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        showToast('An account with this email already exists', 'error');
        return;
    }

    // Create new user
    const newUser = {
        id: 'user_' + Date.now(),
        name: name,
        email: email,
        company: company,
        password: hashPassword(password),
        createdAt: new Date().toISOString(),
        businessDetails: {
            businessName: company,
            businessAddress: '',
            businessEmail: email,
            businessPhone: '',
            businessLogo: ''
        },
        invoices: [],
        clients: []
    };

    // Store user
    users.push(newUser);
    localStorage.setItem('invoicepro_users', JSON.stringify(users));

    // Auto-login
    loginUser(newUser, true);
    showToast('Account created successfully! Redirecting...', 'success');
    
    setTimeout(() => {
        window.location.href = 'profile.html?welcome=true';
    }, 1000);
}

// Login user (set session)
function loginUser(user, remember = false) {
    const sessionUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company,
        isDemo: user.isDemo || false
    };

    if (remember) {
        localStorage.setItem('invoicepro_session', JSON.stringify(sessionUser));
    } else {
        sessionStorage.setItem('invoicepro_session', JSON.stringify(sessionUser));
    }
}

// Get current logged in user
function getCurrentUser() {
    const localSession = localStorage.getItem('invoicepro_session');
    const sessionSession = sessionStorage.getItem('invoicepro_session');
    
    if (localSession) {
        return JSON.parse(localSession);
    }
    if (sessionSession) {
        return JSON.parse(sessionSession);
    }
    return null;
}

// Get full user data (including business details, invoices, etc.)
function getFullUserData(userId) {
    if (!userId || userId === 'demo') {
        return null;
    }
    
    const users = getStoredUsers();
    return users.find(u => u.id === userId);
}

// Get stored users
function getStoredUsers() {
    return JSON.parse(localStorage.getItem('invoicepro_users') || '[]');
}

// Update user data
function updateUserData(userId, updates) {
    const users = getStoredUsers();
    const index = users.findIndex(u => u.id === userId);
    
    if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        localStorage.setItem('invoicepro_users', JSON.stringify(users));
        return true;
    }
    return false;
}

// Logout
function logout() {
    localStorage.removeItem('invoicepro_session');
    sessionStorage.removeItem('invoicepro_session');
    window.location.href = 'login.html';
}

// Simple password hashing (for demo - use bcrypt in production!)
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return 'hash_' + Math.abs(hash).toString(16);
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const btn = input.parentElement.querySelector('.toggle-password');
    
    if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
        `;
    } else {
        input.type = 'password';
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>
        `;
    }
}

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.querySelector('.toast-message').textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Check if in demo mode
function isDemoMode() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('demo') === 'true';
}

// Export functions for use in other files
window.AuthModule = {
    getCurrentUser,
    getFullUserData,
    updateUserData,
    logout,
    isDemoMode,
    loginUser,
    DEMO_USER
};
