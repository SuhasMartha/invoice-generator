// Invoices List Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initInvoicesPage();
});

let allInvoices = [];
let filteredInvoices = [];
let selectedInvoices = new Set();
let currentPage = 1;
const itemsPerPage = 10;

// Currency formatter
function formatCurrency(amount, currency = 'INR') {
    const currencyLocales = {
        'INR': 'en-IN',
        'USD': 'en-US',
        'EUR': 'de-DE',
        'GBP': 'en-GB',
        'JPY': 'ja-JP',
        'CNY': 'zh-CN',
        'AUD': 'en-AU',
        'CAD': 'en-CA',
        'CHF': 'de-CH',
        'SGD': 'en-SG'
    };
    
    const locale = currencyLocales[currency] || 'en-IN';
    
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function initInvoicesPage() {
    loadInvoices();
    setupFilters();
    setupMobileMenu();
    checkUrlParams();
}

function loadInvoices() {
    allInvoices = JSON.parse(localStorage.getItem('invoices')) || [];
    
    // Add sample invoices if empty (for demo)
    if (allInvoices.length === 0) {
        addSampleInvoices();
    }
    
    applyFilters();
}

function addSampleInvoices() {
    const sampleInvoices = [
        {
            id: 'INV-2026-001',
            invoiceNumber: 'INV-2026-001',
            clientName: 'TechCorp Solutions',
            clientEmail: 'billing@techcorp.com',
            invoiceDate: '2026-01-02',
            dueDate: '2026-01-17',
            total: 125000,
            currency: 'INR',
            invoiceStatus: 'pending',
            items: [{ description: 'Web Development Services', quantity: 1, price: 125000 }]
        },
        {
            id: 'INV-2025-042',
            invoiceNumber: 'INV-2025-042',
            clientName: 'Global Enterprises',
            clientEmail: 'accounts@globalent.in',
            invoiceDate: '2025-12-15',
            dueDate: '2025-12-30',
            total: 85000,
            currency: 'INR',
            invoiceStatus: 'paid',
            items: [{ description: 'Mobile App Development', quantity: 1, price: 85000 }]
        },
        {
            id: 'INV-2025-041',
            invoiceNumber: 'INV-2025-041',
            clientName: 'StartUp Hub',
            clientEmail: 'finance@startuphub.io',
            invoiceDate: '2025-12-01',
            dueDate: '2025-12-16',
            total: 45000,
            currency: 'INR',
            invoiceStatus: 'overdue',
            items: [{ description: 'UI/UX Design', quantity: 1, price: 45000 }]
        },
        {
            id: 'INV-2025-040',
            invoiceNumber: 'INV-2025-040',
            clientName: 'Digital First Agency',
            clientEmail: 'billing@digitalfirst.com',
            invoiceDate: '2025-11-20',
            dueDate: '2025-12-05',
            total: 65000,
            currency: 'INR',
            invoiceStatus: 'paid',
            items: [{ description: 'SEO Consulting', quantity: 1, price: 65000 }]
        },
        {
            id: 'INV-2025-039',
            invoiceNumber: 'INV-2025-039',
            clientName: 'CloudBase Inc',
            clientEmail: 'accounts@cloudbase.io',
            invoiceDate: '2025-11-10',
            dueDate: '2025-11-25',
            total: 150000,
            currency: 'INR',
            invoiceStatus: 'paid',
            items: [{ description: 'Cloud Infrastructure Setup', quantity: 1, price: 150000 }]
        }
    ];
    
    localStorage.setItem('invoices', JSON.stringify(sampleInvoices));
    allInvoices = sampleInvoices;
}

function setupFilters() {
    const searchInput = document.getElementById('searchInvoices');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    searchInput.addEventListener('input', debounce(applyFilters, 300));
    statusFilter.addEventListener('change', applyFilters);
    dateFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);
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

function applyFilters() {
    const searchQuery = document.getElementById('searchInvoices').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const sortFilter = document.getElementById('sortFilter').value;
    
    // Filter
    filteredInvoices = allInvoices.filter(invoice => {
        // Search filter
        const matchesSearch = !searchQuery || 
            (invoice.invoiceNumber || '').toLowerCase().includes(searchQuery) ||
            (invoice.clientName || '').toLowerCase().includes(searchQuery) ||
            (invoice.clientEmail || '').toLowerCase().includes(searchQuery);
        
        // Status filter
        const status = invoice.invoiceStatus || invoice.status || 'pending';
        const matchesStatus = statusFilter === 'all' || status === statusFilter;
        
        // Date filter
        const invoiceDate = new Date(invoice.invoiceDate || invoice.createdAt);
        const matchesDate = filterByDate(invoiceDate, dateFilter);
        
        return matchesSearch && matchesStatus && matchesDate;
    });
    
    // Sort
    filteredInvoices.sort((a, b) => {
        switch (sortFilter) {
            case 'newest':
                return new Date(b.invoiceDate || b.createdAt) - new Date(a.invoiceDate || a.createdAt);
            case 'oldest':
                return new Date(a.invoiceDate || a.createdAt) - new Date(b.invoiceDate || b.createdAt);
            case 'highest':
                return (parseFloat(b.total) || 0) - (parseFloat(a.total) || 0);
            case 'lowest':
                return (parseFloat(a.total) || 0) - (parseFloat(b.total) || 0);
            default:
                return 0;
        }
    });
    
    currentPage = 1;
    renderInvoices();
}

function filterByDate(date, filter) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (filter) {
        case 'today':
            return date >= today;
        case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return date >= weekAgo;
        case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return date >= monthAgo;
        case 'quarter':
            const quarterAgo = new Date(today);
            quarterAgo.setMonth(quarterAgo.getMonth() - 3);
            return date >= quarterAgo;
        case 'year':
            const yearAgo = new Date(today);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            return date >= yearAgo;
        default:
            return true;
    }
}

function renderInvoices() {
    const tbody = document.getElementById('invoicesTableBody');
    const emptyState = document.getElementById('emptyState');
    const pagination = document.getElementById('pagination');
    
    if (filteredInvoices.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'flex';
        pagination.style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    pagination.style.display = 'flex';
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageInvoices = filteredInvoices.slice(startIndex, endIndex);
    
    // Render table rows
    tbody.innerHTML = pageInvoices.map(invoice => {
        const status = invoice.invoiceStatus || invoice.status || 'pending';
        const clientName = invoice.clientName || 'Unknown Client';
        const initials = clientName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const invoiceNumber = invoice.invoiceNumber || invoice.id || 'INV-000';
        const total = formatCurrency(parseFloat(invoice.total) || 0, invoice.currency || 'INR');
        const isSelected = selectedInvoices.has(invoice.id || invoiceNumber);
        
        return `
            <tr class="${isSelected ? 'selected' : ''}">
                <td class="checkbox-col">
                    <input type="checkbox" 
                           ${isSelected ? 'checked' : ''} 
                           onchange="toggleSelect('${invoice.id || invoiceNumber}')">
                </td>
                <td>
                    <span class="invoice-id" onclick="viewInvoice('${invoice.id || invoiceNumber}')">${invoiceNumber}</span>
                </td>
                <td>
                    <div class="client-cell">
                        <div class="client-avatar-sm">${initials}</div>
                        <span class="client-cell-name">${clientName}</span>
                    </div>
                </td>
                <td class="date-cell">${formatDate(invoice.invoiceDate)}</td>
                <td class="date-cell">${formatDate(invoice.dueDate)}</td>
                <td class="amount-cell">${total}</td>
                <td><span class="status-badge ${status.toLowerCase()}">${status}</span></td>
                <td>
                    <div class="actions-cell">
                        <button class="action-btn" onclick="viewInvoice('${invoice.id || invoiceNumber}')" title="View">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </button>
                        <button class="action-btn" onclick="editInvoice('${invoice.id || invoiceNumber}')" title="Edit">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="action-btn" onclick="downloadInvoice('${invoice.id || invoiceNumber}')" title="Download">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                        </button>
                        <button class="action-btn delete" onclick="confirmDelete('${invoice.id || invoiceNumber}')" title="Delete">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    // Update pagination
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

function changePage(delta) {
    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
    currentPage = Math.max(1, Math.min(totalPages, currentPage + delta));
    renderInvoices();
}

// Selection functions
function toggleSelect(invoiceId) {
    if (selectedInvoices.has(invoiceId)) {
        selectedInvoices.delete(invoiceId);
    } else {
        selectedInvoices.add(invoiceId);
    }
    updateBulkActions();
    renderInvoices();
}

function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    
    if (selectAll.checked) {
        filteredInvoices.forEach(inv => {
            selectedInvoices.add(inv.id || inv.invoiceNumber);
        });
    } else {
        selectedInvoices.clear();
    }
    
    updateBulkActions();
    renderInvoices();
}

function clearSelection() {
    selectedInvoices.clear();
    document.getElementById('selectAll').checked = false;
    updateBulkActions();
    renderInvoices();
}

function updateBulkActions() {
    const bulkActions = document.getElementById('bulkActions');
    const selectedCount = document.getElementById('selectedCount');
    
    if (selectedInvoices.size > 0) {
        bulkActions.style.display = 'flex';
        selectedCount.textContent = selectedInvoices.size;
    } else {
        bulkActions.style.display = 'none';
    }
}

// Invoice actions
function viewInvoice(invoiceId) {
    window.location.href = `index.html?load=${encodeURIComponent(invoiceId)}`;
}

function editInvoice(invoiceId) {
    window.location.href = `index.html?edit=${encodeURIComponent(invoiceId)}`;
}

function downloadInvoice(invoiceId) {
    // Navigate to invoice page and trigger download
    window.location.href = `index.html?load=${encodeURIComponent(invoiceId)}&download=true`;
}

// Delete functions
let deleteTarget = null;

function confirmDelete(invoiceId) {
    deleteTarget = invoiceId;
    document.getElementById('deleteModal').classList.add('show');
    
    document.getElementById('confirmDelete').onclick = () => {
        deleteInvoice(deleteTarget);
        closeDeleteModal();
    };
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('show');
    deleteTarget = null;
}

function deleteInvoice(invoiceId) {
    allInvoices = allInvoices.filter(inv => (inv.id || inv.invoiceNumber) !== invoiceId);
    localStorage.setItem('invoices', JSON.stringify(allInvoices));
    selectedInvoices.delete(invoiceId);
    applyFilters();
    showToast('Invoice deleted successfully');
}

// Bulk actions
function bulkMarkAsPaid() {
    selectedInvoices.forEach(id => {
        const invoice = allInvoices.find(inv => (inv.id || inv.invoiceNumber) === id);
        if (invoice) {
            invoice.invoiceStatus = 'paid';
            invoice.status = 'paid';
        }
    });
    localStorage.setItem('invoices', JSON.stringify(allInvoices));
    clearSelection();
    applyFilters();
    showToast('Invoices marked as paid');
}

async function bulkExport() {
    if (selectedInvoices.size === 0) {
        showToast('No invoices selected', 'error');
        return;
    }
    
    // Get selected invoices data
    const invoicesToExport = allInvoices.filter(inv => 
        selectedInvoices.has(inv.id || inv.invoiceNumber)
    );
    
    showToast('Generating PDFs...', 'info');
    
    // Export each invoice as PDF
    for (const invoice of invoicesToExport) {
        await exportInvoiceToPDF(invoice);
    }
    
    showToast(`Exported ${invoicesToExport.length} invoice(s) as PDF`, 'success');
    clearSelection();
}

// Generate PDF from invoice data
async function exportInvoiceToPDF(invoice) {
    const invoiceNumber = invoice.invoiceNumber || invoice.id || 'invoice';
    const clientName = invoice.clientName || 'Client';
    const companyName = invoice.companyName || 'Your Company';
    const items = invoice.items || [];
    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.quantity) || 1) * (parseFloat(item.price) || 0), 0);
    const taxRate = parseFloat(invoice.taxRate) || 0;
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;
    
    // Create invoice HTML for PDF
    const invoiceHTML = `
        <div style="font-family: 'Inter', Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; background: white;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px;">
                <div>
                    <h1 style="font-size: 24px; margin: 0; color: #1f2937;">${companyName}</h1>
                    <p style="color: #6b7280; margin: 5px 0;">${invoice.companyEmail || ''}</p>
                    <p style="color: #6b7280; margin: 5px 0;">${invoice.companyPhone || ''}</p>
                </div>
                <div style="text-align: right;">
                    <h2 style="font-size: 32px; color: #6366f1; margin: 0;">INVOICE</h2>
                    <p style="color: #6b7280; margin: 5px 0;">${invoiceNumber}</p>
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
                <div>
                    <h3 style="color: #6b7280; font-size: 12px; text-transform: uppercase; margin-bottom: 10px;">Bill To</h3>
                    <p style="font-weight: 600; margin: 5px 0;">${clientName}</p>
                    <p style="color: #6b7280; margin: 5px 0;">${invoice.clientEmail || ''}</p>
                    <p style="color: #6b7280; margin: 5px 0;">${invoice.clientAddress || ''}</p>
                </div>
                <div style="text-align: right;">
                    <p style="margin: 5px 0;"><strong>Invoice Date:</strong> ${formatDate(invoice.invoiceDate)}</p>
                    <p style="margin: 5px 0;"><strong>Due Date:</strong> ${formatDate(invoice.dueDate)}</p>
                    <p style="margin: 5px 0;"><strong>Status:</strong> <span style="background: ${getStatusColor(invoice.invoiceStatus)}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${invoice.invoiceStatus || 'Pending'}</span></p>
                </div>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                    <tr style="background: #f3f4f6;">
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Description</th>
                        <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
                        <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Price</th>
                        <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => `
                        <tr>
                            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.description || ''}</td>
                            <td style="padding: 12px; text-align: center; border-bottom: 1px solid #e5e7eb;">${item.quantity || 1}</td>
                            <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb;">${formatCurrency(item.price || 0, invoice.currency)}</td>
                            <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb;">${formatCurrency((item.quantity || 1) * (item.price || 0), invoice.currency)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div style="display: flex; justify-content: flex-end;">
                <div style="width: 250px;">
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                        <span style="color: #6b7280;">Subtotal</span>
                        <span>${formatCurrency(subtotal, invoice.currency)}</span>
                    </div>
                    ${taxRate > 0 ? `
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                        <span style="color: #6b7280;">Tax (${taxRate}%)</span>
                        <span>${formatCurrency(tax, invoice.currency)}</span>
                    </div>
                    ` : ''}
                    <div style="display: flex; justify-content: space-between; padding: 12px 0; font-size: 18px; font-weight: 700;">
                        <span>Total</span>
                        <span style="color: #6366f1;">${formatCurrency(total, invoice.currency)}</span>
                    </div>
                </div>
            </div>
            
            ${invoice.notes ? `
            <div style="margin-top: 40px; padding: 20px; background: #f9fafb; border-radius: 8px;">
                <h4 style="margin: 0 0 10px 0; color: #374151;">Notes</h4>
                <p style="margin: 0; color: #6b7280;">${invoice.notes}</p>
            </div>
            ` : ''}
        </div>
    `;
    
    // Create temporary container
    const container = document.createElement('div');
    container.innerHTML = invoiceHTML;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);
    
    const opt = {
        margin: 10,
        filename: `${invoiceNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            letterRendering: true
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait'
        }
    };
    
    try {
        await html2pdf().set(opt).from(container).save();
    } catch (error) {
        console.error('PDF generation failed:', error);
        showToast('Failed to generate PDF for ' + invoiceNumber, 'error');
    }
    
    document.body.removeChild(container);
}

function getStatusColor(status) {
    const colors = {
        'paid': '#10b981',
        'pending': '#f59e0b',
        'overdue': '#ef4444',
        'draft': '#6b7280',
        'sent': '#3b82f6',
        'cancelled': '#6b7280'
    };
    return colors[(status || '').toLowerCase()] || '#6b7280';
}

function bulkDelete() {
    if (confirm(`Delete ${selectedInvoices.size} invoices? This cannot be undone.`)) {
        selectedInvoices.forEach(id => {
            allInvoices = allInvoices.filter(inv => (inv.id || inv.invoiceNumber) !== id);
        });
        localStorage.setItem('invoices', JSON.stringify(allInvoices));
        clearSelection();
        applyFilters();
        showToast('Invoices deleted successfully');
    }
}

// URL params handling
function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    
    const status = params.get('status');
    if (status) {
        document.getElementById('statusFilter').value = status;
        applyFilters();
    }
    
    const search = params.get('search');
    if (search) {
        document.getElementById('searchInvoices').value = search;
        applyFilters();
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
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.querySelector('.toast-message').textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Download single invoice as PDF
async function downloadInvoice(invoiceId) {
    const invoice = allInvoices.find(inv => (inv.id || inv.invoiceNumber) === invoiceId);
    if (!invoice) {
        showToast('Invoice not found', 'error');
        return;
    }
    
    showToast('Generating PDF...', 'info');
    await exportInvoiceToPDF(invoice);
    showToast('PDF downloaded successfully!', 'success');
}

// Privacy and Terms modals
function showPrivacyPolicy() {
    document.getElementById('privacyModal').classList.add('show');
}

function closePrivacyModal() {
    document.getElementById('privacyModal').classList.remove('show');
}

function showTermsConditions() {
    document.getElementById('termsModal').classList.add('show');
}

function closeTermsModal() {
    document.getElementById('termsModal').classList.remove('show');
}

function closePdfModal() {
    document.getElementById('pdfExportModal').classList.remove('show');
}
