// Clients Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initClientsPage();
});

let allClients = [];
let editingClientId = null;
let viewingClientId = null;
let deleteClientId = null;

// Currency formatter
function formatCurrency(amount, currency = 'INR') {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function initClientsPage() {
    loadClients();
    setupSearch();
    setupMobileMenu();
}

function loadClients() {
    allClients = JSON.parse(localStorage.getItem('clients')) || [];
    
    // Extract clients from invoices if no clients saved
    if (allClients.length === 0) {
        extractClientsFromInvoices();
    }
    
    renderClients();
}

function extractClientsFromInvoices() {
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    const clientMap = new Map();
    
    invoices.forEach(invoice => {
        const clientName = invoice.clientName;
        if (clientName && !clientMap.has(clientName)) {
            clientMap.set(clientName, {
                id: 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                name: clientName,
                email: invoice.clientEmail || '',
                phone: invoice.clientPhone || '',
                company: invoice.clientCompany || '',
                address: invoice.clientAddress || '',
                gst: invoice.clientGst || '',
                pan: invoice.clientPan || '',
                notes: '',
                createdAt: new Date().toISOString()
            });
        }
    });
    
    allClients = Array.from(clientMap.values());
    
    // Add sample clients if still empty
    if (allClients.length === 0) {
        addSampleClients();
    }
    
    localStorage.setItem('clients', JSON.stringify(allClients));
}

function addSampleClients() {
    allClients = [
        {
            id: 'client_001',
            name: 'TechCorp Solutions',
            email: 'billing@techcorp.com',
            phone: '+91 98765 43210',
            company: 'TechCorp Solutions Pvt Ltd',
            address: '123 Tech Park, Whitefield, Bangalore 560066',
            gst: '29AABCT1234R1ZN',
            pan: 'AABCT1234R',
            notes: 'Premium client - Net 15 terms',
            createdAt: '2025-06-15T10:00:00Z'
        },
        {
            id: 'client_002',
            name: 'Global Enterprises',
            email: 'accounts@globalent.in',
            phone: '+91 87654 32109',
            company: 'Global Enterprises India',
            address: '456 Business Hub, Cyber City, Gurgaon 122001',
            gst: '06AABCG5678S1ZM',
            pan: 'AABCG5678S',
            notes: 'Large enterprise client',
            createdAt: '2025-07-20T14:30:00Z'
        },
        {
            id: 'client_003',
            name: 'StartUp Hub',
            email: 'finance@startuphub.io',
            phone: '+91 76543 21098',
            company: 'StartUp Hub Technologies',
            address: '789 Innovation Center, Koramangala, Bangalore 560034',
            gst: '',
            pan: 'AABCS9012T',
            notes: 'Fast-growing startup',
            createdAt: '2025-08-10T09:15:00Z'
        },
        {
            id: 'client_004',
            name: 'Digital First Agency',
            email: 'billing@digitalfirst.com',
            phone: '+91 65432 10987',
            company: 'Digital First Marketing',
            address: '321 Media Tower, Bandra Kurla Complex, Mumbai 400051',
            gst: '27AABCD3456U1ZL',
            pan: 'AABCD3456U',
            notes: 'Marketing agency partner',
            createdAt: '2025-09-05T11:45:00Z'
        }
    ];
    localStorage.setItem('clients', JSON.stringify(allClients));
}

function setupSearch() {
    const searchInput = document.getElementById('searchClients');
    searchInput.addEventListener('input', debounce(filterClients, 300));
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function filterClients() {
    const query = document.getElementById('searchClients').value.toLowerCase();
    
    const filtered = allClients.filter(client => {
        return (client.name || '').toLowerCase().includes(query) ||
               (client.email || '').toLowerCase().includes(query) ||
               (client.company || '').toLowerCase().includes(query);
    });
    
    renderClients(filtered);
}

function renderClients(clients = allClients) {
    const grid = document.getElementById('clientsGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (clients.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }
    
    grid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    // Get invoice stats for each client
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    
    grid.innerHTML = clients.map(client => {
        const initials = (client.name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const clientInvoices = invoices.filter(inv => inv.clientName === client.name);
        const totalInvoices = clientInvoices.length;
        const totalAmount = clientInvoices.reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0);
        
        return `
            <div class="client-card">
                <div class="client-card-header">
                    <div class="client-card-avatar">${initials}</div>
                    <div class="client-card-info">
                        <div class="client-card-name">${client.name}</div>
                        ${client.company ? `<div class="client-card-company">${client.company}</div>` : ''}
                    </div>
                </div>
                <div class="client-card-body">
                    ${client.email ? `
                    <div class="client-info-row">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        <span class="client-info-text"><a href="mailto:${client.email}">${client.email}</a></span>
                    </div>
                    ` : ''}
                    ${client.phone ? `
                    <div class="client-info-row">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        <span class="client-info-text">${client.phone}</span>
                    </div>
                    ` : ''}
                    ${client.address ? `
                    <div class="client-info-row">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span class="client-info-text">${truncateText(client.address, 50)}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="client-card-stats">
                    <div class="client-stat">
                        <div class="client-stat-value">${totalInvoices}</div>
                        <div class="client-stat-label">Invoices</div>
                    </div>
                    <div class="client-stat">
                        <div class="client-stat-value">${formatCurrency(totalAmount)}</div>
                        <div class="client-stat-label">Total</div>
                    </div>
                </div>
                <div class="client-card-actions">
                    <button class="client-action-btn" onclick="viewClient('${client.id}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        View
                    </button>
                    <button class="client-action-btn" onclick="editClient('${client.id}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit
                    </button>
                    <button class="client-action-btn delete" onclick="confirmDeleteClient('${client.id}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Modal functions
function openAddClientModal() {
    editingClientId = null;
    document.getElementById('modalTitle').textContent = 'Add New Client';
    clearForm();
    document.getElementById('clientModal').classList.add('show');
}

function editClient(clientId) {
    editingClientId = clientId;
    const client = allClients.find(c => c.id === clientId);
    if (!client) return;
    
    document.getElementById('modalTitle').textContent = 'Edit Client';
    document.getElementById('clientName').value = client.name || '';
    document.getElementById('clientEmail').value = client.email || '';
    document.getElementById('clientPhone').value = client.phone || '';
    document.getElementById('clientCompany').value = client.company || '';
    document.getElementById('clientAddress').value = client.address || '';
    document.getElementById('clientGst').value = client.gst || '';
    document.getElementById('clientPan').value = client.pan || '';
    document.getElementById('clientNotes').value = client.notes || '';
    
    document.getElementById('clientModal').classList.add('show');
}

function closeClientModal() {
    document.getElementById('clientModal').classList.remove('show');
    clearForm();
    editingClientId = null;
}

function clearForm() {
    document.getElementById('clientForm').reset();
}

function saveClient() {
    const name = document.getElementById('clientName').value.trim();
    const email = document.getElementById('clientEmail').value.trim();
    
    if (!name || !email) {
        showToast('Please fill in required fields', 'error');
        return;
    }
    
    const clientData = {
        name: name,
        email: email,
        phone: document.getElementById('clientPhone').value.trim(),
        company: document.getElementById('clientCompany').value.trim(),
        address: document.getElementById('clientAddress').value.trim(),
        gst: document.getElementById('clientGst').value.trim(),
        pan: document.getElementById('clientPan').value.trim(),
        notes: document.getElementById('clientNotes').value.trim()
    };
    
    if (editingClientId) {
        // Update existing
        const index = allClients.findIndex(c => c.id === editingClientId);
        if (index !== -1) {
            allClients[index] = { ...allClients[index], ...clientData };
        }
        showToast('Client updated successfully');
    } else {
        // Add new
        clientData.id = 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        clientData.createdAt = new Date().toISOString();
        allClients.push(clientData);
        showToast('Client added successfully');
    }
    
    localStorage.setItem('clients', JSON.stringify(allClients));
    closeClientModal();
    renderClients();
}

// View client
function viewClient(clientId) {
    viewingClientId = clientId;
    const client = allClients.find(c => c.id === clientId);
    if (!client) return;
    
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    const clientInvoices = invoices.filter(inv => inv.clientName === client.name);
    const totalAmount = clientInvoices.reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0);
    const paidAmount = clientInvoices
        .filter(inv => (inv.invoiceStatus || inv.status) === 'paid')
        .reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0);
    const pendingAmount = totalAmount - paidAmount;
    
    const initials = client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    
    document.getElementById('clientDetails').innerHTML = `
        <div class="client-details-header">
            <div class="client-details-avatar">${initials}</div>
            <div class="client-details-main">
                <h2>${client.name}</h2>
                <p>${client.company || 'Individual'}</p>
            </div>
        </div>
        
        <div class="client-details-section">
            <h4>Contact Information</h4>
            ${client.email ? `
            <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value"><a href="mailto:${client.email}">${client.email}</a></span>
            </div>
            ` : ''}
            ${client.phone ? `
            <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${client.phone}</span>
            </div>
            ` : ''}
            ${client.address ? `
            <div class="detail-row">
                <span class="detail-label">Address:</span>
                <span class="detail-value">${client.address}</span>
            </div>
            ` : ''}
        </div>
        
        ${client.gst || client.pan ? `
        <div class="client-details-section">
            <h4>Tax Information</h4>
            ${client.gst ? `
            <div class="detail-row">
                <span class="detail-label">GST Number:</span>
                <span class="detail-value">${client.gst}</span>
            </div>
            ` : ''}
            ${client.pan ? `
            <div class="detail-row">
                <span class="detail-label">PAN Number:</span>
                <span class="detail-value">${client.pan}</span>
            </div>
            ` : ''}
        </div>
        ` : ''}
        
        <div class="client-details-section">
            <h4>Invoice Summary</h4>
            <div class="invoices-summary">
                <div class="summary-item">
                    <div class="summary-value">${clientInvoices.length}</div>
                    <div class="summary-label">Total Invoices</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">${formatCurrency(totalAmount)}</div>
                    <div class="summary-label">Total Billed</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">${formatCurrency(pendingAmount)}</div>
                    <div class="summary-label">Outstanding</div>
                </div>
            </div>
        </div>
        
        ${client.notes ? `
        <div class="client-details-section">
            <h4>Notes</h4>
            <p style="color: var(--text-secondary); font-size: 0.875rem;">${client.notes}</p>
        </div>
        ` : ''}
    `;
    
    document.getElementById('viewClientModal').classList.add('show');
}

function closeViewModal() {
    document.getElementById('viewClientModal').classList.remove('show');
    viewingClientId = null;
}

function createInvoiceForClient() {
    const client = allClients.find(c => c.id === viewingClientId);
    if (client) {
        // Store client data for invoice page
        sessionStorage.setItem('selectedClient', JSON.stringify(client));
        window.location.href = 'index.html?client=' + encodeURIComponent(client.id);
    }
}

// Delete functions
function confirmDeleteClient(clientId) {
    deleteClientId = clientId;
    document.getElementById('deleteModal').classList.add('show');
    
    document.getElementById('confirmDelete').onclick = () => {
        deleteClient(deleteClientId);
        closeDeleteModal();
    };
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('show');
    deleteClientId = null;
}

function deleteClient(clientId) {
    allClients = allClients.filter(c => c.id !== clientId);
    localStorage.setItem('clients', JSON.stringify(allClients));
    renderClients();
    showToast('Client deleted successfully');
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
