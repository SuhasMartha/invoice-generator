// Settings Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initSettingsPage();
});

let taxRates = [];

function initSettingsPage() {
    setupTabs();
    loadSettings();
    setupFileUploads();
    setupMobileMenu();
}

function setupTabs() {
    const tabs = document.querySelectorAll('.settings-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
            
            // Activate clicked tab
            tab.classList.add('active');
            const panelId = tab.dataset.tab + '-panel';
            document.getElementById(panelId).classList.add('active');
        });
    });
}

function loadSettings() {
    // Load business settings
    const business = JSON.parse(localStorage.getItem('businessSettings')) || {};
    document.getElementById('businessName').value = business.name || '';
    document.getElementById('businessEmail').value = business.email || '';
    document.getElementById('businessPhone').value = business.phone || '';
    document.getElementById('businessWebsite').value = business.website || '';
    document.getElementById('businessAddress').value = business.address || '';
    document.getElementById('businessGst').value = business.gst || '';
    document.getElementById('businessPan').value = business.pan || '';
    
    if (business.logo) {
        showLogo(business.logo);
    }
    
    // Load invoice settings
    const invoice = JSON.parse(localStorage.getItem('invoiceSettings')) || {};
    document.getElementById('invoicePrefix').value = invoice.prefix || 'INV-';
    document.getElementById('nextInvoiceNumber').value = invoice.nextNumber || 1;
    document.getElementById('defaultCurrency').value = invoice.currency || 'INR';
    document.getElementById('paymentTerms').value = invoice.paymentTerms || 15;
    document.getElementById('defaultNotes').value = invoice.notes || '';
    document.getElementById('defaultTemplate').value = invoice.template || 'modern';
    
    // Load tax settings
    taxRates = JSON.parse(localStorage.getItem('taxSettings')) || [
        { name: 'GST', rate: 18 },
        { name: 'CGST', rate: 9 },
        { name: 'SGST', rate: 9 }
    ];
    renderTaxRates();
    
    // Load payment settings
    const payment = JSON.parse(localStorage.getItem('paymentSettings')) || {};
    document.getElementById('bankName').value = payment.bankName || '';
    document.getElementById('accountName').value = payment.accountName || '';
    document.getElementById('accountNumber').value = payment.accountNumber || '';
    document.getElementById('ifscCode').value = payment.ifscCode || '';
    document.getElementById('bankBranch').value = payment.bankBranch || '';
    document.getElementById('upiId').value = payment.upiId || '';
    document.getElementById('paymentInstructions').value = payment.instructions || '';
}

function setupFileUploads() {
    // Logo upload
    document.getElementById('logoInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                showLogo(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
    
    // UPI QR upload
    document.getElementById('upiQrInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Store QR code
                const payment = JSON.parse(localStorage.getItem('paymentSettings')) || {};
                payment.upiQr = e.target.result;
                localStorage.setItem('paymentSettings', JSON.stringify(payment));
                showToast('QR code uploaded successfully');
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Import data
    document.getElementById('importInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    importData(data);
                } catch (error) {
                    showToast('Invalid file format', 'error');
                }
            };
            reader.readAsText(file);
        }
    });
}

function showLogo(dataUrl) {
    const preview = document.getElementById('logoPreview');
    preview.innerHTML = `<img src="${dataUrl}" alt="Logo">`;
}

function removeLogo() {
    const preview = document.getElementById('logoPreview');
    preview.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
    `;
    
    const business = JSON.parse(localStorage.getItem('businessSettings')) || {};
    delete business.logo;
    localStorage.setItem('businessSettings', JSON.stringify(business));
    showToast('Logo removed');
}

// Save functions
function saveBusinessSettings() {
    const logoPreview = document.getElementById('logoPreview');
    const logoImg = logoPreview.querySelector('img');
    
    const business = {
        name: document.getElementById('businessName').value.trim(),
        email: document.getElementById('businessEmail').value.trim(),
        phone: document.getElementById('businessPhone').value.trim(),
        website: document.getElementById('businessWebsite').value.trim(),
        address: document.getElementById('businessAddress').value.trim(),
        gst: document.getElementById('businessGst').value.trim(),
        pan: document.getElementById('businessPan').value.trim(),
        logo: logoImg ? logoImg.src : null
    };
    
    localStorage.setItem('businessSettings', JSON.stringify(business));
    showToast('Business settings saved');
}

function saveInvoiceSettings() {
    const invoice = {
        prefix: document.getElementById('invoicePrefix').value.trim() || 'INV-',
        nextNumber: parseInt(document.getElementById('nextInvoiceNumber').value) || 1,
        currency: document.getElementById('defaultCurrency').value,
        paymentTerms: parseInt(document.getElementById('paymentTerms').value) || 15,
        notes: document.getElementById('defaultNotes').value.trim(),
        template: document.getElementById('defaultTemplate').value
    };
    
    localStorage.setItem('invoiceSettings', JSON.stringify(invoice));
    showToast('Invoice settings saved');
}

// Tax rates
function renderTaxRates() {
    const container = document.getElementById('taxRatesList');
    
    if (taxRates.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.875rem;">No tax rates configured</p>';
        return;
    }
    
    container.innerHTML = taxRates.map((tax, index) => `
        <div class="tax-rate-item">
            <input type="text" value="${tax.name}" placeholder="Tax name" 
                   onchange="updateTaxRate(${index}, 'name', this.value)">
            <input type="number" class="rate-input" value="${tax.rate}" placeholder="Rate %" 
                   min="0" max="100" step="0.01"
                   onchange="updateTaxRate(${index}, 'rate', parseFloat(this.value))">
            <span>%</span>
            <button class="remove-tax-btn" onclick="removeTaxRate(${index})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `).join('');
}

function addTaxRate() {
    taxRates.push({ name: '', rate: 0 });
    renderTaxRates();
}

function updateTaxRate(index, field, value) {
    taxRates[index][field] = value;
}

function removeTaxRate(index) {
    taxRates.splice(index, 1);
    renderTaxRates();
}

function saveTaxSettings() {
    // Filter out empty entries
    taxRates = taxRates.filter(tax => tax.name.trim() !== '');
    localStorage.setItem('taxSettings', JSON.stringify(taxRates));
    renderTaxRates();
    showToast('Tax settings saved');
}

// Payment settings
function savePaymentSettings() {
    const existing = JSON.parse(localStorage.getItem('paymentSettings')) || {};
    
    const payment = {
        ...existing,
        bankName: document.getElementById('bankName').value.trim(),
        accountName: document.getElementById('accountName').value.trim(),
        accountNumber: document.getElementById('accountNumber').value.trim(),
        ifscCode: document.getElementById('ifscCode').value.trim(),
        bankBranch: document.getElementById('bankBranch').value.trim(),
        upiId: document.getElementById('upiId').value.trim(),
        instructions: document.getElementById('paymentInstructions').value.trim()
    };
    
    localStorage.setItem('paymentSettings', JSON.stringify(payment));
    showToast('Payment settings saved');
}

// Data management
function exportAllData() {
    const data = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        invoices: JSON.parse(localStorage.getItem('invoices')) || [],
        clients: JSON.parse(localStorage.getItem('clients')) || [],
        businessSettings: JSON.parse(localStorage.getItem('businessSettings')) || {},
        invoiceSettings: JSON.parse(localStorage.getItem('invoiceSettings')) || {},
        taxSettings: JSON.parse(localStorage.getItem('taxSettings')) || [],
        paymentSettings: JSON.parse(localStorage.getItem('paymentSettings')) || {}
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoicepro-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('Data exported successfully');
}

function importData(data) {
    if (!data.version) {
        showToast('Invalid backup file', 'error');
        return;
    }
    
    if (data.invoices) localStorage.setItem('invoices', JSON.stringify(data.invoices));
    if (data.clients) localStorage.setItem('clients', JSON.stringify(data.clients));
    if (data.businessSettings) localStorage.setItem('businessSettings', JSON.stringify(data.businessSettings));
    if (data.invoiceSettings) localStorage.setItem('invoiceSettings', JSON.stringify(data.invoiceSettings));
    if (data.taxSettings) localStorage.setItem('taxSettings', JSON.stringify(data.taxSettings));
    if (data.paymentSettings) localStorage.setItem('paymentSettings', JSON.stringify(data.paymentSettings));
    
    loadSettings();
    showToast('Data imported successfully');
}

function confirmClearData() {
    document.getElementById('clearDataModal').classList.add('show');
    document.getElementById('deleteConfirmation').value = '';
}

function closeClearModal() {
    document.getElementById('clearDataModal').classList.remove('show');
}

function clearAllData() {
    const confirmation = document.getElementById('deleteConfirmation').value;
    
    if (confirmation !== 'DELETE') {
        showToast('Please type DELETE to confirm', 'error');
        return;
    }
    
    localStorage.removeItem('invoices');
    localStorage.removeItem('clients');
    localStorage.removeItem('businessSettings');
    localStorage.removeItem('invoiceSettings');
    localStorage.removeItem('taxSettings');
    localStorage.removeItem('paymentSettings');
    
    closeClearModal();
    loadSettings();
    showToast('All data has been cleared');
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
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.querySelector('.toast-message').textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
