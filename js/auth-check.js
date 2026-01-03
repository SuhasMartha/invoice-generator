// Shared Authentication & Demo Mode Module
// Include this on all pages after auth.js

(function() {
    'use strict';

    // Check session on page load
    document.addEventListener('DOMContentLoaded', initPageAuth);

    function initPageAuth() {
        const currentUser = getCurrentUser();
        const isDemoMode = checkDemoMode();

        if (isDemoMode || !currentUser) {
            // Show demo banner
            showDemoBanner();
            // Enable demo mode in localStorage for the session
            sessionStorage.setItem('invoicepro_demo', 'true');
        } else {
            // User is logged in - update UI
            updateUserUI(currentUser);
        }

        // Update sidebar user info if exists
        updateSidebarUserInfo(currentUser);
    }

    // Get current user from session
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

    // Check if demo mode from URL or session
    function checkDemoMode() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlDemo = urlParams.get('demo') === 'true';
        const sessionDemo = sessionStorage.getItem('invoicepro_demo') === 'true';
        return urlDemo || sessionDemo;
    }

    // Show demo mode banner
    function showDemoBanner() {
        // Don't show on login page
        if (window.location.pathname.includes('login.html')) {
            return;
        }

        const banner = document.createElement('div');
        banner.className = 'demo-banner';
        banner.id = 'demoBanner';
        banner.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <span>You're in Demo Mode. Your data won't be saved permanently.</span>
            <a href="login.html">Sign up free</a>
            <span>to save your company profile and invoices.</span>
            <button class="close-banner" onclick="closeDemoBanner()" title="Close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;

        document.body.insertBefore(banner, document.body.firstChild);
        document.body.classList.add('has-demo-banner');

        // Inject demo banner styles if not already loaded
        if (!document.querySelector('link[href*="auth.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/auth.css';
            document.head.appendChild(link);
        }
    }

    // Close demo banner
    window.closeDemoBanner = function() {
        const banner = document.getElementById('demoBanner');
        if (banner) {
            banner.remove();
            document.body.classList.remove('has-demo-banner');
        }
    };

    // Update UI for logged in user
    function updateUserUI(user) {
        // Remove demo banner if exists
        const banner = document.getElementById('demoBanner');
        if (banner) {
            banner.remove();
            document.body.classList.remove('has-demo-banner');
        }

        // Could add user-specific UI updates here
    }

    // Update sidebar user info
    function updateSidebarUserInfo(user) {
        const userInfo = document.querySelector('.user-info');
        if (!userInfo) return;

        if (user && !user.isDemo) {
            const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            userInfo.innerHTML = `
                <div class="user-avatar">${initials}</div>
                <div class="user-details">
                    <span class="user-name">${user.name}</span>
                    <span class="user-email">${user.email}</span>
                </div>
                <button class="user-menu-btn" onclick="toggleUserMenu()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
            `;

            // Add dropdown menu
            const dropdown = document.createElement('div');
            dropdown.className = 'user-dropdown';
            dropdown.id = 'userDropdown';
            dropdown.innerHTML = `
                <a href="profile.html" class="dropdown-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Company Profile
                </a>
                <a href="settings.html" class="dropdown-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    Settings
                </a>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item logout" onclick="logoutUser()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                </button>
            `;
            userInfo.appendChild(dropdown);
        } else {
            // Demo user
            userInfo.innerHTML = `
                <div class="user-avatar" style="background: linear-gradient(135deg, #F59E0B, #D97706);">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" width="20" height="20">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                </div>
                <div class="user-details">
                    <span class="user-name">Demo Mode</span>
                    <span class="user-email"><a href="login.html" style="color: var(--primary-color);">Login to save</a></span>
                </div>
            `;
        }
    }

    // Toggle user dropdown menu
    window.toggleUserMenu = function() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    };

    // Logout user
    window.logoutUser = function() {
        localStorage.removeItem('invoicepro_session');
        sessionStorage.removeItem('invoicepro_session');
        sessionStorage.removeItem('invoicepro_demo');
        window.location.href = 'login.html';
    };

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-info')) {
            const dropdown = document.getElementById('userDropdown');
            if (dropdown) {
                dropdown.classList.remove('show');
            }
        }
    });

    // Check if user is logged in (not demo)
    window.isLoggedIn = function() {
        const user = getCurrentUser();
        return user && !user.isDemo;
    };

    // Get user data for saving
    window.getUserDataForSave = function() {
        const user = getCurrentUser();
        if (!user || user.isDemo) {
            return null;
        }
        
        const users = JSON.parse(localStorage.getItem('invoicepro_users') || '[]');
        return users.find(u => u.id === user.id);
    };

    // Save data for logged in user
    window.saveUserData = function(key, data) {
        const user = getCurrentUser();
        if (!user || user.isDemo) {
            // Demo mode - save to regular localStorage but warn
            return false;
        }
        
        const users = JSON.parse(localStorage.getItem('invoicepro_users') || '[]');
        const index = users.findIndex(u => u.id === user.id);
        
        if (index !== -1) {
            users[index][key] = data;
            localStorage.setItem('invoicepro_users', JSON.stringify(users));
            return true;
        }
        return false;
    };

})();
