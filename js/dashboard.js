// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

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

function initDashboard() {
    loadDashboardStats();
    loadRecentInvoices();
    loadTopClients();
    setupMobileMenu();
    setupSearch();
}

function loadDashboardStats() {
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    
    // Count stats
    const totalInvoices = invoices.length;
    let paidCount = 0;
    let pendingCount = 0;
    let overdueCount = 0;
    let totalRevenue = 0;
    let pendingAmount = 0;
    let overdueAmount = 0;
    
    const today = new Date();
    
    invoices.forEach(invoice => {
        const status = invoice.invoiceStatus || invoice.status || 'pending';
        const total = parseFloat(invoice.total) || 0;
        const dueDate = invoice.dueDate ? new Date(invoice.dueDate) : null;
        
        // Check if overdue (due date passed and not paid)
        const isOverdue = dueDate && dueDate < today && status !== 'paid';
        
        if (status === 'paid') {
            paidCount++;
            totalRevenue += total;
        } else if (isOverdue || status === 'overdue') {
            overdueCount++;
            overdueAmount += total;
        } else if (status === 'pending' || status === 'sent') {
            pendingCount++;
            pendingAmount += total;
        } else if (status === 'draft') {
            // Draft invoices don't count
        } else {
            pendingCount++;
            pendingAmount += total;
        }
    });
    
    // Update UI
    document.getElementById('totalInvoices').textContent = totalInvoices;
    document.getElementById('paidInvoices').textContent = paidCount;
    document.getElementById('pendingInvoices').textContent = pendingCount;
    document.getElementById('overdueInvoices').textContent = overdueCount;
    
    document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue + pendingAmount + overdueAmount);
    document.getElementById('pendingAmount').textContent = formatCurrency(pendingAmount);
    document.getElementById('overdueAmount').textContent = formatCurrency(overdueAmount);
}

function loadRecentInvoices() {
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    const container = document.getElementById('recentInvoicesList');
    const emptyState = document.getElementById('emptyState');
    
    if (invoices.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }
    
    container.style.display = 'flex';
    emptyState.style.display = 'none';
    
    // Sort by date (most recent first) and take top 5
    const recentInvoices = [...invoices]
        .sort((a, b) => {
            const dateA = new Date(a.invoiceDate || a.createdAt || 0);
            const dateB = new Date(b.invoiceDate || b.createdAt || 0);
            return dateB - dateA;
        })
        .slice(0, 5);
    
    container.innerHTML = recentInvoices.map(invoice => {
        const status = invoice.invoiceStatus || invoice.status || 'pending';
        const clientName = invoice.clientName || 'Unknown Client';
        const invoiceNumber = invoice.invoiceNumber || 'INV-000';
        const total = formatCurrency(parseFloat(invoice.total) || 0, invoice.currency || 'INR');
        
        return `
            <div class="invoice-item" onclick="viewInvoice('${invoice.id || invoiceNumber}')">
                <div class="invoice-info">
                    <div class="invoice-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                    </div>
                    <div class="invoice-details">
                        <span class="invoice-number">${invoiceNumber}</span>
                        <span class="invoice-client">${clientName}</span>
                    </div>
                </div>
                <div class="invoice-meta">
                    <span class="invoice-amount">${total}</span>
                    <span class="invoice-status ${status.toLowerCase()}">${status}</span>
                </div>
            </div>
        `;
    }).join('');
}

function loadTopClients() {
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    const container = document.getElementById('topClientsList');
    const emptyState = document.getElementById('emptyClients');
    
    if (invoices.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }
    
    container.style.display = 'flex';
    emptyState.style.display = 'none';
    
    // Aggregate by client
    const clientTotals = {};
    invoices.forEach(invoice => {
        const clientName = invoice.clientName || 'Unknown Client';
        const total = parseFloat(invoice.total) || 0;
        
        if (!clientTotals[clientName]) {
            clientTotals[clientName] = 0;
        }
        clientTotals[clientName] += total;
    });
    
    // Sort by total and take top 5
    const topClients = Object.entries(clientTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    container.innerHTML = topClients.map(([name, total]) => {
        const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        
        return `
            <div class="client-item">
                <div class="client-info">
                    <div class="client-avatar">${initials}</div>
                    <span class="client-name">${name}</span>
                </div>
                <span class="client-total">${formatCurrency(total)}</span>
            </div>
        `;
    }).join('');
}

function viewInvoice(invoiceId) {
    // Navigate to invoice creator with this invoice loaded
    window.location.href = `index.html?load=${encodeURIComponent(invoiceId)}`;
}

function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    // Create overlay
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

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `invoices.html?search=${encodeURIComponent(query)}`;
            }
        }
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
