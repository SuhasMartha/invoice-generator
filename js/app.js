/**
 * Invoice Generator - Main Application Logic
 * Handles form management, calculations, currency formatting, and data persistence
 */

// Currency configuration with symbols and formatting
const CURRENCIES = {
    USD: { symbol: '$', code: 'USD', locale: 'en-US', position: 'before' },
    EUR: { symbol: '€', code: 'EUR', locale: 'de-DE', position: 'before' },
    GBP: { symbol: '£', code: 'GBP', locale: 'en-GB', position: 'before' },
    JPY: { symbol: '¥', code: 'JPY', locale: 'ja-JP', position: 'before', decimals: 0 },
    CAD: { symbol: 'C$', code: 'CAD', locale: 'en-CA', position: 'before' },
    AUD: { symbol: 'A$', code: 'AUD', locale: 'en-AU', position: 'before' },
    INR: { symbol: '₹', code: 'INR', locale: 'en-IN', position: 'before' },
    CNY: { symbol: '¥', code: 'CNY', locale: 'zh-CN', position: 'before' },
    BRL: { symbol: 'R$', code: 'BRL', locale: 'pt-BR', position: 'before' },
    MXN: { symbol: '$', code: 'MXN', locale: 'es-MX', position: 'before' },
    CHF: { symbol: 'Fr', code: 'CHF', locale: 'de-CH', position: 'before' },
    KRW: { symbol: '₩', code: 'KRW', locale: 'ko-KR', position: 'before', decimals: 0 },
    SEK: { symbol: 'kr', code: 'SEK', locale: 'sv-SE', position: 'after' },
    NOK: { symbol: 'kr', code: 'NOK', locale: 'nb-NO', position: 'after' },
    DKK: { symbol: 'kr', code: 'DKK', locale: 'da-DK', position: 'after' },
    PLN: { symbol: 'zł', code: 'PLN', locale: 'pl-PL', position: 'after' },
    RUB: { symbol: '₽', code: 'RUB', locale: 'ru-RU', position: 'after' },
    ZAR: { symbol: 'R', code: 'ZAR', locale: 'en-ZA', position: 'before' },
    AED: { symbol: 'د.إ', code: 'AED', locale: 'ar-AE', position: 'after' },
    SAR: { symbol: '﷼', code: 'SAR', locale: 'ar-SA', position: 'after' }
};

// Language translations
const TRANSLATIONS = {
    en: {
        invoice: 'INVOICE',
        billTo: 'Bill To',
        from: 'From',
        to: 'To',
        invoiceNumber: 'Invoice Number',
        invoiceDate: 'Invoice Date',
        dueDate: 'Due Date',
        description: 'Description',
        quantity: 'Qty',
        price: 'Price',
        amount: 'Amount',
        subtotal: 'Subtotal',
        discount: 'Discount',
        tax: 'Tax',
        total: 'Total',
        totalDue: 'Total Due',
        notes: 'Notes',
        terms: 'Terms & Notes',
        paymentInfo: 'Payment Information',
        thankYou: 'Thank you for your business!',
        details: 'Details',
        date: 'Date',
        due: 'Due',
        unitPrice: 'Unit Price',
        itemDescription: 'Item Description'
    },
    es: {
        invoice: 'FACTURA',
        billTo: 'Facturar A',
        from: 'De',
        to: 'Para',
        invoiceNumber: 'Número de Factura',
        invoiceDate: 'Fecha de Factura',
        dueDate: 'Fecha de Vencimiento',
        description: 'Descripción',
        quantity: 'Cant.',
        price: 'Precio',
        amount: 'Importe',
        subtotal: 'Subtotal',
        discount: 'Descuento',
        tax: 'Impuesto',
        total: 'Total',
        totalDue: 'Total a Pagar',
        notes: 'Notas',
        terms: 'Términos y Notas',
        paymentInfo: 'Información de Pago',
        thankYou: '¡Gracias por su preferencia!',
        details: 'Detalles',
        date: 'Fecha',
        due: 'Vence',
        unitPrice: 'Precio Unit.',
        itemDescription: 'Descripción del Artículo'
    },
    fr: {
        invoice: 'FACTURE',
        billTo: 'Facturer À',
        from: 'De',
        to: 'À',
        invoiceNumber: 'Numéro de Facture',
        invoiceDate: 'Date de Facture',
        dueDate: 'Date d\'Échéance',
        description: 'Description',
        quantity: 'Qté',
        price: 'Prix',
        amount: 'Montant',
        subtotal: 'Sous-total',
        discount: 'Remise',
        tax: 'Taxe',
        total: 'Total',
        totalDue: 'Total à Payer',
        notes: 'Notes',
        terms: 'Conditions et Notes',
        paymentInfo: 'Informations de Paiement',
        thankYou: 'Merci pour votre confiance!',
        details: 'Détails',
        date: 'Date',
        due: 'Échéance',
        unitPrice: 'Prix Unitaire',
        itemDescription: 'Description de l\'Article'
    },
    de: {
        invoice: 'RECHNUNG',
        billTo: 'Rechnung An',
        from: 'Von',
        to: 'An',
        invoiceNumber: 'Rechnungsnummer',
        invoiceDate: 'Rechnungsdatum',
        dueDate: 'Fälligkeitsdatum',
        description: 'Beschreibung',
        quantity: 'Menge',
        price: 'Preis',
        amount: 'Betrag',
        subtotal: 'Zwischensumme',
        discount: 'Rabatt',
        tax: 'Steuer',
        total: 'Gesamt',
        totalDue: 'Gesamtbetrag',
        notes: 'Anmerkungen',
        terms: 'Bedingungen',
        paymentInfo: 'Zahlungsinformationen',
        thankYou: 'Vielen Dank für Ihren Auftrag!',
        details: 'Details',
        date: 'Datum',
        due: 'Fällig',
        unitPrice: 'Einzelpreis',
        itemDescription: 'Artikelbeschreibung'
    },
    pt: {
        invoice: 'FATURA',
        billTo: 'Cobrar De',
        from: 'De',
        to: 'Para',
        invoiceNumber: 'Número da Fatura',
        invoiceDate: 'Data da Fatura',
        dueDate: 'Data de Vencimento',
        description: 'Descrição',
        quantity: 'Qtd.',
        price: 'Preço',
        amount: 'Valor',
        subtotal: 'Subtotal',
        discount: 'Desconto',
        tax: 'Imposto',
        total: 'Total',
        totalDue: 'Total a Pagar',
        notes: 'Notas',
        terms: 'Termos e Notas',
        paymentInfo: 'Informações de Pagamento',
        thankYou: 'Obrigado pela preferência!',
        details: 'Detalhes',
        date: 'Data',
        due: 'Vencimento',
        unitPrice: 'Preço Unit.',
        itemDescription: 'Descrição do Item'
    },
    it: {
        invoice: 'FATTURA',
        billTo: 'Fatturare A',
        from: 'Da',
        to: 'A',
        invoiceNumber: 'Numero Fattura',
        invoiceDate: 'Data Fattura',
        dueDate: 'Data Scadenza',
        description: 'Descrizione',
        quantity: 'Qtà',
        price: 'Prezzo',
        amount: 'Importo',
        subtotal: 'Subtotale',
        discount: 'Sconto',
        tax: 'IVA',
        total: 'Totale',
        totalDue: 'Totale Dovuto',
        notes: 'Note',
        terms: 'Termini e Note',
        paymentInfo: 'Informazioni di Pagamento',
        thankYou: 'Grazie per la vostra fiducia!',
        details: 'Dettagli',
        date: 'Data',
        due: 'Scadenza',
        unitPrice: 'Prezzo Unit.',
        itemDescription: 'Descrizione Articolo'
    },
    nl: {
        invoice: 'FACTUUR',
        billTo: 'Factureren Aan',
        from: 'Van',
        to: 'Aan',
        invoiceNumber: 'Factuurnummer',
        invoiceDate: 'Factuurdatum',
        dueDate: 'Vervaldatum',
        description: 'Omschrijving',
        quantity: 'Aantal',
        price: 'Prijs',
        amount: 'Bedrag',
        subtotal: 'Subtotaal',
        discount: 'Korting',
        tax: 'BTW',
        total: 'Totaal',
        totalDue: 'Te Betalen',
        notes: 'Opmerkingen',
        terms: 'Voorwaarden',
        paymentInfo: 'Betalingsinformatie',
        thankYou: 'Bedankt voor uw vertrouwen!',
        details: 'Details',
        date: 'Datum',
        due: 'Vervalt',
        unitPrice: 'Eenheidsprijs',
        itemDescription: 'Artikelomschrijving'
    },
    ja: {
        invoice: '請求書',
        billTo: '請求先',
        from: '送付元',
        to: '宛先',
        invoiceNumber: '請求書番号',
        invoiceDate: '請求日',
        dueDate: '支払期限',
        description: '品目',
        quantity: '数量',
        price: '単価',
        amount: '金額',
        subtotal: '小計',
        discount: '割引',
        tax: '消費税',
        total: '合計',
        totalDue: 'お支払い金額',
        notes: '備考',
        terms: '備考・条件',
        paymentInfo: 'お支払い情報',
        thankYou: 'ありがとうございました',
        details: '詳細',
        date: '日付',
        due: '期限',
        unitPrice: '単価',
        itemDescription: '品目説明'
    },
    zh: {
        invoice: '发票',
        billTo: '收票人',
        from: '发票方',
        to: '收票方',
        invoiceNumber: '发票编号',
        invoiceDate: '开票日期',
        dueDate: '到期日期',
        description: '描述',
        quantity: '数量',
        price: '单价',
        amount: '金额',
        subtotal: '小计',
        discount: '折扣',
        tax: '税费',
        total: '总计',
        totalDue: '应付金额',
        notes: '备注',
        terms: '条款与备注',
        paymentInfo: '付款信息',
        thankYou: '感谢您的惠顾！',
        details: '详情',
        date: '日期',
        due: '到期',
        unitPrice: '单价',
        itemDescription: '项目描述'
    },
    ar: {
        invoice: 'فاتورة',
        billTo: 'فاتورة إلى',
        from: 'من',
        to: 'إلى',
        invoiceNumber: 'رقم الفاتورة',
        invoiceDate: 'تاريخ الفاتورة',
        dueDate: 'تاريخ الاستحقاق',
        description: 'الوصف',
        quantity: 'الكمية',
        price: 'السعر',
        amount: 'المبلغ',
        subtotal: 'المجموع الفرعي',
        discount: 'الخصم',
        tax: 'الضريبة',
        total: 'المجموع',
        totalDue: 'المبلغ المستحق',
        notes: 'ملاحظات',
        terms: 'الشروط والملاحظات',
        paymentInfo: 'معلومات الدفع',
        thankYou: 'شكراً لتعاملكم معنا!',
        details: 'التفاصيل',
        date: 'التاريخ',
        due: 'الاستحقاق',
        unitPrice: 'سعر الوحدة',
        itemDescription: 'وصف العنصر'
    }
};

// Get translation for current language
function t(key) {
    const lang = elements.language?.value || 'en';
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
}

// Get locale for date formatting
function getLocale() {
    const localeMap = {
        en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE',
        pt: 'pt-BR', it: 'it-IT', nl: 'nl-NL', ja: 'ja-JP',
        zh: 'zh-CN', ar: 'ar-SA'
    };
    const lang = elements.language?.value || 'en';
    return localeMap[lang] || 'en-US';
}

// Application State
const state = {
    items: [],
    currentInvoice: null,
    selectedTemplate: 'modern',
    accentColor: '#4F46E5'
};

// DOM Elements
const elements = {
    // Invoice Settings
    invoiceNumber: document.getElementById('invoiceNumber'),
    invoiceDate: document.getElementById('invoiceDate'),
    dueDate: document.getElementById('dueDate'),
    invoiceStatus: document.getElementById('invoiceStatus'),
    language: document.getElementById('language'),
    currency: document.getElementById('currency'),
    template: document.getElementById('template'),
    accentColor: document.getElementById('accentColor'),
    
    // Business Details
    businessName: document.getElementById('businessName'),
    businessAddress: document.getElementById('businessAddress'),
    businessEmail: document.getElementById('businessEmail'),
    businessPhone: document.getElementById('businessPhone'),
    businessLogo: document.getElementById('businessLogo'),
    
    // Client Details
    clientName: document.getElementById('clientName'),
    clientAddress: document.getElementById('clientAddress'),
    clientEmail: document.getElementById('clientEmail'),
    clientPhone: document.getElementById('clientPhone'),
    poNumber: document.getElementById('poNumber'),
    shippingAddress: document.getElementById('shippingAddress'),
    
    // Tax & Discount
    taxRate: document.getElementById('taxRate'),
    taxName: document.getElementById('taxName'),
    discountType: document.getElementById('discountType'),
    discountValue: document.getElementById('discountValue'),
    
    // Signature & Stamp
    signatureUrl: document.getElementById('signatureUrl'),
    stampUrl: document.getElementById('stampUrl'),
    signatureName: document.getElementById('signatureName'),
    signatureTitle: document.getElementById('signatureTitle'),
    
    // Notes
    notes: document.getElementById('notes'),
    paymentInfo: document.getElementById('paymentInfo'),
    
    // Containers
    itemsContainer: document.getElementById('itemsContainer'),
    invoicePreview: document.getElementById('invoicePreview'),
    
    // Buttons
    addItemBtn: document.getElementById('addItemBtn'),
    newInvoiceBtn: document.getElementById('newInvoiceBtn'),
    loadInvoiceBtn: document.getElementById('loadInvoiceBtn'),
    saveInvoiceBtn: document.getElementById('saveInvoiceBtn'),
    printInvoiceBtn: document.getElementById('printInvoiceBtn'),
    downloadPdfBtn: document.getElementById('downloadPdfBtn'),
    duplicateInvoiceBtn: document.getElementById('duplicateInvoiceBtn'),
    mobilePreviewToggle: document.getElementById('mobilePreviewToggle'),
    
    // Modal
    savedInvoicesModal: document.getElementById('savedInvoicesModal'),
    savedInvoicesList: document.getElementById('savedInvoicesList'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    
    // Sidebar
    sidebar: document.querySelector('.sidebar'),
    menuToggle: document.getElementById('menuToggle'),
    sidebarOverlay: document.getElementById('sidebarOverlay'),
    
    // Toast
    toast: document.getElementById('toast')
};

// Initialize Application
function init() {
    setDefaultDates();
    generateInvoiceNumber();
    attachEventListeners();
    
    // Check if loading a specific invoice from URL
    const urlParams = new URLSearchParams(window.location.search);
    const loadInvoiceId = urlParams.get('load') || urlParams.get('edit');
    const shouldDownload = urlParams.get('download') === 'true';
    const clientId = urlParams.get('client');
    
    if (loadInvoiceId) {
        loadInvoiceFromId(loadInvoiceId, shouldDownload);
    } else if (clientId) {
        loadClientForNewInvoice(clientId);
    } else {
        loadSavedBusinessDetails();
        
        // Add a blank item only if no demo data was loaded
        if (state.items.length === 0) {
            addItem();
        }
    }
    
    updatePreview();
}

// Load client data for new invoice
function loadClientForNewInvoice(clientId) {
    // Try from sessionStorage first (set by clients page)
    let client = JSON.parse(sessionStorage.getItem('selectedClient'));
    
    if (!client) {
        // Load from clients in localStorage
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        client = clients.find(c => c.id === clientId || c.id === decodeURIComponent(clientId));
    }
    
    if (client) {
        elements.clientName.value = client.name || '';
        elements.clientEmail.value = client.email || '';
        elements.clientPhone.value = client.phone || '';
        elements.clientAddress.value = client.address || '';
        if (elements.poNumber) elements.poNumber.value = '';
        if (elements.shippingAddress) elements.shippingAddress.value = '';
        
        // Clear sessionStorage
        sessionStorage.removeItem('selectedClient');
        
        loadSavedBusinessDetails();
        if (state.items.length === 0) {
            addItem();
        }
        showToast('Client loaded for new invoice', 'success');
    } else {
        loadSavedBusinessDetails();
        if (state.items.length === 0) {
            addItem();
        }
    }
}

// Load invoice from ID (from URL parameter)
function loadInvoiceFromId(invoiceId, shouldDownload = false) {
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    const invoice = invoices.find(inv => 
        inv.id === invoiceId || 
        inv.invoiceNumber === invoiceId || 
        inv.id === decodeURIComponent(invoiceId) ||
        inv.invoiceNumber === decodeURIComponent(invoiceId) ||
        String(inv.id) === invoiceId ||
        String(inv.id) === decodeURIComponent(invoiceId)
    );
    
    if (invoice) {
        loadInvoice(invoice);
        showToast('Invoice loaded successfully', 'success');
        
        // If download requested, trigger it after a short delay
        if (shouldDownload) {
            setTimeout(() => {
                downloadPDF();
            }, 500);
        }
    } else {
        loadSavedBusinessDetails();
        if (state.items.length === 0) {
            addItem();
        }
        showToast('Invoice not found', 'error');
    }
}

// Set default dates
function setDefaultDates() {
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + 30);
    
    elements.invoiceDate.value = formatDateForInput(today);
    elements.dueDate.value = formatDateForInput(dueDate);
}

// Format date for input field
function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
}

// Generate unique invoice number
function generateInvoiceNumber() {
    const prefix = 'INV';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    elements.invoiceNumber.value = `${prefix}-${timestamp.slice(-4)}${random}`;
}

// Attach event listeners
function attachEventListeners() {
    // Form inputs - update preview on change
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', debounce(updatePreview, 300));
        input.addEventListener('change', updatePreview);
    });
    
    // Template and color changes
    elements.template.addEventListener('change', () => {
        state.selectedTemplate = elements.template.value;
        updatePreview();
    });
    
    elements.accentColor.addEventListener('input', () => {
        state.accentColor = elements.accentColor.value;
        updatePreview();
    });
    
    // Button actions
    elements.addItemBtn.addEventListener('click', () => addItem());
    elements.newInvoiceBtn.addEventListener('click', newInvoice);
    elements.loadInvoiceBtn.addEventListener('click', openSavedInvoicesModal);
    elements.saveInvoiceBtn.addEventListener('click', saveInvoice);
    elements.printInvoiceBtn.addEventListener('click', printInvoice);
    elements.downloadPdfBtn.addEventListener('click', downloadPDF);
    elements.duplicateInvoiceBtn.addEventListener('click', duplicateInvoice);
    
    // Mobile preview toggle
    elements.mobilePreviewToggle.addEventListener('click', toggleMobilePreview);
    
    // Sidebar toggle for mobile
    if (elements.menuToggle) {
        elements.menuToggle.addEventListener('click', toggleSidebar);
    }
    
    // Sidebar overlay click to close
    if (elements.sidebarOverlay) {
        elements.sidebarOverlay.addEventListener('click', toggleSidebar);
    }
    
    // Modal
    elements.closeModalBtn.addEventListener('click', closeSavedInvoicesModal);
    elements.savedInvoicesModal.addEventListener('click', (e) => {
        if (e.target === elements.savedInvoicesModal) {
            closeSavedInvoicesModal();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Debounce function for performance
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

// Add new invoice item
function addItem(itemData = null) {
    const itemId = Date.now() + Math.random();
    const item = {
        id: itemData?.id || itemId,
        description: itemData?.description || '',
        quantity: parseFloat(itemData?.quantity) || 1,
        price: parseFloat(itemData?.price) || 0
    };
    
    state.items.push(item);
    renderItem(item, state.items.length);
    updatePreview();
}

// Render single item
function renderItem(item, index) {
    const itemElement = document.createElement('div');
    itemElement.className = 'invoice-item fade-in';
    itemElement.dataset.itemId = item.id;
    
    itemElement.innerHTML = `
        <div class="item-header">
            <span class="item-number">Item ${index}</span>
            <button type="button" class="remove-item-btn" title="Remove item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
        <div class="item-fields">
            <div class="form-group item-description">
                <label>Description</label>
                <input type="text" class="item-desc-input" placeholder="Item or service description" value="${escapeHtml(item.description)}">
            </div>
            <div class="item-row">
                <div class="form-group">
                    <label>Quantity</label>
                    <input type="number" class="item-qty-input" min="0" step="1" value="${item.quantity}">
                </div>
                <div class="form-group">
                    <label>Price</label>
                    <input type="number" class="item-price-input" min="0" step="0.01" value="${item.price}">
                </div>
                <div class="form-group">
                    <label>Total</label>
                    <div class="item-total">${formatCurrency(item.quantity * item.price)}</div>
                </div>
            </div>
        </div>
    `;
    
    // Attach item event listeners
    const descInput = itemElement.querySelector('.item-desc-input');
    const qtyInput = itemElement.querySelector('.item-qty-input');
    const priceInput = itemElement.querySelector('.item-price-input');
    const removeBtn = itemElement.querySelector('.remove-item-btn');
    
    descInput.addEventListener('input', () => {
        updateItemData(item.id, 'description', descInput.value);
    });
    
    qtyInput.addEventListener('input', () => {
        updateItemData(item.id, 'quantity', parseFloat(qtyInput.value) || 0);
        updateItemTotal(itemElement);
    });
    
    priceInput.addEventListener('input', () => {
        updateItemData(item.id, 'price', parseFloat(priceInput.value) || 0);
        updateItemTotal(itemElement);
    });
    
    removeBtn.addEventListener('click', () => {
        removeItem(item.id);
    });
    
    elements.itemsContainer.appendChild(itemElement);
}

// Update item data in state
function updateItemData(itemId, field, value) {
    const item = state.items.find(i => i.id === itemId);
    if (item) {
        item[field] = value;
        updatePreview();
    }
}

// Update item total display
function updateItemTotal(itemElement) {
    const qty = parseFloat(itemElement.querySelector('.item-qty-input').value) || 0;
    const price = parseFloat(itemElement.querySelector('.item-price-input').value) || 0;
    const totalElement = itemElement.querySelector('.item-total');
    totalElement.textContent = formatCurrency(qty * price);
}

// Remove item
function removeItem(itemId) {
    if (state.items.length <= 1) {
        showToast('You need at least one item', 'error');
        return;
    }
    
    state.items = state.items.filter(i => i.id !== itemId);
    const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
    if (itemElement) {
        itemElement.remove();
    }
    
    // Re-number items
    renumberItems();
    updatePreview();
}

// Renumber items after removal
function renumberItems() {
    const itemElements = elements.itemsContainer.querySelectorAll('.invoice-item');
    itemElements.forEach((el, index) => {
        el.querySelector('.item-number').textContent = `Item ${index + 1}`;
    });
}

// Format currency
function formatCurrency(amount, currencyCode = null) {
    const code = currencyCode || elements.currency.value;
    const currency = CURRENCIES[code];
    const decimals = currency.decimals !== undefined ? currency.decimals : 2;
    
    try {
        return new Intl.NumberFormat(currency.locale, {
            style: 'currency',
            currency: code,
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(amount);
    } catch (e) {
        return `${currency.symbol}${amount.toFixed(decimals)}`;
    }
}

// Calculate invoice totals
function calculateTotals() {
    const subtotal = state.items.reduce((sum, item) => {
        return sum + (item.quantity * item.price);
    }, 0);
    
    const discountType = elements.discountType.value;
    const discountValue = parseFloat(elements.discountValue.value) || 0;
    
    let discount = 0;
    if (discountType === 'percentage') {
        discount = subtotal * (discountValue / 100);
    } else if (discountType === 'fixed') {
        discount = discountValue;
    }
    
    const afterDiscount = subtotal - discount;
    const taxRate = parseFloat(elements.taxRate.value) || 0;
    const tax = afterDiscount * (taxRate / 100);
    const total = afterDiscount + tax;
    
    return {
        subtotal,
        discount,
        discountType,
        discountValue,
        afterDiscount,
        taxRate,
        tax,
        total
    };
}

// Get invoice data
function getInvoiceData() {
    const totals = calculateTotals();
    const lang = elements.language.value;
    
    return {
        // Settings
        invoiceNumber: elements.invoiceNumber.value,
        invoiceDate: elements.invoiceDate.value,
        dueDate: elements.dueDate.value,
        invoiceStatus: elements.invoiceStatus?.value || 'draft',
        language: lang,
        locale: getLocale(),
        translations: TRANSLATIONS[lang] || TRANSLATIONS.en,
        currency: elements.currency.value,
        template: elements.template.value,
        accentColor: elements.accentColor.value,
        
        // Business
        businessName: elements.businessName.value,
        businessAddress: elements.businessAddress.value,
        businessEmail: elements.businessEmail.value,
        businessPhone: elements.businessPhone.value,
        businessLogo: elements.businessLogo.value,
        
        // Client
        clientName: elements.clientName.value,
        clientAddress: elements.clientAddress.value,
        clientEmail: elements.clientEmail.value,
        clientPhone: elements.clientPhone.value,
        poNumber: elements.poNumber?.value || '',
        shippingAddress: elements.shippingAddress?.value || '',
        
        // Items
        items: state.items,
        
        // Tax & Discount
        taxRate: elements.taxRate.value,
        taxName: elements.taxName.value,
        discountType: elements.discountType.value,
        discountValue: elements.discountValue.value,
        
        // Totals
        ...totals,
        
        // Signature & Stamp
        signatureUrl: elements.signatureUrl?.value || '',
        stampUrl: elements.stampUrl?.value || '',
        signatureName: elements.signatureName?.value || '',
        signatureTitle: elements.signatureTitle?.value || '',
        
        // Notes
        notes: elements.notes.value,
        paymentInfo: elements.paymentInfo.value,
        
        // Meta
        createdAt: new Date().toISOString(),
        id: state.currentInvoice?.id || Date.now()
    };
}

// Update invoice preview
function updatePreview() {
    const data = getInvoiceData();
    const template = TEMPLATES[data.template] || TEMPLATES.modern;
    elements.invoicePreview.innerHTML = template(data, formatCurrency);
}

// Save invoice to localStorage
function saveInvoice() {
    const data = getInvoiceData();
    const savedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    
    // Check if updating existing invoice
    const existingIndex = savedInvoices.findIndex(inv => inv.id === data.id);
    if (existingIndex >= 0) {
        savedInvoices[existingIndex] = data;
    } else {
        savedInvoices.push(data);
    }
    
    localStorage.setItem('invoices', JSON.stringify(savedInvoices));
    saveBusinessDetails();
    
    state.currentInvoice = data;
    showToast('Invoice saved successfully!', 'success');
}

// Save business details for reuse
function saveBusinessDetails() {
    const businessDetails = {
        businessName: elements.businessName.value,
        businessAddress: elements.businessAddress.value,
        businessEmail: elements.businessEmail.value,
        businessPhone: elements.businessPhone.value,
        businessLogo: elements.businessLogo.value
    };
    localStorage.setItem('businessDetails', JSON.stringify(businessDetails));
}

// Demo company data
const DEMO_DATA = {
    business: {
        businessName: 'Nexus Digital Solutions',
        businessAddress: '1250 Innovation Drive, Suite 400\nSan Francisco, CA 94107\nUnited States',
        businessEmail: 'billing@nexusdigital.io',
        businessPhone: '+1 (415) 555-0198',
        businessLogo: 'https://img.logoipsum.com/297.svg'
    },
    client: {
        clientName: 'Horizon Technologies Inc.',
        clientAddress: '888 Enterprise Boulevard\nAustin, TX 78701\nUnited States',
        clientEmail: 'accounts@horizontech.com',
        clientPhone: '+1 (512) 555-0234'
    },
    items: [
        { id: 1, description: 'Website Design & Development - E-commerce Platform', quantity: 1, price: 4500 },
        { id: 2, description: 'Custom API Integration Services', quantity: 8, price: 150 },
        { id: 3, description: 'UI/UX Design Consultation (hours)', quantity: 12, price: 95 },
        { id: 4, description: 'Monthly Hosting & Maintenance Package', quantity: 3, price: 199 }
    ],
    settings: {
        taxRate: 8.25,
        taxName: 'Sales Tax',
        notes: 'Payment is due within 30 days of invoice date.\nLate payments may incur a 1.5% monthly fee.\n\nThank you for choosing Nexus Digital Solutions!',
        paymentInfo: 'Bank: First National Bank\nAccount Name: Nexus Digital Solutions LLC\nAccount Number: 4829-7156-3302\nRouting: 021000089\n\nOr pay via PayPal: payments@nexusdigital.io'
    }
};

// Load saved business details
function loadSavedBusinessDetails() {
    const saved = localStorage.getItem('businessDetails');
    if (saved) {
        const details = JSON.parse(saved);
        elements.businessName.value = details.businessName || '';
        elements.businessAddress.value = details.businessAddress || '';
        elements.businessEmail.value = details.businessEmail || '';
        elements.businessPhone.value = details.businessPhone || '';
        elements.businessLogo.value = details.businessLogo || '';
    } else {
        // Load demo data if no saved data exists
        loadDemoData();
    }
}

// Load demo data for first-time users
function loadDemoData() {
    // Business details
    elements.businessName.value = DEMO_DATA.business.businessName;
    elements.businessAddress.value = DEMO_DATA.business.businessAddress;
    elements.businessEmail.value = DEMO_DATA.business.businessEmail;
    elements.businessPhone.value = DEMO_DATA.business.businessPhone;
    elements.businessLogo.value = DEMO_DATA.business.businessLogo;
    
    // Client details
    elements.clientName.value = DEMO_DATA.client.clientName;
    elements.clientAddress.value = DEMO_DATA.client.clientAddress;
    elements.clientEmail.value = DEMO_DATA.client.clientEmail;
    elements.clientPhone.value = DEMO_DATA.client.clientPhone;
    
    // Tax and notes
    elements.taxRate.value = DEMO_DATA.settings.taxRate;
    elements.taxName.value = DEMO_DATA.settings.taxName;
    elements.notes.value = DEMO_DATA.settings.notes;
    elements.paymentInfo.value = DEMO_DATA.settings.paymentInfo;
    
    // Clear default item and load demo items
    state.items = [];
    elements.itemsContainer.innerHTML = '';
    DEMO_DATA.items.forEach(item => {
        addItem({ ...item, id: Date.now() + Math.random() });
    });
}

// Load invoice from saved data
function loadInvoice(invoiceData) {
    // Settings
    elements.invoiceNumber.value = invoiceData.invoiceNumber || '';
    elements.invoiceDate.value = invoiceData.invoiceDate || '';
    elements.dueDate.value = invoiceData.dueDate || '';
    if (elements.invoiceStatus) {
        elements.invoiceStatus.value = invoiceData.invoiceStatus || invoiceData.status || 'draft';
    }
    elements.language.value = invoiceData.language || 'en';
    elements.currency.value = invoiceData.currency || 'INR';
    elements.template.value = invoiceData.template || 'modern';
    elements.accentColor.value = invoiceData.accentColor || '#4F46E5';
    
    // Business
    elements.businessName.value = invoiceData.businessName || '';
    elements.businessAddress.value = invoiceData.businessAddress || '';
    elements.businessEmail.value = invoiceData.businessEmail || '';
    elements.businessPhone.value = invoiceData.businessPhone || '';
    elements.businessLogo.value = invoiceData.businessLogo || '';
    
    // Client
    elements.clientName.value = invoiceData.clientName || '';
    elements.clientAddress.value = invoiceData.clientAddress || '';
    elements.clientEmail.value = invoiceData.clientEmail || '';
    elements.clientPhone.value = invoiceData.clientPhone || '';
    if (elements.poNumber) {
        elements.poNumber.value = invoiceData.poNumber || '';
    }
    if (elements.shippingAddress) {
        elements.shippingAddress.value = invoiceData.shippingAddress || '';
    }
    
    // Tax & Discount
    elements.taxRate.value = invoiceData.taxRate || '';
    elements.taxName.value = invoiceData.taxName || '';
    elements.discountType.value = invoiceData.discountType || 'none';
    elements.discountValue.value = invoiceData.discountValue || '';
    
    // Notes
    elements.notes.value = invoiceData.notes || '';
    elements.paymentInfo.value = invoiceData.paymentInfo || '';
    
    // Signature & Stamp
    if (elements.signatureUrl) {
        elements.signatureUrl.value = invoiceData.signatureUrl || '';
    }
    if (elements.stampUrl) {
        elements.stampUrl.value = invoiceData.stampUrl || '';
    }
    if (elements.signatureName) {
        elements.signatureName.value = invoiceData.signatureName || '';
    }
    if (elements.signatureTitle) {
        elements.signatureTitle.value = invoiceData.signatureTitle || '';
    }
    
    // Items
    state.items = [];
    elements.itemsContainer.innerHTML = '';
    
    if (invoiceData.items && invoiceData.items.length > 0) {
        invoiceData.items.forEach((item, index) => {
            addItem(item);
        });
    } else {
        addItem();
    }
    
    // Update state
    state.selectedTemplate = invoiceData.template || 'modern';
    state.accentColor = invoiceData.accentColor || '#4F46E5';
    state.currentInvoice = invoiceData;
    
    updatePreview();
    
    // Only close modal if it's open
    if (elements.savedInvoicesModal && elements.savedInvoicesModal.classList.contains('active')) {
        closeSavedInvoicesModal();
    }
}

// Open saved invoices modal
function openSavedInvoicesModal() {
    const savedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    
    if (savedInvoices.length === 0) {
        elements.savedInvoicesList.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <p>No saved invoices yet</p>
            </div>
        `;
    } else {
        elements.savedInvoicesList.innerHTML = savedInvoices.map(invoice => `
            <div class="saved-invoice-item">
                <div class="saved-invoice-info">
                    <h4>${escapeHtml(invoice.invoiceNumber || 'Untitled')}</h4>
                    <p>${escapeHtml(invoice.clientName || 'No client')} • ${formatCurrency(invoice.total || 0, invoice.currency)}</p>
                    <p>${formatDate(invoice.createdAt)}</p>
                </div>
                <div class="saved-invoice-actions">
                    <button class="btn btn-secondary" onclick="loadInvoice(${JSON.stringify(invoice).replace(/"/g, '&quot;')})">Load</button>
                    <button class="btn btn-danger" onclick="deleteInvoice(${invoice.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }
    
    elements.savedInvoicesModal.classList.add('active');
}

// Close saved invoices modal
function closeSavedInvoicesModal() {
    elements.savedInvoicesModal.classList.remove('active');
}

// Delete saved invoice
function deleteInvoice(invoiceId) {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    
    const savedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const filtered = savedInvoices.filter(inv => inv.id !== invoiceId);
    localStorage.setItem('invoices', JSON.stringify(filtered));
    
    openSavedInvoicesModal(); // Refresh the list
    showToast('Invoice deleted', 'success');
}

// Create new invoice
function newInvoice() {
    if (!confirm('Create a new invoice? Any unsaved changes will be lost.')) return;
    
    // Reset form
    document.querySelectorAll('input:not([type="color"]), textarea').forEach(el => {
        if (el.type === 'date') return;
        el.value = '';
    });
    
    // Reset items
    state.items = [];
    elements.itemsContainer.innerHTML = '';
    
    // Reset state
    state.currentInvoice = null;
    
    // Re-initialize
    setDefaultDates();
    generateInvoiceNumber();
    loadSavedBusinessDetails();
    addItem();
    updatePreview();
    
    showToast('New invoice created', 'success');
}

// Download PDF
async function downloadPDF() {
    const previewContent = elements.invoicePreview;
    const invoiceNumber = elements.invoiceNumber.value || 'invoice';
    
    // Show loading
    showToast('Generating PDF...', 'info');
    
    const opt = {
        margin: 0,
        filename: `${invoiceNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            letterRendering: true,
            logging: false
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait'
        }
    };
    
    try {
        await html2pdf().set(opt).from(previewContent).save();
        showToast('PDF downloaded successfully!', 'success');
    } catch (error) {
        console.error('PDF generation failed:', error);
        showToast('Failed to generate PDF', 'error');
    }
}

// Duplicate invoice
function duplicateInvoice() {
    const currentData = getInvoiceData();
    
    // Generate new invoice number
    const newNumber = 'INV-' + Date.now().toString(36).toUpperCase().slice(-6);
    
    // Set new data
    elements.invoiceNumber.value = newNumber;
    setDefaultDates();
    
    // Clear current invoice reference (so it saves as new)
    state.currentInvoice = null;
    
    updatePreview();
    showToast('Invoice duplicated. Update and save as new.', 'success');
}

// Print invoice
function printInvoice() {
    window.print();
}

// Toggle sidebar for mobile
function toggleSidebar() {
    if (elements.sidebar) {
        elements.sidebar.classList.toggle('active');
        if (elements.sidebarOverlay) {
            elements.sidebarOverlay.classList.toggle('active');
        }
    }
}

// Toggle mobile preview
function toggleMobilePreview() {
    const previewPanel = document.querySelector('.preview-panel');
    previewPanel.classList.toggle('mobile-active');
    
    const isActive = previewPanel.classList.contains('mobile-active');
    elements.mobilePreviewToggle.innerHTML = isActive ? `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        Close Preview
    ` : `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        </svg>
        Preview Invoice
    `;
}

// Keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + S - Save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveInvoice();
    }
    
    // Ctrl/Cmd + P - Print
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        printInvoice();
    }
    
    // Ctrl/Cmd + D - Download PDF
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        downloadPDF();
    }
    
    // Escape - Close modal
    if (e.key === 'Escape') {
        closeSavedInvoicesModal();
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = elements.toast;
    toast.querySelector('.toast-message').textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
