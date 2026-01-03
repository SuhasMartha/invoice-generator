// Profile Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    initProfilePage();
});

function initProfilePage() {
    loadProfileData();
    checkWelcomeState();
    setupMobileMenu();
    setupColorPicker();
}

// Load profile data
function loadProfileData() {
    const user = window.getCurrentUser ? getCurrentUser() : null;
    
    if (user && !user.isDemo) {
        // Load from user's saved data
        const userData = getUserDataForSave();
        if (userData && userData.businessDetails) {
            populateForm(userData.businessDetails);
        }
    } else {
        // Demo mode - load from localStorage
        loadFromLocalStorage();
    }
}

// Populate form with data
function populateForm(data) {
    // Company Info
    document.getElementById('companyName').value = data.businessName || data.companyName || '';
    document.getElementById('companyAddress').value = data.businessAddress || data.companyAddress || '';
    document.getElementById('companyEmail').value = data.businessEmail || data.companyEmail || '';
    document.getElementById('companyPhone').value = data.businessPhone || data.companyPhone || '';
    document.getElementById('companyWebsite').value = data.website || '';
    
    // Logo & Branding
    if (data.businessLogo || data.logoUrl) {
        document.getElementById('logoUrl').value = data.businessLogo || data.logoUrl || '';
        previewLogo();
    }
    if (data.brandColor || data.accentColor) {
        document.getElementById('brandColor').value = data.brandColor || data.accentColor || '#4F46E5';
        document.getElementById('brandColorHex').value = data.brandColor || data.accentColor || '#4F46E5';
    }
    
    // Tax Info
    document.getElementById('gstNumber').value = data.gstNumber || '';
    document.getElementById('panNumber').value = data.panNumber || '';
    document.getElementById('defaultTaxRate').value = data.defaultTaxRate || data.taxRate || '';
    document.getElementById('defaultTaxName').value = data.defaultTaxName || data.taxName || '';
    
    // Payment Info
    document.getElementById('bankName').value = data.bankName || '';
    document.getElementById('accountName').value = data.accountName || '';
    document.getElementById('accountNumber').value = data.accountNumber || '';
    document.getElementById('ifscCode').value = data.ifscCode || '';
    document.getElementById('upiId').value = data.upiId || '';
    document.getElementById('paymentNotes').value = data.paymentNotes || data.paymentInfo || '';
    
    // Signature & Stamp
    if (data.signatureUrl) {
        document.getElementById('signatureUrl').value = data.signatureUrl || '';
        previewSignature();
    }
    document.getElementById('signatureName').value = data.signatureName || '';
    document.getElementById('signatureTitle').value = data.signatureTitle || '';
    if (data.stampUrl) {
        document.getElementById('stampUrl').value = data.stampUrl || '';
        previewStamp();
    }
}

// Load from localStorage (demo mode)
function loadFromLocalStorage() {
    const businessDetails = JSON.parse(localStorage.getItem('businessDetails') || '{}');
    const taxSettings = JSON.parse(localStorage.getItem('taxSettings') || '{}');
    const paymentSettings = JSON.parse(localStorage.getItem('paymentSettings') || '{}');
    const invoiceSettings = JSON.parse(localStorage.getItem('invoiceSettings') || '{}');
    
    const combined = {
        ...businessDetails,
        ...taxSettings,
        ...paymentSettings,
        ...invoiceSettings
    };
    
    populateForm(combined);
}

// Save profile
function saveProfile() {
    const profileData = {
        // Company Info
        businessName: document.getElementById('companyName').value.trim(),
        companyName: document.getElementById('companyName').value.trim(),
        businessAddress: document.getElementById('companyAddress').value.trim(),
        companyAddress: document.getElementById('companyAddress').value.trim(),
        businessEmail: document.getElementById('companyEmail').value.trim(),
        companyEmail: document.getElementById('companyEmail').value.trim(),
        businessPhone: document.getElementById('companyPhone').value.trim(),
        companyPhone: document.getElementById('companyPhone').value.trim(),
        website: document.getElementById('companyWebsite').value.trim(),
        
        // Logo & Branding
        businessLogo: document.getElementById('logoUrl').value.trim(),
        logoUrl: document.getElementById('logoUrl').value.trim(),
        brandColor: document.getElementById('brandColor').value,
        accentColor: document.getElementById('brandColor').value,
        
        // Tax Info
        gstNumber: document.getElementById('gstNumber').value.trim(),
        panNumber: document.getElementById('panNumber').value.trim(),
        defaultTaxRate: document.getElementById('defaultTaxRate').value,
        taxRate: document.getElementById('defaultTaxRate').value,
        defaultTaxName: document.getElementById('defaultTaxName').value.trim(),
        taxName: document.getElementById('defaultTaxName').value.trim(),
        
        // Payment Info
        bankName: document.getElementById('bankName').value.trim(),
        accountName: document.getElementById('accountName').value.trim(),
        accountNumber: document.getElementById('accountNumber').value.trim(),
        ifscCode: document.getElementById('ifscCode').value.trim(),
        upiId: document.getElementById('upiId').value.trim(),
        paymentNotes: document.getElementById('paymentNotes').value.trim(),
        paymentInfo: buildPaymentInfo(),
        
        // Signature & Stamp
        signatureUrl: document.getElementById('signatureUrl').value.trim(),
        signatureName: document.getElementById('signatureName').value.trim(),
        signatureTitle: document.getElementById('signatureTitle').value.trim(),
        stampUrl: document.getElementById('stampUrl').value.trim()
    };
    
    const user = window.getCurrentUser ? getCurrentUser() : null;
    
    if (user && !user.isDemo) {
        // Save to user account
        const saved = saveUserData('businessDetails', profileData);
        if (saved) {
            showToast('Profile saved successfully!', 'success');
        } else {
            showToast('Failed to save profile', 'error');
        }
    } else {
        // Demo mode - save to localStorage
        saveToLocalStorage(profileData);
        showToast('Profile saved locally (Demo Mode)', 'success');
    }
}

// Build payment info string
function buildPaymentInfo() {
    const parts = [];
    const bankName = document.getElementById('bankName').value.trim();
    const accountName = document.getElementById('accountName').value.trim();
    const accountNumber = document.getElementById('accountNumber').value.trim();
    const ifscCode = document.getElementById('ifscCode').value.trim();
    const upiId = document.getElementById('upiId').value.trim();
    const notes = document.getElementById('paymentNotes').value.trim();
    
    if (bankName) parts.push(`Bank: ${bankName}`);
    if (accountName) parts.push(`Account Name: ${accountName}`);
    if (accountNumber) parts.push(`Account Number: ${accountNumber}`);
    if (ifscCode) parts.push(`IFSC: ${ifscCode}`);
    if (upiId) parts.push(`UPI: ${upiId}`);
    if (notes) parts.push(`\n${notes}`);
    
    return parts.join('\n');
}

// Save to localStorage (demo mode)
function saveToLocalStorage(data) {
    // Business Details
    localStorage.setItem('businessDetails', JSON.stringify({
        businessName: data.businessName,
        businessAddress: data.businessAddress,
        businessEmail: data.businessEmail,
        businessPhone: data.businessPhone,
        businessLogo: data.businessLogo
    }));
    
    // Tax Settings
    localStorage.setItem('taxSettings', JSON.stringify({
        gstNumber: data.gstNumber,
        panNumber: data.panNumber,
        taxRate: data.taxRate,
        taxName: data.taxName
    }));
    
    // Payment Settings
    localStorage.setItem('paymentSettings', JSON.stringify({
        bankName: data.bankName,
        accountName: data.accountName,
        accountNumber: data.accountNumber,
        ifscCode: data.ifscCode,
        upiId: data.upiId,
        paymentInfo: data.paymentInfo
    }));
    
    // Invoice Settings
    localStorage.setItem('invoiceSettings', JSON.stringify({
        accentColor: data.accentColor,
        signatureUrl: data.signatureUrl,
        signatureName: data.signatureName,
        signatureTitle: data.signatureTitle,
        stampUrl: data.stampUrl
    }));
}

// Get current user
function getCurrentUser() {
    const localSession = localStorage.getItem('invoicepro_session');
    const sessionSession = sessionStorage.getItem('invoicepro_session');
    
    if (localSession) return JSON.parse(localSession);
    if (sessionSession) return JSON.parse(sessionSession);
    return null;
}

// Get full user data for save
function getUserDataForSave() {
    const user = getCurrentUser();
    if (!user || user.isDemo) return null;
    
    const users = JSON.parse(localStorage.getItem('invoicepro_users') || '[]');
    return users.find(u => u.id === user.id);
}

// Save user data
function saveUserData(key, data) {
    const user = getCurrentUser();
    if (!user || user.isDemo) return false;
    
    const users = JSON.parse(localStorage.getItem('invoicepro_users') || '[]');
    const index = users.findIndex(u => u.id === user.id);
    
    if (index !== -1) {
        users[index][key] = data;
        localStorage.setItem('invoicepro_users', JSON.stringify(users));
        return true;
    }
    return false;
}

// Check welcome state
function checkWelcomeState() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('welcome') === 'true') {
        document.getElementById('welcomeBanner').style.display = 'flex';
    }
}

// Close welcome banner
function closeWelcome() {
    document.getElementById('welcomeBanner').style.display = 'none';
    // Remove from URL
    const url = new URL(window.location);
    url.searchParams.delete('welcome');
    window.history.replaceState({}, '', url);
}

// Preview logo
function previewLogo() {
    const url = document.getElementById('logoUrl').value.trim();
    const preview = document.getElementById('logoPreview');
    
    if (url) {
        preview.innerHTML = `<img src="${url}" alt="Company Logo" onerror="this.parentElement.innerHTML='<span>Failed to load image</span>'">`;
    } else {
        preview.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span>No logo uploaded</span>
        `;
    }
}

// Preview signature
function previewSignature() {
    const url = document.getElementById('signatureUrl').value.trim();
    const preview = document.getElementById('signaturePreview');
    
    if (url) {
        preview.innerHTML = `<img src="${url}" alt="Signature" onerror="this.innerHTML='<span>Failed to load</span>'">`;
    } else {
        preview.innerHTML = '<span>No signature added</span>';
    }
}

// Preview stamp
function previewStamp() {
    const url = document.getElementById('stampUrl').value.trim();
    const preview = document.getElementById('stampPreview');
    
    if (url) {
        preview.innerHTML = `<img src="${url}" alt="Stamp" onerror="this.innerHTML='<span>Failed to load</span>'">`;
    } else {
        preview.innerHTML = '<span>No stamp added</span>';
    }
}

// Setup color picker
function setupColorPicker() {
    const colorInput = document.getElementById('brandColor');
    const hexInput = document.getElementById('brandColorHex');
    
    colorInput.addEventListener('input', () => {
        hexInput.value = colorInput.value;
    });
}

// Sync color from hex input
function syncColor() {
    const colorInput = document.getElementById('brandColor');
    const hexInput = document.getElementById('brandColorHex');
    
    if (/^#[0-9A-Fa-f]{6}$/.test(hexInput.value)) {
        colorInput.value = hexInput.value;
    }
}

// Mobile menu
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    });
    
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
    });
}

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.querySelector('.toast-message').textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
